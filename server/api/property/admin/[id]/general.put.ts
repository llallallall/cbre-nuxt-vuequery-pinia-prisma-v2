// server/api/property/[id]/general.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';

// 💡 [개선] 매퍼 및 타입 임포트
import {
  mapClientWarehouseToPrisma,
  mapPrismaGeneralToClient,
  PrismaPropertyWithGeneral,
  PropertyGeneralResponse // 클라이언트 응답 타입
} from '~/utils/assetMapper';

import type { GeneralType, WarehouseType } from '~/types/asset.type';


// 프론트엔드 (General.vue)에서 넘어오는 Payload 타입 정의
interface GeneralUpdatePayload {
  propertyName: string;
  sectorId?: string;
  subSectorId?: string;
  warehouse: WarehouseType;
}

// 프론트엔드 Pinia Store에 반환할 데이터의 타입
interface PropertyGeneralResponse {
  propertyId: string;
  propertyName: string;
  general: GeneralType;
}


export default defineEventHandler(async (event): Promise<PropertyGeneralResponse> => {
  const params = getRouterParams(event);
  const propertyId = params.id;

  if (!propertyId) {
    throw createError({ statusCode: 400, statusMessage: 'Property ID is missing.' });
  }

  const payload: GeneralUpdatePayload = await readBody(event);
  const { propertyName, sectorId, subSectorId, warehouse } = payload;

  // 트랜잭션을 사용하여 원자성(Atomicity) 보장
  try {
    const result = await prisma.$transaction(async (tx) => {

      // 1. Property.name 업데이트
      await tx.property.update({
        where: { id: propertyId },
        data: { name: propertyName },
      });

      // 2. General 레코드 upsert 처리
      let generalRecord = await tx.general.findUnique({
        where: { property_id: propertyId },
        select: { id: true }
      });

      const generalData = {
        sector_id: sectorId,
        sub_sector_id: subSectorId,
      };

      if (generalRecord) {
        await tx.general.update({
          where: { id: generalRecord.id },
          data: generalData,
        });
      } else {
        generalRecord = await tx.general.create({
          data: {
            property_id: propertyId,
            ...generalData,
          },
        });
      }

      const generalId = generalRecord.id;

      // 3. Warehouse 레코드 업데이트 (기존 삭제 후 새로운 레코드 삽입)
      // 💡 [개선] 매퍼 사용: 클라이언트 WarehouseType -> Prisma WarehouseCreateManyInput
      const warehousePrismaPayload = mapClientWarehouseToPrisma(warehouse, generalId);

      // 기존 Warehouse 레코드 삭제
      await tx.warehouse.deleteMany({
        where: { general_id: generalId },
      });

      // 새로운 Warehouse 레코드 생성
      if (warehousePrismaPayload.length > 0) {
        await tx.warehouse.createMany({
          data: warehousePrismaPayload,
          skipDuplicates: true,
        });
      }


      // 4. 업데이트된 전체 Property 레코드 조회
      // (매퍼에서 필요로 하는 include 구조 유지)
      const updatedProperty = await tx.property.findUnique({
        where: { id: propertyId },
        include: {
          general: {
            include: {
              sector: true,
              sub_sector: true,
              warehouse: true,
            },
          },
        },
      }) as PrismaPropertyWithGeneral;

      if (!updatedProperty || !updatedProperty.general) {
        throw createError({ statusCode: 404, statusMessage: 'Property or General data not found after update.' });
      }

      // 5. Pinia CbreAsset 구조에 맞게 매퍼를 사용하여 매핑하여 반환
      // 💡 [개선] 매퍼 사용: DB Read Payload -> Client Response
      return mapPrismaGeneralToClient(updatedProperty);
    });

    return result;

  } catch (e) {
    console.error('Property General Update Error:', e);

    // Prisma 에러 처리
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Property not found.' });
    }

    // 기타 에러 처리
    throw createError({ statusCode: 500, statusMessage: 'Failed to update property general record.' });
  }
});