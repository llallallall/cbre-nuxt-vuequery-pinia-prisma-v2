<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Location & Coordinates Information</span>
      <button @click="openEditPanel"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
      <li v-if="property?.location?.addressProvince" class="flex items-center col-span-full">
        <h3 class="text-base font-semibold min-w-[150px]">Province :</h3>
        <div class="flex-1 pl-2">{{ property.location.addressProvince }}</div>
      </li>
      <li v-if="property?.location?.addressCity" class="flex items-center col-span-full">
        <h3 class="text-base font-semibold min-w-[150px]">City :</h3>
        <div class="flex-1 pl-2">{{ property.location.addressCity }}</div>
      </li>
      <li v-if="property?.location?.addressFull" class="flex items-center col-span-full">
        <h3 class="text-base font-semibold min-w-[150px]">Address (Road) :</h3>
        <div class="flex-1 pl-2">{{ property.location.addressFull }}</div>
      </li>
      <li v-if="property?.location?.addressFullJibun" class="flex items-center col-span-full">
        <h3 class="text-base font-semibold min-w-[150px]">Address (Jibun) :</h3>
        <div class="flex-1 pl-2">{{ property.location.addressFullJibun }}</div>
      </li>
      <li class="flex items-center">
        <h3 class="text-base font-semibold">Latitude :</h3>
        <div class="flex-1 pl-2">{{ property?.location?.latitude }}</div>
      </li>
      <li class="flex items-center">
        <h3 class="text-base font-semibold">Longitude :</h3>
        <div class="flex-1 pl-2">{{ property?.location?.longitude }}</div>
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
  uiStore.openModifyForm(propertyStore.currentPropertyId, 'location');
};
</script>

<style scoped>
.cbre_bulletList {
  list-style: none;
  padding: 0 0 0 20px;
  line-height: 2;
}
</style>