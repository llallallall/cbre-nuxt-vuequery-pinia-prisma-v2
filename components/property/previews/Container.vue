<template>
        <div class="bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none 
            flex w-full min-w-[990px] justify-start transition-all duration-600 ease-in-out">

                <div class=" relative 
                px-[0.5em] py-[0.5em] 
                backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] 
                flex flex-col gap-10 m-5
                transition-all duration-600 ease-in-out" :class="[
                        uiStore.isGrownPreview ? 'w-full' : 'w-[calc(50%-60px)]',
                        uiStore.isOpenModifyPanel ? 'ml-[30px] mr-auto' : 'mx-auto',
                        uiStore.isOpenPreview ? 'mt-[4em]' : ''
                ]">

                        <div class="relative bg-white w-full rounded-[10px] ">
                                <div
                                        class="absolute top-0 left-0 w-full h-[2em] bg-white flex items-center justify-between border-b z-100">
                                        <div class="flex items-center">
                                                <span
                                                        class="rounded-full w-[0.6em] h-[0.6em] bg-[#ff6057] ml-[1em] first-line:cursor-pointer"></span>
                                                <span
                                                        class="rounded-full w-[0.6em] h-[0.6em] bg-[#febc2e] ml-[0.5em] cursor-pointer"></span>
                                                <span
                                                        class="rounded-full w-[0.6em] h-[0.6em] bg-[#28c840] ml-[0.5em] cursor-pointer"></span>
                                                <span class="text-sm font-bold text-primary ml-[1.5em] ">
                                                        Preview
                                                </span>
                                        </div>
                                        <div class="flex flex-1 items-center justify-end">
                                                <Icon name="ic:outline-minus" size="1.2em"
                                                        class="mr-[0.5em] text-cbre_primary_4 cursor-pointer" :class="{
                                                                'bg-cbre_primary_2/40 rounded-full ': !uiStore.isGrownPreview,
                                                                'bg-transparent ': uiStore.isGrownPreview,
                                                        }" @click.prevent="() => {
                                uiStore.isGrownPreview = false
                        }" />
                                                <Icon name="openmoji:overlapping-white-squares" size="1.2em"
                                                        class="mr-[0.5em] text-cbre_primary_4 cursor-pointer" :class="{
                                                                'bg-cbre_primary_2/40 rounded-full ': uiStore.isGrownPreview,
                                                                'bg-transparent ': !uiStore.isGrownPreview,
                                                        }" @click.prevent="() => {
                                uiStore.isGrownPreview = true;
                        }" />

                                        </div>
                                </div>
                                <div
                                        class="relative left-0 w-full pt-[2em] h-[calc(100vh-300px)] p-6 overflow-y-auto custom-scrollbar z-20">

                                        <div
                                                class="detail-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6 text-primary">
                                                {{ propertyStore.currentProperty?.name || 'Modify Property' }}
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsGeneral />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsLocation />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsPhoto />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsBrochure @open-pdf-modal="handleOpenPdfModal" />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsProfitability />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsHistory />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsSizes />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsFloorData :key="props.floorDataKey" />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsFloorPlanPhoto />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsFacility />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsAccessibility />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <PropertyPreviewsTransaction />
                                        </div>

                                </div>
                        </div>
                </div>

        </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useStatusStore } from '~/stores/status';

const props = defineProps({
        floorDataKey: {
                type: Number,
                default: 0
        }
});

const uiStore = useUiStore();
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();

const router = useRouter();

const handleOpenPdfModal = (url: string) => {
        if (url) {
                statusStore.openViewerModal(url, 'pdf');
        }
};

</script>

<style scoped></style>