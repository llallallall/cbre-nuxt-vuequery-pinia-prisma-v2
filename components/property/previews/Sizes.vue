<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Sizes and Measurements</span>
      <button @click="openEditPanel"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <ul
      class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1 pl-[20px] gap-4 border-b pb-2">
      <li v-if="property?.scale?.noOfBuildings" class="flex items-center ">
        <h3 class="text-base font-semibold">No. of Buildings : </h3>
        <div class="flex-1 pl-2">{{ formatInt(property.scale.noOfBuildings) }}</div>
      </li>
      <li v-if="property?.scale?.upperLevels" class="flex items-center ">
        <h3 class="text-base font-semibold">Upper Levels : </h3>
        <div class="flex-1 pl-2">{{ formatInt(property.scale.upperLevels) }}</div>
      </li>
      <li v-if="property?.scale?.basementLevels" class="flex items-center ">
        <h3 class="text-base font-semibold">Basement Levels : </h3>
        <div class="flex-1 pl-2">{{ formatInt(property.scale.basementLevels) }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useFormat } from '~/composables/useFormat';

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const { numberFormat } = useFormat();
const { currentProperty: property } = storeToRefs(propertyStore);

const formatInt = (v: any) => numberFormat(v, 0);

const openEditPanel = () => {
  uiStore.openModifyForm(propertyStore.currentPropertyId, 'scale'); // 'sizes' -> 'scale'
};
</script>

<style scoped>
.cbre_bulletList {
  list-style: none;
  padding: 0 0 0 20px;
  line-height: 2;
}
</style>