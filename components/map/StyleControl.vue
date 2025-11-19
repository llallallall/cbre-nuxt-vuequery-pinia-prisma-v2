<template>
        <div ref="mapStyleRef" class="mapStyle mapboxgl-ctrl mapboxgl-ctrl-group " :class="isMounting ? 'hidden' : 'block'">
                <button @click="isOpened = !isOpened" class="mapboxgl-ctrl-mapStyle">
                        <div class="w-full h-full flex justify-center items-center">
                                <IconMap v-if="!isLoading" class="relative -translate-x-[1px]" />
                                <Icon v-if="isLoading" name="eos-icons:bubble-loading" color="#000000" size="18" />

                        </div>
                </button>

                <button @click="reset()" class="mapboxgl-ctrl-mapStyle">
                        <div class="w-full h-full flex justify-center items-center">
                                <Icon v-if="!isResetting" name="material-symbols:map-outline" size="23" />
                                <Icon v-if="isResetting" name="eos-icons:bubble-loading" color="#000000" size="18" />
                        </div>
                </button>


                <div class="mapboxgl-mapStyle-list min-w-[300px]" :class="isOpened ? 'block' : 'hidden'">
                        <table class="mapStyle-table text-sm -translate-y-1 translate-x-1">
                                <tbody>
                                        <tr class="w-full">
                                                <td class="flex-1"><label>Map Style</label></td>
                                                <td class="td-data ">
                                                        <select v-model="mapStore.mapStyleOptions.MapStyle"
                                                                @change="onChangeStyle(mapStore.mapStyleOptions.MapStyle.value); isOpened = false"
                                                                class="w-full ">
                                                                <option v-for="(data, index) in MapStyle" :key="data.name"
                                                                        :value="data" name="map-style"
                                                                        
                                                                        >
                                                                        {{ data.name }}
                                                                </option>
                                                        </select>
                                                </td>
                                        </tr>
                                        <tr>
                                                <td><label>Map Language</label></td>
                                                <td class="td-data">
                                                        <select v-model="mapStore.mapStyleOptions.MapLang"
                                                                @change="onChangeLanguage(mapStore.mapStyleOptions.MapLang.value); isOpened = false"
                                                                class="w-full ">
                                                                <option v-for="(data, index) in MapLang" :key="data.name"
                                                                        :value="data" name="map-lang">
                                                                        {{ data.name }}
                                                                </option>
                                                        </select>
                                                </td>
                                        </tr>
                                        <!-- <tr>
                                                <td><label>Division Ratio</label></td>
                                                <td class="td-data">
                                                        <Slider v-model="mapStore.mapStyleOptions.MapRatio" :min="0" :max="100"
                                                                @change="isOpened = false" />

                                                </td>
                                        </tr> -->
                                        <tr>
                                                <td><label>Horizontal axis</label></td>
                                                <td class="td-data">
                                                        <Slider v-model="mapStore.mapStyleOptions.MapPitch" :min="0" :max="85"
                                                                @change="isOpened = false" />

                                                </td>
                                        </tr>
                                        <tr>
                                                <td><label>Longitudinal axis</label></td>
                                                <td class="td-data">
                                                        <Slider v-model="mapStore.mapStyleOptions.MapBearing" :min="0"
                                                                :max="360" @change="isOpened = false" />

                                                </td>
                                        </tr>
                                </tbody>
                        </table>

                </div>

        </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineMapboxControl, useMapbox } from '#imports';
import { MapStyle, MapLang, MapDefaultOptions } from '~/context/data';

import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';
const mapStore = useMapStore()
const { mapStyleOptions } = storeToRefs(useMapStore());
import { mapCenter, mapZoom, maxZoom, minZoom, mapPitch, mapBearing, } from '~/context/data'

const mapStyleRef = ref<HTMLElement | null>(null);
//@ts-ignore
import Slider from '@vueform/slider'
import "@vueform/slider/themes/default.css";
const isOpened = ref(false)
const isLoading = ref(false)
const isResetting = ref(false)


// const cbreDataSource = ref({
//         type: 'geojson',
//         data: '/test.geojson',
//         cluster: true,
//         clusterMaxZoom: 12, // Max zoom to cluster points on
//         clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
// });

const reset = () => {

        isResetting.value = true
        useMapbox('cbre-map', (map) => {
                map.setStyle(
                        mapStore.mapLanguage.setLanguage(map.getStyle(), MapDefaultOptions.MapLang.value)
                );
                map.setStyle(MapDefaultOptions.MapStyle.value as string, { diff: false });

                map.setCenter(mapCenter);
                map.setZoom(mapZoom);
                map.setMaxZoom(maxZoom);
                map.setMinZoom(minZoom);
                map.setPitch(mapPitch);
                map.setBearing(mapBearing);

                map.loadImage('/images/pin.png', (error: any, image: any) => {
                        if (error) throw error;
                        if (!map.hasImage('pin')) map.addImage('pin', image);
                });

                map.loadImage('/images/red-pin.png', (error: any, image: any) => {
                        if (error) throw error;
                        if (!map.hasImage('redPin')) map.addImage('redPin', image);
                });

        })

        setTimeout(() => {
                isResetting.value = false
        }, 1000)
}



const onChangeStyle = (tileStyle: string) => {
        isLoading.value = true
        useMapbox('cbre-map', (map) => {
                map.loadImage('/images/pin.png', (error: any, image: any) => {
                        if (error) throw error;
                        if (!map.hasImage('pin')) map.addImage('pin', image);
                });

                map.loadImage('/images/red-pin.png', (error: any, image: any) => {
                        if (error) throw error;
                        if (!map.hasImage('redPin')) map.addImage('redPin', image);
                });

                map.setStyle(tileStyle, { diff: false });


        })

        setTimeout(() => {
                isLoading.value = false
        }, 1000)


}

const onChangeLanguage = (language: string) => {

        useMapbox('cbre-map', (map) => {
                map.setStyle(
                        mapStore.mapLanguage.setLanguage(map.getStyle(), language)
                );
        })

}
const isMounting = ref(true)
onMounted(() => {
        isMounting.value = true
        useMapbox('cbre-map', (map) => {
                if (mapStyleRef.value) {
                        const control = defineMapboxControl((_map) => {
                                return mapStyleRef.value as HTMLElement;
                        }, (map) => { })



                        map.addControl(control, "top-left");

                }
        })

        setTimeout(() => {
                isMounting.value = false
        }, 1000)

})


</script>

<style scoped>
.mapStyle {
        position: relative;
}

.mapboxgl-mapStyle-list {
        position: absolute;
        top: 0px;
        left: 50px;
        padding: 10px;
        background: white;
        box-sizing: border-box;
        border-width: 2px;
        border-style: solid;
        border-color: #e5e7eb;
        border-radius: 5px;
}

.mapStyle-table tr {
        height: 60px;
}

.mapStyle-table .td-data {
        padding-left: 20px;
}

.mapStyle-table select {
        outline: none;

}

.mapStyle-table select option {
        text-align: center;
        
}

:root {
        --slider-connect-bg: #17E88F50;
        --slider-tooltip-bg: #778F9C;
        --slider-handle-ring-color: #3B82F630;
}
</style>