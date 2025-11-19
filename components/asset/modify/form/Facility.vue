<template>
        <div>
                <form @submit.prevent="onSubmit" class="space-y-6">

                        <h3 class="text-base font-semibold pt-4 border-t">Elevators</h3>
                        <div class="grid grid-cols-4 gap-4">

                                <div class="relative w-full">
                                        <label for="passenger"
                                                class="block text-sm font-medium text-gray-700">Passenger</label>
                                        <input id="passenger" name="passenger" type="number" step="1"
                                                placeholder="number"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right"
                                                v-model.number="formData.elevators.passenger" />
                                </div>
                                <div class="relative w-full">
                                        <label for="service"
                                                class="block text-sm font-medium text-gray-700">Service</label>
                                        <input id="service" name="service" type="number" step="1" placeholder="number"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right"
                                                v-model.number="formData.elevators.service" />
                                </div>
                                <div class="relative w-full">
                                        <label for="shuttle"
                                                class="block text-sm font-medium text-gray-700">Shuttle</label>
                                        <input id="shuttle" name="shuttle" type="number" step="1" placeholder="number"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right"
                                                v-model.number="formData.elevators.shuttle" />
                                </div>
                                <div class="relative w-full">
                                        <label for="total" class="block text-sm font-medium text-gray-700">Total</label>
                                        <input id="total" name="total" type="number" step="1" placeholder="sum of above"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed text-right"
                                                v-model.number="formData.elevators.total" readonly />
                                </div>
                        </div>

                        <h3 class="text-base font-semibold pt-4 border-t">Parking</h3>
                        <div class="grid grid-cols-2 gap-4">

                                <div class="flex flex-col">
                                        <label class="text-sm font-medium mb-1">Parking Capacity(existing)</label>
                                        <input type="text" :value="parkingFormatted.cpsExisting"
                                                @input="formData.parking.cpsExisting = parseNumber(($event.target as HTMLInputElement).value)"
                                                @blur="handleNumberBlur('cpsExisting', $event)"
                                                class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
                                </div>

                                <div class="flex flex-col">
                                        <label class="text-sm font-medium mb-1">Parking Capacity(required)</label>
                                        <input type="text" :value="parkingFormatted.cpsRequired"
                                                @input="formData.parking.cpsRequired = parseNumber(($event.target as HTMLInputElement).value)"
                                                @blur="handleNumberBlur('cpsRequired', $event)"
                                                class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
                                </div>

                                <div class="flex flex-col">
                                        <label class="text-sm font-medium mb-1">Free Parking (Sqm)</label>
                                        <input type="text" :value="parkingFormatted.freeCpsSqm"
                                                @input="formData.parking.freeCpsSqm = parseNumber(($event.target as HTMLInputElement).value)"
                                                @blur="handleNumberBlur('freeCpsSqm', $event)"
                                                class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
                                </div>

                                <div class="flex flex-col">
                                        <label class="text-sm font-medium mb-1">Free Parking (Py)</label>
                                        <input type="text" :value="parkingFormatted.freeCpsPy"
                                                @input="formData.parking.freeCpsPy = parseNumber(($event.target as HTMLInputElement).value)"
                                                @blur="handleNumberBlur('freeCpsPy', $event)"
                                                class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
                                </div>

                                <div class="flex flex-col">
                                        <label class="text-sm font-medium mb-1">Paid Parking Fee (VAT include)</label>
                                        <input type="text" :value="parkingFormatted.paidParkingFee"
                                                @input="formData.parking.paidParkingFee = parseNumber(($event.target as HTMLInputElement).value)"
                                                @blur="handleNumberBlur('paidParkingFee', $event)"
                                                class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
                                </div>
                        </div>
                        <h3 class="text-base font-semibold pt-4 border-t">Materials</h3>
                        <div class="space-y-4">
                                <div class="relative w-full">
                                        <label for="roofMaterial" class="block text-sm font-medium text-gray-700">Roof
                                                Material</label>
                                        <input id="roofMaterial" name="roofMaterial" type="text"
                                                placeholder="Enter roof material(text)"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                v-model="formData.materials.roofMaterial" />
                                </div>
                                <div class="relative w-full">
                                        <label for="facade"
                                                class="block text-sm font-medium text-gray-700">Facade</label>
                                        <input id="facade" name="facade" type="text"
                                                placeholder="Enter facade materials(text)"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                v-model="formData.materials.facade" />
                                </div>
                                <div class="relative w-full">
                                        <label for="mechanicalElectrical"
                                                class="block text-sm font-medium text-gray-700">Mechanical/Electrical</label>
                                        <input id="mechanicalElectrical" name="mechanicalElectrical" type="number"
                                                step="0.01" placeholder="Enter mechanical/electrical details(text)"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                v-model.number="formData.materials.mechanicalElectrical" />
                                </div>
                                <div class="relative w-full">
                                        <label for="lighting"
                                                class="block text-sm font-medium text-gray-700">Lighting</label>
                                        <input id="lighting" name="lighting" type="text"
                                                placeholder="Enter lighting type(text)"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                v-model="formData.materials.lighting" />
                                </div>
                                <div class="relative w-full">
                                        <label for="fireFighting" class="block text-sm font-medium text-gray-700">Fire
                                                Fighting</label>
                                        <input id="fireFighting" name="fireFighting" type="text"
                                                placeholder="Enter fire fighting details(text)"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                v-model="formData.materials.fireFighting" />
                                </div>
                        </div>

                        <div class="pt-5 border-t mt-6">
                                <div class="flex justify-end">
                                        <button type="button" @click="emit('close')" :disabled="computedIsLoading"
                                                class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                                Cancel
                                        </button>
                                        <button type="button" @click="resetForm()"
                                                class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                                Reset
                                        </button>
                                        <button type="submit" :disabled="computedIsLoading"
                                                class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white hover:text-primary font-bold py-2 px-4 rounded-[10px] transition duration-150 
                                                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ">
                                                <svg v-if="computedIsLoading"
                                                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24">
                                                        <circle class="opacity-25" cx="12" cy="12" r="10"
                                                                stroke="currentColor" stroke-width="4"></circle>
                                                        <path class="opacity-75" fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                        </path>
                                                </svg>
                                                {{ computedIsLoading ? 'Saving...' : 'Save and Close' }}
                                        </button>
                                </div>
                        </div>

                </form>
        </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { usePropertyStore } from '~/stores/property'; // Pinia 스토어 import
