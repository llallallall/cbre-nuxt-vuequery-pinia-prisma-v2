<template>
        <div ref="mapDrawRef" :class="isMounting ? 'hidden' : 'block'">

        </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMapbox } from '#imports';

const mapDrawRef = ref(null);

const isMounting = ref(true)

//@ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
onMounted(() => {
        isMounting.value = true
        useMapbox('cbre-map', (map) => {
                if (mapDrawRef.value) {

                        var Draw = new MapboxDraw({
                                // other draw options here
                                // ...
                                keybindings: false,
                                touchEnabled: false,
                                controls: {
                                        point: true,
                                        line_string: true,
                                        polygon: true,
                                        combine_features: false,
                                        uncombine_features: false,
                                },
                                styles: [    // ACTIVE (being drawn)
                                        // line stroke
                                        {
                                                "id": "gl-draw-line",
                                                "type": "line",
                                                "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
                                                "layout": {
                                                        "line-cap": "round",
                                                        "line-join": "round"
                                                },
                                                "paint": {
                                                        "line-color": "#D20C0C",
                                                        "line-dasharray": [0.2, 2],
                                                        "line-width": 2
                                                }
                                        },
                                        // polygon fill
                                        {
                                                "id": "gl-draw-polygon-fill",
                                                "type": "fill",
                                                "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                                                "paint": {
                                                        "fill-color": "#D20C0C",
                                                        "fill-outline-color": "#D20C0C",
                                                        "fill-opacity": 0.1
                                                }
                                        },
                                        // polygon mid points
                                        {
                                                'id': 'gl-draw-polygon-midpoint',
                                                'type': 'circle',
                                                'filter': ['all',
                                                        ['==', '$type', 'Point'],
                                                        ['==', 'meta', 'midpoint']],
                                                'paint': {
                                                        'circle-radius': 3,
                                                        'circle-color': '#fbb03b'
                                                }
                                        },
                                        // polygon outline stroke
                                        // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
                                        {
                                                "id": "gl-draw-polygon-stroke-active",
                                                "type": "line",
                                                "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                                                "layout": {
                                                        "line-cap": "round",
                                                        "line-join": "round"
                                                },
                                                "paint": {
                                                        "line-color": "#D20C0C",
                                                        "line-dasharray": [0.2, 2],
                                                        "line-width": 2
                                                }
                                        },
                                        // vertex point halos
                                        {
                                                "id": "gl-draw-polygon-and-line-vertex-halo-active",
                                                "type": "circle",
                                                "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                                                "paint": {
                                                        "circle-radius": 5,
                                                        "circle-color": "#FFF"
                                                }
                                        },
                                        // vertex points
                                        {
                                                "id": "gl-draw-polygon-and-line-vertex-active",
                                                "type": "circle",
                                                "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                                                "paint": {
                                                        "circle-radius": 3,
                                                        "circle-color": "#D20C0C",
                                                }
                                        },

                                        // INACTIVE (static, already drawn)
                                        // line stroke
                                        {
                                                "id": "gl-draw-line-static",
                                                "type": "line",
                                                "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
                                                "layout": {
                                                        "line-cap": "round",
                                                        "line-join": "round"
                                                },
                                                "paint": {
                                                        "line-color": "#000",
                                                        "line-width": 3
                                                }
                                        },
                                        // polygon fill
                                        {
                                                "id": "gl-draw-polygon-fill-static",
                                                "type": "fill",
                                                "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
                                                "paint": {
                                                        "fill-color": "#000",
                                                        "fill-outline-color": "#000",
                                                        "fill-opacity": 0.1
                                                }
                                        },
                                        // polygon outline
                                        {
                                                "id": "gl-draw-polygon-stroke-static",
                                                "type": "line",
                                                "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
                                                "layout": {
                                                        "line-cap": "round",
                                                        "line-join": "round"
                                                },
                                                "paint": {
                                                        "line-color": "#000",
                                                        "line-width": 3
                                                }
                                        }
                                        ,
                                        {
                                                'id': 'highlight-active-points',
                                                'type': 'symbol',
                                                'filter': ['all',
                                                        ['==', '$type', 'Point'],
                                                        ['==', 'meta', 'feature'],
                                                        ['==', 'active', 'true']],
                                                'layout': {
                                                        "icon-image": "redPin",
                                                        "icon-size": 0.9,
                                                        "icon-anchor": 'bottom',
                                                        "icon-ignore-placement": true,
                                                        "icon-allow-overlap": true
                                                },
                                                "paint": {
                                                        "icon-color": "#ff0000",
                                                        "icon-halo-color": "#fff",
                                                        "icon-halo-width": 2
                                                }
                                        },
                                        {
                                                'id': 'points-are-blue',
                                                'type': 'symbol',
                                                'filter': ['all',
                                                        ['==', '$type', 'Point'],
                                                        ['==', 'meta', 'feature'],
                                                        ['==', 'active', 'false']],
                                                'layout': {
                                                        "icon-image": "redPin",
                                                        "icon-size": 0.7,
                                                        "icon-anchor": 'bottom',
                                                        "icon-ignore-placement": true,
                                                        "icon-allow-overlap": true
                                                },
                                                "paint": {
                                                        "icon-color": "#ff0000",
                                                        "icon-halo-color": "#fff",
                                                        "icon-halo-width": 2
                                                }
                                        }
                                ]
                        });

                        map.addControl(Draw, "top-right");



                }
        })

        setTimeout(() => {
                isMounting.value = false
        }, 1000)

})
</script>
