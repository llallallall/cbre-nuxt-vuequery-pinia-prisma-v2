// server/api/property/list/admin.get.ts

import { defineEventHandler, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import type { AdminListType } from '~/types/property.type';

export default defineEventHandler(async (event) => {
    try {
        // 1. DB에서 목록 데이터 조회
        // 리스트 뷰에 꼭 필요한 필드만 select하여 성능을 최적화합니다.
        const assetsList = await prisma.property.findMany({
            select: {
                id: true,
                name: true,
                created_at: true,
                updated_at: true,

                // 1:1 관계 (null 가능성 있음)
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
                profitability: { select: { grade: true } },

                // 1:N 관계: 이미지 중 Main 이미지를 최우선으로 1개만 가져옵니다.
                propertyImageFile: {
                    select: { file_url: true },
                    orderBy: [
                        { main: 'desc' }, // true가 먼저 옴
                        { updated_at: 'desc' }
                    ],
                    take: 1
                },
            },
            // 정렬 기준: 최신 수정일 순 -> 이름 순
            orderBy: [
                { updated_at: 'desc' },
                { name: 'asc' }
            ]
        });

        // 2. 데이터 매핑 (DB snake_case -> Client camelCase [AdminListType])
        const listData: AdminListType[] = assetsList.map((asset, index) => {
            // 메인 이미지 URL 추출 (없으면 null)
            const mainImageUrl = asset.propertyImageFile[0]?.file_url || null;

            return {
                // 목록 표시용 순번 (전체 개수부터 역순)
                no: assetsList.length - index,

                // 기본 정보
                propertyId: asset.id,
                propertyName: asset.name,
                mainImageUrl: mainImageUrl,

                // 분류 및 등급 (Relation이 없으면 빈 문자열/null 처리)
                grade: asset.profitability?.grade || null,
                sector: asset.sector?.name || 'N/A',
                subSector: asset.subsector?.name || null,

                // 위치 정보
                addressFull: asset.location?.address_full || null,
                addressProvince: asset.location?.address_province || null,
                addressCity: asset.location?.address_city || null,
                latitude: asset.location?.latitude || null,
                longitude: asset.location?.longitude || null,

                // 메타 데이터 (Admin 관리용)
                createdAt: asset.created_at,
                updatedAt: asset.updated_at
            };
        });

        // 3. 최종 결과 반환 (배열 직접 반환)
        // 프론트엔드에서는 response 자체가 데이터 배열이 됩니다.
        return listData;

    } catch (error) {
        console.error('Admin List 조회 실패:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to retrieve admin asset list' });
    }
});