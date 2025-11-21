<template>
        <Transition name="modal-fade">
                <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title"
                        role="dialog" aria-modal="true">

                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal">
                        </div>

                        <div class="flex items-center justify-center min-h-full p-4">
                                <div
                                        class="w-full max-w-5xl bg-white rounded-lg shadow-xl transform transition-all p-6">

                                        <div class="flex justify-between items-center border-b pb-3 mb-4">
                                                <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                                                        {{ isEditMode ? 'Edit Lease Record' : 'Create New Lease Record'
                                                        }}
                                                </h3>
                                                <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
                                                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                        stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                </button>
                                        </div>

                                        <form @submit.prevent="onSubmit">
                                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-4">
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Lease
                                                                        Type <span class="text-red-500">*</span></label>
                                                                <select v-model="formData.leaseType"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                                        required>
                                                                        <option :value="null" disabled>Select Lease Type
                                                                        </option>
                                                                        <option value="ASKING">ASKING</option>
                                                                        <option value="ACTUAL">ACTUAL</option>
                                                                </select>
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Execution
                                                                        Date <span class="text-red-500">*</span></label>
                                                                <input type="date" v-model="executionDateProxy"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                                        required>
                                                        </div>

                                                        <div class="space-y-1">
                                                                <div class="grid grid-cols-2 gap-2">
                                                                        <div>
                                                                                <label
                                                                                        class="block text-sm font-medium text-gray-700">Year</label>
                                                                                <input type="number"
                                                                                        v-model="formData.year" readonly
                                                                                        class="mt-1 block w-full border border-gray-300 bg-gray-100 rounded-md shadow-sm p-2">
                                                                        </div>
                                                                        <div>
                                                                                <label
                                                                                        class="block text-sm font-medium text-gray-700">Quarter</label>
                                                                                <input type="text"
                                                                                        :value="quarterDisplayComputed"
                                                                                        readonly
                                                                                        class="mt-1 block w-full border border-gray-300 bg-gray-100 rounded-md shadow-sm p-2">
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label
                                                                        class="block text-sm font-medium text-gray-700">Floor</label>
                                                                <select v-model="formData.floor"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                                        <option :value="null">Select Floor</option>
                                                                        <option v-for="option in floorOptions"
                                                                                :key="option.value"
                                                                                :value="option.value">
                                                                                {{ option.label }}
                                                                        </option>
                                                                </select>
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label
                                                                        class="block text-sm font-medium text-gray-700">Unit</label>
                                                                <select v-model="formData.unit"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                                        :disabled="!formData.floor">
                                                                        <option :value="null">Select Unit</option>
                                                                        <option v-for="unit in availableUnits"
                                                                                :key="unit" :value="unit">
                                                                                {{ unit }}
                                                                        </option>
                                                                </select>
                                                        </div>
                                                </div>

                                                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">Period & Dates
                                                </h4>
                                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-4">
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Lease
                                                                        Term (Year)</label>
                                                                <input type="number" step="0.1" min="0"
                                                                        v-model.number="formData.leaseTermYear"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Lease
                                                                        Start Date</label>
                                                                <input type="date" v-model="leaseStartDateProxy"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Lease
                                                                        End Date</label>
                                                                <input type="date" v-model="leaseEndDateProxy"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                        </div>
                                                </div>

                                                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">Area & Ratio
                                                </h4>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b pb-4">
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">GFA
                                                                        (m²)</label>
                                                                <input type="text" :value="getDisplayValue('gfaSqm', 2)"
                                                                        @input="e => handleNumberInput(e, 'gfaSqm', true, 2)"
                                                                        placeholder="Gross Floor Area"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">GFA
                                                                        (py)</label>
                                                                <input type="text" :value="getDisplayValue('gfaPy', 2)"
                                                                        @input="e => handleNumberInput(e, 'gfaPy', true, 2)"
                                                                        placeholder="Gross Floor Area"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">NFA
                                                                        (m²)</label>
                                                                <input type="text" :value="getDisplayValue('nfaSqm', 2)"
                                                                        @input="e => handleNumberInput(e, 'nfaSqm', true, 2)"
                                                                        placeholder="Net Floor Area"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">NFA
                                                                        (py)</label>
                                                                <input type="text" :value="getDisplayValue('nfaPy', 2)"
                                                                        @input="e => handleNumberInput(e, 'nfaPy', true, 2)"
                                                                        placeholder="Net Floor Area"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Eff.
                                                                        Ratio (%)</label>
                                                                <input type="text"
                                                                        :value="getDisplayValue('effRatio', 2)"
                                                                        @input="e => handleNumberInput(e, 'effRatio', true, 2)"
                                                                        placeholder="e.g. 5.50"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                </div>

                                                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">Rent & Deposit
                                                </h4>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b pb-4">
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Monthly
                                                                        Rent (KRW)</label>
                                                                <input type="text"
                                                                        :value="getDisplayValue('monthlyRent', 0)"
                                                                        @input="e => handleNumberInput(e, 'monthlyRent', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Rent
                                                                        Monthly (py)</label>
                                                                <input type="text"
                                                                        :value="getDisplayValue('rentMonthlyPy', 0)"
                                                                        @input="e => handleNumberInput(e, 'rentMonthlyPy', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Monthly
                                                                        CAMF (KRW)</label>
                                                                <input type="text"
                                                                        :value="getDisplayValue('monthlyCamf', 0)"
                                                                        @input="e => handleNumberInput(e, 'monthlyCamf', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">CAMF
                                                                        Monthly (py)</label>
                                                                <input type="text"
                                                                        :value="getDisplayValue('camfMonthlyPy', 0)"
                                                                        @input="e => handleNumberInput(e, 'camfMonthlyPy', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Deposit
                                                                        (KRW)</label>
                                                                <input type="text"
                                                                        :value="getDisplayValue('deposit', 0)"
                                                                        @input="e => handleNumberInput(e, 'deposit', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Deposit
                                                                        (py)</label>
                                                                <input type="text"
                                                                        :value="getDisplayValue('depositPy', 0)"
                                                                        @input="e => handleNumberInput(e, 'depositPy', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                </div>

                                                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">Indicators &
                                                        Incentives</h4>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Rent
                                                                        Free Type</label>
                                                                <select v-model="formData.rentFreeType"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                                        <option :value="null">Select Type</option>
                                                                        <option value="PerYear">Per Year</option>
                                                                        <option value="PerTerm">Per Term</option>
                                                                </select>
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Rent
                                                                        Free Month</label>
                                                                <input type="text"
                                                                        :value="getDisplayValue('rentFreeMonth', 0)"
                                                                        @input="e => handleNumberInput(e, 'rentFreeMonth', true, 0)"
                                                                        placeholder="Months"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Fit
                                                                        Out</label>
                                                                <input type="text" :value="getDisplayValue('fitOut', 0)"
                                                                        @input="e => handleNumberInput(e, 'fitOut', true, 0)"
                                                                        placeholder="Number"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">NOC
                                                                        (KRW)</label>
                                                                <input type="text" :value="getDisplayValue('noc', 2)"
                                                                        @input="e => handleNumberInput(e, 'noc', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">IOD
                                                                        (KRW)</label>
                                                                <input type="text" :value="getDisplayValue('iod', 2)"
                                                                        @input="e => handleNumberInput(e, 'iod', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">GDM
                                                                        (KRW)</label>
                                                                <input type="text" :value="getDisplayValue('gdm', 2)"
                                                                        @input="e => handleNumberInput(e, 'gdm', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Effective
                                                                        NOC (KRW)</label>
                                                                <input type="text"
                                                                        :value="getDisplayValue('effectiveNoc', 2)"
                                                                        @input="e => handleNumberInput(e, 'effectiveNoc', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">TI
                                                                        Amount (KRW)</label>
                                                                <input type="text"
                                                                        :value="getDisplayValue('tiAmountKrw', 2)"
                                                                        @input="e => handleNumberInput(e, 'tiAmountKrw', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                </div>

                                                <div class="flex justify-end mt-6 space-x-3">
                                                        <button type="button" @click="closeModal"
                                                                class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150">
                                                                Cancel
                                                        </button>
                                                        <button type="submit" :disabled="computedIsLoading"
                                                                class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cbre_primary_1 hover:bg-cbre_primary_2 transition duration-150 disabled:opacity-50">
                                                                <span v-if="computedIsLoading">Saving...</span>
                                                                <span v-else>{{ isEditMode ? 'Save Changes' :
                                                                        'Create Record' }}</span>
                                                        </button>
                                                </div>
                                        </form>
                                </div>
                        </div>
                </div>
        </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useFormat } from '~/composables/useFormat';
