<template>
    <div class="bg-white mt-4">
        <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
            <span>Floor Data</span>
            <button @click="openEditPanel"
                class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
                Edit
            </button>
        </div>

        <div class="overflow-x-auto w-full">
            <table class="table-auto w-full border border-gray-300 text-primary text-sm">
                <thead class="bg-gray-100 font-semibold text-center">
                    <tr>
                        <th class="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase w-16">
                            Details
                        </th>
                        <th class="px-2 py-1">Floor(level)</th>
                        <th class="px-2 py-1">Type</th>
                        <th class="px-2 py-1">Usage</th>
                        <th class="px-2 py-1 text-right">Total Area (㎡)</th>
                        <th class="px-2 py-1 text-right">Gross Leasable (㎡)</th>
                        <th class="px-2 py-1 text-right">Net Leasable (㎡)</th>
                        <th class="px-2 py-1 text-right">Net Leasable (py)</th>
                        <th class="px-2 py-1 text-right">Ceiling Height</th>
                        <th class="px-2 py-1 text-right">Floor Load</th>
                        <th class="px-2 py-1 text-right">Truck Berths</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <template v-for="(floor, fIndex) in property?.floor" :key="floor.id || fIndex">
                        <tr :class="{ 'bg-gray-50 hover:bg-gray-100 transition duration-100 cursor-pointer': !isExpanded(floor.id), 'bg-white': isExpanded(floor.id) }"
                            @click="toggleExpand(floor.id)">

                            <td class="py-2 px-3 text-center w-16">
                                <button class="text-blue-500 hover:text-blue-700">
                                    <svg class="w-4 h-4 transition-transform"
                                        :class="{ 'rotate-90': isExpanded(floor.id) }" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </td>
                            <td class="px-2 py-1">
                                {{ floor.type === 'UPPER' ? '' : 'B' }}{{ getFloorDisplayNumber(floor.floor) }}F
                            </td>
                            <td class="px-2 py-1 text-center">{{ floor.type }}</td>
                            <td class="px-2 py-1 text-center">{{ floor.use }}</td>
                            <td class="px-2 py-1 text-right">{{ formatNumber(floor.totalAreaSqm) }}</td>
                            <td class="px-2 py-1 text-right">{{ formatNumber(floor.grossLeasableAreaSqm) }}</td>

                            <td class="px-2 py-1 text-right">{{ formatNumber(floor.netLeasableAreaSqm) }}</td>
                            <td class="px-2 py-1 text-right">{{ formatNumber(floor.netLeasableAreaPy) }}</td>

                            <td class="px-2 py-1 text-right">
                                {{ floor.ceilingHeight ? `${formatNumber(floor.ceilingHeight)} ${floor.ceilingHeightUnit
                                    || 'm'}` : '—' }}
                            </td>
                            <td class="px-2 py-1 text-right">
                                {{ floor.floorLoad ? `${formatNumber(floor.floorLoad)} ${floor.floorLoadUnit || 'kg/㎡'}`
                                    : '—' }}
                            </td>

                            <td class="px-2 py-1 text-right">{{ formatNumber(floor.truckBerths) }}</td>

                        </tr>

                        <tr v-if="isExpanded(floor.id)">
                            <td :colspan="11" class="p-0">
                                <div class="p-4 bg-gray-50 border-t border-b border-gray-200">
                                    <h5 class="text-sm font-bold text-gray-700 mb-3">Unit List (Total {{
                                        floor.floorPartial ? floor.floorPartial.length : 0 }})</h5>

                                    <div class="overflow-x-auto">
                                        <table class="table-auto w-full text-xs border-0 border-gray-300">
                                            <tr v-if="isExpanded(floor.id)">
                                                <td :colspan="12" class="p-0 border-0">

                                                    <div v-for="(partial, pIndex) in floor.floorPartial"
                                                        :key="partial.id || pIndex"
                                                        class="m-4 p-4 rounded-lg bg-white border shadow-sm">

                                                        <h6 class="text-sm font-bold text-blue-700 mb-3 border-b pb-2">
                                                            Unit # {{ partial.unitNumber || 'TBD' }}
                                                        </h6>

                                                        <div
                                                            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 text-xs">

                                                            <div class="col-span-1">
                                                                <span class="font-bold text-gray-700 block">Tenant /
                                                                    Use</span>
                                                                <span class="text-gray-900 block">{{ partial.tenant ||
                                                                    '—' }} / {{ partial.tenantUse || '—' }}</span>
                                                            </div>

                                                            <div class="col-span-1">
                                                                <span class="font-bold text-gray-700 block">Lease Area
                                                                    (㎡ / py)</span>
                                                                <span class="text-gray-900 block">
                                                                    {{ formatNumber(partial.leaseAreaSqm) }} ㎡ / {{
                                                                        formatNumber(partial.leaseAreaPy) }} py
                                                                </span>
                                                            </div>

                                                            <div class="col-span-1">
                                                                <span class="font-bold text-gray-700 block">Lease Start
                                                                    / End</span>
                                                                <span class="text-gray-900 block">
                                                                    {{ formatDate(partial.leaseStartDate) }} / {{
                                                                        formatDate(partial.leaseEndDate) }}
                                                                </span>
                                                            </div>

                                                            <div class="col-span-1">
                                                                <span class="font-bold text-gray-700 block">Tenant
                                                                    Equipment</span>
                                                                <span class="text-gray-900 block">
                                                                    <span v-if="partial.tenantEquipment === true"
                                                                        class="text-green-600 font-semibold">Yes</span>
                                                                    <span v-else-if="partial.tenantEquipment === false"
                                                                        class="text-red-600 font-semibold">No</span>
                                                                    <span v-else>—</span>
                                                                </span>
                                                            </div>

                                                            <div class="col-span-1">
                                                                <span class="font-bold text-gray-700 block">Deposit
                                                                    (KRW)</span>
                                                                <span class="text-gray-900 block">{{
                                                                    formatNumber(partial.depositKrw) }}</span>
                                                            </div>

                                                            <div class="col-span-1">
                                                                <span class="font-bold text-gray-700 block">Monthly Rent
                                                                    (Tot / py)</span>
                                                                <span class="text-gray-900 block">
                                                                    {{ formatNumber(partial.monthlyRent) }} / <span
                                                                        class="text-gray-500">({{
                                                                            formatNumber(partial.monthlyRentPerPy)
                                                                        }})</span>
                                                                </span>
                                                            </div>

                                                            <div class="col-span-1">
                                                                <span class="font-bold text-gray-700 block">Mgt. Fee
                                                                    (Tot / py)</span>
                                                                <span class="text-gray-900 block">
                                                                    {{ formatNumber(partial.monthlyManagementFee) }} /
                                                                    <span class="text-gray-500">({{
                                                                        formatNumber(partial.monthlyManagementPerPy)
                                                                        }})</span>
                                                                </span>
                                                            </div>

                                                        </div>

                                                        <div class="col-span-full mt-4 pt-4 border-t">
                                                            <span class="font-bold text-gray-700 block mb-2">Contract
                                                                Details / Notes</span>

                                                            <div
                                                                class="space-y-1 leading-tight text-gray-600 text-[11px] p-2 border rounded bg-gray-50  overflow-y-auto">
                                                                <div v-if="partial.rentFree" class="flex">
                                                                    <span
                                                                        class="font-semibold text-gray-800 w-24 flex-shrink-0">Rent
                                                                        Free:</span>
                                                                    <span>{{ partial.rentFree }}</span>
                                                                </div>
                                                                <div v-if="partial.fitOut" class="flex">
                                                                    <span
                                                                        class="font-semibold text-gray-800 w-24 flex-shrink-0">Fit
                                                                        Out:</span>
                                                                    <span>{{ partial.fitOut }}</span>
                                                                </div>

                                                                <div v-if="partial.increaseConditionsForDeposit || partial.increaseConditionsForRent || partial.increaseConditionsForManagementFee"
                                                                    class="mt-1 pt-1 border-t">
                                                                    <span
                                                                        class="font-semibold text-gray-800 block">Increase
                                                                        Conditions:</span>
                                                                    <div
                                                                        class="text-gray-600 pl-4 space-y-2 font-bold pt-2">
                                                                        <p>Deposit: <textarea disabled
                                                                                class="w-full pl-2 font-normal">{{ partial.increaseConditionsForDeposit || '—' }}</textarea>
                                                                        </p>
                                                                        <p>Rent: <textarea disabled
                                                                                class="w-full pl-2 font-normal">{{ partial.increaseConditionsForRent || '—' }}</textarea>
                                                                        </p>
                                                                        <p>Mgt. Fee: <textarea disabled
                                                                                class="w-full pl-2 font-normal">{{ partial.increaseConditionsForManagementFee || '—' }}</textarea>
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <p v-if="!partial.rentFree && !partial.fitOut && !partial.increaseConditionsForDeposit && !partial.increaseConditionsForRent && !partial.increaseConditionsForManagementFee"
                                                                    class="text-center text-gray-400 py-1">
                                                                    — No Special Details —
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div v-if="!floor.floorPartial || floor.floorPartial.length === 0"
                                                        class="text-center py-4 text-gray-500 border rounded-lg bg-white">
                                                        No unit information has been entered.
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useFormat } from '~/composables/useFormat';

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const { numberFormat } = useFormat();