import { useAppStore } from '~/stores/app';
import { createToast } from 'mosha-vue-toastify';
import type { ElevatorsType, MaterialsType, ParkingType, CbreAsset } from '~/types/asset.type';
import { isEqual } from 'lodash-es'; // 깊은 비교를 위한 lodash-es 
import { useFormat } from '~/composables/useFormat';

// Facility API의 응답 페이로드 타입 정의
// FacilityType의 모든 필드가 포함된 상태를 반환하도록 업데이트합니다.
interface PropertyFacilityResponse {
        propertyId: string;
        // FacilityType 자체가 CbreAsset에 정의되어 있으므로, 
        // API가 facility의 최종 상태를 반환한다면 FacilityType을 사용합니다.
        facility: {
                elevators: ElevatorsType | null;
                materials: MaterialsType | null;
                parking: ParkingType | null;
        }
}

// Facility Form의 최종 데이터 구조
interface FacilityFormDataType {
        elevators: ElevatorsType;
        materials: MaterialsType;
        parking: ParkingType; // <-- ParkingType 추가
}

// Props와 Emit 정의
const emit = defineEmits(['close']); // 패널을 닫기 위한 이벤트
const propertyStore = usePropertyStore();
const appStore = useAppStore();
const computedIsLoading = computed(() => appStore.isLoading);
const { numberFormat, parseNumber } = useFormat();

// === 폼 초기화 및 데이터 관리 로직 ===

// 초기값 헬퍼 함수: Elevators 데이터 초기화 (기존과 동일)
const getInitialElevators = (data: any): ElevatorsType => ({
        total: data?.total ?? null,
        passenger: data?.passenger ?? null,
        service: data?.service ?? null,
        shuttle: data?.shuttle ?? null,
});

// 초기값 헬퍼 함수: Materials 데이터 초기화 (기존과 동일)
const getInitialMaterials = (data: any): MaterialsType => ({
        roofMaterial: data?.roofMaterial ?? null,
        facade: data?.facade ?? null,
        mechanicalElectrical: data?.mechanicalElectrical ?? null,
        lighting: data?.lighting ?? null,
        fireFighting: data?.fireFighting ?? null,
});

// 초기값 헬퍼 함수: Parking 데이터 초기화 (새로 추가)
const getInitialParking = (data: any): ParkingType => ({
        cpsExisting: data?.cpsExisting ?? null,
        cpsRequired: data?.cpsRequired ?? null,
        freeCpsSqm: data?.freeCpsSqm ?? null,
        freeCpsPy: data?.freeCpsPy ?? null,
        paidParkingFee: data?.paidParkingFee ?? null,
});


