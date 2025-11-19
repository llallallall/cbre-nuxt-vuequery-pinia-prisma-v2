<template>
        <div id="PageLayout" class="bg-gray-100 h-screen">
                <div id="TopMenu" class="fixed top-0 w-full h-[80px] 
                flex justify-between items-stretch 
                px-2 sm:px-4 md:px-6 lg:px-10 
                transition-all duration-500
                bg-white text-darkgreen border-gray-200 border-b z-20
                ">
                        <div id="LeftMenu" class="flex items-center w-full h-full z-20">
                                <div class=" min-w-[110px] flex items-center justify-center" @click="navigateTo('/')">

                                        <IconCBRELogo width="80px" height="25px" class="text-inherit" />
                                        <sub class="text-[14px] font-calibreBold translate-y-1 ml-1">Map</sub>
                                </div>
                                <div class="ml-[10px] h-[30px] pt-[8px] font-calibre ">
                                        <span class="hidden md:flex whitespace-nowrap">Asset Management System</span>
                                        <span class="flex md:hidden whitespace-nowrap">AMS</span>
                                </div>

                        </div>
                        <div id="right-menu" class="flex z-20 h-full">

                                <div @click="navigateTo('/')"
                                        class="group flex items-center px-4 h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">

                                        <div class="relative font-calibre pl-2 translate-y-1">
                                                <span class="
                                                        flex items-center 
                                                        min-w-[20px] 
                                                        pointer-events-none 
                                                        absolute inset-0 left-0 
                                                        scale-150 md:scale-100
                                                        -translate-y-2 md:-translate-y-0 
                                                        translate-x-0 md:-translate-x-2 
                                                        
                                                        ">

                                                        <Icon name="ph:caret-double-left" size="14"
                                                                class="text-gray-400 group-hover:text-primary" />
                                                </span>

                                                <div class="hidden md:flex flex-1 w-full text-right 
                                                        whitespace-nowrap">Search Results</div>

                                        </div>
                                </div>

                                <div v-if="dataStore.previousAssetId && (dataStore.previousAssetId !== dataStore.currentAssetId)"
                                        @click="goPrevious()"
                                        class="group flex items-center px-4 h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">
                                        <div class="relative font-calibre pl-2 translate-y-1">
                                                <span class="flex items-center 
                                                        min-w-[20px] 
                                                        pointer-events-none 
                                                        absolute inset-0 left-0 
                                                        scale-150 md:scale-100
                                                        -translate-y-2 md:-translate-y-0 
                                                        translate-x-0 md:-translate-x-2 
                                                        ">
                                                        <Icon name="ph:caret-left" size="14"
                                                                class="text-gray-400 group-hover:text-primary" />
                                                </span>

                                                <div class="hidden md:flex flex-1 w-full text-right 
                                                        whitespace-nowrap">Previous</div>

                                        </div>
                                </div>

                                <div v-if="dataStore.nextAssetId && (dataStore.nextAssetId !== dataStore.currentAssetId)"
                                        @click="goNext()"
                                        class="group flex items-center px-4 h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">
                                        <div class="relative font-calibre pr-2 translate-y-1">
                                                <span class="
                                                        flex items-center 
                                                        min-w-[20px] 
                                                        pointer-events-none 
                                                        absolute inset-0 
                                                        left-0 md:right-0 
                                                        scale-150 md:scale-100
                                                        -translate-y-2 md:-translate-y-0 
                                                        translate-x-0 md:translate-x-8
                                                        ">

                                                        <Icon name="ph:caret-right" size="14"
                                                                class="text-gray-400 group-hover:text-primary" />
                                                </span>

                                                <div class="hidden md:flex flex-1 w-full text-right 
                                                        whitespace-nowrap">Next</div>

                                        </div>
                                </div>

                                <!-- user menu -->

                                <NavUserMenu />

                        </div>

                </div>
                <main class="relative ">
                        <slot />
                </main>
        </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
const route = useRoute()
// console.log(route.meta.title)
useHead({
        title: `${route.meta.title}`,
        meta: [
                { property: 'title', content: `App Name - ${route.meta.title}` },
                { property: 'og:title', content: `App Name - ${route.meta.title}` },
        ]
})

const router = useRouter();
import { useDataStore } from '~/stores/data';
const dataStore = useDataStore()

const goPrevious = () => {
        if (dataStore.setAssetNav(dataStore.previousAssetId)) router.push({ path: "/asset/" + dataStore.previousAssetId });
}

const goNext = () => {
        if (dataStore.setAssetNav(dataStore.nextAssetId)) router.push({ path: "/asset/" + dataStore.nextAssetId });
}
</script>

<style scoped></style>