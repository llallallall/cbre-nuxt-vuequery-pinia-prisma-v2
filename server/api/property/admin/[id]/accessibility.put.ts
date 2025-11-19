// server/api/property/[id]/accessibility.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';
import type { AccessibilityType } from '~/types/asset.type'; // 타입 파일 경로 확인 필요

// API Payload 타입 (DB 스키마에 맞게 snake_case)
interface AccessibilityPayload {
        distance_to_ic: string | null;
        time_taken_to_city_hall: string | null;
        time_taken_to_subway: string | null;
        nearby_facilities: string | null;
        nearby_attractions: string | null;
        nearby_places: string | null;
}

// Pinia Store에 반환할 데이터의 타입 (AccessibilityType과 동일)
type AccessibilityResponse = AccessibilityType;

export default defineEventHandler(async (event): Promise<AccessibilityResponse> => {
        const params = getRouterParams(event);
        const propertyId = params.id;

        if (!propertyId) {
                throw createError({ statusCode: 400, statusMessage: 'Property ID is missing.' });
        }

        const payload = await readBody<AccessibilityPayload>(event);

        console.log('Received Accessibility Payload:', payload);

        try {
                // 1. Prisma를 사용하여 upsert (업데이트 또는 생성)
                const updatedAccessibility = await prisma.accessibility.upsert({
                        where: { property_id: propertyId },
                        update: {
                                distance_to_ic: payload.distance_to_ic,
                                time_taken_to_city_hall: payload.time_taken_to_city_hall,
                                time_taken_to_subway: payload.time_taken_to_subway,
                                nearby_facilities: payload.nearby_facilities,
                                nearby_attractions: payload.nearby_attractions,
                                nearby_places: payload.nearby_places,
                                //updated_at: new Date(),
                        },
                        create: {
                                property_id: propertyId,
                                distance_to_ic: payload.distance_to_ic,
                                time_taken_to_city_hall: payload.time_taken_to_city_hall,
                                time_taken_to_subway: payload.time_taken_to_subway,
                                nearby_facilities: payload.nearby_facilities,
                                nearby_attractions: payload.nearby_attractions,
                                nearby_places: payload.nearby_places,
                        },
                });

                // 2. Pinia CbreAsset 구조에 맞게 매핑하여 반환 (snake_case -> camelCase)
                const mappedResult: AccessibilityResponse = {
                        distanceToIc: updatedAccessibility.distance_to_ic ?? null,
                        timeTakenToCityHall: updatedAccessibility.time_taken_to_city_hall ?? null,
                        timeTakenToSubway: updatedAccessibility.time_taken_to_subway ?? null,
                        nearbyFacilities: updatedAccessibility.nearby_facilities ?? null,
                        nearbyAttractions: updatedAccessibility.nearby_attractions ?? null,
                        nearbyPlaces: updatedAccessibility.nearby_places ?? null,
                };

                return mappedResult;

        } catch (e) {
                console.error('Property Accessibility Update Error:', e);

                if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                        throw createError({ statusCode: 404, statusMessage: 'Property not found.' });
                }
                throw createError({ statusCode: 500, statusMessage: 'Failed to update accessibility information.' });
        }
});