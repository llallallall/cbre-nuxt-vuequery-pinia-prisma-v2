// server/api/property/admin/[id]/location.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';
import type { LocationType } from '~/types/property.type';

// Payload 타입 정의
type LocationUpdatePayload = LocationType;

export default defineEventHandler(async (event) => {
  const { id: propertyId } = getRouterParams(event);

  if (!propertyId) {
    throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
  }

  const body = await readBody<LocationUpdatePayload>(event);

  try {
    const result = await prisma.$transaction(async (tx) => {

      // 1. Location 테이블 Upsert (snake_case 매핑)
      const updated = await tx.location.upsert({
        where: {
          property_id: propertyId,
        },
        update: {
          address_full: body.addressFull,
          address_full_jibun: body.addressFullJibun,
          address_province: body.addressProvince,
          address_city: body.addressCity,
          latitude: body.latitude,
          longitude: body.longitude,
        },
        create: {
          property_id: propertyId,
          address_full: body.addressFull,
          address_full_jibun: body.addressFullJibun,
          address_province: body.addressProvince,
          address_city: body.addressCity,
          latitude: body.latitude,
          longitude: body.longitude,
        },
      });

      // 2. 응답 매핑 (camelCase)
      return {
        id: updated.id,
        propertyId: updated.property_id,
        addressFull: updated.address_full,
        addressFullJibun: updated.address_full_jibun,
        addressProvince: updated.address_province,
        addressCity: updated.address_city,
        latitude: updated.latitude,
        longitude: updated.longitude,
      };
    });

    return result;

  } catch (e: any) {
    console.error('Location Update Error:', e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw createError({ statusCode: 500, statusMessage: `Database Error: ${e.message}` });
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to update location.' });
  }
});