import { useToast } from '~/composables/useToast';
import type { LeaseType, LeaseCreatePayload, FloorType } from '~/types/property.type';

// 1. Store & Composable Init
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { showToast } = useToast();
const { numberFormat, processNumberInput, toDateStringOrEmpty, calculateYearAndQuarter } = useFormat();

// Store State
const { currentProperty } = storeToRefs(propertyStore);
const computedIsLoading = computed(() => statusStore.isGlobalLoading);

// 2. Props & Emits
interface Props {
        isOpen: boolean;
        mode: 'create' | 'edit';
        leaseData: LeaseType | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'save', payload: LeaseCreatePayload): void;
}>();

const isEditMode = computed(() => props.mode === 'edit');
const isOpen = computed(() => props.isOpen);

// 3. 로컬 폼 상태 정의 (v-model용 Date String 포함)
interface LocalLeaseForm extends LeaseCreatePayload {
        // v-model을 위한 string 타입의 Display 속성들을 인터페이스에서 제외하고 
        // 별도 Proxy로 처리하므로 여기에는 DB 저장용 Date 타입을 유지할 수도 있지만
        // 초기값 설정 시 편의를 위해 transactionId만 추가합니다.
        transactionId?: string;
}

const todayStr = toDateStringOrEmpty(new Date());
const { year: initYear, quarter: initQuarter } = calculateYearAndQuarter(todayStr);

