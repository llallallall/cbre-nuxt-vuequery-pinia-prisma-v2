<template>
    <div class="p-6 space-y-6">
        <form @submit.prevent="onSubmit" class="space-y-8">

            <fieldset class="border p-4 rounded-lg space-y-4">
                <legend class="text-sm font-semibold text-gray-600 px-2">Building Structure</legend>
                <div class="flex gap-4 items-end">
                    <div class="flex-1">
                        <label class="block text-sm font-medium mb-1">Upper Levels (Ground Floors)</label>
                        <input type="text" :value="upperLevelsCountDisplay"
                            @input="e => handleStructureInput(e, 'upperLevelsCount')"
                            class="w-full border border-gray-300 rounded-md p-2 text-right" placeholder="e.g. 5" />
                    </div>
                    <div class="flex-1">
                        <label class="block text-sm font-medium mb-1">Basement Levels</label>
                        <input type="text" :value="basementLevelsCountDisplay"
                            @input="e => handleStructureInput(e, 'basementLevelsCount')"
                            class="w-full border border-gray-300 rounded-md p-2 text-right" placeholder="e.g. 2" />
                    </div>
                    <button type="button" @click="generateFloors(true)"
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 h-[42px]">
                        Generate Floors
                    </button>
                </div>
                <p class="text-xs text-gray-500">Clicking 'Generate' will reset the floor list based on the counts
                    above.</p>
            </fieldset>

            <div v-if="formData.length === 0" class="text-center py-10 text-gray-500 border rounded-lg bg-gray-50">
                Please enter the building structure and click 'Generate Floors'.
            </div>

            <div v-for="(floor, fIndex) in formData" :key="floor.floorId"
                class="border p-4 rounded-lg shadow-sm bg-white space-y-6">

                <div class="flex justify-between items-center border-b pb-2">
                    <h3 class="text-lg font-bold text-primary">
                        {{ floor.type === 'UPPER' ? '' : 'B' }}{{ Math.abs(floor.floor ?? 0) }}F
                        <span :class="floor.isNew ? 'text-green-600' : 'text-gray-500'"
                            class="text-sm font-normal ml-2">
                            ({{ floor.isNew ? 'New' : 'Existing' }})
                        </span>
                    </h3>
                </div>

                <div class="grid md:grid-cols-4 gap-4">
                    <div class="flex flex-col">
                        <label class="text-sm font-medium mb-1">Usage</label>
                        <select v-model="floor.use" class="border p-2 rounded text-sm">
                            <option :value="null">— Select —</option>
                            <option v-for="type in FLOOR_USE_TYPES" :key="type" :value="type">{{ type }}</option>
                        </select>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-medium mb-1">Ceiling Height (m)</label>
                        <input type="text" :value="getDisplayValue(floor, 'ceilingHeight', 2)"
                            @input="e => formatFloorInput(e, floor, 'ceilingHeight', true, 2, floor.floorId)"
                            class="border p-2 rounded text-right" />
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-medium mb-1">Floor Load (t/㎡)</label>
                        <input type="text" :value="getDisplayValue(floor, 'floorLoad', 2)"
                            @input="e => formatFloorInput(e, floor, 'floorLoad', true, 2, floor.floorId)"
                            class="border p-2 rounded text-right" />
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-medium mb-1">Truck Berths</label>
                        <input type="text" :value="getDisplayValue(floor, 'truckBerths', 0)"
                            @input="e => formatFloorInput(e, floor, 'truckBerths', false, 0, floor.floorId)"
                            class="border p-2 rounded text-right" />
                    </div>
                </div>

                <fieldset class="border p-3 rounded bg-gray-50">
                    <legend class="text-xs font-semibold px-2 text-gray-600">Floor Area Measurements</legend>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="space-y-1">
                            <label class="text-xs font-medium block">Total Area (㎡)</label>
                            <input type="text" :value="getDisplayValue(floor, 'totalAreaSqm', 2)"
                                @input="e => formatFloorInput(e, floor, 'totalAreaSqm', true, 2, floor.floorId)"
                                @blur="() => handleFloorAreaInputBlur(fIndex, 'totalAreaSqm')"
                                class="w-full border p-2 rounded text-right text-sm" />
                            <input type="text" :value="getDisplayValue(floor, 'totalAreaPy', 2)" disabled
                                class="w-full border bg-gray-100 p-2 rounded text-right text-sm text-gray-500"
                                placeholder="(py)" />
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-medium block">Gross Leasable (㎡)</label>
                            <input type="text" :value="getDisplayValue(floor, 'grossLeasableAreaSqm', 2)"
                                @input="e => formatFloorInput(e, floor, 'grossLeasableAreaSqm', true, 2, floor.floorId)"
                                @blur="() => handleFloorAreaInputBlur(fIndex, 'grossLeasableAreaSqm')"
                                class="w-full border p-2 rounded text-right text-sm" />
                            <input type="text" :value="getDisplayValue(floor, 'grossLeasableAreaPy', 2)" disabled
                                class="w-full border bg-gray-100 p-2 rounded text-right text-sm text-gray-500"
                                placeholder="(py)" />
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-medium block">Net Leasable (㎡)</label>
                            <input type="text" :value="getDisplayValue(floor, 'netLeasableAreaSqm', 2)"
                                @input="e => formatFloorInput(e, floor, 'netLeasableAreaSqm', true, 2, floor.floorId)"
                                @blur="() => handleFloorAreaInputBlur(fIndex, 'netLeasableAreaSqm')"
                                class="w-full border p-2 rounded text-right text-sm" />
                            <input type="text" :value="getDisplayValue(floor, 'netLeasableAreaPy', 2)" disabled
                                class="w-full border bg-gray-100 p-2 rounded text-right text-sm text-gray-500"
                                placeholder="(py)" />
                        </div>
                    </div>
                </fieldset>

                <fieldset class="border p-3 rounded bg-blue-50/30">
                    <legend class="text-xs font-semibold px-2 text-blue-600">Unit / Room Details</legend>

                    <div v-for="(partial, pIndex) in floor.floorPartial" :key="partial.id"
                        class="mb-4 p-3 bg-white rounded border shadow-sm relative">
                        <div class="flex justify-between items-center mb-3 pb-2 border-b border-dashed">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-bold text-gray-700">Unit #{{ pIndex + 1 }}</span>
                                <input type="text" v-model="partial.unitNumber" placeholder="Unit No."
                                    class="border px-2 py-1 rounded text-xs w-24" />
                            </div>
                            <button type="button" @click="removeUnit(fIndex, pIndex)"
                                class="text-red-500 text-xs hover:text-red-700 flex items-center gap-1">
                                <span>Delete Unit</span>
                            </button>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div class="col-span-2">
                                <label class="block font-medium mb-1">Tenant</label>
                                <input type="text" v-model="partial.tenant" class="w-full border p-2 rounded" />
                            </div>
                            <div class="col-span-1">
                                <label class="block font-medium mb-1">Lease Area (㎡)</label>
                                <input type="text" :value="getDisplayValue(partial, 'leaseAreaSqm', 2, pIndex)"
                                    @input="e => formatFloorInput(e, partial, 'leaseAreaSqm', true, 2, floor.floorId, pIndex)"
                                    @blur="() => handlePartialAreaInputBlur(fIndex, pIndex)"
                                    class="w-full border p-2 rounded text-right" />
                            </div>
                            <div class="col-span-1">
                                <label class="block font-medium mb-1">Lease Area (py)</label>
                                <input type="text" :value="getDisplayValue(partial, 'leaseAreaPy', 2, pIndex)" disabled
                                    class="w-full border bg-gray-100 p-2 rounded text-right text-gray-500" />
                            </div>

                            <div class="col-span-1">
                                <label class="block font-medium mb-1">Usage</label>
                                <select v-model="partial.tenantUse" class="w-full border p-2 rounded">
                                    <option :value="null">-</option>
                                    <option v-for="type in ROOM_USE_TYPES" :key="type" :value="type">{{ type }}</option>
                                </select>
                            </div>

                            <div class="col-span-1">
                                <label class="block font-medium mb-1">Rent (Total)</label>
                                <input type="text" :value="getDisplayValue(partial, 'monthlyRent', 0, pIndex)"
                                    @input="e => formatFloorInput(e, partial, 'monthlyRent', true, 0, floor.floorId, pIndex)"
                                    class="w-full border p-2 rounded text-right" />
                            </div>
                            <div class="col-span-1">
                                <label class="block font-medium mb-1">Deposit</label>
                                <input type="text" :value="getDisplayValue(partial, 'depositKrw', 0, pIndex)"
                                    @input="e => formatFloorInput(e, partial, 'depositKrw', true, 0, floor.floorId, pIndex)"
                                    class="w-full border p-2 rounded text-right" />
                            </div>
                            <div class="col-span-1 flex items-center pt-4">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" v-model="partial.tenantEquipment"
                                        class="rounded text-blue-600" />
                                    <span class="font-medium">Equipment Included</span>
                                </label>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-dashed text-xs">
                            <div>
                                <label class="block font-medium mb-1">Lease Start (YYYY-MM-DD)</label>
                                <input type="text" :value="partial.leaseStartDateDisplay"
                                    @input="e => formatDateInput(e, partial, 'leaseStartDate')"
                                    class="w-full border p-2 rounded" placeholder="YYYY-MM-DD" maxlength="10" />
                            </div>
                            <div>
                                <label class="block font-medium mb-1">Lease End (YYYY-MM-DD)</label>
                                <input type="text" :value="partial.leaseEndDateDisplay"
                                    @input="e => formatDateInput(e, partial, 'leaseEndDate')"
                                    class="w-full border p-2 rounded" placeholder="YYYY-MM-DD" maxlength="10" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-2 mt-2 pt-2 border-t border-dashed">
                            <div class="flex flex-col">
                                <label class="text-xs font-medium"> - Deposit Cond.</label>
                                <textarea :value="partial.increaseConditionsForDeposit ?? ''"
                                    @input="handleNullableStringInput(partial, 'increaseConditionsForDeposit', $event)"
                                    placeholder="Deposit Cond." rows="2" class="border p-2 rounded resize-y text-xs" />
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs font-medium"> - Rent Cond.</label>
                                <textarea :value="partial.increaseConditionsForRent ?? ''"
                                    @input="handleNullableStringInput(partial, 'increaseConditionsForRent', $event)"
                                    placeholder="Rent Cond." rows="2" class="border p-2 rounded resize-y text-xs" />
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs font-medium"> - Mgmt Fee Cond.</label>
                                <textarea :value="partial.increaseConditionsForManagementFee ?? ''"
                                    @input="handleNullableStringInput(partial, 'increaseConditionsForManagementFee', $event)"
                                    placeholder="Mgmt Fee Cond." rows="2" class="border p-2 rounded resize-y text-xs" />
                            </div>
                        </div>
                    </div>

                    <button type="button" @click="addUnit(fIndex)"
                        class="w-full py-2 border-2 border-dashed border-blue-200 text-blue-500 hover:bg-blue-50 rounded text-sm font-medium mt-2">
                        + Add Unit
                    </button>
                </fieldset>

            </div>

            <div class="flex justify-end pt-4 border-t mt-8">
                <button type="button" @click="emit('close')" :disabled="computedIsLoading"
                    class="bg-gray-200 py-2 px-4 rounded mr-2 text-sm font-bold text-gray-700">Cancel</button>
                <button type="button" @click="resetForm"
                    class="bg-gray-300 py-2 px-4 rounded mr-2 text-sm font-bold text-gray-700">Reset</button>
                <button type="submit" :disabled="computedIsLoading"
                    class="bg-cbre_primary_1 text-white py-2 px-4 rounded text-sm font-bold hover:bg-cbre_primary_2">
                    {{ computedIsLoading ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useFormat } from '~/composables/useFormat';
import { createToast } from 'mosha-vue-toastify';

import type { FloorType, FloorPartialType } from '~/types/property.type';

// 💡 [핵심] 런타임 상수 정의
const FLOOR_USE_TYPES = ['ROOM', 'OFFICE', 'LOW', 'CONSTANT'];
const ROOM_USE_TYPES = ['DRY', 'COLD', 'OFFICE', 'OTHERS'];

// --- Local Type Definitions ---
// 💡 [수정] floorId를 Omit에 포함하여 필수 조건에서 제외
interface FloorPartialForm extends Omit<FloorPartialType, 'createdAt' | 'updatedAt' | 'id' | 'floorId'> {
    id?: string;
    leaseStartDateDisplay?: string | null;
    leaseEndDateDisplay?: string | null;
}

interface FloorForm extends Omit<FloorType, 'createdAt' | 'updatedAt' | 'id' | 'floorPartial'> {
    id?: string;
    floorId: string;
    isNew: boolean;
    floorPartial: FloorPartialForm[];
}

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);
const computedIsLoading = computed(() => statusStore.isGlobalLoading);

