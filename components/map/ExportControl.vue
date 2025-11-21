<template></template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useMapbox } from '#imports';
import '@watergis/mapbox-gl-export/css/styles.css';

onMounted(async () => {
        if (process.client) {
                const MapboxExport = await import('@watergis/mapbox-gl-export');
                useMapbox('cbre-map', (map) => {
                        const exportCtrl = new MapboxExport.MapboxExportControl({
                                PageSize: MapboxExport.Size.A3,
                                PageOrientation: MapboxExport.PageOrientation.Portrait,
                                Format: MapboxExport.Format.PNG,
                                DPI: MapboxExport.DPI[96],
                                Crosshair: true,
                                PrintableArea: true,
                        });
                        map.addControl(exportCtrl, 'top-left');
                });
        }
});
</script>