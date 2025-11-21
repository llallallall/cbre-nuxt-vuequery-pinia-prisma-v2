// server/api/property/[id]/history.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { HistoryType as PrismaHistoryType } from '@prisma/client';
import type { HistoryType } from '~/types/property.type';

type HistoryUpdatePayload = HistoryType[]; // 배열

export default defineEventHandler(async (event) => {
  const { id: propertyId } = getRouterParams(event);
  const body = await readBody<HistoryUpdatePayload>(event);

  if (!propertyId) {
    throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. 기존 데이터 삭제
      await tx.history.deleteMany({
        where: { property_id: propertyId },
      });

      // 2. 새 데이터 생성
      if (body && body.length > 0) {
        await tx.history.createMany({
          data: body.map(h => ({
            property_id: propertyId,
            year: h.year,
            // Enum 매핑 (String -> Enum)
            type: h.type as PrismaHistoryType,
          }))
        });
      }
    });

    // 3. 최신 데이터 조회 및 반환
    const updatedHistories = await prisma.history.findMany({
      where: { property_id: propertyId },
      orderBy: { year: 'asc' }
    });

    return updatedHistories.map(h => ({
      id: h.id,
      year: h.year,
      type: h.type,
    }));

  } catch (e: any) {
    console.error('History Update Error:', e);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update history.',
      data: e.message
    });
  }
});