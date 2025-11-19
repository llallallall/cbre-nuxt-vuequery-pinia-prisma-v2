<template>
  <div class="p-6 space-y-6">

    <form @submit.prevent="onSubmit" class="space-y-6">

      <fieldset class="border p-4 rounded-lg space-y-4">
        <legend class="text-sm font-semibold text-gray-600 px-2">Building Structure</legend>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">No. of Buildings</label>
            <input type="text" :value="getDisplayValue('noOfBuildings', 0)"
              @input="e => handleNumberInput(e, 'noOfBuildings', false, 0)"
              @blur="handleIntegerInputBlur('noOfBuildings')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Upper Levels</label>
            <input type="text" :value="getDisplayValue('upperLevels', 0)"
              @input="e => handleNumberInput(e, 'upperLevels', false, 0)" @blur="handleIntegerInputBlur('upperLevels')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Basement Levels</label>
            <input type="text" :value="getDisplayValue('basementLevels', 0)"
              @input="e => handleNumberInput(e, 'basementLevels', false, 0)"
              @blur="handleIntegerInputBlur('basementLevels')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
        </div>
      </fieldset>

      <fieldset class="border p-4 rounded-lg space-y-4">
        <legend class="text-sm font-semibold text-gray-600 px-2">Floor Area</legend>
        <div class="grid md:grid-cols-4 gap-6">

          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">GFA (㎡)</label>
            <input type="text" :value="getDisplayValue('gfaSqm', 2)"
              @input="e => handleNumberInput(e, 'gfaSqm', true, 2)" @blur="handleFloatInputBlur('gfaSqm')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">GFA (py)</label>
            <input type="text" :value="getDisplayValue('gfaPy', 2)" @input="e => handleNumberInput(e, 'gfaPy', true, 2)"
              @blur="handleFloatInputBlur('gfaPy')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">NFA (㎡)</label>
            <input type="text" :value="getDisplayValue('nfaSqm', 2)"
              @input="e => handleNumberInput(e, 'nfaSqm', true, 2)" @blur="handleFloatInputBlur('nfaSqm')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">NFA (py)</label>
            <input type="text" :value="getDisplayValue('nfaPy', 2)" @input="e => handleNumberInput(e, 'nfaPy', true, 2)"
              @blur="handleFloatInputBlur('nfaPy')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>

        </div>
      </fieldset>

      <fieldset class="border p-4 rounded-lg space-y-4">
        <legend class="text-sm font-semibold text-gray-600 px-2">Site and Floor</legend>
        <div class="grid md:grid-cols-4 gap-6">

          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Land Area (㎡)</label>
            <input type="text" :value="getDisplayValue('siteAreaSqm', 2)"
              @input="e => handleNumberInput(e, 'siteAreaSqm', true, 2)" @blur="handleFloatInputBlur('siteAreaSqm')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Land Area (py)</label>
            <input type="text" :value="getDisplayValue('siteAreaPy', 2)"
              @input="e => handleNumberInput(e, 'siteAreaPy', true, 2)" @blur="handleFloatInputBlur('siteAreaPy')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Floor Plate (㎡)</label>
            <input type="text" :value="getDisplayValue('floorPlateSqm', 2)"
              @input="e => handleNumberInput(e, 'floorPlateSqm', true, 2)" @blur="handleFloatInputBlur('floorPlateSqm')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Floor Plate (py)</label>
            <input type="text" :value="getDisplayValue('floorPlatePy', 2)"
              @input="e => handleNumberInput(e, 'floorPlatePy', true, 2)" @blur="handleFloatInputBlur('floorPlatePy')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>

        </div>
      </fieldset>

      <fieldset class="border p-4 rounded-lg space-y-4">
        <legend class="text-sm font-semibold text-gray-600 px-2">Leasable Area</legend>
        <div class="grid md:grid-cols-4 gap-6">

          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Gross Leasable Area (㎡)</label>
            <input type="text" :value="getDisplayValue('grossLeasableAreaSqm', 2)"
              @input="e => handleNumberInput(e, 'grossLeasableAreaSqm', true, 2)"
              @blur="handleFloatInputBlur('grossLeasableAreaSqm')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Gross Leasable Area (py)</label>
            <input type="text" :value="getDisplayValue('grossLeasableAreaPy', 2)"
              @input="e => handleNumberInput(e, 'grossLeasableAreaPy', true, 2)"
              @blur="handleFloatInputBlur('grossLeasableAreaPy')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Net Leasable Area (㎡)</label>
            <input type="text" :value="getDisplayValue('netLeasableAreaSqm', 2)"
              @input="e => handleNumberInput(e, 'netLeasableAreaSqm', true, 2)"
              @blur="handleFloatInputBlur('netLeasableAreaSqm')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Net Leasable Area (py)</label>
            <input type="text" :value="getDisplayValue('netLeasableAreaPy', 2)"
              @input="e => handleNumberInput(e, 'netLeasableAreaPy', true, 2)"
              @blur="handleFloatInputBlur('netLeasableAreaPy')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>

        </div>
      </fieldset>

      <fieldset class="border p-4 rounded-lg space-y-4">
        <legend class="text-sm font-semibold text-gray-600 px-2">Ratios</legend>
        <div class="grid md:grid-cols-4 gap-6">

          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Floor Area Ratio (existing / ㎡)</label>
            <input type="text" :value="getDisplayValue('floorAreaRatioExisting', 6)"
              @input="e => handleNumberInput(e, 'floorAreaRatioExisting', true, 6)"
              @blur="handleFloatInputBlur('floorAreaRatioExisting')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Floor Area Ratio (permitted / ㎡)</label>
            <input type="text" :value="getDisplayValue('floorAreaRatioPermitted', 6)"
              @input="e => handleNumberInput(e, 'floorAreaRatioPermitted', true, 6)"
              @blur="handleFloatInputBlur('floorAreaRatioPermitted')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Building Coverage Ratio (existing / ㎡)</label>
            <input type="text" :value="getDisplayValue('buildingCoverageRatioExisting', 6)"
              @input="e => handleNumberInput(e, 'buildingCoverageRatioExisting', true, 6)"
              @blur="handleFloatInputBlur('buildingCoverageRatioExisting')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium mb-1">Building Coverage Ratio (permitted / ㎡)</label>
            <input type="text" :value="getDisplayValue('buildingCoverageRatioPermitted', 6)"
              @input="e => handleNumberInput(e, 'buildingCoverageRatioPermitted', true, 6)"
              @blur="handleFloatInputBlur('buildingCoverageRatioPermitted')"
              class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1 text-right" />
          </div>

        </div>
      </fieldset>

      <div class="flex justify-end pt-4 border-t">
        <button type="button" @click="emit('close')" :disabled="computedIsLoading" class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
          Cancel
        </button>
        <button type="button" @click="resetForm()" :disabled="computedIsLoading" class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
          Reset
        </button>

        <button type="submit" :disabled="computedIsLoading" class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white hover:text-primary font-bold py-2 px-4 rounded-[10px] transition duration-150 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ">
          <svg v-if="computedIsLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
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
import { reactive, watch, computed } from 'vue'; // 💡 [수정] computed 추가
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app';
import { createToast } from 'mosha-vue-toastify';
import type { SizesType } from '~/types/asset.type';
// 💡 [수정] useFormat 임포트
import { useFormat } from '~/composables/useFormat';

