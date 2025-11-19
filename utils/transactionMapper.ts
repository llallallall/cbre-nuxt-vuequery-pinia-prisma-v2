// /utils/transactionMapper.ts

import { Prisma, SaleType, LeaseType, RentFreeType } from '@prisma/client';
import type {
        SaleDetailType, LeaseDetailType, LeaseTypeEnum, RentFreeTypeEnum, SaleTypeEnum,
        ApiSaleDetail, ApiLeaseDetail, LeaseCreatePayload
} from '~/types/asset.type';

// =======================================================
// 1. Prisma 모델 타입 정의
// =======================================================

// DB 조회 시: Prisma 모델은 Date 객체를 포함합니다.
export type PrismaSale = Prisma.SaleGetPayload<any>;
export type PrismaLease = Prisma.LeaseGetPayload<any>;

type PrismaCoreAuditFields = 'created_at' | 'updated_at';

export type PrismaSaleCore = Omit<PrismaSale, PrismaCoreAuditFields>;
export type PrismaLeaseCore = Omit<PrismaLease, PrismaCoreAuditFields>

// =======================================================
// 2. 헬퍼 함수
// =======================================================

/**
 * 💡 [Client (string) -> DB (Date)] 변환 헬퍼 (쓰기 용)
 */
export const toDateOrNull = (date: string | Date | null | undefined): Date | null => {
        if (!date) return null;

        // 이미 Date 객체인 경우 그대로 반환하여 오류를 해결합니다.
        if (date instanceof Date) {
                return date;
        }

        // string인 경우에만 new Date()를 호출합니다.
        if (typeof date === 'string') {
                return new Date(date);
        }

        return null; // 그 외의 알 수 없는 타입 처리
};

/**
 * 💡 [DB (Date) -> Client (string)] 변환 헬퍼 (읽기 용)
 */
export const dateToString = (date: Date | null | undefined): string | null =>
        date ? date.toISOString().split('T')[0] : null;


// =======================================================
// 3. Lease 매퍼 (양방향)
// =======================================================

/**
 * 🔎 DB에서 조회된 Lease 상세 데이터 (PrismaLease)를 
 * 클라이언트 응답용 LeaseDetailType (camelCase, string)으로 매핑합니다.
 */
export function mapLeaseDetailFromPrismaToClient(prismaLease: PrismaLeaseCore | ApiLeaseDetail | null): LeaseDetailType | null {
        if (!prismaLease) return null;

        const normalizedLeaseStartDate = toDateOrNull(prismaLease.lease_start_date);
        const normalizedLeaseEndDate = toDateOrNull(prismaLease.lease_end_date);

        return {
                leaseId: prismaLease.id,
                transactionId: prismaLease.transaction_id ?? null,
                leaseType: (prismaLease.lease_type as LeaseTypeEnum) ?? null,
                floor: prismaLease.floor ?? null,
                unit: prismaLease.unit ?? null,

                // 💡 Date -> string 변환 적용
                leaseStartDate: dateToString(normalizedLeaseStartDate),
                leaseEndDate: dateToString(normalizedLeaseEndDate),

                // 나머지 필드 (snake_case -> camelCase)
                gfaSqm: prismaLease.gfa_sqm ?? null,
                nfaSqm: prismaLease.nfa_sqm ?? null,
                effRatio: prismaLease.eff_ratio ?? null,
                monthlyRent: prismaLease.monthly_rent ?? null,
                monthlyCamf: prismaLease.monthly_camf ?? null,
                deposit: prismaLease.deposit ?? null,
                rentMonthlyPy: prismaLease.rent_monthly_py ?? null,
                camfMonthlyPy: prismaLease.camf_monthly_py ?? null,
                depositPy: prismaLease.deposit_py ?? null,
                iod: prismaLease.iod ?? null,
                gdm: prismaLease.gdm ?? null,
                noc: prismaLease.noc ?? null,
                leaseTermYear: prismaLease.lease_term_year ?? null,
                rentFreeType: (prismaLease.rent_free_type as RentFreeTypeEnum) ?? null,
                rentFreeMonth: prismaLease.rent_free_month ?? null,
                effectiveNoc: prismaLease.effective_noc ?? null,
                fitOut: prismaLease.fit_out ?? null,
                tiAmountKrw: prismaLease.ti_amount_krw ?? null,
                tiAmountNfaPy: prismaLease.ti_amount_nfa_py ?? null,
                totalFreeRentPeriodMonth: prismaLease.total_free_rent_period_month ?? null,
                totalOccupyingPeriodYear: prismaLease.total_occupying_period_year ?? null,
                totalFreeRentOccupyingYear: prismaLease.total_free_rent_occupying_year ?? null,
                monthlyCashSupportGfa: prismaLease.monthly_cash_support_gfa ?? null,
                allInEffectiveRentMonthlyPy: prismaLease.all_in_effective_rent_monthly_py ?? null,
                allInNoc: prismaLease.all_in_noc ?? null,
                gfaPy: prismaLease.gfa_py ?? null,
                nfaPy: prismaLease.nfa_py ?? null,
        } as LeaseDetailType;
}

/**
 * 📝 클라이언트에서 받은 Lease 상세 데이터 (LeaseDetailType)를 
 * DB 저장용 Partial Lease Payload (snake_case, Date 객체)로 매핑합니다.
 */
