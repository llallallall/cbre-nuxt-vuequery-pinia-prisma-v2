<template>
  <NuxtLayout>
    <!-- 1. Nuxt 내장 로딩 인디케이터 (라우트 전환 시) -->
    <NuxtLoadingIndicator />

    <!-- 2. 커스텀 전역 로더 (API 호출 등에서 사용) -->
    <GlobalLoader />

    <!-- 3. 컴펌 모달 로더 -->
    <ConfirmModal v-if="isConfirmModalOpen" :message="confirmModalMessage"
      @confirm="statusStore.closeConfirmModal(true)" @cancel="statusStore.closeConfirmModal(false)"
      title="Action Confirmation" confirmText="Confirm" />

    <!-- 4. 이미지 전체화면 -->
    <FullscreenModal v-if="isViewerModalOpen && viewerModalType === 'image'" :imgUrl="viewerModalUrl"
      @close="statusStore.closeViewerModal()" />

    <!-- 5. PDF 전체화면 로더 -->
    <PdfViewerModal v-if="isViewerModalOpen && viewerModalType === 'pdf'" :pdfUrl="viewerModalUrl"
      :isOpen="isViewerModalOpen" @close="statusStore.closeViewerModal()" />

    <!-- 6. 사용자 정보 로더 -->
    <UserProfile v-if="isUserProfileModalOpen" @close="uiStore.toggleUserProfileModal(false)" />

    <!-- 실제 페이지 콘텐츠 -->
    <NuxtPage />
    <ModalsContainer />
  </NuxtLayout>
</template>


<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'
import { ref, provide } from 'vue';
import { storeToRefs } from 'pinia';

// 💡 Store imports: useDataStore 대신 usePropertyStore 사용
import { usePropertyStore } from '~/stores/property';
// 💡 모달 상태를 위한 Store 추가
import { useStatusStore } from '~/stores/status';
import { useUiStore } from '~/stores/ui';


// 💡 Modal Components Import (경로는 사용자 프로젝트 구조에 맞게 유지)
import ConfirmModal from '~/components/modal/ConfirmModal.vue';
import FullscreenModal from '~/components/modal/FullscreenModal.vue';
import PdfViewerModal from '~/components/modal/PdfViewerModal.vue';
import UserProfile from '~/components/modal/UserProfile.vue';


useSeoMeta({
  title: 'CBRE Commercial Real Estate Services',
  ogTitle: 'CBRE Commercial Real Estate Services',
  description: 'This is CBRE Commercial Real Estate Services.',
})

// 💡 Store Initialization
const propertyStore = usePropertyStore(); // dataStore 대체
const statusStore = useStatusStore();
const uiStore = useUiStore();

// 💡 StoreToRefs for conditional rendering
const {
  isConfirmModalOpen,
  confirmModalMessage,
  isViewerModalOpen,
  viewerModalUrl,
  viewerModalType
} = storeToRefs(statusStore);

const { isUserProfileModalOpen } = storeToRefs(uiStore);

// 💡 Initial Data Fetch (propertyStore.getAllAssets()로 변경)
propertyStore.fetchInitialData()

const detailCardPrintAreaRef = ref(null);
provide('detailCardPrintAreaRef', detailCardPrintAreaRef)

</script>

<style scoped>
/* @import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"; */
/* @import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" */
</style>