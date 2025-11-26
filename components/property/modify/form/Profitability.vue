<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-6 font-financier">

      <div class="grid grid-cols-2 gap-10">
        <div>
          <label for="grade" class="block text-base font-semibold text-primary mb-2">
            <span class="text-sm text-red-500"> * </span>Grade
          </label>
          <input id="grade" type="text" placeholder="Please enter the asset grade (e.g., A, B, A+)"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary"
            v-model="formData.grade" />
        </div>

        <div>
          <label for="effRatio" class="block text-base font-semibold text-primary mb-2">Effective Ratio
            (%)</label>
          <div class="relative mt-1">
            <input id="effRatio" type="number" placeholder="Enter the effective ratio (0-100)"
              class="block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 text-right font-calibreLight text-lg text-primary"
              v-model.number="formData.effectiveRatio" min="0" max="100" step="any" />
          </div>
        </div>
      </div>



      <div class="flex justify-end gap-2">
        <button type="button" @click="emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { createToast } from 'mosha-vue-toastify';

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);

// 초기 데이터
const getInitialData = () => {
  const p = currentProperty.value?.profitability;
  return {
    grade: p?.grade || '',
    effectiveRatio: p?.effectiveRatio || null,

  };
};

const formData = reactive(getInitialData());

const onSubmit = async () => {
  statusStore.setGlobalLoading(true);
  try {
    await propertyStore.updatePropertySection('profitability', formData as any);
    emit('close');
    createToast({ title: 'Profitability saved.' }, { type: 'success' });
  } catch (e) {
    createToast({ title: 'Error saving.' }, { type: 'danger' });
  } finally {
    statusStore.setGlobalLoading(false);
  }
};
</script>
