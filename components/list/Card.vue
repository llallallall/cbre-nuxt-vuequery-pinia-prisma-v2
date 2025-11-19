<template>
        <div id="container" ref="ListContainer" :class="`${containerClasses}`"
                class="w-[calc(100%-4px)] max-h-[calc(100vh-80px)] overflow-y-scroll ">
                <div v-if="items && items.length > 0" class="relative">
                        <div class="summary 
                        absolute top-0 
                        flex items-center z-10">
                                <div class="flex-1 flex flex-row justify-start whitespace-nowrap">
                                        <span class="flex"><b> {{ totalCount }}</b></span><span
                                                class="hidden sm:flex">&nbsp;<b>Properties</b></span>
                                        <span class="flex">&nbsp;founded</span>
                                </div>

                                <div class="w-[60px] flex justify-center items-center relative p-0 gap-0">
                                        <div class="relative flex-1 flex justify-center items-center h-[28px]
                                                border-2 rounded-tl-xl rounded-bl-xl
                                                p-1 pl-2"
                                                :class="menuStore.isGrid ? 'border-[#767676] border-r-0 bg-white' : 'border-primary bg-[#e6eaea]'"
                                                @click="menuStore.isGrid = false">
                                                <IconList class=" w-[13px] h-[13px] "
                                                        :class="menuStore.isGrid ? 'text-[#767676]' : 'text-primary'" />
                                        </div>
                                        <div class="relative flex-1 flex justify-center items-center h-[28px]
                                                border-2 rounded-tr-xl rounded-br-xl
                                                p-1 pr-2"
                                                :class="menuStore.isGrid ? 'border-primary bg-[#e6eaea]' : 'border-[#767676] border-l-0 bg-white'"
                                                @click="menuStore.isGrid = true">
                                                <IconGrid class="w-[12px] h-[12px] translate-x-0"
                                                        :class="menuStore.isGrid ? 'text-primary' : ' text-[#767676]'" />
                                        </div>

                                </div>
                                <div class="max-w-[160px] h-full flex justify-end items-center ml-2">

                                        <Listbox v-model="selectedOrder">
                                                <div class="relative w-full h-full flex justify-end items-center">
                                                        <ListboxButton class="relative 
                                                        flex    w-full
                                                                h-[28px]
                                                                cursor-default 
                                                                rounded-xl 
                                                                bg-[#d1dbd9] py-1 pl-3 pr-10 
                                                                text-left shadow-0 
                                                                focus:outline-none 
                                                                focus-visible:border-indigo-500 
                                                                focus-visible:ring-2 focus-visible:ring-white 
                                                                focus-visible:ring-opacity-75 
                                                                focus-visible:ring-offset-2 
                                                                focus-visible:ring-offset-orange-300 
                                                                sm:text-sm
                                                                font-calibre
                                                                ">
                                                                <span class="block truncate">{{ selectedOrder.name
                                                                }}</span>
                                                                <span
                                                                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                        <Icon name="ph:caret-up-down" size="14"
                                                                                class="text-gray-400" />
                                                                </span>
                                                        </ListboxButton>
                                                        <transition leave-active-class="transition duration-100 ease-in"
                                                                leave-from-class="opacity-100" leave-to-class="opacity-0">
                                                                <ListboxOptions
                                                                        class="absolute top-8 max-h-60 w-full min-w-[160px]
                                                                        overflow-auto rounded-md 
                                                                        bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                        <ListboxOption v-slot="{ active, selected }"
                                                                                v-for="order in orderMethod" :key="order.name"
                                                                                :value="order" as="template">
                                                                                <li :class="[
                                                                                        active ? 'bg-darkgreen text-white' : 'text-gray-900',
                                                                                        'relative cursor-default select-none py-2 pl-10 pr-4',
                                                                                ]">
                                                                                        <span :class="[
                                                                                                selected ? 'font-medium' : 'font-normal',
                                                                                                'block truncate',
                                                                                        ]">{{ order.name
}}</span>
                                                                                        <span v-if="selected"
                                                                                                class="absolute inset-y-0 left-0 flex items-center pl-3 text-accent">
                                                                                                <Icon name="ic:round-check"
                                                                                                        color="inherite"
                                                                                                        size="25" />
                                                                                        </span>
                                                                                </li>
                                                                        </ListboxOption>
                                                                </ListboxOptions>
                                                        </transition>
                                                </div>
                                        </Listbox>

                                </div>

                                <div class="max-w-[130px] flex justify-center items-center relative p-0 gap-0 ml-2">
                                        <div class="relative flex-1 flex justify-center items-center h-[28px]
                                                border-2 rounded-xl 
                                                py-1 px-2"
                                                :class="menuStore.isHidden ? 'border-[#767676] bg-white' : 'border-primary bg-[#e6eaea]'"
                                                @click="menuStore.isHidden = !menuStore.isHidden">
                                                <IconMap class=" w-[20px] h-[20px] "
                                                        :class="menuStore.isHidden ? 'text-[#767676]' : 'text-primary'" />
                                                <span class="font-calibreLight text-sm">Hide Map</span>
                                        </div>


                                </div>

                        </div>

                        <div class="relative pt-[60px] "
                                :class="menuStore.isHidden ? 'grid grid-cols-4 gap-4' : menuStore.isGrid ? 'grid grid-cols-2 3xl:grid-cols-3 gap-4' : 'block '">
                                <template v-for="(item, index) in itemsToDisplay">
                                        <div class="backdrop-blur overflow-hidden mb-4">
                                                <ListItem :item="item" :idx="(data.length - Number(index))" class="relative" />
                                        </div>

                                </template>

                                <template v-if="loading">
                                        <!-- Loading component -->
                                        <div v-if="defaultLoading" id="loading-wrapper">
                                                <ListLoading :color="defaultLoadingColor" />
                                        </div>
                                        <div v-else id="loading-wrapper">
                                                <ListLoading />
                                        </div>
                                </template>

                                <!-- list footer -->
                                <div v-show="((page !== items.length - 1) || !loading)" id="end-of-list" ref="end_of_list" />
                        </div>
                </div>
                <div v-else class="max-h-[calc(100vh-80px)] w-full overflow-hidden">
                        <div class="summary text-center font-light text-primary/25">
                                Properties Not Founded
                        </div>

                </div>
        </div>
