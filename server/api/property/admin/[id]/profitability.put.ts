// server/api/property/[id]/profitability.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import type { ProfitabilityType } from '~/types/property.type';

// 프론트엔드 Payload (ProfitabilityType)
type ProfitabilityUpdatePayload = {
    profitability: ProfitabilityType;
};

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    // 폼에서 { profitability: { ... } } 형태로 보내는지, 아니면 { ... } 바로 보내는지 확인 필요
    // 제공해주신 Profitability.vue에서는 { propertyId, profitability: { ... } } 형태로 보냄
    const body = await readBody<ProfitabilityUpdatePayload>(event);

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    const data = body.profitability;

    try {
        // Profitability 테이블에 직접 Upsert
        const updated = await prisma.profitability.upsert({
            where: { property_id: propertyId },
            update: {
                grade: data.grade,
                effective_ratio: data.effectiveRatio, // effRatio -> effectiveRatio (Type 일치)
            },
            create: {
                property_id: propertyId,
                grade: data.grade,
                effective_ratio: data.effectiveRatio,
            },
        });

        // 결과 반환
        return {
            grade: updated.grade,
            effectiveRatio: updated.effective_ratio, // DB snake_case -> FE camelCase
        };

    } catch (e: any) {
        console.error('Profitability Update Error:', e);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update profitability info.',
            data: e.message
        });
    }
});