const {
    numberFormat,
    processNumberInput,
    calculatePyValue,
    formatDate,
    formatDateInput
} = useFormat();

const formData = ref<FloorForm[]>([]);
const structure = reactive({
    upperLevelsCount: 0,
    basementLevelsCount: 0,
});

const displayValues = reactive<Record<string, string>>({});

const upperLevelsCountDisplay = computed(() => numberFormat(structure.upperLevelsCount, 0));
const basementLevelsCountDisplay = computed(() => numberFormat(structure.basementLevelsCount, 0));

// --- Handlers ---

const getDisplayValue = (item: any, field: string, decimals: number, partialIndex?: number) => {
    let key = item.floorId ? `${item.floorId}_${field}` : `new_${field}`;
    if (partialIndex !== undefined) key += `_${partialIndex}`;

    if (!(key in displayValues)) {
        displayValues[key] = item[field] !== null ? numberFormat(item[field], decimals) : '';
    }
    return displayValues[key];
};

const handleStructureInput = (e: Event, field: 'upperLevelsCount' | 'basementLevelsCount') => {
    const val = (e.target as HTMLInputElement).value;
    const { numericValue } = processNumberInput(val, false, 0);
    structure[field] = numericValue || 0;
};

const formatFloorInput = (
    e: Event,
    dataObject: any,
    field: string,
    isDecimal: boolean,
    decimals: number,
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

    const { formattedValue, numericValue } = processNumberInput(value, isDecimal, decimals);

    dataObject[field] = numericValue;

    displayValues[key] = formattedValue;
    target.value = formattedValue;
};

