import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { TransactionType } from '@prisma/client';
import type { SaleCreatePayload } from '~/types/property.type';
import { mapSaleDetailFromClientToPrisma, toDateOrNull } from '~/utils/transactionMapper';

export default defineEventHandler(async (event) => {
        const { transactionId } = getRouterParams(event);
        const body = await readBody<SaleCreatePayload>(event);

        try {
                await prisma.$transaction(async (tx) => {
                        await tx.transaction.update({
                                where: { id: transactionId },
                                data: {
                                        year: body.year,
                                        quarter: body.quarter,
                                        execution_date: toDateOrNull(body.executionDate) as Date,
                                }
                        });

                        await tx.sale.update({
                                where: { transaction_id: transactionId },
                                data: mapSaleDetailFromClientToPrisma(body) // 💡 매퍼 사용
                        });
                });
                return { message: 'Success', id: transactionId };
        } catch (error: any) {
                throw createError({ statusCode: 500, statusMessage: 'Failed to update sale.', data: error.message });
        }
});