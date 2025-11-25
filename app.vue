<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#003F2D" />

    <GlobalLoader />

    <ConfirmModal v-if="isConfirmModalOpen" :title="confirmModalTitle" :message="confirmModalMessage"
      @confirm="statusStore.closeConfirmModal(true)" @cancel="statusStore.closeConfirmModal(false)" />

    <FullscreenModal v-if="isViewerModalOpen && viewerModalType === 'image'" :imgUrl="viewerModalUrl"
      @close="statusStore.closeViewerModal()" />

    <PdfViewerModal />

    <UserProfileModal v-if="isUserProfileModalOpen" @close="uiStore.toggleUserProfileModal(false)" />

    <NuxtPage />

    <ModalsContainer />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, provide, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { ModalsContainer } from 'vue-final-modal';
import { useToast } from '~/composables/useToast';

// Stores
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useUiStore } from '~/stores/ui';

// Components
import GlobalLoader from '~/components/GlobalLoader.vue';
import ConfirmModal from '~/components/modal/ConfirmModal.vue';
import FullscreenModal from '~/components/modal/FullscreenModal.vue';
import PdfViewerModal from '~/components/modal/PdfViewerModal.vue';
import UserProfileModal from '~/components/modal/UserProfileModal.vue';

// --- Meta ---
useSeoMeta({
  title: 'CBRE Commercial Real Estate Services',
  ogTitle: 'CBRE Commercial Real Estate Services',
  description: 'Asset Management System for CBRE Korea.',
});

// --- Store Initialization ---
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const uiStore = useUiStore();
const { showToast } = useToast();

// --- State Refs ---
const {
  isConfirmModalOpen,
  confirmModalTitle, // 추가됨
  confirmModalMessage,
  isViewerModalOpen,
  viewerModalUrl,
  viewerModalType,
  globalError // 에러 감지용
} = storeToRefs(statusStore);

const { isUserProfileModalOpen } = storeToRefs(uiStore);

// --- Initial Data Load ---
onMounted(async () => {
  await propertyStore.fetchInitialData();
});

// --- Global Error Handling ---
watch(globalError, (newError) => {
  if (newError) {
    showToast(newError, 'danger');
    // 에러 표시 후 상태 초기화 (옵션)
    statusStore.setGlobalError(null);
  }
});

// --- Providers ---
// 하위 컴포넌트에서 inject로 사용할 수 있는 전역 변수 제공
const detailCardPrintAreaRef = ref<HTMLElement | null>(null);
provide('detailCardPrintAreaRef', detailCardPrintAreaRef);

</script>

<style>
/* 전역 스타일 (필요시) */
/* @import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"; */
/* @import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" */

/* Scrollbar Customization */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
