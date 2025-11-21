// server/api/property/admin/[id]/general.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma, TemperatureType } from '@prisma/client';
import type { TemperatureTypeEnum } from '~/types/property.type';

interface GeneralUpdatePayload {
  name: string;
  sectorId: string;
  subsectorId?: string | null;
  warehouse: {
    temperatureType: TemperatureTypeEnum;
    ratio: number | null;
  }[];
}

export default defineEventHandler(async (event) => {
  const { id: propertyId } = getRouterParams(event);
  const body = await readBody<GeneralUpdatePayload>(event);

  if (!propertyId) {
    throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
  }

  // 필수 값 검증
  if (!body.name || !body.sectorId) {
    throw createError({ statusCode: 400, statusMessage: 'Name and Sector are required.' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {

      // 1. Property 기본 정보 업데이트
      const updatedProperty = await tx.property.update({
        where: { id: propertyId },
        data: {
          name: body.name,
          sector_id: body.sectorId,
          subsector_id: body.subsectorId,
        },
      });

      // 2. Warehouse 정보 업데이트 (삭제 후 재생성)
      await tx.warehouse.deleteMany({
        where: { property_id: propertyId },
      });

      if (body.warehouse && body.warehouse.length > 0) {
        await tx.warehouse.createMany({
          data: body.warehouse.map((item) => ({
            property_id: propertyId,
            temperature_type: item.temperatureType as TemperatureType,
            ratio: item.ratio,
          })),
        });
      }

      // 3. 최신 데이터 조회 (응답용)
      const fetchedData = await tx.property.findUnique({
        where: { id: propertyId },
        include: {
          sector: true,
          subsector: true,
          warehouse: true
        }
      });

      return fetchedData;
    });

    // 4. 응답 매핑 (간단히 변환하여 반환)
    // 클라이언트에서는 PropertyType 구조를 기대하므로 최소한의 필드는 맞춰줍니다.
    return {
      id: result?.id,
      name: result?.name,
      sectorId: result?.sector_id,
      subsectorId: result?.subsector_id,
      sector: result?.sector ? { id: result.sector.id, name: result.sector.name } : null,
      subsector: result?.subsector ? { id: result.subsector.id, name: result.subsector.name } : null,
      warehouse: result?.warehouse.map(w => ({
        temperatureType: w.temperature_type,
        ratio: w.ratio
      })) ?? []
    };

  } catch (e: any) {
    console.error('General Update Error:', e);
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Property not found.' });
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to update general info.', data: e.message });
  }
});