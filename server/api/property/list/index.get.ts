// server/api/property/list/index.get.ts

import { defineEventHandler, createError } from 'h3';
import prisma from '@/prisma/cbredb';
// PropertyType 전체를 반환하기엔 너무 무거우므로, 리스트용 경량 타입을 사용하거나
// 필요한 필드만 매핑하여 반환합니다. (여기서는 AdminListType 재활용 또는 유사 구조 사용)
import type { PropertyType } from '~/types/property.type';

export default defineEventHandler(async (event) => {
    try {
        // 1. DB 조회 (공개된 자산만 필터링하는 로직이 필요하다면 where 절 추가)
        const assetsList = await prisma.property.findMany({
            select: {
                id: true,
                name: true,
                updated_at: true,

                location: {
                    select: {
                        address_full: true,
                        address_province: true,
                        address_city: true,
                        latitude: true,
                        longitude: true,
                    }
                },
                sector: { select: { name: true } },
                subsector: { select: { name: true } },
                scale: {
                    select: {
                        gfa_sqm: true,
                        gfa_py: true,
                        // 필요한 다른 Scale 정보 추가
                    }
                },
                profitability: { select: { grade: true, effective_ratio: true } },

                propertyImageFile: {
                    select: { file_url: true },
                    orderBy: [{ main: 'desc' }, { updated_at: 'desc' }],
                    take: 1
                },

                // 사용자 화면 필터링을 위한 추가 정보 (예: Transaction 유무 등)
                transaction: {
                    select: { type: true },
                    take: 1 // 존재 여부 확인용
                }
            },
            orderBy: [
                { updated_at: 'desc' }
            ]
        });

        // 2. 매핑 (PropertyType의 부분 집합 또는 리스트 전용 타입으로 반환)
        // 여기서는 PropertyStore의 'initialAllAssets'에 들어갈 데이터 구조로 변환합니다.
        // PropertyType 전체 구조를 맞추되, 로드되지 않은 데이터는 null/빈 배열로 처리합니다.

        const mappedData: Partial<PropertyType>[] = assetsList.map((asset) => {
            return {
                id: asset.id,
                name: asset.name,

                // 1:1 Relations (존재하는 데이터만 매핑)
                sector: asset.sector ? { id: '', name: asset.sector.name } : null,
                subsector: asset.subsector ? { id: '', sectorId: '', name: asset.subsector.name } : null,

                location: asset.location ? {
                    id: '', propertyId: asset.id,
                    addressFull: asset.location.address_full,
                    addressFullJibun: null, // select 안함
                    addressProvince: asset.location.address_province,
                    addressCity: asset.location.address_city,
                    latitude: asset.location.latitude,
                    longitude: asset.location.longitude,
                    createdAt: new Date(), updatedAt: new Date() // Dummy
                } : null,

                scale: asset.scale ? {
                    // ... Scale 타입의 필수 필드들을 채워야 함 (null 허용 시 생략 가능)
                    // 여기서는 UI 필터링에 주로 쓰이는 면적 정보만 매핑
                    id: '', propertyId: asset.id,
                    gfaSqm: asset.scale.gfa_sqm,
                    gfaPy: asset.scale.gfa_py,
                    // 나머지 필수 필드는 Type Assertion이나 Default 값 처리 필요
                } as any : null,

                profitability: asset.profitability ? {
                    id: '', propertyId: asset.id,
                    grade: asset.profitability.grade,
                    effectiveRatio: asset.profitability.effective_ratio,
                    createdAt: new Date(), updatedAt: new Date()
                } : null,

                // Files
                propertyImageFile: asset.propertyImageFile.map(img => ({
                    id: '', propertyId: asset.id, main: true,
                    fileUrl: img.file_url,
                    fileUuid: null, fileName: null, fileKey: null, fileContentType: null,
                    createdAt: new Date(), updatedAt: new Date()
                })),

                // 1:N Relations (빈 배열)
                warehouse: [],
                history: [],
                propertyBrochureFile: [],
                floor: [],
                floorPlanFile: [],

                // 필터링용 Transaction 정보 (간소화)
                transaction: asset.transaction.map(t => ({
                    id: '', propertyId: asset.id,
                    type: t.type,
                    year: '', quarter: '', executionDate: new Date(),
                    createdAt: new Date(), updatedAt: new Date(),
                    sale: null, lease: null
                }))
            };
        });

        return mappedData;

    } catch (error) {
        console.error('Main List 조회 실패:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to retrieve property list' });
    }
});