const defaultFormData: LocalLeaseForm = {
        year: initYear,
        quarter: initQuarter,
        executionDate: new Date(),

        leaseType: 'ASKING',
        floor: null,
        unit: null,

        leaseStartDate: null,
        leaseEndDate: null,
        leaseTermYear: null,

        gfaSqm: null, gfaPy: null,
        nfaSqm: null, nfaPy: null,
        effRatio: null,

        monthlyRent: null, monthlyCamf: null, deposit: null,
        rentMonthlyPy: null, camfMonthlyPy: null, depositPy: null,
        iod: null, gdm: null, noc: null,
        effectiveNoc: null, allInNoc: null, allInEffectiveRentMonthlyPy: null,

        rentFreeType: null,
        rentFreeMonth: null,
        fitOut: null,
        tiAmountKrw: null,
        tiAmountNfaPy: null,
        totalFreeRentPeriodMonth: null,
        totalOccupyingPeriodYear: null,
        totalFreeRentOccupyingYear: null,
        monthlyCashSupportGfa: null,
};

const formData = ref<LocalLeaseForm>({ ...defaultFormData });

// 💡 [신규] Writable Computed Proxy 생성 헬퍼
const useDateProxy = (key: 'executionDate' | 'leaseStartDate' | 'leaseEndDate') => computed({
        get: () => toDateStringOrEmpty(formData.value[key]),
        set: (val: string) => {
                // 💡 [수정] any 캐스팅을 사용하여 formData.value[key] (Date | string | null)에 할당
                // 이렇게 하면 v-model="string" -> Date 변환이 원활하게 이루어짐
                (formData.value as any)[key] = val ? new Date(val) : null;
        }
});

