import { defineEventHandler, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';

export default defineEventHandler(async (event) => {
        const { transactionId } = getRouterParams(event);

        try {
                await prisma.transaction.delete({
                        where: { id: transactionId },
                });
                return { status: 'success' };
        } catch (error: any) {
                throw createError({ statusCode: 500, statusMessage: 'Failed to delete sale.', data: error.message });
        }
});