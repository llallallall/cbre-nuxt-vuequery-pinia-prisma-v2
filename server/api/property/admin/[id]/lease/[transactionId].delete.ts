import { defineEventHandler, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma, TransactionType } from '@prisma/client';

export default defineEventHandler(async (event) => {
        const params = getRouterParams(event);
        const transactionId = params.transactionId;

        if (!transactionId) {
                throw createError({ statusCode: 400, statusMessage: 'Transaction ID is missing.' });
        }

        try {
                await prisma.$transaction(async (tx) => {

                        // 1. Lease 상세 정보 삭제 (Transaction과의 외래 키 제약 조건 위반 방지)
                        await tx.lease.delete({ where: { transaction_id: transactionId } });

                        // 2. Transaction 레코드 삭제
                        await tx.transaction.delete({ where: { id: transactionId, type: TransactionType.LEASE } });
                });

                return {
                        message: `Lease transaction ${transactionId} deleted successfully.`,
                        transactionId: transactionId
                };
        } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                        throw createError({ statusCode: 404, statusMessage: 'Lease or Transaction record not found.' });
                }
                console.error('Lease deletion failed:', e);
                throw createError({ statusCode: 500, statusMessage: 'Failed to delete lease record.' });
        }
});