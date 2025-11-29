<template>
        <div ref="printArea" class="relative flex w-full h-full">

                <MapboxMap map-id="cbre-map" style="position: relative; width: 100%; height : calc(100vh - 80px);"
                        :options="{
                                accessToken: mapboxAccessToken,
                                style: 'mapbox://styles/mapbox/' + mapStyleId,
                                center: mapCenter,
                                zoom: mapZoom,
                                maxZoom: maxZoom,
                                minZoom: minZoom,
                                pitch: mapStore.mapStyleOptions.MapPitch,
                                bearing: mapStore.mapStyleOptions.MapBearing,
                                antialias: true,
                                attributionControl: false,
                                preserveDrawingBuffer: true,
                                hash: false,
                        }" @load="onMapLoad">

                        <MapboxLayer v-if="propertyStore.initialDataLoaded" :layer="{
                                source: 'composite',
                                id: LAYER_3D_BUILDINGS.id,
                                type: LAYER_3D_BUILDINGS.type as any,
                                filter: LAYER_3D_BUILDINGS.filter,
                                'source-layer': LAYER_3D_BUILDINGS.sourceLayer,
                                minzoom: LAYER_3D_BUILDINGS.minzoom,
                                paint: LAYER_3D_BUILDINGS.paint as any
                        }" />

                        <MapboxLayer v-if="propertyStore.initialDataLoaded" :beforeLayer="LAYER_3D_BUILDINGS.id" :layer="{
                                source: 'cbre-assets',
                                id: LAYER_UNCLUSTERED_POINT.id,
                                type: LAYER_UNCLUSTERED_POINT.type as any,
                                filter: LAYER_UNCLUSTERED_POINT.filter,
                                layout: LAYER_UNCLUSTERED_POINT.layout as any,
                                paint: LAYER_UNCLUSTERED_POINT.paint
                        }" />

                        <MapboxLayer v-if="propertyStore.initialDataLoaded" :beforeLayer="LAYER_UNCLUSTERED_POINT.id"
                                :layer="{
                                        source: 'cbre-assets',
                                        id: LAYER_CLUSTER_COUNT.id,
                                        type: LAYER_CLUSTER_COUNT.type as any,
                                        filter: LAYER_CLUSTER_COUNT.filter,
                                        layout: LAYER_CLUSTER_COUNT.layout as any,
                                        paint: LAYER_CLUSTER_COUNT.paint as any
                                }" />

                        <MapboxLayer v-if="propertyStore.initialDataLoaded" :beforeLayer="LAYER_CLUSTER_COUNT.id"
                                :layer="{
                                        source: 'cbre-assets',
                                        id: LAYER_CLUSTERS.id,
                                        type: LAYER_CLUSTERS.type as any,
                                        filter: LAYER_CLUSTERS.filter,
                                        paint: LAYER_CLUSTERS.paint as any
                                }" />

                        <MapboxSource source-id="cbre-assets" :source="(cbreDataSource as any)" />

                        <MapboxGeolocateControl position="top-left" @error="onGeolocateError" />
                        <MapboxNavigationControl position="top-left" />
                        <MapboxFullscreenControl position="top-right" />

                        <MapStyleControl v-show="propertyStore.initialDataLoaded" />
                        <MapSelectionControl v-show="propertyStore.initialDataLoaded" />
                        <MapDrawControl v-show="propertyStore.initialDataLoaded" />
                        <MapExportControl v-show="propertyStore.initialDataLoaded" />

                </MapboxMap>

                <MapboxMap map-id="cbre-minimap" :class="uiStore.showMiniMap ? 'block' : 'hidden'"
                        style="position: absolute; top:calc(100% - 260px); left:0; width: 220px; height:260px; z-index:10;"
                        :options="{
                                accessToken: mapboxAccessToken,
                                style: 'mapbox://styles/mapbox/' + mapStyleId,
                                center: [128, 36],
                                zoom: 5,
                                maxZoom: 5,
                                minZoom: 5,
                                antialias: true,
                                attributionControl: false,
                                hash: false
                        }">
                        <MapboxLayer :layer="(LAYER_MINIMAP_POINTS as any)" />

                        <MapboxLayer :layer="(LAYER_MINIMAP_HEAT as any)" />
                        <MapboxSource source-id="cbre-minimap-points" :source="(cbreDataSource as any)" />
                </MapboxMap>
        </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useFormat } from '~/composables/useFormat';
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import { mapCenter, mapZoom, maxZoom, minZoom, mapStyleId, LAYER_3D_BUILDINGS, LAYER_CLUSTERS, LAYER_CLUSTER_COUNT, LAYER_UNCLUSTERED_POINT, LAYER_MINIMAP_POINTS, LAYER_MINIMAP_HEAT } from '~/context/mapData';


const mapStore = useMapStore();
const uiStore = useUiStore();
const propertyStore = usePropertyStore();
const { getThumbnailUrl } = useFormat();
const { showToast } = useToast();

const { filterMapPins, flyTo, searchedMarkersChanged } = storeToRefs(mapStore);
const { filteredProperties } = storeToRefs(propertyStore);

const mapRef = useMapboxRef("cbre-map");
const miniMapRef = useMapboxRef("cbre-minimap");
const printArea = ref(null);

// 💡 Runtime Config에서 토큰 가져오기 (Mapbox 오류 해결)
const config = useRuntimeConfig();
const mapboxAccessToken = config.public.mapbox.accessToken || '';

if (mapboxAccessToken) {
    mapboxgl.accessToken = mapboxAccessToken;
}

