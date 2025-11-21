// server/api/property/admin/[id]/photo.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { mapImageListToPrisma } from '~/utils/fileMapper';
import type { PropertyImageFileType } from '~/types/property.type';

interface PhotoUpdatePayload {
    photoList: PropertyImageFileType[];
}

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readBody<PhotoUpdatePayload>(event);

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. 기존 이미지 메타데이터 전체 삭제 (MinIO 파일은 유지, DB 연결만 끊음)
            // 실제 파일 삭제는 프론트엔드에서 개별 삭제 시 처리됨
            await tx.propertyImageFile.deleteMany({
                where: { property_id: propertyId },
            });

            // 2. 유효한 이미지 리스트 필터링 (URL이 있는 것만)
            const validPhotos = body.photoList.filter(p => p.fileUrl);

            // 3. 새 리스트 일괄 생성
            if (validPhotos.length > 0) {
                // 유틸리티를 사용하여 Prisma Input으로 변환
                const dataToInsert = mapImageListToPrisma(validPhotos, propertyId);

                await tx.propertyImageFile.createMany({
                    data: dataToInsert
                });
            }
        });

        // 4. 최신 데이터 조회 및 반환
        const updatedList = await prisma.propertyImageFile.findMany({
            where: { property_id: propertyId },
            orderBy: [
                { main: 'desc' }, // Main 이미지가 먼저 오도록 정렬
                { created_at: 'asc' }
            ]
        });

        // 5. 클라이언트 포맷으로 매핑하여 반환
        return {
            photoList: updatedList.map(p => ({
                id: p.id,
                propertyId: p.property_id,
                main: p.main,
                fileUuid: p.file_uuid,
                fileName: p.file_name,
                fileKey: p.file_key,
                fileUrl: p.file_url,
                fileContentType: p.file_content_type,
            }))
        };

    } catch (e: any) {
        console.error('Photo Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update photos.', data: e.message });
    }
});