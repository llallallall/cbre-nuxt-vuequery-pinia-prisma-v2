// /composables/useMapper.ts

import type {
        TransactionInfoType,
        LeaseDetailType,
        SaleDetailType,
        SaleTypeEnum,
        ApiSaleDetail,
        ApiLeaseDetail,
} from '~/types/asset.type';

import {
        mapSaleDetailFromPrismaToClient,
        mapLeaseDetailFromPrismaToClient
} from '~/utils/transactionMapper';

// =======================================================
// 1. API 응답 데이터 구조 인터페이스 정의 (Source Types)
//    DB 모델을 기반으로 한 snake_case 구조입니다.
// =======================================================


// Transaction 모델의 DB 구조 (snake_case, 중첩된 'lease' 또는 'sale' 필드)
export interface ApiTransactionResponse {
        id: string;
        property_id: string;
        type: 'SALE' | 'LEASE';
        year: string;
        quarter: string;
        execution_date: string | null;
        lease: ApiLeaseDetail | null;
        sale: ApiSaleDetail | null; // 💡 Sale 필드 추가
}



// =======================================================
// 2. 매핑 함수 정의
// =======================================================

/**
 * @description API 응답 (Transaction + Detail)을 클라이언트 타입 (TransactionInfoType)으로 매핑합니다.
 * @param apiResponse API POST/PUT 요청의 응답 데이터 (Transaction 객체 포함)
 */

export function mapApiToClient(apiResponse: ApiTransactionResponse): TransactionInfoType {

        // Transaction 기본 필드 매핑
        const baseTransaction: Partial<TransactionInfoType> = {
                id: apiResponse.id,
                propertyId: apiResponse.property_id,
                type: apiResponse.type,
                year: apiResponse.year,
                quarter: apiResponse.quarter,
                // execution_date (snake_case) -> executionDate (camelCase)
                executionDate: apiResponse.execution_date,

                saleDetail: null,
                leaseDetail: null,
        };

        // Lease 상세 정보 매핑
        if (apiResponse.type === 'LEASE' && apiResponse.lease) {
                return {
                        ...baseTransaction,
                        leaseDetail: mapLeaseDetailFromPrismaToClient(apiResponse.lease), // 'lease' 필드를 'leaseDetail'로 변환
                } as TransactionInfoType;
        }

        // 💡 [추가] SALE 트랜잭션 처리
        if (apiResponse.type === 'SALE' && apiResponse.sale) {
                return {
                        ...baseTransaction,
                        saleDetail: mapSaleDetailFromPrismaToClient(apiResponse.sale), // 'sale' 필드를 'saleDetail'로 변환
                } as TransactionInfoType;
        }
        return baseTransaction as TransactionInfoType;
}

// SALE 관련 타입을 위해 추후 mapSaleDetail 함수도 여기에 추가할 수 있습니다.