<template>
        <div class="relative w-screen h-screen">
                <div class="h-[0px]">

                        <Head>
                                <Title>{{ title }}</Title>
                                <Meta name="description" :content="title" />
                                <Style type="text/css" children="body { background-color: green; }" />
                        </Head>

                </div>
                <div class="relative  sm:px-0 px-10">
                <TabGroup manual :selectedIndex="selectedTab" @change="changeTab">
                        <TabList
                                class="fixed top-[80px] left-0 w-full space-x-6 bg-[#e6eaea] bg-opacity-75 py-2.5 px-10 backdrop-blur-sm z-10">
                                <Tab v-for="(category, index ) in categories" as="template" :key="index" v-slot="{ selected }">
                                        <button :class="[
                                                'text-sm leading-5 text-primary',
                                                'focus:outline-none focus:ring-0 ',
                                                (selectedTab === index)
                                                        ? 'border-b-2 border-primary '
                                                        : 'border-b-2 hover:border-primary',
                                        ]">
                                                {{ category.name }}
                                        </button>
                                </Tab>
                        </TabList>
 

                        <TabPanels class="w-screen mt-10">
                                <TabPanel class='w-screen p-10 '>
                                        <AssetRegisterGeneral :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>
                                <TabPanel class='w-full p-10'>
                                        <AssetRegisterHistory :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>
                                <TabPanel class='w-full p-10'>
                                        <AssetRegisterProfitability :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>
                                <TabPanel class='w-full p-10'>
                                        <AssetRegisterLocation :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>
                                <TabPanel class='w-full p-10'>
                                        <AssetRegisterAcccessibility :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>
                                <TabPanel class='w-full p-10'>
                                        <AssetRegisterSizes :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>
                                <TabPanel class='w-full p-10'>
                                        <AssetRegisterFacility :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>
                                <TabPanel class='w-full p-10'>
                                        <AssetModifyFloor :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>
                                <TabPanel class='w-full p-10'>
                                        <AssetModifyPhoto :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>
                                <TabPanel class='w-full p-10'>
                                        <AssetModifyFile :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>

                        </TabPanels>


                </TabGroup>
        </div>
        </div>
</template>

<script setup lang="ts">
definePageMeta({
        middleware: "auth",
        layout: 'admin-layout',
});
 
const route = useRoute() as any;

import { storeToRefs } from 'pinia'
import { useDataStore } from '~/stores/data';
const dataStore = useDataStore()
const { getAssetById } = storeToRefs(dataStore)
const item = getAssetById.value(route.params.editId)

import { usePropertyStore } from '~/stores/property';
const propertyStore = usePropertyStore()

// reload property
if(item) {
        if(item.propertyId) propertyStore.propertyId = item.propertyId;
        if(item.propertyName) propertyStore.propertyName = item.propertyName;
        if(item.general) propertyStore.general = item.general;
        if(item.historyList) propertyStore.historyList = item.historyList;
        if(item.profitability) propertyStore.profitability = item.profitability;
        if(item.location) propertyStore.location = item.location;
        if(item.accessibility) propertyStore.accessibility = item.accessibility;
        if(item.sizes) propertyStore.sizes = item.sizes;
        if(item.facility) propertyStore.facility = item.facility;
        if(item.floorList) propertyStore.floorList = item.floorList;
        if(item.photoList) propertyStore.photoList = item.photoList;
        if(item.brochureList) propertyStore.brochureList = item.brochureList;
        if(item.floorPlanPhotoList) propertyStore.floorPlanPhotoList = item.floorPlanPhotoList;
}



const title = ref(item ? item?.propertyName : 'Modify Property')

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { adminAssetMenuCategory } from '~/context/menu';
import { time } from 'echarts';
const selectedTab = ref(0)


const changeTab = (index: number) => {
        selectedTab.value = index
}

const categories = ref(adminAssetMenuCategory)

</script>

<style scoped></style>