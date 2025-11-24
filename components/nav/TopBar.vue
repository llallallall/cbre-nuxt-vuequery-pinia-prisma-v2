<template>
        <div id="TopMenu" class="fixed top-0 w-full h-[80px] 
          flex justify-between items-stretch 
          px-2 sm:px-4 md:px-6 lg:px-10 
          transition-all duration-500"
                :class="uiStore.isMenuOverlay ? 'bg-white text-darkgreen border-gray-200 border-b z-20' : 'bg-darkgreen text-white z-50'">

                <div id="LeftMenu" class="flex items-center w-full h-full z-20">
                        <div class="min-w-[110px] flex items-center justify-center cursor-pointer"
                                @click="navigateTo('/')">
                                <IconCBRELogo width="80px" height="25px" class="text-inherit" />
                                <sub class="text-[14px] font-calibreBold translate-y-1 ml-1">Map</sub>
                        </div>
                        <div class="ml-[10px] h-[30px] pt-[8px] font-calibre ">
                                <span class="hidden xl:flex whitespace-nowrap">Asset Management System</span>
                                <span class="flex xl:hidden whitespace-nowrap">AMS</span>
                        </div>

                        <div
                                class="search flex justify-end lg:justify-start w-full min-w-[30px] mx-w-full lg:max-w-[300px] ml-5 lg:mx-5">
                                <div class="hidden lg:flex items-center w-full h-full">
                                        <div class="input-wrapper relative flex-1 hidden 2sm:flex">
                                                <input v-model="searchText" type="text" name="search" autocomplete="off"
                                                        @keyup.enter="onSearchText()"
                                                        class="peer search-input relative flex-1 text-sm text-white hidden xs:flex border-t-0 border-l-0 border-r-0 border-b-2 focus:border-b-2 focus:border-white/70 focus:outline-0 z-20"
                                                        :class="uiStore.isMenuOverlay ? 'border-primary/50 focus:border-b-2 focus:border-primary/70 focus:outline-0' : 'border-white/50'" />
                                                <label v-if="!propertyStore.searchKeyword"
                                                        class="absolute top-0 items-center justify-start w-full h-full pl-1 peer-[.search-input]:peer-focus:text-[8px] peer-[.search-input]:peer-focus:items-center peer-[.search-input]:peer-focus:-top-4 z-0 hidden sm:flex transition-all text-[12px]"
                                                        :class="uiStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                        Search&nbsp;<span class="hidden 2md:flex">by Name,
                                                                Address</span>
                                                        <span class="hidden sm:flex 2md:hidden">...</span>
                                                </label>
                                        </div>

                                        <div v-if="propertyStore.searchKeyword === ''"
                                                class="magnifier hidden 2sm:flex z-50 cursor-pointer"
                                                @click="onSearchText()">
                                                <IconMagnifier width="18px" height="18px"
                                                        class="text-inherit hover:text-accent" />
                                        </div>

                                        <div v-else class="magnifier hidden 2sm:flex cursor-pointer z-50"
                                                @click="onResetKeyword()">
                                                <icon name="ic:sharp-close" size="18" class="text-gray-400" />
                                        </div>
                                </div>

                                <div class="flex lg:hidden justify-end items-center px-[10px] h-full min-w-[60px] hover:bg-gray-200/20 hover:underline hover:decoration-primary/50"
                                        @click="openMenu('textSearchPannel')">
                                        <div class="relative mt-1 select-none font-calibre">
                                                <div class="relative cursor-default rounded-lg py-2 translate-y-[2px]">
                                                        <div class="absolute top-0 right-1 font-calibreLight text-xs -translate-y-2 whitespace-nowrap"
                                                                :class="uiStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                                Search</div>
                                                        <div
                                                                class="flex-1 flex justify-end translate-y-1 whitespace-nowrap h-[24px]">
                                                                <IconMagnifier width="18px" height="18px"
                                                                        class="hover:text-accent"
                                                                        :class="openTextSearchPannel === true ? 'text-accent' : (uiStore.isMenuOverlay ? 'text-primary/50' : 'text-white/80')" />
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>

                <div id="right-menu" class="whitespace-nowrap z-20 flex">
                        <div
                                class="hidden sm:inline-flex justify-center items-center -translate-y-1 px-[10px] lg:px-[14px] h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">
                                <Listbox v-model="selectedTransaction">
                                        <div class="relative mt-1 font-calibre z-50">
                                                <ListboxButton class="relative cursor-default py-2"
                                                        @click="openMenu('transaction'); propertyStore.updateFilter('filterTransactionType', selectedTransaction.name === 'All Types' ? '' : selectedTransaction.name)">
                                                        <div class="absolute top-0 right-0 font-calibreLight text-xs -translate-y-2 whitespace-nowrap"
                                                                :class="uiStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                                Transaction</div>
                                                        <div
                                                                class="flex-1 w-full text-right pr-0 lg:pr-8 whitespace-nowrap">
                                                                {{ selectedTransaction.name }}</div>
                                                        <span
                                                                class="hidden lg:flex pointer-events-none absolute inset-y-0 right-0 items-center">
                                                                <Icon name="ph:caret-up-down" size="14"
                                                                        class="text-gray-400" />
                                                        </span>
                                                </ListboxButton>
                                                <transition leave-active-class="transition duration-100 ease-in"
                                                        leave-from-class="opacity-100" leave-to-class="opacity-0">
                                                        <ListboxOptions
                                                                class="absolute right-0 mt-1 max-h-60 w-36 rounded-sm z-[100] border border-gray-200 bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                <ListboxOption v-slot="{ active, selected }"
                                                                        v-for="type in transaction" :key="type.name"
                                                                        :value="type" as="template">
                                                                        <li
                                                                                :class="[active ? 'bg-primary text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4 w-full']">
                                                                                <span
                                                                                        :class="[selected ? 'font-medium' : 'font-normal', 'flex-1 whitespace-nowrap']">{{
                                                                                                type.name }}</span>
                                                                                <span v-if="selected"
                                                                                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-accent">
                                                                                        <Icon name="ic:round-check"
                                                                                                color="inherit"
                                                                                                size="25" />
                                                                                </span>
                                                                        </li>
                                                                </ListboxOption>
                                                        </ListboxOptions>
                                                </transition>
                                        </div>
                                </Listbox>
                        </div>

                        <div
                                class="hidden sm:inline-flex items-center px-[10px] -translate-y-1 lg:px-[14px] h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">
                                <div class="relative mt-1 select-none font-calibre">
                                        <div class="relative cursor-default rounded-lg py-2"
                                                @click="openMenu('sectors')">
                                                <div class="absolute top-0 right-0 font-calibreLight text-xs -translate-y-2 whitespace-nowrap"
                                                        :class="uiStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                        Sector</div>
                                                <div class="flex-1 w-full text-right pr-0 lg:pr-8 whitespace-nowrap">
                                                        {{ selectedSectors && selectedSectors.length > 0 ?
                                                                selectedSectors[0].name + (selectedSectors.length - 1 > 0 ? `
                                                        (+${selectedSectors.length - 1})` : '') : 'All Types' }}
                                                </div>
                                                <span
                                                        class="pointer-events-none absolute inset-y-0 right-0 hidden lg:flex items-center">
                                                        <Icon name="ph:caret-up-down" size="14" class="text-gray-400" />
                                                </span>
                                        </div>
                                        <div class="grid grid-cols-2 absolute top-10 right-0 mt-1 bg-white min-w-[200px] cursor-default rounded-sm border border-gray-200 p-2 z-[100]"
                                                :class="openSectors ? 'block' : 'hidden'">
                                                <div v-for="option in sectors" :key="option.name"
                                                        @click="toggleSelectedSector(option)"
                                                        class="relative flex cursor-pointer p-1 focus:outline-none"
                                                        :class="isSelectedSector(option) ? 'bg-primary text-white' : 'bg-white text-gray-900'">
                                                        <div class="flex w-full items-center justify-between">
                                                                <div class="text-sm font-medium">{{ option.name }}</div>
                                                                <div v-show="isSelectedSector(option)">
                                                                        <Icon name="ic:round-check" size="16"
                                                                                color="white" />
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>

                        <div
                                class="hidden sm:inline-flex items-center px-[10px] -translate-y-1 lg:px-[14px] h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">
                                <div class="relative mt-1 select-none font-calibre">
                                        <div class="relative cursor-default rounded-lg py-2"
                                                @click="openMenu('subsectors')">
                                                <div class="absolute top-0 right-0 font-calibreLight text-xs -translate-y-2 whitespace-nowrap"
                                                        :class="uiStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                        SubSector</div>
                                                <div class="flex-1 w-full text-right pr-0 lg:pr-8 whitespace-nowrap">
                                                        {{ selectedSubSectors && selectedSubSectors.length > 0 ?
                                                                selectedSubSectors[0].name + (selectedSubSectors.length - 1 > 0
                                                                        ? ` (+${selectedSubSectors.length - 1})` : '') : 'All Types' }}
                                                </div>
                                                <span
                                                        class="pointer-events-none absolute inset-y-0 right-0 hidden lg:flex items-center">
                                                        <Icon name="ph:caret-up-down" size="14" class="text-gray-400" />
                                                </span>
                                        </div>
                                        <div class="grid grid-cols-2 absolute top-10 right-0 mt-1 bg-white min-w-[300px] cursor-default rounded-sm border border-gray-200 p-2 z-[100]"
                                                :class="openSubSectors ? 'block' : 'hidden'">
                                                <div v-for="option in subsectors" :key="option.name"
                                                        @click="toggleSelectedSubSector(option)"
                                                        class="relative flex cursor-pointer p-1 focus:outline-none"
                                                        :class="isSelectedSubSector(option) ? 'bg-primary text-white' : 'bg-white text-gray-900'">
                                                        <div class="flex w-full items-center justify-between">
                                                                <div class="text-sm font-medium">{{ option.name }}</div>
                                                                <div v-show="isSelectedSubSector(option)">
                                                                        <Icon name="ic:round-check" size="16"
                                                                                color="white" />
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>

                        <div
                                class="hidden sm:inline-flex items-center px-[10px] lg:px-[14px] h-full -translate-y-1 hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">
                                <div class="relative mt-1 select-none font-calibre">
                                        <div class="relative cursor-default rounded-lg py-2"
                                                @click="openMenu('menu-more')">
                                                <div class="absolute top-0 right-1 font-calibreLight text-xs -translate-y-2 whitespace-nowrap"
                                                        :class="uiStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
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
                                                        :class="uiStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                        Filters</div>
                                                <div class="flex-1 w-full flex justify-end whitespace-nowrap">
                                                        <Icon name="system-uicons:filtering" size="24"
                                                                :class="openFilterPannel === true ? 'text-accent' : (uiStore.isMenuOverlay ? 'text-primary/50' : 'text-white/80')" />
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
                                                        :class="uiStore.isMenuOverlay ? 'text-primary/50' : 'text-white/50'">
                                                        Web</div>
                                                <div class="flex-1 w-full flex justify-end whitespace-nowrap">
                                                        <IconExplorer width="24px" height="24px"
                                                                class="hover:text-accent "
                                                                :class="openWebSearchPannel === true ? 'text-accent' : (uiStore.isMenuOverlay ? 'text-primary/50' : 'text-white/80')" />
                                                </div>

                                        </div>
                                </div>

                        </div>

                        <!-- user menu -->

                        <NavUserMenu />

                </div>

                <div class="text-search-pannel shadow-2xl"
                        :class="openTextSearchPannel ? 'z-10 visible lg:hidden animate-slideShowFromRight' : 'z-0 delay-100 animate-slideHideToRight'">
                        <NavTextSearchPannel @isClosed="collapseAll('')" />
                </div>

                <div class="filter-pannel shadow-2xl"
                        :class="openFilterPannel ? 'z-10 visible sm:hidden animate-slideShowFromRight' : 'z-0 delay-100 animate-slideHideToRight'">
                        <NavFilterPannel @isClosed="collapseAll('')" />
                </div>

                <div class="web-search-pannel shadow-2xl"
                        :class="openWebSearchPannel ? 'z-10 animate-slideShowFromRight' : 'z-0 delay-100 animate-slideHideToRight'">
                        <NavWebSearchPannel @isClosed="collapseAll('')" />
                </div>

                <div class="menu-more absolute"
                        :class="openMenuMore ? 'z-[100] animate-slideShowFromTop' : 'z-0 animate-slideHideToTop hidden'">
                        <NavMoreMenu />
                </div>

                <div class="backdrop" @click="collapseAll('')"
                        :class="uiStore.isMenuOverlay ? 'visible' : 'delay-150 invisible'" />
        </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from "pinia";
