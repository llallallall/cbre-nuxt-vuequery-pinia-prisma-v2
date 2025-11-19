<template>
        <div id="TopMenu" class="fixed top-0 w-full h-[80px] 
                flex justify-between items-stretch 
                px-2 sm:px-4 md:px-6 lg:px-10 
                transition-all duration-500
                
                "
                :class="menuStore.isMenuOverlay ? 'bg-white text-darkgreen border-gray-200 border-b z-20' : 'bg-darkgreen text-white z-50'">
                <div id="LeftMenu" class="flex items-center w-full h-full z-20">
                        <div class=" min-w-[110px] flex items-center justify-center" @click="navigateTo('/')">

                                <IconCBRELogo width="80px" height="25px" class="text-inherit" />
                                <sub class="text-[14px] font-calibreBold translate-y-1 ml-1">Map</sub>
                        </div>
                        <div class="ml-[10px] h-[30px] pt-[8px] font-calibre ">
                                <span class="hidden xl:flex whitespace-nowrap">Asset Management System</span>
                                <span class="flex xl:hidden whitespace-nowrap">AMS</span>
                        </div>
                        <div class="search flex justify-end lg:justify-start 
                                        w-full min-w-[30px] mx-w-full lg:max-w-[300px]
                                        ml-5 lg:mx-5">
                                <!-- pc search -->
                                <div class="hidden lg:flex items-center w-full h-full">

                                        <div class="input-wrapper relative flex-1 hidden 2sm:flex">
                                                <input v-model="searchText" type="text" name="search" autocomplete="off"
                                                        @keyup.enter="onSearchText()" class="peer search-input relative flex-1
                                                text-sm text-white hidden xs:flex border-t-0 border-l-0 border-r-0 border-b-2 
                                                focus:border-b-2  focus:border-white/70 focus:outline-0 
                                                z-20"
                                                        :class="menuStore.isMenuOverlay ? 'border-primary/50 focus:border-b-2 focus:border-primary/70 focus:outline-0' : 'border-white/50'" />
                                                <label v-if="!filterStore.searchKeyword" class="absolute top-0 items-center justify-start 
                                                w-full h-full pl-1
                                                peer-[.search-input]:peer-focus:text-[8px] 
                                                peer-[.search-input]:peer-focus:items-center 
                                                peer-[.search-input]:peer-focus:-top-4
                                                z-0 hidden sm:flex
                                                 transition-all
                                                text-[12px]  
                                                "
                                                        :class="menuStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                        Search&nbsp;<span class="hidden 2md:flex">by Name, Address</span>
                                                        <span class="hidden sm:flex 2md:hidden">...</span>
                                                </label>
                                        </div>


                                        <div v-if="filterStore.searchKeyword === ''" class="magnifier hidden 2sm:flex z-50"
                                                @click="onSearchText()">
                                                <IconMagnifier width=" 18px" height="18px"
                                                        class="text-inherit hover:text-accent " />
                                        </div>

                                        <div v-else class="magnifier hidden 2sm:flex cursor-pointer z-50"
                                                @click="onResetKeyword()">
                                                <icon name="ic:sharp-close" size="18" class="text-gray-400" />
                                        </div>

                                </div>

                                <!-- mobile text search -->
                                <div class="flex lg:hidden justify-end items-center px-[10px] h-full min-w-[60px]
                                        hover:bg-gray-200/20 hover:underline hover:decoration-primary/50"
                                        @click="openMenu('textSearchPannel')">
                                        <div class="relative mt-1 select-none font-calibre ">
                                                <div class="relative cursor-default rounded-lg py-2 translate-y-[2px]">
                                                        <div class="absolute top-0 right-1 font-calibreLight text-xs -translate-y-2 whitespace-nowrap"
                                                                :class="menuStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                                Search</div>
                                                        <div
                                                                class="flex-1 flex justify-end translate-y-1 whitespace-nowrap h-[24px]">
                                                                <IconMagnifier width="18px" height="18px"
                                                                        class="hover:text-accent "
                                                                        :class="openTextSearchPannel === true ? 'text-accent' : (menuStore.isMenuOverlay ? 'text-primary/50' : 'text-white/80')" />
                                                        </div>

                                                </div>
                                        </div>

                                </div>





                        </div>
                </div>
                <div id="right-menu" class="whitespace-nowrap z-20">
                        <div class="hidden sm:inline-flex justify-center items-center -translate-y-1
                                px-[10px]  lg:px-[14px] h-full 
                                hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">

                                <Listbox v-model="selectedTransaction">
                                        <div class="relative mt-1 font-calibre z-50">
                                                <ListboxButton class="relative 
                                               cursor-default py-2"
                                                        @click="openMenu('transaction'); filterStore.filterTransactionType = selectedTransaction.name as string;">
                                                        <div class="absolute top-0 right-0 font-calibreLight text-xs  -translate-y-2  whitespace-nowrap"
                                                                :class="menuStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                                Transaction</div>
                                                        <div class="flex-1 w-full text-right 
                                                        pr-0 lg:pr-8 whitespace-nowrap">{{ selectedTransaction.name
                                                        }}</div>
                                                        <span
                                                                class="hidden lg:flex pointer-events-none absolute inset-y-0 right-0  items-center ">

                                                                <Icon name="ph:caret-up-down" size="14" class="text-gray-400" />
                                                        </span>

                                                </ListboxButton>

                                                <transition leave-active-class="transition duration-100 ease-in"
                                                        leave-from-class="opacity-100" leave-to-class="opacity-0">
                                                        <ListboxOptions
                                                                class="absolute right-0 mt-1 max-h-60 w-36  rounded-sm z-[100] border border-gray-200 bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                <ListboxOption v-slot="{ active, selected }"
                                                                        v-for="type in transaction" :key="type.name"
                                                                        :value="type" as="template">
                                                                        <li :class="[
                                                                                active ? 'bg-primary text-white' : 'text-gray-900',
                                                                                'relative cursor-default select-none py-2 pl-10 pr-4 w-full',
                                                                        ]">
                                                                                <span :class="[
                                                                                        selected ? 'font-medium' : 'font-normal',
                                                                                        'flex-1 whitespace-nowrap',
                                                                                ]">{{ type.name }}</span>
                                                                                <span v-if="selected"
                                                                                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-accent">
                                                                                        <Icon name="ic:round-check"
                                                                                                color="inherite" size="25" />
                                                                                </span>
                                                                        </li>
                                                                </ListboxOption>
                                                        </ListboxOptions>
                                                </transition>
                                        </div>
                                </Listbox>
                        </div>

                        <div class="hidden sm:inline-flex items-center px-[10px]  -translate-y-1 lg:px-[14px]  h-full 
                                hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">
                                <RadioGroup>
                                        <div class="relative mt-1 select-none font-calibre ">
                                                <div class="relative cursor-default rounded-lg py-2"
                                                        @click="openMenu('sectors')">
                                                        <div class="absolute top-0 right-0 font-calibreLight  text-xs -translate-y-2 whitespace-nowrap"
                                                                :class="menuStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                                Sector</div>
                                                        <div class="flex-1 w-full text-right pr-0 lg:pr-8 whitespace-nowrap">
                                                                {{ selectedSectors && selectedSectors.length > 0 ?
                                                                        selectedSectors[0].name + (selectedSectors.length - 1 > 0 ?
                                                                                ` (+${selectedSectors.length - 1})` : '') :
                                                                        'All Types'
                                                                }}</div>
                                                        <span class="pointer-events-none absolute inset-y-0 right-0 
                                                                hidden lg:flex items-center ">
                                                                <Icon name="ph:caret-up-down" size="14" class="text-gray-400" />
                                                        </span>

                                                </div>
                                                <div class="grid grid-cols-2 
                                                absolute top-10 right-0 mt-1 bg-white 
                                                min-w-[200px] cursor-default rounded-sm border border-gray-200 p-2"
                                                        :class="openSectors ? 'block' : 'hidden'">
                                                        <RadioGroupOption @click="createSelectedSectors(option)" as="template"
                                                                v-for="option in sector" :key="option.name" :value="option">

                                                                <div :class="[

                                                                        isSelectedSector(option) ? 'bg-primary text-white ' : 'bg-white ',
                                                                ]"
                                                                        class="relative flex cursor-pointer p-1 focus:outline-none">
                                                                        <div class="flex w-full items-center justify-between">
                                                                                <div class="flex items-center">
                                                                                        <div class="text-sm">
                                                                                                <RadioGroupLabel as="p"
                                                                                                        :class="isSelectedSector(option) ? 'text-white' : 'text-gray-900'"
                                                                                                        class="font-medium">
                                                                                                        {{ option.name
                                                                                                        }}
                                                                                                </RadioGroupLabel>

                                                                                        </div>
                                                                                </div>
                                                                                <div v-show="isSelectedSector(option)"
                                                                                        class="shrink-0 text-white">
                                                                                        <svg class="h-6 w-6" viewBox="0 0 24 24"
                                                                                                fill="none">
                                                                                                <circle cx="12" cy="12" r="12"
                                                                                                        fill="#fff"
                                                                                                        fill-opacity="0.2" />
                                                                                                <path d="M7 13l3 3 7-7"
                                                                                                        stroke="#fff"
                                                                                                        stroke-width="1.5"
                                                                                                        stroke-linecap="round"
                                                                                                        stroke-linejoin="round" />
                                                                                        </svg>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </RadioGroupOption>
                                                </div>
                                        </div>
                                </RadioGroup>

                        </div>

                        <div
                                class="hidden sm:inline-flex items-center px-[10px]  -translate-y-1 lg:px-[14px]  h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">
                                <RadioGroup>
                                        <div class="relative mt-1 select-none font-calibre ">
                                                <div class="relative cursor-default rounded-lg py-2"
                                                        @click="openMenu('subsectors')">
                                                        <div class="absolute flex top-0 right-0 font-calibreLight text-xs -translate-y-2 whitespace-nowrap"
                                                                :class="menuStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                                <div>SubSector</div>

                                                        </div>
                                                        <div class="flex-1 w-full text-right pt-0 lg:pr-8 whitespace-nowrap">
                                                                {{ selectedSubSectors && selectedSubSectors.length > 0 ?
                                                                        selectedSubSectors[0].name + (selectedSubSectors.length - 1 > 0
                                                                                ?
                                                                                ` (+${selectedSubSectors.length - 1})` : '') :
                                                                        'All Types'
                                                                }}</div>
                                                        <span
                                                                class="hidden lg:flex pointer-events-none absolute inset-y-0 right-0  items-center ">
                                                                <Icon name="ph:caret-up-down" size="14" class="text-gray-400" />
                                                        </span>

                                                </div>
                                                <div class="grid grid-cols-2 
                                                absolute top-10 right-0 mt-1 bg-white 
                                                min-w-[300px] cursor-default rounded-sm border border-gray-200 p-2"
                                                        :class="openSubSectors ? 'block' : 'hidden'">
                                                        <RadioGroupOption @click="createSelectedSubSectors(option)"
                                                                as="template" v-for="option in subsector" :key="option.name"
                                                                :value="option">

                                                                <div :class="[

                                                                        isSelectedSubSector(option) ? 'bg-primary text-white ' : 'bg-white ',
                                                                ]"
                                                                        class="relative flex cursor-pointer p-1 focus:outline-none">
                                                                        <div class="flex w-full items-center justify-between">
                                                                                <div class="flex items-center">
                                                                                        <div class="text-sm">
                                                                                                <RadioGroupLabel as="p"
                                                                                                        :class="isSelectedSubSector(option) ? 'text-white' : 'text-gray-900'"
                                                                                                        class="font-medium">
                                                                                                        {{ option.name
                                                                                                        }}
                                                                                                </RadioGroupLabel>

                                                                                        </div>
                                                                                </div>
                                                                                <div v-show="isSelectedSubSector(option)"
                                                                                        class="shrink-0 text-white">
                                                                                        <svg class="h-6 w-6" viewBox="0 0 24 24"
                                                                                                fill="none">
                                                                                                <circle cx="12" cy="12" r="12"
                                                                                                        fill="#fff"
                                                                                                        fill-opacity="0.2" />
                                                                                                <path d="M7 13l3 3 7-7"
                                                                                                        stroke="#fff"
                                                                                                        stroke-width="1.5"
                                                                                                        stroke-linecap="round"
                                                                                                        stroke-linejoin="round" />
                                                                                        </svg>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </RadioGroupOption>
                                                </div>
                                        </div>
                                </RadioGroup>

                        </div>

                        <div
                                class="hidden sm:inline-flex items-center px-[10px]  lg:px-[14px] h-full -translate-y-1 hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">
                                <div class="relative mt-1 select-none font-calibre ">
                                        <div class="relative cursor-default rounded-lg py-2" @click="openMenu('menu-more')">
                                                <div class="absolute top-0 right-1 font-calibreLight text-xs -translate-y-2 whitespace-nowrap"
                                                        :class="menuStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                        Filters</div>
                                                <div class="flex-1 w-full text-right pt-0 lg:pr-8 whitespace-nowrap">
                                                        More</div>
                                                <span
                                                        class="hidden lg:flex pointer-events-none absolute inset-y-0 right-0 justify-end items-center">
                                                        <Icon name="ph:caret-up-down" size="14" class="text-gray-400" />
                                                </span>
                                        </div>
                                </div>

                        </div>
                        <!-- mobile filter -->
                        <div
                                class="inline-flex sm:hidden items-center px-[10px]  lg:px-[14px] h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">
                                <div class="relative mt-1 select-none font-calibre ">
                                        <div class="relative cursor-default rounded-lg py-2 translate-y-[2px]"
                                                @click="openMenu('filterPannel')">
                                                <div class="absolute top-0 right-1 font-calibreLight text-xs translate-x-1 -translate-y-2 whitespace-nowrap"
                                                        :class="menuStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                        Filters</div>
                                                <div class="flex-1 w-full flex justify-end whitespace-nowrap">
                                                        <Icon name="system-uicons:filtering" size="24"
                                                                :class="openFilterPannel === true ? 'text-accent' : (menuStore.isMenuOverlay ? 'text-primary/50' : 'text-white/80')" />
                                                </div>

                                        </div>
                                </div>

                        </div>

                        <!-- web search  -->
                        <div
                                class="inline-flex items-center px-[10px]  lg:px-[14px] h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">
                                <div class="relative mt-1 select-none font-calibre ">
                                        <div class="relative cursor-default rounded-lg py-2 translate-y-[2px]"
                                                @click="openMenu('webSearchPannel')">
                                                <div class="absolute top-0 right-1 font-calibreLight text-xs -translate-y-2 whitespace-nowrap"
                                                        :class="menuStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                        Web</div>
                                                <div class="flex-1 w-full flex justify-end whitespace-nowrap">
                                                        <IconExplorer width="24px" height="24px" class="hover:text-accent "
                                                                :class="openWebSearchPannel === true ? 'text-accent' : (menuStore.isMenuOverlay ? 'text-primary/50' : 'text-white/80')" />
                                                </div>

                                        </div>
                                </div>

                        </div>

                        <!-- user menu -->

                        <NavUserMenu />

                </div>

                <div class="text-search-pannel shadow-2xl"
                        :class="openTextSearchPannel ? 'z-10 visible lg:hidden animate-slideShowFromRight' : (openTextSearchPannel === false ? 'z-0 delay-100 animate-slideHideToRight' : 'z-0')">
                        <NavTextSearchPannel @isClosed="collapseAll('')" />
                </div>

                <div class="filter-pannel shadow-2xl"
                        :class="openFilterPannel ? 'z-10 visible sm:hidden animate-slideShowFromRight' : (openFilterPannel === false ? 'z-0 delay-100 animate-slideHideToRight' : 'z-0 ')">
                        <NavFilterPannel @isClosed="collapseAll('')" />
                </div>

                <div class="web-search-pannel shadow-2xl"
                        :class="openWebSearchPannel ? 'z-10 animate-slideShowFromRight' : (openWebSearchPannel === false ? 'z-0 delay-100 animate-slideHideToRight' : 'z-0')">
                        <NavWebSearchPannel @isClosed="collapseAll('')" />
                </div>
                <div class="menu-more absolute"
                        :class="openMenuMore ? 'z-10 animate-slideShowFromTop' : (openMenuMore === false ? 'z-0 animate-slideHideToTop' : 'z-0 hidden')">
                        <!-- @mouseenter="keepMenuPannel('enter', 'menu-more')"
                                @mouseleave="keepMenuPannel('leave', 'menu-more')"> -->
                        <NavMoreMenu />

                </div>
                <!-- <div class="menu-backdrop" :class="openMenuMore ? 'visible' : 'delay-100 invisible '"></div> -->
                <div class="backdrop" @click="collapseAll('')"
                        :class="menuStore.isMenuOverlay ? 'visible' : 'delay-150 invisible '" />
        </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import { storeToRefs } from "pinia";
