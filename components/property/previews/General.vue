<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>General</span>
      <button @click="openEditPanel"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
      <li v-if="property?.name" class="flex items-center">
        <h3 class="text-base font-semibold">Name :</h3>
        <div class="flex-1 pl-2">{{ property.name }}</div>
      </li>
    </ul>

    <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1">
      <li v-if="property?.sector?.name" class="flex items-center">
        <h3 class="text-base font-semibold">Sector :</h3>
        <div class="flex-1 pl-2">{{ property.sector.name }}</div>
      </li>

      <li v-if="property?.subsector?.name" class="flex items-center">
        <h3 class="text-base font-semibold">Sub Sector :</h3>
        <div class="flex-1 pl-2">{{ property.subsector.name }}</div>
      </li>

      <li class="col-span-full">
        <h3 class="text-base font-semibold mt-4 mb-2">Warehouse Temperature</h3>
        <table class="table-auto w-full border border-gray-300">
          <thead>
            <tr class="bg-gray-100 text-sm font-medium">
              <th class="px-2 py-1">Room</th>
              <th class="px-2 py-1">Low</th>
              <th class="px-2 py-1">Constant</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-right">
              <td class="px-2">{{ getWarehouseRatio('ROOM') }}%</td>
              <td class="px-2">{{ getWarehouseRatio('LOW') }}%</td>
              <td class="px-2">{{ getWarehouseRatio('CONSTANT') }}%</td>
            </tr>
          </tbody>
        </table>
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
  uiStore.openModifyPanel(propertyStore.currentPropertyId, 'general');
};

// 💡 Warehouse 비율 추출 헬퍼 함수
const getWarehouseRatio = (type: string) => {
  const w = property.value?.warehouse?.find((item: any) => item.temperatureType === type);
  return Number(w?.ratio) || 0;
};
</script>

<style scoped>
.cbre_bulletList {
  list-style: none;
  padding: 0 0 0 20px;
  line-height: 2;
}
</style>