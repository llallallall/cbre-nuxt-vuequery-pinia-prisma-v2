<template>
        <div class="p-6 space-y-6">
                <div class="flex justify-end mb-4">
                        <button @click="openModal('create')"
                                class="bg-cbre_primary_1 text-white text-sm font-medium py-2 px-4 rounded-[10px] transition duration-150 flex items-center">
                                <span class="mr-1">+</span> Add New Lease Record
                        </button>
                </div>

                <div class="border border-gray-300 rounded-md overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                        <tr class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <th class="px-3 py-2 text-left w-[100px]">Execution Date</th>
                                                <th class="px-3 py-2 text-left w-[50px]">Floor</th>
                                                <th class="px-3 py-2 text-left w-[50px]">Unit</th>
                                                <th class="px-3 py-2 text-left w-[80px]">Lease Type</th>
                                                <th class="px-3 py-2 text-left w-[80px]">Lease Term</th>
                                                <th class="px-3 py-2 text-left w-[120px]">Lease Start Date</th>
                                                <th class="px-3 py-2 text-left w-[120px]">Lease End Date</th>
                                                <th class="px-3 py-2 text-center w-[120px]">Action</th>
                                        </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="t in leaseTransactions" :key="t.id">
                                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                                        {{ formatDateForDisplay(t.executionDate) }}
                                                </td>
                                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                        {{ displayValue(t.leaseDetail?.floor) }}
                                                </td>
                                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                        {{ displayValue(t.leaseDetail?.unit) }}
                                                </td>
                                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                                        {{ displayValue(t.leaseDetail?.leaseType) }}
                                                </td>
                                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                                        {{ displayValue(t.leaseDetail?.leaseTermYear) }} {{
                                                                t.leaseDetail?.leaseTermYear ? 'Years' : '' }}
                                                </td>
                                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                        {{ formatDateForDisplay(t.leaseDetail?.leaseStartDate) }}
                                                </td>
                                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                        {{ formatDateForDisplay(t.leaseDetail?.leaseEndDate) }}
                                                </td>
                                                <td class="px-3 py-2 whitespace-nowrap text-sm text-center">
                                                        <button @click="openModal('edit', t)"
                                                                class="text-cbre_primary_1 hover:text-cbre_primary_2 mr-3">
                                                                Edit
                                                        </button>
                                                        <button @click="confirmDelete(t.id)"
                                                                class="text-red-600 hover:text-red-900">
                                                                Delete
                                                        </button>
                                                </td>
                                        </tr>
                                        <tr v-if="leaseTransactions.length === 0">
                                                <td colspan="8" class="px-3 py-4 text-center text-sm text-gray-500">
                                                        No lease records found.
                                                </td>
                                        </tr>
                                </tbody>
                        </table>
                </div>

                <LeaseDetailModal :isOpen="isModalOpen" :mode="modalMode" :leaseData="selectedLeaseData"
                        @save="handleSave" @close="closeModal" />
        </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useFormat } from '~/composables/useFormat'; // ⭐ useFormat 컴포저블 임포트
import LeaseDetailModal from '@/components/modal/LeaseDetailModal.vue';
import { mapApiToClient } from '~/composables/useMapper';
import type { ApiTransactionResponse } from '~/composables/useMapper'; // 💡 API 응답 타입도 임포트
import type { TransactionInfoType, LeaseDetailType } from '~/types/asset.type';
import { useToast } from '~/composables/useToast';

// ⭐ useFormat 컴포저블 사용 및 필요한 함수 디스트럭처링
// (useFormat.ts에 formatDateForDisplay와 displayValue가 추가되었다고 가정)
const { formatDateForDisplay, displayValue } = useFormat();

// --- Pinia Store 및 유틸리티 초기화 ---
const propertyStore = usePropertyStore();
const appStore = useAppStore();
const statusStore = useStatusStore();
const { propertyId, transactionInfo } = storeToRefs(propertyStore);
const { showToast } = useToast();

// 1. 모달 상태 변수 정의
const isModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const selectedLeaseData = ref<LeaseDetailType | null>(null);

// --- Computed: Lease 거래 목록 필터링 ---
const leaseTransactions = computed(() => {
        if (!transactionInfo.value?.transactionsList) return [];
        return transactionInfo.value.transactionsList.filter((t: TransactionInfoType) => t.type === 'LEASE');
});