import { useMenuStore } from '~/stores/menu';
import { useFilterStore } from '~/stores/filter';
import { useDataStore } from '~/stores/data';
import { useMapStore } from '~/stores/map';
const menuStore = useMenuStore()
const filterStore = useFilterStore()
const dataStore = useDataStore()
const mapStore = useMapStore()
const { filteredAssets } = storeToRefs(dataStore);
const { searchKeyword } = storeToRefs(filterStore);
const { filtered } = storeToRefs(mapStore);
const searchText = ref('')
const onSearchText = () => {
        //console.log(filterStore.searchKeyword)
        filterStore.searchKeyword = searchText.value
        dataStore.setFilterAssets()

        //console.log(dataStore.filteredAssets)
}

const onResetKeyword = () => {
        searchText.value = ''
        filterStore.searchKeyword = ''
        dataStore.filteredAssets = dataStore.initialAllAssets
        filtered.value = Date.now().toString()
}



import {
        Listbox,
        ListboxButton,
        ListboxOptions,
        ListboxOption,
} from '@headlessui/vue'
import {
        RadioGroup,
        RadioGroupLabel,
        RadioGroupOption,
} from '@headlessui/vue'


const transaction = [
        { name: 'All Types' },
        { name: 'Lease' },
        { name: 'Sale' },
        { name: 'Sale/Lease' }
]
const selectedTransaction = ref(transaction[0])
watch(selectedTransaction, (nv, ov) => {
        if (nv !== ov) {
                filterStore.filterTransactionType = nv.name as string
                dataStore.setFilterAssets()
                return collapseAll('')
        }
})


