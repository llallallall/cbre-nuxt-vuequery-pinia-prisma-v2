import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { TransactionType } from '@prisma/client';
import type { SaleCreatePayload } from '~/types/property.type';
import { mapSaleDetailFromClientToPrisma, toDateOrNull } from '~/utils/transactionMapper';

export default defineEventHandler(async (event) => {
        const { id: propertyId } = getRouterParams(event);
        const body = await readBody<SaleCreatePayload>(event);

        if (!propertyId || !body.year || !body.executionDate) {
                throw createError({ statusCode: 400, statusMessage: 'Missing required fields.' });
        }

        try {
                const newTransaction = await prisma.transaction.create({
                        data: {
                                property_id: propertyId,
                                type: TransactionType.SALE,
                                year: body.year,
                                quarter: body.quarter,
                                execution_date: toDateOrNull(body.executionDate) as Date,

                                sale: {
                                        create: mapSaleDetailFromClientToPrisma(body) // 💡 매퍼 사용
                                }
                        },
                        include: { sale: true }
                });
                return newTransaction;
        } catch (error: any) {
                throw createError({ statusCode: 500, statusMessage: 'Failed to create sale.', data: error.message });
        }
});