// server/api/property/[id]/brochure.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';

// 프론트엔드에서 넘어오는 Brochure List Item의 타입 정의 (PhotoListItem에서 main 제외)
interface BrochureListItem {
    id?: string;
    fileUuid: string | null;
    fileName: string | null;
    fileUrl: string | null;
    fileKey: string | null;
    fileContentType: string | null;
}

// 프론트엔드에서 넘어오는 Payload 타입 정의
interface BrochureUpdatePayload {
    brochureList: BrochureListItem[];
}

// 프론트엔드 Pinia Store에 반환할 데이터의 타입
interface PropertyBrochureResponse {
    propertyId: string;
    brochureList: Array<Omit<BrochureListItem, 'id'> & { id: string }>;
}


export default defineEventHandler(async (event): Promise<PropertyBrochureResponse> => {
    const params = getRouterParams(event);
    const propertyId = params.id;
    
    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is missing.' });
    }

    const body: BrochureUpdatePayload = await readBody(event);
    const incomingBrochureList = body.brochureList;
    
    try {
        const result = await prisma.$transaction(async (tx) => {
            
            // 1. 데이터 분류
            const existingBrochuresInPayload = incomingBrochureList.filter(b => b.id);
            const newBrochuresToInsert = incomingBrochureList.filter(b => !b.id);
            const existingBrochureIdsInPayload = existingBrochuresInPayload.map(b => b.id!) as string[];
            
            
            // 2. 삭제 처리: DB에 있지만 Payload에 없는 항목 삭제
            const currentDbBrochures = await tx.PropertyBrochureFile.findMany({ 
                where: { property_id: propertyId },
                select: { id: true },
            });

            const dbBrochureIds = currentDbBrochures.map(b => b.id);
            const idsToDelete = dbBrochureIds.filter(dbId => !existingBrochureIdsInPayload.includes(dbId));

            if (idsToDelete.length > 0) {
                await tx.PropertyBrochureFile.deleteMany({ 
                    where: {
                        id: { in: idsToDelete },
                        property_id: propertyId,
                    },
                });
            }

            
            // 3. 업데이트 처리: (브로슈어는 파일 정보 자체가 변경될 일은 없으므로 생략 또는 간단한 업데이트만)
            // 브로슈어는 순서나 메인 속성이 없으므로, 이 단계는 사실상 필요 없습니다.

            
            // 4. 생성 처리 (Insert: 새로운 파일 등록)
            if (newBrochuresToInsert.length > 0) {
                // 새 파일은 fileUuid와 fileUrl이 반드시 존재해야 유효합니다.
                const validNewBrochures = newBrochuresToInsert.filter(brochure => 
                    brochure.fileUuid !== null && brochure.fileUrl !== null
                );

                if (validNewBrochures.length > 0) {
                    const dataToInsert = validNewBrochures.map(brochure => ({
                        property_id: propertyId,
                        file_uuid: brochure.fileUuid as string,
                        file_name: brochure.fileName,
                        file_url: brochure.fileUrl as string,
                        file_key: brochure.fileKey,
                        file_content_type: brochure.fileContentType,
                        // main 필드 없음
                    }));
                    
                    // Prisma 모델 이름을 PropertyBrochureFile로 가정
                    await tx.PropertyBrochureFile.createMany({ 
                        data: dataToInsert as Prisma.PropertyBrochureFileCreateManyInput[],
                        skipDuplicates: true,
                    });
                }
            }
            
            
            // 5. 업데이트된 데이터 다시 조회
            const updatedBrochureList = await tx.PropertyBrochureFile.findMany({ 
                where: { property_id: propertyId },
                select: {
                    id: true,
                    file_uuid: true,
                    file_name: true,
                    file_url: true,
                    file_key: true,
                    file_content_type: true,
                    // main 필드 없음
                },
                orderBy: { id: 'asc' }, // 단순 ID 순 정렬
            });
            
            // 6. Pinia CbreAsset 구조에 맞게 매핑하여 반환
            const mappedResult: PropertyBrochureResponse = {
                propertyId: propertyId,
                brochureList: updatedBrochureList.map(brochure => ({
                    id: brochure.id,
                    fileUuid: brochure.file_uuid,
                    fileName: brochure.file_name,
                    fileUrl: brochure.file_url,
                    fileKey: brochure.file_key,
                    fileContentType: brochure.file_content_type,
                })),
            };

            return mappedResult;
        });

        return result;

    } catch (e) {
        console.error('Property Brochure Update Error:', e);

        if (e instanceof Prisma.PrismaClientKnownRequestError) { 
            throw createError({ statusCode: 500, statusMessage: `Database Error: ${e.message}` });
        }
        
        throw createError({ statusCode: 500, statusMessage: 'Failed to update property brochures.' });
    }
});