const openTransaction = ref(false)
const openSectors = ref(false)
const openSubSectors = ref(false)

const openFilterPannel = ref(null as boolean | null)
const openTextSearchPannel = ref(null as boolean | null)
const openWebSearchPannel = ref(null as boolean | null)
const openMenuMore = ref(null as boolean | null)

const sector = [
        { name: 'Office' },
        { name: 'Logistics' },
        { name: 'Retail' },
        { name: 'Hospital' }
]
const selectedSectors = ref([] as any[])
const createSelectedSectors = (option: any) => {
        // toggle if exist
        if (isSelectedSector(option)) {
                selectedSectors.value = selectedSectors.value.filter((it: any) => it.name !== option.name)
                filterStore.filterSectorTypes = selectedSectors.value
                dataStore.setFilterAssets()
                return
        }
        // add to selected
        selectedSectors.value.push(option)

        filterStore.filterSectorTypes = selectedSectors.value
        dataStore.setFilterAssets()
}

const isSelectedSector = (option: any) => {
        // check if option is selected
        return selectedSectors.value.find((it) => it.name === option.name)
}

const subsector = [
        { name: 'Cold Logistic' },
        { name: 'Dry Logistic' },
        { name: 'Mixed Logistic' },
        { name: 'Central Business District' }
]
const selectedSubSectors = ref([] as any[])
const createSelectedSubSectors = (option: any) => {
        // toggle if exist
        if (isSelectedSubSector(option)) {
                selectedSubSectors.value = selectedSubSectors.value.filter((it: any) => it.name !== option.name)

                filterStore.filterSubSectorTypes = selectedSubSectors.value
                dataStore.setFilterAssets()
                return
        }
        // add to selected
        selectedSubSectors.value.push(option)
        filterStore.filterSubSectorTypes = selectedSubSectors.value
        dataStore.setFilterAssets()

}
const isSelectedSubSector = (option: any) => {
        // check if option is selected
        return selectedSubSectors.value.find((it) => it.name === option.name)
}


