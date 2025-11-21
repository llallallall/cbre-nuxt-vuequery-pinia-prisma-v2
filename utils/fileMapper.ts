// ~/utils/fileMapper.ts

import { FloorFlanType } from '@prisma/client';
import type {
        FloorPlanFileType,
        PropertyImageFileType,
        PropertyBrochureFileType
} from '~/types/property.type';

// =======================================================
// 1. 공통 필드 매퍼 (Client camelCase -> DB snake_case)
// =======================================================

/**
 * 파일의 공통 메타데이터를 Prisma Input 포맷으로 변환합니다.
 */
const mapBaseFileToPrisma = (file: any) => ({
        file_uuid: file.fileUuid,
        file_name: file.fileName,
        file_key: file.fileKey,
        file_url: file.fileUrl,
        file_content_type: file.fileContentType,
});

// =======================================================
// 2. 개별 파일 타입 매퍼 (Client -> DB)
// =======================================================

/**
 * 🖼️ Image File 매퍼
 * (PropertyImageFile에는 'main' 필드가 추가로 존재)
 */
export const mapImageToPrisma = (file: PropertyImageFileType, propertyId: string) => ({
        property_id: propertyId,
        ...mapBaseFileToPrisma(file),
        main: file.main ?? false,
});

/**
 * 📄 Brochure File 매퍼
 */
export const mapBrochureToPrisma = (file: PropertyBrochureFileType, propertyId: string) => ({
        property_id: propertyId,
        ...mapBaseFileToPrisma(file),
});

/**
 * 🗺️ Floor Plan File 매퍼
 * (FloorPlanFile에는 'type', 'floor' 필드가 추가로 존재)
 */
export const mapFloorPlanToPrisma = (file: FloorPlanFileType, propertyId: string) => {
        return {
                property_id: propertyId,
                ...mapBaseFileToPrisma(file),
                // 💡 Enum 매핑: 문자열이 Prisma Enum과 일치한다고 가정
                type: file.type as FloorFlanType,
                floor: file.floor ?? null,
        };
};


// =======================================================
// 3. 리스트 매퍼 (Client Array -> DB CreateManyInput Array)
// =======================================================

/**
 * 이미지 리스트 변환
 */
export const mapImageListToPrisma = (files: PropertyImageFileType[], propertyId: string) => {
        return files.map(f => mapImageToPrisma(f, propertyId));
};

/**
 * 브로슈어 리스트 변환
 */
export const mapBrochureListToPrisma = (files: PropertyBrochureFileType[], propertyId: string) => {
        return files.map(f => mapBrochureToPrisma(f, propertyId));
};

/**
 * 도면 리스트 변환
 * 💡 더 이상 중첩 객체({ longitudinal: ... })를 다루지 않고 Flat 배열만 처리합니다.
 */
export const mapFloorPlanListToPrisma = (files: FloorPlanFileType[], propertyId: string) => {
        return files.map(f => mapFloorPlanToPrisma(f, propertyId));
};