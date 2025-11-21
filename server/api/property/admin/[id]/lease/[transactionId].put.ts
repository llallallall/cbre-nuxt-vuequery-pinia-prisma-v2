import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma, TransactionType } from '@prisma/client';
import type { LeaseCreatePayload } from '~/types/property.type';
// 💡 유틸리티 임포트
import { mapLeaseDetailFromClientToPrisma, toDateOrNull } from '~/utils/transactionMapper';

export default defineEventHandler(async (event) => {
        const { transactionId } = getRouterParams(event);
        const body = await readBody<LeaseCreatePayload>(event);

        if (!transactionId) {
                throw createError({ statusCode: 400, statusMessage: 'Transaction ID is required.' });
        }

        try {
                await prisma.$transaction(async (tx) => {

                        // 1. Transaction 업데이트 (기본 정보)
                        await tx.transaction.update({
                                where: { id: transactionId, type: TransactionType.LEASE },
                                data: {
                                        year: body.year,
                                        quarter: body.quarter,
                                        // 💡 유틸리티 사용
                                        execution_date: toDateOrNull(body.executionDate) as Date,
                                }
                        });

                        // 2. Lease 상세 정보 업데이트
                        await tx.lease.update({
                                where: { transaction_id: transactionId },
                                // 💡 유틸리티 사용: 훨씬 깔끔해진 코드
                                data: mapLeaseDetailFromClientToPrisma(body)
                        });
                });

                return { message: 'Lease updated successfully', id: transactionId };

        } catch (error: any) {
                console.error('Lease Update Error:', error);

                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                        throw createError({ statusCode: 404, statusMessage: 'Transaction or Lease record not found.' });
                }

                throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to update lease transaction.',
                        data: error.message
                });
        }
});