const collapseAll = (menu: string) => {
        //console.log(menu)
        menuStore.isMenuOverlay = false
        if (menu === 'transaction') {
                openSectors.value = false
                openTextSearchPannel.value = null
                openWebSearchPannel.value = null
                openFilterPannel.value = null
                openSubSectors.value = false
                openMenuMore.value = null
        } else if (menu === 'sectors') {
                openTransaction.value = false
                openTextSearchPannel.value = null
                openWebSearchPannel.value = null
                openFilterPannel.value = null
                openSubSectors.value = false
                openMenuMore.value = null
        } else if (menu === 'subsectors') {
                openTransaction.value = false
                openSectors.value = false
                openTextSearchPannel.value = null
                openWebSearchPannel.value = null
                openFilterPannel.value = null
                openMenuMore.value = null
        } else if (menu === 'menu-more') {
                openTransaction.value = false
                openSectors.value = false
                openTextSearchPannel.value = null
                openWebSearchPannel.value = null
                openFilterPannel.value = null
                openSubSectors.value = false
        } else if (menu === 'webSearchPannel') {
                openTransaction.value = false
                openSectors.value = false
                openSubSectors.value = false
                openMenuMore.value = null
                openFilterPannel.value = null
                openTextSearchPannel.value = null

        } else if (menu === 'textSearchPannel') {
                openTransaction.value = false
                openSectors.value = false
                openSubSectors.value = false
                openMenuMore.value = null
                openFilterPannel.value = null
                openWebSearchPannel.value = null

        } else if (menu === 'filterPannel') {
                openTransaction.value = false
                openSectors.value = false
                openSubSectors.value = false
                openMenuMore.value = null
                openTextSearchPannel.value = null
                openWebSearchPannel.value = null
        } else {
                openTransaction.value = false
                openSectors.value = false
                openTextSearchPannel.value = null
                openWebSearchPannel.value = null
                openFilterPannel.value = null
                openSubSectors.value = false
                openMenuMore.value = null

        }
}

