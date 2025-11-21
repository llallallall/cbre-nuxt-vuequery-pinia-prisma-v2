<template>
        <div ref="mapStyleRef" class="mapStyle mapboxgl-ctrl mapboxgl-ctrl-group"
                :class="isMounting ? 'hidden' : 'block'">
                <button @click="isOpened = !isOpened" class="mapboxgl-ctrl-mapStyle p-2" title="Map Settings">
                        <IconMap v-if="!isLoading" size="20" />
                        <Icon v-if="isLoading" name="eos-icons:bubble-loading" size="18" />
                </button>

                <button @click="reset()" class="mapboxgl-ctrl-mapStyle p-2" title="Reset Map View">
                        <Icon v-if="!isResetting" name="material-symbols:map-outline" size="20" />
                        <Icon v-if="isResetting" name="eos-icons:bubble-loading" size="18" />
                </button>

                <div class="mapboxgl-mapStyle-list min-w-[300px] p-4 bg-white rounded shadow-lg border border-gray-200 absolute top-0 left-12 z-50"
                        :class="isOpened ? 'block' : 'hidden'">

                        <div class="flex flex-col gap-4">
                                <div class="flex justify-between items-center">
                                        <label class="text-sm font-medium">Map Style</label>
                                        <select v-model="mapStore.mapStyleOptions.MapStyle"
                                                @change="onChangeStyle(mapStore.mapStyleOptions.MapStyle.value); isOpened = false"
                                                class="border rounded p-1 text-sm w-32">
                                                <option v-for="data in MapStyle" :key="data.name" :value="data">{{
                                                        data.name }}</option>
                                        </select>
                                </div>
                                <div class="flex justify-between items-center">
                                        <label class="text-sm font-medium">Language</label>
                                        <select v-model="mapStore.mapStyleOptions.MapLang"
                                                @change="onChangeLanguage(mapStore.mapStyleOptions.MapLang.value); isOpened = false"
                                                class="border rounded p-1 text-sm w-32">
                                                <option v-for="data in MapLang" :key="data.name" :value="data">{{
                                                        data.name }}</option>
                                        </select>
                                </div>
                                <div class="flex flex-col gap-2">
                                        <label class="text-sm font-medium">Pitch ({{ mapStore.mapStyleOptions.MapPitch
                                                }})</label>
                                        <Slider v-model="mapStore.mapStyleOptions.MapPitch" :min="0" :max="85" />
                                </div>
                                <div class="flex flex-col gap-2">
                                        <label class="text-sm font-medium">Bearing ({{
                                                mapStore.mapStyleOptions.MapBearing }})</label>
                                        <Slider v-model="mapStore.mapStyleOptions.MapBearing" :min="0" :max="360" />
                                </div>
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineMapboxControl, useMapbox } from '#imports';
import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';
import { MapStyle, MapLang, MapDefaultOptions, mapCenter, mapZoom, maxZoom, minZoom, mapPitch, mapBearing } from '~/context/mapData';
// @ts-ignore
import Slider from '@vueform/slider';
import "@vueform/slider/themes/default.css";

const mapStore = useMapStore();
const mapStyleRef = ref<HTMLElement | null>(null);
const isOpened = ref(false);
const isLoading = ref(false);
const isResetting = ref(false);
const isMounting = ref(true);

const reset = () => {
        isResetting.value = true;
        useMapbox('cbre-map', (map) => {
                // Reset Map View
                map.setCenter(mapCenter);
                map.setZoom(mapZoom);
                map.setPitch(mapPitch);
                map.setBearing(mapBearing);

                // Reset Style
                // Note: setStyle might reload the map, be careful with preserving layers
        });
        setTimeout(() => { isResetting.value = false; }, 1000);
};

const onChangeStyle = (tileStyle: string) => {
        isLoading.value = true;
        useMapbox('cbre-map', (map) => {
                map.setStyle(tileStyle);
                // Note: After setStyle, custom layers (3D buildings etc.) need to be re-added.
                // MapboxMap component might handle this via props update or re-mounting.
        });
        setTimeout(() => { isLoading.value = false; }, 1000);
};

const onChangeLanguage = (language: string) => {
        useMapbox('cbre-map', (map) => {
                if (mapStore.mapLanguage) {
                        map.setStyle(mapStore.mapLanguage.setLanguage(map.getStyle(), language));
                }
        });
};

onMounted(() => {
        isMounting.value = true;
        useMapbox('cbre-map', (map) => {
                if (mapStyleRef.value) {
                        const control = defineMapboxControl((_map) => mapStyleRef.value as HTMLElement, (map) => { });
                        map.addControl(control, "top-left");
                }
        });
        setTimeout(() => { isMounting.value = false; }, 1000);
});
</script>

<style scoped>
.mapStyle {
        position: relative;
}
</style>