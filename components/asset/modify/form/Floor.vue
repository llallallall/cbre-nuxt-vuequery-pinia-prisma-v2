<template>
    <div class="p-6 space-y-6">
        <form @submit.prevent="onSubmit" class="space-y-8">

            <div v-if="formData.length === 0" class="text-center py-10 text-gray-500 border rounded-lg">
                Please enter the building size information (number of above-ground/basement floors) first.
            </div>

            <div v-for="(floor, fIndex) in formData" :key="floor.floorId"
                class="border p-4 rounded-lg shadow-md bg-white">

                <h3 class="text-lg font-bold mb-4 text-primary">
                    {{ floor.type === 'UPPER' ? '' : 'B' }}{{ floor.floor > 0 ? floor.floor : Math.abs(floor.floor) }}F
                    <span :class="{ 'text-green-500': floor.isNew, 'text-gray-500': !floor.isNew }"
                        class="text-sm font-normal">({{ floor.isNew ? 'New' : 'Existing' }})</span>
                </h3>

                <div class="grid md:grid-cols-2 gap-4 mb-6 border-b pb-4">

                    <div class="flex flex-col">
                        <label class="text-sm font-medium">Usage</label>
                        <select v-model="floor.use" class="border p-2 rounded text-xs">
                            <option :value="null">— Select Use —</option>
                            <option v-for="type in FLOOR_USE_TYPES" :key="type" :value="type">{{ type }}</option>
                        </select>
                    </div>

                    <div class="flex flex-col">
                        <label class="text-sm font-medium">Ceiling Height (m)</label>
                        <input type="text" :value="getDisplayValue(floor, 'ceilingHeight', 2)"
                            @input="e => formatFloorInput(e, floor, 'ceilingHeight', true, 2, floor.floorId)"
                            class="border p-2 rounded text-right" />
                    </div>

                    <div class="flex flex-col">
                        <label class="text-sm font-medium">Floor Load (ton/㎡)</label>
                        <input type="text" :value="getDisplayValue(floor, 'floorLoad', 2)"
                            @input="e => formatFloorInput(e, floor, 'floorLoad', true, 2, floor.floorId)"
                            class="border p-2 rounded text-right" />
                    </div>

                    <div class="flex flex-col">
                        <label class="text-sm font-medium">Truck Berths (ea)</label>
                        <input type="text" :value="getDisplayValue(floor, 'truckBerths', 0)"
                            @input="e => formatFloorInput(e, floor, 'truckBerths', false, 0, floor.floorId)"
                            class="border p-2 rounded text-right" />
                    </div>

                </div>

                <fieldset class="border p-3 rounded-lg space-y-4 bg-gray-50 mb-6">
                    <legend class="text-sm font-semibold px-2 text-gray-600">Floor Area</legend>
                    <div class="grid md:grid-cols-2 gap-4">

                        <div class="flex flex-col ">
                            <label class="text-xs font-medium">Total Area (㎡)</label>
                            <input type="text" :value="getDisplayValue(floor, 'totalAreaSqm', 2)"
                                @input="e => formatFloorInput(e, floor, 'totalAreaSqm', true, 2, floor.floorId)"
                                @blur="handleFloorAreaInputBlur(fIndex, 'totalAreaSqm')"
                                class="border p-2 rounded text-right" />
                        </div>

                        <div class="flex flex-col ">
                            <label class="text-xs font-medium">Total Area (py)</label>
                            <input type="text" :value="getDisplayValue(floor, 'totalAreaPy', 2)"
                                @input="e => formatFloorInput(e, floor, 'totalAreaPy', true, 2, floor.floorId)"
                                class="border p-2 rounded text-right" />
                        </div>

                        <div class="flex flex-col ">
                            <label class="text-xs font-medium">Gross Leasable Area (㎡)</label>
                            <input type="text" :value="getDisplayValue(floor, 'grossLeasableAreaSqm', 2)"
                                @input="e => formatFloorInput(e, floor, 'grossLeasableAreaSqm', true, 2, floor.floorId)"
                                @blur="handleFloorAreaInputBlur(fIndex, 'grossLeasableAreaSqm')"
                                class="border p-2 rounded text-right" />
                        </div>

                        <div class="flex flex-col ">
                            <label class="text-xs font-medium">Gross Leasable Area (py)</label>
                            <input type="text" :value="getDisplayValue(floor, 'grossLeasableAreaPy', 2)"
                                @input="e => formatFloorInput(e, floor, 'grossLeasableAreaPy', true, 2, floor.floorId)"
                                class="border p-2 rounded text-right" />
                        </div>

                        <div class="flex flex-col ">
                            <label class="text-xs font-medium">Net Leasable Area (㎡)</label>
                            <input type="text" :value="getDisplayValue(floor, 'netLeasableAreaSqm', 2)"
                                @input="e => formatFloorInput(e, floor, 'netLeasableAreaSqm', true, 2, floor.floorId)"
                                @blur="handleFloorAreaInputBlur(fIndex, 'netLeasableAreaSqm')"
                                class="border p-2 rounded text-right" />
                        </div>

                        <div class="flex flex-col ">
                            <label class="text-xs font-medium">Net Leasable Area (py)</label>
                            <input type="text" :value="getDisplayValue(floor, 'netLeasableAreaPy', 2)"
                                @input="e => formatFloorInput(e, floor, 'netLeasableAreaPy', true, 2, floor.floorId)"
                                class="border p-2 rounded text-right" />
                        </div>
                    </div>
                </fieldset>

                <fieldset class="border p-3 rounded-lg space-y-4 bg-gray-100">
                    <legend class="text-sm font-semibold px-2 text-gray-600">Unit/Room Details</legend>

                    <div v-for="(partial, pIndex) in floor.floorPartial"
                        :key="partial.id ?? `temp-partial-${floor.floorId}-${pIndex}`"
                        class="p-3 border rounded bg-white">
                        <div class="flex justify-between items-start mb-3 border-b pb-2">
                            <h4 class="text-md font-bold">
                                Unit #{{ pIndex + 1 }}
                                <input type="text" v-model="partial.unitNumber" placeholder="Unit Number"
                                    class="border px-2 py-1 rounded w-32 text-sm font-normal ml-2" />
                            </h4>
                            <button type="button" @click="removeUnit(fIndex, pIndex)"
                                class="bg-red-500 hover:bg-red-700 text-sm px-2 py-1 rounded-[10px] text-gray-100 flex items-center">
                                <img :title="`Delete Property`" src="/images/delete.png" class="w-[20px] invert-png" />
                                Delete Unit
                            </button>
                        </div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="flex flex-col col-span-2">
                                <label class="text-xs font-medium">Tenant</label>
                                <input type="text" v-model="partial.tenant" class="border p-2 rounded" />
                            </div>

                            <div class="flex flex-col">
                                <label class="text-xs font-medium">Lease Area (㎡)</label>
                                <input type="text" :value="getDisplayValue(partial, 'leaseAreaSqm', 2, pIndex)"
                                    @input="e => formatFloorInput(e, partial, 'leaseAreaSqm', true, 2, floor.floorId, pIndex)"
                                    @blur="handlePartialAreaInputBlur(fIndex, pIndex)"
                                    class="border p-2 rounded text-right" />
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs font-medium">Lease Area (py)</label>
                                <input type="text" :value="getDisplayValue(partial, 'leaseAreaPy', 2, pIndex)"
                                    @input="e => formatFloorInput(e, partial, 'leaseAreaPy', true, 2, floor.floorId, pIndex)"
                                    class="border p-2 rounded text-right" />
                            </div>

                            <div class="flex flex-col">
                                <label class="text-xs font-medium">Tenant Use</label>
                                <select v-model="partial.tenantUse" class="border p-2 rounded text-xs">
                                    <option :value="null">— Select Use —</option>
                                    <option v-for="type in ROOM_USE_TYPES" :key="type" :value="type">{{ type }}</option>
                                </select>
                            </div>

                            <div class="flex flex-col justify-end">
                                <label class="text-xs font-medium">Tenant Equipment</label>
                                <input type="checkbox" v-model="partial.tenantEquipment" class="w-5 h-5 mt-2" />
                            </div>

                            <div class="grid md:grid-cols-2 gap-4 placeholder-text-xs">
                                <div class="flex flex-col">
                                    <label class="text-xs font-medium">Lease Start</label>
                                    <input type="text" maxlength="10" :value="partial.leaseStartDateDisplay"
                                        @input="e => formatDateInput(e, partial, 'leaseStartDate')"
                                        placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}"
                                        class="border p-2 rounded" />
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-xs font-medium">Lease End</label>
                                    <input type="text" maxlength="10" :value="partial.leaseEndDateDisplay"
                                        @input="e => formatDateInput(e, partial, 'leaseEndDate')"
                                        placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}"
                                        class="border p-2 rounded" />
                                </div>
                            </div>

                            <div class="flex flex-col">
                                <label class="text-xs font-medium">Deposit (krw)</label>
                                <input type="text" :value="getDisplayValue(partial, 'depositKrw', 0, pIndex)"
                                    @input="e => formatFloorInput(e, partial, 'depositKrw', true, 0, floor.floorId, pIndex)"
                                    class="border p-2 rounded text-right" />
                            </div>

                            <div class="flex flex-col">
                                <label class="text-xs font-medium">Monthly Rent (krw/total)</label>
                                <input type="text" :value="getDisplayValue(partial, 'monthlyRent', 0, pIndex)"
                                    @input="e => formatFloorInput(e, partial, 'monthlyRent', true, 0, floor.floorId, pIndex)"
                                    class="border p-2 rounded text-right" />
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs font-medium">Monthly Rent (krw per py)</label>
                                <input type="text" :value="getDisplayValue(partial, 'monthlyRentPerPy', 0, pIndex)"
                                    @input="e => formatFloorInput(e, partial, 'monthlyRentPerPy', true, 0, floor.floorId, pIndex)"
                                    class="border p-2 rounded text-right" />
                            </div>

                            <div class="flex flex-col">
                                <label class="text-xs font-medium">Mgmt Fee (krw/total)</label>
                                <input type="text" :value="getDisplayValue(partial, 'monthlyManagementFee', 0, pIndex)"
                                    @input="e => formatFloorInput(e, partial, 'monthlyManagementFee', true, 0, floor.floorId, pIndex)"
                                    class="border p-2 rounded text-right" />
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs font-medium">Mgmt Fee (krw per py)</label>
                                <input type="text"
                                    :value="getDisplayValue(partial, 'monthlyManagementPerPy', 0, pIndex)"
                                    @input="e => formatFloorInput(e, partial, 'monthlyManagementPerPy', true, 0, floor.floorId, pIndex)"
                                    class="border p-2 rounded text-right" />
                            </div>

                            <div class="flex flex-col">
                                <label class="text-xs font-medium">Rent Free</label>
                                <input type="text" v-model="partial.rentFree" class="border p-2 rounded" />
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs font-medium">Fit Out</label>
                                <input type="text" v-model="partial.fitOut" class="border p-2 rounded" />
                            </div>

                            <div class="flex flex-col col-span-2">
                                <label class="text-xs font-medium">Increase Conditions (Deposit / Rent / Mgmt
                                    Fee)</label>
                                <div class="grid grid-cols-1 gap-2">
                                    <div class="flex flex-col">
                                        <label class="text-xs font-medium"> - Deposit Cond.</label>
                                        <textarea :value="partial.increaseConditionsForDeposit ?? ''"
                                            @input="handleNullableStringInput(partial, 'increaseConditionsForDeposit', $event)"
                                            placeholder="Deposit Cond." rows="3" class="border p-2 rounded resize-y" />
                                    </div>
                                    <div class="flex flex-col">
                                        <label class="text-xs font-medium"> - Rent Cond.</label>
                                        <textarea :value="partial.increaseConditionsForRent ?? ''"
                                            @input="handleNullableStringInput(partial, 'increaseConditionsForRent', $event)"
                                            placeholder="Rent Cond." rows="3" class="border p-2 rounded resize-y" />
                                    </div>
                                    <div class="flex flex-col">
                                        <label class="text-xs font-medium"> - Mgmt Fee Cond.</label>
                                        <textarea :value="partial.increaseConditionsForManagementFee ?? ''"
                                            @input="handleNullableStringInput(partial, 'increaseConditionsForManagementFee', $event)"
                                            placeholder="Mgmt Fee Cond." rows="3" class="border p-2 rounded resize-y" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <button type="button" @click="addUnit(fIndex)"
                        class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white hover:text-primary rounded-[10px] px-2 py-1 text-sm font-medium">
                        + Add Unit
                    </button>
                </fieldset>

            </div>

            <div class="flex justify-end pt-4 border-t">
                <button type="button" @click="emit('close')" :disabled="computedIsLoading" class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    Cancel
                </button>
                <button type="button" @click="resetForm()" class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">Reset</button>
                <button type="submit" :disabled="computedIsLoading" class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white hover:text-primary font-bold py-2 px-4 rounded-[10px] transition duration-150 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ">
                    <svg v-if="computedIsLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ computedIsLoading ? 'Saving...' : 'Save and Close' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, reactive } from 'vue'; // 💡 reactive 임포트
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app';
import { createToast } from 'mosha-vue-toastify';
// 💡 [수정] useFormat 훅 임포트
import { useFormat } from '~/composables/useFormat';

