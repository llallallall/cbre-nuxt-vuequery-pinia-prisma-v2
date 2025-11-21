<template>
        <div class="group w-full relative select-none bg-white drop-shadow-sm my-2 px-3 py-3 rounded-md cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                @click="handleSelect">

                <div class="flex justify-between items-center mb-2">
                        <div
                                class="w-[calc(100%-40px)] font-bold text-sm text-gray-800 truncate group-hover:text-cbre_primary_1">
                                {{ item?.name || item?.formatted_address }}
                        </div>
                        <div
                                class="w-6 h-6 rounded-full bg-blue-500 text-white flex justify-center items-center text-xs font-bold shadow-sm">
                                G
                        </div>
                </div>

                <div class="flex flex-col gap-1 text-xs text-gray-500">
                        <div v-if="item?.category" class="flex items-center text-cbre_primary_1 font-medium mb-0.5">
                                {{ formatCategory(item.category) }}
                        </div>

                        <div class="flex items-center">
                                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                                <span class="truncate">{{ item?.address || item?.formatted_address }}</span>
                        </div>

                        <div class="flex items-center mt-1 opacity-70">
                                <Icon name="ph:map-pin" size="12" class="mr-1" />
                                <span>{{ item?.latitude }}, {{ item?.longitude }}</span>
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { useMapStore } from '~/stores/map';

const props = defineProps<{
        item: {
                name?: string;
                formatted_address?: string;
                category?: string; // types[0]
                address?: string;
                province?: string;
                latitude: number | string;
                longitude: number | string;
                [key: string]: any;
        }
}>();

const mapStore = useMapStore();

const handleSelect = () => {
        const lat = Number(props.item.latitude);
        const lng = Number(props.item.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
                mapStore.setPinCoordinate(lng, lat);
                mapStore.toggleSearchedMarker(lng, lat);
        }
};

// Google Place Type 포맷팅 (예: "administrative_area_level_1" -> "Administrative Area")
const formatCategory = (cat: string) => {
        if (!cat) return '';
        return cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
</script>