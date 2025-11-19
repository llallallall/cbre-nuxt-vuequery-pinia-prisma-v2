<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <p class="text-sm text-gray-600">
      Coordinates will be fetched using Kakao API for best accuracy, and then cross-referenced with Google API for standardized English address components.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <div class="col-span-full flex items-end gap-2">
        <div class="flex-grow">
          <label for="addressInput" class="block text-sm font-medium text-gray-700">Address Input (Korean or English)</label>
          <input
            type="text"
            id="addressInput"
            v-model="addressInput" 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cbre_primary_3 focus:border-cbre_primary_3 sm:text-sm"
            :disabled="computedIsLoading"
            placeholder="Input address (e.g., 서울특별시 강남구 테헤란로 501) to search..."
            @keypress.enter.prevent="handleSearch"
          />
        </div>
        <button 
          type="button" 
          @click="handleSearch" 
          class="px-4 py-2 bg-cbre_primary_1 text-white rounded-md hover:bg-cbre_primary_2 text-sm h-[42px] whitespace-nowrap"
          :disabled="computedIsLoading || !addressInput"
        >
          {{ geocoderResults.length > 0 ? 'Re-search' : 'Search' }}
        </button>
      </div>

      <div v-if="geocoderResults.length > 0" class="col-span-full">
        <label class="block text-sm font-medium text-gray-700 mb-2">Select an Address Candidate ({{ geocoderResults.length }} results found)</label>
        <div class="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
          <div 
            v-for="candidate in geocoderResults" 
            :key="candidate.id"
            @click="handleCandidateSelect(candidate)"
            :class="[
              'p-2 text-sm rounded-md cursor-pointer transition duration-150',
              selectedCandidate?.id === candidate.id 
                ? 'bg-cbre_primary_3 text-white font-medium' 
                : 'hover:bg-gray-100'
            ]"
          >
            {{ candidate.addressKorean }} 
            <span v-if="selectedCandidate?.id === candidate.id" class="float-right">✅ Selected</span>
          </div>
        </div>
      </div>
      
      <div v-if="selectedCandidate" class="col-span-full">
        <div class="p-4 bg-green-50 border border-green-300 rounded-md text-sm text-green-800">
          Selected Address: 
          <span class="font-medium">{{ selectedCandidate.addressKorean }}</span>
          <p class="mt-1 text-xs text-green-700">
             Click 'Finalize Geocode' to process coordinates and English components.
          </p>
        </div>
        <button 
          type="button" 
          @click="handleFinalizeGeocode" 
          class="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm w-full"
          :disabled="computedIsLoading || !selectedCandidate"
        >
          Finalize Geocode (Get Coordinates & English Address)
        </button>
      </div>
      
      <div>
        <label for="addressFull" class="block text-sm font-medium text-gray-700">Address Full (Road Name)</label>
        <input
          type="text"
          id="addressFull"
          v-model="formState.addressFull"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
          disabled
          placeholder="Automatically filled by search result"
        />
      </div>

      <div>
        <label for="addressFullJibun" class="block text-sm font-medium text-gray-700">Address Full (Lot No.)</label>
        <input
          type="text"
          id="addressFullJibun"
          v-model="formState.addressFullJibun"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
          disabled
          placeholder="Automatically filled by search result"
        />
      </div>
      
      <div>
        <label for="addressProvince" class="block text-sm font-medium text-gray-700">Province/State</label>
        <input
          type="text"
          id="addressProvince"
          v-model="formState.addressProvince"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
          disabled
          placeholder="Automatically filled by search result"
        />
      </div>

      <div>
        <label for="addressCity" class="block text-sm font-medium text-gray-700">City/District</label>
        <input
          type="text"
          id="addressCity"
          v-model="formState.addressCity"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
          disabled
          placeholder="Automatically filled by search result"
        />
      </div>

      <div>
        <label for="latitude" class="block text-sm font-medium text-gray-700">Latitude (WGS84)</label>
        <input
          type="number"
          id="latitude"
          v-model.number="formState.latitude"
          step="any"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
          disabled
          placeholder="Automatically filled by search result"
        />
      </div>

      <div>
        <label for="longitude" class="block text-sm font-medium text-gray-700">Longitude (WGS84)</label>
        <input
          type="number"
          id="longitude"
          v-model.number="formState.longitude"
          step="any"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
          disabled
          placeholder="Automatically filled by search result"
        />
      </div>
    </div>
    
    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
            type="button"
            @click="emits('close')"
            :disabled="computedIsLoading"
            class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
            Cancel
        </button>
        <button 
          type="button" 
          @click="resetForm"
          class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >Reset</button>
        <button 
          type="submit" 
          :disabled="computedIsLoading || !formState.latitude || !formState.longitude"
          class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white hover:text-primary font-bold py-2 px-4 rounded-[10px] transition duration-150 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center "
        >
          <svg v-if="computedIsLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ computedIsLoading ? 'Saving...' : 'Save and Close' }}
        </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app';

