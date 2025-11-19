<template>
        <div class="p-6 space-y-6">
                <div class="flex justify-end mb-4">
                        <button @click="openModal('create')"
                                class="bg-cbre_primary_1 text-white text-sm font-medium py-2 px-4 rounded-[10px] flex items-center">
                                <span class="mr-1">+</span> Add New Sale Record
                        </button>
                </div>

                <div class="border border-gray-300 rounded-md overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                        <tr class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <th class="px-3 py-2 text-left">Year/Q</th>
                                                <th class="px-3 py-2 text-left">Type</th>
                                                <th class="px-3 py-2 text-left">Buyer</th>
                                                <th class="px-3 py-2 text-left">Seller</th>
                                                <th class="px-3 py-2 text-right">Price (KRW)</th>
                                                <th class="px-3 py-2 text-center">Action</th>
                                        </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="t in saleTransactions" :key="t.id" class="hover:bg-gray-50">
                                                <td class="px-3 py-2 text-sm text-gray-900">{{ t.year }} / {{ t.quarter
                                                        || '-' }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-900">{{
                                                        displayValue(t.sale?.saleType) }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-500 truncate max-w-[150px]">{{
                                                        displayValue(t.sale?.buyer) }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-500 truncate max-w-[150px]">{{
                                                        displayValue(t.sale?.seller) }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-900 text-right">{{
                                                        formatNumber(t.sale?.priceKrw) }}</td>
                                                <td class="px-3 py-2 text-sm text-center">
                                                        <button @click="openModal('edit', t)"
                                                                class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                                                        <button @click="confirmDelete(t.id)"
                                                                class="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                        </tr>
                                        <tr v-if="saleTransactions.length === 0">
                                                <td colspan="6" class="px-3 py-4 text-center text-sm text-gray-500">No
                                                        sale records found.</td>
                                        </tr>
                                </tbody>
                        </table>
                </div>

                <SaleDetailModal :isOpen="isModalOpen" :saleData="selectedSaleData" @close="closeModal"
                        @save="handleSave" />
                <ModalsContainer />
        </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useFormat } from '~/composables/useFormat';
import { useToast } from '~/composables/useToast';
import { useConfirmModal } from '~/composables/useConfirmModal';
import SaleDetailModal from '@/components/modal/SaleDetailModal.vue';
import { ModalsContainer } from 'vue-final-modal';
import type { TransactionType, SaleType } from '~/types/property.type';

const { displayValue, numberFormat } = useFormat();
const { showToast } = useToast();
const { show: openConfirmModal } = useConfirmModal();
const formatNumber = (val: any) => numberFormat(val, 0);

const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);

const isModalOpen = ref(false);
const selectedSaleData = ref<SaleType | null>(null);

const saleTransactions = computed(() => {
        return currentProperty.value?.transaction?.filter(t => t.type === 'SALE') || [];
});

const openModal = (mode: 'create' | 'edit', transaction?: TransactionType) => {
        selectedSaleData.value = (mode === 'edit' && transaction?.sale) ? transaction.sale : null;
        isModalOpen.value = true;
};

const closeModal = () => {
        isModalOpen.value = false;
        selectedSaleData.value = null;
};

const handleSave = async (payload: any) => {
        statusStore.setGlobalLoading(true);
        try {
                // API 호출 (예시)
                // await propertyStore.saveTransaction(payload);
                showToast('Sale record saved.', 'success');
                closeModal();
                await propertyStore.fetchPropertyDetail(propertyStore.currentPropertyId);
        } catch (error) {
                showToast('Failed to save.', 'danger');
        } finally {
                statusStore.setGlobalLoading(false);
        }
};

const confirmDelete = async (id: string) => {
        const confirmed = await openConfirmModal({
                title: 'Delete Sale',
                message: 'Delete this sale record?',
                confirmText: 'Delete'
        });
        if (!confirmed) return;

        statusStore.setGlobalLoading(true);
        try {
                await $fetch(`/api/property/transaction/${id}`, { method: 'DELETE' });
                await propertyStore.fetchPropertyDetail(propertyStore.currentPropertyId);
                showToast('Deleted.', 'success');
        } catch (e) {
                showToast('Failed to delete.', 'danger');
        } finally {
                statusStore.setGlobalLoading(false);
        }
};
</script>