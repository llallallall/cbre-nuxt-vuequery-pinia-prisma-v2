<template>
        <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-primary">Lease Transactions</h3>
                        <button @click="openModal('create')"
                                class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150">
                                Add Lease
                        </button>
                </div>

                <div class="overflow-x-auto border border-gray-200 rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50 font-financierMedium text-primary text-base">
                                        <tr>
                                                <th class="px-3 py-2 text-left">Execution Date</th>
                                                <th class="px-3 py-2 text-left">Floor / Unit</th>
                                                <th class="px-3 py-2 text-left">Type</th>
                                                <th class="px-3 py-2 text-left">Term</th>
                                                <th class="px-3 py-2 text-left">Start Date</th>
                                                <th class="px-3 py-2 text-left">End Date</th>
                                                <th class="px-3 py-2 text-center">Action</th>
                                        </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200 font-calibreLight text-lg text-primary">
                                        <tr v-for="t in leaseTransactions" :key="t.id">
                                                <td class="px-3 py-2 text-sm text-gray-900">{{
                                                        formatDateForDisplay(t.executionDate) }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-500">{{
                                                        displayValue(t.lease?.floor) }} / {{ displayValue(t.lease?.unit)
                                                        }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-900">{{
                                                        displayValue(t.lease?.leaseType) }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-900">{{
                                                        displayValue(t.lease?.leaseTermYear) }} Years</td>
                                                <td class="px-3 py-2 text-sm text-gray-500">{{
                                                        formatDateForDisplay(t.lease?.leaseStartDate) }}</td>
                                                <td class="px-3 py-2 text-sm text-gray-500">{{
                                                        formatDateForDisplay(t.lease?.leaseEndDate) }}</td>
                                                <td class="px-3 py-2 text-sm text-center">
                                                        <button @click="openModal('edit', t)"
                                                                class="text-cbre_primary_1 hover:text-cbre_primary_2 mr-3 font-medium">Edit</button>
                                                        <button @click="confirmDelete(t.id)"
                                                                class="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                                </td>
                                        </tr>
                                        <tr v-if="leaseTransactions.length === 0">
                                                <td colspan="7" class="px-3 py-4 text-center text-sm text-gray-500">No
                                                        lease records found.</td>
                                        </tr>
                                </tbody>
                        </table>
                </div>

                <LeaseDetailModal :isOpen="isModalOpen" :mode="modalMode" :leaseData="selectedLeaseData"
                        @save="handleSave" @close="closeModal" />
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
import LeaseDetailModal from '@/components/modal/LeaseDetailModal.vue';
import { ModalsContainer } from 'vue-final-modal';
import type { TransactionType, LeaseType } from '~/types/property.type';

const { formatDateForDisplay, displayValue } = useFormat();
const { showToast } = useToast();
const { show: openConfirmModal } = useConfirmModal();

const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);

const isModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const selectedLeaseData = ref<LeaseType | null>(null); // 모달에 전달할 데이터

// Lease 목록 필터링
const leaseTransactions = computed(() => {
        return currentProperty.value?.transaction?.filter(t => t.type === 'LEASE') || [];
});

// openModal 함수 수정
const openModal = (mode: 'create' | 'edit', transaction?: TransactionType) => {
        isModalOpen.value = true;
        modalMode.value = mode;

        if (mode === 'edit' && transaction && transaction.lease) {
                // 💡 [수정] Transaction의 날짜 정보를 Lease 데이터에 병합하여 전달
                selectedLeaseData.value = {
                        ...transaction.lease,
                        // Transaction 레벨의 정보 주입
                        executionDate: transaction.executionDate,
                        year: transaction.year,
                        quarter: transaction.quarter,
                } as any; // LeaseType에는 없는 필드이므로 any 캐스팅 필요
        } else {
                selectedLeaseData.value = null;
        }
};

const closeModal = () => {
        isModalOpen.value = false;
        selectedLeaseData.value = null;
};

// 저장 핸들러
const handleSave = async (payload: any) => {
        statusStore.setGlobalLoading(true);
        try {
                const propertyId = propertyStore.currentPropertyId;
                const body = {
                        ...payload,
                        type: 'LEASE',
                        propertyId
                };

                if (payload.transactionId) {
                        // Update: PUT /api/property/admin/[id]/lease/[transactionId]
                        await $fetch(`/api/property/admin/${propertyId}/lease/${payload.transactionId}`, {
                                method: 'PUT' as any,
                                body
                        });
                } else {
                        // Create: POST /api/property/admin/[id]/lease
                        await $fetch(`/api/property/admin/${propertyId}/lease`, {
                                method: 'POST' as any,
                                body
                        });
                }

                showToast('Lease record saved.', 'success');
                closeModal();
                // 데이터 리로드
                await propertyStore.fetchPropertyDetail(propertyStore.currentPropertyId);

        } catch (error) {
                console.error(error);
                showToast('Failed to save lease record.', 'danger');
        } finally {
                statusStore.setGlobalLoading(false);
        }
};

// 삭제 핸들러
const confirmDelete = async (id: string) => {
        const confirmed = await openConfirmModal({
                title: 'Delete Lease',
                message: 'Are you sure you want to delete this lease record?',
                confirmText: 'Delete'
        });

        if (!confirmed) return;

        statusStore.setGlobalLoading(true);
        try {
                // API 호출
                const propertyId = propertyStore.currentPropertyId;
                await $fetch(`/api/property/admin/${propertyId}/lease/${id}`, { method: 'DELETE' });

                // Store 갱신 (리로드)
                await propertyStore.fetchPropertyDetail(propertyStore.currentPropertyId);
                showToast('Lease record deleted.', 'success');
        } catch (error) {
                showToast('Failed to delete.', 'danger');
        } finally {
                statusStore.setGlobalLoading(false);
        }
};
</script>