import type {
    FloorType,
    FloorForm,
    FloorPartialForm,
} from '~/types/asset.type';
import {
    FloorUseTypeEnum,
    RoomUseTypeEnum
} from '~/types/asset.type';

// 💡 [수정] useFormat 훅 실행 및 필요한 함수 구조분해 할당
const {
    numberFormat,
    formatDate,
    formatDateInput,
    calculatePyValue,
    processNumberInput
} = useFormat();

const FLOOR_USE_TYPES = Object.values(FloorUseTypeEnum);
const ROOM_USE_TYPES = Object.values(RoomUseTypeEnum);

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const appStore = useAppStore();
const computedIsLoading = computed(() => appStore.isLoading);
const formData = ref<FloorForm[]>([]);

// 💡 [제거] 로컬 formatDate 함수 (useFormat에서 가져옴)
// 💡 [제거] 로컬 formatDateInput 함수 (useFormat에서 가져옴)

// ⭐ 1. displayValues 로직 (기존과 동일)
const displayValues = reactive<{
    [key: string]: string;
}>({});

// ⭐ 2. getDisplayValue 로직 (기존과 동일, numberFormat은 공통 함수를 사용)
const getDisplayValue = (
    dataObject: any,
    field: string,
    decimalPlaces: number,
    partialIndex?: number,
) => {
    let key = '';

    if (partialIndex !== undefined) {
        const partialId = dataObject.id || `temp-${partialIndex}`;
        key = `partial_${partialId}_${field}`;
    } else {
        key = `${dataObject.floorId}_${field}`;
    }

    if (!(key in displayValues)) {
        displayValues[key] = dataObject[field] !== null ? numberFormat(dataObject[field], decimalPlaces) : '';
    }
    return displayValues[key];
};