// 🚩 useAddressProcessor에서 필요한 타입과 함수를 가져옵니다.
import { useAddressProcessor, GeocodingCandidate, StandardizedLocation } from '~/composables/useAddressProcessor'; 
import useGoogleMapsApi from '@/composables/useGoogleMapsApi'; 

import type { LocationType, CbreAsset } from '~/types/asset.type';
import { createToast } from 'mosha-vue-toastify';


const emits = defineEmits(['close']);
const propertyStore = usePropertyStore();
const appStore = useAppStore();

const computedIsLoading = computed(() => appStore.isLoading);

// useAddressProcessor 컴포저블 초기화
const { searchAddressCandidates, processSelectedAddress } = useAddressProcessor(); 

// 🚩 주소 입력 필드 상태
const addressInput = ref(''); 
// 🚩 검색 결과 후보 목록 상태
const geocoderResults = ref<GeocodingCandidate[]>([]); 
// 🚩 사용자 선택된 후보 상태
const selectedCandidate = ref<GeocodingCandidate | null>(null); 

// Pinia Store의 현재 자산 데이터 접근 (사용되지 않아 주석 처리)
// const property = computed(() => propertyStore.assetData);

// 폼 로컬 상태
const loc = propertyStore.location;
const formState = reactive<LocationType>({
  addressFull: loc?.addressFull ?? null, 
  addressFullJibun: loc?.addressFullJibun ?? null,
  addressProvince: loc?.addressProvince ?? null,
  addressCity: loc?.addressCity ?? null,
  latitude: loc?.latitude ?? null,
  longitude: loc?.longitude ?? null,
});

onMounted(async () => {
    // Google Maps API 로드 (useAddressProcessor 내부에서 필요함)
    try {
      // @ts-ignore
      await useGoogleMapsApi(); 
      // addressInput 초기값 설정 (가장 유효한 주소로)
      addressInput.value = formState.addressFull || formState.addressFullJibun || '';
    } catch (error) {
      console.error('Failed to load Google Maps API:', error);
      createToast('Failed to load map services. Address processing may not work.', { type: 'danger' });
    }
});


/**
 * 🚩 Step 1: 주소 검색을 실행하고 결과를 geocoderResults에 저장합니다.
 */
const handleSearch = async () => {
  const address = addressInput.value.trim();
  
  if (computedIsLoading.value || !address) return;

  appStore.setLoading(true);
  geocoderResults.value = []; // 기존 결과 초기화
  selectedCandidate.value = null; // 선택된 후보 초기화

  try {
    const candidates = await searchAddressCandidates(address);
    
    if (candidates.length === 0) {
      createToast('No address found for the input.', { type: 'warning', timeout: 4000 });
      resetFormStateData(); // 결과가 없을 경우 폼 필드 비우기
    } else {
      geocoderResults.value = candidates;
      createToast(`Found ${candidates.length} candidates. Please select one.`, { type: 'info', timeout: 4000 });
      // 검색 결과가 1개일 경우 자동 선택
      if (candidates.length === 1) {
          handleCandidateSelect(candidates[0]);
      }
    }
    
  } catch (error) {
    console.error("Search failed:", error);
    createToast('Address search failed.', { type: 'danger' });
  } finally {
    appStore.setLoading(false);
  }
};


/**
 * 🚩 Step 2: 사용자 주소 후보 선택
 */
const handleCandidateSelect = (candidate: GeocodingCandidate) => {
  selectedCandidate.value = candidate;
  createToast('Address selected. Click "Finalize Geocode" to process.', { type: 'info', timeout: 3000 });
};


