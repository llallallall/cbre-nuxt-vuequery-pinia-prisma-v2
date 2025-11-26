<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Lease Information</span>
      <button @click="openEditPanel"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <div v-if="leases.length > 0">
      <div class="overflow-x-auto">
        <table class="table-auto w-full border border-gray-300 min-w-[1000px]">
          <thead>
            <tr class="bg-gray-100 text-sm font-medium">
              <th class="px-2 py-1 text-left">Execution Date</th>
              <th class="px-2 py-1 text-left">Floor / Unit</th>
              <th class="px-2 py-1 text-left">Tenant</th>
              <th class="px-2 py-1 text-left">Type</th>
              <th class="px-2 py-1 text-right">Term (Y)</th>
              <th class="px-2 py-1 text-left">Period</th>
              <th class="px-2 py-1 text-right">Rent (PY)</th>
              <th class="px-2 py-1 text-right">NOC (PY)</th>
              <th class="px-2 py-1 text-right">Maint. (PY)</th>
              <th class="px-2 py-1 text-right">Deposit (PY)</th>
              <th class="px-2 py-1 text-left">Rent Free</th>
              <th class="px-2 py-1 text-right">Fit Out</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, index) in leases" :key="index" class="text-left border-t text-sm">
              <td class="px-2 py-1 whitespace-nowrap">{{ formatDateForDisplay(t.executionDate) }}</td>
              <td class="px-2 py-1 whitespace-nowrap">{{ displayValue(t.lease?.floor) }} / {{
                displayValue(t.lease?.unit) }}</td>
              <td class="px-2 py-1 truncate max-w-[150px]" :title="t.lease?.tenant || ''">{{
                displayValue(t.lease?.tenant) }}</td>
              <td class="px-2 py-1 whitespace-nowrap">{{ displayValue(t.lease?.leaseType) }}</td>
              <td class="px-2 py-1 text-right">{{ displayValue(t.lease?.leaseTermYear) }}</td>
              <td class="px-2 py-1 whitespace-nowrap text-xs">
                {{ formatDateForDisplay(t.lease?.leaseStartDate) }} ~ <br>
                {{ formatDateForDisplay(t.lease?.leaseEndDate) }}
              </td>
              <td class="px-2 py-1 text-right">{{ formatInt(t.lease?.rentMonthlyPy) }}</td>
              <td class="px-2 py-1 text-right">{{ formatInt(t.lease?.noc) }}</td>
              <td class="px-2 py-1 text-right">{{ formatInt(t.lease?.camfMonthlyPy) }}</td>
              <td class="px-2 py-1 text-right">{{ formatInt(t.lease?.depositPy) }}</td>
              <td class="px-2 py-1 whitespace-nowrap">
                <span v-if="t.lease?.rentFreeMonth">{{ t.lease.rentFreeMonth }} Mo ({{ t.lease.rentFreeType }})</span>
                <span v-else>-</span>
              </td>
              <td class="px-2 py-1 text-right">{{ formatInt(t.lease?.fitOut) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="text-gray-500 text-sm mt-2 text-center">
      No lease information available.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useFormat } from '~/composables/useFormat';

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const { numberFormat, displayValue, formatDateForDisplay } = useFormat();

const { currentProperty: property } = storeToRefs(propertyStore);
const formatInt = (v: any) => numberFormat(v, 0);

const openEditPanel = () => {
  uiStore.openModifyForm(propertyStore.currentPropertyId, 'lease');
};

const leases = computed(() => {
  return property.value?.transaction?.filter(
    (t: any) => t.type === 'LEASE'
  ) || [];
});
</script>