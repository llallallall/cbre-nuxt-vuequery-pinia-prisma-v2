<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-6 ">

      <div class="grid grid-cols-2 gap-10">
        <div>
          <label for="grade" class="block text-sm font-medium text-gray-700">
            <span class="text-sm text-red-500"> * </span>Grade
          </label>
          <input id="grade" type="text" placeholder="Please enter the asset grade (e.g., A, B, A+)"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" v-model="formData.grade" />
        </div>

        <div>
          <label for="effRatio" class="block text-sm font-medium text-gray-700">Effective Ratio (%)</label>
          <div class="relative mt-1">
            <input id="effRatio" type="number" placeholder="Enter the effective ratio (0-100)"
              class="block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 text-right"
              v-model.number="formData.effectiveRatio" min="0" max="100" step="any" />
            <span class="absolute right-0 top-0 mt-2 mr-3 text-gray-500">%</span>
          </div>
        </div>

      </div>

      <div class="flex justify-end border-t pt-4">
        <button type="button" @click="emit('close')" :disabled="computedIsLoading" class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
          Cancel
        </button>
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
import { reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { createToast } from 'mosha-vue-toastify';

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);
const { isGlobalLoading: computedIsLoading } = storeToRefs(statusStore);

// 초기 데이터
const getInitialData = () => ({
  grade: currentProperty.value?.profitability?.grade || '',
  effectiveRatio: currentProperty.value?.profitability?.effectiveRatio || null,
});

const formData = reactive(getInitialData());

const onSubmit = async () => {
  statusStore.setGlobalLoading(true);
  try {
    // 💡 수정: formData를 'any'로 캐스팅하여 Store의 엄격한 타입 체크 우회
    // (Store는 Full Type을 요구하지만, API는 Partial Update를 지원함)
    await propertyStore.updatePropertySection('profitability', formData as any);

    emit('close');
    createToast({ title: 'Profitability saved.' }, { type: 'success' });
  } catch (e) {
    createToast({ title: 'Error saving.' }, { type: 'danger' });
  } finally {
    statusStore.setGlobalLoading(false);
  }
};

const resetForm = () => {
  Object.assign(formData, getInitialData());
};
</script>