const handleFloorAreaInputBlur = (floorIndex: number, field: 'totalAreaSqm' | 'grossLeasableAreaSqm' | 'netLeasableAreaSqm') => {
    const floor = formData.value[floorIndex] as any;
    const rawValue = floor[field];
    const pyField = (field.replace('Sqm', 'Py')) as keyof FloorForm;
    const pyKey = `${floor.floorId}_${pyField}`;

    const cleanedSqm = (typeof rawValue === 'number') ? parseFloat(rawValue.toFixed(2)) : null;
    floor[field] = cleanedSqm;

    if (cleanedSqm !== null && cleanedSqm > 0) {
        const pyVal = calculatePyValue(cleanedSqm);
        floor[pyField] = pyVal;
        displayValues[pyKey] = numberFormat(pyVal, 2);
    } else {
        floor[pyField] = null;
        displayValues[pyKey] = '';
    }
};

const handlePartialAreaInputBlur = (floorIndex: number, partialIndex: number) => {
    const partial = formData.value[floorIndex].floorPartial[partialIndex];
    const rawValue = partial.leaseAreaSqm;

    const cleanedSqm = (typeof rawValue === 'number') ? parseFloat(rawValue.toFixed(2)) : null;
    partial.leaseAreaSqm = cleanedSqm;

    if (cleanedSqm !== null && cleanedSqm > 0) {
        partial.leaseAreaPy = calculatePyValue(cleanedSqm);
    } else {
        partial.leaseAreaPy = null;
    }
};