// 💡 [수정] 공통 함수 임포트
const {
  numberFormat,
  processNumberInput, // Floor.vue에서 추출한 공통 입력 핸들러
  calculatePyValue,   // Floor.vue에서 추출한 Py 계산기
} = useFormat();

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const appStore = useAppStore();

const computedIsLoading = computed(() => appStore.isLoading);

const defaultSizes: SizesType = {
  noOfBuildings: 1,
  upperLevels: 1,
  basementLevels: 0,
  gfaSqm: null, gfaPy: null,
  nfaSqm: null, nfaPy: null,
  siteAreaSqm: null, siteAreaPy: null,
  grossLeasableAreaSqm: null, grossLeasableAreaPy: null,
  netLeasableAreaSqm: null, netLeasableAreaPy: null,
  floorAreaRatioExisting: null,
  floorAreaRatioPermitted: null,
  buildingCoverageRatioExisting: null,
  buildingCoverageRatioPermitted: null,
  floorPlateSqm: null, floorPlatePy: null,
};

const formData = reactive<SizesType>({ ...defaultSizes });

// 💡 [추가] 뷰 모델 (화면 표시용)
const displayValues = reactive<Record<string, string>>({});

// 💡 [추가] 뷰 모델 값 반환 헬퍼 (Floor.vue 로직)
const getDisplayValue = (
  field: keyof SizesType,
  decimalPlaces: number
) => {
  const key = String(field);
  if (!(key in displayValues)) {
    displayValues[key] = formData[field] !== null ? numberFormat(formData[field], decimalPlaces) : '';
  }
  return displayValues[key];
};

