<template>
  <div class="bg-white mt-4">

    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>General</span>
      <button @click="panelStore.openPanel('general')" 
              class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <ul 
      class="relative cbre_bulletList font-calibreLight text-lg text-primary grid  grid-cols-1" 
    >

      <li v-if="property.propertyName" class="flex items-center ">
        <h3 class="text-base font-semibold">
        Name : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.propertyName }}
        </div>
      </li>
      </ul>
          <ul 
      class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1" 
    >
      <li v-if="property.general?.sector?.name" class="flex items-center">
        <h3 class="text-base font-semibold">
        Sector : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.general.sector.name }}
        </div>
      </li>

      <li v-if="property.general?.subSector?.name" class="flex items-center">
        <h3 class="text-base font-semibold">
        Sub Sector : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.general.subSector.name }}
        </div>
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
              <td class="px-2"> {{ Number(property.general?.warehouse?.room) || 0 }}%</td>
              <td class="px-2"> {{ Number(property.general?.warehouse?.low) || 0 }}%</td>
              <td class="px-2"> {{ Number(property.general?.warehouse?.constant) || 0 }}%</td>
            </tr>
          </tbody>
        </table>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePropertyStore } from '~/stores/property';

// 이전 단계에서 정의한 패널 상태 관리 스토어
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