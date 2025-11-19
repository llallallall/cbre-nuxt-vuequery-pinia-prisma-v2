<template>
        <div class="p-6 space-y-6">
                <div class="flex justify-end mb-4">
                        <button @click="openModal('create')"
                                class="bg-cbre_primary_1 text-white text-sm font-medium py-2 px-4 rounded-[10px] transition duration-150 flex items-center">
                                <span class="mr-1">+</span> Add New Sale Record
                        </button>
                </div>

                <div class="border border-gray-300 rounded-md overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                        <tr class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <th class="px-3 py-2 text-left w-[60px]">Year</th>
                                                <th class="px-3 py-2 text-left w-[60px]">Quarter</th>
                                                <th class="px-3 py-2 text-left w-[80px]">Sale Type</th>
                                                <th class="px-3 py-2 text-left w-3/12">Buyer</th>
                                                <th class="px-3 py-2 text-left w-3/12">Seller</th>
                                                <th class="px-3 py-2 text-center w-[120px]">Action</th>
                                        </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-if="!allSales.length">
                                                <td colspan="6"
                                                        class="px-3 py-4 text-sm text-gray-500 text-center italic">
                                                        No sale records found.
                                                </td>
                                        </tr>
                                        <template v-for="sale in allSales" :key="sale.transactionId!">
                                                <tr @click="toggleDetails(sale.transactionId!)"
                                                        class="cursor-pointer hover:bg-gray-100"
                                                        :class="{ 'bg-gray-50 font-semibold': expandedRowId === sale.transactionId }">

                                                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                                {{ sale.year || '-' }}
                                                        </td>
                                                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                                {{ sale.quarter ? `Q${sale.quarter}` : '-' }}
                                                        </td>
                                                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium"
                                                                :class="sale.saleType === 'ENBLOC' ? 'text-red-600' : 'text-orange-600'">
                                                                {{ sale.saleType }}
                                                        </td>
                                                        <td class="px-3 py-2 text-sm text-gray-500 truncate max-w-xs">
                                                                {{ sale.buyer || '-' }}
                                                        </td>
                                                        <td class="px-3 py-2 text-sm text-gray-500 truncate max-w-xs">
                                                                {{ sale.seller || '-' }}
                                                        </td>
                                                        <td
                                                                class="px-3 py-2 whitespace-nowrap text-sm font-medium text-center">
                                                                <button @click.stop="openModal('edit', sale)"
                                                                        class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                                                                <button @click.stop="deleteSale(sale.transactionId!)"
                                                                        class="text-red-600 hover:text-red-900">Delete</button>
                                                        </td>
                                                </tr>

                                                <tr v-if="expandedRowId === sale.transactionId"
                                                        class="bg-gray-50 border-t border-gray-200">
                                                        <td colspan="6" class="p-0">
                                                                <div class="grid grid-cols-5 gap-4 p-4 text-xs">
                                                                        <div class="col-span-1">
                                                                                <div
                                                                                        class="font-semibold text-gray-700">
                                                                                        Execution Date</div>
                                                                                <div>{{ sale.executionDate ?
                                                                                        formatDate(sale.executionDate) :
                                                                                        '-' }}</div>
                                                                        </div>
                                                                        <div class="col-span-1 text-right">
                                                                                <div
                                                                                        class="font-semibold text-gray-700">
                                                                                        Price (KRW)</div>
                                                                                <div>{{ sale.priceKrw?.toLocaleString()
                                                                                        || '-' }}</div>
                                                                        </div>
                                                                        <div class="col-span-1 text-right">
                                                                                <div
                                                                                        class="font-semibold text-gray-700">
                                                                                        GFA / P/GFA</div>
                                                                                <div>
                                                                                        {{
                                                                                                sale.gfaSqm?.toLocaleString('en-US',
                                                                                                        { maximumFractionDigits: 2 }) ||
                                                                                                '-' }} sqm /
                                                                                        {{
                                                                                                sale.pricePerGfa?.toLocaleString()
                                                                                                || '-' }}
                                                                                </div>
                                                                        </div>
                                                                        <div class="col-span-1 text-right">
                                                                                <div
                                                                                        class="font-semibold text-gray-700">
                                                                                        NFA / P/NFA</div>
                                                                                <div>
                                                                                        {{
                                                                                                sale.nfaSqm?.toLocaleString('en-US',
                                                                                                        { maximumFractionDigits: 2 }) ||
                                                                                                '-' }} sqm /
                                                                                        {{
                                                                                                sale.pricePerNfa?.toLocaleString()
                                                                                                || '-' }}
                                                                                </div>
                                                                        </div>
                                                                        <div class="col-span-1 text-right">
                                                                                <div
                                                                                        class="font-semibold text-gray-700">
                                                                                        Cap Rate (%)</div>
                                                                                <div>{{ sale.estCapRate?.toFixed(2) ||
                                                                                        '-' }}</div>
                                                                        </div>
                                                                        <div v-if="sale.remarks"
                                                                                class="col-span-5 pt-2 border-t mt-2">
                                                                                <div
                                                                                        class="font-semibold text-gray-700">
                                                                                        Remarks</div>
                                                                                <div class="text-gray-600">{{
                                                                                        sale.remarks }}</div>
                                                                        </div>
                                                                </div>
                                                        </td>
                                                </tr>
                                        </template>
                                </tbody>
                        </table>
                </div>
                <SaleDetailModal :isOpen="isModalOpen" :saleData="selectedSale" @close="closeModal"
                        @save="handleSave" />

                <ConfirmModal :isOpen="isConfirmModalOpen" title="Delete Sale Record"
                        message="Are you sure you want to permanently delete this sale record?"
                        @confirm="handleConfirmDelete" @cancel="closeConfirmModal" />

        </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app';
