<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div class="space-y-4">
        <div class="flex justify-between items-center pb-2 ">
          <button
            type="button"
            @click="addHistory"
            class="bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150 hover:bg-cbre_primary_3"
          >
            Add New History
          </button>
        </div>

        <div v-if="formData.historyList.length === 0" class="text-gray-500 text-sm italic text-center">
          No history records added yet.
        </div>

        <div v-for="(history, index) in formData.historyList" :key="index" class="p-4 border rounded-md shadow-sm bg-gray-50 relative">
          <button
            type="button"
            @click="removeHistory(index)"
            class="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
            aria-label="Remove history item"
          >
            <i class="fas fa-times"></i>
          </button>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- Year Input -->
            <div>
              <label :for="`year-${index}`" class="block text-sm font-medium text-gray-700">Year</label>
              <input 
                :id="`year-${index}`"
                type="number" 
                placeholder="e.g., 2005"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                v-model="history.year"
              />
            </div>

            <!-- Type Select -->
            <div>
              <label :for="`type-${index}`" class="block text-sm font-medium text-gray-700">Event Type</label>
              <select 
                :id="`type-${index}`"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                v-model="history.type"
              >
                <option disabled value="">Select Type</option>
                <!-- 업데이트된 HistoryType Enum 값과 표시명 사용 -->
                <option :value="HistoryType.COMPLETION">Building Finish</option>
                <option :value="HistoryType.RENOVATION">Renovation Finish</option>
              </select>
            </div>
          </div>
          <!-- 유효성 검사 메시지 (옵션) -->
          <p v-if="errors[index]" class="text-red-500 text-sm mt-1">
            {{ errors[index] }}
          </p>
        </div>
      </div>
      
      <div class="flex justify-end pt-4 border-t">
       
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
import { ref, computed } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app';
import { createToast } from 'mosha-vue-toastify';
import type { HistoryType, CbreAsset } from '~/types/asset.type';
import { HistoryTypeEnum } from '~/types/asset.type';
// 템플릿에서 HistoryTypeEnum을 직접 사용할 수 있도록 노출
const HistoryType = HistoryTypeEnum;

// 컴포넌트 이벤트를 정의합니다.
const emit = defineEmits(['close']);

const propertyStore = usePropertyStore();
const appStore = useAppStore();
const computedIsLoading = computed(() => appStore.isLoading);

// 폼 데이터 초기화: Pinia 스토어의 `historyList`를 깊은 복사하여 사용
const formData = ref({
  propertyId: propertyStore.propertyId,
  historyList: JSON.parse(JSON.stringify(propertyStore.historyList || [])) as (HistoryType | { year: string, type: HistoryTypeEnum | '' })[]
});

// 유효성 검사 에러 객체
const errors = ref<Record<number, string>>({});

// History 항목 추가
const addHistory = () => {
  //const currentId: string = formData.value.propertyId || '';

  formData.value.historyList.push({
    //propertyId : currentId,
    year: '',
    type: '' as HistoryTypeEnum | '' //  null 대신 빈 문자열로 초기화하여 v-model과 통일
  });
};

// History 항목 제거
const removeHistory = (index: number) => {
  formData.value.historyList.splice(index, 1);
};


// 폼 유효성 검사 로직
const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;
  
  formData.value.historyList.forEach((history, index) => {
    if (!history.year || !history.type) {
      errors.value[index] = 'Year and Event Type are required.';
      isValid = false;
    } else if (history.year && !/^\d{4}$/.test(history.year)) {
      errors.value[index] = 'Year must be a 4-digit number.';
      isValid = false;
    }
  });

  return isValid;
};

// updatedAsset을 Pinia 스토어 타입에 맞게 변환하는 함수 (다른 폼에서 가져옴, 필요하다면 추가 수정)
const transformAssetForStore = (asset: any): Partial<CbreAsset> => {
  if (!asset) return {};

  // 1. 서버에서 받은 모든 필드를 일단 펼칩니다.
  // 2. 서버의 'history' 필드를 클라이언트의 'historyList' 필드로 매핑합니다.
  //    (history 필드는 Prisma의 include 이름에서 온 것입니다.)
  return {
    ...asset,
    historyList: asset.history || [], // 서버의 'history'를 Pinia의 'historyList'로 매핑
  } as Partial<CbreAsset>;
};



// --- 🎯 Reset 기능 추가 ---
const resetForm = () => {
    // 폼 데이터를 Pinia 스토어의 현재 assetData 값으로 복원합니다.
    const sourceData = propertyStore.assetData; // 🌟 assetData getter 사용
    
    // historyList를 깊은 복사하여 할당 (Pinia 상태 오염 방지)
    formData.value.historyList = JSON.parse(JSON.stringify(sourceData.historyList || []));
    
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


// 폼 제출 및 API 호출 로직
const onSubmit = async () => {
  if (!validateForm()) {
    createToast({ title: 'Please fill in all required fields correctly.' }, { type: 'warning' });
    return;
  }

  // 서버로 전송할 데이터 준비 (id 필드 제외, propertyId 포함)
  const payload = {
    propertyId: formData.value.propertyId,
    historyList: formData.value.historyList.map(h => ({
        year: h.year,
        type: h.type
    }))
  };
  
  // API 호출 (PUT 메서드 사용)
  try {
    appStore.setLoading(true)
    const updatedAsset = await $fetch(`/api/upload/${propertyStore.propertyId}/history`, {
      method: 'PUT',
      body: payload,
    });

    // 4. Pinia 스토어 업데이트
    const transformedAsset = transformAssetForStore(updatedAsset);
    propertyStore.setProperty(transformedAsset);
    
    emit('close'); // 패널 닫기 이벤트 전달

    createToast({
          title: 'History has been updated successfully.',
          }, {
                  type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                  timeout: 5000,
                  showCloseButton: true,
                  position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                  transition: 'bounce',
                  hideProgressBar: false,
                  swipeClose: true,
          })

  } catch (error) {
    console.error('API 업데이트 오류:', error);
    
    createToast({
          title: 'Failed to update property history.',
          }, {
                  type: 'danger', // 'info', 'danger', 'warning', 'success', 'default'
                  timeout: 5000,
                  showCloseButton: true,
                  position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                  transition: 'bounce',
                  hideProgressBar: false,
                  swipeClose: true,
          })

  } finally {
    appStore.setLoading(false)
  }
};
</script>