export function mapLeaseDetailFromClientToPrisma(clientLease: LeaseDetailType | LeaseCreatePayload): Partial<PrismaLeaseCore> {

        const transactionId = clientLease.transactionId ?? null;
        const leaseStartDate = toDateOrNull(clientLease.leaseStartDate);
        const leaseEndDate = toDateOrNull(clientLease.leaseEndDate);

        return {
                id: clientLease.leaseId,
                transaction_id: transactionId,
                lease_type: (clientLease.leaseType as LeaseType) || undefined,
                floor: clientLease.floor ?? null,
                unit: clientLease.unit ?? null,

                // 💡 string -> Date 변환 적용
                lease_start_date: leaseStartDate,
                lease_end_date: leaseEndDate,

                // 나머지 필드 (camelCase -> snake_case)
                gfa_sqm: clientLease.gfaSqm ?? null,
                nfa_sqm: clientLease.nfaSqm ?? null,
                eff_ratio: clientLease.effRatio ?? null,
                monthly_rent: clientLease.monthlyRent ?? null,
                monthly_camf: clientLease.monthlyCamf ?? null,
                deposit: clientLease.deposit ?? null,
                rent_monthly_py: clientLease.rentMonthlyPy ?? null,
                camf_monthly_py: clientLease.camfMonthlyPy ?? null,
                deposit_py: clientLease.depositPy ?? null,
                iod: clientLease.iod ?? null,
                gdm: clientLease.gdm ?? null,
                noc: clientLease.noc ?? null,
                lease_term_year: clientLease.leaseTermYear ?? null,
                rent_free_type: (clientLease.rentFreeType as RentFreeType) || undefined,
                rent_free_month: clientLease.rentFreeMonth ?? null,
                effective_noc: clientLease.effectiveNoc ?? null,
                fit_out: clientLease.fitOut ?? null,
                ti_amount_krw: clientLease.tiAmountKrw ?? null,
                ti_amount_nfa_py: clientLease.tiAmountNfaPy ?? null,
                total_free_rent_period_month: clientLease.totalFreeRentPeriodMonth ?? null,
                total_occupying_period_year: clientLease.totalOccupyingPeriodYear ?? null,
                total_free_rent_occupying_year: clientLease.totalFreeRentOccupyingYear ?? null,
                monthly_cash_support_gfa: clientLease.monthlyCashSupportGfa ?? null,
                all_in_effective_rent_monthly_py: clientLease.allInEffectiveRentMonthlyPy ?? null,
                all_in_noc: clientLease.allInNoc ?? null,
                gfa_py: clientLease.gfaPy ?? null,
                nfa_py: clientLease.nfaPy ?? null,
        };
}

// =======================================================
// 5. Sale 매퍼 (양방향)
// =======================================================

/**
 * 🔎 DB에서 조회된 Sale 상세 데이터 (PrismaSale)를 
 * 클라이언트 응답용 SaleDetailType (camelCase)으로 매핑합니다.
 */
export function mapSaleDetailFromPrismaToClient(prismaSale: PrismaSaleCore | ApiSaleDetail | null): SaleDetailType | null {
        if (!prismaSale) return null;

        // Sale 모델의 Date 필드가 있다면 dateToString을 사용하여 변환해야 합니다.
        // (현재 스키마에는 날짜 필드가 보이지 않으므로 기본 로직을 유지합니다.)
        // const executionDate = dateToString(prismaSale.execution_date); 

        return {
                saleId: prismaSale.id,
                transactionId: prismaSale.transaction_id ?? null,
                saleType: (prismaSale.sale_type as SaleTypeEnum) ?? null,
                gfaSqm: prismaSale.gfa_sqm ?? null,
                nfaSqm: prismaSale.nfa_sqm ?? null,
                priceKrw: prismaSale.price_krw ?? null,
                pricePerGfa: prismaSale.price_per_gfa ?? null,
                pricePerNfa: prismaSale.price_per_nfa ?? null,
                estCapRate: prismaSale.est_cap_rate ?? null,
                estDiscountRate: prismaSale.est_discount_rate ?? null,
                buyer: prismaSale.buyer ?? null,
                seller: prismaSale.seller ?? null,
                remarks: prismaSale.remarks ?? null,
                // executionDate: executionDate, // Date 필드가 있다면 추가
        } as SaleDetailType;
}


/**
 * 📝 클라이언트에서 받은 Sale 상세 데이터 (SaleDetailType)를 
 * DB 저장용 Partial Sale Payload (snake_case)로 매핑합니다.
 */
export function mapSaleDetailFromClientToPrisma(clientSale: SaleDetailType): Partial<PrismaSaleCore> {

        // Sale 모델의 Date 필드가 있다면 toDateOrNull을 사용하여 변환해야 합니다.
        // (현재 스키마에는 날짜 필드가 보이지 않으므로 기본 로직을 유지합니다.)
        // const executionDate = toDateOrNull(clientSale.executionDate); 

        return {
                id: clientSale.saleId,
                transaction_id: clientSale.transactionId ?? null,
                sale_type: (clientSale.saleType as SaleType) || undefined,
                gfa_sqm: clientSale.gfaSqm ?? null,
                nfa_sqm: clientSale.nfaSqm ?? null,
                price_krw: clientSale.priceKrw ?? null,
                price_per_gfa: clientSale.pricePerGfa ?? null,
                price_per_nfa: clientSale.pricePerNfa ?? null,
                est_cap_rate: clientSale.estCapRate ?? null,
                est_discount_rate: clientSale.estDiscountRate ?? null,
                buyer: clientSale.buyer ?? null,
                seller: clientSale.seller ?? null,
                remarks: clientSale.remarks ?? null,
                // execution_date: executionDate, // Date 필드가 있다면 추가
        };
}
