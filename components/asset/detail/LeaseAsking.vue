<template>
        <Disclosure>
                <DisclosureButton class="py-2 font-financier text-2xl text-primary w-full">
                        <div class="flex justify-between gap-3 w-full">
                                <div class="w-1/2 flex justify-start">Lease Asking Information</div>
                                <div class="w-1/2 flex justify-end">
                                        <div v-if="info && info.length > 0"
                                                class="bg-primary/10 hover:bg-primary/25 px-4 py-1 rounded-full min-w-[100px] flex justify-center items-center">
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
                                                        <th class="px-2 py-1 w-8">#</th>
                                                        <th class="px-4 py-1">Floor</th>
                                                        <th class="px-4 py-1">Unit</th>
                                                        <th class="px-4 py-1">Date</th>
                                                        <th class="px-4 py-1 text-right">Rent</th>
                                                        <th class="px-4 py-1 text-right">NOC</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(t, idx) in info" :key="t.id || idx"
                                                        class="font-calibreLight text-sm border-b hover:bg-gray-50">
                                                        <td class="text-center"><input type="checkbox" /></td>

                                                        <td class="px-4 py-1 text-center">{{ t.lease?.floor || '-' }}
                                                        </td>
                                                        <td class="px-4 py-1 text-center">{{ t.lease?.unit || '-' }}
                                                        </td>
                                                        <td class="px-4 py-1 text-center">{{
                                                                formatDate(t.lease?.leaseStartDate) }}</td>
                                                        <td class="px-4 py-1 text-right">{{
                                                                formatInt(t.lease?.rentMonthlyPy) }}</td>
                                                        <td class="px-4 py-1 text-right">{{ formatDecimal(t.lease?.noc)
                                                        }}</td>
                                                </tr>
                                                <tr v-if="!info || info.length === 0">
                                                        <td colspan="20" class="text-center py-4 text-gray-500 italic">
                                                                No Data</td>
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
// 💡 1. 타입 임포트
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

const formatDate = (dateInput: Date | string | null | undefined): string => {
        if (!dateInput) return '-';
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (isNaN(date.getTime())) return '-';
        return date.toISOString().split('T')[0];
};
</script>