const openMenu = (menu: string) => {

        collapseAll(menu)
        menuStore.isMenuOverlay = true
        if (menu === 'transaction') {
                !openTransaction.value ? openTransaction.value = true : openTransaction.value = !openTransaction.value
                if (!openTransaction.value) menuStore.isMenuOverlay = false
        } else if (menu === 'sectors') {
                !openSectors.value ? openSectors.value = true : openSectors.value = !openSectors.value
                if (!openSectors.value) menuStore.isMenuOverlay = false
        } else if (menu === 'subsectors') {
                !openSubSectors.value ? openSubSectors.value = true : openSubSectors.value = !openSubSectors.value
                if (!openSubSectors.value) menuStore.isMenuOverlay = false
        } else if (menu === 'menu-more') {
                // console.log(openMenuMore.value)
                !openMenuMore.value ? openMenuMore.value = true : openMenuMore.value = false
                // console.log(openMenuMore.value)
                if (!openMenuMore.value) menuStore.isMenuOverlay = false
        } else if (menu === 'webSearchPannel') {
                !openWebSearchPannel.value ? openWebSearchPannel.value = true : openWebSearchPannel.value = false
                if (!openWebSearchPannel.value) menuStore.isMenuOverlay = false
        } else if (menu === 'textSearchPannel') {
                !openTextSearchPannel.value ? openTextSearchPannel.value = true : openTextSearchPannel.value = false
                if (!openTextSearchPannel.value) menuStore.isMenuOverlay = false
        } else if (menu === 'filterPannel') {
                !openFilterPannel.value ? openFilterPannel.value = true : openFilterPannel.value = false
                if (!openFilterPannel.value) menuStore.isMenuOverlay = false
        } else {
                menuStore.isMenuOverlay = false
        }

}
</script>

