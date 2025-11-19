<template>
        <div class="font-financier text-2xl text-primary">
                Facility Information</div>


        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">


                <li v-if="item.facility?.elevators?.total > 0" class="flex items-center ">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Elevators
                                :
                        </div>
                        <div class="flex-1">
                                <span v-if="item.facility?.elevators?.total">{{ item.facility?.elevators?.total }}</span>
                                <span v-if="item.facility?.elevators?.total > 0">(</span>
                                <span v-if="item.facility?.elevators?.passenger">&nbsp;{{ item.facility?.elevators?.passenger
                                }} for passenger&nbsp;/&nbsp;</span>

                                <span v-if="item.facility?.elevators?.service">&nbsp;{{ item.facility?.elevators?.service
                                }} for service&nbsp;/&nbsp;</span>

                                <span v-if="item.facility?.elevators?.shuttle">&nbsp;{{ item.facility?.elevators?.shuttle
                                }} for freight&nbsp;</span>
                                <span v-if="item.facility?.elevators?.total > 0">)</span>
                        </div>
                </li>
                 <li v-if="item.facility?.materials?.facade" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Façade :
                        </div>
                        <div class="flex-1">
                                {{ item.facility?.materials?.facade }}
                        </div>
                </li>

                <li v-if="item.facility?.materials?.roofMaterial" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Roof Material :
                        </div>
                        <div class="flex-1">
                                {{ item.facility?.materials?.roofMaterial }}
                        </div>
                </li>

        </ul>



        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid" :class="{
                'grid-cols-1': propertyStore.shrinkPreview && !propertyStore.growPreview,
                'grid-cols-2': !propertyStore.shrinkPreview && !propertyStore.growPreview,
                'grid-cols-3': !propertyStore.shrinkPreview && propertyStore.growPreview,
        }">


               
                <li v-if="item.facility?.materials?.lighting" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Lighting :
                        </div>
                        <div class="flex-1">
                                {{ item.facility?.materials?.lighting }}
                        </div>
                </li>

                <li v-if="item.facility?.materials?.mechanicalElectrical" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                M & E :
                        </div>
                        <div class="flex-1">
                                {{ thousandsFormat(item.facility?.materials?.mechanicalElectrical) }} kW
                        </div>
                </li>



        </ul>
        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">

                <li v-if="item.facility?.materials?.fireFighting" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Fire Fighting :
                        </div>
                        <div class="flex-1">
                                {{ item.facility?.materials?.fireFighting }}
                        </div>
                </li>

        </ul>
</template>

<script setup lang="ts">
const { item } = defineProps({
        item: {
                required: true,
                type: Object
        }
})
import { usePropertyStore } from '~/stores/property';
const propertyStore = usePropertyStore()
</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        /* margin: 0 0 1em 0; */
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>