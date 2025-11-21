<template>
  <VueFinalModal class="flex justify-center items-center p-4"
    content-class="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all"
    overlay-transition="vfm-fade" content-transition="vfm-fade"
    @update:model-value="(val) => emit('update:modelValue', val)">
    <button @click="handleCancel" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
      aria-label="Close modal">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <div class="text-center mb-4">
      <h3 class="text-xl font-bold text-gray-800">
        {{ title }}
      </h3>
    </div>

    <div class="text-center mb-8">
      <p class="text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
        {{ message }}
      </p>
    </div>

    <div class="flex flex-col space-y-3">
      <button @click="handleConfirm"
        class="w-full py-3 px-6 bg-cbre_primary_1 text-white font-bold rounded-[10px] shadow-md hover:bg-cbre_primary_2 transition transform active:scale-95">
        {{ confirmText }}
      </button>

      <button @click="handleCancel"
        class="w-full py-3 px-6 border border-gray-300 rounded-[10px] text-gray-700 font-medium hover:bg-gray-50 transition transform active:scale-95">
        {{ cancelText }}
      </button>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';

// 💡 1. Props 정의 (useConfirmModal에서 전달하는 데이터 수신)
const props = withDefaults(defineProps<{
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}>(), {
  title: 'Confirm',
  message: 'Are you sure?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
});

// 💡 2. Emits 정의 (부모에게 결과 전달)
// update:modelValue는 VueFinalModal의 v-model 제어를 위해 필수입니다.
const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:modelValue', value: boolean): void;
  (e: 'closed'): void; // 👈 핵심: closed 이벤트 명시
}>();

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>



<style scoped>
/* Vue Final Modal 기본 트랜지션 효과 */
.vfm-fade-enter-active,
.vfm-fade-leave-active {
  transition: opacity 0.3s ease;
}

.vfm-fade-enter-from,
.vfm-fade-leave-to {
  opacity: 0;
}
</style>