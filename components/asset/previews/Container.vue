<template>
        <div class="bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none 
                flex w-full justify-start transition-all duration-600 ease-in-out">

                <div class="relative 
                    px-[0.5em] py-[0.5em] 
                    backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                    border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] 
                    flex flex-col gap-10 m-5
                    transition-all duration-600 ease-in-out" :class="[
                        // 💡 수정: panelStore.growPreview -> uiStore.isGrownPreview
                        uiStore.isGrownPreview ? 'w-full' : 'w-1/2',

                        // 💡 수정: panelStore.shrinkPreview -> uiStore.isShrunkPreview
                        uiStore.isShrunkPreview ? 'mr-auto' : 'mx-auto'
                ]">

                        <div class="relative bg-white w-full min-h-[50em]  rounded-[10px] p-6">
                                <div
                                        class="absolute top-0 left-0 w-full h-[2em] flex items-center justify-between border-b">
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
                                                <button class="text-sm font-bold text-[#ff6057] mr-[1.5em] hover:bg-[#28c840]/20 px-2 rounded-[10px] "
                                                        @click="goToAdminList(); uiStore.closeModifyPanel();">
                                                        Return to the list
                                                </button>

                                                <icon name="ic:outline-minus" size="1.2em"
                                                        class="mr-[0.5em] text-cbre_primary_4 cursor-pointer" :class="{
                                                                'bg-cbre_primary_2/40 rounded-full ': !uiStore.isGrownPreview,
                                                                'bg-transparent ': uiStore.isGrownPreview,
                                                        }" @click.prevent="() => {
                                                                uiStore.isGrownPreview = false
                                                        }" />
                                                <icon name="openmoji:overlapping-white-squares" size="1.2em"
                                                        class="mr-[0.5em] text-cbre_primary_4 cursor-pointer" :class="{
                                                                'bg-cbre_primary_2/40 rounded-full ': uiStore.isGrownPreview,
                                                                'bg-transparent ': !uiStore.isGrownPreview,
                                                        }" @click.prevent="() => {
                                                                uiStore.isGrownPreview = true;
                                                        }" />

                                        </div>
                                </div>
                                <div class="left-0 w-full pt-[2em] overflow-x-hidden overflow-y-scroll">

                                        <div
                                                class="detail-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6 text-primary">
                                                {{ propertyStore.currentProperty?.name || 'Modify Property' }}
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsGeneral />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsLocation />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsPhoto />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsBrochure @open-pdf-modal="handleOpenPdfModal" />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsProfitability />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsHistory />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsSizes />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsFloorData :key="props.floorDataKey" />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsFloorPlanPhoto />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsFacility />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsAccessibility />
                                        </div>

                                        <div class="space-y-8 border-b pb-10">
                                                <AssetPreviewsTransaction />
                                        </div>

                                </div>
                        </div>
                </div>

        </div>
</template>

<script setup lang="ts">
// 💡 1. 수정: Store Import 경로 변경
import { useRouter } from 'vue-router';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';         // ModifyPanelStore 대체
import { useStatusStore } from '~/stores/status'; // AppStore 대체

const props = defineProps({
        floorDataKey: {
                type: Number,
                default: 0
        }
});

// 💡 2. 수정: Store 인스턴스 생성
const uiStore = useUiStore();          // Panel UI 상태
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();  // 전역 상태 (Modal 등)

const router = useRouter();

const goToAdminList = () => {
        // 선택 사항: propertyStore.$reset() 등을 호출할 수 있습니다.
        router.push('/admin');
}

const handleOpenPdfModal = (url: string) => {
        if (url) {
                // 💡 3. 수정: Status Store의 새로운 액션 사용
                statusStore.openViewerModal(url, 'pdf');
        }
};

</script>