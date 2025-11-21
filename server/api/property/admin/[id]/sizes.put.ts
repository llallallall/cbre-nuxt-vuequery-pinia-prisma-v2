// server/api/property/admin/[id]/sizes.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma, LevelType } from '@prisma/client';
import type { ScaleType } from '~/types/property.type';

// Payload 타입 (ScaleType의 부분 집합 또는 전체)
// 프론트엔드 Sizes.vue에서 보내는 데이터 구조와 일치
interface SizesPayload {
    noOfBuildings?: number;
    upperLevels?: number;
    basementLevels?: number;
    gfaSqm?: number | null;
    gfaPy?: number | null;
    nfaSqm?: number | null;
    nfaPy?: number | null;
    siteAreaSqm?: number | null;
    siteAreaPy?: number | null;
    grossLeasableAreaSqm?: number | null;
    grossLeasableAreaPy?: number | null;
    netLeasableAreaSqm?: number | null;
    netLeasableAreaPy?: number | null;
    floorAreaRatioExisting?: number | null;
    floorAreaRatioPermitted?: number | null;
    buildingCoverageRatioExisting?: number | null;
    buildingCoverageRatioPermitted?: number | null;
    floorPlateSqm?: number | null;
    floorPlatePy?: number | null;
}

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readBody<SizesPayload>(event);

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {

            // 1. Scale 데이터 매핑 및 Upsert
            const dataInput = {
                no_of_buildings: body.noOfBuildings ?? 0,
                upper_levels: body.upperLevels ?? 0,
                basement_levels: body.basementLevels ?? 0,
                gfa_sqm: body.gfaSqm,
                gfa_py: body.gfaPy,
                nfa_sqm: body.nfaSqm,
                nfa_py: body.nfaPy,
                site_area_sqm: body.siteAreaSqm,
                site_area_py: body.siteAreaPy,
                gross_leasable_area_sqm: body.grossLeasableAreaSqm,
                gross_leasable_area_py: body.grossLeasableAreaPy,
                net_leasable_area_sqm: body.netLeasableAreaSqm,
                net_leasable_area_py: body.netLeasableAreaPy,
                floor_area_ratio_existing: body.floorAreaRatioExisting,
                floor_area_ratio_permitted: body.floorAreaRatioPermitted,
                building_coverage_ratio_existing: body.buildingCoverageRatioExisting,
                building_coverage_ratio_permitted: body.buildingCoverageRatioPermitted,
                floor_plate_sqm: body.floorPlateSqm,
                floor_plate_py: body.floorPlatePy,
            };

            const updatedScale = await tx.scale.upsert({
                where: { property_id: propertyId },
                update: dataInput,
                create: { property_id: propertyId, ...dataInput },
            });

            // 2. 층수 변경에 따른 Floor 데이터 정리 (선택 사항이지만 데이터 무결성을 위해 권장)
            // 설정된 층수보다 높은 번호의 층이 있다면 삭제합니다.

            const newUpper = body.upperLevels ?? 0;
            const newBasement = body.basementLevels ?? 0;

            // 지상층 정리: 설정된 층수보다 큰 층 삭제
            if (newUpper > 0) {
                await tx.floor.deleteMany({
                    where: {
                        property_id: propertyId,
                        type: LevelType.UPPER,
                        floor: { gt: newUpper }
                    }
                });
            }

            // 지하층 정리: 설정된 층수보다 깊은 층(숫자로는 더 작은 값 -3 < -2) 삭제
            // Floor 모델의 floor 값이 지하층인 경우 음수(-1, -2...)로 저장된다면 'lt: -newBasement'
            // 만약 양수(1, 2...)로 저장하고 type으로 구분한다면 'gt: newBasement'
            // 현재 로직은 Floor.vue에서 지하층을 -1, -2로 처리하므로, 절대값 비교가 필요하거나 
            // Floor.vue의 생성 로직(floor: -i)을 따름.
            // Prisma에서 -3 (B3) 은 -2 (B2) 보다 작음 (lt). 
            // newBasement가 2이면, -3 미만인 층을 삭제해야 함? 아니, 지하 2층까지니까 -1, -2 유지. -3 삭제.
            // 즉 floor < -2 인 것 삭제.

            if (newBasement > 0) {
                await tx.floor.deleteMany({
                    where: {
                        property_id: propertyId,
                        type: LevelType.BASEMENT,
                        floor: { lt: -newBasement }
                    }
                });
            }

            // 3. 응답 매핑
            return {
                noOfBuildings: updatedScale.no_of_buildings,
                upperLevels: updatedScale.upper_levels,
                basementLevels: updatedScale.basement_levels,
                gfaSqm: updatedScale.gfa_sqm,
                gfaPy: updatedScale.gfa_py,
                nfaSqm: updatedScale.nfa_sqm,
                nfaPy: updatedScale.nfa_py,
                siteAreaSqm: updatedScale.site_area_sqm,
                siteAreaPy: updatedScale.site_area_py,
                grossLeasableAreaSqm: updatedScale.gross_leasable_area_sqm,
                grossLeasableAreaPy: updatedScale.gross_leasable_area_py,
                netLeasableAreaSqm: updatedScale.net_leasable_area_sqm,
                netLeasableAreaPy: updatedScale.net_leasable_area_py,
                floorAreaRatioExisting: updatedScale.floor_area_ratio_existing,
                floorAreaRatioPermitted: updatedScale.floor_area_ratio_permitted,
                buildingCoverageRatioExisting: updatedScale.building_coverage_ratio_existing,
                buildingCoverageRatioPermitted: updatedScale.building_coverage_ratio_permitted,
                floorPlateSqm: updatedScale.floor_plate_sqm,
                floorPlatePy: updatedScale.floor_plate_py,
            };
        });

        return result;

    } catch (e: any) {
        console.error('Sizes(Scale) Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update sizes info.', data: e.message });
    }
});