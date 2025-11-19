<template>
    <div class="p-6 space-y-6">
        <form @submit.prevent="onSubmit" class="space-y-6">
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
                        {{ floor.type === 'UPPER' ? '' : 'B' }}{{ Math.abs(floor.floor) }}F
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
                            @input="e => handleInput(e, floor, 'ceilingHeight', true, 2)"
                            class="border p-2 rounded text-right" />
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-medium mb-1">Floor Load (t/㎡)</label>
                        <input type="text" :value="getDisplayValue(floor, 'floorLoad', 2)"
                            @input="e => handleInput(e, floor, 'floorLoad', true, 2)"
                            class="border p-2 rounded text-right" />
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-medium mb-1">Truck Berths</label>
                        <input type="text" :value="getDisplayValue(floor, 'truckBerths', 0)"
                            @input="e => handleInput(e, floor, 'truckBerths', false, 0)"
                            class="border p-2 rounded text-right" />
                    </div>
                </div>

                <fieldset class="border p-3 rounded bg-gray-50">
                    <legend class="text-xs font-semibold px-2 text-gray-600">Floor Area Measurements</legend>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="space-y-1">
                            <label class="text-xs font-medium block">Total Area (㎡)</label>
                            <input type="text" :value="getDisplayValue(floor, 'totalAreaSqm', 2)"
                                @input="e => handleInput(e, floor, 'totalAreaSqm', true, 2)"
                                @blur="() => handleAreaBlur(floor, 'totalAreaSqm', 'totalAreaPy')"
                                class="w-full border p-2 rounded text-right text-sm" />
                            <input type="text" :value="getDisplayValue(floor, 'totalAreaPy', 2)" disabled
                                class="w-full border bg-gray-100 p-2 rounded text-right text-sm text-gray-500"
                                placeholder="(py)" />
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-medium block">Gross Leasable (㎡)</label>
                            <input type="text" :value="getDisplayValue(floor, 'grossLeasableAreaSqm', 2)"
                                @input="e => handleInput(e, floor, 'grossLeasableAreaSqm', true, 2)"
                                @blur="() => handleAreaBlur(floor, 'grossLeasableAreaSqm', 'grossLeasableAreaPy')"
                                class="w-full border p-2 rounded text-right text-sm" />
                            <input type="text" :value="getDisplayValue(floor, 'grossLeasableAreaPy', 2)" disabled
                                class="w-full border bg-gray-100 p-2 rounded text-right text-sm text-gray-500"
                                placeholder="(py)" />
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-medium block">Net Leasable (㎡)</label>
                            <input type="text" :value="getDisplayValue(floor, 'netLeasableAreaSqm', 2)"
                                @input="e => handleInput(e, floor, 'netLeasableAreaSqm', true, 2)"
                                @blur="() => handleAreaBlur(floor, 'netLeasableAreaSqm', 'netLeasableAreaPy')"
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
                                    @input="e => handleInput(e, partial, 'leaseAreaSqm', true, 2, pIndex)"
                                    @blur="() => handleAreaBlur(partial, 'leaseAreaSqm', 'leaseAreaPy', pIndex)"
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
                                    @input="e => handleInput(e, partial, 'monthlyRent', true, 0, pIndex)"
                                    class="w-full border p-2 rounded text-right" />
                            </div>
                            <div class="col-span-1">
                                <label class="block font-medium mb-1">Deposit</label>
                                <input type="text" :value="getDisplayValue(partial, 'depositKrw', 0, pIndex)"
                                    @input="e => handleInput(e, partial, 'depositKrw', true, 0, pIndex)"
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

// 💡 수정: 올바른 타입 파일 경로 사용
import { FloorUseTypeEnum, RoomUseTypeEnum } from '~/types/property.type';
import type { FloorType, FloorPartialType } from '~/types/property.type';

// --- Local Type Definitions (UI 전용 확장 타입) ---
// DB 타입(FloorType)에는 없는 UI 전용 필드(isNew, floorId 등)를 포함하는 인터페이스 정의