const executionDateProxy = useDateProxy('executionDate');
const leaseStartDateProxy = useDateProxy('leaseStartDate');
const leaseEndDateProxy = useDateProxy('leaseEndDate');

// 4. 숫자 포맷팅 (Display Values)
const displayValues = reactive<Record<string, string>>({});

const getDisplayValue = (field: keyof LeaseCreatePayload, decimals: number) => {
        const key = String(field);
        if (!(key in displayValues)) {
                // 💡 [수정] formData의 값을 any로 가져와서 처리 (Date 등 비-숫자 필드가 섞여있으므로)
                const val = (formData.value as any)[field];
                displayValues[key] = (val !== null && val !== undefined && val !== '')
                        ? numberFormat(val, decimals)
                        : '';
        }
        return displayValues[key];
};

const handleNumberInput = (e: Event, field: keyof LeaseCreatePayload, isDecimal: boolean, decimals: number) => {
        const target = e.target as HTMLInputElement;
        const { formattedValue, numericValue } = processNumberInput(target.value, isDecimal, decimals);

        (formData.value as any)[field] = numericValue;
        displayValues[String(field)] = formattedValue;
        target.value = formattedValue;
};

// 5. Floor & Unit 옵션 로직
const floorOptions = computed(() => {
        return currentProperty.value?.floor?.map(f => ({
                label: `${f.floor}F (${f.type})`,
                value: `${f.floor}_${f.type}`
        })) || [];
});

const availableUnits = computed(() => {
        const selectedFloorValue = formData.value.floor;
        if (!selectedFloorValue) return [];
        const targetFloor = currentProperty.value?.floor?.find(f => `${f.floor}_${f.type}` === selectedFloorValue);
        return targetFloor?.floorPartial?.map(p => p.unitNumber).filter((u): u is string => !!u) || [];
});

watch(() => formData.value.floor, () => {
        formData.value.unit = null;
});

// 6. 날짜 변경 감지
watch(() => executionDateProxy.value, (newDateStr) => {
        const { year, quarter } = calculateYearAndQuarter(newDateStr);
        formData.value.year = year;
        formData.value.quarter = quarter;
});

// 7. 데이터 로드 (Edit Mode)
watch(() => props.leaseData, (data) => {
        // 포맷팅 초기화
        for (const k in displayValues) delete displayValues[k];

        if (data && isEditMode.value) {
                // Edit Mode
                const source = data as any; // Transaction 필드(executionDate) 접근용
                const execDate = source.executionDate ? new Date(source.executionDate) : new Date();
                const { year, quarter } = calculateYearAndQuarter(toDateStringOrEmpty(execDate));

                formData.value = {
                        ...defaultFormData,
                        ...data, // 기존 Lease 데이터

                        transactionId: data.transactionId || undefined,

                        executionDate: execDate,
                        leaseStartDate: data.leaseStartDate ? new Date(data.leaseStartDate) : null,
                        leaseEndDate: data.leaseEndDate ? new Date(data.leaseEndDate) : null,

                        year: source.year || year,
                        quarter: source.quarter || quarter,
                } as LocalLeaseForm;
        } else {
                // Create Mode
                const today = new Date();
                const { year, quarter } = calculateYearAndQuarter(toDateStringOrEmpty(today));
                formData.value = {
                        ...defaultFormData,
                        executionDate: today,
                        year,
                        quarter,
                } as LocalLeaseForm;
        }
}, { immediate: true });

// Computed
const quarterDisplayComputed = computed(() => formData.value.quarter);

// 8. Submit
const onSubmit = () => {
        if (!formData.value.executionDate || !formData.value.leaseType) {
                showToast('Please fill in required fields.', 'warning');
                return;
        }

        const payload: LeaseCreatePayload & { transactionId?: string } = {
                ...formData.value,
                transactionId: isEditMode.value ? props.leaseData?.transactionId || undefined : undefined
        };

        emit('save', payload);
};

const closeModal = () => emit('close');
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
        transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
        opacity: 0;
}
</style>