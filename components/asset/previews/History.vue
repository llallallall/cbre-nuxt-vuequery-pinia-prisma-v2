<template>
  <div class="bg-white mt-4">

    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>History</span>
      <button @click="panelStore.openPanel('history')" 
              class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <div v-if="property.historyList && property.historyList.length > 0" class="pl-[20px]">
        <table class="table-auto w-full border border-gray-300 text-primary text-sm" >
            <thead>
                <tr class="bg-gray-100 font-semibold">
                    <th class="px-2 py-1 text-left">Year</th>
                    <th class="px-2 py-1 text-left">Type</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(history, index) in property.historyList" :key="index" class="text-left border-t">
                    <td class="px-2 py-1">{{ history.year }}</td>
                    <td class="px-2 py-1">{{ history.type }}</td>

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
import { computed } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useModifyPanelStore } from '~/stores/modifyPanel'; 

const propertyStore = usePropertyStore();
const panelStore = useModifyPanelStore();

const property = computed(() => propertyStore.$state);
</script>