// 💡 수정: currentProperty 참조
const { currentProperty: property } = storeToRefs(propertyStore);

// 확장 상태 관리
const expandedFloors: Ref<string[]> = ref([]);

const openEditPanel = () => {
    uiStore.openModifyForm(propertyStore.currentPropertyId, 'floor');
};

const toggleExpand = (floorId: string) => {
    // 💡 수정: property.floor 리스트에서 찾기
    const floor = property.value?.floor?.find(f => f.id === floorId);

    // 부분 정보가 없으면 확장하지 않음
    if (!floor || !floor.floorPartial || floor.floorPartial.length === 0) {
        return;
    }

    const index = expandedFloors.value.indexOf(floorId);
    if (index > -1) {
        expandedFloors.value.splice(index, 1);
    } else {
        expandedFloors.value.push(floorId);
    }
};

const isExpanded = (floorId: string): boolean => {
    return expandedFloors.value.includes(floorId);
};

// 💡 수정: formatNumber를 useFormat의 numberFormat으로 대체하거나 래핑
const formatNumber = (value: number | null | undefined): string => {
    return numberFormat(value, 0);
};

const getFloorDisplayNumber = (floorNumber: number | null | undefined): number => {
    const num = floorNumber ?? 0;
    return num > 0 ? num : Math.abs(num);
}

const formatDate = (date: Date | string | null): string => {
    if (!date) return '—';
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '—';
    return dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
};
</script>

<style scoped>
.cbre_bulletList {
    list-style: none;
    padding: 0 0 0 20px;
    line-height: 2;
}

.rotate-90 {
    transform: rotate(90deg);
}
</style>