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
                                                                                v-model="formData.date" required
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
import { ref, watch, computed, reactive } from 'vue'; // 💡 [추가] reactive
import type { SaleDetailType, SaleCreatePayload, SaleTypeEnum } from '~/types/asset.type';
import { createToast } from 'mosha-vue-toastify';
import { usePropertyStore } from '~/stores/property';
// 💡 [추가] useFormat 임포트
import { useFormat } from '~/composables/useFormat';

// 💡 [추가] 공통 함수 임포트
const {
        numberFormat,
        processNumberInput,
        calculateYearAndQuarter,
} = useFormat();

// --- Props & Emits ---
interface Props {
        isOpen: boolean;
        saleData: SaleDetailType | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'save', payload: SaleCreatePayload): void;
}>();

const isEditMode = computed(() => !!props.saleData?.transactionId);


// --- Stores ---
const propertyStore = usePropertyStore();
const property = computed(() => propertyStore.$state);


// --- 타입 정의: 모달에서 사용되는 숫자 필드만 추출 ---
type SaleModalNumericKeys = 'gfaSqm' | 'nfaSqm' | 'priceKrw' | 'pricePerGfa' | 'pricePerNfa' | 'estCapRate' | 'estDiscountRate';


// --- 숫자 포맷팅 및 입력 핸들러 함수 ---

// 💡 [추가] 뷰 모델 (화면 표시용)
const displayValues = reactive<Record<string, string>>({});

// 💡 [추가] 뷰 모델 값 반환 헬퍼 (Floor.vue 로직)
const getDisplayValue = (
        field: keyof SaleCreatePayload,
        decimalPlaces: number
) => {
        const key = String(field);
        if (!(key in displayValues)) {
                const value = formData.value[field as keyof SaleCreatePayload];
                displayValues[key] = (value !== null && value !== undefined) ? numberFormat(value, decimalPlaces) : '';
        }
        return displayValues[key];
};

// 💡 [추가] 숫자 입력 핸들러 (Floor.vue 로직)
const handleNumberInput = (
        e: Event,
        field: keyof SaleCreatePayload,
        isDecimal: boolean,
        decimalPlaces: number = 0
) => {
        const target = e.target as HTMLInputElement;
        let value = target.value;
        const key = String(field);

        // 1. 💡 공통 함수 호출
        const { cleanedValue, formattedValue, numericValue } = processNumberInput(value, isDecimal, decimalPlaces);

        // 2. 모델 업데이트
        const writableFormData = formData.value as Record<string, any>;
        if (numericValue !== null || cleanedValue === '') {
                writableFormData[field] = numericValue;
        }

        // 3. 뷰(DOM) 업데이트
        displayValues[key] = formattedValue;
        target.value = formattedValue;
};

const roundToTwoDecimals = (num: number | null | undefined): number | null => {
        if (num === null || num === undefined) return null;
        return Math.round(num * 100) / 100;
};


// --- 🚨 [추가] 가격/면적당 가격 계산 함수 ---
const calculateUnitPrice = (price: number | null | undefined, area: number | null | undefined): number | null => {
        if (price === null || price === undefined || area === null || area === undefined || area === 0) {
                return null;
        }
        // 가격은 정수로 반올림
        return Math.round(price / area);
};

const todayDate = new Date().toISOString().substring(0, 10);
const initialCalculated = calculateYearAndQuarter(todayDate);

const defaultFormData: SaleCreatePayload = {
        saleId: '',
        year: initialCalculated.year,
        date: todayDate,
        quarter: initialCalculated.quarter,
        saleType: 'ENBLOC' as SaleTypeEnum,
        gfaSqm: roundToTwoDecimals(property.value.sizes?.gfaSqm) ?? null,
        nfaSqm: roundToTwoDecimals(property.value.sizes?.nfaSqm) ?? null,
        priceKrw: null,
        pricePerGfa: null,
        pricePerNfa: null,
        estCapRate: null,
        estDiscountRate: null,
        buyer: null,
        seller: null,
        remarks: '',
};

const formData = ref<SaleCreatePayload>({ ...defaultFormData });

// 💡 [추가] displayValues 초기화 헬퍼
const clearDisplayValues = () => {
        for (const key in displayValues) {
                delete displayValues[key];
        }
};

const quarterDisplayComputed = computed(() => {
        // ... (기존 로직 동일) ...
        const quarter = formData.value.quarter;
        if (quarter === null || quarter === '') {
                return '';
        }
        const numericStr = quarter.toString().toUpperCase().replace('Q', '').trim();
        const num = parseInt(numericStr, 10);
        if (!isNaN(num) && num >= 1 && num <= 4) {
                return `Q${num}`;
        }
        return quarter;
});


// --- Watchers ---

watch(
        () => formData.value.date,
        (newDate) => {
                const dateToProcess = (newDate || '') as string;
                const { year, quarter } = calculateYearAndQuarter(dateToProcess);
                formData.value.year = year;
                formData.value.quarter = quarter;
        },
        { immediate: true }
);

