// /server/api/upload/[id]/floor-plan-photo.put.ts

import { 
    PrismaClient, 
    FloorPlanFile, 
    FloorFlanType // DB 모델에서 정의한 Enum 타입
} from '@prisma/client';
import { defineEventHandler, readBody, getRouterParam, createError } from 'h3';
import type { FloorPlanPhotoListType, FloorPlanPhotoType } from '~/types/asset.type';

// DB 자동 관리/관계 필드를 제외한 로컬 타입 정의
type FloorPlanFileCreateInput = Omit<FloorPlanFile, 'id' | 'created_at' | 'updated_at' | 'property'>;

const prisma = new PrismaClient();

// 💡 매핑 로직 제거: 클라이언트에서 DB Enum 타입과 동일한 값을 보낸다고 가정합니다.

export default defineEventHandler(async (event) => {
    // 1. Property ID 및 Body 파싱
    const propertyId = getRouterParam(event, 'id');
    const body = await readBody<FloorPlanPhotoListType>(event);

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }
    
    // 2. Client Payload (FloorPlanPhotoListType)를 단일 FloorPlanFile 배열로 평탄화
    const newFloorPlanFiles: FloorPlanFileCreateInput[] = [];

    // logitudinal 및 cross 섹션 처리
    const sections = [
        ...body.logitudinal,
        ...body.cross,
    ];

    // eachFloor 섹션 처리
    const eachFloorSections = [
        ...body.eachFloor.uppers,
        ...body.eachFloor.basements,
    ];

    // 모든 섹션 데이터를 합쳐서 DB 저장 형식으로 변환 (Flattening)
    [...sections, ...eachFloorSections].forEach(photo => {
        // fileUrl이 있는 유효한 데이터만 저장합니다.
        if (photo.fileUrl && photo.type) {
            newFloorPlanFiles.push({
                property_id: propertyId,
                // photo.type은 이제 클라이언트에서 전송한 긴 Enum 이름이라고 가정합니다.
                type: photo.type as FloorFlanType, 
                floor: photo.floor,
                file_uuid: photo.fileUuid,
                file_name: photo.fileName,
                file_key: photo.fileKey,
                file_url: photo.fileUrl,
                file_content_type: photo.fileContentType,
            });
        }
    });

    // 3. 트랜잭션을 사용하여 기존 데이터를 삭제하고 새 데이터를 생성
    try {
        await prisma.$transaction(async (tx) => {
            // A. 기존 파일 레코드 전체 삭제
            await tx.floorPlanFile.deleteMany({
                where: { property_id: propertyId },
            });

            // B. 새 파일 레코드 일괄 생성
            if (newFloorPlanFiles.length > 0) {
                await tx.floorPlanFile.createMany({
                    data: newFloorPlanFiles,
                });
            }
        });

        // 4. 성공 응답
        return body; 

    } catch (error) {
        console.error(`Floor Plan Photo Update Failed for Property ${propertyId}:`, error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update floor plan photos in the database.',
        });
    }
});