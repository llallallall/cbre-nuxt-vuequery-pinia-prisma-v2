<template>
        <Disclosure defaultOpen>
                <DisclosureButton class="py-2 font-financier text-2xl text-primary w-full ">

                        <div class="flex justify-between gap-3 w-full mb-5">
                                <div class="w-1/2 flex justify-start">Floors Information</div>

                                <div class="w-1/2 flex justify-end">
                                        <div  class="bg-primary/10 hover:bg-primary/25 
                                        text-primary rounded-full
                                        px-4 py-1 min-w-[100px]
                                        flex justify-center items-center ">
                                                {{ info ? info.length : 0}}
                                        </div>
                                </div>
                        </div>

                </DisclosureButton>
                <DisclosurePanel  class="font-calibreLight text-lg text-primary w-full overflow-x-scroll">
                        <table class="table-auto w-full border-collapse border border-gray-200 mb-5">
                                <thead>
                                        <tr class="font-calibre border  bg-gray-200/50">

                                                <th v-for="item in floorHeaders" :key="item.value" class="whitespace-nowrap  px-2 
                                                        text-sm
                                                        text-center 
                                                        py-2
                                                        border border-white/75">
                                                        {{
                                                                item.text }}</th>
                                        </tr>
                                </thead>
                                <tbody>

                                        <!-- <tr v-for="(data, index ) in   JSON.parse(JSON.stringify(datas))  " :key="index"
                                                class="font-calibreLight ">

                                                <td v-for="(key, idx) in   (headerKeys as string[])  " :key="key + index"
                                                        :rowspan="data[key].rowspan ? data[key].rowspan : null"
                                                        :cowspan="data[key].colspan ? data[key].colspan : null"
                                                        :class="[headerClasses[idx], JSON.parse(JSON.stringify(datas))[index - 1] ? (JSON.parse(JSON.stringify(datas))[index - 1][key]?.rowspan ? 'hidden' : '') : null]"
                                                        class="whitespace-pre 
                                                        text-sm py-2
                                                        px-2 border border-gray-200">

                                                        {{ data[key].value }}
                                                </td>


                                        </tr> -->


                                        <!-- :rowspan="data[key].rowspan ? data[key].rowspan : null"
                                                        :cowspan="data[key].colspan ? data[key].colspan : null"
                                                        :class="[floorHeaderClasses[idx], JSON.parse(JSON.stringify(datas))[index - 1] ? (JSON.parse(JSON.stringify(datas))[index - 1][key]?.rowspan ? 'hidden' : '') : null]" -->
                                        <tr v-if="info?.uppers" v-for="(data, index ) in info?.uppers  " :key="index"
                                                class="font-calibreLight ">
                                                <td v-for="(key, idx) in   (floorHeaderKeys as string[])  " :key="key + index"
                                                        
                                                        class="whitespace-pre 
                                                        text-sm py-2
                                                        px-2 border border-gray-200">

                                                        {{ data[key] }}
                                                </td>
                                        
                                        </tr>


                                        <!-- :rowspan="data[key].rowspan ? data[key].rowspan : null"
                                                        :cowspan="data[key].colspan ? data[key].colspan : null"
                                                        :class="[floorHeaderClasses[idx], JSON.parse(JSON.stringify(datas))[index - 1] ? (JSON.parse(JSON.stringify(datas))[index - 1][key]?.rowspan ? 'hidden' : '') : null]" -->
                                        <tr v-if="info?.basements"  v-for="(data, index ) in info?.basements  " :key="index"
                                                class="font-calibreLight ">
                                                <td v-for="(key, idx) in   (floorHeaderKeys as string[])  " :key="key + index"
                                                        
                                                        class="whitespace-pre 
                                                        text-sm py-2
                                                        px-2 border border-gray-200">

                                                        {{ data[key] }}
                                                </td>
                                        
                                        </tr>

                                </tbody>
                        </table>
                </DisclosurePanel>
        </Disclosure>

          <!-- <div>
                                {{ info }}
                                </div> -->

</template>

<script setup lang="ts">
import {
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
} from '@headlessui/vue'
// import { JsonArray } from '@prisma/client/runtime/library';
// import { storeToRefs } from "pinia";
import { usePropertyStore } from '~/stores/property';

const propertyStore = usePropertyStore()
const { info } = defineProps({
        info: {
                required: false,
                type: Object
        }
        
})


const floorHeaders = [
        {
                text: 'Type',
                value: 'floor_type',
                class: 'text-right'
        }
        ,
        {
                text: 'Floor',
                value: 'num',
                class: 'text-right'
        }
        ,
        {
                text: 'Ceiling Height(m)',
                value: 'ceiling_height',
                class: 'text-right'
        }
        ,
        {
                text: 'Floor Load(ton/㎡)',
                value: 'floor_load',
                class: 'text-right'
        }
        ,
        {
                text: 'Truck Berths(units)',
                value: 'truck_berths',
                class: 'text-right'
        }


]



const floorHeaderKeys = computed(() => { return floorHeaders.map((header => header.value)) })
const floorHeaderClasses = computed(() => { return floorHeaders.map((header => header.class)) })
 



</script>