</template>

<script setup lang="ts">

import { storeToRefs } from "pinia";
import { useMenuStore } from '~/stores/menu';
import { useDataStore } from '~/stores/data';
const menuStore = useMenuStore()
const dataStore = useDataStore()
const { isHidden, isGrid } = storeToRefs(useMenuStore());
const { initialDataLoaded } = storeToRefs(useDataStore());
import {
        Listbox,
        ListboxButton,
        ListboxOptions,
        ListboxOption,
} from '@headlessui/vue'

const orderMethod = [
        { name: 'Name' },
        { name: 'Area(High to Low)' },
        { name: 'Area(Low to High)' },
        { name: 'Closet' },
        { name: 'Last Updated' },
]
const selectedOrder = ref(orderMethod[0])

const { data, totalCount, itemsPerRender, containerClasses, defaultLoading, defaultLoadingColor } = defineProps({
        data: {
                type: Array,
                default: () => [],
        },
        totalCount: {
                type: Number,
                required: true,
                default: 0,

        },
        itemsPerRender: {
                type: Number,
                default: 3,
        },
        containerClasses: {
                type: String,
                default: '',
        },
        defaultLoading: {
                type: Boolean,
                default: true,
        },
        defaultLoadingColor: {
                type: String,
                default: '#18191A',
        },
})

const assets = ref(data) as any
const items = ref([]) as any
const itemsToDisplay = ref([]) as any
const loading = ref(false)
const page = ref(0)



function chunkArray(arr: any, size: number) {
        return Array.from({ length: Math.ceil(arr.length / size) },
                (_v, i) => arr.slice(i * size, i * size + size));
}

// set the list and update it when data changes
function updateList() {
        let chunckedArray = chunkArray(assets.value, itemsPerRender) // chunkArray(data,itemsPerRender) to get array of small arrays
        // console.log('chunckedArray')
        // console.log(chunckedArray)
        items.value = chunckedArray
        itemsToDisplay.value = chunckedArray[0]
}
const ListContainer = ref(null) as any
const end_of_list = ref(null) as any


// load more items when scrolling to the end of the list
function loadItems() {
        if (page.value === items.value.length - 1) return

        const element = end_of_list.value //this.endOfList;
        if (!element) return
        const position = element.getBoundingClientRect();

        // checking whether fully visible
        if ((position.top >= 0 && position.bottom <= window.innerHeight) && !loading.value) {
                // console.log('reloading')
                loading.value = true
                page.value++
                setTimeout(() => {
                        itemsToDisplay.value = [...itemsToDisplay.value, ...items.value[page.value]]
                        loading.value = false
                        loadItems()
                }, 500);
        }
}

const { filteredAssets } = storeToRefs(dataStore)

watch(filteredAssets, (nv, ov) => {
        assets.value = dataStore.filteredAssets
        updateList()
        loadItems()

})

onMounted(() => {

        if (dataStore.initialDataLoaded) {
                assets.value = dataStore.filteredAssets
                updateList()
                loadItems()
        }
        ListContainer.value.addEventListener('scroll', loadItems)
})

onBeforeUnmount(() => {

        ListContainer.value.removeEventListener('scroll', loadItems)
})
</script>

<style scoped>
.summary {
        width: 100%;
        padding-bottom: 20px;
        font-size: 20px;

        font-family: 'calibre';
}
</style>