<template>
  <div class="bg-white mt-4">
    <div v-if="activeTab === 'sale'">
      <div v-if="saleTransactions.length > 0">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useFormat } from '~/composables/useFormat';

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const { currentProperty: property } = storeToRefs(propertyStore);
const { numberFormat } = useFormat(); // 필요시 사용

// 💡 Sale Transactions
const saleTransactions = computed(() => {
  return property.value?.transaction?.filter(t => t.type === 'SALE' && t.sale) || [];
});

// 💡 Lease Transactions
const leaseTransactions = computed(() => {
  return property.value?.transaction?.filter(t => t.type === 'LEASE' && t.lease) || [];
});

// 💡 Actual / Asking
const leasesActual = computed(() => leaseTransactions.value.filter(t => t.lease?.leaseType === 'ACTUAL'));
const leasesAsking = computed(() => leaseTransactions.value.filter(t => t.lease?.leaseType === 'ASKING'));

const activeTab = ref<'sale' | 'lease'>('sale');
// ... 나머지 헬퍼 함수들 ...
</script>