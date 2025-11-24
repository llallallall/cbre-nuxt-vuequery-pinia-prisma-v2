<template>
        <div class="flex justify-center items-center h-[calc(100vh-80px)] bg-gray-50">
                <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">

                        <h2 class="text-2xl font-financier text-primary mb-6 text-center">Register New Asset</h2>

                        <form @submit.prevent="handleCreate" class="space-y-6">

                                <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-1">Property Name <span
                                                        class="text-red-500">*</span></label>
                                        <input v-model="form.name" type="text" placeholder="Enter asset name"
                                                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cbre_primary_1" />
                                </div>

                                <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-1">Sector <span
                                                        class="text-red-500">*</span></label>
                                        <select v-model="form.sectorId"
                                                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cbre_primary_1 bg-white">
                                                <option value="" disabled>Select Sector</option>
                                                <option v-for="sector in uiStore.sectorList" :key="sector.id"
                                                        :value="sector.id">
                                                        {{ sector.name }}
                                                </option>
                                        </select>
                                </div>

                                <button type="submit" :disabled="isLoading || !isValid"
                                        class="w-full bg-cbre_primary_1 text-white font-bold py-3 rounded-lg hover:bg-cbre_primary_2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
                                        <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                        stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                        </svg>
                                        {{ isLoading ? 'Creating...' : 'Start Registration' }}
                                </button>

                        </form>
                </div>
        </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUiStore } from '~/stores/ui';
import { useStatusStore } from '~/stores/status'; // useAppStore -> useStatusStore
import { createToast } from 'mosha-vue-toastify';

definePageMeta({
        middleware: "auth",
        layout: 'admin-layout',
});

const router = useRouter();
const uiStore = useUiStore();
const statusStore = useStatusStore();

const form = reactive({
        name: '',
        sectorId: ''
});

const isLoading = computed(() => statusStore.isGlobalLoading);
const isValid = computed(() => form.name.length > 2 && form.sectorId);

// 마스터 데이터 로드 (Sector 목록이 없을 경우 대비)
onMounted(() => {
        if (uiStore.sectorList.length === 0) {
                // fetchMasterData 액션 호출 (ui.ts에 구현 필요) 또는 직접 fetch
                // 여기서는 간단히 예시
        }
});

const handleCreate = async () => {
        statusStore.setGlobalLoading(true);
        try {
                const { id } = await $fetch<{ id: string }>('/api/property/create', {
                        method: 'POST',
                        body: form
                });

                createToast({ title: 'Asset initialized!', description: 'Redirecting to edit mode...' }, { type: 'success' });

                // 🚀 생성된 ID를 가지고 수정 페이지(Modify)로 이동
                // 이 페이지는 AssetPreviewsContainer를 보여주고, 사용자는 여기서 'Edit' 버튼을 눌러 채워넣게 됩니다.
                router.push(`/property/modify/${id}`);

        } catch (error) {
                console.error(error);
                createToast({ title: 'Failed to create asset.' }, { type: 'danger' });
        } finally {
                statusStore.setGlobalLoading(false);
        }
};
</script>