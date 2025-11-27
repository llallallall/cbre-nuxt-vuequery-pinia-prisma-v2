<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-primary">History</h3>
      <button @click="addHistoryItem"
        class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150">
        Add History
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="(item, index) in historyList" :key="index"
        class="flex gap-4 items-end border p-4 rounded-lg bg-gray-50">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input type="text" v-model="item.year" placeholder="YYYY"
            class="block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary" />
        </div>

        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select v-model="item.type"
            class="block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary">
            <option value="COMPLETION">Completion</option>
            <option value="RENOVATION">Renovation</option>
          </select>
        </div>

        <button @click="removeHistoryItem(index)" class="text-red-600 hover:text-red-800 p-2 mb-1">
          Delete
        </button>
      </div>

      <div v-if="historyList.length === 0" class="text-center text-gray-500 py-4 border-2 border-dashed rounded-lg">
        No history records found.
      </div>
    </div>

    <div class="flex flex-row items-center justify-end pt-8 border-t font-financierMedium">
      <button type="button" @click="emit('close')"
        class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white py-2 px-4 rounded-[10px] mr-4 transition duration-150">Cancel</button>
      <button type="button" @click="onSubmit" :disabled="computedIsLoading"
        class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150">Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { createToast } from 'mosha-vue-toastify';
import type { HistoryTypeEnum } from '~/types/property.type';

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);
const { isGlobalLoading: computedIsLoading } = storeToRefs(statusStore);

interface HistoryItem {
  year: string;
  type: HistoryTypeEnum;
}

// Initialize data from store
const getInitialData = (): HistoryItem[] => {
  const history = currentProperty.value?.history || [];
  return history.map(h => ({
    year: h.year,
    type: h.type as HistoryTypeEnum,
  }));
};

const historyList = ref<HistoryItem[]>(getInitialData());

const addHistoryItem = () => {
  historyList.value.push({
    year: '',
    type: 'COMPLETION',
  });
};

const removeHistoryItem = (index: number) => {
  historyList.value.splice(index, 1);
};

const onSubmit = async () => {
  statusStore.setGlobalLoading(true);
  try {
    // Validate
    if (historyList.value.some(h => !h.year)) {
      createToast({ title: 'Year is required for all items.' }, { type: 'warning' });
      return;
    }

    // Update store
    // Note: updatePropertySection for 'history' expects an array of History objects
    // We cast to any because the store action might expect full HistoryType objects but we are sending payloads
    await propertyStore.updatePropertySection('history', historyList.value as any);

    emit('close');
    createToast({ title: 'History saved.' }, { type: 'success' });
  } catch (e) {
    createToast({ title: 'Error saving history.' }, { type: 'danger' });
  } finally {
    statusStore.setGlobalLoading(false);
  }
};
</script>