// ~/utils/transactionUtils.ts

import type {
        TransactionInfoType, SaleInfoType, SaleDetailType, LeaseInfoType, LeaseDetailType
} from '~/types/asset.type';


/**
 * @description 매매 트랜잭션 리스트를 기반으로 SaleInfoType을 계산합니다.
 */
export function calculateSaleInfo(transactions: TransactionInfoType[]): SaleInfoType {
        // Sale 트랜잭션만 필터링하고 SaleDetail이 있는 경우만 취급합니다.
        const saleTransactions = transactions.filter(
                t => t.type === 'SALE' && t.saleDetail
        ) as (TransactionInfoType & { saleDetail: SaleDetailType })[];

        const salesList: SaleDetailType[] = saleTransactions.map(t => t.saleDetail);

        // 엔블록(ENBLOC) 및 부분(PARTIAL) 매매 건수 계산
        const totalEnblocSales = saleTransactions.filter(t => t.saleDetail.saleType === 'ENBLOC').length;
        const totalPartialSales = saleTransactions.filter(t => t.saleDetail.saleType === 'PARTIAL').length;

        // 💡 Note: 평균 가격, 마지막 매매 일자 등 복잡한 계산 로직은 여기에 추가되어야 합니다.

        return {
                totalSales: saleTransactions.length,
                totalEnblocSales: totalEnblocSales,
                totalPartialSales: totalPartialSales,
                salesList: salesList,
        } as SaleInfoType;
}

/**
 * @description 임대 트랜잭션 리스트를 기반으로 LeaseInfoType을 계산합니다.
 */
export function calculateLeaseInfo(transactions: TransactionInfoType[]): LeaseInfoType {
        // Lease 트랜잭션만 필터링하고 LeaseDetail이 있는 경우만 취급합니다.
        const leaseTransactions = transactions.filter(
                t => t.type === 'LEASE' && t.leaseDetail
        ) as (TransactionInfoType & { leaseDetail: LeaseDetailType })[];

        const askingLeases = leaseTransactions.filter(t => t.leaseDetail.leaseType === 'ASKING');
        const actualLeases = leaseTransactions.filter(t => t.leaseDetail.leaseType === 'ACTUAL');

        return {
                totalLeasesAsking: askingLeases.length,
                totalLeasesActual: actualLeases.length,
                leasesAskingList: askingLeases.map(t => t.leaseDetail),
                leasesActualList: actualLeases.map(t => t.leaseDetail),
        } as LeaseInfoType;
}