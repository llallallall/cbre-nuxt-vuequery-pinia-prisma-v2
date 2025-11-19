// server/api/upload/[propertyId]/sale.post.ts

import { defineEventHandler, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';
import { TransactionInfoType } from '~/types/asset.type';
// 🚨 [가정] Prisma 클라이언트가 전역적으로 초기화되어 있다고 가정
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
        // 1. URL 파라미터 및 요청 본문 읽기
        const propertyId = event.context.params?.id as string;
        const payload = await readBody(event);
        console.log("POST propertyId:", propertyId);
        console.log("POST Payload:", payload);

        if (!propertyId || !payload || !payload.date || !payload.saleType || !payload.year) {
                throw createError({
                        statusCode: 400,
                        statusMessage: 'Bad Request: Missing required data (Date, Year, Sale Type) for Transaction or Sale.',
                });
        }

        try {
                // 2. Transaction 및 Sale 데이터 준비
                const transactionData = {
                        property_id: propertyId,
                        type: 'SALE' as const, // TransactionType.SALE
                        year: payload.year,
                        quarter: payload.quarter,
                        date: new Date(payload.date), // DateTime 변환
                };

                const saleData = {
                        sale_type: payload.saleType,
                        gfa_sqm: payload.gfaSqm,
                        nfa_sqm: payload.nfaSqm,
                        price_krw: payload.priceKrw,
                        price_per_gfa: payload.pricePerGfa,
                        price_per_nfa: payload.pricePerNfa,
                        est_cap_rate: payload.estCapRate,
                        est_discount_rate: payload.estDiscountRate,
                        buyer: payload.buyer,
                        seller: payload.seller,
                        remarks: payload.remarks,
                };

                // 3. 🚨 [Prisma 트랜잭션] Transaction과 Sale을 원자적으로 생성
                const result = await prisma.$transaction(async (tx) => {
                        // 3-1. Transaction 레코드 생성
                        const newTransaction = await tx.transaction.create({
                                data: transactionData,
                        });

                        // 3-2. Sale 레코드 생성 (Transaction ID와 연결)
                        const newSale = await tx.sale.create({
                                data: {
                                        ...saleData,
                                        transaction_id: newTransaction.id,
                                },
                                include: {
                                        Transaction: true,
                                }
                        });

                        return newSale; // Sale 레코드와 연결된 Transaction 정보를 반환

                });

                // 4. 프론트엔드에서 사용하기 쉽도록 응답 데이터를 정제 (SaleDetailType 형식)
                const updatedRecord: TransactionInfoType = {
                        // 1. Transaction (부모) 필드 매핑
                        id: result.Transaction!.id,
                        propertyId: result.Transaction!.property_id,
                        type: result.Transaction!.type, // 'SALE'
                        year: result.Transaction!.year,
                        quarter: result.Transaction!.quarter,
                        date: result.Transaction!.date, // DB에서 온 Date 객체 (TypeScript Date 타입)

                        // 2. Sale Detail (자식) 필드 매핑
                        saleDetail: {
                                saleId: result.id,
                                transactionId: result.transaction_id, // Sale 모델의 FK
                                saleType: result.sale_type,
                                gfaSqm: result.gfa_sqm,
                                nfaSqm: result.nfa_sqm,
                                priceKrw: result.price_krw,
                                pricePerGfa: result.price_per_gfa,
                                pricePerNfa: result.price_per_nfa,
                                estCapRate: result.est_cap_rate,
                                estDiscountRate: result.est_discount_rate,
                                buyer: result.buyer,
                                seller: result.seller,
                                remarks: result.remarks,

                                // 💡 SaleDetailType에 중복 정의된 필드도 채워넣습니다.
                                year: result.Transaction!.year,
                                quarter: result.Transaction!.quarter,
                                // 날짜 문자열 형식으로 변환하여 executionDate에 할당
                                executionDate: result.Transaction!.date.toISOString().substring(0, 10),
                        },

                        // 3. Lease Detail은 SALE 트랜잭션이므로 null 처리
                        leaseDetail: null,
                };

                return updatedRecord;

        } catch (error) {
                console.error("Sale POST API Error:", error);
                throw createError({
                        statusCode: 500,
                        statusMessage: 'Internal Server Error during sale record creation.',
                });
        }
});