const handleNullableStringInput = (partial: FloorPartialForm, field: keyof FloorPartialForm, event: Event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const value = target.value;
    (partial as any)[field] = value.trim() === '' ? null : value;
};

// --- Initialization ---

const createDefaultPartial = (idx: number): FloorPartialForm => ({
    id: `temp_p_${Date.now()}_${idx}`,
    // floorId: '', // 💡 Omit 되었으므로 불필요
    unitNumber: `Unit ${idx + 1}`,
    leaseAreaSqm: null, leaseAreaPy: null,
    tenantEquipment: false, tenant: null, tenantUse: null,
    leaseStartDate: null, leaseEndDate: null,
    leaseStartDateDisplay: null, leaseEndDateDisplay: null,
    depositKrw: null, monthlyRentPerPy: null, monthlyRent: null,
    monthlyManagementPerPy: null, monthlyManagementFee: null,
    increaseConditionsForDeposit: null, increaseConditionsForRent: null,
    increaseConditionsForManagementFee: null, rentFree: null, fitOut: null,
});

const mapToFloorForm = (exist: any, type: 'UPPER' | 'BASEMENT', floor: number): FloorForm => {
    const base: FloorForm = {
        floorId: exist?.id || `temp_${type}_${Math.abs(floor)}`,
        id: exist?.id,
        isNew: !exist,
        type,
        floor,
        propertyId: propertyStore.currentPropertyId,
        ceilingHeight: exist?.ceilingHeight ?? null,
        ceilingHeightUnit: exist?.ceilingHeightUnit ?? 'm',
        floorLoad: exist?.floorLoad ?? null,
        floorLoadUnit: exist?.floorLoadUnit ?? 'ton/㎡',
        truckBerths: exist?.truckBerths ?? null,
        use: exist?.use ?? null,
        totalAreaSqm: exist?.totalAreaSqm ?? null, totalAreaPy: exist?.totalAreaPy ?? null,
        grossLeasableAreaSqm: exist?.grossLeasableAreaSqm ?? null, grossLeasableAreaPy: exist?.grossLeasableAreaPy ?? null,
        netLeasableAreaSqm: exist?.netLeasableAreaSqm ?? null, netLeasableAreaPy: exist?.netLeasableAreaPy ?? null,
        floorPartial: []
    };

    if (exist && exist.floorPartial && exist.floorPartial.length > 0) {
        base.floorPartial = exist.floorPartial.map((p: any) => ({
            ...p,
            leaseStartDateDisplay: formatDate(p.leaseStartDate),
            leaseEndDateDisplay: formatDate(p.leaseEndDate)
        }));
    } else {
        base.floorPartial.push(createDefaultPartial(0));
    }
    return base;
};