import { createToast } from 'mosha-vue-toastify';
import type { SaleDetailType, SaleCreatePayload, TransactionInfoType } from '~/types/asset.type';
import SaleDetailModal from '@/components/modal/SaleDetailModal.vue';
// 🚨 [추가] ConfirmModal 임포트 (경로는 Photo.vue와 동일하다고 가정)
import ConfirmModal from '@/components/modal/ConfirmModal.vue';

const propertyStore = usePropertyStore();
const appStore = useAppStore();

// Pinia Store에서 Sale 리스트 가져오기
const allTransactions = computed(() => propertyStore.$state.transactionInfo?.transactionsList || []);

const allSales = computed<SaleDetailType[]>(() => {
        return allTransactions.value
                .filter(t => t.type === 'SALE' && t.saleDetail)
                .map(t => ({
                        ...t.saleDetail!,
                        transactionId: t.id, // transactionId 보장
                        year: t.year,
                        quarter: t.quarter,
                        executionDate: t.date,
                })) as SaleDetailType[];
});

const formatDate = (date: Date | string): string => {
        if (typeof date === 'string') return date.substring(0, 10);
        return date.toISOString().split('T')[0];
};


const isModalOpen = ref(false);
const selectedSale = ref<SaleDetailType | null>(null);

// 🚨 [추가] ConfirmModal 상태 관리
const isConfirmModalOpen = ref(false);
const transactionIdToDelete = ref<string | null>(null);

// 상세 행 토글을 위한 상태 및 함수
const expandedRowId = ref<string | null>(null);

const toggleDetails = (transactionId: string) => {
        // 이미 확장되어 있으면 닫고, 아니면 해당 ID로 확장
        expandedRowId.value = expandedRowId.value === transactionId ? null : transactionId;
};


// SaleDetailModal 열기/닫기 로직
const openModal = (mode: 'create' | 'edit', sale?: SaleDetailType) => {
        selectedSale.value = mode === 'edit' && sale ? sale : null;
        isModalOpen.value = true;
};

const closeModal = () => {
        isModalOpen.value = false;
        selectedSale.value = null;
};

// 🚨 [추가] ConfirmModal 닫기 로직
const closeConfirmModal = () => {
        isConfirmModalOpen.value = false;
        transactionIdToDelete.value = null; // ID 초기화
};


