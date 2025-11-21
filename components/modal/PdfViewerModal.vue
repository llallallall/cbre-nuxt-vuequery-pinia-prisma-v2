<template>
  <VueFinalModal v-model="isPdfModalActive"
    content-class="w-full h-full flex bg-gray-800 dark:bg-gray-900 justify-center items-center" :hide-overlay="true"
    content-transition="vfm-fade" classes="flex justify-center items-center">
    <ClientOnly>
      <div class="relative w-[90%] max-w-[95%] h-[95%] bg-white rounded-lg shadow-2xl overflow-hidden p-0">

        <div class="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white z-10 sticky top-0">
          <h3 class="text-xl font-semibold text-gray-800">
            PDF Document Viewer
          </h3>
          <button @click="handleClose" class="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
            <Icon name="ion:close-sharp" class="w-6 h-6" />
          </button>
        </div>

        <div class="h-[calc(100%-54px)] relative">
          <div v-if="isLoading" class="absolute inset-0 bg-white flex flex-col items-center justify-center z-20">
            <div class="loader-spinner"></div>
            <p class="mt-4 text-gray-600">Loading PDF...</p>
          </div>

          <div :key="viewerKey" class="h-full w-full">
            <Vue3PdfApp v-if="viewerModalUrl" :pdf-src="viewerModalUrl" @pdf-loading-failed="handleError"
              @pdf-loaded="handleLoaded" class="h-full w-full" scale="page-width" />
            <div v-else class="absolute inset-0 flex items-center justify-center text-red-500">
              PDF URL is missing.
            </div>
          </div>
        </div>

      </div>
    </ClientOnly>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { VueFinalModal } from 'vue-final-modal'
// 💡 [수정] 정적 import 제거
// import Vue3PdfApp from 'vue3-pdf-app';
// import 'vue3-pdf-app/dist/icons/main.css';


import { useStatusStore } from '~/stores/status'; // status Store 임포트
import { storeToRefs } from 'pinia';

// 1. 스토어 상태 구독
const statusStore = useStatusStore();
const { isViewerModalOpen, viewerModalUrl, viewerModalType } = storeToRefs(statusStore);

// 2. 모달 활성화 조건: 뷰어 모달이 열려 있고, 타입이 'pdf'일 때만 활성화
const isPdfModalActive = computed({
  get: () => isViewerModalOpen.value && viewerModalType.value === 'pdf',
  set: (val: boolean) => {
    if (!val) {
      handleClose();
    }
  }
});

// PDF 뷰어 로딩 상태 및 강제 재마운트 키
const isLoading = ref(true);
const viewerKey = ref(Date.now());

/**
 * @description 모달 닫기 핸들러 (Store Action 호출)
 */
const handleClose = () => {
  // 모달 닫기
  statusStore.closeViewerModal();
  // 상태 초기화
  isLoading.value = true;
};

/**
 * @description PDF 뷰어 라이브러리를 강제로 재시작하여 새 PDF를 로드합니다.
 * isPdfModalActive (모달 열림) 상태가 true로 바뀔 때만 실행합니다.
 */
watch(isPdfModalActive, (newVal) => {
  if (newVal) {
    // 모달이 열릴 때마다 키를 변경하여 Vue3PdfApp 컴포넌트를 강제 재마운트 (re-mount)
    viewerKey.value = Date.now();
    // 로딩 상태를 다시 true로 설정하여 새로운 PDF 로딩을 준비
    isLoading.value = true;
  }
});

/**
 * @description PDF 로드 성공 시
 */
const handleLoaded = () => {
  isLoading.value = false;
};

/**
 * @description PDF 로드 실패 시
 */
const handleError = (error: any) => {
  console.error('PDF 로딩 실패:', error); // 한글 주석
  // 에러 발생 시에도 로딩 상태 해제
  isLoading.value = false;
  // [TODO]: useToast()를 사용하여 사용자에게 에러 메시지를 표시할 수 있습니다.
};
</script>

<style scoped>
/* 임시 스피너 스타일 (Tailwind CSS 설정이 있다면 이를 사용하세요) */
.loader-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #17E88F;
  /* accent color 사용 예시 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* PDF 뷰어의 크기 설정이 중요합니다. */
.h-\[calc\(100\%-54px\)\] {
  height: calc(100% - 54px);
  /* 헤더(54px)를 제외한 나머지 영역 */
}
</style>