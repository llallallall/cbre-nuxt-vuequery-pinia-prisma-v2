<template>
        <Disclosure>
                <DisclosureButton class="py-2 font-financier text-2xl text-primary w-full ">
                        <div class="flex justify-between gap-3 w-full">
                                <div class="w-1/2 flex justify-start">Sales Information</div>
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
                <DisclosurePanel class="font-calibreLight text-lg text-primary">
                        <div class="overflow-x-auto">
                                <table class="table-auto w-full border border-gray-200">
                                        <thead class="bg-gray-50">
                                                <tr class="font-calibre text-sm text-gray-600 border-b">
                                                        <th class="px-2 py-1 w-8"><svg class="w-4 h-4" fill="none"
                                                                        stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path stroke-linecap="round"
                                                                                stroke-linejoin="round" stroke-width="2"
                                                                                d="M5 13l4 4L19 7"></path>
                                                                </svg></th>
                                                        <th class="px-2 py-1 text-left">Seller</th>
                                                        <th class="px-2 py-1 text-left">Buyer</th>
                                                        <th class="px-2 py-1 text-center">YR-Q</th>
                                                        <th class="px-2 py-1 text-center">Type</th>
                                                        <th class="px-2 py-1 text-right">GFA</th>
                                                        <th class="px-2 py-1 text-right">NFA</th>
                                                        <th class="px-2 py-1 text-right">Price<sub>(KRW)</sub></th>
                                                        <th class="px-2 py-1 text-right">P/GFA</th>
                                                        <th class="px-2 py-1 text-right">P/NFA</th>
                                                        <th class="px-2 py-1 text-right">ECR</th>
                                                        <th class="px-2 py-1 text-right">Disc.</th>
                                                        <th class="px-2 py-1 text-left">Remarks</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(t, idx) in info" :key="t.id || idx"
                                                        class="font-calibreLight text-sm border-b hover:bg-gray-50">
                                                        <td class="text-center"><input :id="'t' + idx" type="checkbox"
                                                                        class="ml-[4px]" /></td>

                                                        <td class="px-2 py-1">{{ t.sale?.seller || '-' }}</td>
                                                        <td class="px-2 py-1">{{ t.sale?.buyer || '-' }}</td>
                                                        <td class="px-2 py-1 text-center">{{ t.year }}-{{ t.quarter ||
                                                                'Q?' }}</td>
                                                        <td class="px-2 py-1 text-center">{{ t.sale?.saleType || '-' }}
                                                        </td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatDecimal(t.sale?.gfaSqm) }}</td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatDecimal(t.sale?.nfaSqm) }}</td>
                                                        <td class="px-2 py-1 text-right">{{ formatInt(t.sale?.priceKrw)
                                                        }}</td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatInt(t.sale?.pricePerGfa) }}</td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatInt(t.sale?.pricePerNfa) }}</td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatDecimal(t.sale?.estCapRate) }}%</td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatDecimal(t.sale?.estDiscountRate) }}%</td>
                                                        <td class="px-2 py-1 text-xs text-gray-500 truncate max-w-[150px]"
                                                                :title="t.sale?.remarks || ''">
                                                                {{ t.sale?.remarks }}
                                                        </td>
                                                </tr>
                                                <tr v-if="!info || info.length === 0">
                                                        <td colspan="13" class="text-center py-4 text-gray-500 italic">
                                                                No Sales Data</td>
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
// 💡 1. 타입 임포트 추가
import type { TransactionType } from '~/types/property.type';

// 💡 2. defineProps에 Generic Type 적용
const props = withDefaults(defineProps<{
        info?: TransactionType[]
}>(), {
        info: () => []
});

const { numberFormat } = useFormat();
const formatInt = (val: any) => numberFormat(val, 0);
const formatDecimal = (val: any) => numberFormat(val, 2);
</script>