/**
 * 🚩 Step 3: 선택된 주소를 기반으로 최종 좌표 및 영문 주소 구성을 완료합니다.
 */
const handleFinalizeGeocode = async () => {
    if (!selectedCandidate.value || computedIsLoading.value) return;

    appStore.setLoading(true);

    try {
        // useAddressProcessor의 processSelectedAddress 호출
        const finalLoc = await processSelectedAddress(selectedCandidate.value);

        if (finalLoc && finalLoc.latitude && finalLoc.longitude) {
            updateFormState(finalLoc);
            createToast('Geocoding finalized! Location data is ready to save.', { type: 'success' });
            // 최종 처리가 완료되면 후보 목록은 숨깁니다.
            geocoderResults.value = []; 
        } else {
            createToast('Failed to finalize geocoding. Please try again.', { type: 'danger' });
            resetFormStateData(); // 실패 시 폼 필드를 비웁니다.
        }
    } catch (error) {
        console.error("Finalization failed:", error);
        createToast('An unexpected error occurred during finalization.', { type: 'danger' });
    } finally {
        appStore.setLoading(false);
    }
}


/**
 * 폼 상태를 업데이트하는 헬퍼 함수
 */
const updateFormState = (loc: Partial<LocationType> | StandardizedLocation) => {
  formState.addressFull = loc?.addressFull ?? null;
  formState.addressFullJibun = loc?.addressFullJibun ?? null;
  formState.addressProvince = loc?.addressProvince ?? null;
  formState.addressCity = loc?.addressCity ?? null;
  formState.latitude = loc?.latitude ?? null;
  formState.longitude = loc?.longitude ?? null;
  
  // 최종 데이터가 갱신되면 후보 목록과 선택된 후보를 초기화합니다.
  geocoderResults.value = []; 
  selectedCandidate.value = null; 
};

/**
 * 폼 데이터를 리셋하는 헬퍼 함수
 */
const resetFormStateData = () => {
     updateFormState({
        addressFull: null, addressFullJibun: null, addressProvince: null, 
        addressCity: null, latitude: null, longitude: null,
    });
}


/**
 * 폼 상태를 Pinia 스토어의 현재 값으로 초기화 (리셋 버튼용)
 */
function resetForm() {
  const loc = propertyStore.location;
  
  formState.addressFull = loc?.addressFull ?? null;
  formState.addressFullJibun = loc?.addressFullJibun ?? null;
  formState.addressProvince = loc?.addressProvince ?? null;
  formState.addressCity = loc?.addressCity ?? null;
  formState.latitude = loc?.latitude ?? null;
  formState.longitude = loc?.longitude ?? null;
  
  // 검색 입력 필드 초기화
  addressInput.value = formState.addressFull || formState.addressFullJibun || '';
  // 후보 목록 및 선택 초기화
  geocoderResults.value = []; 
  selectedCandidate.value = null; 
}


/**
 * 폼 저장 (API 호출)
 */
const handleSubmit = async () => {
  // 최종 좌표가 있어야만 저장 가능
  if (!formState.latitude || !formState.longitude) {
    createToast('Please finalize geocoding before saving.', { type: 'warning' });
    return;
  }

  appStore.setLoading(true); // 전역 로딩 시작
  const propertyId = propertyStore.propertyId;

  if (!propertyId) {
    createToast('Error: Property ID is missing.', { type: 'danger' });
    appStore.setLoading(false);
    return;
  }

  try {
    // LocationType 페이로드를 직접 사용
    const payload: LocationType = formState;

    const response = await $fetch<Partial<CbreAsset>>(`/api/upload/${propertyId}/location`, {
      method: 'PUT',
      body: payload,
    });

    if (response && response.location) {
      propertyStore.setProperty({ location: response.location });
      createToast('Location information updated successfully.', { type: 'success' });
      emits('close');
    } else {
      throw new Error('Invalid response from server.');
    }

  } catch (error: any) {
    console.error('Location 업데이트 실패:', error);
    createToast(`Error: ${error.data?.message || 'Failed to update location.'}`, { type: 'danger' });
  } finally {
    appStore.setLoading(false); // 전역 로딩 끝
  }
};
</script>