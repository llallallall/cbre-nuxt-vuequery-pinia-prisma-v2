import { defineEventHandler, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';

export default defineEventHandler(async (event) => {
        const { transactionId } = getRouterParams(event);

        if (!transactionId) {
                throw createError({ statusCode: 400, statusMessage: 'Transaction ID is required.' });
        }

        try {
                // Transaction만 삭제하면 연결된 Lease도 삭제됨 (Cascade 설정 가정)
                await prisma.transaction.delete({
                        where: { id: transactionId },
                });

                return { status: 'success', message: 'Lease transaction deleted.' };

        } catch (error: any) {
                console.error('Lease Delete Error:', error);

                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                        throw createError({ statusCode: 404, statusMessage: 'Transaction not found.' });
                }

                throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to delete lease transaction.',
                        data: error.message
                });
        }
});