import { useUiStore } from '~/stores/ui';
import { usePropertyStore } from '~/stores/property';
import { useMapStore } from '~/stores/map'; // MapStore는 filtered 상태 갱신용
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';

const uiStore = useUiStore();
const propertyStore = usePropertyStore();
const mapStore = useMapStore();

const { searchKeyword } = storeToRefs(propertyStore);

// 검색
const searchText = ref('');

const onSearchText = () => {
        propertyStore.searchKeyword = searchText.value;
        propertyStore.applyFilter();
};

const onResetKeyword = () => {
        searchText.value = '';
        propertyStore.searchKeyword = '';
        propertyStore.applyFilter();
};

// Transaction Types
const transaction = [
        { name: 'All Types' },
        { name: 'Lease' },
        { name: 'Sale' },
        { name: 'Sale/Lease' }
];
const selectedTransaction = ref(transaction[0]);

watch(selectedTransaction, (nv, ov) => {
        if (nv !== ov) {
                propertyStore.updateFilter('filterTransactionType', nv.name === 'All Types' ? '' : nv.name);
                collapseAll('');
        }
});

// UI State
const openTransaction = ref(false);
const openSectors = ref(false);
const openSubSectors = ref(false);
const openFilterPannel = ref(false);
const openTextSearchPannel = ref(false);
const openWebSearchPannel = ref(false);
const openMenuMore = ref(false);