// ⭐ 3. 💡 [수정] formatFloorInput 함수 (공통 processNumberInput 함수 사용)
const formatFloorInput = (
    e: Event,
    dataObject: any,
    field: string,
    isDecimal: boolean,
    decimalPlaces: number = 0,
    floorId: string,
    partialIndex?: number
) => {
    const target = e.target as HTMLInputElement;
    let value = target.value;
    let key = '';

    if (partialIndex !== undefined) {
        const partialId = dataObject.id || `temp-${partialIndex}`;
        key = `partial_${partialId}_${field}`;
    } else {
        key = `${floorId}_${field}`;
    }

    // 1. 💡 공통 함수 호출
    const { cleanedValue, formattedValue, numericValue } = processNumberInput(value, isDecimal, decimalPlaces);

    // 2. 모델 업데이트 (기존 로직 동일)
    if (numericValue !== null || cleanedValue === '') {
        dataObject[field] = numericValue;
    }

    // 3. 뷰(DOM) 업데이트 (기존 로직 동일)
    displayValues[key] = formattedValue;
    target.value = formattedValue;
};

// ⭐ 4. 초기화 워치 로직 (기존과 동일, numberFormat은 공통 함수를 사용)
watch(() => formData.value, (newFloors) => {
    for (const key in displayValues) {
        delete displayValues[key];
    }
    newFloors.forEach(floor => {
        const key = `${floor.floorId}_totalAreaSqm`;
        displayValues[key] = floor.totalAreaSqm !== null ? numberFormat(floor.totalAreaSqm, 2) : '';
    });
}, { deep: true, immediate: true });


