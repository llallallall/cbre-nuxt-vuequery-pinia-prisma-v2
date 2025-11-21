// /server/api/upload/[id]/floorplan.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { mapFloorPlanListToPrisma } from '~/utils/fileMapper';
import type { FloorPlanFileType } from '~/types/property.type';

// 클라이언트에서는 Flat List로 보냄
type FloorPlanUpdatePayload = FloorPlanFileType[];

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readBody<FloorPlanUpdatePayload>(event);

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. 기존 도면 전체 삭제
            await tx.floorPlanFile.deleteMany({
                where: { property_id: propertyId },
            });

            // 2. 새 리스트 일괄 생성
            // 매퍼 유틸리티를 사용하여 Flat List -> Prisma Input 변환
            const dataToInsert = mapFloorPlanListToPrisma(body, propertyId);

            if (dataToInsert.length > 0) {
                await tx.floorPlanFile.createMany({
                    data: dataToInsert
                });
            }
        });

        // 3. 최신 데이터 조회
        const updatedList = await prisma.floorPlanFile.findMany({
            where: { property_id: propertyId }
        });

        // 4. 매핑 후 반환 (클라이언트 타입)
        return updatedList.map(f => ({
            id: f.id,
            propertyId: f.property_id,
            type: f.type, // Enum
            floor: f.floor,
            fileUuid: f.file_uuid,
            fileName: f.file_name,
            fileKey: f.file_key,
            fileUrl: f.file_url,
            fileContentType: f.file_content_type,
        }));

    } catch (e: any) {
        console.error('Floor Plan Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update floor plans.', data: e.message });
    }
});