<template>
  <div class="bg-white mt-4">

    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Lease Information</span>
      <button @click="panelStore.openPanel('lease')" 
              class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <div v-if="property.leaseInfo?.leasesActualList && property.leaseInfo.leasesActualList.length > 0">
        <table class="table-auto w-full border border-gray-300">
            <thead>
                <tr class="bg-gray-100 text-sm font-medium">
                    <th class="px-2 py-1 text-left">Tenant</th>
                    <th class="px-2 py-1 text-left">Execution Date</th>
                    <th class="px-2 py-1 text-right">Rent (PY)</th>
                    <th class="px-2 py-1 text-right">NOC</th>
                    <th class="px-2 py-1 text-right">Lease Term (Year)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(lease, index) in property.leaseInfo.leasesActualList" :key="index" class="text-left border-t">
                    <td class="px-2 py-1">{{ lease.tenant || '-' }}</td>
                    <td class="px-2 py-1">{{ lease.executionDate || '-' }}</td>
                    <td class="px-2 py-1 text-right">{{ lease.rentMonthlyPy?.toLocaleString() || '-' }}</td>
                    <td class="px-2 py-1 text-right">{{ lease.noc || '-' }}</td>
                    <td class="px-2 py-1 text-right">{{ lease.leaseTermYear || '-' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else class="text-gray-500 text-sm mt-2 text-center">
        No lease information available.
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