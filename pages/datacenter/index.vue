<template>
        <div class="w-screen h-screen flex-col items-center pt-[10vh]">
                <div class="title font-calibre text-white text-center ">
                        <div class="text-5xl ">CBRE Korea
                        </div>
                        <div class="text-2xl">Asset Management System
                        </div>
                </div>
                <div class="section-wrapper grid grid-cols-2 pt-[10vh]">
                        <div class="left-section p-5">

                                <div class="sector-title bg-[#16e88f] text-3xl px-8 py-2 rounded-lg">
                                        <icon name="pixelarticons:buildings" size="40" />
                                        <span class="uppercase ml-2 ">office sector</span>
                                </div>
                                <div class="w-full grid grid-cols-3 pt-[5vh]">
                                        <div v-for="(item, index) in data.filter((el) => el.sector === 'office')[0].dataSet">
                                                <div :key="item.id" class="flex-col text-center py-5">
                                                        <div class="uppercase text-md font-calibreLight pb-3">{{ item.title }}
                                                        </div>
                                                        <div class="text-3xl pb-1">
                                                                <NumberCountUp :number="item.value" :unit="item.unit" />
                                                        </div>
                                                        <div class="text-sm font-calibreLight">{{ item?.quarter ? 'Q' +
                                                                item?.quarter : '' }} {{
                item.year }}
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                        <div class="right-section p-5">



                                <div class="sector-title bg-[#16e88f] text-3xl px-8 py-2 rounded-lg">
                                        <icon name="cil:truck" size="40" />
                                        <span class="uppercase ml-2">logistics sector</span>
                                </div>
                                <div class="w-full grid grid-cols-3 pt-[5vh]">
                                        <div v-for="(item, index) in data.filter((el) => el.sector === 'logistics')[0].dataSet">
                                                <div :key="item.id" class="flex-col text-center py-5">
                                                        <div class="uppercase text-md font-calibreLight pb-3">{{ item.title }}
                                                        </div>
                                                        <div class="text-3xl pb-1">
                                                                <NumberCountUp :number="item.value" :unit="item.unit" />
                                                        </div>
                                                        <div class="text-sm font-calibreLight">{{ item?.quarter ? 'Q' +
                                                                item?.quarter : '' }} {{
                item.year }}
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>

                </div>
                <div class="bottom-menu">
                        <ul class="list-none flex gap-5 whitespace-nowrap" v-for="(item, index) in datacenterMenu">
                                <li :class="(route.path === item.path ? 'font-calibreBold' : 'font-calibre')" class="mx-2"
                                        :key="index">
                                        <!-- <NuxtLink :to="item.path">{{ item?.title }}</NuxtLink> -->
                                        <a :href="item.path">{{ item?.title }}</a>
                                </li>
                        </ul>
                </div>
        </div>
</template>

<script setup lang="ts">
//@ts-ignore
definePageMeta({
        middleware: "auth",
        layout: 'empty-layout',
});

//@ts-ignore
useHead({
        title: 'Data and information visualization - CBRE Commercial Real Estate Services',
        meta: [
                { property: 'title', content: 'Data and information visualization - CBRE Commercial Real Estate Services' },
                { property: 'og:title', content: 'Data and information visualization - CBRE Commercial Real Estate Services' },
        ]
})
import { datacenterMenu } from '@/context/datacenter'
const route = useRoute()
const data = ref([{
        sector: 'office',
        dataSet: [
                {
                        id: 'totalStock',
                        title: 'total stock(\'000 sqm)',
                        value: 8666000,
                        unit: 'thousand',
                        year: 2022,
                        quarter: 4
                },
                {
                        id: 'avgVacancyRate',
                        title: 'avg. vacancy rate',
                        value: 1.20,
                        unit: 'percent',
                        year: 2022,
                        quarter: 4
                },
                {
                        id: 'supply',
                        title: 'supply(\'000 sqm)',
                        value: 1071000,
                        unit: 'thousand',
                        year: 2023,
                },
                {
                        id: 'primeYield',
                        title: 'prime yield(\'000 sqm)',
                        value: 4.16,
                        unit: 'percent',
                        year: 2022,
                        quarter: 4
                },
                {
                        id: 'capitalValue',
                        title: 'total stock(\'000 sqm)',
                        value: 10366794,
                        unit: 'number',
                        year: 2022,
                        quarter: 4
                },
                {
                        id: 'newEffctiveRent',
                        title: 'total stock(\'000 sqm)',
                        value: 28046,
                        unit: 'number',
                        year: 2022,
                        quarter: 4
                }
        ]
}, {
        sector: 'logistics',
        dataSet: [

                {
                        id: 'totalStock',
                        title: 'total stock(\'000 sqm)',
                        value: 15339000,
                        unit: 'thousand',
                        year: 2022,
                        quarter: 4
                },


                {
                        id: 'avgVacancyRate',
                        title: 'avg. vacancy rate',
                        value: 10.0,
                        unit: 'percent',
                        year: 2022,
                        quarter: 4
                },

                {
                        id: 'supply',
                        title: 'supply(\'000 sqm)',
                        value: 6146000,
                        unit: 'thousand',
                        year: 2023,
                },

                {
                        id: 'primeYield',
                        title: 'prime yield(\'000 sqm)',
                        value: 4.80,
                        unit: 'percent',
                        year: 2022,
                        quarter: 4
                },

                {
                        id: 'capitalValue',
                        title: 'total stock(\'000 sqm)',
                        value: 25640368,
                        unit: 'number',
                        year: 2022,
                        quarter: 4
                },
                {
                        id: 'newEffctiveRent',
                        title: 'total stock(\'000 sqm)',
                        value: 10257,
                        unit: 'number',
                        year: 2022,
                        quarter: 4
                }
        ]
}])

</script>

<style scoped>
.section-wrapper {
        position: relative;
        width: 100%;
        color: white;
        min-width: 100%;

}

.left-section,
.right-section {
        min-height: 30vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        /* border: 1px white solid; */
}

.bottom-menu {
        position: fixed;
        bottom: 10vh;
        color: white;
        display: flex;
        justify-content: space-between;
        padding: 0 5vw;
        text-align: center;
        width: 100%;
}
</style>