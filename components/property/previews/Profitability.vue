<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Profitability</span>
      <button @click="openEditPanel"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-3 grid-cols-1">
      <li v-if="property?.profitability?.grade" class="flex items-center">
        <h3 class="text-base font-semibold">Grade :</h3>
        <div class="flex-1 pl-2">{{ property.profitability.grade }}</div>
      </li>

      <li v-if="property?.profitability?.effectiveRatio !== null" class="flex items-center">
        <h3 class="text-base font-semibold">Effective Ratio :</h3>
        <div class="flex-1 pl-2">{{ property?.profitability?.effectiveRatio }}%</div>
      </li>
    </ul>
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
  uiStore.openModifyPanel(propertyStore.currentPropertyId, 'profitability');
};
</script>