const generateFloors = (reset = true) => {
    const upper = structure.upperLevelsCount;
    const basement = structure.basementLevelsCount;
    const existingFloors = currentProperty.value?.floor || [];
    const newFloors: FloorForm[] = [];

    for (let i = basement; i >= 1; i--) {
        const floorNum = -i;
        const exist: any = !reset ? existingFloors.find(f => f.type === 'BASEMENT' && f.floor === floorNum) : null;
        newFloors.push(mapToFloorForm(exist, 'BASEMENT', floorNum));
    }

    for (let i = 1; i <= upper; i++) {
        const floorNum = i;
        const exist: any = !reset ? existingFloors.find(f => f.type === 'UPPER' && f.floor === floorNum) : null;
        newFloors.push(mapToFloorForm(exist, 'UPPER', floorNum));
    }

    formData.value = newFloors;
    Object.keys(displayValues).forEach(k => delete displayValues[k]);
};

const initializeForm = () => {
    const scale = currentProperty.value?.scale;
    const existingFloors = currentProperty.value?.floor || [];

    structure.upperLevelsCount = scale?.upperLevels || 0;
    structure.basementLevelsCount = scale?.basementLevels || 0;

    if (existingFloors.length > 0) {
        generateFloors(false);
    } else {
        formData.value = [];
    }
};

