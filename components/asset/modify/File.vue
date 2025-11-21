<template>
        <div class="flex">
                <div class="bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none w-full">

                        <div class="relative px-[2.5em] pt-[7.5em] pb-[2.5em] 
                  backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                  border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] 
                  flex flex-col gap-10">

                                <div class="absolute top-0 left-[50%] -translate-x-[50%] 
                    px-[1.5em] py-[1.0em] md:py-[0.5em] 
                    text-center text-cbre_primary_3 text-[1.5em] 
                    rounded-[0_0_20px_20px] 
                    bg-[rgba(230,234,234,1)]">
                                        File Management (Brochure)
                                </div>

                                <div
                                        class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] ">
                                        <label class="absolute -top-[1em] left-[1em]
                        text-cbre_primary_3/60 text-xs 
                        border border-[rgba(255,255,255,0.4)] rounded-[5px] 
                        px-[0.7em] py-[0.2em] 
                        bg-[rgba(230,234,234,1)]
                        shadow-sm backdrop-blur-3xl">
                                                Brochure Files
                                        </label>

                                        <AssetModifyFormBrochure @close="handleClose" />
                                </div>

                                <div v-if="currentPdfUrl" class="mt-4 border rounded overflow-hidden">
                                        <ClientOnly>
                                                <vue-pdf-app theme="light" style="height: 50vh;"
                                                        :pdf="currentPdfUrl"></vue-pdf-app>
                                        </ClientOnly>
                                </div>

                                <div class="grid grid-cols-2 gap-3">
                                        <button class="w-full h-[5vh] rounded-[10px] bg-gray-300 text-gray-700"
                                                type="button" @click.prevent="handleClose">Close</button>
                                </div>

                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import VuePdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';

// Store
const propertyStore = usePropertyStore();
const uiStore = useUiStore();

// PDF URL 계산 (첫 번째 브로슈어)
const currentPdfUrl = computed(() => {
        const brochures = propertyStore.brochureList;
        if (brochures && brochures.length > 0 && brochures[0].fileUrl) {
                return brochures[0].fileUrl;
        }
        return '/sample/files/empty.pdf';
});

const handleClose = () => {
        // UI Store를 통해 패널 닫기 등을 수행할 수 있음 (상황에 따라 다름)
        // 만약 이 컴포넌트가 모달 내부에 있다면 emit('close')를 사용
        uiStore.closeModifyPanel();
}
</script>

<style scoped></style>