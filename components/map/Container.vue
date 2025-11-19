<template>
        <div ref="printArea" class="relative flex w-full h-full">
                <MapboxMap map-id="cbre-map" style="position: relative; width: 100%; height : calc(100vh - 80px);" :options="{
                        style: 'mapbox://styles/mapbox/' + mapStyleId, // style URL
                        center: mapCenter, // starting position
                        zoom: mapZoom, // starting zoom
                        maxZoom: maxZoom,
                        minZoom: minZoom,
                        pitch: mapStore.mapStyleOptions.MapPitch,
                        bearing: mapStore.mapStyleOptions.MapBearing,
                        antialias: true,
                        attributionControl: false,
                        preserveDrawingBuffer: true,  // PDF 출력시 지도 나오게 
                        hash: false,
                }" @load="dataStore.initialDataLoaded = true">

                        <MapboxLayer v-if="dataStore.initialDataLoaded" :layer="{
                                source: 'composite',
                                id: LAYER_3D_BUILDINGS.id,
                                type: LAYER_3D_BUILDINGS.type as any,
                                filter: LAYER_3D_BUILDINGS.filter,
                                'source-layer': LAYER_3D_BUILDINGS.sourceLayer,
                                minzoom: LAYER_3D_BUILDINGS.minzoom,
                                paint: LAYER_3D_BUILDINGS.paint as any
                        }" />

                        <MapboxLayer v-if="dataStore.initialDataLoaded" :beforeLayer="LAYER_3D_BUILDINGS.id" :layer="{
                                source: 'cbre-assets',
                                id: LAYER_UNCLUSTERED_POINT.id,
                                type: LAYER_UNCLUSTERED_POINT.type as any,
                                filter: LAYER_UNCLUSTERED_POINT.filter,
                                layout: LAYER_UNCLUSTERED_POINT.layout as any,
                                paint: LAYER_UNCLUSTERED_POINT.paint
                        }" />

                        <MapboxLayer v-if="dataStore.initialDataLoaded" :beforeLayer="LAYER_UNCLUSTERED_POINT.id" :layer="{
                                source: 'cbre-assets',
                                id: LAYER_CLUSTER_COUNT.id,
                                type: LAYER_CLUSTER_COUNT.type as any,
                                filter: LAYER_CLUSTER_COUNT.filter,
                                layout: LAYER_CLUSTER_COUNT.layout as any,
                                paint: LAYER_CLUSTER_COUNT.paint as any
                        }" />
                       

                        <MapboxLayer v-if="dataStore.initialDataLoaded" :beforeLayer="LAYER_CLUSTER_COUNT.id" :layer="{
                                source: 'cbre-assets',
                                id: LAYER_CLUSTERS.id,
                                type: LAYER_CLUSTERS.type as any,
                                filter: LAYER_CLUSTERS.filter,
                                paint: LAYER_CLUSTERS.paint as any
                        }" />

                        <MapboxSource source-id="cbre-assets" :source="(cbreDataSource as any)" />

                        <MapboxGeolocateControl position="top-left" />
                        <MapboxNavigationControl position="top-left" />
                        <MapboxFullscreenControl position="top-right" />

                        <MapStyleControl v-show="dataStore.initialDataLoaded" />
                        <MapSelectionControl v-show="dataStore.initialDataLoaded" />


                        <MapDrawControl v-show="dataStore.initialDataLoaded" />
                        <MapExportControl v-show="dataStore.initialDataLoaded" />

                    
                </MapboxMap>

                <MapboxMap map-id="cbre-minimap" :class="mapStore.showMiniMap ? 'block' : 'hidden'"
                        style="position: absolute; top:calc(100% - 260px); left:0; width: 220px; height:260px; z-index:10;"
                        :options="{
                                style: 'mapbox://styles/mapbox/' + mapStyleId, // style URL
                                center: [128, 36], // starting position
                                zoom: 5, // starting zoom
                                maxZoom: 9,
                                minZoom: 5,
                                antialias: true,
                                attributionControl: false,
                                hash: false
                        }">


                        <MapboxLayer :layer="{
                                source: 'cbre-minimap-points',
                                id: 'cbre-minimap-points-layer',
                                type: 'circle',
                                paint: {
                                        'circle-radius': [
                                                'interpolate',
                                                ['linear'],
                                                ['zoom'],
                                                7,
                                                ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
                                                16,
                                                ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
                                        ],
                                        'circle-color': [
                                                'interpolate',
                                                ['linear'],
                                                ['get', 'mag'],
                                                1,
                                                'rgba(0,63,45, 0.0)',
                                                2,
                                                'rgba(0,63,45, 0.4)',
                                                3,
                                                'rgba(0,63,45, 0.5)',
                                                4,
                                                'rgba(0,63,45, 0.6)',
                                                5,
                                                'rgba(0,63,45, 0.7)',
                                                6,
                                                'rgba(0,63,45, 0.8)'
                                        ],
                                        'circle-stroke-color': 'white',
                                        'circle-stroke-width': 1,
                                        'circle-opacity': [
                                                'interpolate',
                                                ['linear'],
                                                ['zoom'],
                                                7,
                                                0,
                                                8,
                                                1
                                        ]
                                }
                        }" />

                        <MapboxLayer :layer="{
                                source: 'cbre-minimap-points',
                                id: 'cbre-minimap-heat-layer',
                                type: 'heatmap',
                                paint: {
                                        // Increase the heatmap weight based on frequency and property magnitude
                                        'heatmap-weight': [
                                                'interpolate',
                                                ['linear'],
                                                ['get', 'mag'],
                                                0,
                                                0,
                                                6,
                                                1
                                        ],
                                        // Increase the heatmap color weight weight by zoom level
                                        // heatmap-intensity is a multiplier on top of heatmap-weight
                                        'heatmap-intensity': [
                                                'interpolate',
                                                ['linear'],
                                                ['zoom'],
                                                0,
                                                1,
                                                9,
                                                3
                                        ],
                                        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                                        // Begin color ramp at 0-stop with a 0-transparancy color
                                        // to create a blur-like effect.
                                        'heatmap-color': [
                                                'interpolate',
                                                ['linear'],
                                                ['heatmap-density'],
                                                0,
                                                'rgba(0,63,45, 0.0)',
                                                0.2,
                                                'rgba(0,63,45, 0.1)',
                                                0.4,
                                                'rgba(0,63,45, 0.2)',
                                                0.6,
                                                'rgba(0,63,45, 0.4)',
                                                0.8,
                                                'rgba(0,63,45, 0.6)',
                                                1,
                                                'rgba(0,63,45, 0.8)'
                                        ],
                                        // Adjust the heatmap radius by zoom level
                                        'heatmap-radius': [
                                                'interpolate',
                                                ['linear'],
                                                ['zoom'],
                                                0,
                                                2,
                                                9,
                                                20
                                        ],
                                        // Transition from heatmap to circle layer by zoom level
                                        'heatmap-opacity': [
                                                'interpolate',
                                                ['linear'],
                                                ['zoom'],
                                                7,
                                                1,
                                                9,
                                                0
                                        ]
                                }
                        }" />




                        <MapboxSource source-id="cbre-minimap-points" :source="{
                                type: 'geojson',
                                data: dataStore.allMapInfos as any,
                        }" />

                </MapboxMap>
        </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';