watch(() => propertyStore.currentPropertyId, initializeForm, { immediate: true });

// --- Actions ---
const addUnit = (fIndex: number) => {
    const floor = formData.value[fIndex];
    floor.floorPartial.push(createDefaultPartial(floor.floorPartial.length));
};

const removeUnit = (fIndex: number, pIndex: number) => {
    const floor = formData.value[fIndex];
    if (floor.floorPartial.length > 1) {
        floor.floorPartial.splice(pIndex, 1);
    } else {
        createToast({ title: 'At least one unit required.' }, { type: 'warning' });
    }
};

const resetForm = () => {
    initializeForm();
    createToast({ title: 'Form Reset.' }, { type: 'info' });
};

const roundToTwoDecimals = (value: number | null): number | null => {
    if (value === null || value === undefined) return null;
    return parseFloat(value.toFixed(2));
};

const onSubmit = async () => {
    statusStore.setGlobalLoading(true);

    const payload = formData.value.map(f => ({
        id: f.isNew ? undefined : f.id,
        property_id: propertyStore.currentPropertyId,
        type: f.type,
        floor: f.floor,
        ceiling_height: roundToTwoDecimals(f.ceilingHeight),
        ceiling_height_unit: f.ceilingHeightUnit,
        floor_load: roundToTwoDecimals(f.floorLoad),
        floor_load_unit: f.floorLoadUnit,
        truck_berths: f.truckBerths,
        use: f.use,
        total_area_sqm: roundToTwoDecimals(f.totalAreaSqm),
        total_area_py: roundToTwoDecimals(f.totalAreaPy),
        gross_leasable_area_sqm: roundToTwoDecimals(f.grossLeasableAreaSqm),
        gross_leasable_area_py: roundToTwoDecimals(f.grossLeasableAreaPy),
        net_leasable_area_sqm: roundToTwoDecimals(f.netLeasableAreaSqm),
        net_leasable_area_py: roundToTwoDecimals(f.netLeasableAreaPy),

        floorPartial: f.floorPartial.map(p => ({
            id: p.id && p.id.startsWith('temp_') ? undefined : p.id,
            unit_number: p.unitNumber,
            tenant: p.tenant,
            lease_area_sqm: roundToTwoDecimals(p.leaseAreaSqm),
            lease_area_py: roundToTwoDecimals(p.leaseAreaPy),
            tenant_equipment: p.tenantEquipment,
            tenant_use: p.tenantUse,
            lease_start_date: p.leaseStartDate ? new Date(p.leaseStartDate) : null,
            lease_end_date: p.leaseEndDate ? new Date(p.leaseEndDate) : null,
            deposit_krw: p.depositKrw,
            monthly_rent: p.monthlyRent,
            monthly_rent_per_py: roundToTwoDecimals(p.monthlyRentPerPy),
            monthly_management_fee: p.monthlyManagementFee,
            monthly_management_per_py: roundToTwoDecimals(p.monthlyManagementPerPy),
            increase_conditions_for_deposit: p.increaseConditionsForDeposit,
            increase_conditions_for_rent: p.increaseConditionsForRent,
            increase_conditions_for_management_fee: p.increaseConditionsForManagementFee,
            rent_free: p.rentFree,
            fit_out: p.fitOut,
        }))
    }));

    try {
        const res = await $fetch<FloorType[]>(`/api/upload/${propertyStore.currentPropertyId}/floor`, {
            method: 'PUT',
            body: payload
        });

        if (propertyStore.currentProperty) {
            propertyStore.currentProperty.floor = res;
        }

        emit('close');
        createToast({ title: 'Floor data saved.' }, { type: 'success' });
    } catch (e) {
        console.error(e);
        createToast({ title: 'Failed to save.' }, { type: 'danger' });
    } finally {
        statusStore.setGlobalLoading(false);
    }
};
</script>