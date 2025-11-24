<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div class="space-y-4">
        <div class="flex justify-between items-center pb-2 ">
          <button type="button" @click="addHistory"
            class="bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150 hover:bg-cbre_primary_3">
            Add New History
          </button>
        </div>

        <div v-if="formData.historyList.length === 0" class="text-gray-500 text-sm italic text-center">
          No history records added yet.
        </div>

        <div v-for="(history, index) in formData.historyList" :key="index"
          class="p-4 border rounded-md shadow-sm bg-gray-50 relative">
          <button type="button" @click="removeHistory(index)"
            class="absolute top-2 right-2 text-red-500 hover:text-red-700 transition" aria-label="Remove history item">
            <i class="fas fa-times"></i>
          </button>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label :for="`year-${index}`" class="block text-sm font-medium text-gray-700">Year</label>
              <input :id="`year-${index}`" type="text" placeholder="e.g., 2005"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" v-model="history.year" />
            </div>

            <div>
              <label :for="`type-${index}`" class="block text-sm font-medium text-gray-700">Event Type</label>
              <select :id="`type-${index}`" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                v-model="history.type">
                <option disabled value="">Select Type</option>
                <option :value="HistoryType.COMPLETION">Building Finish (Completion)</option>
                <option :value="HistoryType.RENOVATION">Renovation Finish</option>
              </select>
            </div>
          </div>
          <p v-if="errors[index]" class="text-red-500 text-sm mt-1">
            {{ errors[index] }}
          </p>
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t">

        <button type="button" @click="resetForm()" class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">Reset</button>
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
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { createToast } from 'mosha-vue-toastify';

// 💡 1. 새로운 Store 및 Type Import
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import type { HistoryTypeEnum } from '~/types/property.type'; // 💡 경로 변경
// import type { HistoryType } from '~/types/property.type'; // 필요 시 사용

const HistoryType = {
  COMPLETION: 'COMPLETION',
  RENOVATION: 'RENOVATION'
} as const;

const emit = defineEmits(['close']);

// 💡 2. Store 인스턴스 교체
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();

// 💡 3. 로딩 상태 참조 변경 (AppStore -> StatusStore)
const { isGlobalLoading: computedIsLoading } = storeToRefs(statusStore);

// 💡 4. 폼 데이터 초기화 (currentProperty.history 사용)
// DB에서 가져온 history 배열을 복사하거나 빈 배열로 초기화
const currentHistory = propertyStore.currentProperty?.history || [];

const formData = ref({
  // propertyId는 현재 작업 중인 ID 사용
  propertyId: propertyStore.currentPropertyId,
  // UI에서 수정할 임시 배열 (Deep Copy)
  historyList: JSON.parse(JSON.stringify(currentHistory)).map((h: any) => ({
    id: h.id, // 기존 항목이면 ID 존재
    year: h.year,
    type: h.type
  }))
});

const errors = ref<Record<number, string>>({});

// History 항목 추가
const addHistory = () => {
  formData.value.historyList.push({
    id: undefined, // 새 항목은 ID 없음
    year: '',
    type: '' as any // 초기값
  });
};

// History 항목 제거
const removeHistory = (index: number) => {
  formData.value.historyList.splice(index, 1);
};

// 폼 유효성 검사
const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  formData.value.historyList.forEach((history: any, index: number) => {
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

// Reset 기능
const resetForm = () => {
  // 💡 수정: currentProperty에서 데이터 복원
  const sourceList = propertyStore.currentProperty?.history || [];

  formData.value.historyList = JSON.parse(JSON.stringify(sourceList)).map((h: any) => ({
    id: h.id,
    year: h.year,
    type: h.type
  }));

  createToast({ title: 'Form restored to current asset data.', type: 'success' });
}

// 폼 제출
const onSubmit = async () => {
  if (!validateForm()) {
    createToast({ title: 'Please fill in all required fields correctly.', type: 'warning' });
    return;
  }

  // 💡 수정: Payload 구조를 PropertyStore의 updatePropertySection에 맞춤
  // (백엔드가 History 리스트 전체 교체를 지원한다고 가정)
  const payload = formData.value.historyList;

  try {
    // 💡 수정: PropertyStore의 액션 사용 (로딩 상태 관리 포함됨)
    // 'history' 섹션을 업데이트하도록 요청 (history는 PropertyType의 키)
    await propertyStore.updatePropertySection('history', payload as any);

    emit('close');
    createToast({ title: 'History has been updated successfully.', type: 'success' });

  } catch (error) {
    console.error('API 업데이트 오류:', error);
    createToast({ title: 'Failed to update property history.', type: 'danger' });
  }
};
</script>