import { useDataStore } from '~/stores/data';
const mapStore = useMapStore()
const dataStore = useDataStore()

const { showMiniMap, mapStyleOptions, mapLanguage, filtered, filterMapPins, flyTo, searchedMarkersChanged } = storeToRefs(useMapStore());
import { mapCenter, mapZoom, maxZoom, minZoom, mapStyleId, LAYER_3D_BUILDINGS, LAYER_CLUSTERS, LAYER_CLUSTER_COUNT, LAYER_UNCLUSTERED_POINT } from '~/context/data'
import { ref, onBeforeUnmount, watch } from 'vue';
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import mapboxgl from "mapbox-gl";

const mapRef = useMapboxRef("cbre-map");
const miniMapRef = useMapboxRef("cbre-minimap");

const cbreDataSource = ref({
        type: 'geojson',
        data: dataStore.allMapInfos,
        cluster: true,
        clusterMaxZoom: 12, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
});


const printArea = ref(null)


watch(filtered, (nv, ov) => {

        if (nv !== ov) {
                //@ts-ignore
                mapRef.value?.getSource('cbre-assets').setData(dataStore.filteredMapInfos)
                //@ts-ignore
                miniMapRef.value?.getSource('cbre-minimap-points').setData(dataStore.filteredMapInfos);


        } else {
                //@ts-ignore
                mapRef.value?.getSource('cbre-assets').setData(dataStore.allMapInfos)
                //@ts-ignore
                miniMapRef.value?.getSource('cbre-minimap-points').setData(dataStore.allMapInfos);
        }
})

