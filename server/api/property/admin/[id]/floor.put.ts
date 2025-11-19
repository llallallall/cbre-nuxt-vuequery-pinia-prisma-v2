// /server/api/property/[id]/floors.put.ts

import { 
    PrismaClient, 
    Floor, 
    FloorPartial, 
    LevelType, 
    FloorUseType, 
    RoomUseType 
} from '@prisma/client';
// import * as Prisma from '@prisma/client';
import { defineEventHandler, readBody, getRouterParam, createError } from 'h3';
import type { FloorPayload, FloorPartialPayload, FloorType, FloorPartialType} from '~/types/asset.type';

const prisma = new PrismaClient();

// =======================================================
// 💡 오류 해결을 위한 로컬 타입 재정의
// =======================================================
// DB 자동 관리/관계 필드
type BaseOmittedFloorFields = 'id' | 'created_at' | 'updated_at' | 'floorPartial' | 'property';
type OmittedPartialFields = 'id' | 'created_at' | 'updated_at' | 'floor';

// Local Update Input Type: property_id도 제외하고 모두 선택적
type LocalFloorUpdateInput = Partial<Omit<Floor, BaseOmittedFloorFields | 'property_id'>>; 

// Local Create Input Type: property_id를 포함하고 필수
type LocalFloorCreateInput = Omit<Floor, BaseOmittedFloorFields>; 

// Local Partial Update Input Type
type LocalFloorPartialUpdateInput = Partial<Omit<FloorPartial, OmittedPartialFields>>;

// Local Partial Create Input Type
type LocalFloorPartialCreateInput = Omit<FloorPartial, OmittedPartialFields>;


// === 페이로드 및 응답 타입 정의 (Prisma 모델 필드명: snake_case) ===


// 응답 시 Pinia store가 예상하는 camelCase 타입 정의는 생략하고, 
// 대신 DB 객체를 Pinia friendly camelCase로 변환하는 함수만 정의합니다.
// (Floor 모델과 FloorPartial 모델 전체 필드에 대한 변환 필요)
const transformFloorToResponse = (floor: any /* Prisma 결과 객체 */): FloorType => {
    return {
        floorId: floor.id,
        propertyId: floor.property_id,
        type: floor.type,
        floor : floor.floor,
        ceilingHeight : floor.ceiling_height,
        ceilingHeightUnit : floor.ceiling_height_unit,
        floorLoad : floor.floor_load,
        floorLoadUnit : floor.floor_load_unit,
        truckBerths : floor.truck_berths,
        use : floor.use,
        totalAreaSqm: floor.total_area_sqm,
        totalAreaPy : floor.total_area_py,
        grossLeasableAreaSqm : floor.gross_leasable_area_sqm,
        grossLeasableAreaPy : floor.gross_leasable_area_py,
        netLeasableAreaSqm : floor.net_leasable_area_sqm,
        netLeasableAreaPy : floor.net_leasable_area_py,
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
        })) as FloorPartialType[], // 클라이언트 타입에 맞춤,
    } as FloorType; // 클라이언트 타입에 맞춤
};


