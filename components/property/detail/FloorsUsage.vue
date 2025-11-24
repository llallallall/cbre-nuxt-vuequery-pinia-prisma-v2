<template>
        <Disclosure>
                <DisclosureButton class="py-2 font-financier text-2xl text-primary w-full ">
                        <div class="flex justify-between gap-3 w-full mb-5">
                                <div class="w-1/2 flex justify-start">Floors Usage Summary</div>
                                <div class="w-1/2 flex justify-end">
                                        <div class="bg-primary/10 hover:bg-primary/25 
                                        text-primary rounded-full
                                        px-4 py-1 min-w-[100px]
                                        flex justify-center items-center ">
                                                {{ info ? info.length : 0 }}
                                        </div>
                                </div>
                        </div>
                </DisclosureButton>
                <DisclosurePanel class="font-calibreLight text-lg text-primary w-full overflow-x-auto">
                        <table class="table-auto w-full border-collapse border border-gray-200 mb-5 text-sm">
                                <thead>
                                        <tr class="font-calibre border bg-gray-100">
                                                <th v-for="item in floorHeaders" :key="item.value"
                                                        class="whitespace-nowrap px-3 py-2 border border-gray-300 text-gray-700">
                                                        {{ item.text }}
                                                </th>
                                        </tr>
                                </thead>
                                <tbody>
                                        <tr v-for="(floor, index) in info" :key="floor.id || index"
                                                class="font-calibreLight hover:bg-gray-50">
                                                <td class="px-3 py-2 border border-gray-200 text-center">{{ floor.type
                                                        || '-' }}</td>
                                                <td class="px-3 py-2 border border-gray-200 text-center">{{ floor.floor
                                                }}F</td>
                                                <td class="px-3 py-2 border border-gray-200 text-center">{{ floor.use ||
                                                        '-' }}</td>
                                                <td class="px-3 py-2 border border-gray-200 text-right">{{
                                                        formatNumber(floor.totalAreaSqm) }}</td>
                                                <td class="px-3 py-2 border border-gray-200 text-right">{{
                                                        formatNumber(floor.netLeasableAreaSqm) }}</td>
                                                <td class="px-3 py-2 border border-gray-200 text-right">{{
                                                        formatNumber(floor.ceilingHeight) }}</td>
                                                <td class="px-3 py-2 border border-gray-200 text-right">{{
                                                        formatNumber(floor.floorLoad) }}</td>
                                        </tr>
                                        <tr v-if="!info || info.length === 0">
                                                <td :colspan="floorHeaders.length"
                                                        class="text-center py-4 text-gray-500 italic">
                                                        No usage data available.
                                                </td>
                                        </tr>
                                </tbody>
                        </table>
                </DisclosurePanel>
        </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { useFormat } from '~/composables/useFormat';
// 💡 1. 타입 임포트 추가
import type { FloorType } from '~/types/property.type';

// 💡 2. defineProps에 Generic Type 적용
const props = withDefaults(defineProps<{
        info?: FloorType[]
}>(), {
        info: () => []
});

const { numberFormat } = useFormat();
const formatNumber = (val: number | null | undefined) => {
        if (val === null || val === undefined) return '-';
        return numberFormat(val, 0);
};

const floorHeaders = [
        { text: 'Type', value: 'type' },
        { text: 'Floor', value: 'floor' },
        { text: 'Usage', value: 'use' },
        { text: 'Total Area (㎡)', value: 'totalAreaSqm' },
        { text: 'NLA (㎡)', value: 'netLeasableAreaSqm' },
        { text: 'Ceiling (m)', value: 'ceilingHeight' },
        { text: 'Load (t/㎡)', value: 'floorLoad' },
];
</script>