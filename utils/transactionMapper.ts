// server/utils/transactionMapper.ts

import { LeaseType, RentFreeType, SaleType } from '@prisma/client';
import type { LeaseCreatePayload, SaleCreatePayload } from '~/types/property.type';

/**
 * 📅 날짜 변환 유틸리티 (string | Date | null -> Date | null)
 */
export const toDateOrNull = (date: string | Date | null | undefined): Date | null => {
        if (!date) return null;
        const d = new Date(date);
        return isNaN(d.getTime()) ? null : d;
}

/**
 * 🏠 Lease 상세 정보 매핑 (Client camelCase -> DB snake_case)
 */
export const mapLeaseDetailFromClientToPrisma = (payload: LeaseCreatePayload) => {
        return {
                lease_type: payload.leaseType as LeaseType,
                floor: payload.floor,
                unit: payload.unit,
                tenant: payload.tenant,

                lease_start_date: toDateOrNull(payload.leaseStartDate),
                lease_end_date: toDateOrNull(payload.leaseEndDate),

                gfa_sqm: payload.gfaSqm,
                gfa_py: payload.gfaPy,
                nfa_sqm: payload.nfaSqm,
                nfa_py: payload.nfaPy,
                eff_ratio: payload.effRatio,

                monthly_rent: payload.monthlyRent,
                monthly_camf: payload.monthlyCamf,
                deposit: payload.deposit,

                rent_monthly_py: payload.rentMonthlyPy,
                camf_monthly_py: payload.camfMonthlyPy,
                deposit_py: payload.depositPy,

                iod: payload.iod,
                gdm: payload.gdm,
                noc: payload.noc,

                lease_term_year: payload.leaseTermYear,
                rent_free_type: payload.rentFreeType as RentFreeType | null,
                rent_free_month: payload.rentFreeMonth,

                effective_noc: payload.effectiveNoc,
                fit_out: payload.fitOut ? Number(payload.fitOut) : null,

                ti_amount_krw: payload.tiAmountKrw,
                ti_amount_nfa_py: payload.tiAmountNfaPy,

                total_free_rent_period_month: payload.totalFreeRentPeriodMonth,
                total_occupying_period_year: payload.totalOccupyingPeriodYear,
                total_free_rent_occupying_year: payload.totalFreeRentOccupyingYear,

                monthly_cash_support_gfa: payload.monthlyCashSupportGfa,
                all_in_effective_rent_monthly_py: payload.allInEffectiveRentMonthlyPy,
                all_in_noc: payload.allInNoc
        };
};

/**
 * 💰 Sale 상세 정보 매핑 (Client camelCase -> DB snake_case)
 */
export const mapSaleDetailFromClientToPrisma = (payload: SaleCreatePayload) => {
        return {
                sale_type: payload.saleType as SaleType,
                gfa_sqm: payload.gfaSqm,
                nfa_sqm: payload.nfaSqm,
                price_krw: payload.priceKrw,
                price_per_gfa: payload.pricePerGfa,
                price_per_nfa: payload.pricePerNfa,
                est_cap_rate: payload.estCapRate,
                est_discount_rate: payload.estDiscountRate,
                buyer: payload.buyer,
                seller: payload.seller,
                remarks: payload.remarks
        };
};