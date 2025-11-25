<template>
        <VueFinalModal class="flex justify-center items-center p-4"
                content-class="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all"
                overlay-transition="vfm-fade" content-transition="vfm-fade"
                @update:model-value="(val: boolean) => emit('update:modelValue', val)">

                <button @click="handleClose"
                        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                </button>

                <div class="text-center mb-4">
                        <h3 class="text-xl font-bold text-gray-800">
                                Brochures
                        </h3>
                </div>

                <div class="flex flex-col space-y-3 max-h-[60vh] overflow-y-auto">
                        <div v-for="file in brochures" :key="file.id" @click="openPdf(file.fileUrl)"
                                class="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-[10px] text-gray-700 font-medium transition flex items-center gap-2 group cursor-pointer">
                                <IconBook
                                        class="text-cbre_primary_1 w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span class="truncate">{{ file.fileName || 'Brochure' }}</span>
                        </div>
                </div>
        </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import type { PropertyBrochureFileType } from '~/types/property.type';
import { useStatusStore } from '~/stores/status';

const props = defineProps<{
        brochures: PropertyBrochureFileType[];
}>();

const emit = defineEmits<{
        (e: 'update:modelValue', value: boolean): void;
        (e: 'closed'): void;
}>();

const statusStore = useStatusStore();

const handleClose = () => {
        emit('update:modelValue', false);
};

const openPdf = (url: string | null) => {
        if (url) {
                statusStore.openViewerModal(url, 'pdf');
                // Optional: Close the list modal if you want only one modal open
                // handleClose(); 
        }
};
</script>

<style scoped>
.vfm-fade-enter-active,
.vfm-fade-leave-active {
        transition: opacity 0.3s ease;
}

.vfm-fade-enter-from,
.vfm-fade-leave-to {
        opacity: 0;
}
</style>