// 💡 [추가] 숫자 입력 핸들러 (Floor.vue 로직)
const handleNumberInput = (
  e: Event,
  field: keyof SizesType,
  isDecimal: boolean,
  decimalPlaces: number = 0
) => {
  const target = e.target as HTMLInputElement;
  let value = target.value;
  const key = String(field);

  // 1. 💡 공통 함수 호출
  // processNumberInput은 콤마가 *포함된* formattedValue를 반환
  const { cleanedValue, formattedValue, numericValue } = processNumberInput(value, isDecimal, decimalPlaces);

  // 2. 모델 업데이트
  const writableFormData = formData as Record<string, any>;
  if (numericValue !== null || cleanedValue === '') {
    writableFormData[field] = numericValue;
  }

  // 3. 뷰(DOM) 업데이트
  displayValues[key] = formattedValue;
  target.value = formattedValue;
};


// --- 입력 종료 시 데이터 클렌징 핸들러 ---

type SizesKey = keyof SizesType;

// 🎯 정수 필드 처리 핸들러 (Int 타입)
const handleIntegerInputBlur = (key: SizesKey) => {
  const value = formData[key];
  if (typeof value === 'number') {
    formData[key] = Math.round(value) | 0;
  } else if (value === null || value === undefined) {
    if (key === 'noOfBuildings' || key === 'upperLevels') {
      formData[key] = 1;
    } else if (key === 'basementLevels') {
      formData[key] = 0;
    }
  }
  // 💡 [추가] 뷰 모델 업데이트
  displayValues[String(key)] = numberFormat(formData[key], 0);
};

// 💡 [제거] 로컬 calculatePyValue 함수

// 🎯 Sqm/Py 필드 쌍 정의 (Sqm 키와 Py 키 매핑)
const floatFieldPairs: Record<SizesKey, SizesKey | null> = {
  gfaSqm: 'gfaPy',
  gfaPy: 'gfaSqm',
  nfaSqm: 'nfaPy',
  nfaPy: 'nfaSqm',
  siteAreaSqm: 'siteAreaPy',
  siteAreaPy: 'siteAreaSqm',
  grossLeasableAreaSqm: 'grossLeasableAreaPy',
  grossLeasableAreaPy: 'grossLeasableAreaSqm',
  netLeasableAreaSqm: 'netLeasableAreaPy',
  netLeasableAreaPy: 'netLeasableAreaSqm',

  noOfBuildings: null,
  upperLevels: null,
  basementLevels: null,
  floorAreaRatioExisting: null,
  floorAreaRatioPermitted: null,
  buildingCoverageRatioExisting: null,
  buildingCoverageRatioPermitted: null,

  floorPlateSqm: 'floorPlatePy',
  floorPlatePy: 'floorPlateSqm',
};



// 🎯 소수점 필드 처리 핸들러 (Float 타입)
const handleFloatInputBlur = (key: SizesKey) => {
  const rawValue = formData[key];

  // 비율 필드는 6자리, 나머지는 2자리
  const decimalPlaces = (key.startsWith('floorArea') || key.startsWith('buildingCoverage')) ? 6 : 2;

  let cleanedValue: number | null = null;

  if (typeof rawValue === 'number') {
    cleanedValue = parseFloat(rawValue.toFixed(decimalPlaces));
    formData[key] = cleanedValue;
  } else if (rawValue === '' || rawValue === null || rawValue === undefined) {
    formData[key] = null;
  }

  // 💡 [추가] 뷰 모델 업데이트
  displayValues[String(key)] = numberFormat(formData[key], decimalPlaces);

  // 4. Sqm -> Py 자동 계산 로직
  if (key.endsWith('Sqm')) {
    const pyKey = floatFieldPairs[key];
    if (pyKey) {
      // 💡 [수정] 공통 함수 사용
      const pyValue = (cleanedValue !== null) ? calculatePyValue(cleanedValue) : null;
      formData[pyKey] = pyValue;
      // 💡 [추가] Py 필드의 뷰 모델도 업데이트
      displayValues[String(pyKey)] = numberFormat(pyValue, 2);
    }
  }
};