// --- Sqm/Py 자동 계산 및 클렌징 로직 ---

// 💡 [제거] 로컬 PY_RATIO (useFormat에서 가져옴)
// 💡 [제거] 로컬 calculatePyValue 함수 (useFormat에서 가져옴)

const cleanAndRoundSqm = (rawValue: number | null | undefined): number | null => {
    if (typeof rawValue === 'number' && !isNaN(rawValue)) {
        return parseFloat(rawValue.toFixed(2));
    }
    return null;
}

// --- Textarea <-> Store 로직 ---
const handleNullableStringInput = (
    partial: FloorPartialForm,
    field: keyof FloorPartialForm,
    event: Event
) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const value = target.value;
    (partial as any)[field] = value.trim() === '' ? null : value;
};

// 💡 [수정] 공통 calculatePyValue 함수 사용
const handleFloorAreaInputBlur = (floorIndex: number, field: 'totalAreaSqm' | 'grossLeasableAreaSqm' | 'netLeasableAreaSqm') => {
    const floor = formData.value[floorIndex] as any;
    const rawValue = floor[field];
    const pyField = (field.replace('Sqm', 'Py')) as keyof FloorForm;

    const cleanedSqm = cleanAndRoundSqm(rawValue);
    floor[field] = cleanedSqm;

    if (cleanedSqm !== null) {
        floor[pyField] = calculatePyValue(cleanedSqm); // 공통 함수
    } else {
        floor[pyField] = null;
    }
};

