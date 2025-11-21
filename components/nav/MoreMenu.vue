<template>
        <div class="flex w-full h-full">
                <div class="w-3/12 flex flex-col justify-start items-start pl-14">
                        <p class="text-4xl 4xs:text-6xl font-financier pt-16 mb-0">More</p>
                        <p class="text-2xl 4xs:text-4xl font-financier pt-1 mb-5">Filters</p>
                        <p class="hidden 4xs:flex text-base font-financier text-primary">
                                You can set details such as the size of the property, the year of construction, and
                                facilities as search conditions.
                        </p>
                </div>

                <ul
                        class="w-9/12 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-start items-start pt-16 pl-14 pr-4">

                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-primary/25 pb-4 hover:border-primary">
                                        Size
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-primary">

                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">GFA</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.gfa" :min="0" :max="100000"
                                                                :step="100" :format="thoundsGfa" />
                                                </div>
                                                <div
                                                        class="absolute bottom-0 left-0 text-xs font-mono flex items-center">
                                                        <span class="pr-[3px]">py</span>
                                                        <Switch v-model="moreFilters.gfaType"
                                                                :class="moreFilters.gfaType ? 'bg-teal-900' : 'bg-gray-300'"
                                                                class="relative inline-flex h-[12px] w-[28px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                                                                <span aria-hidden="true"
                                                                        :class="moreFilters.gfaType ? 'translate-x-4' : 'translate-x-0'"
                                                                        class="pointer-events-none inline-block h-[8px] w-[8px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                        </Switch>
                                                        <span class="pl-[3px]">sqm</span>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">NFA</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.nfa" :min="0" :max="100000"
                                                                :step="100" :format="thoundsNfa" />
                                                </div>
                                                <div
                                                        class="absolute bottom-0 left-0 text-xs font-mono flex items-center">
                                                        <span class="pr-[3px]">py</span>
                                                        <Switch v-model="moreFilters.nfaType"
                                                                :class="moreFilters.nfaType ? 'bg-teal-900' : 'bg-gray-300'"
                                                                class="relative inline-flex h-[12px] w-[28px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                                                                <span aria-hidden="true"
                                                                        :class="moreFilters.nfaType ? 'translate-x-4' : 'translate-x-0'"
                                                                        class="pointer-events-none inline-block h-[8px] w-[8px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                        </Switch>
                                                        <span class="pl-[3px]">sqm</span>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">Site Area</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.siteArea" :min="0" :max="100000"
                                                                :step="100" :format="thoundsSite" />
                                                </div>
                                                <div
                                                        class="absolute bottom-0 left-0 text-xs font-mono flex items-center">
                                                        <span class="pr-[3px]">py</span>
                                                        <Switch v-model="moreFilters.siteAreaType"
                                                                :class="moreFilters.siteAreaType ? 'bg-teal-900' : 'bg-gray-300'"
                                                                class="relative inline-flex h-[12px] w-[28px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                                                                <span aria-hidden="true"
                                                                        :class="moreFilters.siteAreaType ? 'translate-x-4' : 'translate-x-0'"
                                                                        class="pointer-events-none inline-block h-[8px] w-[8px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                        </Switch>
                                                        <span class="pl-[3px]">sqm</span>
                                                </div>
                                        </div>
                                </div>
                        </li>

                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-primary/25 pb-4 hover:border-primary">
                                        Period
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-primary">
                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">Built</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.built" :min="1960"
                                                                :max="currentYear" />
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('built')"
                                                                class="rounded-md text-teal-900 bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">reset</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">Reno</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.reno" :min="1960"
                                                                :max="currentYear" />
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('reno')"
                                                                class="rounded-md text-teal-900 bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">reset</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">Sales</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.sales" :min="1960"
                                                                :max="currentYear" />
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('sales')"
                                                                class="rounded-md text-teal-900 bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">reset</button>
                                                </div>
                                        </div>

                                        <div
                                                class="flex flex-row border-b border-primary/25 py-4 hover:border-primary relative">
                                                <div class="w-[100px]">Leases</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.leases" :min="1960"
                                                                :max="currentYear" />
                                                </div>
                                                <div class="absolute bottom-1 left-0 text-xs font-mono">
                                                        <button @click="resetFilter('leases')"
                                                                class="rounded-md text-teal-900 bg-gray-300 text-[10px] px-1 py-0 hover:bg-gray-400">reset</button>
                                                </div>
                                        </div>
                                </div>
                        </li>

                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-primary/25 pb-4 hover:border-primary">
                                        Facility
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-primary">
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">Buildings</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.buildings" :min="0" :max="10" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">Basement</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.basement" :min="0" :max="10" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">Upper Floor</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.upperFloor" :min="0" :max="50" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">Elevator</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.elevator" :min="0" :max="20" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">Parking</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.parking" :min="0" :max="500"
                                                                :step="10" />
                                                </div>
                                        </div>
                                </div>
                        </li>

                        <li class="flex flex-col">
                                <div
                                        class="text-3xl font-financier text-secondary border-b border-primary/25 pb-4 hover:border-primary">
                                        Finance
                                </div>
                                <div class="flex flex-col border-b text-lg font-calibre text-primary">
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">IOD</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.iod" :min="0" :max="10"
                                                                :step="0.1" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">GDM</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.gdm" :min="0" :max="10"
                                                                :step="0.1" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">NOC</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.noc" :min="0" :max="100000"
                                                                :step="1000" />
                                                </div>
                                        </div>
                                        <div class="flex flex-row border-b border-primary/25 py-4 hover:border-primary">
                                                <div class="w-[100px]">Eff. Ratio</div>
                                                <div class="flex-1 relative pt-3">
                                                        <Slider v-model="moreFilters.effRatio" :min="0" :max="100" />
                                                </div>
                                        </div>
                                </div>
                        </li>
                </ul>
        </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from "pinia";
import { usePropertyStore } from '~/stores/property';
import { useFormat } from '~/composables/useFormat';

//@ts-ignore
import Slider from '@vueform/slider';
import "@vueform/slider/themes/default.css";
import { Switch } from '@headlessui/vue';

const propertyStore = usePropertyStore();
// propertyStore의 moreFilters는 reactive 상태이므로 storeToRefs로 가져와야 반응성이 유지됩니다.
const { moreFilters } = storeToRefs(propertyStore);

const { numberFormat } = useFormat();
const currentYear = computed(() => new Date().getFullYear());

// 값이 변경될 때마다 필터링 적용
watch(moreFilters, () => {
        propertyStore.applyFilter();
}, { deep: true });

// 포맷팅 함수들
const formatValue = (value: number, type: boolean) => {
        const unit = type ? ' ㎡' : ' py';
        return numberFormat(value, 0) + unit;
};

const thoundsGfa = (value: number) => formatValue(value, moreFilters.value.gfaType);
const thoundsNfa = (value: number) => formatValue(value, moreFilters.value.nfaType);
const thoundsSite = (value: number) => formatValue(value, moreFilters.value.siteAreaType);

// 개별 필터 리셋 함수
const resetFilter = (key: 'built' | 'reno' | 'sales' | 'leases') => {
        if (moreFilters.value) {
                moreFilters.value[key] = 0;
                // watch가 트리거되어 applyFilter()가 호출됩니다.
        }
};
</script>

<style>
:root {
        --slider-connect-bg: #17E88F50;
        --slider-tooltip-bg: #778F9C;
        --slider-handle-ring-color: #3B82F630;
}
</style>