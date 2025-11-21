<template>
        <div class="w-full flex flex-col sm:flex-row items-center justify-between">

                <div class="addresses w-full sm:w-1/2 mb-2 flex flex-col text-base relative">
                        <div v-if="item.location && item.location.addressProvince"
                                class="address font-barlow text-gray-400 w-full flex items-center px-2">
                                <div class="truncate overflow-hidden relative">
                                        {{ item.location.addressProvince }}
                                        <span v-if="item.location && item.location.addressCity"> / {{
                                                item.location.addressCity }}</span>
                                </div>
                        </div>

                        <div v-if="item.location && item.location.addressFull"
                                class="address font-barlow text-gray-600 w-full flex items-center px-2">
                                <div class="truncate overflow-hidden relative">
                                        {{ item.location.addressFull }}
                                </div>
                        </div>
                </div>

                <div
                        class="action-buttons-group w-full sm:w-1/2 flex my-4 sm:my-0 justify-start sm:justify-end items-center gap-3 font-calibre text-base">
                        <div class="action-buttons bg-primary/10 hover:bg-primary/25 text-primary rounded-full whitespace-nowrap px-4 py-1 flex justify-center items-center gap-1 cursor-pointer"
                                @click="scrollToSection('floor-plan-section')">
                                <IconFloorPlan class="text-primary w-[20px] h-[20px]" />
                                Floor Plan
                        </div>

                        <div class="action-buttons bg-primary/10 hover:bg-primary/25 text-primary rounded-full whitespace-nowrap px-4 py-1 flex justify-center items-center gap-1 cursor-pointer"
                                @click="downloadAsPdf()">
                                <IconBook class="text-primary w-[20px] h-[20px]" />
                                Brochure
                        </div>

                        <div class="action-buttons bg-primary/10 hover:bg-primary/25 text-primary rounded-full whitespace-nowrap px-4 py-1 flex justify-center items-center gap-1 cursor-pointer"
                                @click="scrollToSection('location-map-section')">
                                <IconMap class="text-primary w-[20px] h-[20px]" />
                                Map
                        </div>
                </div>

        </div>

        <div class="image-slide w-full h-[500px] select-none mt-2">
                <img :src="mainImageUrl" class="object-cover w-full h-full relative" />

                <div v-if="item.propertyImageFile && item.propertyImageFile.length > 0"
                        class="small-previews w-full h-[100px] flex justify-center items-end gap-3 z-10">
                        <div v-for="preview in validImages" :key="preview.id"
                                class="preview overflow-hidden w-[50px] h-[50px] border-white/25 border-4 shadow-xl hover:scale-125 transition-all cursor-pointer">
                                <img :src="preview.fileUrl" @click="setImageSrc(preview.fileUrl)"
                                        class="object-cover w-full h-full border-white/25 border-2" />
                        </div>
                </div>

                <div class="expand-icon text-primary hover:text-white backdrop-blur-sm bg-white/25 hover:bg-primary/75 cursor-pointer"
                        @click="openModal">
                        <IconExpand />
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import { useModal } from 'vue-final-modal';
import ModalFullscreen from '@/components/modal/FullscreenModal.vue';
import { useRuntimeConfig } from '#app';

// Props 정의
const props = defineProps({
        item: {
                required: true,
                type: Object // PropertyType
        }
});

const runtimeConfig = useRuntimeConfig();

// 💡 이미지 데이터 처리 (photoList -> propertyImageFile)
const validImages = computed(() => {
        if (!props.item.propertyImageFile) return [];
        return props.item.propertyImageFile.filter((el: any) => el.fileUrl && (el.fileUrl + '').trim().length > 0);
});

// 현재 표시할 이미지 URL
const currentImgUrl = ref('');

// 초기 이미지 설정
if (validImages.value.length > 0) {
        currentImgUrl.value = validImages.value[0].fileUrl;
} else {
        currentImgUrl.value = '/images/placeholder.jpg';
}

const mainImageUrl = computed(() => currentImgUrl.value || '/images/placeholder.jpg');

const setImageSrc = (src: string | null) => {
        if (src) currentImgUrl.value = src;
};

const downloadAsPdf = () => {
        // Brochure 파일이 있다면 그것을 열도록 수정 가능
        const brochure = props.item.propertyBrochureFile?.[0];
        const pdfUrl = brochure?.fileUrl || '/sample/files/sample.pdf';
        window.open(pdfUrl, '_blank');
};

// 💡 스크롤 이동 함수 (Store 의존성 제거 -> ID 기반 이동)
const scrollToSection = (elementId: string) => {
        const el = document.getElementById(elementId);
        if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
        } else {
                console.warn(`Element with id ${elementId} not found.`);
        }
};

// 모달 설정
const { open, close } = useModal({
        component: ModalFullscreen,
        attrs: {
                imgUrl: currentImgUrl,
                onClose() {
                        close();
                },
                clickToClose: true,
                escToClose: true,
        } as any,
});

const openModal = () => {
        open();
};

</script>

<style scoped>
.image-slide {
        position: relative;
}

.small-previews {
        position: absolute;
        bottom: 10px;
        display: flex;
        flex-direction: row;
        justify-content: center;
}

.preview {
        display: inline-block;
        width: 120px;
        height: 90px;
        margin: 4px;
}

.expand-icon {
        position: absolute;
        top: 0;
        right: 0;
        padding: 8px;
}
</style>