// 💡 [수정] 공통 calculatePyValue 함수 사용
const handlePartialAreaInputBlur = (floorIndex: number, partialIndex: number) => {
    const partial = formData.value[floorIndex].floorPartial[partialIndex];
    const rawValue = partial.leaseAreaSqm;

    const cleanedSqm = cleanAndRoundSqm(rawValue);
    partial.leaseAreaSqm = cleanedSqm;

    if (cleanedSqm !== null) {
        partial.leaseAreaPy = calculatePyValue(cleanedSqm); // 공통 함수
    } else {
        partial.leaseAreaPy = null;
    }
};

// --- 폼 초기화 및 동적 행 생성 로직 ---

const createDefaultPartial = (index: number): FloorPartialForm => ({
    id: `temp_partial_${Date.now()}_${index}`,
    unitNumber: `Unit ${index + 1}`,
    leaseAreaSqm: null, leaseAreaPy: null,
    tenantEquipment: false,
    tenant: null, tenantUse: null,
    leaseStartDate: null,
    leaseEndDate: null,
    leaseStartDateDisplay: null,
    leaseEndDateDisplay: null,
    depositKrw: null, monthlyRentPerPy: null, monthlyRent: null,
    monthlyManagementPerPy: null, monthlyManagementFee: null,
    increaseConditionsForDeposit: null, increaseConditionsForRent: null,
    increaseConditionsForManagementFee: null, rentFree: null, fitOut: null,
});

