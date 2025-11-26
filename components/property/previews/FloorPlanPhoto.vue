<template>
        <div class="bg-white mt-4">

                <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
                        <span>Floor Plan Photo</span>
                        <button @click="openEditPanel"
                                class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
                                Edit
                        </button>
                </div>

                <div v-if="hasFloorPlans">
                        <h3 class="text-md font-bold mt-6 mb-2 text-primary pr-2 ">- Longitudinal Section</h3>
                        <div class="grid grid-cols-3 gap-4 pl-[20px] w-full">
                                <div v-for="(photo, index) in longitudinalPhotos" :key="photo.id || index"
                                        class="flex justify-center items-center hover:scale-105 transition-all border border-transparent">
                                        <img v-if="photo.fileUrl" :src="photo.fileUrl"
                                                class="object-contain border-white/25 relative border-4 shadow-xl cursor-pointer"
                                                @click="openModal(photo.fileUrl)" />
                                </div>
                        </div>

                        <h3 class="text-md font-bold mt-6 mb-2 text-primary pr-2 ">- Cross Section</h3>
                        <div class="grid grid-cols-3 gap-4 pl-[20px] w-full">
                                <div v-for="(photo, index) in crossPhotos" :key="photo.id || index"
                                        class="flex justify-center items-center hover:scale-105 transition-all border border-transparent">
                                        <img v-if="photo.fileUrl" :src="photo.fileUrl"
                                                class="object-contain border-white/25 relative border-4 shadow-xl cursor-pointer"
                                                @click="openModal(photo.fileUrl)" />
                                </div>
                        </div>

                        <h3 class="text-md font-bold mt-6 mb-2 text-primary pr-2 "> - Each Floors</h3>
                        <div class="flex flex-col w-full bg-gray-50 p-4 rounded-lg mt-6">
                                <h3 class="text-md font-semibold mt-6 mb-2 text-primary pr-2 ">- Uppers</h3>
                                <div class="grid grid-cols-3 gap-4 pl-[20px] w-full">
                                        <div v-for="(photo, index) in upperFloors" :key="photo.id || index"
                                                class="flex justify-center items-center hover:scale-105 transition-all border border-transparent">
                                                <img v-if="photo.fileUrl" :src="photo.fileUrl"
                                                        class="object-contain border-white/25 relative border-4 shadow-xl cursor-pointer"
                                                        @click="openModal(photo.fileUrl)" />
                                        </div>
                                </div>

                                <h3 class="text-md font-semibold mt-6 mb-2 text-primary pr-2 ">- Basements</h3>
                                <div class="grid grid-cols-3 gap-4 pl-[20px] w-full">
                                        <div v-for="(photo, index) in basementFloors" :key="photo.id || index"
                                                class="flex justify-center items-center hover:scale-105 transition-all border border-transparent">
                                                <img v-if="photo.fileUrl" :src="photo.fileUrl"
                                                        class="object-contain border-white/25 relative border-4 shadow-xl cursor-pointer"
                                                        @click="openModal(photo.fileUrl)" />
                                        </div>
                                </div>
                        </div>
                </div>

                <div v-else class="text-center py-10 text-gray-500 text-sm">
                        No photos have been uploaded.
                </div>

        </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useModal } from 'vue-final-modal';
import ModalFullscreen from '~/components/modal/FullscreenModal.vue';

// 💡 Enum 런타임 객체 정의
const FloorFlanTypeEnum = {
        LOGITUDINALSECTION: 'LOGITUDINALSECTION',
        CROSSSECTION: 'CROSSSECTION',
        UPPERSECTION: 'UPPERSECTION',
        BASEMENTSECTION: 'BASEMENTSECTION',
} as const;

const propertyStore = usePropertyStore();
const uiStore = useUiStore();

const { currentProperty: property } = storeToRefs(propertyStore);
const currentImgUrl = ref<string>('');

// 💡 파일 필터링 (Flat Array -> Grouped)
const files = computed(() => property.value?.floorPlanFile || []);

const longitudinalPhotos = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.LOGITUDINALSECTION && f.fileUrl));
const crossPhotos = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.CROSSSECTION && f.fileUrl));
const upperFloors = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.UPPERSECTION && f.fileUrl));
const basementFloors = computed(() => files.value.filter((f: any) => f.type === FloorFlanTypeEnum.BASEMENTSECTION && f.fileUrl));

const hasFloorPlans = computed(() => {
        return longitudinalPhotos.value.length > 0 || crossPhotos.value.length > 0 ||
                upperFloors.value.length > 0 || basementFloors.value.length > 0;
});

const openEditPanel = () => {
        uiStore.openModifyForm(propertyStore.currentPropertyId, 'floorplan');
};

const { open, close } = useModal({
        component: ModalFullscreen,
        attrs: {
                imgUrl: currentImgUrl,
                onClose() { close() },
                clickToClose: true,
                escToClose: true,
        } as any,
});

const openModal = (url: string) => {
        currentImgUrl.value = url;
        open();
};
</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>