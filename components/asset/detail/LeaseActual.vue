<template>
        <Disclosure>
                <DisclosureButton class="py-2 font-financier text-2xl text-primary w-full">
                        <div class="flex justify-between gap-3 w-full">
                                <div class="w-1/2 flex justify-start">Lease Actual Information</div>

                                <div class="w-1/2 flex justify-end">
                                        <div v-if="info && info.length > 0" class="bg-primary/10 hover:bg-primary/25 
                                        text-primary rounded-full
                                        px-4 py-1 min-w-[100px]
                                        flex justify-center items-center ">
                                                {{ info.length }}
                                        </div>
                                </div>
                        </div>
                </DisclosureButton>
                <DisclosurePanel class="font-calibreLight text-lg text-primary w-full overflow-x-scroll pb-5">
                        <div class="w-full h-full">
                                <table class="table-auto w-full whitespace-nowrap pb-10 border-collapse">
                                        <thead>
                                                <tr class="font-calibre bg-gray-100 border-b text-sm">
                                                        <th class="px-2 py-1 w-8">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                        viewBox="0 0 24 24" stroke-width="1.5"
                                                                        stroke="currentColor" class="w-6 h-6">
                                                                        <path stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                                                                </svg>
                                                        </th>
                                                        <th class="px-4 py-1">Floor</th>
                                                        <th class="px-4 py-1">Unit</th>
                                                        <th class="px-4 py-1">Date</th>
                                                        <th class="px-4 py-1 text-right">GFA(Sqm)</th>
                                                        <th class="px-4 py-1 text-right">GFA(Py)</th>
                                                        <th class="px-4 py-1 text-right">NFA(Sqm)</th>
                                                        <th class="px-4 py-1 text-right">NFA(Py)</th>
                                                        <th class="px-4 py-1 text-right">Eff. Ratio</th>
                                                        <th class="px-4 py-1 text-right">Monthly Rent</th>
                                                        <th class="px-4 py-1 text-right">Monthly CAMF</th>
                                                        <th class="px-4 py-1 text-right">Deposit</th>
                                                        <th class="px-4 py-1 text-right">Rent Mth Py</th>
                                                        <th class="px-4 py-1 text-right">CAMF Mth Py</th>
                                                        <th class="px-4 py-1 text-right">Deposit Py</th>
                                                        <th class="px-4 py-1 text-right">IOD</th>
                                                        <th class="px-4 py-1 text-right">GDM</th>
                                                        <th class="px-4 py-1 text-right">NOC</th>
                                                        <th class="px-4 py-1 text-right">Lease Term Year</th>
                                                        <th class="px-4 py-1 text-right">Rent Free Type</th>
                                                        <th class="px-4 py-1 text-right">Rent Free Mth</th>
                                                        <th class="px-4 py-1 text-right">Effective Noc</th>
                                                        <th class="px-4 py-1 text-right">Fit-Out</th>
                                                        <th class="px-4 py-1 text-right">Amount Krw</th>
                                                        <th class="px-4 py-1 text-right">Amount Nfa Py</th>
                                                        <th class="px-4 py-1 text-right">Total Free Rent Period Mth</th>
                                                        <th class="px-4 py-1 text-right">Total Occupying Period Year
                                                        </th>
                                                        <th class="px-4 py-1 text-right">Total Free Rent Occupying Year
                                                        </th>
                                                        <th class="px-4 py-1 text-right">Monthly Cash Support Gfa</th>
                                                        <th class="px-4 py-1 text-right">All In Effective Rent Mth Py
                                                        </th>
                                                        <th class="px-4 py-1 text-right">All In Noc</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(t, idx) in info" :key="t.id || idx"
                                                        class="font-calibreLight text-sm border-b hover:bg-gray-50">
                                                        <td class="text-center"><input :id="'lt' + idx" type="checkbox"
                                                                        class="ml-[4px]" /></td>

                                                        <td class="px-4 py-1 text-center">{{ t.lease?.floor || '-' }}
                                                        </td>
                                                        <td class="px-4 py-1 text-center">{{ t.lease?.unit || '-' }}
                                                        </td>
                                                        <td class="px-4 py-1 text-center">{{
                                                                formatDate(t.lease?.leaseStartDate) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatDecimal(t.lease?.gfaSqm) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatDecimal(t.lease?.gfaPy) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatDecimal(t.lease?.nfaSqm) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatDecimal(t.lease?.nfaPy) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatDecimal(t.lease?.effRatio) }}%</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatInt(t.lease?.monthlyRent) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatInt(t.lease?.monthlyCamf) }}</td>
                                                        <td class="px-4 py-1 text-right">{{ formatInt(t.lease?.deposit)
                                                        }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatInt(t.lease?.rentMonthlyPy) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatInt(t.lease?.camfMonthlyPy) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatInt(t.lease?.depositPy) }}</td>
                                                        <td class="px-4 py-1 text-right">{{ formatDecimal(t.lease?.iod)
                                                        }}</td>
                                                        <td class="px-4 py-1 text-right">{{ formatDecimal(t.lease?.gdm)
                                                        }}</td>
                                                        <td class="px-4 py-1 text-right">{{ formatDecimal(t.lease?.noc)
                                                        }}</td>
                                                        <td class="px-4 py-1 text-right">{{ t.lease?.leaseTermYear ||
                                                                '-' }}</td>
                                                        <td class="px-4 py-1 text-right">{{ t.lease?.rentFreeType || '-'
                                                        }}</td>
                                                        <td class="px-4 py-1 text-right">{{ t.lease?.rentFreeMonth ||
                                                                '-' }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatDecimal(t.lease?.effectiveNoc) }}</td>
                                                        <td class="px-4 py-1 text-right">{{ formatInt(t.lease?.fitOut)
                                                        }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatInt(t.lease?.tiAmountKrw) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatDecimal(t.lease?.tiAmountNfaPy) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatInt(t.lease?.totalFreeRentPeriodMonth) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatDecimal(t.lease?.totalOccupyingPeriodYear) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatDecimal(t.lease?.totalFreeRentOccupyingYear) }}
                                                        </td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatInt(t.lease?.monthlyCashSupportGfa) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatInt(t.lease?.allInEffectiveRentMonthlyPy) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatDecimal(t.lease?.allInNoc) }}</td>
                                                </tr>
                                                <tr v-if="!info || info.length === 0">
                                                        <td colspan="31" class="text-center py-4 text-gray-500 italic">
                                                                No Actual Lease Data</td>
                                                </tr>
                                        </tbody>
                                </table>
                        </div>
                </DisclosurePanel>
        </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { useFormat } from '~/composables/useFormat';
import type { TransactionType } from '~/types/property.type';

// 💡 Generic Type 적용
const props = withDefaults(defineProps<{
        info?: TransactionType[]
}>(), {
        info: () => []
});

const { numberFormat } = useFormat();
const formatInt = (val: any) => numberFormat(val, 0);
const formatDecimal = (val: any) => numberFormat(val, 2);

const formatDate = (dateInput: Date | string | null | undefined): string => {
        if (!dateInput) return '-';
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (isNaN(date.getTime())) return '-';
        return date.toISOString().split('T')[0];
};
</script>