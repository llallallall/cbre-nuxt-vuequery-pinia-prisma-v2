<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Lease Information</span>
      <button @click="openEditPanel"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <div v-if="leasesActual.length > 0">
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
          <tr v-for="(t, index) in leasesActual" :key="index" class="text-left border-t">
            <td class="px-2 py-1">-</td>
            <td class="px-2 py-1">{{ t.executionDate ? formatDate(t.executionDate) : '-' }}</td>
            <td class="px-2 py-1 text-right">{{ formatInt(t.lease?.rentMonthlyPy) }}</td>
            <td class="px-2 py-1 text-right">{{ t.lease?.noc || '-' }}</td>
            <td class="px-2 py-1 text-right">{{ t.lease?.leaseTermYear || '-' }}</td>
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
  uiStore.openModifyPanel(propertyStore.currentPropertyId, 'lease');
};

// 💡 Lease Actual 필터링
const leasesActual = computed(() => {
  return property.value?.transaction?.filter(
    (t: any) => t.type === 'LEASE' && t.lease?.leaseType === 'ACTUAL'
  ) || [];
});

const formatDate = (dateInput: Date | string): string => {
  if (!dateInput) return '-';

  // 입력이 Date 객체인 경우
  if (dateInput instanceof Date) {
    return dateInput.toISOString().split('T')[0];
  }

  // 입력이 문자열인 경우
  return new Date(dateInput).toISOString().split('T')[0];
};
</script>