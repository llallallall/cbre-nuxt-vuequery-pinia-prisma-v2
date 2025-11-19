<template>
        <div class="group w-full h-full relative select-none bg-white drop-shadow-lg my-2 px-2 py-4">
                <div class="flex justify-between">
                        <div class="w-[calc(100%-30px)] font-notoSansBold truncate overflow-hidden  hover:underline"
                                @click="mapStore.setPinCoordinate(Number(item.longitude), Number(item.latitude));mapStore.setSearchedMarkers(Number(item.longitude), Number(item.latitude))">
                                {{
                                        item?.name }}</div>
                        <div @click="mapStore.setSearchedMarkers(Number(item.longitude), Number(item.latitude))" class="grade w-[30px] h-[30px] bg-kakao rounded-full 
                        flex justify-center items-center text-primary shadow-md hover:scale-110">
                                K
                        </div>
                </div>
                <div class="addresses flex flex-col w-full text-xs relative">

                        <div class="address 
                                font-barlow text-gray-600 w-full 
                                flex items-center px-2 ">
                                <div class="bg-[#528184] w-[4px] h-[4px] rounded-full overflow-hidden mx-[4px]">
                                </div>
                                <div class="truncate overflow-hidden relative ">
                                        {{ item.category }} {{ item.place_name }} {{ item.street }}</div>
                        </div>
                        <div v-if="item.address" class="address 
                                font-barlow text-gray-600 w-full 
                                flex items-center px-2 ">
                                <div class="bg-[#528184] w-[4px] h-[4px] rounded-full overflow-hidden mx-[4px]">
                                </div>
                                <div class="truncate overflow-hidden relative ">
                                        {{ item.address }}</div>
                        </div>

                        <div v-if="item.road_address" class="address 
                                font-barlow text-gray-600 w-full 
                                flex items-center px-2 ">
                                <div class="bg-[#528184] w-[4px] h-[4px] rounded-full overflow-hidden mx-[4px]">
                                </div>
                                <div class="truncate overflow-hidden relative ">
                                        {{ item.road_address }}</div>
                        </div>
                        <div class="address 
                                font-barlow text-gray-600 w-full 
                                flex items-center px-2 ">
                                <div class="bg-[#528184] w-[4px] h-[4px] rounded-full overflow-hidden mx-[4px]">
                                </div>
                                <div class="truncate overflow-hidden relative ">
                                        lng: {{ item?.longitude }}, lat : {{ item?.latitude }} </div>
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
const { item } = defineProps({
        item: {
                required: true,
                type: Object
        }
})

import { useMapStore } from '~/stores/map';
const mapStore = useMapStore()
</script>

<style scoped></style>