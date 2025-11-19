<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import { useStatusStore } from '~/stores/status';
import { storeToRefs } from 'pinia';

const statusStore = useStatusStore();
// isConfirmModalOpen: 모달의 가시성 제어
// confirmModalTitle: 모달 제목 (새로 추가)
// confirmModalMessage: 모달 내용
const { isConfirmModalOpen, confirmModalTitle, confirmModalMessage } = storeToRefs(statusStore);

/**
 * @description 'Confirm' (확인) 버튼 클릭 핸들러
 */
const handleConfirm = () => {
  // ⚠️ 주석: 사용자가 '확인'을 선택했음을 status Store에 알리고 모달을 닫습니다.
  statusStore.closeConfirmModal(true);
};

/**
 * @description 'Cancel' (취소) 또는 모달 외부 클릭 핸들러
 */
const handleCancel = () => {
  // ⚠️ 주석: 사용자가 '취소'했음을 status Store에 알리고 모달을 닫습니다.
  statusStore.closeConfirmModal(false);
};
</script>

<template>
  <VueFinalModal v-model="isConfirmModalOpen" :click-to-close="false" classes="flex justify-center items-center p-4"
    content-class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
    <div class="relative p-6">
      <button @click="handleCancel" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close modal">
        <Icon name="ion:close-sharp" class="w-6 h-6" />
      </button>

      <div class="text-center mb-6">
        <h3 class="text-2xl font-bold text-dark">{{ confirmModalTitle || 'Confirm Action' }}</h3>
      </div>

      <div class="text-center mb-8">
        <p class="text-lg text-darkgray leading-relaxed">{{ confirmModalMessage }}</p>
      </div>

      <div class="flex flex-col space-y-3">
        <button @click="handleConfirm"
          class="w-full py-3 px-6 bg-accent text-dark font-semibold rounded-lg shadow-md hover:bg-opacity-80 transition transform hover:scale-105">
          Confirm
        </button>
        <button @click="handleCancel"
          class="w-full py-3 px-6 border border-gray-300 rounded-lg text-darkgray hover:bg-gray-50 transition transform hover:scale-105">
          Cancel
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>

<style scoped>
/* Tailwind CSS 사용을 가정하고 있으므로, 추가적인 scoped style은 최소화합니다. */
/* 필요한 경우 VueFinalModal의 기본 스타일을 오버라이드할 수 있습니다. */
</style>