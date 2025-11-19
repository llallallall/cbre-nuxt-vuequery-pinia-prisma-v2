<template></template>

<script setup lang="ts">

import { onMounted } from 'vue';
import { useMapbox } from '#imports';
import '@watergis/mapbox-gl-export/css/styles.css';

onMounted(() => {
        setTimeout(async () => {
                if (process.client) {

                        const MapboxExport = await import('@watergis/mapbox-gl-export')
                        useMapbox('cbre-map', (map) => {

                                map.addControl(new MapboxExport.MapboxExportControl({
                                        PageSize: MapboxExport.Size.A3,
                                        PageOrientation: MapboxExport.PageOrientation.Portrait,
                                        Format: MapboxExport.Format.PNG,
                                        DPI: MapboxExport.DPI[96],
                                        Crosshair: true,
                                        PrintableArea: true
                                }), 'top-left');

                        })

                }

        }, 500)

})


</script>

