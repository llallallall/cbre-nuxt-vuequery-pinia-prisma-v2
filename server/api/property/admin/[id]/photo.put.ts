// server/api/property/[id]/photo.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';

// 프론트엔드에서 넘어오는 PhotoList Item의 타입 정의 (수정됨: Nullable 필드에 ' | null' 추가)
interface PhotoListItem {
    id?: string;
    fileUuid: string | null;        // 🎯 수정: string | null
    fileName: string | null;        // 🎯 수정: string | null
    fileUrl: string | null;         // 🎯 수정: string | null
    fileKey: string | null;         // 🎯 수정: string | null
    fileContentType: string | null; // 🎯 수정: string | null
    main: boolean;
}

// 프론트엔드에서 넘어오는 Payload 타입 정의
interface PhotoUpdatePayload {
    photoList: PhotoListItem[];
}

// 프론트엔드 Pinia Store에 반환할 데이터의 타입
interface PropertyPhotoResponse {
    propertyId: string;
    // 이제 PhotoListItem이 null을 포함하므로, 이 할당은 문제 없이 작동합니다.
    photoList: Array<Omit<PhotoListItem, 'id'> & { id: string }>;
}


export default defineEventHandler(async (event): Promise<PropertyPhotoResponse> => {
    const params = getRouterParams(event);
    const propertyId = params.id;
    
    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is missing.' });
    }

    const body: PhotoUpdatePayload = await readBody(event);
    const incomingPhotoList = body.photoList;
    
    try {
        const result = await prisma.$transaction(async (tx) => {
            
            // 1. 데이터 분류
            const existingPhotosInPayload = incomingPhotoList.filter(p => p.id);
            const newPhotosToInsert = incomingPhotoList.filter(p => !p.id);
            const existingPhotoIdsInPayload = existingPhotosInPayload.map(p => p.id!) as string[];
            
            
            // 2. 삭제 처리
            const currentDbPhotos = await tx.propertyImageFile.findMany({ 
                where: { property_id: propertyId },
                select: { id: true },
            });

            const dbPhotoIds = currentDbPhotos.map(p => p.id);
            const idsToDelete = dbPhotoIds.filter(dbId => !existingPhotoIdsInPayload.includes(dbId));

            if (idsToDelete.length > 0) {
                await tx.propertyImageFile.deleteMany({ 
                    where: {
                        id: { in: idsToDelete },
                        property_id: propertyId,
                    },
                });
            }

            
            // 3. 업데이트 처리
            const updatePromises = existingPhotosInPayload.map(photo => {
                return tx.propertyImageFile.update({ 
                    where: { id: photo.id! },
                    data: {
                        main: photo.main,
                        // fileKey, fileUrl 등은 업로드 시점에 결정되므로 DB에서는 main 상태만 업데이트하는 것이 일반적입니다.
                    },
                });
            });
            await Promise.all(updatePromises);


            // 4. 생성 처리
            if (newPhotosToInsert.length > 0) {
                const dataToInsert = newPhotosToInsert.map(photo => ({
                    property_id: propertyId,
                    file_uuid: photo.fileUuid,
                    file_name: photo.fileName,
                    file_url: photo.fileUrl,
                    file_key: photo.fileKey,
                    file_content_type: photo.fileContentType,
                    main: photo.main,
                }));
                
                await tx.propertyImageFile.createMany({ 
                    data: dataToInsert,
                    skipDuplicates: true,
                });
            }
            
            
            // 5. 업데이트된 데이터 다시 조회
            const updatedPhotoList = await tx.propertyImageFile.findMany({ 
                where: { property_id: propertyId },
                select: {
                    id: true,
                    file_uuid: true,
                    file_name: true,
                    file_url: true,
                    file_key: true,
                    file_content_type: true,
                    main: true,
                },
                orderBy: [{ main: 'desc'}, {id: 'asc' }, ]
            });
            
            // 6. Pinia CbreAsset 구조에 맞게 매핑하여 반환
            // 🎯 이제 PhotoListItem의 필드가 'string | null'을 허용하므로 오류가 해결됩니다.
            const mappedResult: PropertyPhotoResponse = {
                propertyId: propertyId,
                photoList: updatedPhotoList.map(photo => ({
                    id: photo.id,
                    fileUuid: photo.file_uuid,
                    fileName: photo.file_name,
                    fileUrl: photo.file_url,
                    fileKey: photo.file_key,
                    fileContentType: photo.file_content_type,
                    main: photo.main,
                })),
            };

            return mappedResult;
        });

        return result;

    } catch (e) {
        console.error('Property Photo Update Error:', e);

        if (e instanceof Prisma.PrismaClientKnownRequestError) { 
            if (e.code === 'P2002') {
                 throw createError({ statusCode: 409, statusMessage: 'Database Conflict Error: File already exists or constraint violated.' });
            }
            throw createError({ statusCode: 500, statusMessage: `Database Error: ${e.message}` });
        }
        
        throw createError({ statusCode: 500, statusMessage: 'Failed to update property photos.' });
    }
});