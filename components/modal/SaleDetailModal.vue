<template>
        <Transition name="modal-fade">
                <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title"
                        role="dialog" aria-modal="true">

                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal">
                        </div>

                        <div class="flex items-center justify-center min-h-full p-4">
                                <div
                                        class="w-full max-w-4xl bg-white rounded-lg shadow-xl transform transition-all p-6">

                                        <div class="flex justify-between items-center border-b pb-3 mb-4">
                                                <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                                                        {{ isEditMode ? 'Edit Sale Record' : 'Create New Sale Record' }}
                                                </h3>
                                                <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
                                                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                        stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                </button>
                                        </div>

                                        <form @submit.prevent="onSubmit" class="space-y-6">

                                                <fieldset class="border p-4 rounded-lg space-y-4">
                                                        <legend class="text-sm font-semibold text-gray-600 px-2">
                                                                Transaction Details</legend>

                                                        <div class="grid grid-cols-4 gap-4">

                                                                <div class="flex flex-col">
                                                                        <label for="date"
                                                                                class="text-sm font-medium text-gray-700">Execution
                                                                                Date</label>
                                                                        <input id="date" type="date"
                                                                                v-model="executionDateProxy" required
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                                                </div>

                                                                <div class="flex flex-col">
                                                                        <label for="year"
                                                                                class="text-sm font-medium text-gray-700">Year</label>
                                                                        <input id="year" type="text"
                                                                                v-model="formData.year" required
                                                                                maxlength="4" placeholder="e.g. 2024"
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                                                </div>

                                                                <div class="flex flex-col">
                                                                        <label for="quarter"
                                                                                class="text-sm font-medium text-gray-700">Quarter</label>
                                                                        <input id="quarter" type="text"
                                                                                :value="quarterDisplayComputed"
                                                                                @input="formData.quarter = ($event.target as HTMLInputElement).value"
                                                                                maxlength="2" placeholder="e.g. Q1, 1"
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                                                </div>

                                                                <div class="flex flex-col">
                                                                        <label for="saleType"
                                                                                class="text-sm font-medium text-gray-700">Sale
                                                                                Type</label>
                                                                        <select id="saleType"
                                                                                v-model="formData.saleType" required
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                                                <option value="ENBLOC">ENBLOC</option>
                                                                                <option value="PARTIAL">PARTIAL</option>
                                                                        </select>
                                                                </div>
                                                        </div>
                                                </fieldset>

                                                <fieldset class="border p-4 rounded-lg space-y-4">
                                                        <legend class="text-sm font-semibold text-gray-600 px-2">Area
                                                        </legend>
                                                        <div class="grid grid-cols-2 gap-4">

                                                                <div class="flex flex-col">
                                                                        <label for="gfaSqm"
                                                                                class="text-sm font-medium text-gray-700">GFA
                                                                                (m²)</label>
                                                                        <input id="gfaSqm" type="text"
                                                                                :value="getDisplayValue('gfaSqm', 2)"
                                                                                @input="e => handleNumberInput(e, 'gfaSqm', true, 2)"
                                                                                placeholder="Gross Floor Area"
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                                </div>
                                                                <div class="flex flex-col">
                                                                        <label for="nfaSqm"
                                                                                class="text-sm font-medium text-gray-700">NFA
                                                                                (m²)</label>
                                                                        <input id="nfaSqm" type="text"
                                                                                :value="getDisplayValue('nfaSqm', 2)"
                                                                                @input="e => handleNumberInput(e, 'nfaSqm', true, 2)"
                                                                                placeholder="Net Floor Area"
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                                </div>

                                                        </div>
                                                </fieldset>

                                                <fieldset class="border p-4 rounded-lg space-y-4">
                                                        <legend class="text-sm font-semibold text-gray-600 px-2">
                                                                Pricing</legend>

                                                        <div class="grid grid-cols-3 gap-4">
                                                                <div class="flex flex-col">
                                                                        <label for="priceKrw"
                                                                                class="text-sm font-medium text-gray-700">Price
                                                                                (KRW)</label>
                                                                        <input id="priceKrw" type="text"
                                                                                :value="getDisplayValue('priceKrw', 0)"
                                                                                @input="e => handleNumberInput(e, 'priceKrw', false, 0)"
                                                                                placeholder="Total Price"
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                                </div>
                                                                <div class="flex flex-col">
                                                                        <label for="pricePerGfa"
                                                                                class="text-sm font-medium text-gray-700">Price
                                                                                / GFA</label>
                                                                        <input id="pricePerGfa" type="text"
                                                                                :value="getDisplayValue('pricePerGfa', 0)"
                                                                                @input="e => handleNumberInput(e, 'pricePerGfa', false, 0)"
                                                                                placeholder="KRW per m² GFA"
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                                </div>
                                                                <div class="flex flex-col">
                                                                        <label for="pricePerNfa"
                                                                                class="text-sm font-medium text-gray-700">Price
                                                                                / NFA</label>
                                                                        <input id="pricePerNfa" type="text"
                                                                                :value="getDisplayValue('pricePerNfa', 0)"
                                                                                @input="e => handleNumberInput(e, 'pricePerNfa', false, 0)"
                                                                                placeholder="KRW per m² NFA"
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                                </div>
                                                                <div></div>
                                                        </div>
                                                </fieldset>

                                                <fieldset class="border p-4 rounded-lg space-y-4">
                                                        <legend class="text-sm font-semibold text-gray-600 px-2">Rates &
                                                                Parties</legend>
                                                        <div class="grid grid-cols-2 gap-4">
                                                                <div class="flex flex-col">
                                                                        <label for="estCapRate"
                                                                                class="text-sm font-medium text-gray-700">Est.
                                                                                Cap Rate (%)</label>
                                                                        <input id="estCapRate" type="text"
                                                                                :value="getDisplayValue('estCapRate', 2)"
                                                                                @input="e => handleNumberInput(e, 'estCapRate', true, 2)"
                                                                                placeholder="e.g. 5.5"
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                                </div>
                                                                <div class="flex flex-col">
                                                                        <label for="estDiscountRate"
                                                                                class="text-sm font-medium text-gray-700">Est.
                                                                                Discount Rate (%)</label>
                                                                        <input id="estDiscountRate" type="text"
                                                                                :value="getDisplayValue('estDiscountRate', 2)"
                                                                                @input="e => handleNumberInput(e, 'estDiscountRate', true, 2)"
                                                                                placeholder="e.g. 5.5"
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                                </div>

                                                        </div>

                                                        <div class="grid grid-cols-2 gap-4">

                                                                <div class="flex flex-col col-span-1">
                                                                        <label for="buyer"
                                                                                class="text-sm font-medium text-gray-700">Buyer</label>
                                                                        <input id="buyer" type="text"
                                                                                v-model="formData.buyer"
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                                                </div>
                                                                <div class="flex flex-col col-span-1">
                                                                        <label for="seller"
                                                                                class="text-sm font-medium text-gray-700">Seller</label>
                                                                        <input id="seller" type="text"
                                                                                v-model="formData.seller"
                                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                                                </div>
                                                        </div>
                                                </fieldset>


                                                <div class="flex flex-col">
                                                        <label for="remarks"
                                                                class="text-sm font-medium text-gray-700">Remarks</label>
                                                        <textarea id="remarks" v-model="formData.remarks" rows="3"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                                                </div>


                                                <div class="flex justify-end pt-4 border-t">
                                                        <button type="button" @click="closeModal"
                                                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 mr-3">
                                                                Cancel
                                                        </button>
                                                        <button type="submit"
                                                                class="px-4 py-2 text-sm font-medium text-white bg-cbre_primary_1 rounded-md hover:bg-cbre_primary_2">
                                                                Save Changes
                                                        </button>
                                                </div>
                                        </form>

                                </div>
                        </div>
                </div>
        </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import type { SaleType, SaleCreatePayload, SaleTypeEnum } from '~/types/property.type';