export default defineEventHandler(async (event) => {
    // 1. 입력 유효성 검사 및 데이터 추출
    const propertyId = getRouterParam(event, 'id');
    const payload: FloorPayload[] = (await readBody(event)) || [];

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    // 1. 트랜잭션 시작
    const result = await prisma.$transaction(async (tx) => {
        const updatedFloors: (Floor & { floorPartial: FloorPartial[] })[] = [];

        for (const floor of payload) {
            const { id: floorId, floorPartial, ...floorData } = floor;
            
            const commonFloorUpdateData = {
                property_id: propertyId,
                type: floorData.type as LevelType, 
                floor: floorData.floor, 
                // ... (나머지 floor 필드 매핑은 그대로)
                ceiling_height: floorData.ceiling_height,
                ceiling_height_unit: floorData.ceiling_height_unit,
                floor_load: floorData.floor_load,
                floor_load_unit: floorData.floor_load_unit,
                truck_berths: floorData.truck_berths,
                use: floorData.use as FloorUseType,
                total_area_sqm: floorData.total_area_sqm,
                total_area_py: floorData.total_area_py,
                gross_leasable_area_sqm: floorData.gross_leasable_area_sqm,
                gross_leasable_area_py: floorData.gross_leasable_area_py,
                net_leasable_area_sqm: floorData.net_leasable_area_sqm,
                net_leasable_area_py: floorData.net_leasable_area_py,
            };

            let currentFloor: Floor & { floorPartial: FloorPartial[] };
            
            if (!floorId) {
                // 새로운 Floor: CREATE
                currentFloor = await tx.floor.create({
                    data: commonFloorUpdateData as LocalFloorCreateInput,
                    include: { floorPartial: true }, // 생성 직후 Partial 포함하여 가져오기
                });
            } else {
                // 기존 Floor: UPDATE (Partial을 포함하여 한 번에 가져오도록 수정)
                currentFloor = await tx.floor.update({
                    where: { id: floorId },
                    data: commonFloorUpdateData as LocalFloorUpdateInput,
                    include: { floorPartial: true }, // 업데이트 직후 Partial 포함하여 가져오기
                });
            }

            // 1. 기존 Partial ID 식별 (현재 DB에 존재하는 Partial)
            const existingPartials = currentFloor.floorPartial;
            const existingPartialIds = existingPartials.map(p => p.id);
            const partialPayloadIds = floorPartial.map(p => p.id).filter((id): id is string => !!id);
            
            // 2. 삭제할 Partial ID 식별
            const partialsToDelete = existingPartialIds.filter(id => !partialPayloadIds.includes(id));
            if (partialsToDelete.length > 0) {
                // 3. payload에 없는 유닛(Partial) 삭제
                await tx.floorPartial.deleteMany({
                    where: { id: { in: partialsToDelete } },
                });
            }

            // 4. Partial Upsert/Create
            const partialWrites = floorPartial.map(partial => {
                const { id: partialId, ...partialData } = partial;
                
                const partialUpdateData: Partial<FloorPartial> = {
                    // FloorPartialPayload와 DB 필드가 겹치는 모든 필드를 매핑합니다.
                    unit_number: partialData.unit_number,
                    tenant: partialData.tenant,
                    lease_area_sqm: partialData.lease_area_sqm,
                    lease_area_py: partialData.lease_area_py,
                    tenant_equipment: partialData.tenant_equipment,
                    tenant_use: partialData.tenant_use as RoomUseType,
                    lease_start_date: partialData.lease_start_date,
                    lease_end_date: partialData.lease_end_date,
                    deposit_krw: partialData.deposit_krw,
                    monthly_rent_per_py: partialData.monthly_rent_per_py,
                    monthly_rent: partialData.monthly_rent,
                    monthly_management_per_py: partialData.monthly_management_per_py,
                    monthly_management_fee: partialData.monthly_management_fee,
                    increase_conditions_for_deposit: partialData.increase_conditions_for_deposit,
                    increase_conditions_for_rent: partialData.increase_conditions_for_rent,
                    increase_conditions_for_management_fee: partialData.increase_conditions_for_management_fee,
                    rent_free: partialData.rent_free,
                    fit_out: partialData.fit_out,
                };
                
                if (partialId) {
                    // 기존 유닛: UPDATE
                    return tx.floorPartial.update({
                        where: { id: partialId },
                        data: partialUpdateData as LocalFloorPartialUpdateInput,
                    });
                } else {
                    // 새 유닛: CREATE
                    return tx.floorPartial.create({
                        data: { ...partialUpdateData, floor_id: currentFloor.id } as LocalFloorPartialCreateInput,
                    });
                }
            });

            // 모든 Partial 쓰기 작업 실행
            await Promise.all(partialWrites);
            
            // 💡 최적화: Floor Update/Create 시 이미 Partial을 포함하여 가져왔으므로,
            // 별도의 findUniqueOrThrow 호출 없이 현재 Floor 데이터를 다시 가져와야 합니다.
            // 하지만 PartialWrites로 인해 currentFloor의 floorPartial은 구버전이므로, 
            // 가장 최신 데이터를 다시 조회합니다. (이 부분은 유지보수가 용이하도록 트레이드오프를 가져갑니다.)
            const finalFloor = await tx.floor.findUniqueOrThrow({
                where: { id: currentFloor.id },
                include: { floorPartial: true }, // FloorPartial 정보를 포함하여 응답 준비
            });
            updatedFloors.push(finalFloor);
        }

        return updatedFloors;
    });

    // 2. 응답 시 Pinia 스토어의 `Floor` 타입(camelCase)에 맞게 변환하여 반환
    // console.log(result[0].floorPartial)
    // console.log(result.map(transformFloorToResponse));
    return result.map(transformFloorToResponse);

});