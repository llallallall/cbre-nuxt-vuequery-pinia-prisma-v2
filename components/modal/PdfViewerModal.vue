<template>
  <VueFinalModal v-model="isPdfModalActive"
    content-class="w-full h-full flex bg-gray-800 dark:bg-gray-900 justify-center items-center" :hide-overlay="true"
    content-transition="vfm-fade" classes="flex justify-center items-center">
    <div class="relative w-[90%] max-w-[95%] h-[95%] bg-white rounded-lg shadow-2xl overflow-hidden p-0 flex flex-col">

      <div class="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white z-10">
        <h3 class="text-xl font-semibold text-gray-800">
          PDF Document Viewer
        </h3>
        <button @click="handleClose" class="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
          <Icon name="ion:close-sharp" class="w-6 h-6" />
        </button>
      </div>

      <div class="flex-1 relative bg-gray-100">
        <iframe v-if="viewerModalUrl" :src="viewerModalUrl" class="w-full h-full" frameborder="0">
        </iframe>
        <div v-else class="absolute inset-0 flex items-center justify-center text-red-500">
          PDF URL is missing.
        </div>
      </div>

    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import { useStatusStore } from '~/stores/status';
import { storeToRefs } from 'pinia';

const statusStore = useStatusStore();
const { isViewerModalOpen, viewerModalUrl, viewerModalType } = storeToRefs(statusStore);

const isPdfModalActive = computed({
  get: () => isViewerModalOpen.value && viewerModalType.value === 'pdf',
  set: (val: boolean) => {
    if (!val) {
      handleClose();
    }
  }
});

const handleClose = () => {
  statusStore.closeViewerModal();
};
</script>

<style scoped>
/* iframe 스타일은 tailwind 클래스로 대체되었으므로 별도 스타일 불필요 */
</style>