import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma, TransactionType, LeaseType } from '@prisma/client';

// 💡 [추가] 중앙화된 매퍼 함수와 날짜 유틸리티 임포트
import { mapLeaseDetailFromClientToPrisma, toDateOrNull } from '~/utils/transactionMapper';

// LeaseCreatePayload는 TransactionBasePayload + LeaseDetailsPayload (camelCase)를 포함한다고 가정
import type { LeaseCreatePayload } from '~/types/asset.type';

export default defineEventHandler(async (event) => {
        const params = getRouterParams(event);
        const propertyId = params.id;
        const payload: LeaseCreatePayload = await readBody(event);
        const { year, quarter, executionDate, ...leaseDetailsPayload } = payload;

        // 기본 유효성 검사
        if (!propertyId || !year || !executionDate || !payload.leaseType) {
                throw createError({ statusCode: 400, statusMessage: 'Missing required transaction/lease fields.' });
        }

        try {
                const result = await prisma.$transaction(async (tx) => {
                        // 1. Transaction 기본 정보 생성
                        const newTransaction = await tx.transaction.create({
                                data: {
                                        property_id: propertyId,
                                        type: TransactionType.LEASE,
                                        year: year,
                                        quarter: quarter,
                                        // 💡 [수정] toDateOrNull을 사용하여 날짜 변환 로직 중앙화
                                        execution_date: toDateOrNull(executionDate) as Date,
                                },
                        });

                        // 2. Lease 상세 정보 생성 및 연결 (transaction_id 포함)
                        // 💡 [수정] 중앙화된 매퍼 함수 사용
                        const leaseDetailPayload = mapLeaseDetailFromClientToPrisma(payload);

                        await tx.lease.create({
                                data: {
                                        transaction_id: newTransaction.id,
                                        // mapLeaseDetailFromClientToPrisma의 결과를 스프레드
                                        ...leaseDetailPayload,
                                        // execution_date는 Transaction에만 있으므로, detail payload에서는 제거된 상태여야 함.
                                        // leaseDetailPayload가 LeaseDetailType에만 해당하는 필드를 반환한다고 가정합니다.
                                },
                        });

                        const fullTransactionRecord = await tx.transaction.findUnique({
                                where: { id: newTransaction.id },
                                include: {
                                        lease: true, // LeaseDetailType 구조를 만들기 위해 Lease 모델을 포함
                                },
                        });

                        return fullTransactionRecord;
                });

                return result;
        } catch (e) {
                console.error('Lease creation failed:', e);
                throw createError({ statusCode: 500, statusMessage: 'Failed to create lease record.' });
        }
});