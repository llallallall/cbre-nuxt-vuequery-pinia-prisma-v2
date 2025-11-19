<template>
        <div id="DataCenterLayout" class="bg-gray-100 h-screen">
                <div id="TopMenu" class="fixed top-0 w-full h-[80px] 
                flex justify-between items-stretch 
                px-2 sm:px-4 md:px-6 lg:px-10 
                transition-all duration-500
                bg-white text-darkgreen border-gray-200 border-b z-20
                ">
                        <div id="LeftMenu" class="flex items-center h-full z-20">
                                <div class=" min-w-[110px] flex items-center justify-center" @click="navigateTo('/')">

                                        <IconCBRELogo width="80px" height="25px" class="text-inherit" />
                                        <sub class="text-[14px] font-calibreBold translate-y-1 ml-1">Map</sub>
                                </div>
                                <div class="ml-[10px] h-[30px] pt-[8px] font-calibre ">
                                        <span class="hidden md:flex whitespace-nowrap">Asset Management System</span>
                                        <span class="flex md:hidden whitespace-nowrap">AMS</span>
                                </div>

                        </div>
                        <div id="right-menu" class="flex justify-end z-20 h-full items-center text-[14px] ">


                                <ul class="list-none flex gap-5 whitespace-nowrap" v-for="(item, index) in datacenterMenu">
                                        <li :class="(route.path === item.path ? 'font-calibreBold' : 'font-calibre')"
                                                class="mx-2" :key="index">
                                                <NuxtLink :to="item.path">{{ item?.title }}</NuxtLink>
                                        </li>
                                </ul>
                                <!-- user menu -->
                                <NavUserMenu />

                        </div>

                </div>
                <main class="relative mt-[80px] h-[100vh-80px]">

                        <slot />


                </main>

                <Head>
                        <Title>{{ datacenterMenu.filter((el) => el.path == route.path)[0].title.toUpperCase() }}</Title>
                </Head>

        </div>
</template>

<script setup lang="ts">
import { datacenterMenu } from '@/context/datacenter'
useHead({
        title: 'Data and information visualization - CBRE Commercial Real Estate Services',
        meta: [
                { property: 'title', content: 'Data and information visualization - CBRE Commercial Real Estate Services' },
                { property: 'og:title', content: 'Data and information visualization - CBRE Commercial Real Estate Services' },
        ]
})
const route = useRoute()

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BrushComponent, ToolboxComponent } from 'echarts/components';
import {
        LineChart, LinesChart, PieChart, CandlestickChart, BarChart, ScatterChart, RadarChart, MapChart,
        TreeChart, TreemapChart, GraphChart, GaugeChart, FunnelChart, ParallelChart, SankeyChart, BoxplotChart,
        EffectScatterChart, HeatmapChart, PictorialBarChart, ThemeRiverChart, SunburstChart, CustomChart

} from 'echarts/charts';

import {
        TitleComponent,
        TooltipComponent,
        LegendComponent,
} from 'echarts/components';
use([
        BrushComponent,
        ToolboxComponent,
        CanvasRenderer,
        TitleComponent,
        TooltipComponent,
        LegendComponent,
        LineChart, LinesChart, PieChart, CandlestickChart, BarChart, ScatterChart, RadarChart, MapChart,
        TreeChart, TreemapChart, GraphChart, GaugeChart, FunnelChart, ParallelChart, SankeyChart, BoxplotChart,
        EffectScatterChart, HeatmapChart, PictorialBarChart, ThemeRiverChart, SunburstChart, CustomChart
]);

</script>

