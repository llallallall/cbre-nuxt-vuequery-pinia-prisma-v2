// server/api/property/[id]/facility.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb'; // Prisma 클라이언트 import (프로젝트 경로 가정)
import { Prisma } from '@prisma/client';
// 사용자가 제공한 최종 타입 정의 사용
import type { ElevatorsType, ParkingType, MaterialsType } from '~/types/asset.type';

// 프론트엔드 (FacilityForm.vue)에서 넘어오는 Payload 타입 정의 (FE camelCase)
// 폼 입력에서 문자열로 넘어올 수 있는 숫자 필드를 허용합니다.
interface FacilityUpdateInput {
        elevators: {
                total: number | string | null;
                passenger: number | string | null;
                service: number | string | null;
                shuttle: number | string | null; // DB: elevators_freight에 매핑됨
        };
        parking: {
                cpsExisting: number | null;
                cpsRequired: number | null;
                freeCpsSqm: number | null;
                freeCpsPy: number | null;
                paidParkingFee: number | null;
        };
        materials: {
                roofMaterial: string | null; // DB: roof_material에 매핑됨
                facade: string | null;
                mechanicalElectrical: number | string | null; // DB: mechanical_electrical에 매핑됨
                lighting: string | null;
                fireFighting: string | null; // DB: fire_fighting에 매핑됨
        };
}

// 프론트엔드 Pinia Store에 반환할 데이터의 타입 (Partial<CbreAsset> 구조)
interface PropertyFacilityResponse {
        propertyId: string;
        facility: {
                elevators: ElevatorsType | null;
                parking: ParkingType | null;
                materials: MaterialsType | null;
        }
}

// Helper function: Null을 허용하지 않는 Int 필드 클리닝 (null -> 0으로 변환)
const cleanRequiredInt = (value: number | string | null | undefined): number => {
        if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                // DB 모델에서 @default(0)이므로, null 대신 0을 반환하여 타입 오류 방지
                return 0;
        }
        const numValue = Number(value);
        // 숫자가 아니거나 NaN이면 0을 반환
        return isNaN(numValue) ? 0 : Math.floor(numValue);
};

// Helper function: Null을 허용하는 Int/Float 필드 클리닝 (null/빈 문자열 -> null 유지)
const cleanNullableNumeric = (value: number | string | null | undefined): number | null => {
        if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                return null;
        }
        const numValue = Number(value);
        return isNaN(numValue) ? null : numValue;
};

// Helper function: 문자열 필드 클리닝 (이전과 동일)
const cleanStringValue = (value: string | null | undefined): string | null => {
        if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                return null;
        }
        return String(value);
};


export default defineEventHandler(async (event): Promise<PropertyFacilityResponse> => {
        const params = getRouterParams(event);
        const propertyId = params.id;

        if (!propertyId) {
                throw createError({ statusCode: 400, statusMessage: 'Property ID is missing.' });
        }

        const payload: FacilityUpdateInput = await readBody(event);

        // DB 업데이트를 위한 단일 객체 매핑
        const facilityData = {
                // Elevators Mapping (Int @default(0)이므로 cleanRequiredInt 사용)
                elevators_total: cleanRequiredInt(payload.elevators.total),
                elevators_passenger: cleanRequiredInt(payload.elevators.passenger),
                elevators_service: cleanRequiredInt(payload.elevators.service),
                elevators_freight: cleanRequiredInt(payload.elevators.shuttle),

                // Elevators Mapping (Int @default(0)이므로 cleanRequiredInt 사용)
                cps_existing: cleanRequiredInt(payload.parking.cpsExisting),
                cps_required: cleanRequiredInt(payload.parking.cpsRequired),
                free_cps_sqm: cleanNullableNumeric(payload.parking.freeCpsSqm),
                free_cps_py: cleanNullableNumeric(payload.parking.freeCpsPy),
                paid_parking_fee: cleanRequiredInt(payload.parking.paidParkingFee),

                // Materials Mapping (String? 및 Int? 이므로 cleanNullableNumeric/cleanStringValue 사용)
                roof_material: cleanStringValue(payload.materials.roofMaterial),
                facade: cleanStringValue(payload.materials.facade),
                mechanical_electrical: cleanNullableNumeric(payload.materials.mechanicalElectrical), // Int? (Nullable)
                lighting: cleanStringValue(payload.materials.lighting),
                fire_fighting: cleanStringValue(payload.materials.fireFighting),
        };

        // NOTE: Parking 필드는 Facility.vue에서 수정하지 않으므로 payload에 포함하지 않음.
        // 이 API는 Facility 모델의 해당 필드만 업데이트합니다.

        try {
                // 1. Property ID에 연결된 Facility를 찾거나 생성하고, 데이터를 업데이트합니다.
                const updatedFacility = await prisma.facility.upsert({
                        where: { property_id: propertyId },
                        update: facilityData,
                        create: {
                                property_id: propertyId,
                                ...facilityData,
                        },
                        select: {
                                property_id: true,
                                elevators_total: true,
                                elevators_passenger: true,
                                elevators_service: true,
                                elevators_freight: true,

                                cps_existing: true,
                                cps_required: true,
                                free_cps_sqm: true,
                                free_cps_py: true,
                                paid_parking_fee: true,

                                roof_material: true,
                                facade: true,
                                mechanical_electrical: true,
                                lighting: true,
                                fire_fighting: true,
                        }
                });

                // 2. Pinia Store 구조에 맞게 매핑하여 반환 (DB snake_case -> FE camelCase)
                const mappedResult: PropertyFacilityResponse = {
                        propertyId: updatedFacility.property_id,
                        facility: {
                                elevators: {
                                        total: updatedFacility.elevators_total,
                                        passenger: updatedFacility.elevators_passenger,
                                        service: updatedFacility.elevators_service,
                                        shuttle: updatedFacility.elevators_freight, // DB freight -> FE shuttle 매핑
                                } as ElevatorsType,
                                parking: {
                                        cpsExisting: updatedFacility.cps_existing,
                                        cpsRequired: updatedFacility.cps_required,
                                        freeCpsSqm: updatedFacility.free_cps_sqm,
                                        freeCpsPy: updatedFacility.free_cps_py,
                                        paidParkingFee: updatedFacility.paid_parking_fee,
                                } as ParkingType,
                                materials: {
                                        roofMaterial: updatedFacility.roof_material, // DB roof_material -> FE roofMaterial 매핑
                                        facade: updatedFacility.facade,
                                        mechanicalElectrical: updatedFacility.mechanical_electrical, // DB mechanical_electrical -> FE mechanicalElectrical 매핑
                                        lighting: updatedFacility.lighting,
                                        fireFighting: updatedFacility.fire_fighting, // DB fire_fighting -> FE fireFighting 매핑
                                } as MaterialsType,
                        },
                };

                return mappedResult;

        } catch (e) {
                console.error('시설 정보 업데이트 API 오류:', e);

                if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                        throw createError({ statusCode: 404, statusMessage: 'Associated resource not found.' });
                }

                throw createError({ statusCode: 500, statusMessage: 'Internal server error during facility update.' });
        }
});