const initializeForm = () => {
    const sizes = propertyStore.sizes;
    const existingFloors = propertyStore.floorList || [];

    if (!sizes) {
        formData.value = [];
        return;
    }

    const newFloors: FloorForm[] = [];
    const upperLevels = sizes.upperLevels || 0;
    const basementLevels = sizes.basementLevels || 0;

    // A. 지하층 (BASEMENT) 생성
    for (let i = basementLevels; i >= 1; i--) {
        const floorNum = -i;
        const existing: any = existingFloors.find(f => f.type === 'BASEMENT' && f.floor === floorNum);

        const floorData: FloorForm = {
            floorId: existing ? existing.id : `temp_B${i}`,
            isNew: !existing,
            type: 'BASEMENT',
            floor: floorNum,

            ...(existing || {}),
            floorPartial: (existing?.floorPartial || [createDefaultPartial(0)]).map((partial: any) => ({
                ...partial,
                // 💡 [수정] 공통 formatDate 함수 사용
                leaseStartDateDisplay: partial.leaseStartDate
                    ? formatDate(partial.leaseStartDate)
                    : null,
                leaseEndDateDisplay: partial.leaseEndDate
                    ? formatDate(partial.leaseEndDate)
                    : null,
            })) as FloorPartialForm[],


            ceilingHeight: existing?.ceilingHeight ?? null,
            ceilingHeightUnit: existing?.ceilingHeightUnit ?? 'm',
            floorLoad: existing?.floorLoad ?? null,
            floorLoadUnit: existing?.floorLoadUnit ?? 'ton/㎡',
            truckBerths: existing?.truckBerths ?? null,
            use: existing?.use ?? null,
            totalAreaSqm: existing?.totalAreaSqm ?? null, totalAreaPy: existing?.totalAreaPy ?? null,
            grossLeasableAreaSqm: existing?.grossLeasableAreaSqm ?? null, grossLeasableAreaPy: existing?.grossLeasableAreaPy ?? null,
            netLeasableAreaSqm: existing?.netLeasableAreaSqm ?? null, netLeasableAreaPy: existing?.netLeasableAreaPy ?? null,
        };
        newFloors.push(floorData);
    }

    // B. 지상층 (UPPER) 생성
    for (let i = 1; i <= upperLevels; i++) {
        const floorNum = i;
        const existing: any = existingFloors.find(f => f.type === 'UPPER' && f.floor === floorNum);

        const floorData: FloorForm = {
            floorId: existing ? existing.id : `temp_U${i}`,
            isNew: !existing,
            type: 'UPPER',
            floor: floorNum,

            ...(existing || {}),
            floorPartial: (existing?.floorPartial || [createDefaultPartial(0)]).map((partial: any) => ({
                ...partial,
                // 💡 [수정] 공통 formatDate 함수 사용
                leaseStartDateDisplay: partial.leaseStartDate
                    ? formatDate(partial.leaseStartDate)
                    : null,
                leaseEndDateDisplay: partial.leaseEndDate
                    ? formatDate(partial.leaseEndDate)
                    : null,
            })) as FloorPartialForm[],

            ceilingHeight: existing?.ceilingHeight ?? null,
            ceilingHeightUnit: existing?.ceilingHeightUnit ?? 'm',
            floorLoad: existing?.floorLoad ?? null,
            floorLoadUnit: existing?.floorLoadUnit ?? 'ton/㎡',
            truckBerths: existing?.truckBerths ?? null,
            use: existing?.use ?? null,
            totalAreaSqm: existing?.totalAreaSqm ?? null, totalAreaPy: existing?.totalAreaPy ?? null,
            grossLeasableAreaSqm: existing?.grossLeasableAreaSqm ?? null, grossLeasableAreaPy: existing?.grossLeasableAreaPy ?? null,
            netLeasableAreaSqm: existing?.netLeasableAreaSqm ?? null, netLeasableAreaPy: existing?.netLeasableAreaPy ?? null,
        };
        newFloors.push(floorData);
    }

    formData.value = newFloors;
};

watch(() => [propertyStore.propertyId, propertyStore.sizes], initializeForm, { immediate: true, deep: true });

// --- 유닛 추가/제거 로직 ---
const addUnit = (floorIndex: number) => {
    const floor = formData.value[floorIndex];
    const newIndex = floor.floorPartial.length;
    floor.floorPartial.push(createDefaultPartial(newIndex));
};

