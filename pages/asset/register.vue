<template>
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
                                        <AssetRegisterFloor :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>
                                <TabPanel class='w-full p-10'>
                                        <AssetRegisterPhoto :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>
                                <TabPanel class='w-full p-10'>
                                        <AssetRegisterFile :tabIndex="selectedTab" @next="changeTab" />
                                </TabPanel>

                        </TabPanels>


                </TabGroup>
        </div>
</template>

<script setup lang="ts">

definePageMeta({
        middleware: "auth",
        layout: 'admin-layout',
});

import { usePropertyStore } from '~/stores/property';
const propertyStore = usePropertyStore();

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { adminAssetMenuCategory } from '~/context/menu';
const selectedTab = ref(0)


const changeTab = (index: number) => {
        selectedTab.value = index
}
const handleClick = (index: number) => {
        categories.value.forEach((el) => el.active = false)
        categories.value.filter((el) => {
                if (el.index === index) {
                        el.active = true
                }
        })

}

const categories = ref(adminAssetMenuCategory)

</script>

<style>
.formkit-outer[data-type='multi-step']>.formkit-wrapper {
        max-width: 100%
}
</style>