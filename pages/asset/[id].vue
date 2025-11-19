<template>
        <div class="relative w-screen h-screen">
                <div class="h-[80px]">

                        <Head>
                                <Title>{{ title }}</Title>
                                <Meta name="description" :content="title" />
                                <Style type="text/css" children="body { background-color: green; }" />
                        </Head>

                </div>


                <div class="detail-card-contents w-full h-full
                                                                p-6 pb-[100px]
                                                                overflow-y-scroll 
                                                                bg-white 
                                                                text-left align-middle 
                                                                transform transition-all 
                                                                relative">

                        <div ref="detailCardPrintAreaRef" class="w-full p-0 m-0 relative overflow-y-scroll">

                                <div class="detail-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6
                                        text-primary">
                                        {{ item?.propertyName }}

                                </div>

                                <div class="mt-6 flex gap-5 relative flex-col lg:flex-row">

                                        <div class="w-full lg:w-1/2 flex flex-col">

                                                <AssetDetailActionSlide :item="(item as any)" />
                                        </div>
                                        <div class="w-full lg:w-1/2 h-full flex flex-col justify-start">
                                                <div class="remarks -mt-2 border-b border-gray-200 pb-2">

                                                        <AssetDetailGeneral :item="(item as any)" />
                                                </div>
                                                <div class="highlights mt-4 border-0 border-gray-200 pb-0">
                                                        <AssetDetailHistoryList :item="(item as any)" />
                                                </div>


                                        </div> 
                                </div>

                                <div class="sales relative mt-4 border-b border-gray-200 pb-5" />

                                <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">

                                        <AssetDetailSizesAndMeasurements :item="(item as any)" />


                                </div>

                                <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">

                                        <AssetDetailFacility :item="(item as any)" />


                                </div>

                                <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">

                                        <AssetDetailParking :item="(item as any)" />


                                </div>

                                <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">

                                        <AssetDetailFloorPlanPhotos :item="(item as any)" />


                                </div>

                                <div class="sales relative mt-4 border-b border-gray-200 pb-10">

                                        <AssetDetailFloorDataTable :info="item?.floorList" />


                                </div>



                                <div v-if="item?.transactionInfo && Number(item.transactionInfo.totalTransactions) > 0"
                                        class="sales relative mt-4 border-b border-gray-200 pb-10">

                                        <AssetDetailSales :info="item.transactionInfo" />


                                </div>
                                <div v-if="item?.leaseInfo && Number(item?.leaseInfo.totalLeasesActual) > 0"
                                        class="lease-actual relative mt-4 border-b border-gray-200 pb-10">


                                        <AssetDetailLeaseActual :info="item?.leaseInfo" />


                                </div>
                                <div v-if="item?.leaseInfo && Number(item.leaseInfo.totalLeasesAsking) > 0"
                                        class="lease-asking relative mt-4 border-b border-gray-200 pb-10">

                                        <AssetDetailLeaseAsking :info="item.leaseInfo" />


                                </div>

                                <div class="location mt-4 border-0 border-gray-200 relative">
                                        <AssetDetailLocation :item="(item as any)" />
                                </div>

                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
definePageMeta({
        middleware: "auth",
        layout: 'page-layout',
});


const route = useRoute() as any;


import { storeToRefs } from 'pinia'
import { useDataStore } from '~/stores/data';
const dataStore = useDataStore()
const { getAssetById } = storeToRefs(dataStore)
const item = getAssetById.value(route.params.id)

// console.log(item)

const title = ref(item?.propertyName)

import { useMenuStore } from '~/stores/menu';
const menuStore = useMenuStore()

const detailCardPrintAreaRef = inject('detailCardPrintAreaRef')



</script>

<style scoped></style>