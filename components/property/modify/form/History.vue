<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-6 font-financier">

      <div class="grid grid-cols-2 gap-10">
        <div>
          <label for="completionDate" class="block text-base font-semibold text-primary mb-2">
            <span class="text-sm text-red-500"> * </span>Completion Date
          </label>
          <input id="completionDate" type="date"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary"
            v-model="formData.completionDate" />
        </div>

        <div>
          <label for="renovationDate" class="block text-base font-semibold text-primary mb-2">Renovation
            Date</label>
          <input id="renovationDate" type="date"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary"
            v-model="formData.renovationDate" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-10">
        <div>
          <label for="developer" class="block text-base font-semibold text-primary mb-2">Developer</label>
          <input id="developer" type="text"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary"
            v-model="formData.developer" />
        </div>

        <div>
          <label for="constructor" class="block text-base font-semibold text-primary mb-2">Constructor</label>
          <input id="constructor" type="text"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary"
            v-model="formData.constructor" />
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
const getInitialData = () => {
  const h = currentProperty.value?.history;
  return {
    completionDate: h?.completionDate ? new Date(h.completionDate).toISOString().split('T')[0] : '',
    renovationDate: h?.renovationDate ? new Date(h.renovationDate).toISOString().split('T')[0] : '',
    developer: h?.developer || '',
    constructor: h?.constructor || '',
  };
};

const formData = reactive(getInitialData());

const onSubmit = async () => {
  statusStore.setGlobalLoading(true);
  try {
    await propertyStore.updatePropertySection('history', {
      completionDate: formData.completionDate ? new Date(formData.completionDate) : null,
      renovationDate: formData.renovationDate ? new Date(formData.renovationDate) : null,
      developer: formData.developer,
      constructor: formData.constructor,
    } as any);

    emit('close');
    createToast({ title: 'History saved.' }, { type: 'success' });
  } catch (e) {
    createToast({ title: 'Error saving.' }, { type: 'danger' });
  } finally {
    statusStore.setGlobalLoading(false);
  }
};
</script>