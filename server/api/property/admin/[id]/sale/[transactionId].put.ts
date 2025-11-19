// server/api/upload/[propertyId]/sale/[transactionId].put.ts

import { defineEventHandler, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';
import { TransactionInfoType } from '~/types/asset.type';

// 🚨 [가정] Prisma 클라이언트가 전역적으로 초기화되어 있다고 가정
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
        // 1. URL 파라미터 및 요청 본문 읽기
        const propertyId = event.context.params?.id as string;
        const transactionId = event.context.params?.transactionId as string;
        const payload = await readBody(event);

        console.log("PUT propertyId:", propertyId);
        console.log("PUT Payload:", payload);

        // 💡 [수정 1-1] payload가 null이더라도 안전하게 필수 값 추출 (400 오류 방지)
        const { date, saleType, year } = payload || {};

        // 💡 [수정 1-2] 필수 데이터 검증: 추출된 필수 필드가 유효한지 확인합니다.
        // 클라이언트에서 보낸 데이터가 유효한데도 400 오류가 발생한다면, 이 필수 필드 중 하나가 서버에서 falsy 값으로 인식되었을 가능성이 높습니다.
        if (!propertyId || !transactionId || !date || !saleType || !year) {
                throw createError({
                        statusCode: 400,
                        statusMessage: 'Bad Request: Missing required data (Date, Year, Sale Type) for update.',
                });
        }

        try {
                // 2. Transaction 및 Sale 데이터 준비 (기존 로직 유지)
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

                // 3. 🚨 [Prisma 트랜잭션] Transaction과 Sale을 원자적으로 업데이트 (기존 로직 유지)
                const result = await prisma.$transaction(async (tx) => {
                        // 3-1. Transaction 레코드 업데이트
                        await tx.transaction.update({
                                where: { id: transactionId, property_id: propertyId },
                                data: transactionUpdateData,
                        });

                        // 3-2. Sale 레코드 업데이트 (transaction_id로 연결)
                        const updatedSale = await tx.sale.update({
                                where: { transaction_id: transactionId },
                                data: saleUpdateData,
                                include: {
                                        Transaction: true,
                                }
                        });

                        return updatedSale;

                });

                // 4. 프론트엔드에서 사용하기 쉽도록 응답 데이터를 정제
                const updatedRecord: TransactionInfoType = {
                        // 1. Transaction (부모) 필드 매핑
                        id: result.Transaction!.id,
                        propertyId: result.Transaction!.property_id,
                        type: result.Transaction!.type, // 'SALE'
                        year: result.Transaction!.year,
                        // 💡 [수정 2] TypeScript 오류 해결: TransactionInfoType에 'quarter' 필드 추가
                        quarter: result.Transaction!.quarter, // Transaction 모델에서 직접 매핑
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
                console.error("Sale PUT API Error:", error);
                throw createError({
                        statusCode: 500,
                        statusMessage: 'Internal Server Error during sale record update.',
                });
        }
});