// API Save 핸들러 (기존과 동일)
const handleSave = async (payload: SaleCreatePayload & { transactionId?: string }) => {
        const isUpdate = !!payload.transactionId;
        const propertyId = propertyStore.$state.propertyId;

        if (!propertyId) return;

        const url = isUpdate
                ? `/api/upload/${propertyId}/sale/${payload.transactionId}` // PUT (수정)
                : `/api/upload/${propertyId}/sale`;                       // POST (생성)

        const method = isUpdate ? 'PUT' : 'POST';

        try {
                appStore.setLoading(true);
                const updatedRecord = await $fetch<TransactionInfoType>(url, { method, body: payload });

                const transactionsList = propertyStore.$state.transactionInfo?.transactionsList;

                if (transactionsList) {
                        if (isUpdate) {
                                const index = transactionsList.findIndex(s => s.id === updatedRecord.id);
                                if (index !== -1) {
                                        transactionsList[index] = updatedRecord; // 💡 transactionInfo 업데이트 (정상)
                                }
                        } else {
                                transactionsList.unshift(updatedRecord); // 💡 transactionInfo 업데이트 (정상)
                        }
                }

                //console.log('Sale record saved successfully:', updatedRecord);
                createToast({
                        title: 'Sale record saved successfully.',
                        // description: 'If you want to delete image click X mark'
                }, {
                        type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                        timeout: 5000,
                        showCloseButton: true,
                        position: 'top-right',
                        transition: 'bounce',
                        hideProgressBar: false,
                        swipeClose: true,
                })
                closeModal();
        } catch (error) {
                //console.error('Sale save failed:', error);
                createToast({
                        title: 'Sale save failed:',
                        description: `${error}`
                }, {
                        type: 'danger', // 'info', 'danger', 'warning', 'success', 'default'
                        timeout: 5000,
                        showCloseButton: true,
                        position: 'top-right',
                        transition: 'bounce',
                        hideProgressBar: false,
                        swipeClose: true,
                })
        } finally {
                appStore.setLoading(false);
        }
};

// 🚨 [수정] deleteSale: ConfirmModal을 열고 삭제할 ID를 저장
const deleteSale = (transactionId: string) => {
        transactionIdToDelete.value = transactionId;
        isConfirmModalOpen.value = true;
};

// 🚨 [추가] handleConfirmDelete: ConfirmModal에서 '확인' 시 실제 삭제 API 호출
const handleConfirmDelete = async () => {
        const transactionId = transactionIdToDelete.value;
        closeConfirmModal(); // 모달을 먼저 닫습니다.

        if (!transactionId) return;

        const propertyId = propertyStore.$state.propertyId;
        if (!propertyId) return;

        try {
                appStore.setLoading(true);
                // API 호출: DELETE
                await $fetch(`/api/upload/${propertyId}/sale/${transactionId}`, {
                        method: 'DELETE',
                });

                // Pinia Store 업데이트 로직
                const transactionsList = propertyStore.$state.transactionInfo?.transactionsList;
                if (transactionsList) {
                        propertyStore.$state.transactionInfo!.transactionsList = transactionsList.filter(t => t.id !== transactionId);
                }

                //console.log(`Sale transaction ${transactionId} deleted successfully.`);
                createToast({
                        title: `Sale transaction ${transactionId} deleted successfully.`,
                        // description: 'If you want to delete image click X mark'
                }, {
                        type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                        timeout: 5000,
                        showCloseButton: true,
                        position: 'top-right',
                        transition: 'bounce',
                        hideProgressBar: false,
                        swipeClose: true,
                })
        } catch (error) {
                //console.error('Sale deletion failed:', error);
                createToast({
                        title: 'Sale deletion failed:',
                        description: `${error}`
                }, {
                        type: 'danger', // 'info', 'danger', 'warning', 'success', 'default'
                        timeout: 5000,
                        showCloseButton: true,
                        position: 'top-right',
                        transition: 'bounce',
                        hideProgressBar: false,
                        swipeClose: true,
                })
        } finally {
                appStore.setLoading(false);
        }
};
</script>