<template>
        <div class="relative font-financier text-2xl text-primary">
                General Infomation</div>

        
        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid " :class="{
                                'grid-cols-1': propertyStore.shrinkPreview && !propertyStore.growPreview,
                                'grid-cols-2': !propertyStore.shrinkPreview && !propertyStore.growPreview,
                                'grid-cols-3': !propertyStore.shrinkPreview && propertyStore.growPreview,
                        }">
                <!-- <li v-if="propertyStore.lastPropertyId" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Property Id :
                        </div>
                        <div class="flex-1">
                                {{
                                        Number(propertyStore.lastPropertyId)+1
                                }}
                        </div>
                </li>         -->
                <li v-if="item.profitability.grade" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Grade :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.profitability.grade
                                }}
                        </div>
                </li>
                <li v-if="item.profitability.effRatio && item.profitability.effRatio.toString().trim.length > 0" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Effective Ratio :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.profitability.effRatio
                                }} %
                        </div>
                </li>
                <li v-if="item.sizes.noOfBuildings" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                No. of Buildings :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.sizes.noOfBuildings
                                }} 
                        </div>
                </li>
                <li v-if="item.general.sector" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Sector :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.general.sector.name
                                }}
                        </div>
                </li>
                <li v-if="item.general.subSector" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                SubSector
                                :
                        </div>
                        <div class="flex-1">
                                {{
                                        item?.general.subSector.name
                                }}
                        </div>
                </li>
                <li v-if="item.general.sector.name === 'Logistics' && item.general.warehouse" class="flex items-start mt-0">
                        <IconMinus class="w-[18px] mr-1 mt-2" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Usage
                                :
                        </div>
                        <div class="flex-1">
                                <table class="text-xs mt-2">
                                        <thead>
                                                <tr class="text-right">
                                                        <th class="px-2 ">Room</th>
                                                        <th class="px-2 ">Low</th>
                                                        <th class="px-2 ">Constant</th>
                                                </tr>

                                        </thead>
                                        <tbody>
                                                <tr class="text-right">
                                                        <td class="px-2 "> {{
                                                                item?.general.warehouse?.room
                                                        }}%</td>
                                                        <td class="px-2 "> {{
                                                                item?.general.warehouse?.low
                                                        }}%</td>
                                                        <td class="px-2 "> {{
                                                                item?.general.warehouse?.constant
                                                        }}%</td>
                                                </tr>
                                        </tbody>
                                </table>

                        </div>
                </li>
        </ul>
</template>

<script setup lang="ts">
import { usePropertyStore } from '~/stores/property';
const propertyStore = usePropertyStore()
const { item } = defineProps({
        item: {
                required: true,
                type: Object
        }
})


</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        /* margin: 0 0 1em; */
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>