<style scoped>
.search {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
}

.magnifier {
        position: absolute;
        right: 0;
        background-color: transparent;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
}

.search-input {
        background-color: transparent;
        height: 30px;
        padding-left: 10px;
        padding-right: 10px;
        width: 100%;

}

.search-input::placeholder {
        font-size: 14px;
}


.menu-more {
        position: absolute;
        left: 0;
        width: 100%;
        min-height: 441px;
        padding-bottom: 30px;
        background-color: white;
}

.menu-backdrop {
        position: absolute;
        top: 80px;
        left: 0px;
        width: 100%;
        height: 441px;
        background-color: white;
}

.backdrop {
        display: hidden;
        position: absolute;
        top: 80px;
        right: 0px;
        width: 100%;
        height: calc(100% - 80px);
        background-color: rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(10px);
}

.text-search-pannel,
.web-search-pannel,
.filter-pannel {
        position: absolute;
        top: 80px;
        right: -400px;
        width: 400px;
        min-width: 400px;
        height: calc(100vh - 80px);
        z-index: 100;
        background-color: white;
}

@media (max-width: 400px) {

        .text-search-pannel,
        .web-search-pannel,
        .filter-pannel {
                width: 100%;
                min-width: 100%;
        }
}


.navbackdrop {
        display: hidden;
        position: absolute;
        top: 80px;
        right: 0px;
        width: 100%;
        height: calc(100% - 80px);
}
</style>