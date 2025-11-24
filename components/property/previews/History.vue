<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>History</span>
      <button @click="openEditPanel"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <div v-if="property?.history && property.history.length > 0" class="pl-[20px]">
      <table class="table-auto w-full border border-gray-300 text-primary text-sm">
        <thead>
          <tr class="bg-gray-100 font-semibold">
            <th class="px-2 py-1 text-left">Year</th>
            <th class="px-2 py-1 text-left">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(h, index) in property.history" :key="index" class="text-left border-t">
            <td class="px-2 py-1">{{ h.year }}</td>
            <td class="px-2 py-1">{{ h.type }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-gray-500 text-sm mt-2 text-center">
      No history information available.
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';

const propertyStore = usePropertyStore();
const uiStore = useUiStore();

const { currentProperty: property } = storeToRefs(propertyStore);

const openEditPanel = () => {
  uiStore.openModifyPanel(propertyStore.currentPropertyId, 'history');
};
</script>