// 💡 [추가] displayValues 초기화 헬퍼
const clearDisplayValues = () => {
  for (const key in displayValues) {
    delete displayValues[key];
  }
};

// Pinia 스토어에서 데이터 가져와 폼 초기화
const initializeForm = () => {
  clearDisplayValues(); // 💡 [추가]
  const sizesData = propertyStore.$state.sizes || {};
  Object.assign(formData, {
    ...defaultSizes,
    ...JSON.parse(JSON.stringify(sizesData))
  });
};

watch(() => propertyStore.propertyId, initializeForm, { immediate: true });

const resetForm = () => {
  clearDisplayValues(); // 💡 [추가]
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

// --- 폼 제출 로직 (수정 불필요) ---
// (formData가 이미 순수한 숫자를 가지고 있으므로 기존 로직 그대로 작동)

const onSubmit = async () => {
  appStore.setLoading(true);

  const toInt = (value: number | null): number => Math.round(value || 0) | 0;

  const roundToTwoDecimals = (value: number | null): number | null => {
    if (value === null || value === undefined) {
      return null;
    }
    return parseFloat(value.toFixed(2));
  };

  // 💡 [추가] 비율 필드(6자리)를 위한 반올림 함수
  const roundToSixDecimals = (value: number | null): number | null => {
    if (value === null || value === undefined) {
      return null;
    }
    return parseFloat(value.toFixed(6));
  };


  const payload = {
    no_of_buildings: toInt(formData.noOfBuildings),
    upper_levels: toInt(formData.upperLevels),
    basement_levels: toInt(formData.basementLevels),

    gfa_sqm: roundToTwoDecimals(formData.gfaSqm),
    gfa_py: roundToTwoDecimals(formData.gfaPy),
    nfa_sqm: roundToTwoDecimals(formData.nfaSqm),
    nfa_py: roundToTwoDecimals(formData.nfaPy),
    site_area_sqm: roundToTwoDecimals(formData.siteAreaSqm),
    site_area_py: roundToTwoDecimals(formData.siteAreaPy),
    gross_leasable_area_sqm: roundToTwoDecimals(formData.grossLeasableAreaSqm),
    gross_leasable_area_py: roundToTwoDecimals(formData.grossLeasableAreaPy),
    net_leasable_area_sqm: roundToTwoDecimals(formData.netLeasableAreaSqm),
    net_leasable_area_py: roundToTwoDecimals(formData.netLeasableAreaPy),

    // 💡 [수정] 비율 필드는 6자리 반올림 적용
    floor_area_ratio_existing: roundToSixDecimals(formData.floorAreaRatioExisting),
    floor_area_ratio_permitted: roundToSixDecimals(formData.floorAreaRatioPermitted),
    building_coverage_ratio_existing: roundToSixDecimals(formData.buildingCoverageRatioExisting),
    building_coverage_ratio_permitted: roundToSixDecimals(formData.buildingCoverageRatioPermitted),

    floor_plate_sqm: roundToTwoDecimals(formData.floorPlateSqm),
    floor_plate_py: roundToTwoDecimals(formData.floorPlatePy),
  };

  try {
    const updatedSizes = await $fetch<SizesType>(`/api/upload/${propertyStore.propertyId}/sizes`, {
      method: 'PUT',
      body: payload,
    });

    propertyStore.setProperty({ sizes: updatedSizes });

    emit('close');

    createToast({ title: 'Size information has been successfully saved.' }, { type: 'success' });

  } catch (error) {
    console.error('API 업데이트 오류:', error);
    createToast({ title: 'Failed to update size information.' }, { type: 'danger' });
  } finally {
    appStore.setLoading(false);
  }
};
</script>