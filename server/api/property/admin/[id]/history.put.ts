// server/api/upload/[id]/history.put.ts

import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb'; 
import { HistoryType } from '@prisma/client';
import type { HistoryType as ClientHistoryType } from '~/types/asset.type'; 

// 클라이언트에서 전송되는 Payload 타입 정의
interface HistoryUpdatePayload {
  historyList: ClientHistoryType[];
}

export default defineEventHandler(async (event) => {
  const propertyId = event.context.params?.id;
  if (!propertyId) {
    throw createError({ statusCode: 400, statusMessage: 'Property ID is missing.' });
  }

  const body = await readBody<HistoryUpdatePayload>(event);
  const { historyList } = body;

  if (!historyList) {
     throw createError({ statusCode: 400, statusMessage: 'History list data is required.' });
  }

  try {
    const updatedAsset = await prisma.$transaction(async (tx) => {
      
      // 1. [쓰기 작업] 기존 History 레코드 삭제 (property_id 기준으로)
      // 이 작업은 History 테이블만 대상으로 합니다.
      await tx.history.deleteMany({
        where: { property_id: propertyId },
      });

      // 2. [쓰기 작업] 새로운 History 레코드 생성
      // 이 작업 역시 History 테이블만 대상으로 합니다.
      const validHistoryList = historyList
        .filter(item => item.year && item.type) 
        .map(item => ({
          property_id: propertyId,
          year: String(item.year),
          type: item.type as HistoryType, 
        }));
        
      if (validHistoryList.length > 0) {
        await tx.history.createMany({
          data: validHistoryList,
        });
      }
      
      // 3. [조회 작업] 업데이트 후의 전체 자산 데이터 조회 및 반환
      // 클라이언트의 Pinia Store를 업데이트하기 위해 Property 테이블을 시작점으로 
      // 모든 관계(history 포함)를 포함하여 조회합니다.
      const fetchedAsset = await tx.property.findUnique({
        where: { id: propertyId },
        include: {
          history: { // 업데이트된 history 관계를 포함하여 조회
            select: { id: true, property_id: true, year: true, type: true },
            orderBy: { year: 'asc' }, 
          },
          profitability: true,
          // ... 클라이언트 store 업데이트에 필요한 기타 모든 관계들을 포함 (생략)
          // general: { include: { sector: true, subsector: true, warehouse: true } }, 
          // location: true,
          // accessibility: true,
          // ...
        }
      });
      
      if (!fetchedAsset) {
        throw createError({ statusCode: 404, statusMessage: 'Property not found after update.' });
      }

      // 조회된 전체 객체를 클라이언트에 반환합니다.
      return fetchedAsset;
    });

    return updatedAsset;

  } catch (e) {
    console.error(`Error updating asset history for ID ${propertyId}:`, e);
    // ... 오류 처리
    throw createError({ statusCode: 500, statusMessage: 'Failed to update property history.' });
  }
});