<template>
  <div class="bg-white mt-4">

    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Location & Coordinates Information</span>
      <button @click="panelStore.openPanel('location')" 
              class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <ul 
      class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 "
    >
        <li v-if="property.location?.addressProvince" class="flex items-center col-span-full">
        <h3 class="text-base font-semibold min-w-[150px]">
        Province : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.location.addressProvince }}
        </div>
      </li>

      <li v-if="property.location?.addressCity" class="flex items-center col-span-full">
        <h3 class="text-base font-semibold min-w-[150px]">
        City : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.location.addressCity }}
        </div>
      </li>

      <li v-if="property.location?.addressFull" class="flex items-center col-span-full">
        <h3 class="text-base font-semibold min-w-[150px]">
        Address (Road Name) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.location.addressFull }}
        </div>
      </li>

      <li v-if="property.location?.addressFullJibun" class="flex items-center col-span-full">
        <h3 class="text-base font-semibold min-w-[150px]">
        Address (Jibun) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.location.addressFullJibun }}
        </div>
      </li>
      
      <li class="flex items-center">
        <h3 class="text-base font-semibold">
        Latitude : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.location?.latitude }}
        </div>
      </li>

      <li class="flex items-center">
        <h3 class="text-base font-semibold">
        Longitude : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.location?.longitude }}
        </div>
      </li>

      

    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useModifyPanelStore } from '~/stores/modifyPanel'; 

const propertyStore = usePropertyStore();
const panelStore = useModifyPanelStore();

const property = computed(() => propertyStore.$state);
</script>


<style scoped>
/* 기존 스타일 유지 */
.cbre_bulletList {
        list-style: none;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>