// 현재 자산 정보에서 Facility 데이터를 초기값으로 가져옴
const initialFacilityData = computed<FacilityFormDataType>(() => ({
        elevators: getInitialElevators(propertyStore.facility?.elevators),
        materials: getInitialMaterials(propertyStore.facility?.materials),
        parking: getInitialParking(propertyStore.facility?.parking), // <-- Parking 초기값 추가
}));

// 폼 데이터 상태 정의
const formData = reactive<FacilityFormDataType>({
        ...initialFacilityData.value
});

// Pinia 스토어 데이터 변경 시 폼 데이터 동기화
watch(initialFacilityData, (newVal) => {
        // 깊은 동기화를 위해 각 객체에 대해 Object.assign 사용
        Object.assign(formData.elevators, newVal.elevators);
        Object.assign(formData.materials, newVal.materials);
        Object.assign(formData.parking, newVal.parking); // <-- Parking 동기화 추가
}, { deep: true });


// **[추가된 로직]** Passenger, Service, Shuttle 값 변경 시 Total 자동 계산 및 업데이트
watch([
        () => formData.elevators.passenger,
        () => formData.elevators.service,
        () => formData.elevators.shuttle,
], () => {
        // null 값은 0으로 간주하고 합산
        const passenger = formData.elevators.passenger ?? 0;
        const service = formData.elevators.service ?? 0;
        const shuttle = formData.elevators.shuttle ?? 0;

        const calculatedTotal = passenger + service + shuttle;

        // 모든 서브 필드가 0이거나 null인 경우 (즉, 데이터가 입력되지 않은 초기 상태), Total을 null로 유지
        const allNullOrZero =
                (formData.elevators.passenger === null || formData.elevators.passenger === 0) &&
                (formData.elevators.service === null || formData.elevators.service === 0) &&
                (formData.elevators.shuttle === null || formData.elevators.shuttle === 0);

        if (calculatedTotal === 0 && allNullOrZero) {
                formData.elevators.total = null;
        } else {
                // 그 외의 경우 (하나라도 값이 있거나 명시적으로 0이 입력된 경우) 계산된 값을 설정
                formData.elevators.total = calculatedTotal;
        }
}, { immediate: true }); // 컴포넌트 마운트 시 초기값으로 한 번 실행


// === [새로운 로직] Sqm <-> Py 단위 변환 헬퍼 및 핸들러 ===

// 변환 상수
const PY_PER_SQM = 0.3025;   // 1 sqm = 0.3025 py
const SQM_PER_PY = 3.305785; // 1 py = 3.305785 sqm

// 헬퍼: 제곱미터(Sqm)를 평(Py)으로 변환하고 소수점 셋째 자리에서 반올림
const calculatePyValue = (sqmValue: number): number | null => {
        if (sqmValue === null || isNaN(sqmValue) || sqmValue === 0) return null;
        const pyResult = sqmValue * PY_PER_SQM;
        return parseFloat(pyResult.toFixed(2));
};

// 헬퍼: 평(Py)을 제곱미터(Sqm)로 변환하고 소수점 셋째 자리에서 반올림
const calculateSqmValue = (pyValue: number): number | null => {
        if (pyValue === null || isNaN(pyValue) || pyValue === 0) return null;
        const sqmResult = pyValue * SQM_PER_PY;
        return parseFloat(sqmResult.toFixed(2));
};

/**
 * Free Parking (units/m² 또는 units/py) 입력 필드의 포커스를 잃었을 때 호출됩니다.
 * 1. 입력값을 소수점 둘째 자리까지 정리합니다.
 * 2. Sqm이 입력되면 Py를, Py가 입력되면 Sqm을 계산하여 자동으로 할당합니다.
 */
