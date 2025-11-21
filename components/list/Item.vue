<template>
        <div class="group w-full h-full relative select-none border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
                :class="isKept ? 'bg-cbre_primary_1/10 border-cbre_primary_1/25' : 'bg-white border-gray-200'">

                <div class="flex w-full relative" :class="isGridView ? 'flex-col h-[480px]' : 'flex-row h-[260px]'">

                        <div class="overflow-hidden relative cursor-pointer bg-gray-100"
                                :class="isGridView ? 'w-full h-[260px]' : 'flex h-full w-1/2'" @click="openDetail">

                                <img :src="displayImageUrl"
                                        class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy" alt="Property Image" />

                        </div>

                        <div class="card-info flex flex-col relative pt-4 pl-4 pr-4 pb-2"
                                :class="isGridView ? 'w-full h-[220px]' : 'w-1/2 h-full'">

                                <div class="font-notoSansBold truncate overflow-hidden mb-2 text-lg hover:underline cursor-pointer text-primary"
                                        @click="openDetail" :title="item.name">
                                        {{ item.name }}
                                </div>

                                <div class="text-sm text-gray-500 mb-3 flex flex-col gap-1">
                                        <div v-if="item.location?.addressProvince" class="flex items-center">
                                                <div
                                                        class="w-1.5 h-1.5 bg-cbre_primary_1/60 rounded-full mr-2 shrink-0">
                                                </div>
                                                <span class="truncate">{{ item.location.addressProvince }} {{
                                                        item.location.addressCity ? `/ ${item.location.addressCity}` :
                                                                '' }}</span>
                                        </div>
                                        <div v-if="item.location?.addressFull" class="flex items-center">
                                                <div
                                                        class="w-1.5 h-1.5 bg-cbre_primary_1/60 rounded-full mr-2 shrink-0">
                                                </div>
                                                <span class="truncate">{{ item.location.addressFull }}</span>
                                        </div>
                                </div>

                                <div
                                        class="flex-1 more-info flex flex-col gap-y-1 font-financier text-sm text-gray-700">
                                        <ListItemInfo :item="item" />
                                </div>

                                <div class="flex justify-start items-end mt-2">
                                        <div
                                                class="border border-gray-200 bg-gray-50 text-gray-400 text-[10px] px-2 py-0.5 rounded">
                                                No. {{ idx }}
                                        </div>
                                </div>
                        </div>
                </div>

                <div class="absolute flex flex-col items-end gap-2 z-10"
                        :class="isGridView ? 'right-3 top-[230px]' : 'right-3 top-3'">

                        <div v-if="item.profitability?.grade"
                                class="w-8 h-8 bg-cbre_primary_1 rounded-full flex justify-center items-center text-white shadow-md text-xs font-bold border-2 border-white">
                                {{ item.profitability.grade }}
                        </div>

                        <div @click.stop="moveToMap"
                                class="w-8 h-8 flex justify-center items-center text-white bg-gray-700/80 backdrop-blur-sm rounded-full shadow-md hover:bg-cbre_primary_1 cursor-pointer transition-all border-2 border-white"
                                title="Show on Map">
                                <Icon name="ph:map-pin-fill" size="14" />
                        </div>

                        <div @click.stop="toggleKeep"
                                class="w-8 h-8 flex justify-center items-center rounded-full shadow-md cursor-pointer transition-all border-2 border-white"
                                :class="isKept ? 'bg-yellow-400 text-white' : 'bg-gray-700/80 backdrop-blur-sm text-white hover:bg-yellow-400'">
                                <Icon :name="isKept ? 'ph:star-fill' : 'ph:star'" size="14" />
                        </div>

                        <div v-if="hasSale"
                                class="w-8 h-8 bg-blue-500 rounded-full shadow-md flex items-center justify-center text-[10px] text-white font-bold border-2 border-white"
                                title="Sale">S</div>
                        <div v-if="hasLease"
                                class="w-8 h-8 bg-green-500 rounded-full shadow-md flex items-center justify-center text-[10px] text-white font-bold border-2 border-white"
                                title="Lease">L</div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUiStore } from '~/stores/ui';
import { useMapStore } from '~/stores/map';
import { useFormat } from '~/composables/useFormat'; // 💡 useFormat 임포트
import type { PropertyType } from '~/types/property.type';
import ListItemInfo from './ItemInfo.vue';

const props = defineProps<{
        item: PropertyType;
        idx: number;
}>();

const router = useRouter();
const uiStore = useUiStore();
const mapStore = useMapStore();
const { getThumbnailUrl } = useFormat(); // 💡 썸네일 변환 함수 사용

const { isGridView } = storeToRefs(uiStore);

// 💡 [핵심 수정] 원본 URL을 썸네일 URL로 변환하는 Computed 속성
const displayImageUrl = computed(() => {
        // 1. Store의 Raw Data (원본 URL) 가져오기
        const mainImage = props.item.propertyImageFile?.find(img => img.main);
        const originalUrl = mainImage?.fileUrl;

        // 2. 썸네일 URL로 변환 (없으면 Placeholder)
        return getThumbnailUrl(originalUrl);
});

const hasSale = computed(() => props.item.transaction?.some(t => t.type === 'SALE'));
const hasLease = computed(() => props.item.transaction?.some(t => t.type === 'LEASE'));

// Keep Logic (Local Mock)
const isKept = ref(false);
const toggleKeep = () => {
        isKept.value = !isKept.value;
};

// Actions
const openDetail = () => {
        const routeData = router.resolve({ path: `/asset/${props.item.id}` });
        window.open(routeData.href, '_blank');
};

const moveToMap = () => {
        if (props.item.location?.latitude && props.item.location?.longitude) {
                mapStore.setPinCoordinate(props.item.location.longitude, props.item.location.latitude);
        }
};
</script>

<style scoped>
/* Hover 시 이미지 확대 효과 등을 위한 설정 */
</style>

<style scoped>
.cbre_bulletList {
        list-style: none;
        margin: 0 0 1em;
        padding: 0 0 0 20px;
        line-height: 2;
}

.modalCloseButton {
        position: absolute;
        top: 150px;
        right: 60px;
        z-index: 100;
}

.detail-card-wrapper {
        width: 100%;
        height: 100%;
}

.detail-card-background {
        z-index: 10;
}

.detail-card-outer {
        width: 100%;
        height: 100%;
        z-index: 30;

}

.detail-card-inner {
        width: 100%;
        height: 100%;
}

.detail-card-contents {
        width: 100%;
        height: 100%;
}
</style>