// Data Lists (실제로는 API나 Store에서 가져와야 함)
const sectors = [
        { name: 'Office' },
        { name: 'Logistics' },
        { name: 'Retail' },
        { name: 'Hospital' }
];
const subsectors = [
        { name: 'Cold Logistic' },
        { name: 'Dry Logistic' },
        { name: 'Mixed Logistic' },
        { name: 'Central Business District' }
];

// Sector Logic
const selectedSectors = ref<{ name: string }[]>([]);
const isSelectedSector = (option: { name: string }) => selectedSectors.value.some(s => s.name === option.name);

const toggleSelectedSector = (option: { name: string }) => {
        if (isSelectedSector(option)) {
                selectedSectors.value = selectedSectors.value.filter(s => s.name !== option.name);
        } else {
                selectedSectors.value.push(option);
        }
        propertyStore.updateFilter('filterSectorTypes', selectedSectors.value.map(s => s.name));
};

// SubSector Logic
const selectedSubSectors = ref<{ name: string }[]>([]);
const isSelectedSubSector = (option: { name: string }) => selectedSubSectors.value.some(s => s.name === option.name);

const toggleSelectedSubSector = (option: { name: string }) => {
        if (isSelectedSubSector(option)) {
                selectedSubSectors.value = selectedSubSectors.value.filter(s => s.name !== option.name);
        } else {
                selectedSubSectors.value.push(option);
        }
        propertyStore.updateFilter('filterSubSectorTypes', selectedSubSectors.value.map(s => s.name));
};