const handleFloatInputBlur = (key: 'freeCpsSqm' | 'freeCpsPy') => {
        const value = formData.parking[key];

        // 1. 값 클렌징 (숫자가 아닌 경우 null 처리)
        let cleanedValue: number | null = (value === null || typeof value !== 'number' || isNaN(value)) ? null : value;

        // 2. 값 정리: 소수점 둘째 자리까지 반올림
        if (cleanedValue !== null) {
                cleanedValue = parseFloat(cleanedValue.toFixed(2));
        }

        // 3. formData 업데이트 (원래 필드)
        formData.parking[key] = cleanedValue;

        // 4. 상호 변환 로직
        if (key === 'freeCpsSqm') {
                const pyKey: 'freeCpsPy' = 'freeCpsPy';
                if (cleanedValue !== null && cleanedValue > 0) {
                        formData.parking[pyKey] = calculatePyValue(cleanedValue);
                } else if (cleanedValue === 0 || cleanedValue === null) {
                        // 입력이 없거나 0이면 쌍을 이루는 필드도 null로 설정
                        formData.parking[pyKey] = null;
                }
        } else if (key === 'freeCpsPy') {
                const sqmKey: 'freeCpsSqm' = 'freeCpsSqm';
                if (cleanedValue !== null && cleanedValue > 0) {
                        formData.parking[sqmKey] = calculateSqmValue(cleanedValue);
                } else if (cleanedValue === 0 || cleanedValue === null) {
                        // 입력이 없거나 0이면 쌍을 이루는 필드도 null로 설정
                        formData.parking[sqmKey] = null;
                }
        }
};

// ⭐ Parking 필드의 콤마 포맷팅을 관리하기 위한 Ref 객체 정의
// 모든 숫자 필드는 소수점 두 자리까지 허용 (필요에 따라 0으로 변경 가능)
const NUM_FIX_DIGITS = 2;

// Computed Property로 포맷팅된 값을 제공합니다.
const parkingFormatted = reactive({
        // propertyStore의 데이터 (Pinia)는 Number|null 입니다. 
        // 이를 포맷팅된 문자열로 변환합니다.
        cpsExisting: computed(() => numberFormat(formData.parking.cpsExisting, NUM_FIX_DIGITS)),
        cpsRequired: computed(() => numberFormat(formData.parking.cpsRequired, NUM_FIX_DIGITS)),
        freeCpsSqm: computed(() => numberFormat(formData.parking.freeCpsSqm, NUM_FIX_DIGITS)),
        freeCpsPy: computed(() => numberFormat(formData.parking.freeCpsPy, NUM_FIX_DIGITS)),
        paidParkingFee: computed(() => numberFormat(formData.parking.paidParkingFee, NUM_FIX_DIGITS)),
});

/**
 * ⭐ 입력 필드에서 숫자를 입력할 때 (키 입력) 처리
 * - 입력되는 값에서 숫자, 콤마, 소수점 외 문자를 제거하고 Pinia/Form Data를 업데이트합니다.
 * - 이 함수는 v-model 대신 @input 이벤트에서 사용됩니다.
 */
const handleNumberInput = (field: keyof typeof formData.parking, event: Event) => {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        // 1. 콤마가 포함된 문자열을 Pinia에 저장할 숫자 (number|null)로 변환
        const numberValue = parseNumber(value);

        // 2. Pinia/Form Data 업데이트
        formData.parking[field] = numberValue;

        // 3. Input 필드 값 갱신 (사용자가 입력한 값 그대로 표시하여 입력 연속성을 유지)
        // 이 단계에서는 콤마 포맷팅을 적용하지 않습니다.
        // numberFormat 함수가 콤마를 제거하고 Pinia에 저장할 '순수' 값을 자동으로 처리해줍니다.
        // 하지만, Input 필드에 입력한 그대로 소수점을 포함한 값을 반영해야 사용자 경험이 좋습니다.
        // 따라서, Input 필드의 value를 강제로 갱신하지 않고, computed property를 사용합니다.
        // ⚠️ Vue는 v-model/`:value`가 computed getter일 때 setter가 없으면 에러를 냅니다.
        // 여기서는 `v-model` 대신 `:value`와 `@input`을 사용하므로, 
        // `parkingFormatted`는 computed getter 역할을 하고, `@input`에서 `formData`를 직접 업데이트합니다.

        // v-model을 대체하는 @input 처리:
        // parseNumber가 처리한 값(numberValue)을 formData에 저장했으므로, 
        // Input 필드에는 사용자가 입력한 포맷팅되지 않은 값을 유지합니다.
        // Input 필드의 value는 computed property인 parkingFormatted[field]에 의해 제어됩니다.
        // -> 이 방법은 복잡하므로, 아래 handleNumberBlur에만 의존하는 방식으로 단순화합니다.
};

/**
 * ⭐ 포커스를 잃었을 때 (Blur) 포맷팅을 적용하는 함수 (단순화된 핵심 로직)
 * - 입력된 값에서 콤마를 제거하여 Pinia/Form Data에 저장합니다.
 * - Input 필드에는 numberFormat을 적용하여 콤마를 표시합니다.
 */
