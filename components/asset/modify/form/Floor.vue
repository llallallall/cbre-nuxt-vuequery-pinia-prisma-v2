<template>
    <div class="p-6 space-y-6">
        <form @submit.prevent="onSubmit" class="space-y-8">

            <div v-if="formData.length === 0" class="text-center py-10 text-gray-500 border rounded-lg">
                Please enter the building size information (number of above-ground/basement floors) first.
            </div>

            <div v-for="(floor, fIndex) in formData" :key="floor.floorId"
                class="border p-4 rounded-lg shadow-md bg-white">

                <h3 class="text-lg font-bold mb-4 text-primary">
                    {{ floor.type === 'UPPER' ? '' : 'B' }}{{ Math.abs(floor.floor ?? 0) }}F
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
                                    @blur="() => handlePartialAreaInputBlur(fIndex, pIndex)"
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

// 💡 [중요] Import Type (Value가 아님)
import type { FloorType, FloorPartialType } from '~/types/property.type';

// 💡 [핵심 수정] Enum 값을 런타임 상수로 직접 정의하여 사용
// (Import enum 대신 직접 정의하여 값 사용 오류 방지)
const FLOOR_USE_TYPES = ['ROOM', 'OFFICE', 'LOW', 'CONSTANT'];
const ROOM_USE_TYPES = ['DRY', 'COLD', 'OFFICE', 'OTHERS'];

// --- Local Type Definitions ---
interface FloorPartialForm extends Omit<FloorPartialType, 'createdAt' | 'updatedAt' | 'id'> {
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

const { numberFormat, processNumberInput, calculatePyValue, formatDate, formatDateInput } = useFormat();

const formData = ref<FloorForm[]>([]);
const structure = reactive({
    upperLevelsCount: 0,
    basementLevelsCount: 0,
});

const displayValues = reactive<Record<string, string>>({});

const upperLevelsCountDisplay = computed(() => numberFormat(structure.upperLevelsCount, 0));
const basementLevelsCountDisplay = computed(() => numberFormat(structure.basementLevelsCount, 0));

const getDisplayValue = (item: any, field: string, decimals: number, partialIndex?: number) => {
    let key = item.floorId ? `${item.floorId}_${field}` : `new_${field}`;
    if (partialIndex !== undefined) {
        key += `_${partialIndex}`;
    }

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

const handleInput = (
    e: Event,
    item: any,
    field: string,
    isDecimal: boolean,
    decimals: number,
    partialIndex?: number
) => {
    const val = (e.target as HTMLInputElement).value;
    const { formattedValue, numericValue } = processNumberInput(val, isDecimal, decimals);

    if (numericValue !== null || val === '') {
        item[field] = numericValue;
    }

    let key = item.floorId ? `${item.floorId}_${field}` : `new_${field}`;
    if (partialIndex !== undefined) key += `_${partialIndex}`;

    displayValues[key] = formattedValue;
    (e.target as HTMLInputElement).value = formattedValue;
};

const handleFloorAreaInputBlur = (floorIndex: number, field: 'totalAreaSqm' | 'grossLeasableAreaSqm' | 'netLeasableAreaSqm') => {
    const floor = formData.value[floorIndex] as any;
    const rawValue = floor[field];
    const pyField = (field.replace('Sqm', 'Py')) as keyof FloorForm;

    // 로컬 클렌징 함수
    const cleanedSqm = (typeof rawValue === 'number' && !isNaN(rawValue)) ? parseFloat(rawValue.toFixed(2)) : null;
    floor[field] = cleanedSqm;

    if (cleanedSqm !== null) {
        floor[pyField] = calculatePyValue(cleanedSqm);
    } else {
        floor[pyField] = null;
    }
};

const handlePartialAreaInputBlur = (floorIndex: number, partialIndex: number) => {
    const partial = formData.value[floorIndex].floorPartial[partialIndex];
    const rawValue = partial.leaseAreaSqm;

    const cleanedSqm = (typeof rawValue === 'number' && !isNaN(rawValue)) ? parseFloat(rawValue.toFixed(2)) : null;
    partial.leaseAreaSqm = cleanedSqm;

    if (cleanedSqm !== null) {
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

const createDefaultPartial = (idx: number): FloorPartialForm => ({
    id: `temp_p_${Date.now()}_${idx}`,
    floorId: '',
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

watch(() => propertyStore.currentPropertyId, initializeForm, { immediate: true });

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
        truck_berths: f.truckBerths ? Math.round(f.truckBerths) : null,
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
            deposit_krw: p.depositKrw ? Math.round(p.depositKrw) : null,
            monthly_rent: p.monthlyRent ? Math.round(p.monthlyRent) : null,
            monthly_rent_per_py: roundToTwoDecimals(p.monthlyRentPerPy),
            monthly_management_fee: p.monthlyManagementFee ? Math.round(p.monthlyManagementFee) : null,
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
<style scoped>
.invert-png {
    filter: invert(100%);
}
</style>