interface FloorPartialForm extends Omit<FloorPartialType, 'createdAt' | 'updatedAt' | 'id'> {
    id?: string; // 임시 ID 또는 DB ID
    leaseStartDateDisplay?: string | null; // UI용 날짜 문자열
    leaseEndDateDisplay?: string | null;   // UI용 날짜 문자열
}

interface FloorForm extends Omit<FloorType, 'createdAt' | 'updatedAt' | 'id' | 'floorPartial'> {
    id?: string;       // DB ID (기존 데이터인 경우)
    floorId: string;   // UI 반복문용 고유 Key (임시 ID 포함)
    isNew: boolean;    // 신규 생성 여부 플래그
    floorPartial: FloorPartialForm[]; // 확장된 Partial Form 사용
}

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);
const computedIsLoading = computed(() => statusStore.isGlobalLoading);

// Composables
const { numberFormat, processNumberInput, calculatePyValue, formatDate, formatDateInput } = useFormat();

// Enums
const FLOOR_USE_TYPES = Object.values(FloorUseTypeEnum);
const ROOM_USE_TYPES = Object.values(RoomUseTypeEnum);

// Data State
const formData = ref<FloorForm[]>([]);
const structure = reactive({
    upperLevelsCount: 0,
    basementLevelsCount: 0,
});

// View Model (Display Values for Inputs)
const displayValues = reactive<Record<string, string>>({});

// Computed Displays for Structure Inputs
const upperLevelsCountDisplay = computed(() => numberFormat(structure.upperLevelsCount, 0));
const basementLevelsCountDisplay = computed(() => numberFormat(structure.basementLevelsCount, 0));


// --- Helper: Display Value Getter ---
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

// --- Helper: Input Handlers ---

// 1. 구조 입력 (층수)
const handleStructureInput = (e: Event, field: 'upperLevelsCount' | 'basementLevelsCount') => {
    const val = (e.target as HTMLInputElement).value;
    const { numericValue } = processNumberInput(val, false, 0);
    structure[field] = numericValue || 0;
};

// 2. 일반 숫자 입력 (Floor/Partial 공통)
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

    // Update Model
    item[field] = numericValue;

    // Update View
    let key = item.floorId ? `${item.floorId}_${field}` : `new_${field}`;
    if (partialIndex !== undefined) key += `_${partialIndex}`;

    displayValues[key] = formattedValue;
    (e.target as HTMLInputElement).value = formattedValue;
};

// 3. 면적 자동 계산 (Sqm -> Py)
const handleAreaBlur = (item: any, sqmField: string, pyField: string, partialIndex?: number) => {
    const sqmVal = item[sqmField];
    if (sqmVal !== null && sqmVal > 0) {
        const pyVal = calculatePyValue(sqmVal);
        item[pyField] = pyVal;

        // Update Py View
        let key = item.floorId ? `${item.floorId}_${pyField}` : `new_${pyField}`;
        if (partialIndex !== undefined) key += `_${partialIndex}`;
        displayValues[key] = numberFormat(pyVal, 2);
    } else {
        item[pyField] = null;
    }
};

// --- 폼 초기화 및 생성 로직 ---

