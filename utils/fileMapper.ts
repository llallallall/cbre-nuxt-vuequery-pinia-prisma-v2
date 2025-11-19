// ~/utils/fileMapper.ts

import { Prisma, FloorFlanType } from '@prisma/client';
import type {
        FloorPlanPhotoListType, FloorFlanTypeEnum, AssetPhotoType, FileType, FloorPlanPhotoType
} from '~/types/asset.type';


// =======================================================
// 1. Prisma 모델 타입 정의
// =======================================================

export type PrismaFloorPlanFile = Prisma.FloorPlanFileGetPayload<any>;
export type PrismaPropertyImageFile = Prisma.PropertyImageFileGetPayload<any>;
export type PrismaPropertyBrochureFile = Prisma.PropertyBrochureFileGetPayload<any>;

// 클라이언트 타입 유니온 (FileType과 AssetPhotoType이 기본적으로 같은 필드를 가짐)
export type ClientFileBase = FileType | AssetPhotoType | FloorPlanPhotoType;


// =======================================================
// 2. 파일 매핑 베이스 (양방향 헬퍼)
// =======================================================

/**
 * 🔎 DB File 모델을 클라이언트 기본 File 타입으로 매핑합니다. (snake_case -> camelCase)
 */
const mapFileBaseToClient = (f: PrismaFloorPlanFile | PrismaPropertyImageFile | PrismaPropertyBrochureFile) => ({
        propertyId: f.property_id,
        fileUuid: f.file_uuid,
        fileName: f.file_name,
        fileKey: f.file_key,
        fileUrl: f.file_url,
        fileContentType: f.file_content_type,
});

/**
 * 📝 클라이언트 기본 File 타입을 DB File Payload로 매핑합니다. (camelCase -> snake_case)
 */
const mapClientFileBaseToPrisma = (clientFile: ClientFileBase) => ({
        property_id: clientFile.propertyId!,
        file_uuid: clientFile.fileUuid,
        file_name: clientFile.fileName,
        file_key: clientFile.fileKey,
        file_url: clientFile.fileUrl,
        file_content_type: clientFile.fileContentType,
});


// =======================================================
// 3. Floor Plan 매퍼 (양방향)
// =======================================================

/**
 * 🔎 FloorPlanFile 모델을 클라이언트 FloorPlanPhotoType으로 매핑합니다. (DB -> Client)
 */
export function mapFloorPlanFileToClient(f: PrismaFloorPlanFile): FloorPlanPhotoType {
        return {
                ...mapFileBaseToClient(f),
                // DB Enum 값을 클라이언트 Enum 타입으로 캐스팅 (FloorPlanPhotoType에서 type은 필수이므로 !)
                type: f.type as unknown as FloorFlanTypeEnum,
                floor: f.floor ?? null,
                // isNew, tempFile은 DB에 없으므로 생략 (FloorPlanPhotoType에서 optional 필드이므로 OK)
        } as FloorPlanPhotoType;
}

// 클라이언트 FloorPlanPhotoType을 DB FloorPlanFile Payload로 매핑합니다. (Client -> DB)
export const mapClientFloorPlanToPrisma = (clientFile: FloorPlanPhotoType): Partial<PrismaFloorPlanFile> => ({
        // 기본 파일 필드 매핑
        ...mapClientFileBaseToPrisma(clientFile),


        type: clientFile.type as unknown as FloorFlanType,

        floor: clientFile.floor ?? null,
});


/**
 * 🗺️ FloorPlanFile 모델 리스트를 클라이언트 FloorPlanPhotoListType으로 매핑합니다. (DB -> Client)
 */
export function mapFloorPlanListToClient(floorPlanFiles: PrismaFloorPlanFile[]): FloorPlanPhotoListType {
        const mappedList = floorPlanFiles.map(mapFloorPlanFileToClient);
        const toStr = (type: FloorFlanTypeEnum) => type as unknown as string;

        return {
                logitudinal: mappedList
                        .filter(f => toStr(f.type) === 'LOGITUDINALSECTION'),
                cross: mappedList
                        .filter(f => toStr(f.type) === 'CROSSSECTION'),
                eachFloor: {
                        uppers: mappedList
                                .filter(f => toStr(f.type) === 'UPPERSECTION'),
                        basements: mappedList
                                .filter(f => toStr(f.type) === 'BASEMENTSECTION'),
                }
        } as FloorPlanPhotoListType;
}

/**
 * 📝 클라이언트 Floor Plan 리스트를 DB 저장용 Payload 리스트로 매핑합니다. (Client -> DB)
 */
export function mapClientFloorPlanListToPrisma(clientList: FloorPlanPhotoListType): Partial<PrismaFloorPlanFile>[] {
        const allClientFiles = [
                ...(clientList.logitudinal || []),
                ...(clientList.cross || []),
                ...(clientList.eachFloor?.uppers || []),
                ...(clientList.eachFloor?.basements || []),
        ];
        return allClientFiles.map(mapClientFloorPlanToPrisma);
}


// =======================================================
// 4. Image/Brochure 매퍼 (양방향)
// =======================================================

/**
 * 🖼️ PropertyImageFile 모델 리스트를 AssetPhotoType 리스트로 매핑합니다. (DB -> Client)
 */
export function mapPhotoListToClient(photos: PrismaPropertyImageFile[]): AssetPhotoType[] {
        return photos.map(mapFileBaseToClient) as AssetPhotoType[];
}

/**
 * 📄 PropertyBrochureFile 모델 리스트를 FileType 리스트로 매핑합니다. (DB -> Client)
 */
export function mapBrochureListToClient(brochures: PrismaPropertyBrochureFile[]): FileType[] {
        return brochures.map(mapFileBaseToClient) as FileType[];
}

/**
 * 📝 클라이언트 AssetPhotoType 리스트를 DB PropertyImageFile Payload 리스트로 매핑합니다. (Client -> DB)
 */
export function mapClientPhotoListToPrisma(photos: AssetPhotoType[]): Partial<PrismaPropertyImageFile>[] {
        return photos.map(mapClientFileBaseToPrisma) as Partial<PrismaPropertyImageFile>[];
}

/**
 * 📝 클라이언트 FileType 리스트를 DB PropertyBrochureFile Payload 리스트로 매핑합니다. (Client -> DB)
 */
export function mapClientBrochureListToPrisma(brochures: FileType[]): Partial<PrismaPropertyBrochureFile>[] {
        return brochures.map(mapClientFileBaseToPrisma) as Partial<PrismaPropertyBrochureFile>[];
}