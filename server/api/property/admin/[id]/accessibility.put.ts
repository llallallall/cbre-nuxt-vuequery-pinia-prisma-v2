// server/api/property/[id]/accessibility.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';
import type { AccessibilityType } from '~/types/property.type';

// 프론트엔드에서 오는 Payload (camelCase)
type AccessibilityUpdatePayload = AccessibilityType;

export default defineEventHandler(async (event) => {
        const { id: propertyId } = getRouterParams(event);
        const body = await readBody<AccessibilityUpdatePayload>(event);

        if (!propertyId) {
                throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
        }

        try {
                // 1. Upsert 실행 (camelCase -> snake_case 매핑)
                const updated = await prisma.accessibility.upsert({
                        where: { property_id: propertyId },
                        update: {
                                distance_to_ic: body.distanceToIc,
                                time_taken_to_city_hall: body.timeTakenToCityHall,
                                time_taken_to_subway: body.timeTakenToSubway,
                                nearby_facilities: body.nearbyFacilities,
                                nearby_attractions: body.nearbyAttractions,
                                nearby_places: body.nearbyPlaces,
                        },
                        create: {
                                property_id: propertyId,
                                distance_to_ic: body.distanceToIc,
                                time_taken_to_city_hall: body.timeTakenToCityHall,
                                time_taken_to_subway: body.timeTakenToSubway,
                                nearby_facilities: body.nearbyFacilities,
                                nearby_attractions: body.nearbyAttractions,
                                nearby_places: body.nearbyPlaces,
                        },
                });

                // 2. 결과 반환 (snake_case -> camelCase 매핑)
                return {
                        distanceToIc: updated.distance_to_ic,
                        timeTakenToCityHall: updated.time_taken_to_city_hall,
                        timeTakenToSubway: updated.time_taken_to_subway,
                        nearbyFacilities: updated.nearby_facilities,
                        nearbyAttractions: updated.nearby_attractions,
                        nearbyPlaces: updated.nearby_places,
                };

        } catch (e: any) {
                console.error('Accessibility Update Error:', e);
                throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to update accessibility info.',
                        data: e.message
                });
        }
});