import { createToast } from 'mosha-vue-toastify';
import { usePropertyStore } from '~/stores/property';
import { useFormat } from '~/composables/useFormat';

const { numberFormat, processNumberInput, toDateStringOrEmpty, calculateYearAndQuarter } = useFormat();

interface Props {
        isOpen: boolean;
        saleData: SaleType | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'save', payload: SaleCreatePayload): void;
}>();

const isEditMode = computed(() => !!props.saleData?.transactionId);
const propertyStore = usePropertyStore();
const { currentProperty } = storeToRefs(propertyStore);

// 1. Local Form Type
interface LocalSaleForm extends Omit<SaleCreatePayload, 'remarks'> {
        remarks: string;
        transactionId?: string;
}

// 초기값
const today = new Date();
const { year: initYear, quarter: initQuarter } = calculateYearAndQuarter(toDateStringOrEmpty(today));

const defaultFormData: LocalSaleForm = {
        year: initYear,
        quarter: initQuarter,
        executionDate: today, // Date 객체
        saleType: 'ENBLOC',
        gfaSqm: null, nfaSqm: null, priceKrw: null, pricePerGfa: null, pricePerNfa: null,
        estCapRate: null, estDiscountRate: null, buyer: null, seller: null, remarks: '',
};

const formData = ref<LocalSaleForm>({ ...defaultFormData });
const displayValues = reactive<Record<string, string>>({});

