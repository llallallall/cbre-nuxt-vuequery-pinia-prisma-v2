<template>
        <div class="relative font-financier text-2xl text-primary">
                Acccessibility</div>


        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 ">

                <li v-if="item.accessibility.distanceToIc" class="flex items-center ">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Distance IC :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.accessibility.distanceToIc
                                }}
                        </div>
                </li>
                <li v-if="item.accessibility.timeTakenToCityHall" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                City Hall :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.accessibility.timeTakenToCityHall
                                }}
                        </div>
                </li>
                <li v-if="item.accessibility.timeTakenToSubway" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Subway :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.accessibility.timeTakenToSubway
                                }}
                        </div>
                </li>
                <li v-if="item.accessibility.nearbyFacilities" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Facilities :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.accessibility.nearbyFacilities
                                }}
                        </div>
                </li>
                <li v-if="item.accessibility.nearbyAttractions" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Attractions :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.accessibility.nearbyAttractions
                                }}
                        </div>
                </li>
                <li v-if="item.accessibility.nearbyPlaces" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Places :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.accessibility.nearbyPlaces
                                }}
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
        /* margin: 0 0 1em; */
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>