watch(() => formData.value.saleType, (newSaleType) => {
        if (newSaleType === 'ENBLOC') {
                const totalGFA = property.value.sizes?.gfaSqm;
                const totalNFA = property.value.sizes?.nfaSqm;
                formData.value.gfaSqm = (typeof totalGFA === 'number' && totalGFA !== null) ? roundToTwoDecimals(totalGFA) : null;
                formData.value.nfaSqm = (typeof totalNFA === 'number' && totalNFA !== null) ? roundToTwoDecimals(totalNFA) : null;
        } else {
                formData.value.gfaSqm = null;
                formData.value.nfaSqm = null;
        }
        // 💡 [추가] 뷰 모델도 업데이트
        clearDisplayValues();
}, {
        immediate: true
});

watch(
        () => [formData.value.priceKrw, formData.value.gfaSqm, formData.value.nfaSqm],
        ([newPriceKrw, newGfaSqm, newNfaSqm]) => {
                const newPricePerGfa = calculateUnitPrice(newPriceKrw, newGfaSqm);
                formData.value.pricePerGfa = newPricePerGfa;

                const newPricePerNfa = calculateUnitPrice(newPriceKrw, newNfaSqm);
                formData.value.pricePerNfa = newPricePerNfa;

                // 💡 [추가] 자동 계산된 필드의 뷰 모델 업데이트
                displayValues['pricePerGfa'] = numberFormat(newPricePerGfa, 0);
                displayValues['pricePerNfa'] = numberFormat(newPricePerNfa, 0);
        },
        { immediate: true }
);

watch(() => props.saleData, (newSaleData) => {
        clearDisplayValues(); // 💡 [추가] 모달 열 때 뷰 모델 초기화

        if (newSaleData) {
                const transactionFields = {
                        year: new Date(newSaleData.executionDate || new Date()).getFullYear().toString(),
                        date: newSaleData.executionDate ? newSaleData.executionDate.toString().substring(0, 10) : new Date().toISOString().substring(0, 10),
                        quarter: newSaleData.quarter || '',
                };
                const saleDetailFields = {
                        saleId: newSaleData.saleId || undefined,
                        transactionId: newSaleData.transactionId || undefined,
                        saleType: newSaleData.saleType || 'ENBLOC',
                        gfaSqm: roundToTwoDecimals(newSaleData.gfaSqm),
                        nfaSqm: roundToTwoDecimals(newSaleData.nfaSqm),
                        priceKrw: newSaleData.priceKrw ? Math.round(newSaleData.priceKrw) : null,
                        pricePerGfa: newSaleData.pricePerGfa ? Math.round(newSaleData.pricePerGfa) : null,
                        pricePerNfa: newSaleData.pricePerNfa ? Math.round(newSaleData.pricePerNfa) : null,
                        estCapRate: newSaleData.estCapRate,
                        estDiscountRate: newSaleData.estDiscountRate,
                        buyer: newSaleData.buyer,
                        seller: newSaleData.seller,
                        remarks: newSaleData.remarks || '',
                };
                formData.value = {
                        ...defaultFormData,
                        ...transactionFields,
                        ...saleDetailFields
                } as SaleCreatePayload;
        } else {
                formData.value = { ...defaultFormData };
        }
}, { immediate: true });


// --- Methods ---

const closeModal = () => {
        emit('close');
};

const onSubmit = () => {
        // 1. 클라이언트 측 유효성 검사
        if (!formData.value.year || !formData.value.date || !formData.value.saleType) {
                createToast({ title: 'Please fill in required fields (Date, Year, Sale Type).' }, { type: 'warning' });
                return;
        }

        // 2. Quarter 필드 정리 (Qx -> x 또는 null)
        let finalQuarter: string | null = formData.value.quarter || '';
        if (finalQuarter !== '') {
                finalQuarter = finalQuarter.toUpperCase().replace('Q', '');
                if (isNaN(parseInt(finalQuarter, 10))) {
                        finalQuarter = null;
                } else {
                        finalQuarter = finalQuarter.toString();
                }
        }
        if (finalQuarter === '') {
                finalQuarter = null;
        }

        // 3. 페이로드 생성: 모든 필드를 명시적으로 정의하여 API 전송 데이터의 무결성 확보
        const payload: SaleCreatePayload & { transactionId?: string } = {
                // 필수 필드 (400 오류 방지)
                date: formData.value.date,
                year: formData.value.year,
                saleType: formData.value.saleType,

                // 면적 (null-coalesce)
                gfaSqm: formData.value.gfaSqm ?? null,
                nfaSqm: formData.value.nfaSqm ?? null,

                // 가격 (null-coalesce)
                priceKrw: formData.value.priceKrw ?? null,
                pricePerGfa: formData.value.pricePerGfa ?? null,
                pricePerNfa: formData.value.pricePerNfa ?? null,

                // 비율 (null-coalesce)
                estCapRate: formData.value.estCapRate ?? null,
                estDiscountRate: formData.value.estDiscountRate ?? null,

                // 기타 (empty string to null)
                buyer: formData.value.buyer === '' ? null : formData.value.buyer,
                seller: formData.value.seller === '' ? null : formData.value.seller,
                remarks: formData.value.remarks === '' ? null : formData.value.remarks,
                quarter: finalQuarter,

                // Edit Mode일 경우 transactionId 추가
                ...(isEditMode.value && props.saleData?.transactionId ? { transactionId: props.saleData.transactionId } : {}),

        } as SaleCreatePayload & { transactionId?: string };

        emit('save', payload);
};
</script>

<style scoped>
/* 모달 Transition 스타일 */
.modal-fade-enter-active,
.modal-fade-leave-active {
        transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
        opacity: 0;
}
</style>