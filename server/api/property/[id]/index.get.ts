// /server/api/property/[id].get.ts

import prisma from '@/prisma/cbredb'
import { getRouterParams } from 'h3'
// Prisma Enum types
import { Prisma, TransactionType, TemperatureType } from '@prisma/client'

// 💡 [Import: Asset Mappers] assetMapper의 모든 함수를 가져옵니다.
import {
  mapGeneralToClient,
  mapHistoryListToClient,
  mapLocationToClient,
  mapAccessibilityToClient,
  mapScaleToSizes,
  mapProfitabilityToClient,
  mapFacilityToClient,
  mapFloorListToClient,
} from '~/utils/assetMapper'

// 💡 [Import: File Mappers] fileMapper의 모든 함수를 가져옵니다.
import {
  mapFloorPlanListToClient,
  mapPhotoListToClient,
  mapBrochureListToClient,
} from '~/utils/fileMapper'

// 💡 [Import: Transaction Mappers & Utils]
// 🚨 [수정] 양방향 매핑 변경에 따라 함수 이름 수정: mapSaleDetail -> mapSaleDetailToClient, mapLeaseDetail -> mapLeaseDetailToClient
import {
  mapSaleDetailFromPrismaToClient, // 변경된 함수 이름 적용
  mapLeaseDetailFromPrismaToClient, // 변경된 함수 이름 적용
  dateToString, // 날짜 매핑 헬퍼 함수
} from '~/utils/transactionMapper'
import { calculateSaleInfo, calculateLeaseInfo } from '~/utils/transactionUtils'

// 💡 [타입 Import] asset.type.ts에 정의된 모든 주요 타입들을 import 합니다.
import {
  CbreAsset,
  FloorType,
  HistoryType,
  TransactionInfoType,
  SaleInfoType,
  LeaseInfoType,
  GeneralType,
  AccessibilityType,
  SizesType,
  ProfitabilityType,
  FacilityType,
  FloorPlanPhotoListType,
  AssetPhotoType,
  FileType,
  LocationType,
  SaleDetailType,
  LeaseDetailType,
} from '~/types/property.type'


// =======================================================
// 1. Prisma 쿼리 타입 정의
// =======================================================
// 필요한 모든 관계(relation) 포함
const propertyWithRelations = Prisma.validator<Prisma.PropertyDefaultArgs>()({
  include: {
    sector: true,
    subsector: true,
    location: true,
    accessibility: true,
    scale: true,
    profitability: true,
    facility: true,
    history: true,
    warehouse: true, // Warehouse는 별도의 모델
    floor: {
      include: {
        floorPartial: true,
      },
    },
    floorPlanFile: true,
    propertyImageFile: true,
    propertyBrochureFile: true,
    transaction: {
      include: {
        sale: true,
        lease: true,
      },
      orderBy: {
        execution_date: 'desc', // 최신 트랜잭션이 위로 오도록 정렬
      },
    },
  },
})

// 최종 Prisma 조회 결과 타입 정의
export type PrismaPropertyWithRelations = Prisma.PropertyGetPayload<
  typeof propertyWithRelations
>


// =======================================================
// 2. API Handler
// =======================================================

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Property ID is required',
    })
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id },
      ...propertyWithRelations,
    })

    if (!property) {
      throw createError({
        statusCode: 404,
        statusMessage: `Property with ID ${id} not found`,
      })
    }


    // ------------------------------------------------------------------
    // 3. Mapping DB Models to Client Types (Updated to use mappers)
    // ------------------------------------------------------------------

    // 💡 [매퍼 사용] 1. 일반 정보 (Sector, SubSector, Warehouse)
    const general: GeneralType = mapGeneralToClient(
      property.sector!,
      property.subsector,
      property.warehouse
    )

    // 💡 [매퍼 사용] 2. 역사 정보
    const historyList: HistoryType[] = mapHistoryListToClient(property.history)

    // 💡 [매퍼 사용] 3. 위치 정보
    const location: LocationType = mapLocationToClient(property.location)

    // 💡 [매퍼 사용] 4. 접근성 정보
    const accessibility: AccessibilityType = mapAccessibilityToClient(
      property.accessibility
    )

    // 💡 [매퍼 사용] 5. 규모 정보
    const sizes: SizesType = mapScaleToSizes(property.scale)

    // 💡 [매퍼 사용] 6. 수익성 정보
    const profitability: ProfitabilityType = mapProfitabilityToClient(
      property.profitability
    )

    // 💡 [매퍼 사용] 7. 시설 정보
    const facility: FacilityType = mapFacilityToClient(property.facility)

    // 💡 [매퍼 사용] 8. 층 정보
    const floorList: FloorType[] = mapFloorListToClient(property.floor)

    // 💡 [매퍼 사용] 9. 파일 정보 (도면, 사진, 브로슈어)
    const floorPlanPhotos: FloorPlanPhotoListType = mapFloorPlanListToClient(
      property.floorPlanFile
    )
    const assetPhotos: AssetPhotoType[] = mapPhotoListToClient(
      property.propertyImageFile
    )
    const brochures: FileType[] = mapBrochureListToClient(
      property.propertyBrochureFile
    )

    // 💡 [매퍼/유틸 사용] 10. 트랜잭션 정보
    const mappedTransactions: TransactionInfoType[] = property.transaction.map(
      (t) => {
        // 🚨 [수정 반영: 1:1 관계] t.sale과 t.lease는 단일 객체(Sale | Lease)이거나 null입니다.
        // t.sale이 null이 아닌 경우에만 mapSaleDetail에 t.sale 단일 객체를 직접 전달하도록 수정합니다.
        const saleDetail = t.sale
          ? mapSaleDetailFromPrismaToClient(t.sale) // 단일 객체 전달 (mapSaleDetailToClient와 동일한 기능으로 가정)
          : null

        const leaseDetail = t.lease
          ? mapLeaseDetailFromPrismaToClient(t.lease) // 단일 객체 전달 (mapLeaseDetailToClient와 동일한 기능으로 가정)
          : null

        return {
          id: t.id,
          propertyId: t.property_id,
          type: t.type as TransactionType, // Prisma Enum 타입 사용
          year: t.year,
          quarter: t.quarter,
          executionDate: dateToString(t.execution_date), // 날짜 포맷팅
          saleDetail: saleDetail,
          leaseDetail: leaseDetail,
        } as TransactionInfoType
      }
    )

    // 트랜잭션 유틸리티 함수를 사용하여 요약 정보를 계산합니다.
    const saleInfo: SaleInfoType = calculateSaleInfo(mappedTransactions)
    const leaseInfo: LeaseInfoType = calculateLeaseInfo(mappedTransactions)

    // ------------------------------------------------------------------
    // 4. 최종 CbreAsset 객체 구성
    // ------------------------------------------------------------------
    const cbreAsset: CbreAsset = {
      // Property 테이블의 기본 정보
      propertyId: property.id,
      propertyName: property.name,

      // 매핑된 정보
      general: general,
      historyList: historyList,
      location: location,
      accessibility: accessibility,
      sizes: sizes,
      profitability: profitability,
      facility: facility,
      floorList: floorList,

      // 트랜잭션 정보
      transactionInfo: {
        totalTransactions: mappedTransactions.length,
        transactionsList: mappedTransactions,
      },

      saleInfo: saleInfo,
      leaseInfo: leaseInfo,

      // 파일 정보
      floorPlanPhotoList: floorPlanPhotos,
      photoList: assetPhotos,
      brochureList: brochures,
    }

    return cbreAsset
  } catch (error) {
    console.error('Failed to fetch property details:', error)
    // 에러를 상위로 전파
    throw error
  }
})