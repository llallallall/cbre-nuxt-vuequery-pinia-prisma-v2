// /server/api/property/admin/[id]/lease/index.post.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { TransactionType } from '@prisma/client';
import type { LeaseCreatePayload } from '~/types/property.type';
// 💡 유틸리티 임포트
import { mapLeaseDetailFromClientToPrisma, toDateOrNull } from '~/utils/transactionMapper';

export default defineEventHandler(async (event) => {
        const { id: propertyId } = getRouterParams(event);
        const body = await readBody<LeaseCreatePayload>(event);

        // 필수 값 검증
        if (!propertyId || !body.year || !body.executionDate || !body.leaseType) {
                throw createError({ statusCode: 400, statusMessage: 'Missing required fields.' });
        }

        try {
                // Transaction과 Lease를 한 번에 생성 (Nested Write)
                const newTransaction = await prisma.transaction.create({
                        data: {
                                property_id: propertyId,
                                type: TransactionType.LEASE,
                                year: body.year,
                                quarter: body.quarter,
                                // 💡 유틸리티 사용: 날짜 변환
                                execution_date: toDateOrNull(body.executionDate) as Date,

                                // 1:1 Lease 데이터 생성
                                lease: {
                                        // 💡 유틸리티 사용: 매핑 로직 단순화
                                        create: mapLeaseDetailFromClientToPrisma(body)
                                }
                        },
                        include: {
                                lease: true
                        }
                });

                return newTransaction;

        } catch (error: any) {
                console.error('Lease Create Error:', error);
                throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to create lease transaction.',
                        data: error.message
                });
        }
});