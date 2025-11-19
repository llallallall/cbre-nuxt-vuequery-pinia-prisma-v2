<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-6 ">

      <div class="grid grid-cols-2 gap-10">
                <div>
                        <label for="grade" class="block text-sm font-medium text-gray-700">
                        <span class="text-sm text-red-500"> * </span>Grade
                        </label>
                        <input 
                        id="grade"
                        type="text" 
                        placeholder="Please enter the asset grade (e.g., A, B, A+)"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        v-model="formData.profitability.grade"
                        />
                </div>
                
                <div>
                        <label for="effRatio" class="block text-sm font-medium text-gray-700">Effective Ratio (%)</label>
                        <div class="relative mt-1">
                        <input 
                        id="effRatio"
                        type="number" 
                        placeholder="Enter the effective ratio (0-100)"
                        class="block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 text-right"
                                v-model.number="formData.profitability.effRatio"
                        min="0" max="100"
                        step="any"
                        />
                        <span class="absolute right-0 top-0 mt-2 mr-3 text-gray-500">%</span>
                        </div>
                </div>

      </div>

      <div class="flex justify-end">
      <button
            type="button"
            @click="emit('close')"
            :disabled="computedIsLoading"
            class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
            Cancel
      </button>
      <button 
          type="button" 
          @click="resetForm()" 
          class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >Reset</button>
        <button
          type="submit"
          :disabled="computedIsLoading" 
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app'; 

import { createToast } from 'mosha-vue-toastify';
import type { CbreAsset, ProfitabilityType } from '~/types/asset.type';

// 부모 컴포넌트로 닫힘 이벤트를 전달
const emit = defineEmits(['close']); 

// Pinia 스토어 및 Toast 사용
const propertyStore = usePropertyStore();
const appStore = useAppStore();
const computedIsLoading = computed(() => appStore.isLoading);

// 현재 자산 데이터에서 초기 폼 데이터 구성
const currentAsset = propertyStore.assetData; 

// ProfitabilityType 구조에 맞춰 폼 데이터 정의
const formData = ref({
  propertyId: currentAsset.propertyId, // API 호출 시 필요
  profitability: {
    grade: currentAsset.profitability?.grade || '',
    effRatio: currentAsset.profitability?.effRatio || null,
  } as ProfitabilityType
});


// --- 🎯 Reset 기능 추가 ---
const resetForm = () => {
    // 폼 데이터를 Pinia 스토어의 현재 assetData 값으로 복원합니다.
    const sourceData = propertyStore.assetData; // 🌟 assetData getter 사용
    
    // propertyId 체크는 assetData 내에 포함되어 있으므로 생략하거나,
    // 자산 정보가 로드되었다는 가정 하에 진행합니다.
    
    formData.value.profitability.grade = sourceData.profitability?.grade || '';
    formData.value.profitability.effRatio = sourceData.profitability?.effRatio || null;
  

    //alert('폼이 현재 자산의 정보로 복원되었습니다.'); // 사용자 피드백 제공
      createToast({
        title: 'Form restored to current asset data.',
        // description: 'If you want to delete image click X mark'
        }, {
                type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                timeout: 5000,
                showCloseButton: true,
                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                transition: 'bounce',
                hideProgressBar: false,
                swipeClose: true,
        })
}

// --- 서버 응답 변환 헬퍼 함수 (가독성을 위해 onSubmit 밖으로 분리) ---
// updatedAsset을 Pinia 스토어 타입에 맞게 변환하는 함수
const transformAssetForStore = (asset: any): Partial<CbreAsset> => {
  if (!asset) return {};

  // 1. 날짜 문자열을 Date 객체로 변환
  const transformedLeaseInfo = asset.leaseInfo ? {
    ...asset.leaseInfo,
    leaseStartDate: asset.leaseInfo.leaseStartDate 
      ? new Date(asset.leaseInfo.leaseStartDate) 
      : null,
    // 필요한 다른 날짜 필드들도 여기에 추가
  } : undefined;

  // 2. SerializeObject 타입 래퍼를 벗겨내기
  const transformedFloorList = asset.floorList?.map((floor: any) => ({
    ...floor,
    // floorPartial도 배열 복사로 래퍼 제거
    floorPartial: floor.floorPartial ? [...floor.floorPartial] : undefined
  }));

  return {
    ...asset,
    leaseInfo: transformedLeaseInfo,
    floorList: transformedFloorList
    // 다른 문제 되는 필드들도 여기에 추가하여 변환
  } as Partial<CbreAsset>; // 최종적으로 스토어 타입으로 명시적 캐스팅
};


// 폼 제출 및 API 호출 로직
const onSubmit = async () => {
  // 1. 유효성 검사 (여기서는 Grade 필수 입력만 가정)
  if (!formData.value.profitability.grade) {
    createToast({ title: 'Grade is required.' }, { type: 'warning' });
    return;
  }

  // 2. 서버로 전송할 데이터 준비
  const payload = {
    propertyId: formData.value.propertyId,
    profitability: formData.value.profitability,
  };
  
  // 3. API 호출 (PUT 메서드 사용)
  try {
    appStore.setLoading(true)
    const updatedAsset = await $fetch(`/api/upload/${propertyStore.propertyId}/profitability`, {
      method: 'PUT',
      body: payload,
    });

    // 4. Pinia 스토어 업데이트
    const transformedAsset = transformAssetForStore(updatedAsset);
    propertyStore.setProperty(transformedAsset);
    
    emit('close'); // 패널 닫기 이벤트

    createToast({ title: 'The profitability information has been successfully saved' }, { type: 'success' });

  } catch (error) {
    console.error('API 업데이트 오류:', error);
    createToast({ title: 'Failed to modify asset information.' }, { type: 'danger' });
  } finally {
  appStore.setLoading(false)

  }
};
</script>

<style scoped>
/* Tailwind CSS 사용으로 추가 스타일 불필요 */
</style>