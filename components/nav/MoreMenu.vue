<template>
        <div class="flex w-full h-full">
                <div class="w-3/12 flex flex-col justify-start items-start pl-14">
                        <p class="text-4xl 4xs:text-6xl font-financier pt-16 mb-0">More</p>
                        <p class="text-2xl 4xs:text-4xl font-financier pt-1 mb-5">Filters</p>
                        <p class="hidden 4xs:flex text-base font-financier text-primary">You can set details such as the size of
                                the
                                property, the
                                year of construction, and facilities as search conditions.</p>

                </div>
                <ul
                        class="w-9/12 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-start items-start pt-16 pl-14 pr-4">
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-primary/25 pb-4 hover:border-primary">
                                        Size
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-primary  ">
                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">GFA</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.gfa" :min="0" :max="1000000" :step="10"
                                                                :format="thounds" />
                                                </div>
                                                <div class="absolute bottom-0 left-0 text-xs font-mono">
                                                        <span class="pr-[3px]">py</span>
                                                        <Switch v-model="moreFilters.gfaType"
                                                                :class="moreFilters.gfaType ? 'bg-teal-900' : 'bg-gray-300'"
                                                                class="relative inline-flex h-[8px] w-[28px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                <span aria-hidden="true"
                                                                        :class="moreFilters.gfaType ? 'translate-x-5' : 'translate-x-0'"
                                                                        class="pointer-events-none inline-block h-[4px] w-[4px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                        </Switch>
                                                        <span class="pl-[3px]">sqm</span>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">

                                                <div class="w-[100px]">NFA</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.nfa" :min="0" :max="1000000" :step="10"
                                                                :format="thounds" />
                                                </div>
                                                <div class="absolute bottom-0 left-0 text-xs font-mono">
                                                        <span class="pr-[3px]">py</span>
                                                        <Switch v-model="moreFilters.nfaType"
                                                                :class="moreFilters.nfaType ? 'bg-teal-900' : 'bg-gray-300'"
                                                                class="relative inline-flex h-[8px] w-[28px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                <span aria-hidden="true"
                                                                        :class="moreFilters.nfaType ? 'translate-x-5' : 'translate-x-0'"
                                                                        class="pointer-events-none inline-block h-[4px] w-[4px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                        </Switch>
                                                        <span class="pl-[3px]">sqm</span>
                                                </div>
                                        </div>
                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">

                                                <div class="w-[100px]">Site Area</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.siteArea" :min="0" :max="1000000"
                                                                :step="10" :format="thounds" />
                                                </div>
                                                <div class="absolute bottom-0 left-0 text-xs font-mono">
                                                        <span class="pr-[3px]">py</span>
                                                        <Switch v-model="moreFilters.siteAreaType"
                                                                :class="moreFilters.siteAreaType ? 'bg-teal-900' : 'bg-gray-300'"
                                                                class="relative inline-flex h-[8px] w-[28px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                <span aria-hidden="true"
                                                                        :class="moreFilters.siteAreaType ? 'translate-x-5' : 'translate-x-0'"
                                                                        class="pointer-events-none inline-block h-[4px] w-[4px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                        </Switch>
                                                        <span class="pl-[3px]">sqm</span>
                                                </div>
                                        </div>
                                </div>
                        </li>
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-primary/25 pb-4 hover:border-primary">
                                        Period</div>
                                <div class="flex flex-col border-b text-lg font-calibre text-primary  ">
                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">Built</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.built" :min="1960" :max="currentYear" />
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="filterStore.reset('built')"
                                                                class="rounded-md text-teal-900 bg-gray-300 text-[4px] px-1 py-0">reset</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">Reno</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.reno" :min="1960" :max="currentYear" />
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="filterStore.reset('reno')"
                                                                class="rounded-md text-teal-900 bg-gray-300 text-[4px] px-1 py-0">reset</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">Sales</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.sales" :min="1960" :max="currentYear" />
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="filterStore.reset('sales')"
                                                                class="rounded-md text-teal-900 bg-gray-300 text-[4px] px-1 py-0">reset</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">Leases</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.leases" :min="1960" :max="currentYear" />
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="filterStore.reset('leases')"
                                                                class="rounded-md text-teal-900 bg-gray-300 text-[4px] px-1 py-0">reset</button>
                                                </div>
                                        </div>



                                </div>
                        </li>
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-primary/25 pb-4 hover:border-primary">
                                        Facility</div>
                                <div class="flex flex-col border-b text-lg font-calibre text-primary  ">
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">Buildings</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.buildings" :min="1" :max="10" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">Basement</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.basement" :min="0" :max="10" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">Upper Floor</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.upperFloor" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">

                                                <div class="w-[100px]">Elevator</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.elevator" :min="0" :max="10" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">

                                                <div class="w-[100px]">Parking</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.parking" :min="0" :max="500" />
                                                </div>
                                        </div>


                                </div>
                        </li>
                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-primary/25 pb-4 hover:border-primary">
                                        Finance</div>
                                <div class="flex flex-col border-b text-lg font-calibre text-primary ">
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">IOD</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.iod" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">GDM</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.gdm" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">

                                                <div class="w-[100px]">NOC</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.noc" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">

                                                <div class="w-[100px]">Eff. Ratio</div>
                                                <div class="flex-1  relative pt-3">
                                                        <Slider v-model="moreFilters.effRatio" />
                                                </div>
                                        </div>


                                </div>
                        </li>
                </ul>
        </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useFilterStore } from '~/stores/filter';
import { useDataStore } from '~/stores/data';
const filterStore = useFilterStore()
const dataStore = useDataStore()
const { moreFilters } = storeToRefs(useFilterStore());


import { computed, watch } from 'vue';

//@ts-ignore
import Slider from '@vueform/slider'
import "@vueform/slider/themes/default.css";
import { Switch } from '@headlessui/vue'

const currentYear = computed(() => { return Number(new Date().getFullYear()) })
watch(moreFilters.value, (nv, ov) => {
        dataStore.setFilterAssets()
})


const thounds = (value: number) => {
        if (moreFilters.value.gfaType) {
                return thousandsFormat(value) + ' ㎡'
        } else {
                return thousandsFormat(value) + ' py'
        }
}



</script>



<style >
:root {
        --slider-connect-bg: #17E88F50;
        --slider-tooltip-bg: #778F9C;
        --slider-handle-ring-color: #3B82F630;
}
</style>