// 2. Date Proxy (Computed Writable)
const executionDateProxy = computed({
        get: () => toDateStringOrEmpty(formData.value.executionDate),
        set: (val: string) => {
                formData.value.executionDate = val ? new Date(val) : new Date();
        }
});

// 3. Quarter Display Computed
const quarterDisplayComputed = computed(() => {
        return formData.value.quarter || '';
});


// 숫자 입력 및 포맷팅 (기존과 동일)
const getDisplayValue = (field: keyof SaleCreatePayload, decimals: number) => {
        const key = String(field);
        if (!(key in displayValues)) {
                const val = formData.value[field as keyof LocalSaleForm];
                if (typeof val === 'number') {
                        displayValues[key] = numberFormat(val, decimals);
                } else {
                        displayValues[key] = '';
                }
        }
        return displayValues[key];
};

const handleNumberInput = (e: Event, field: keyof SaleCreatePayload, isDecimal: boolean, decimals: number) => {
        const target = e.target as HTMLInputElement;
        const { formattedValue, numericValue } = processNumberInput(target.value, isDecimal, decimals);
        (formData.value as any)[field] = numericValue;
        displayValues[String(field)] = formattedValue;
        target.value = formattedValue;
};

// Helper: Unit Price Calc
const calculateUnitPrice = (price: number | null | undefined, area: number | null | undefined): number | null => {
        if (price === null || price === undefined || area === null || area === undefined || area === 0) {
                return null;
        }
        return Math.round(price / area);
};


// Watchers

// 날짜 -> Year/Quarter 동기화
watch(() => executionDateProxy.value, (newDateStr) => {
        const { year, quarter } = calculateYearAndQuarter(newDateStr);
        formData.value.year = year;
        formData.value.quarter = quarter;
});

watch(() => formData.value.saleType, (newSaleType) => {
        if (newSaleType === 'ENBLOC') {
                const scale = currentProperty.value?.scale;
                // 로컬 헬퍼 roundToTwoDecimals 사용 (필요시 useFormat에서 가져오거나 정의)
                const round2 = (n: number | null | undefined) => n ? parseFloat(n.toFixed(2)) : null;

                formData.value.gfaSqm = round2(scale?.gfaSqm);
                formData.value.nfaSqm = round2(scale?.nfaSqm);
        }
        delete displayValues['gfaSqm'];
        delete displayValues['nfaSqm'];
});

watch(
        () => [formData.value.priceKrw, formData.value.gfaSqm, formData.value.nfaSqm],
        ([price, gfa, nfa]) => {
                const newPricePerGfa = calculateUnitPrice(price as number, gfa as number);
                formData.value.pricePerGfa = newPricePerGfa;
                const newPricePerNfa = calculateUnitPrice(price as number, nfa as number);
                formData.value.pricePerNfa = newPricePerNfa;
                displayValues['pricePerGfa'] = numberFormat(newPricePerGfa, 0);
                displayValues['pricePerNfa'] = numberFormat(newPricePerNfa, 0);
        }
);

watch(() => props.saleData, (data) => {
        for (const key in displayValues) delete displayValues[key];

        if (data && isEditMode.value) {
                const source = data as any;
                const execDate = source.executionDate ? new Date(source.executionDate) : new Date();
                const { year, quarter } = calculateYearAndQuarter(toDateStringOrEmpty(execDate));

                formData.value = {
                        ...defaultFormData,
                        ...data,
                        transactionId: data.transactionId || undefined,
                        executionDate: execDate,
                        year: source.year || year,
                        quarter: source.quarter || quarter,
                        remarks: data.remarks || '',
                } as LocalSaleForm;
        } else {
                const now = new Date();
                const { year, quarter } = calculateYearAndQuarter(toDateStringOrEmpty(now));
                const round2 = (n: number | null | undefined) => n ? parseFloat(n.toFixed(2)) : null;

                formData.value = {
                        ...defaultFormData,
                        executionDate: now,
                        year, quarter,
                        gfaSqm: round2(currentProperty.value?.scale?.gfaSqm),
                        nfaSqm: round2(currentProperty.value?.scale?.nfaSqm)
                } as LocalSaleForm;
        }
}, { immediate: true });

const closeModal = () => emit('close');

const onSubmit = () => {
        // 💡 [수정] Proxy 값(문자열)이 아니라 실제 Date 객체 확인
        if (!formData.value.executionDate || !formData.value.saleType) {
                createToast({ title: 'Please fill in required fields.' }, { type: 'warning' });
                return;
        }
        const payload: SaleCreatePayload & { transactionId?: string } = {
                ...formData.value,
                remarks: formData.value.remarks || null,
                transactionId: isEditMode.value ? props.saleData?.transactionId || undefined : undefined
        } as any;

        emit('save', payload);
};
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