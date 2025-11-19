// /server/api/property/[id]/sizes.put.ts

import { PrismaClient, Scale } from '@prisma/client'; // 💡 Scale 모델 타입은 유지
import { defineEventHandler, readBody, getRouterParam, createError } from 'h3';

const prisma = new PrismaClient();

// 💡 수정된 부분: Prisma.ScaleUpdateInput, Prisma.ScaleCreateInput 타입을 로컬에서 재정의
// Omit: DB에서 자동 관리되는 필드(id, created_at, updated_at)와 외래 키(property_id)를 제외합니다.

// 1. UPDATE 타입 정의: 모든 필드는 선택 사항(Partial)이어야 합니다.
type LocalScaleUpdateInput = Partial<Omit<Scale, 
    'id' | 'property_id' | 'created_at' | 'updated_at' | 'property'
>>;

// 2. CREATE 타입 정의: 필수 외래 키(property_id)를 제외한 나머지 필수 필드는 남기고,
//    자동 생성 필드는 제외합니다. (Payload가 필수 필드를 포함한다고 가정)
type LocalScaleCreateInput = Omit<Scale, 
    'id' | 'created_at' | 'updated_at' | 'property'
>;

// Prisma 모델 필드명 (snake_case)과 페이로드 타입 정의
interface ScalePayload {
    no_of_buildings?: number;
    upper_levels?: number;
    basement_levels?: number;
    gfa_sqm?: number | null;
    gfa_py?: number | null;
    nfa_sqm?: number | null;
    nfa_py?: number | null;
    site_area_sqm?: number | null;
    site_area_py?: number | null;
    gross_leasable_area_sqm?: number | null;
    gross_leasable_area_py?: number | null;
    net_leasable_area_sqm?: number | null;
    net_leasable_area_py?: number | null;
    floor_area_ratio_existing?: number | null;
    floor_area_ratio_permitted?: number | null;
    building_coverage_ratio_existing?: number | null;
    building_coverage_ratio_permitted?: number | null;
    floor_plate_sqm?: number | null;
    floor_plate_py?: number | null;
}

// 응답 타입 정의 (Pinia store가 예상하는 camelCase)
interface SizesResponseType {
    noOfBuildings: number;
    upperLevels: number;
    basementLevels: number;
    gfaSqm: number | null;
    gfaPy: number | null;
    nfaSqm: number | null;
    nfaPy: number | null;
    siteAreaSqm: number | null;
    siteAreaPy: number | null;
    grossLeasableAreaSqm: number | null;
    grossLeasableAreaPy: number | null;
    netLeasableAreaSqm: number | null;
    netLeasableAreaPy: number | null;
    floorAreaRatioExisting: number | null;
    floorAreaRatioPermitted: number | null;
    buildingCoverageRatioExisting: number | null;
    buildingCoverageRatioPermitted: number | null;
    floorPlateSqm: number | null;
    floorPlatePy: number | null;
}

// DB Scale 모델 객체를 SizesType으로 변환하는 헬퍼 함수
const transformScaleToSizes = (scale: Scale): SizesResponseType => ({
    noOfBuildings: scale.no_of_buildings,
    upperLevels: scale.upper_levels,
    basementLevels: scale.basement_levels,
    gfaSqm: scale.gfa_sqm,
    gfaPy: scale.gfa_py,
    nfaSqm: scale.nfa_sqm,
    nfaPy: scale.nfa_py,
    siteAreaSqm: scale.site_area_sqm,
    siteAreaPy: scale.site_area_py,
    grossLeasableAreaSqm: scale.gross_leasable_area_sqm,
    grossLeasableAreaPy: scale.gross_leasable_area_py,
    netLeasableAreaSqm: scale.net_leasable_area_sqm,
    netLeasableAreaPy: scale.net_leasable_area_py,
    floorAreaRatioExisting: scale.floor_area_ratio_existing,
    floorAreaRatioPermitted: scale.floor_area_ratio_permitted,
    buildingCoverageRatioExisting: scale.building_coverage_ratio_existing,
    buildingCoverageRatioPermitted: scale.building_coverage_ratio_permitted,
    floorPlateSqm: scale.floor_plate_sqm,
    floorPlatePy: scale.floor_plate_py,
});

export default defineEventHandler(async (event) => {
    const propertyId = getRouterParam(event, 'id');
    const body = await readBody<ScalePayload>(event);

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    // 새 층수를 확인합니다. (미전달 시 DB 기본값에 따라 1층, 지하 0층으로 가정)
    const newUpperLevels = body.upper_levels ?? 1; 
    const newBasementLevels = body.basement_levels ?? 0;

    try {
        // 1. 트랜잭션 시작: Scale 업데이트와 Floor 정리를 원자적으로 처리
        const result = await prisma.$transaction(async (tx) => {
            
            // 1.1. Scale 레코드 Upsert (생성 또는 업데이트)
            const updatedScale = await tx.scale.upsert({
                where: { property_id: propertyId },
                // 💡 updated_at: new Date() 제거 및 타입 단언 적용
                update: { ...body } as LocalScaleUpdateInput,
                create: {
                    property_id: propertyId,
                    ...body,
                } as LocalScaleCreateInput,
            });

            // 1.2. Floor 레코드 정리 (Delete Obsolete Floors)
            
            // 🚀 상층부 (UPPER) 정리: upper_levels보다 큰 층 삭제 (예: 3층 -> 2층으로 변경 시, floor 3 이상 삭제)
            await tx.floor.deleteMany({
                where: {
                    property_id: propertyId,
                    type: 'UPPER',
                    floor: {
                        gt: newUpperLevels, // 새로운 upper_levels보다 큰 층 번호 삭제
                    },
                },
            });
            
            // 🚀 지하층 (BASEMENT) 정리: basement_levels보다 더 깊은 지하층 삭제 (예: 지하 2층 -> 지하 1층으로 변경 시, floor -2 이하 삭제)
            // 주의: floor 1이 지하 1층, floor 2가 지하 2층이므로, 
            // newBasementLevels보다 큰 층(더 깊은 층)을 삭제합니다.
            await tx.floor.deleteMany({
                where: {
                    property_id: propertyId,
                    type: 'BASEMENT',
                    floor: {
                        gt: newBasementLevels, 
                    },
                },
            });
            
            // Floor 레코드가 삭제되면, FloorPartial은 Cascade 설정에 의해 자동으로 정리됩니다.
            
            return updatedScale;
        });

        // 2. 응답 시 Pinia 스토어의 `sizes` 타입(camelCase)에 맞게 변환하여 반환
        return transformScaleToSizes(result);

    } catch (error) {
        console.error("Scale Update Error:", error);
        throw createError({ 
            statusCode: 500, 
            statusMessage: '층수 변경 및 데이터 정리에 실패했습니다.' 
        });
    }
});