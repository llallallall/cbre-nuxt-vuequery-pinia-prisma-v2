<template>
        <div ref="mapSelectionRef" class="mapSelection mapboxgl-ctrl mapboxgl-ctrl-group"
                :class="isMounting ? 'hidden' : 'block'">
                <button @click="togglePins()" class="mapboxgl-ctrl-mapSelection">
                        <div class="w-full h-full flex justify-center items-center">
                                <div v-if="mapStore.filterMapPins">
                                        <Icon v-if="!isLoading" name="carbon:location-star-filled"
                                                :class="mapStore.filterMapPins ? 'text-[#17E88F]' : 'text-black'" size="24" />
                                        <Icon v-if="isLoading" name="eos-icons:bubble-loading" color="#000000" size="18" />
                                </div>
                                <div v-else>
                                        <Icon v-if="!isLoading" name="carbon:location-star" size="24" />
                                        <Icon v-if="isLoading" name="eos-icons:bubble-loading" color="#000000" size="18" />
                                </div>
                        </div>
                </button>

        </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineMapboxControl, useMapbox } from '#imports';

import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';
const mapStore = useMapStore()

import { useDataStore } from '~/stores/data';
const dataStore = useDataStore()

const { filterMapPins } = storeToRefs(useMapStore());

const mapSelectionRef = ref<HTMLElement | null>(null);

const isMounting = ref(true)

const isLoading = ref(false)

const togglePins = () => {
        if (dataStore.keptAssetIds.length > 0) {
                isLoading.value = true
                setTimeout(() => {
                        mapStore.filterMapPins = !mapStore.filterMapPins
                        isLoading.value = false
                }, 500)
        } else {
                alert('there is no selected asset')
        }
}

onMounted(() => {
        isMounting.value = true
        useMapbox('cbre-map', (map) => {
                if (mapSelectionRef.value) {
                        const control = defineMapboxControl((_map) => {
                                return mapSelectionRef.value as HTMLElement;
                        }, (map) => { })



                        map.addControl(control, "top-right");

                }
        })

        setTimeout(() => {
                isMounting.value = false
        }, 1000)


})
</script>

<style scoped>
.mapSelection {
        position: relative;
}

:root {
        --slider-connect-bg: #17E88F50;
        --slider-tooltip-bg: #778F9C;
        --slider-handle-ring-color: #3B82F630;
}
</style>