// --- Modal Functions (openModal, closeModal) ---
/**
 * 임대 기록 모달 열기
 * @param mode 모드 ('create' 또는 'edit')
 * @param transaction (Edit 시) 편집할 TransactionInfoType 전체 객체
 */
const openModal = (mode: 'create' | 'edit', transaction?: TransactionInfoType) => {
        isModalOpen.value = true;
        modalMode.value = mode;

        if (mode === 'edit' && transaction) {
                // 💡 [수정] TransactionInfoType에서 leaseDetail만 추출하여 할당합니다.
                // 모달은 LeaseDetailType만 받도록 정의했기 때문에 이렇게 처리해야 타입 오류가 해결됩니다.
                selectedLeaseData.value = transaction.leaseDetail ?? null;
        } else {
                selectedLeaseData.value = null; // 신규 생성 모드
        }
};

const closeModal = () => {
        isModalOpen.value = false;
        selectedLeaseData.value = null;
};



// --- CRUD Actions (handleSave, confirmDelete, updateLeaseTransactionInStore) ---

// 1. 저장 (생성/수정) 처리
const handleSave = async (payload: any) => {
        appStore.setLoading(true);

        try {
                const method = payload.transactionId ? 'PUT' : 'POST';

                const url = payload.transactionId
                        ? `/api/upload/${propertyStore.propertyId}/lease/${payload.transactionId}`
                        : `/api/upload/${propertyStore.propertyId}/lease`;

                // 서버 응답은 ApiTransactionResponse 타입
                const apiResponse = await $fetch<ApiTransactionResponse>(url, {
                        method: method,
                        body: payload,
                });

                // 💡 API 응답을 클라이언트 타입 (TransactionInfoType)으로 변환
                const mappedPayload: TransactionInfoType = mapApiToClient(apiResponse);

                // 2. Pinia Store 갱신
                // 변환된 mappedPayload를 전달하여 store 업데이트
                updateLeaseTransactionInStore(mappedPayload, method);

                showToast(`Lease transaction ${modalMode.value === 'edit' ? 'updated' : 'created'} successfully.`, 'success');

                closeModal();

        } catch (error) {
                // console.error('Lease save failed:', error); 
                createToast({
                        title: `Lease save failed:`,
                        description: `${error}`
                }, { type: 'danger' });
        } finally {
                appStore.setLoading(false);
        }
};


// 2. 삭제 처리
const confirmDelete = async (transactionId: string) => {

        statusStore.openConfirmModal('Are you sure you want to delete this asset?', (confirmed: boolean) => {
                if (!confirmed) {
                        console.log('User cancelled deletion.');
                        return;
                }
        });

        // console.log('Lease delete confirmed for ID:', transactionId);
        appStore.setLoading(true);

        try {
                await $fetch(`/api/upload/${propertyStore.propertyId}/lease/${transactionId}`, {
                        method: 'DELETE',
                });

                propertyStore.removeTransaction(transactionId);

                createToast({
                        title: `Lease transaction ${transactionId} deleted successfully.`,
                }, { type: 'success' });
        } catch (error) {
                // console.error('Lease deletion failed:', error); 
                createToast({
                        title: 'Lease deletion failed:',
                        description: `${error}`
                }, { type: 'danger' });
        } finally {
                appStore.setLoading(false);
        }
};

// 3. Pinia Store 갱신 함수
const updateLeaseTransactionInStore = (payload: TransactionInfoType, method: 'POST' | 'PUT') => {
        if (!propertyStore.transactionInfo) return;

        if (method === 'POST') {
                // 💡 [확인] POST 시 Pinia 스토어의 transactionsList에 새 객체 추가
                propertyStore.transactionInfo.transactionsList.unshift(payload);
                propertyStore.transactionInfo.totalTransactions = (propertyStore.transactionInfo.totalTransactions || 0) + 1;

        } else if (method === 'PUT') {
                const index = propertyStore.transactionInfo.transactionsList.findIndex((t: TransactionInfoType) => t.id === payload.id);
                if (index !== -1) {
                        // 💡 [확인] PUT 시 기존 객체를 새 객체로 교체
                        propertyStore.transactionInfo.transactionsList[index] = payload;
                }
        }
};
</script>