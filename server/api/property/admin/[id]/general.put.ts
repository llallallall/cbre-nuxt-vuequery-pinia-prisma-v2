// server/api/property/admin/[id]/general.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';
import type { TemperatureTypeEnum } from '~/types/property.type'; // TemperatureType Enum (ROOM, LOW, CONSTANT)

// 1. 프론트엔드에서 보내는 Payload 정의 (camelCase)
interface GeneralUpdatePayload {
  name: string;
  sectorId: string;
  subsectorId?: string | null;

  // Warehouse 리스트
  warehouse: {
    temperatureType: TemperatureTypeEnum;
    ratio: number | null;
  }[];
}

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const propertyId = params.id;

  if (!propertyId) {
    throw createError({ statusCode: 400, statusMessage: 'Property ID is missing.' });
  }

  const body = await readBody<GeneralUpdatePayload>(event);

  // 필수 값 검증
  if (!body.name || !body.sectorId) {
    throw createError({ statusCode: 400, statusMessage: 'Name and Sector are required.' });
  }

  try {
    // 트랜잭션으로 일괄 처리
    const result = await prisma.$transaction(async (tx) => {

      // [Step 1] Property 기본 정보 업데이트
      // 💡 핵심 수정: 프론트엔드(camelCase) -> DB(snake_case) 필드명 매칭
      await tx.property.update({
        where: { id: propertyId },
        data: {
          name: body.name,
          sector_id: body.sectorId,          // DB 컬럼명: sector_id
          subsector_id: body.subsectorId,    // DB 컬럼명: subsector_id
        },
      });

      // [Step 2] Warehouse 정보 업데이트 (전체 삭제 후 재생성)
      // 2-1. 기존 데이터 삭제
      await tx.warehouse.deleteMany({
        where: { property_id: propertyId },  // DB 컬럼명: property_id
      });

      // 2-2. 새로운 데이터 생성
      if (body.warehouse && body.warehouse.length > 0) {
        await tx.warehouse.createMany({
          data: body.warehouse.map((item) => ({
            property_id: propertyId,         // DB 컬럼명: property_id
            temperature_type: item.temperatureType, // DB 컬럼명: temperature_type
            ratio: item.ratio,
          })),
        });
      }

      // [Step 3] 업데이트된 최신 데이터 조회 (Relation 포함)
      const updatedProperty = await tx.property.findUnique({
        where: { id: propertyId },
        include: {
          sector: true,
          subsector: true,
          warehouse: true,
        },
      });

      return updatedProperty;
    });

    return result;

  } catch (e: any) {
    console.error('General Update Error:', e);

    // Prisma 에러 처리
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Property not found.' });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update property general info.',
      data: e.message
    });
  }
});