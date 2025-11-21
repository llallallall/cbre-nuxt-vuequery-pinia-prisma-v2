// server/api/property/admin/[id]/brochure.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { mapBrochureListToPrisma } from '~/utils/fileMapper';
import type { PropertyBrochureFileType } from '~/types/property.type';

interface BrochureUpdatePayload {
    brochureList: PropertyBrochureFileType[];
}

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readBody<BrochureUpdatePayload>(event);

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. 기존 브로슈어 전체 삭제
            await tx.propertyBrochureFile.deleteMany({
                where: { property_id: propertyId },
            });

            // 2. 유효한 파일 필터링
            const validFiles = body.brochureList.filter(f => f.fileUrl);

            // 3. 새 리스트 일괄 생성
            if (validFiles.length > 0) {
                const dataToInsert = mapBrochureListToPrisma(validFiles, propertyId);

                await tx.propertyBrochureFile.createMany({
                    data: dataToInsert,
                });
            }
        });

        // 4. 최신 데이터 조회
        const updatedList = await prisma.propertyBrochureFile.findMany({
            where: { property_id: propertyId },
            orderBy: { created_at: 'asc' }
        });

        return {
            brochureList: updatedList.map(b => ({
                id: b.id,
                propertyId: b.property_id,
                fileUuid: b.file_uuid,
                fileName: b.file_name,
                fileKey: b.file_key,
                fileUrl: b.file_url,
                fileContentType: b.file_content_type,
            }))
        };

    } catch (e: any) {
        console.error('Brochure Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update brochures.', data: e.message });
    }
});