<template>
        <div class="bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none 
                    flex w-full justify-start transition-all duration-600 ease-in-out">

                <div class="relative 
                                px-[0.5em] py-[0.5em] 
                                backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                                border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] 
                                flex flex-col gap-10 m-5
                                transition-all duration-600 ease-in-out" :class="[
                                        // 너비 변경 로직
                                        panelStore.growPreview ? 'w-full' : 'w-1/2',
                                        // 2. 위치 변경 로직 (justify-content 대신 margin 사용)
                                        // shrinkPreview가 true: mr-auto로 왼쪽 정렬
                                        // shrinkPreview가 false: mx-auto로 중앙 정렬
                                        panelStore.shrinkPreview ? 'mr-auto' : 'mx-auto'
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
                                                        @click="goToAdminList(); panelStore.closePanel();">
                                                        Return to the list
                                                </button>
                                                <icon name="ic:outline-minus" size="1.2em"
                                                        class="mr-[0.5em] text-cbre_primary_4 cursor-pointer" :class="{
                                                                'bg-cbre_primary_2/40 rounded-full ': !panelStore.growPreview,
                                                                'bg-transparent ': panelStore.growPreview,
                                                        }" @click.prevent="() => {
                                                                panelStore.growPreview = false
                                                        }" />
                                                <icon name="openmoji:overlapping-white-squares" size="1.2em"
                                                        class="mr-[0.5em] text-cbre_primary_4 cursor-pointer" :class="{
                                                                'bg-cbre_primary_2/40 rounded-full ': panelStore.growPreview,
                                                                'bg-transparent ': !panelStore.growPreview,
                                                        }" @click.prevent="() => {
                                                                panelStore.growPreview = true;
                                                        }" />

                                        </div>
                                </div>
                                <div class="left-0 w-full pt-[2em] overflow-x-hidden overflow-y-scroll">

                                        <div
                                                class="detail-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6 text-primary">
                                                {{ propertyStore?.propertyName || 'Modify Property' }}

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
// 컨테이너는 로직 없이 구조적 역할만 수행합니다.
import { useModifyPanelStore } from '~/stores/modifyPanel';
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app'; // 💡 Pinia app Store를 가져옵니다.
import { useRouter } from 'vue-router'

const props = defineProps({
        floorDataKey: {
                type: Number,
                default: 0
        }
});

const panelStore = useModifyPanelStore();
const propertyStore = usePropertyStore();
const appStore = useAppStore(); // ✨ appStore 인스턴스 생성

// 라우터 인스턴스 가져오기
const router = useRouter()

const goToAdminList = () => {
        // propertyStore.resetProperty(); // 상태 초기화
        router.push('/admin')
}

const handleOpenPdfModal = (url: string) => {
        // console.log('PDF 모달 열기 요청:', url) // 한국어 주석
        if (url) {
                appStore.setPdfModalOpen(url); // Pinia Store의 액션 호출
        }
};

</script>