const handleNumberBlur = (field: keyof typeof formData.parking, event: Event) => {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        // 1. 콤마 제거 후 숫자 (number|null)로 변환하여 Pinia/Form Data 업데이트
        const numberValue = parseNumber(value);
        formData.parking[field] = numberValue;

        // 2. Input 필드 값 갱신 (콤마 포맷 적용)
        // 이 작업은 target.value를 직접 조작하는 대신, v-model 대신 `:value`를 사용하고 
        // `numberFormat`을 사용하는 computed property를 `:value`에 바인딩함으로써 달성됩니다.
        // 하지만, 사용자가 입력 중인 텍스트가 콤마로 자동 변경되는 것을 막기 위해 
        // v-model을 사용하는 대신, @blur에서만 포맷팅을 적용하도록 target.value를 직접 갱신합니다.
        target.value = numberFormat(numberValue, NUM_FIX_DIGITS);
};

// === 추가된 기능: Reset 버튼 로직 ===
const resetForm = () => {
        // initialFacilityData의 현재 값을 formData에 다시 할당하여 리셋
        Object.assign(formData.elevators, initialFacilityData.value.elevators);
        Object.assign(formData.materials, initialFacilityData.value.materials);
        Object.assign(formData.parking, initialFacilityData.value.parking);
        console.log('폼 데이터를 초기 상태로 리셋했습니다.');
};


// isFormValid: 폼 유효성 검사 (데이터 변경 시에만 유효하다고 간주)
const isDataChanged = computed(() => {
        // lodash의 isEqual을 사용하여 객체의 깊은 비교를 수행합니다.
        const elevatorsChanged = !isEqual(formData.elevators, initialFacilityData.value.elevators);
        const materialsChanged = !isEqual(formData.materials, initialFacilityData.value.materials);
        const parkingChanged = !isEqual(formData.parking, initialFacilityData.value.parking);

        return elevatorsChanged || materialsChanged || parkingChanged;
});

// isFormValid: 폼 유효성 검사 (데이터 변경 시에만 유효하다고 간주)
const isFormValid = computed(() => {
        return isDataChanged.value;
});

// === 폼 제출 로직 ===



// 유효성 검사 함수 (모든 필드는 optional이므로, 빈 함수로 처리)
const validateForm = (): boolean => {
        //console.log('시설 정보 유효성 검사를 수행합니다. 모든 필드는 선택 사항입니다.');
        return true;
};

// 폼 제출 핸들러
const onSubmit = async () => {
        // 1. 유효성 검사
        if (!validateForm()) {
                console.log('시설 정보 유효성 검사 실패');
                return;
        }

        // 2. 로딩 상태 설정
        appStore.setLoading(true);

        // 3. API Payload 준비
        const propertyId = propertyStore.propertyId;
        if (!propertyId) {
                console.error('Property ID가 Pinia 스토어에 없습니다. 저장할 수 없습니다.');
                createToast({
                        title: 'Error',
                        description: 'Property ID is missing. Cannot save changes.'
                }, { type: 'danger', timeout: 5000, position: 'top-right' });
                appStore.setLoading(false);
                return;
        }

        // API payload (FacilityFormDataType 구조)
        const payload: FacilityFormDataType = {
                elevators: formData.elevators,
                materials: formData.materials,
                parking: formData.parking, // <-- Parking 데이터 추가
        };


        try {
                // 4. API 호출
                const updatedAsset = await $fetch<PropertyFacilityResponse>(`/api/upload/${propertyId}/facility`, {
                        method: 'PUT',
                        body: payload,
                });

                // 5. Pinia 스토어 업데이트
                // updatedAsset은 CbreAsset의 완전한 형태는 아니므로 Partial<CbreAsset>로 단언합니다.
                propertyStore.setPropertyPartial(updatedAsset as Partial<CbreAsset>);

                emit('close'); // 패널 닫기 이벤트 전달

                // 성공 토스트 알림
                createToast({ title: 'The changes have been saved successfully.' }, {
                        type: 'success',
                        timeout: 5000,
                        showCloseButton: true,
                        position: 'top-right',
                        transition: 'bounce',
                        hideProgressBar: false,
                        swipeClose: true,
                });

        } catch (error) {
                console.error('시설 정보 업데이트 중 API 오류 발생:', error);
                // 실패 토스트 알림
                createToast({ title: 'Failed to update facility information.' }, {
                        type: 'danger',
                        timeout: 5000,
                        showCloseButton: true,
                        position: 'top-right',
                        transition: 'bounce',
                        swipeClose: true,
                });
        } finally {
                // 6. 로딩 상태 해제
                appStore.setLoading(false);
        }
};
</script>