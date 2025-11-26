<template>
    <div class="p-6 space-y-6">
        <form @submit.prevent="onSubmit" class="space-y-8 font-financier">

            <fieldset class="border p-4 rounded-lg space-y-4">
                <legend class="text-base font-semibold text-primary px-2">Building Structure</legend>
                <div class="flex gap-4 items-end">
                    <div class="flex-1">
                        <label class="block text-base font-semibold text-primary mb-2">Upper Levels (Ground
                            Floors)</label>
                        <input type="text" :value="upperLevelsCountDisplay"
                            @input="e => handleStructureInput(e, 'upperLevelsCount')"
                            class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary"
                            placeholder="e.g. 5" />
                    </div>
                    <div class="flex-1">
                        <label class="block text-base font-semibold text-primary mb-2">Basement Levels</label>
                        <input type="text" :value="basementLevelsCountDisplay"
                            @input="e => handleStructureInput(e, 'basementLevelsCount')"
                            class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary"
                            placeholder="e.g. 2" />
                    </div>
                    <div class="pb-1">
                        <button type="button" @click="generateFloors(true)"
                            class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150">
                            Generate Floors
                        </button>
                    </div>
                </div>
                <p class="text-sm text-gray-500 italic">
                    * Click "Generate Floors" to create/reset the floor list based on the levels above.
                    Existing data for matching floor numbers will be preserved if possible.
                </p>
            </fieldset>

            <div v-if="formData.length > 0" class="space-y-6">
                <div v-for="(floor, fIndex) in formData" :key="floor.floorId" class="border rounded-lg p-4 bg-gray-50">
                    <div class="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 class="text-lg font-bold text-primary">
                            {{ floor.type === 'BASEMENT' ? `B${Math.abs(floor.floor)}` : `${floor.floor}F` }}
                        </h3>
                        <span v-if="floor.isNew" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">New</span>
                    </div>

                    <!-- Floor Common Info -->
                    <div class="grid grid-cols-4 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Ceiling Height</label>
                            <div class="flex">
                                <input type="text" :value="getDisplayValue(floor, 'ceilingHeight', 2)"
                                    @input="e => formatFloorInput(e, floor, 'ceilingHeight', true, 2, floor.floorId)"
                                    class="w-full border border-gray-300 rounded-l-md p-1 text-right" />
                                <select v-model="floor.ceilingHeightUnit"
                                    class="border border-l-0 border-gray-300 rounded-r-md bg-gray-100 text-sm">
                                    <option value="m">m</option>
                                    <option value="ft">ft</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Floor Load</label>
                            <div class="flex">
                                <input type="text" :value="getDisplayValue(floor, 'floorLoad', 2)"
                                    @input="e => formatFloorInput(e, floor, 'floorLoad', true, 2, floor.floorId)"
                                    class="w-full border border-gray-300 rounded-l-md p-1 text-right" />
                                <select v-model="floor.floorLoadUnit"
                                    class="border border-l-0 border-gray-300 rounded-r-md bg-gray-100 text-sm">
                                    <option value="ton/㎡">ton/㎡</option>
                                    <option value="kg/㎡">kg/㎡</option>
                                    <option value="lbs/ft²">lbs/ft²</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Truck Berths</label>
                            <input type="number" v-model.number="floor.truckBerths"
                                class="w-full border border-gray-300 rounded-md p-1 text-right" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Use</label>
                            <select v-model="floor.use" class="w-full border border-gray-300 rounded-md p-1">
                                <option :value="null">Select Use</option>
                                <option v-for="t in FLOOR_USE_TYPES" :key="t" :value="t">{{ t }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-4 mb-6 bg-white p-3 rounded border">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Total Area (Sqm)</label>
                            <input type="text" :value="getDisplayValue(floor, 'totalAreaSqm', 2)"
                                @input="e => formatFloorInput(e, floor, 'totalAreaSqm', true, 2, floor.floorId)"
                                @blur="() => handleFloorAreaInputBlur(fIndex, 'totalAreaSqm')"
                                class="w-full border border-gray-300 rounded-md p-1 text-right" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">GLA (Sqm)</label>
                            <input type="text" :value="getDisplayValue(floor, 'grossLeasableAreaSqm', 2)"
                                @input="e => formatFloorInput(e, floor, 'grossLeasableAreaSqm', true, 2, floor.floorId)"
                                @blur="() => handleFloorAreaInputBlur(fIndex, 'grossLeasableAreaSqm')"
                                class="w-full border border-gray-300 rounded-md p-1 text-right" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">NLA (Sqm)</label>
                            <input type="text" :value="getDisplayValue(floor, 'netLeasableAreaSqm', 2)"
                                @input="e => formatFloorInput(e, floor, 'netLeasableAreaSqm', true, 2, floor.floorId)"
                                @blur="() => handleFloorAreaInputBlur(fIndex, 'netLeasableAreaSqm')"
                                class="w-full border border-gray-300 rounded-md p-1 text-right" />
                        </div>
                        <!-- Py Values (Readonly) -->
                        <div>
                            <label class="block text-xs text-gray-500">Total Area (Py)</label>
                            <input type="text" :value="getDisplayValue(floor, 'totalAreaPy', 2)" readonly
                                class="w-full bg-gray-100 border border-gray-300 rounded-md p-1 text-right text-sm" />
                        </div>
                        <div>
                            <label class="block text-xs text-gray-500">GLA (Py)</label>
                            <input type="text" :value="getDisplayValue(floor, 'grossLeasableAreaPy', 2)" readonly
                                class="w-full bg-gray-100 border border-gray-300 rounded-md p-1 text-right text-sm" />
                        </div>
                        <div>
                            <label class="block text-xs text-gray-500">NLA (Py)</label>
                            <input type="text" :value="getDisplayValue(floor, 'netLeasableAreaPy', 2)" readonly
                                class="w-full bg-gray-100 border border-gray-300 rounded-md p-1 text-right text-sm" />
                        </div>
                    </div>

                    <!-- Partials (Units) -->
                    <div class="space-y-4">
                        <div v-for="(partial, pIndex) in floor.floorPartial" :key="partial.id"
                            class="border border-gray-200 rounded p-3 bg-white relative">
                            <div class="absolute top-2 right-2">
                                <button type="button" @click="removeUnit(fIndex, pIndex)"
                                    class="text-red-500 hover:text-red-700 text-sm">
                                    Remove Unit
                                </button>
                            </div>
                            <h4 class="text-sm font-bold text-gray-600 mb-2">Unit {{ pIndex + 1 }}</h4>

                            <div class="grid grid-cols-4 gap-3 mb-2">
                                <div>
                                    <label class="block text-xs font-medium text-gray-700">Unit Number</label>
                                    <input type="text" v-model="partial.unitNumber"
                                        class="w-full border border-gray-300 rounded-md p-1 text-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700">Tenant</label>
                                    <input type="text" :value="partial.tenant || ''"
                                        @input="e => handleNullableStringInput(partial, 'tenant', e)"
                                        class="w-full border border-gray-300 rounded-md p-1 text-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700">Lease Area (Sqm)</label>
                                    <input type="text" :value="getDisplayValue(partial, 'leaseAreaSqm', 2, pIndex)"
                                        @input="e => formatFloorInput(e, partial, 'leaseAreaSqm', true, 2, floor.floorId, pIndex)"
                                        @blur="() => handlePartialAreaInputBlur(fIndex, pIndex)"
                                        class="w-full border border-gray-300 rounded-md p-1 text-right text-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700">Lease Area (Py)</label>
                                    <input type="text"
                                        :value="partial.leaseAreaPy ? numberFormat(partial.leaseAreaPy, 2) : ''"
                                        readonly
                                        class="w-full bg-gray-100 border border-gray-300 rounded-md p-1 text-right text-sm" />
                                </div>
                            </div>

                            <div class="grid grid-cols-4 gap-3 mb-2">
                                <div>
                                    <label class="block text-xs font-medium text-gray-700">Tenant Use</label>
                                    <select v-model="partial.tenantUse"
                                        class="w-full border border-gray-300 rounded-md p-1 text-sm">
                                        <option :value="null">Select</option>
                                        <option v-for="t in ROOM_USE_TYPES" :key="t" :value="t">{{ t }}</option>
                                    </select>
                                </div>
                                <div class="flex items-center pt-5">
                                    <input type="checkbox" v-model="partial.tenantEquipment" class="mr-2" />
                                    <label class="text-xs font-medium text-gray-700">Tenant Equipment</label>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700">Lease Start</label>
                                    <input type="date" v-model="partial.leaseStartDateDisplay"
                                        @change="e => partial.leaseStartDate = (e.target as HTMLInputElement).value ? new Date((e.target as HTMLInputElement).value) : null"
                                        class="w-full border border-gray-300 rounded-md p-1 text-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700">Lease End</label>
                                    <input type="date" v-model="partial.leaseEndDateDisplay"
                                        @change="e => partial.leaseEndDate = (e.target as HTMLInputElement).value ? new Date((e.target as HTMLInputElement).value) : null"
                                        class="w-full border border-gray-300 rounded-md p-1 text-sm" />
                                </div>
                            </div>

                            <div class="grid grid-cols-4 gap-3">
                                <div>
                                    <label class="block text-xs font-medium text-gray-700">Deposit (KRW)</label>
                                    <input type="text" :value="getDisplayValue(partial, 'depositKrw', 0, pIndex)"
                                        @input="e => formatFloorInput(e, partial, 'depositKrw', false, 0, floor.floorId, pIndex)"
                                        class="w-full border border-gray-300 rounded-md p-1 text-right text-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700">Monthly Rent (KRW)</label>
                                    <input type="text" :value="getDisplayValue(partial, 'monthlyRent', 0, pIndex)"
                                        @input="e => formatFloorInput(e, partial, 'monthlyRent', false, 0, floor.floorId, pIndex)"
                                        class="w-full border border-gray-300 rounded-md p-1 text-right text-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700">Rent / Py</label>
                                    <input type="text" :value="getDisplayValue(partial, 'monthlyRentPerPy', 0, pIndex)"
                                        @input="e => formatFloorInput(e, partial, 'monthlyRentPerPy', false, 0, floor.floorId, pIndex)"
                                        class="w-full border border-gray-300 rounded-md p-1 text-right text-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700">Mgmt Fee / Py</label>
                                    <input type="text"
                                        :value="getDisplayValue(partial, 'monthlyManagementPerPy', 0, pIndex)"
                                        @input="e => formatFloorInput(e, partial, 'monthlyManagementPerPy', false, 0, floor.floorId, pIndex)"
                                        class="w-full border border-gray-300 rounded-md p-1 text-right text-sm" />
                                </div>
                            </div>
                        </div>
                        <button type="button" @click="addUnit(fIndex)"
                            class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 text-sm">
                            + Add Unit
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex flex-row items-center justify-end pt-8 border-t font-financierMedium">
                <button type="button" @click="emit('close')"
                    class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white py-2 px-4 rounded-[10px] mr-4 transition duration-150">Cancel</button>
                <button type="submit" :disabled="computedIsLoading"
                    class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150">Save</button>
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
interface FloorPartialForm extends Omit<FloorPartialType, 'createdAt' | 'updatedAt' | 'id' | 'floorId'> {
    id?: string;
    leaseStartDateDisplay?: string | null;
    leaseEndDateDisplay?: string | null;
}

interface FloorForm extends Omit<FloorType, 'createdAt' | 'updatedAt' | 'id' | 'floorPartial' | 'floor'> {
    id?: string;
    floorId: string;
    isNew: boolean;
    floorPartial: FloorPartialForm[];
    floor: number;
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
