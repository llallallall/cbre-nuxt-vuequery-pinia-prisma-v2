// server/api/property/[id]/facility.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';

// 프론트엔드에서 보내는 Payload 구조 (Facility.vue 참조)
interface FacilityUpdatePayload {
        elevators: {
                total: number;
                passenger: number;
                service: number;
                shuttle: number; // FE: shuttle -> DB: freight
        };
        parking: {
                cpsExisting: number;
                cpsRequired: number;
                freeCpsSqm: number | null;
                freeCpsPy: number | null;
                paidParkingFee: number | null;
        };
        materials: {
                roofMaterial: string | null;
                facade: string | null;
                mechanicalElectrical: number | null;
                lighting: string | null;
                fireFighting: string | null;
        };
}

export default defineEventHandler(async (event) => {
        const { id: propertyId } = getRouterParams(event);
        const body = await readBody<FacilityUpdatePayload>(event);

        if (!propertyId) {
                throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
        }

        // 데이터 매핑 (camelCase -> snake_case)
        const dbData = {
                // Elevators
                elevators_total: body.elevators?.total ?? 0,
                elevators_passenger: body.elevators?.passenger ?? 0,
                elevators_service: body.elevators?.service ?? 0,
                elevators_freight: body.elevators?.shuttle ?? 0,

                // Parking
                cps_existing: body.parking?.cpsExisting ?? 0,
                cps_required: body.parking?.cpsRequired ?? 0,
                free_cps_sqm: body.parking?.freeCpsSqm,
                free_cps_py: body.parking?.freeCpsPy,
                paid_parking_fee: body.parking?.paidParkingFee,

                // Materials
                roof_material: body.materials?.roofMaterial,
                facade: body.materials?.facade,
                mechanical_electrical: body.materials?.mechanicalElectrical,
                lighting: body.materials?.lighting,
                fire_fighting: body.materials?.fireFighting,
        };

        try {
                const updated = await prisma.facility.upsert({
                        where: { property_id: propertyId },
                        update: dbData,
                        create: { property_id: propertyId, ...dbData },
                });

                // 결과 반환 (Nested 구조 복원)
                return {
                        elevators: {
                                total: updated.elevators_total,
                                passenger: updated.elevators_passenger,
                                service: updated.elevators_service,
                                shuttle: updated.elevators_freight
                        },
                        parking: {
                                cpsExisting: updated.cps_existing,
                                cpsRequired: updated.cps_required,
                                freeCpsSqm: updated.free_cps_sqm,
                                freeCpsPy: updated.free_cps_py,
                                paidParkingFee: updated.paid_parking_fee
                        },
                        materials: {
                                roofMaterial: updated.roof_material,
                                facade: updated.facade,
                                mechanicalElectrical: updated.mechanical_electrical,
                                lighting: updated.lighting,
                                fireFighting: updated.fire_fighting
                        }
                };

        } catch (e: any) {
                console.error('Facility Update Error:', e);
                throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to update facility info.',
                        data: e.message
                });
        }
});