// 💡 GeoJSON 데이터 소스 생성 (Getter 활용)
const cbreDataSource = computed(() => {
        let assets = propertyStore.getFilteredMapData;

        // 💡 [추가] Keep(Star) 필터링 적용
        if (mapStore.filterMapPins) {
                assets = assets.filter(asset => propertyStore.keptPropertyIds.includes(asset.id));
        }

        const features = assets.map(asset => ({
                type: 'Feature',
                geometry: {
                        type: 'Point',
                        coordinates: [asset.longitude, asset.latitude]
                },
                properties: {
                        propertyId: asset.id,
                        propertyName: asset.name,
                        mainImageUrl: getThumbnailUrl(asset.mainImageUrl), // 썸네일 URL 변환
                        sector: asset.sector || '',
                        subSector: asset.subSector || '',
                        mag: 1,
                        // 필요한 추가 속성들...
                        // grade: asset.grade,
                        // effRatio: asset.effRatio
                }
        }));

        return {
                type: 'geojson',
                data: {
                        type: 'FeatureCollection',
                        features: features
                },
                cluster: true,
                clusterMaxZoom: 12,
                clusterRadius: 50,
        };
});

const onMapLoad = () => {
        propertyStore.initialDataLoaded = true;
};

const onGeolocateError = (e: any) => {
        console.error('Geolocate error event:', e);
        const errorMessage = e?.error?.message || e?.message || 'Failed to retrieve your location.';

        showToast(`Geolocation Error: ${errorMessage} Please check your browser settings.`, 'danger', {
                showIcon: true,
                hideProgressBar: true,
        });
};

// Watchers

// 1. 필터링 변경 감지 -> 지도 소스 업데이트
watch(() => propertyStore.filteredProperties, () => {
        const sourceData = cbreDataSource.value.data;
        // @ts-ignore
        mapRef.value?.getSource('cbre-assets')?.setData(sourceData);
        // @ts-ignore
        miniMapRef.value?.getSource('cbre-minimap-points')?.setData(sourceData);
}, { deep: true });


// 2. 지도 이동 (FlyTo)
watch(flyTo, (nv) => {
        if (nv === true) {
                mapRef.value?.flyTo({
                        center: [Number(mapStore.pinCoordinate.longitude), Number(mapStore.pinCoordinate.latitude)],
                        zoom: mapStore.pinCoordinate.zoom,
                        speed: mapStore.pinCoordinate.speed,
                        curve: mapStore.pinCoordinate.curve
                });
                mapStore.flyTo = false;
        }
});

// 3. 검색 마커 변경 감지
const webSearchedMarkers = ref<mapboxgl.Marker[]>([]);

watch(searchedMarkersChanged, () => {
        // 기존 마커 제거
        if (webSearchedMarkers.value.length > 0) {
                webSearchedMarkers.value.forEach((marker) => marker.remove());
                webSearchedMarkers.value = [];
        }

        // 신규 마커 추가
        if (mapStore.searchedMarkers.length > 0 && mapRef.value) {
                mapStore.searchedMarkers.forEach((item) => {
                        const marker = new mapboxgl.Marker({
                                color: "red",
                                draggable: true
                        })
                                .setLngLat([item.longitude, item.latitude])
                                .addTo(mapRef.value as mapboxgl.Map);

                        webSearchedMarkers.value.push(marker);
                });
        }
});

// Mapbox Lifecycle Hooks
useMapboxBeforeLoad("cbre-map", (map) => {
        mapStore.mapLanguage = new MapboxLanguage({ defaultLanguage: "en" });

        map.loadImage('/images/pin.png', (error, image) => {
                if (error) throw error;
                if (!map.hasImage('pin') && image) map.addImage('pin', image);
        });
        map.loadImage('/images/red-pin.png', (error, image) => {
                if (error) throw error;
                if (!map.hasImage('redPin') && image) map.addImage('redPin', image);
        });
});

useMapbox("cbre-map", (map) => {
        map.addControl(mapStore.mapLanguage);

        // Cluster Click Event
        map.on('click', 'clusters', (e) => {
                const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                const clusterId = features[0].properties?.cluster_id;

                // @ts-ignore
                map.getSource('cbre-assets').getClusterExpansionZoom(clusterId, (err, zoom) => {
                        if (err) return;
                        map.easeTo({
                                // @ts-ignore
                                center: features[0].geometry.coordinates,
                                zoom: zoom
                        });
                });
        });

        // Unclustered Point Click Event (Popup)
        map.on('click', 'unclustered-point', (e) => {
                // @ts-ignore
                const coordinates = e.features[0].geometry.coordinates.slice();
                const props = e.features?.[0].properties;

                if (!props) return;

                // Ensure popup appears over copy being pointed to
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`
                <div class="w-full h-full p-2">
                    <a href="/property/${props.propertyId}" target="_blank" rel="noopener noreferrer">
                        <div class="flex flex-col gap-1">
                            <div class="font-bold text-md mb-1">${props.propertyName}</div>
                            <div class="text-xs text-gray-600">
                                <div>Sector: ${props.sector}</div>
                                <div>SubSector: ${props.subSector}</div>
                            </div>
                             <div class="w-full h-[100px] mt-2 rounded overflow-hidden">
                                <img src="${props.mainImageUrl}" class="w-full h-full object-cover" alt="Property Image" />
                            </div>
                        </div>
                    </a>
                </div>
            `)
                        .addTo(map);
        });

        // Cursor styling
        map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });
        map.on('mouseenter', 'unclustered-point', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'unclustered-point', () => { map.getCanvas().style.cursor = ''; });
});
</script>