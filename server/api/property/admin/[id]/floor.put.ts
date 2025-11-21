// server/api/property/admin/[id]/floor.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { LevelType, FloorUseType, RoomUseType } from '@prisma/client';
import type { FloorPayload, FloorPartialPayload } from '~/types/property.type'; // 타입 파일 확인 필요


// (Floor 모델과 FloorPartial 모델 전체 필드에 대한 변환 필요)
const transformFloorToResponse = (floor: any /* Prisma 결과 객체 */): FloorPayload => {
    return {
        floorId: floor.id,
        propertyId: floor.property_id,
        type: floor.type,
        floor: floor.floor,
        ceilingHeight: floor.ceiling_height,
        ceilingHeightUnit: floor.ceiling_height_unit,
        floorLoad: floor.floor_load,
        floorLoadUnit: floor.floor_load_unit,
        truckBerths: floor.truck_berths,
        use: floor.use,
        totalAreaSqm: floor.total_area_sqm,
        totalAreaPy: floor.total_area_py,
        grossLeasableAreaSqm: floor.gross_leasable_area_sqm,
        grossLeasableAreaPy: floor.gross_leasable_area_py,
        netLeasableAreaSqm: floor.net_leasable_area_sqm,
        netLeasableAreaPy: floor.net_leasable_area_py,
        floorPartial: floor.floorPartial.map((partial: any) => ({
            id: partial.id,
            floorId: partial.floor_id,
            unitNumber: partial.unit_number,
            tenant: partial.tenant,
            leaseAreaSqm: partial.lease_area_sqm,
            leaseAreaPy: partial.lease_area_py,
            tenantEquipment: partial.tenant_equipment,
            tenantUse: partial.tenant_use,
            leaseStartDate: partial.lease_start_date,
            leaseEndDate: partial.lease_end_date,
            depositKrw: partial.deposit_krw,
            monthlyRentPerPy: partial.monthly_rent_per_py,
            monthlyRent: partial.monthly_rent,
            monthlyManagementPerPy: partial.monthly_management_per_py,
            monthlyManagementFee: partial.monthly_management_fee,
            increaseConditionsForDeposit: partial.increase_conditions_for_deposit,
            increaseConditionsForRent: partial.increase_conditions_for_rent,
            increaseConditionsForManagementFee: partial.increase_conditions_for_management_fee,
            rentFree: partial.rent_free,
            fitOut: partial.fit_out,
        })) as FloorPartialPayload[], // 클라이언트 타입에 맞춤,
    } as FloorPayload; // 클라이언트 타입에 맞춤
};

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readBody<FloorPayload[]>(event); // 배열 형태의 Payload

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    try {
        // 트랜잭션으로 일괄 처리
        const result = await prisma.$transaction(async (tx) => {

            // 1. 기존 Floor 데이터 중, 이번 요청에 포함되지 않은 Floor 삭제 (삭제된 층 처리)
            // Payload에 있는 ID 목록 추출
            const incomingFloorIds = body
                .filter(f => f.id && !f.id.startsWith('temp_')) // 신규(temp_)가 아닌 기존 ID만
                .map(f => f.id as string);

            await tx.floor.deleteMany({
                where: {
                    property_id: propertyId,
                    id: { notIn: incomingFloorIds } // 요청에 없는 ID는 삭제
                }
            });

            // 2. 각 Floor 데이터 Upsert (생성 또는 수정)
            for (const floorData of body) {
                // FloorPartial 데이터 분리
                const { floorPartial, ...floorMain } = floorData;

                // Floor 저장 (Upsert)
                // ID가 없거나 temp_로 시작하면 Create, 아니면 Update
                const isNewFloor = !floorMain.id || floorMain.id.startsWith('temp_');

                // Prisma에 전달할 Floor 데이터 (snake_case 매핑)
                const floorInput = {
                    property_id: propertyId,
                    type: floorMain.type as LevelType,
                    floor: floorMain.floor,
                    ceiling_height: floorMain.ceilingHeight,
                    ceiling_height_unit: floorMain.ceilingHeightUnit,
                    floor_load: floorMain.floorLoad,
                    floor_load_unit: floorMain.floorLoadUnit,
                    truck_berths: floorMain.truckBerths,
                    use: floorMain.use as FloorUseType,
                    total_area_sqm: floorMain.totalAreaSqm,
                    total_area_py: floorMain.totalAreaPy,
                    gross_leasable_area_sqm: floorMain.grossLeasableAreaSqm,
                    gross_leasable_area_py: floorMain.grossLeasableAreaPy,
                    net_leasable_area_sqm: floorMain.netLeasableAreaSqm,
                    net_leasable_area_py: floorMain.netLeasableAreaPy,
                };

                let savedFloor;

                if (isNewFloor) {
                    savedFloor = await tx.floor.create({ data: floorInput });
                } else {
                    savedFloor = await tx.floor.update({
                        where: { id: floorMain.id },
                        data: floorInput
                    });
                }

                // 3. FloorPartial (호실) 데이터 처리
                // 전략: 해당 층의 기존 Partial을 모두 삭제하고, Payload대로 다시 생성 (가장 깔끔함)
                await tx.floorPartial.deleteMany({
                    where: { floor_id: savedFloor.id }
                });

                if (floorPartial && floorPartial.length > 0) {
                    await tx.floorPartial.createMany({
                        data: floorPartial.map(p => ({
                            floor_id: savedFloor.id,
                            unit_number: p.unitNumber,
                            tenant: p.tenant,
                            lease_area_sqm: p.leaseAreaSqm,
                            lease_area_py: p.leaseAreaPy,
                            tenant_equipment: p.tenantEquipment,
                            tenant_use: p.tenantUse as RoomUseType,
                            lease_start_date: p.leaseStartDate ? new Date(p.leaseStartDate) : null,
                            lease_end_date: p.leaseEndDate ? new Date(p.leaseEndDate) : null,
                            deposit_krw: p.depositKrw,
                            monthly_rent_per_py: p.monthlyRentPerPy,
                            monthly_rent: p.monthlyRent,
                            monthly_management_per_py: p.monthlyManagementPerPy,
                            monthly_management_fee: p.monthlyManagementFee,
                            increase_conditions_for_deposit: p.increaseConditionsForDeposit,
                            increase_conditions_for_rent: p.increaseConditionsForRent,
                            increase_conditions_for_management_fee: p.increaseConditionsForManagementFee,
                            rent_free: p.rentFree,
                            fit_out: p.fitOut
                        }))
                    });
                }
            }

            // 4. 최종 결과 반환 (프론트엔드 상태 갱신용)
            return await tx.floor.findMany({
                where: { property_id: propertyId },
                include: { floorPartial: true },
                orderBy: { floor: 'desc' } // 정렬
            });
        });

        // 결과 반환 (이미 index.get.ts와 유사한 구조이지만, 필요하면 여기서 camelCase 매핑 추가 가능)
        // 현재는 프론트엔드에서 받은 데이터를 그대로 매핑해서 쓰고 있으므로, 
        // get.ts의 매핑 로직을 참고하여 camelCase로 변환해서 주는 것이 완벽합니다.
        // (간단하게는 위에서 저장된 데이터를 다시 get.ts 로직처럼 변환)

        // 여기서는 DB 객체를 그대로 리턴하되, 프론트엔드의 updateFloorList가 이를 처리할 수 있어야 합니다.
        // 프론트엔드에서 이미 snake_case -> camelCase 변환을 하거나, 
        // 여기서 변환해주는 것이 좋습니다.

        // [간단 변환 로직]
        return result.map(transformFloorToResponse);

    } catch (e: any) {
        console.error('Floor Update Error:', e);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update floor data.', data: e.message });
    }
});

