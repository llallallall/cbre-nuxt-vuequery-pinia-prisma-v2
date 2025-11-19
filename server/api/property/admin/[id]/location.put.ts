// server/api/property/[id]/location.put.ts

import { defineEventHandler, readBody, getRouterParam, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';
import type { LocationType, CbreAsset } from '~/types/asset.type';

// 1. 클라이언트에서 전송되는 Payload 타입 (asset.type.ts의 LocationType과 동일)
type LocationUpdatePayload = LocationType;

// 2. 클라이언트에 반환할 응답 타입 (Pinia Store 업데이트용)
interface PropertyLocationResponse {
  propertyId: string;
  location: LocationType | null;
}

export default defineEventHandler(async (event): Promise<PropertyLocationResponse> => {
  const propertyId = getRouterParam(event, 'id');
  if (!propertyId) {
    throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
  }

  const body: LocationUpdatePayload = await readBody(event);

  try {
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Location 테이블 Upsert (snake_case로 변환)
      // property_id가 @unique이므로 upsert가 이 관계에 가장 적합합니다.
      await tx.location.upsert({
        where: {
          property_id: propertyId, // property_id로 검색
        },
        update: {
          // camelCase(body) -> snake_case(DB)
          address_full: body.addressFull,
          address_full_jibun: body.addressFullJibun,
          address_province: body.addressProvince,
          address_city: body.addressCity,
          latitude: body.latitude,
          longitude: body.longitude,
        },
        create: {
          property_id: propertyId, // 생성 시 property_id 필수
          address_full: body.addressFull,
          address_full_jibun: body.addressFullJibun,
          address_province: body.addressProvince,
          address_city: body.addressCity,
          latitude: body.latitude,
          longitude: body.longitude,
        },
      });

      // 2. Pinia 스토어 동기화를 위해 업데이트된 Property 정보 반환
      const updatedProperty = await tx.property.findUnique({
        where: { id: propertyId },
        select: {
          id: true,
          location: true, // 업데이트된 location 정보 포함
        },
      });

      if (!updatedProperty) {
         throw createError({ statusCode: 404, statusMessage: 'Property not found after update.' });
      }

      // 3. Pinia CbreAsset 구조에 맞게 매핑하여 반환 (snake_case -> camelCase)
      const mappedResult: PropertyLocationResponse = {
        propertyId: updatedProperty.id,
        location: updatedProperty.location ? {
          addressFull: updatedProperty.location.address_full ?? '',
          addressFullJibun: updatedProperty.location.address_full_jibun ?? '',
          addressProvince: updatedProperty.location.address_province ?? '',
          addressCity: updatedProperty.location.address_city ?? '',
          latitude: updatedProperty.location.latitude ?? null,
          longitude: updatedProperty.location.longitude ?? null,
        } : null,
      };

      return mappedResult;
    });

    return result;

  } catch (e: any) {
    console.error('Property Location Update Error:', e);
    
    if (e instanceof Prisma.PrismaClientKnownRequestError) { 
        throw createError({ statusCode: 500, statusMessage: `Database Error: ${e.message}` });
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to update property location.' });
  }
});