const createDefaultPartial = (idx: number): FloorPartialForm => ({
    id: `temp_p_${Date.now()}_${idx}`,
    floorId: '', // Floor ID는 상위에서 연결됨
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
    // 💡 수정: Store 참조 경로 변경 (sizes -> scale, floorList -> floor)
    const scale = currentProperty.value?.scale;
    const existingFloors = currentProperty.value?.floor || [];

    structure.upperLevelsCount = scale?.upperLevels || 0;
    structure.basementLevelsCount = scale?.basementLevels || 0;

    // 만약 기존 Floor 데이터가 있다면 로드 (생성 로직은 generateFloors에 위임)
    if (existingFloors.length > 0) {
        generateFloors(false); // false = 기존 데이터 유지 모드
    } else {
        formData.value = [];
    }
};

const generateFloors = (reset = true) => {
    const upper = structure.upperLevelsCount;
    const basement = structure.basementLevelsCount;
    const existingFloors = currentProperty.value?.floor || [];
    const newFloors: FloorForm[] = [];

    // 1. Basement (B3, B2, B1 순서)
    for (let i = basement; i >= 1; i--) {
        const floorNum = -i;
        const exist: any = !reset ? existingFloors.find(f => f.type === 'BASEMENT' && f.floor === floorNum) : null;
        newFloors.push(mapToFloorForm(exist, 'BASEMENT', floorNum));
    }

    // 2. Upper (1F, 2F, 3F 순서)
    for (let i = 1; i <= upper; i++) {
        const floorNum = i;
        const exist: any = !reset ? existingFloors.find(f => f.type === 'UPPER' && f.floor === floorNum) : null;
        newFloors.push(mapToFloorForm(exist, 'UPPER', floorNum));
    }

    formData.value = newFloors;
    // displayValues 초기화
    Object.keys(displayValues).forEach(k => delete displayValues[k]);
};

// Helper to map existing data or create new
const mapToFloorForm = (exist: any, type: 'UPPER' | 'BASEMENT', floor: number): FloorForm => {
    const base: FloorForm = {
        floorId: exist?.id || `temp_${type}_${Math.abs(floor)}`,
        id: exist?.id,
        isNew: !exist,
        type,
        floor,
        propertyId: propertyStore.currentPropertyId, // 필수값
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

// Watchers
watch(() => propertyStore.currentPropertyId, initializeForm, { immediate: true });

// Unit Actions
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

// Submit
const onSubmit = async () => {
    statusStore.setGlobalLoading(true);

    const payload = formData.value.map(floor => ({
        id: floor.isNew ? undefined : floor.id,
        property_id: propertyStore.currentPropertyId,
        type: floor.type,
        floor: floor.floor,

        ceiling_height: floor.ceilingHeight,
        ceiling_height_unit: floor.ceilingHeightUnit,
        floor_load: floor.floorLoad,
        floor_load_unit: floor.floorLoadUnit,
        truck_berths: floor.truckBerths,
        use: floor.use,
        total_area_sqm: floor.totalAreaSqm,
        total_area_py: floor.totalAreaPy,
        gross_leasable_area_sqm: floor.grossLeasableAreaSqm,
        gross_leasable_area_py: floor.grossLeasableAreaPy,
        net_leasable_area_sqm: floor.netLeasableAreaSqm,
        net_leasable_area_py: floor.netLeasableAreaPy,

        floorPartial: floor.floorPartial.map(partial => ({
            id: partial.id && partial.id.startsWith('temp_') ? undefined : partial.id,
            unit_number: partial.unitNumber,
            tenant: partial.tenant,
            lease_area_sqm: partial.leaseAreaSqm,
            lease_area_py: partial.leaseAreaPy,
            tenant_equipment: partial.tenantEquipment,
            tenant_use: partial.tenantUse,

            lease_start_date: partial.leaseStartDate
                ? new Date(partial.leaseStartDate)
                : null,
            lease_end_date: partial.leaseEndDate
                ? new Date(partial.leaseEndDate)
                : null,
            deposit_krw: partial.depositKrw,
            monthly_rent: partial.monthlyRent,
            monthly_rent_per_py: partial.monthlyRentPerPy,
            monthly_management_fee: partial.monthlyManagementFee,
            monthly_management_per_py: partial.monthlyManagementPerPy,
            increase_conditions_for_deposit: partial.increaseConditionsForDeposit,
            increase_conditions_for_rent: partial.increaseConditionsForRent,
            increase_conditions_for_management_fee: partial.increaseConditionsForManagementFee,
            rent_free: partial.rentFree,
            fit_out: partial.fitOut,
        }))
    }));

    try {
        // 💡 수정: API 호출 (property.ts의 updatePropertySection 대신 직접 호출)
        // 이유: Floor는 리스트 전체를 교체하는 로직이 복잡하여 개별 API가 필요할 수 있음
        const res = await $fetch<FloorType[]>(`/api/upload/${propertyStore.currentPropertyId}/floor`, {
            method: 'PUT',
            body: payload
        });

        // Store 업데이트 (Action 호출)
        // propertyStore.updateFloorList(res); // 만약 updateFloorList가 없다면 아래처럼 직접 할당
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