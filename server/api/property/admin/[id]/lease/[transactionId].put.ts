import { defineEventHandler, readBody, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import type { LeaseCreatePayload } from '~/types/asset.type';
import { Prisma, TransactionType, LeaseType } from '@prisma/client';

const mapPayloadToPrisma = (payload: LeaseCreatePayload) => ({
        lease_type: payload.leaseType as LeaseType,
        floor: payload.floor,
        unit: payload.unit,
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
        execution_date: payload.executionDate ? new Date(payload.executionDate) : null,
        lease_term_year: payload.leaseTermYear,
        rent_free_type: payload.rentFreeType,
        rent_free_month: payload.rentFreeMonth,
        effective_noc: payload.effectiveNoc,
        fit_out: payload.fitOut,
        ti_amount_krw: payload.tiAmountKrw,
        ti_amount_nfa_py: payload.tiAmountNfaPy,
        total_free_rent_period_month: payload.totalFreeRentPeriodMonth,
        total_occupying_period_year: payload.totalOccupyingPeriodYear,
        total_free_rent_occupying_year: payload.totalFreeRentOccupyingYear,
        monthly_cash_support_gfa: payload.monthlyCashSupportGfa,
        all_in_effective_rent_monthly_py: payload.allInEffectiveRentMonthlyPy,
        all_in_noc: payload.allInNoc,
        // ... 모든 Lease 필드 매핑
});

export default defineEventHandler(async (event) => {
        const params = getRouterParams(event);
        const transactionId = params.transactionId;
        const payload: LeaseCreatePayload = await readBody(event);
        const { year, date } = payload;

        if (!transactionId || !year || !date) {
                throw createError({ statusCode: 400, statusMessage: 'Missing transaction ID or date/year fields.' });
        }

        try {
                await prisma.$transaction(async (tx) => {

                        // 1. Transaction 업데이트
                        await tx.transaction.update({
                                where: { id: transactionId, type: TransactionType.LEASE },
                                data: {
                                        year: year,
                                        quarter: 'Q' + Math.ceil((new Date(date).getMonth() + 1) / 3),
                                        date: new Date(date),
                                },
                        });

                        // 2. Lease 상세 정보 업데이트 (transaction_id를 where 조건으로 사용)
                        await tx.lease.update({
                                where: { transaction_id: transactionId },
                                data: {
                                        ...mapPayloadToPrisma(payload), // camelCase to snake_case 매핑
                                },
                        });

                        return { transactionId: transactionId };
                });

                return {
                        message: `Lease record ${transactionId} updated successfully.`,
                        transactionId: transactionId
                };
        } catch (e) {
                console.error('Lease update failed:', e);
                // P2025 에러는 레코드를 찾지 못했음을 의미
                if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                        throw createError({ statusCode: 404, statusMessage: 'Lease or Transaction record not found.' });
                }
                throw createError({ statusCode: 500, statusMessage: 'Failed to update lease record.' });
        }
});