watch(flyTo, (nv, ov) => {
        if (nv === true) {
                mapRef.value?.flyTo(
                        {
                                center: [Number(mapStore.pinCoordinate.longitude), Number(mapStore.pinCoordinate.latitude)],
                                zoom: mapStore.pinCoordinate.zoom,
                                speed: mapStore.pinCoordinate.speed,
                                curve: mapStore.pinCoordinate.curve
                        }

                )
                flyTo.value = false
        }
})

watch(filterMapPins, (nv, ov) => {

        if (nv === true) {

                let mapData = new Object() as any;
                //@ts-ignore
                mapData.crs = dataStore.filteredMapInfos.crs
                //@ts-ignore
                mapData.type = dataStore.filteredMapInfos.type
                //@ts-ignore
                mapData.features = dataStore.filteredMapInfos.features.filter((el) => dataStore.keptAssetIds.includes(el.properties.propertyId))

                //@ts-ignore
                mapRef.value?.getSource('cbre-assets').setData(mapData)
                //@ts-ignore
                miniMapRef.value?.getSource('cbre-minimap-points').setData(mapData);
        } else {
                //@ts-ignore
                mapRef.value?.getSource('cbre-assets').setData(dataStore.filteredMapInfos)
                //@ts-ignore
                miniMapRef.value?.getSource('cbre-minimap-points').setData(dataStore.filteredMapInfos);
        }

})
const webSearchedMarkers = ref([])
watch(searchedMarkersChanged, (nv, ov) => {

        console.log('진입 ')
        if (webSearchedMarkers.value.length > 0) {
                console.log('기존 핀 제거')
                webSearchedMarkers.value.forEach((item:any) => {
                        //@ts-ignore
                        item.remove()
                })
        }

        if (nv !== ov) {
                //@ts-ignore
                let map = mapRef.value as mapboxgl.Map
                console.log(mapStore.searchedMarkers.length)
                if (mapStore.searchedMarkers.length > 0) {



                        console.log('신규 핀 추가')
                        mapStore.searchedMarkers.forEach((item: { longitude: number, latitude: number }) => {
                                let marker = new mapboxgl.Marker({
                                        color: "red",
                                        draggable: true
                                }).setLngLat([item.longitude, item.latitude])
                                        .addTo(map);
                                //@ts-ignore        
                                webSearchedMarkers.value.push(marker)
                        })




                }
                //@ts-ignore
                //mapRef.value?.getSource('cbre-assets').setData(dataStore.filteredMapInfos)
        }
})



useMapboxBeforeLoad("cbre-map", (map) => {

        mapStore.mapLanguage = new MapboxLanguage(
                { defaultLanguage: "en" }
        )


        map.loadImage('/images/pin.png', (error: any, image: any) => {
                if (error) throw error;
                if (!map.hasImage('pin')) map.addImage('pin', image);
        });

        map.loadImage('/images/red-pin.png', (error: any, image: any) => {
                if (error) throw error;
                if (!map.hasImage('redPin')) map.addImage('redPin', image);
        });
})