const removeUnit = (floorIndex: number, partialIndex: number) => {
    if (formData.value[floorIndex].floorPartial.length > 1) {
        formData.value[floorIndex].floorPartial.splice(partialIndex, 1);
    } else {
        createToast({ title: 'You must keep at least one unit.' }, { type: 'warning' });
    }
};


// --- 🎯 Reset 기능 추가 ---
const resetForm = () => {
    initializeForm();
    createToast({
        title: 'Form restored to current asset data.',
    }, {
        type: 'success',
        timeout: 5000,
        showCloseButton: true,
        position: 'top-right',
        transition: 'bounce',
        hideProgressBar: false,
        swipeClose: true,
    })
}

// --- 폼 제출 로직 (API 전송) ---

const toInt = (value: number | null): number | null => (value === null || value === undefined) ? null : Math.round(value);
const roundToTwoDecimals = (value: number | null): number | null => {
    if (value === null || value === undefined) return null;
    return parseFloat(value.toFixed(2));
};

const onSubmit = async () => {
    appStore.setLoading(true);

    const payload = formData.value.map(floor => ({
        id: floor.isNew ? undefined : floor.floorId,
        property_id: propertyStore.propertyId,
        type: floor.type,
        floor: floor.floor,

        ceiling_height: roundToTwoDecimals(floor.ceilingHeight),
        ceiling_height_unit: floor.ceilingHeightUnit,
        floor_load: roundToTwoDecimals(floor.floorLoad),
        floor_load_unit: floor.floorLoadUnit,
        truck_berths: toInt(floor.truckBerths),
        use: floor.use,
        total_area_sqm: roundToTwoDecimals(floor.totalAreaSqm),
        total_area_py: roundToTwoDecimals(floor.totalAreaPy),
        gross_leasable_area_sqm: roundToTwoDecimals(floor.grossLeasableAreaSqm),
        gross_leasable_area_py: roundToTwoDecimals(floor.grossLeasableAreaPy),
        net_leasable_area_sqm: roundToTwoDecimals(floor.netLeasableAreaSqm),
        net_leasable_area_py: roundToTwoDecimals(floor.netLeasableAreaPy),

        floorPartial: floor.floorPartial.map(partial => ({
            id: partial.id && partial.id.startsWith('temp_') ? undefined : partial.id,
            unit_number: partial.unitNumber,
            tenant: partial.tenant,
            lease_area_sqm: roundToTwoDecimals(partial.leaseAreaSqm),
            lease_area_py: roundToTwoDecimals(partial.leaseAreaPy),
            tenant_equipment: partial.tenantEquipment,
            tenant_use: partial.tenantUse,

            lease_start_date: partial.leaseStartDate
                ? new Date(partial.leaseStartDate)
                : null,
            lease_end_date: partial.leaseEndDate
                ? new Date(partial.leaseEndDate)
                : null,
            deposit_krw: toInt(partial.depositKrw),
            monthly_rent_per_py: roundToTwoDecimals(partial.monthlyRentPerPy),
            monthly_rent: toInt(partial.monthlyRent),
            monthly_management_per_py: roundToTwoDecimals(partial.monthlyManagementPerPy),
            monthly_management_fee: toInt(partial.monthlyManagementFee),
            increase_conditions_for_deposit: partial.increaseConditionsForDeposit,
            increase_conditions_for_rent: partial.increaseConditionsForRent,
            increase_conditions_for_management_fee: partial.increaseConditionsForManagementFee,
            rent_free: partial.rentFree,
            fit_out: partial.fitOut,
        }))
    }));

    try {
        const updatedFloors = await $fetch<FloorType[]>(`/api/upload/${propertyStore.propertyId}/floor`, {
            method: 'PUT',
            body: payload,
        });

        propertyStore.updateFloorList(updatedFloors);

        await nextTick();

        emit('close');

        createToast({ title: 'Floor information has been successfully saved.' }, { type: 'success' });

    } catch (error) {
        console.error('API 업데이트 오류:', error);
        createToast({ title: 'Failed to update floor information.' }, { type: 'danger' });
    } finally {
        appStore.setLoading(false);
    }
};
</script>
<style scoped>
.invert-png {
    filter: invert(100%);
}
</style>