// ~/server/api/property/profitability.put.ts

import { defineEventHandler, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';
// asset.type.ts에서 정의된 타입들을 참조
import type { ProfitabilityType, CbreAsset } from '~/types/asset.type'; 

const prisma = new PrismaClient();

// 클라이언트에서 전송되는 데이터의 타입 정의
interface ProfitabilityUpdatePayload {
    propertyId: string;
    profitability: ProfitabilityType;
}

export default defineEventHandler(async (event) => {
    // 1. Payload 추출 및 유효성 검사
    const { propertyId, profitability } = await readBody<ProfitabilityUpdatePayload>(event);

    if (!propertyId || !profitability) {
        throw createError({
            statusCode: 400,
            statusMessage: 'propertyId 또는 profitability 데이터가 누락되었습니다.',
        });
    }

    // 2. Prisma를 이용한 데이터베이스 업데이트
    try {
        const updatedAsset = await prisma.$transaction(async (tx) => {
            

            // 'Property' 모델에 'Profitability' 관계가 있고, 이를 업데이트
            await tx.property.update({
            where: { id: propertyId },
            data: {
                profitability: {
                    // 🌟 [핵심 수정: upsert 사용]
                    upsert: {
                        // 1. 레코드가 이미 존재할 때 (UPDATE)
                        update: {
                            grade: profitability.grade,
                            effective_ratio: profitability.effRatio, // 스키마 필드명 사용
                        },
                        // 2. 레코드가 존재하지 않을 때 (INSERT)
                        create: {
                            grade: profitability.grade,
                            effective_ratio: profitability.effRatio, // 스키마 필드명 사용
                            // propertyId는 관계에 의해 자동으로 연결됩니다.
                        },
                    },
                },
            },
        });
            
            
            // 업데이트 후의 전체 자산 데이터 조회 (클라이언트의 Pinia 스토어 업데이트용)
            // Pinia의 setProperty 액션에 필요한 Partial<CbreAsset> 구조로 반환하기 위해
            // 업데이트된 자산 데이터를 다시 조회합니다.
            const fetchedAsset = await tx.property.findUnique({
                where: { id: propertyId },
                // ... CbreAsset 타입을 구성하는 데 필요한 모든 관계(relation)를 include
                include: {
                    profitability: true, // 업데이트된 정보를 포함하여 조회
                    // ... 기타 필요한 조인들
                }
            });

            // 클라이언트가 Pinia 스토어를 업데이트할 수 있도록 필요한 부분만 반환
            // (여기서는 CbreAsset의 Partial 구조에 맞춥니다.)
            return {
                propertyId: fetchedAsset?.id,
                profitability: {
                    grade: fetchedAsset?.profitability?.grade,
                    effRatio: fetchedAsset?.profitability?.effective_ratio,
                }
                // ... 기타 필요한 반환 데이터
            } as Partial<CbreAsset>;

        });

        // 5. 성공적으로 업데이트된 데이터를 클라이언트에 반환
        return updatedAsset;

    } catch (e) {
        console.error('Prisma Update Error (Profitability):', e);
        // 서버 오류 발생 시 500 에러 반환
        throw createError({
            statusCode: 500,
            statusMessage: '수익성 정보 데이터베이스 업데이트에 실패했습니다.',
        });
    }
});