useMapbox("cbre-map", (map) => {

        map.addControl(mapStore.mapLanguage);

        map.on('styleimagemissing', () => {
                map.loadImage('/images/pin.png', (error: any, image: any) => {
                        if (error) throw error;
                        if (!map.hasImage('pin')) map.addImage('pin', image);
                });

                map.loadImage('/images/red-pin.png', (error: any, image: any) => {
                        if (error) throw error;
                        if (!map.hasImage('redPin')) map.addImage('redPin', image);
                });
        });

        // inspect a cluster on click
        map.on('click', 'clusters', (e : any) => {
                const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
        });

        //@ts-ignore
        const clusterId = features[0].properties.cluster_id;

        //@ts-ignore
        map.getSource('cbre-assets').getClusterExpansionZoom(clusterId, (err : any, zoom : number) => {
                if (err) return;
                
                        map.easeTo({
                                //@ts-ignore
                                center: features[0].geometry.coordinates,
                                zoom: zoom
                                });
                        }
                );
        });


        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', (e:any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        
      

        const propertyId = e.features[0].properties.propertyId 

        const sector = e.features[0].properties.sector ?? '' 
        const sector_visibility = sector.toString().trim().length > 0 ? 'block' : 'hidden'

        const subSector = e.features[0].properties.subSector ?? '' 
        const subSector_visibility = subSector.toString().trim().length > 0 ? 'block' : 'hidden'

        const propertyName = e.features[0].properties.propertyName 
        const propertyName_visibility = propertyName.toString().trim().length > 0 ? 'block' : 'hidden'

        const mainImageUrl = e.features[0].properties.mainImageUrl 
        const mainImageUrl_visibility = mainImageUrl.toString().trim().length > 0 ? 'block' : 'hidden'

        const province = e.features[0].properties.province ?? '' 
        const province_visibility = province.toString().trim().length > 0 ? 'block' : 'hidden'

        const city = e.features[0].properties.city ?? ''
        const city_visibility = city.toString().trim().length > 0 ? 'block' : 'hidden'

        const grade = (e.features[0].properties.grade).toUpperCase() 
        const grade_visibility = city.toString().trim().length > 0 ? 'block' : 'hidden'

        const effRatio = e.features[0].properties.effRatio 
        const effRatio_visibility = city.toString().trim().length > 0 ? 'block' : 'hidden'

        
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
                `<div class="w-full h-full">
                        <a href="/asset/${propertyId}" target="_blank" rel="noopener noreferrer">
                                <div class="w-full flex flex-col" >
                                        <div class="font-notoSansBold text-md py-2 ${propertyName_visibility}">${propertyName}</div>
                                        <div class="font-notoSans text-xs grid grid-cols-1 gap-1">
                                                <div class="w-full flex justify-between ${grade_visibility}">
                                                        <span>Grade :</span>
                                                        <span>${grade}</span>
                                                </div>
                                                <div class="w-full flex justify-between ${effRatio_visibility}">
                                                        <span>Eff. Ratio :</span>
                                                        <span>${effRatio}%</span>
                                                </div>
                                                <div class="w-full flex justify-between ${sector_visibility}">
                                                        <span>Sector :</span>
                                                        <span>${sector}</span>
                                                </div>
                                                <div class="w-full flex justify-between ${subSector_visibility}">
                                                        <span>SubSector :</span>
                                                        <span>${subSector}</span>
                                                </div>
                                                <div class="w-full flex justify-between ${province_visibility}">
                                                        <span>Province :</span>
                                                        <span>${province}</span>
                                                </div>
                                                <div class="w-full flex justify-between ${city_visibility}">
                                                        <span>City :</span>
                                                        <span>${city}</span>
                                                </div>
                                        </div>
                                        <div class="w-full max-h-[100px] py-2 ${mainImageUrl_visibility}" >
                                                <img src="${mainImageUrl}" class="object-fit" />
                                        </div>
                                </div>
                        </a>
                </div>`
        )
        .addTo(map);
        });
        
        map.on('mouseenter', 'clusters', () => {
                map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
                map.getCanvas().style.cursor = '';
        });

        

})


// useMapbox("cbre-minimap", (map) => {
//         // console.log(map)

// })

</script>
