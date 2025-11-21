<template>
        <div ref="mapSelectionRef" class="mapSelection mapboxgl-ctrl mapboxgl-ctrl-group"
                :class="isMounting ? 'hidden' : 'block'">
                <button @click="togglePins()" class="mapboxgl-ctrl-mapSelection p-2" title="Toggle Filtered Pins">
                        <div class="w-full h-full flex justify-center items-center">
                                <div v-if="mapStore.filterMapPins">
                                        <Icon v-if="!isLoading" name="carbon:location-star-filled"
                                                class="text-[#17E88F]" size="24" />
                                        <Icon v-if="isLoading" name="eos-icons:bubble-loading" color="#000000"
                                                size="18" />
                                </div>
                                <div v-else>
                                        <Icon v-if="!isLoading" name="carbon:location-star" size="24" />
                                        <Icon v-if="isLoading" name="eos-icons:bubble-loading" color="#000000"
                                                size="18" />
                                </div>
                        </div>
                </button>
        </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineMapboxControl, useMapbox } from '#imports';
import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';
// import { usePropertyStore } from '~/stores/property'; // Kept Assets 기능 필요 시 연결

const mapStore = useMapStore();
const { filterMapPins } = storeToRefs(mapStore);

const mapSelectionRef = ref<HTMLElement | null>(null);
const isMounting = ref(true);
const isLoading = ref(false);

const togglePins = () => {
        // [TODO]: Kept Assets 기능이 Property Store에 구현되면 length 체크 로직 추가
        // if (propertyStore.keptAssetIds.length > 0) { ... }

        isLoading.value = true;
        setTimeout(() => {
                mapStore.filterMapPins = !mapStore.filterMapPins;
                isLoading.value = false;
        }, 300);
};

onMounted(() => {
        isMounting.value = true;
        useMapbox('cbre-map', (map) => {
                if (mapSelectionRef.value) {
                        const control = defineMapboxControl((_map) => {
                                return mapSelectionRef.value as HTMLElement;
                        }, (map) => { });
                        map.addControl(control, "top-right");
                }
        });
        setTimeout(() => { isMounting.value = false; }, 1000);
});
</script>

<style scoped>
.mapSelection {
        position: relative;
}
</style>