<template>
        <div id="location-map-section" class="font-financier text-2xl mb-4 text-primary">
                Location Description
        </div>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location?.addressFull" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Address :
                        </div>
                        <div class="flex-1">
                                {{ item.location.addressFull }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location?.addressFullJibun?.trim().length > 0" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Jibun :
                        </div>
                        <div class="flex-1">
                                {{ item.location.addressFullJibun }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location?.addressProvince?.trim().length > 0" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Province :
                        </div>
                        <div class="flex-1">
                                {{ item.location.addressProvince }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location?.addressCity?.trim().length > 0" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                City :
                        </div>
                        <div class="flex-1">
                                {{ item.location.addressCity }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location?.latitude" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Latitude :
                        </div>
                        <div class="flex-1">
                                {{ item.location.latitude }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location?.longitude" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Longitude :
                        </div>
                        <div class="flex-1">
                                {{ item.location.longitude }}
                        </div>
                </li>
        </ul>

        <div v-if="item.location?.latitude && item.location?.longitude" class="detail-map my-10">
                <GoogleMap :api-key="runtimeConfig.public.googleApiToken" style="width: 100%; height: 500px"
                        :center="{ lat: item.location.latitude, lng: item.location.longitude }" :zoom="15">
                        <Marker
                                :options="{ position: { lat: item.location.latitude, lng: item.location.longitude } }" />
                </GoogleMap>
        </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#app';
// 💡 수정: 불필요한 Store Import 제거 (MenuStore, PropertyStore 제거)
// 💡 수정: Google Map 컴포넌트 import 방식 확인 (프로젝트 설정에 따라 다름)
// @ts-ignore
import { GoogleMap, Marker } from "vue3-google-map";

const runtimeConfig = useRuntimeConfig();

const props = defineProps({
        item: {
                required: true,
                type: Object // PropertyType
        }
});
</script>

<style scoped></style>