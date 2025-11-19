<template>
  <VueFinalModal v-model="isImageModalActive"
    content-class="w-full h-full flex bg-black dark:bg-gray-900 space-y-2 justify-center" :hide-overlay="true"
    content-transition="vfm-fade" @click-outside="handleClose">
    <img v-if="viewerModalUrl" :src="viewerModalUrl" class="w-fit h-full object-contain" />

    <button
      class="absolute top-4 right-4 px-2 py-1 text-sm border border-white rounded-lg text-white bg-black/50 hover:bg-black/70 transition"
      @click="handleClose">
      x Close
    </button>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { useStatusStore } from '~/stores/status'; // status Store 임포트
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

// 1. 스토어 상태 구독
const statusStore = useStatusStore();
// isViewerModalOpen: 모달의 가시성
// viewerModalUrl: 이미지 또는 PDF의 URL
// viewerModalType: 'image', 'pdf', null 중 하나
const { isViewerModalOpen, viewerModalUrl, viewerModalType } = storeToRefs(statusStore);

// 2. 모달 활성화 조건: 뷰어 모달이 열려 있고, 타입이 'image'일 때만 활성화
const isImageModalActive = computed({
  get: () => isViewerModalOpen.value && viewerModalType.value === 'image',
  // Pinia Store에서 직접 상태를 설정하므로 set 함수는 필요하지 않습니다. 
  // 하지만 v-model을 사용하려면 정의해야 하므로, handleClose를 호출합니다.
  set: (val: boolean) => {
    if (!val) {
      handleClose();
    }
  }
});


/**
 * @description 모달을 닫는 함수 (Store Action 호출)
 */
const handleClose = () => {
  // Status Store의 뷰어 닫기 액션 호출
  statusStore.closeViewerModal();
};

</script>