// Menu Control Logic
const collapseAll = (menu: string) => {
        uiStore.isMenuOverlay = false;
        if (menu !== 'transaction') openTransaction.value = false;
        if (menu !== 'sectors') openSectors.value = false;
        if (menu !== 'subsectors') openSubSectors.value = false;
        if (menu !== 'menu-more') openMenuMore.value = false;
        if (menu !== 'webSearchPannel') openWebSearchPannel.value = false;
        if (menu !== 'textSearchPannel') openTextSearchPannel.value = false;
        if (menu !== 'filterPannel') openFilterPannel.value = false;
};

const openMenu = (menu: string) => {
        collapseAll(menu);
        uiStore.isMenuOverlay = true;

        if (menu === 'transaction') {
                openTransaction.value = !openTransaction.value;
                if (!openTransaction.value) uiStore.isMenuOverlay = false;
        } else if (menu === 'sectors') {
                openSectors.value = !openSectors.value;
                if (!openSectors.value) uiStore.isMenuOverlay = false;
        } else if (menu === 'subsectors') {
                openSubSectors.value = !openSubSectors.value;
                if (!openSubSectors.value) uiStore.isMenuOverlay = false;
        } else if (menu === 'menu-more') {
                openMenuMore.value = !openMenuMore.value;
                if (!openMenuMore.value) uiStore.isMenuOverlay = false;
        } else if (menu === 'webSearchPannel') {
                openWebSearchPannel.value = !openWebSearchPannel.value;
                if (!openWebSearchPannel.value) uiStore.isMenuOverlay = false;
        } else if (menu === 'textSearchPannel') {
                openTextSearchPannel.value = !openTextSearchPannel.value;
                if (!openTextSearchPannel.value) uiStore.isMenuOverlay = false;
        } else if (menu === 'filterPannel') {
                openFilterPannel.value = !openFilterPannel.value;
                if (!openFilterPannel.value) uiStore.isMenuOverlay = false;
        } else {
                uiStore.isMenuOverlay = false;
        }
};
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

.menu-more {
        position: absolute;
        left: 0;
        width: 100%;
        min-height: 441px;
        padding-bottom: 30px;
        background-color: white;
}

.backdrop {
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
</style>