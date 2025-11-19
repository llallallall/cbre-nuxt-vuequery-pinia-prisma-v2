<template>

        

        <div class="flex w-full justify-between">
                <div class="font-financierSemibold"
                        :class="isGrid ? 'text-ellipsis xl:truncate  overflow-auto xl:overflow-hidden' : 'whitespace-nowrap xl:whitespace-break-spaces'">
                        GFA :</div>
                <div class="text-right whitespace-nowrap">
                        {{ numberFormat(item.sizes.gfaSqm,
                                2)
                        }} m<sup>2</sup>
                </div>
        </div>
        <div class="flex w-full justify-between">
                <div class="font-financierSemibold"
                        :class="menuStore.isGrid ? 'text-ellipsis xl:truncate  overflow-auto xl:overflow-hidden' : 'whitespace-nowrap xl:whitespace-break-spaces'">
                        NFA : </div>
                <div class="text-right whitespace-nowrap">
                        {{ numberFormat(item.sizes.nfaSqm,
                                2)
                        }} m<sup>2</sup>
                </div>
        </div>
        <div class="flex w-full justify-between">
                <div class="font-financierSemibold"
                        :class="menuStore.isGrid ? 'text-ellipsis xl:truncate  overflow-auto xl:overflow-hidden' : 'whitespace-nowrap xl:whitespace-break-spaces'">
                        Site Area :</div>
                <div class="text-right whitespace-nowrap">
                        {{
                                numberFormat(item.sizes.siteAreaSqm,
                                        2)
                        }} m<sup>2</sup>
                </div>
        </div>
        <div class="flex w-full  justify-between">
                <div class="flex-auto font-financierSemibold"
                        :class="isGrid ? 'text-ellipsis xl:truncate  overflow-auto xl:overflow-hidden' : 'whitespace-nowrap xl:whitespace-break-spaces'">
                        YR. BLT / RENO :</div>
                <div class="flex-none text-right whitespace-nowrap">
                        {{
                                item.historyList.find((el:any)=>el.type ==='COMPLETION') && item.historyList.find((el:any)=>el.type ==='COMPLETION').year > 0 ? item.historyList.find((el:any)=>el.type ==='COMPLETION').year :  'N.A.'
                        }} /
                        {{  item.historyList.find((el:any)=>el.type ==='RENOVATION') && item.historyList.find((el:any)=>el.type ==='RENOVATION').year > 0 ? item.historyList.find((el:any)=>el.type ==='RENOVATION').year : 'N.A.'
                        }}
                </div>
        </div>




        <div class="flex w-full justify-between">
                <div class="flex-auto font-financierSemibold"
                        :class="menuStore.isGrid ? 'text-ellipsis xl:truncate  overflow-auto xl:overflow-hidden' : 'whitespace-nowrap xl:whitespace-break-spaces'">
                        CONFIGURATION : </div>
                <div class="flex-none text-right whitespace-nowrap">
                        {{ item.sizes.basementLevels > 0 ? 'B' + item.sizes.basementLevels +
                                'F - '
                                : null
                        }}
                        {{ item.sizes.upperLevels > 0 ? item.sizes.upperLevels + 'F' :
                                'N.A.' }}
                </div>
        </div>
</template>

<script setup lang="ts">

import { storeToRefs } from "pinia";
import { useMenuStore } from '~/stores/menu';
const menuStore = useMenuStore()
const { isGrid } = storeToRefs(useMenuStore());

const { item } = defineProps({
        item: {
                required: true,
                type: Object
        }
})
</script>

