// server/api/upload/[propertyId]/sale/[transactionId].put.ts

import { defineEventHandler, readBody, createError } from 'h3';
import { PrismaClient } from '@prisma/client';
import { TransactionInfoType } from '~/types/asset.type'; // TransactionInfoType 정의가 있다고 가정

// Prisma 클라이언트가 전역적으로 초기화되어 있다고 가정
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
        // 1. URL 파라미터 및 요청 본문 읽기
        // 💡 [수정] propertyId를 event.context.params?.id에서 가져오는 것으로 변경 (사용자 수정 반영)
        const propertyId = event.context.params?.id as string;
        const transactionId = event.context.params?.transactionId as string;
        const payload = await readBody(event);

        console.log("PUT Payload:", payload);

        const { date, saleType, year } = payload || {};

        // 2. 필수 데이터 검증
        if (!propertyId || !transactionId || !date || !saleType || !year) {
                throw createError({
                        statusCode: 400,
                        statusMessage: 'Bad Request: Missing required data (Date, Year, Sale Type) for update.',
                });
        }

        try {
                // 3. Transaction 및 Sale 데이터 준비
                const transactionUpdateData = {
                        year: payload.year,
                        quarter: payload.quarter,
                        date: new Date(payload.date), // DateTime 변환
                };

                const saleUpdateData = {
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

                // 4. Prisma 트랜잭션 실행
                const result = await prisma.$transaction(async (tx) => {
                        await tx.transaction.update({
                                where: { id: transactionId, property_id: propertyId },
                                data: transactionUpdateData,
                        });

                        const updatedSale = await tx.sale.update({
                                where: { transaction_id: transactionId },
                                data: saleUpdateData,
                                include: {
                                        Transaction: true,
                                }
                        });

                        return updatedSale;
                });

                // 5. 프론트엔드에서 사용하기 쉽도록 응답 데이터를 정제
                const updatedRecord: TransactionInfoType = {
                        // 1. Transaction (부모) 필드 매핑
                        id: result.Transaction!.id,
                        propertyId: result.Transaction!.property_id,
                        type: result.Transaction!.type, // 'SALE'
                        year: result.Transaction!.year,

                        // 🚨 [핵심 수정] TypeScript 오류 해결: 'quarter' 필드 추가
                        quarter: result.Transaction!.quarter,

                        date: result.Transaction!.date,

                        // 2. Sale Detail (자식) 필드 매핑
                        saleDetail: {
                                saleId: result.id,
                                transactionId: result.transaction_id,
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
                                year: result.Transaction!.year,
                                quarter: result.Transaction!.quarter,
                                executionDate: result.Transaction!.date.toISOString().substring(0, 10),
                        },

                        // 3. Lease Detail은 SALE 트랜잭션이므로 null 처리
                        leaseDetail: null,
                };

                return updatedRecord;

        } catch (error) {
                console.error("Sale PUT API Error:", error);
                throw createError({
                        statusCode: 500,
                        statusMessage: 'Internal Server Error during sale record update.',
                });
        }
});