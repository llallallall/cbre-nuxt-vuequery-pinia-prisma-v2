<template>
        <div id="location-map-section" class="font-financier text-2xl mb-4 text-primary">
                Location Description
        </div>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="location?.addressFull" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Address :
                        </div>
                        <div class="flex-1">
                                {{ location.addressFull }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="location?.addressFullJibun && location?.addressFullJibun?.trim().length > 0" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Jibun :
                        </div>
                        <div class="flex-1">
                                {{ location.addressFullJibun }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="location?.addressProvince && location?.addressProvince?.trim().length > 0" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Province :
                        </div>
                        <div class="flex-1">
                                {{ location.addressProvince }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="location?.addressCity && location?.addressCity?.trim().length > 0" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                City :
                        </div>
                        <div class="flex-1">
                                {{ location.addressCity }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="location?.latitude" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Latitude :
                        </div>
                        <div class="flex-1">
                                {{ location.latitude }}
                        </div>
                </li>
        </ul>

        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="location?.longitude" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Longitude :
                        </div>
                        <div class="flex-1">
                                {{ location.longitude }}
                        </div>
                </li>
        </ul>

        <div v-if="location?.latitude && location?.longitude" class="detail-map my-10">
                <div ref="mapContainer" style="width: 100%; height: 500px"></div>
        </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import useGoogleMapsApi from '~/composables/useGoogleMapsApi';
import type { LocationType } from '~/types/property.type';

const props = defineProps<{
        location: LocationType | null | undefined
}>();

const mapContainer = ref<HTMLElement | null>(null);
let mapInstance: google.maps.Map | null = null;
let markerInstance: google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null = null;

const initMap = async () => {
        if (!mapContainer.value || !props.location?.latitude || !props.location?.longitude) return;

        try {
                const googleMaps = await useGoogleMapsApi();
                const position = { lat: props.location.latitude, lng: props.location.longitude };

                // 💡 Google Maps 초기화 (Map ID 필요 for AdvancedMarkerElement)
                // Map ID가 없으면 AdvancedMarkerElement가 작동하지 않을 수 있으므로 체크 필요
                // 여기서는 DEMO_MAP_ID 또는 사용자의 Map ID를 사용해야 함. 없으면 기본 Marker 사용.
                const mapOptions: google.maps.MapOptions = {
                        center: position,
                        zoom: 15,
                        mapId: 'DEMO_MAP_ID', // 💡 AdvancedMarkerElement를 위해 필수 (실제 프로젝트 ID로 교체 권장)
                };

                mapInstance = new googleMaps.Map(mapContainer.value, mapOptions);

                // 💡 AdvancedMarkerElement 시도
                if (googleMaps.marker && googleMaps.marker.AdvancedMarkerElement) {
                        markerInstance = new googleMaps.marker.AdvancedMarkerElement({
                                map: mapInstance,
                                position: position,
                                title: 'Property Location',
                        });
                } else {
                        // Fallback to legacy Marker
                        markerInstance = new googleMaps.Marker({
                                map: mapInstance,
                                position: position,
                        });
                }

        } catch (error) {
                console.error('Failed to load Google Maps:', error);
        }
};

onMounted(() => {
        initMap();
});

// 위치 정보가 변경되면 맵 업데이트
watch(() => props.location, () => {
        initMap();
}, { deep: true });

</script>

<style scoped></style>