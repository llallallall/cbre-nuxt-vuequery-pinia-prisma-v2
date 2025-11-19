<template>
  <div class="bg-white mt-4">

    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Transaction Information ({{ property.transactionInfo?.totalTransactions ?? 0 }})</span>
      <!-- <button @click="panelStore.openPanel('transaction')"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button> -->

      <div class="flex justify-end mb-3 space-x-3">
        <button @click="panelStore.openPanel('sale')"
          class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
          Edit - Sale
        </button>

        <button @click="panelStore.openPanel('lease')"
          class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
          Edit - Lease
        </button>
      </div>
    </div>

    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button @click="activeTab = 'sale'" :class="[
          activeTab === 'sale'
            ? 'border-cbre_primary_1 text-cbre_primary_1'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
          'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150'
        ]">
          Sale ({{ saleTransactions.length }})
        </button>
        <button @click="activeTab = 'lease'" :class="[
          activeTab === 'lease'
            ? 'border-cbre_primary_1 text-cbre_primary_1'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
          'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150'
        ]">
          Lease ({{ leaseTransactions.length }})
        </button>
      </nav>
    </div>

    <div class="pt-4">

      <div v-if="activeTab === 'sale'">

        <div v-if="saleTransactions && saleTransactions.length > 0">
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead>
                <tr class="bg-gray-100 text-sm font-medium whitespace-nowrap text-primary ">
                  <th class="px-2 py-1 text-left">Year / Quarter</th>
                  <th class="px-2 py-1 text-left">Date</th>
                  <th class="px-2 py-1 text-left">Sale Type</th>
                  <th class="px-2 py-1 text-right">GFA<span class="text-xs font-light">(㎡)</span></th>
                  <th class="px-2 py-1 text-right">NFA<span class="text-xs font-light">(㎡)</span></th>
                  <th class="px-2 py-1 text-right">Price<br><span class="text-xs font-light">(KRW)</span></th>
                  <th class="px-2 py-1 text-right">Price/GFA<br><span class="text-xs font-light">(KRW/㎡)</span></th>
                  <th class="px-2 py-1 text-right">Price/NFA<br><span class="text-xs font-light">(KRW/㎡)</span></th>
                  <th class="px-2 py-1 text-right">Cap Rate<br><span class="text-xs font-light">(%)</span></th>
                  <th class="px-2 py-1 text-right">Disc. Rate<br><span class="text-xs font-light">(%)</span></th>
                  <th class="px-2 py-1 text-left">Buyer</th>
                  <th class="px-2 py-1 text-left">Seller</th>
                  <th class="px-2 py-1 text-left min-w-[12rem]">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(t, index) in saleTransactions" :key="index"
                  class="text-left border-t whitespace-nowrap text-sm font-normal text-primary ">
                  <td class="px-2 py-1">{{ t.year }} / Q{{ t.quarter || '-' }}</td>
                  <td class="px-2 py-1">{{ t.saleDetail?.executionDate || '-' }}</td>
                  <td class="px-2 py-1">{{ t.saleDetail?.saleType || '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.saleDetail?.gfaSqm?.toLocaleString() || '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.saleDetail?.nfaSqm?.toLocaleString() || '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.saleDetail?.priceKrw?.toLocaleString() || '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.saleDetail?.pricePerGfa?.toLocaleString() || '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.saleDetail?.pricePerNfa?.toLocaleString() || '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.saleDetail?.estCapRate ? `${t.saleDetail.estCapRate}%` : '-' }}
                  </td>
                  <td class="px-2 py-1 text-right">{{ t.saleDetail?.estDiscountRate ? `${t.saleDetail.estDiscountRate}%`
                    : '-' }}</td>
                  <td class="px-2 py-1">{{ t.saleDetail?.buyer || '-' }}</td>
                  <td class="px-2 py-1">{{ t.saleDetail?.seller || '-' }}</td>
                  <td class="px-2 py-1 text-left min-w-[12rem] whitespace-normal break-words">
                    <template v-if="t.saleDetail?.remarks">
                      <span v-if="t.saleDetail.remarks.length > REMARKS_TRUNCATE_LENGTH" @click="toggleRemark(t.id)"
                        class="cursor-pointer hover:text-cbre_primary_1" :class="{ 'font-medium': isExpanded(t.id) }">
                        <template v-if="!isExpanded(t.id)">
                          {{ t.saleDetail.remarks.substring(0, REMARKS_TRUNCATE_LENGTH) }}...
                          <span class="text-xs text-gray-500 ml-1">[...more]</span>
                        </template>
                        <template v-else>
                          {{ t.saleDetail.remarks }}
                          <span class="text-xs text-gray-500 ml-1">[hide]</span>
                        </template>
                      </span>

                      <span v-else>
                        {{ t.saleDetail.remarks }}
                      </span>
                    </template>
                    <template v-else>
                      -
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm mt-2 text-center italic">
          No Sale transaction information available.
        </div>
      </div>

      <div v-if="activeTab === 'lease'">

        <div v-if="leaseTransactions.length > 0">

          <div v-if="leasesActual.length > 0">
            <h4 class="text-md font-semibold mb-2">Actual Lease (실거래)</h4>

            <table class="table-auto w-full border border-gray-300">
              <thead>
                <tr class="bg-gray-100 text-sm font-medium">
                  <th class="px-2 py-1 text-left">Floor / Unit</th>
                  <th class="px-2 py-1 text-left">Execution Date</th>
                  <th class="px-2 py-1 text-right">Rent (KRW/PY)</th>
                  <th class="px-2 py-1 text-right">Deposit (KRW/PY)</th>
                  <th class="px-2 py-1 text-right">NOC (%)</th>
                  <th class="px-2 py-1 text-right">Lease Term (Y)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(t, index) in leasesActual" :key="index" class="text-left border-t">
                  <td class="px-2 py-1">{{ t.leaseDetail?.floor || '-' }} / {{ t.leaseDetail?.unit || '-' }}</td>
                  <td class="px-2 py-1">{{ t.leaseDetail?.executionDate ? formatDate(t.leaseDetail.executionDate) : '-'
                  }}</td>
                  <td class="px-2 py-1 text-right">{{ t.leaseDetail?.rentMonthlyPy?.toLocaleString() || '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.leaseDetail?.depositPy?.toLocaleString() || '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.leaseDetail?.noc ? `${t.leaseDetail.noc}%` : '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.leaseDetail?.leaseTermYear || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="leasesAsking.length > 0" class="mt-6">
            <h4 class="text-md font-semibold mb-2">Asking Lease (호가)</h4>
            <table class="table-auto w-full border border-gray-300">
              <thead>
                <tr class="bg-gray-100 text-sm font-medium">
                  <th class="px-2 py-1 text-left">Floor / Unit</th>
                  <th class="px-2 py-1 text-left">Execution Date</th>
                  <th class="px-2 py-1 text-right">Rent (KRW/PY)</th>
                  <th class="px-2 py-1 text-right">Deposit (KRW/PY)</th>
                  <th class="px-2 py-1 text-right">NOC (%)</th>
                  <th class="px-2 py-1 text-right">Lease Term (Y)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(t, index) in leasesAsking" :key="index" class="text-left border-t">
                  <td class="px-2 py-1">{{ t.leaseDetail?.floor || '-' }} / {{ t.leaseDetail?.unit || '-' }}</td>
                  <td class="px-2 py-1">{{ t.leaseDetail?.executionDate ? formatDate(t.leaseDetail.executionDate) : '-'
                  }}</td>
                  <td class="px-2 py-1 text-right">{{ t.leaseDetail?.rentMonthlyPy?.toLocaleString() || '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.leaseDetail?.depositPy?.toLocaleString() || '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.leaseDetail?.noc ? `${t.leaseDetail.noc}%` : '-' }}</td>
                  <td class="px-2 py-1 text-right">{{ t.leaseDetail?.leaseTermYear || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
        <div v-else class="text-gray-500 text-sm mt-2 text-center italic">
          No Lease transaction information available.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useModifyPanelStore } from '~/stores/modifyPanel';
import type { SaleDetailType } from '~/types/asset.type'; // 필요한 타입 임포트

const propertyStore = usePropertyStore();
const panelStore = useModifyPanelStore();

const property = computed(() => propertyStore.$state);

// ⭐ [추가]: Remarks 확장 상태를 저장하는 Set (Transaction ID 사용)
// Set은 확장된 레코드의 ID만 저장합니다.
const expandedRemarks = ref(new Set<string>());

// ⭐ [추가]: 텍스트를 자를 기준 길이 설정 (10글자)
const REMARKS_TRUNCATE_LENGTH = 10;

// ⭐ [추가]: Remarks의 확장/축소 상태를 토글하는 함수
const toggleRemark = (transactionId: string) => {
  if (expandedRemarks.value.has(transactionId)) {
    expandedRemarks.value.delete(transactionId);
  } else {
    expandedRemarks.value.add(transactionId);
  }
};

// ⭐ [추가]: 특정 Remark가 확장되었는지 확인하는 헬퍼 함수
const isExpanded = (transactionId: string): boolean => {
  return expandedRemarks.value.has(transactionId);
};

// SALE 타입 트랜잭션 목록 Computed Property
const saleTransactions = computed(() => {
  // 1. Store의 transactionInfo.transactionsList에서 전체 목록을 가져옵니다.
  const allTransactions = property.value.transactionInfo?.transactionsList || [];

  // 2. type이 'SALE'인 트랜잭션만 필터링하여 반환합니다.
  return allTransactions.filter(t => t.type === 'SALE');
});

// LEASE 탭
const leaseTransactions = computed(() => {
  const allTransactions = property.value.transactionInfo?.transactionsList || [];
  // 🚨 [필수] type이 'LEASE'인 트랜잭션만 필터링
  return allTransactions.filter(t => t.type === 'LEASE');
});

// 🚨 [추가] Lease 트랜잭션을 Actual과 Asking으로 분리
const leasesActual = computed(() => {
  // leaseDetail.leaseType이 'ACTUAL'인 트랜잭션만 필터링
  return leaseTransactions.value.filter(t => t.leaseDetail?.leaseType === 'ACTUAL');
});

const leasesAsking = computed(() => {
  // leaseDetail.leaseType이 'ASKING'인 트랜잭션만 필터링
  return leaseTransactions.value.filter(t => t.leaseDetail?.leaseType === 'ASKING');
});

// ⭐ 탭 상태 관리 (초기값: sale)
const activeTab = ref<'sale' | 'lease'>('sale');

// ************** Helper Functions **************

// Lease executionDate를 포맷팅하는 헬퍼 함수
const formatDate = (date: Date): string => {
  // 실제 프로젝트에서 사용할 날짜 포맷 함수 (예: 'YYYY-MM-DD' 또는 'YYYY. Qn') 적용
  if (!(date instanceof Date) || isNaN(date.getTime())) return '-';
  return date.toISOString().split('T')[0];
};

// SaleDetailType에서 year/quarter 정보를 찾기 위한 헬퍼 함수
// *주의: SaleDetailType에는 year/quarter가 없으므로 TransactionInfoType을 탐색해야 합니다.
const getTransactionYearAndQuarter = (saleTransactionId: string | null): string => {
  if (!saleTransactionId || !property.value.transactionInfo?.transactionsList) return '-';

  const transaction = property.value.transactionInfo.transactionsList.find(
    t => t.id === saleTransactionId && t.type === 'SALE'
  );

  // TransactionInfoType의 year와 date를 사용하여 포맷팅
  if (transaction) {
    // year와 date를 조합하여 표시
    const year = transaction.year;
    const quarter = transaction.date ? `Q${Math.floor((transaction.date.getMonth() / 3) + 1)}` : '';
    return `${year} ${quarter}`.trim();
  }
  return '-';
}

</script>

<style scoped>
/* 기본적인 스타일은 기존 프로젝트 CSS를 따릅니다. */
</style>