<template>
         <div :ref="el => { menuStore.detailMapRef[item.propertyId] = el }" class="font-financier text-2xl mb-4 text-primary">
                Location Description</div>
        <!-- <div>
        {{ item.location }} 
        </div>-->

        
        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location.addressFull" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Address :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.location.addressFull
                                }}
                        </div>
                </li>
        </ul> 
        
         <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location.addressFullJibun && item.location.addressFullJibun.trim.length > 0" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Jibun :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.location.addressFullJibun
                                }}
                        </div>
                </li>
        </ul> 
         <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location.addressProvince && item.location.addressProvince.trim.length > 0" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Province :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.location.addressProvince
                                }}
                        </div>
                </li>
        </ul> 
        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location.addressCity && item.location.addressCity.trim.length > 0" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                City :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.location.addressCity
                                }}
                        </div>
                </li>
        </ul> 
        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location.latitude" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Latitude :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.location.latitude
                                }}
                        </div>
                </li>
        </ul> 
        <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                <li v-if="item.location.longitude" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Longitude :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.location.longitude
                                }}
                        </div>
                </li>
        </ul> 

        <!-- <div class="font-calibreLight text-lg text-primary">
                With over 20,000 VPD, this 4.57 AC site
                is a
                prime location for development. Both
                sites are
                ideally situated off Exit 82 surrounded
                by
                restaurants and industrial facilities.
        </div> -->


<!-- :ref="el => { menuStore.detailMapRef[item.propertyId] = el }" :id="'detailMap' + item.propertyId" v-if="propertyStore.location.latitude" -->
        <div 
                v-if="item.location.latitude && item.location.longitude"
                class="detail-map my-10">
                <GoogleMap :api-key="runtimeConfig.public.googleApiToken" style="width: 100%; height: 500px"
                        :center="{ lat : item.location.latitude, lng : item.location.longitude}" :zoom="15">
                        <Marker :options="{ position: { lat : item.location.latitude, lng : item.location.longitude} }" />
                </GoogleMap>
        </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMenuStore } from '~/stores/menu';
import { usePropertyStore } from '~/stores/property';

const runtimeConfig = useRuntimeConfig()
const menuStore = useMenuStore()
const propertyStore = usePropertyStore()

const { detailMapRef, isGrid } = storeToRefs(useMenuStore());

const { item } = defineProps({
        item: {
                required: true,
                type: Object
        }
})

//@ts-ignore
import { GoogleMap, Marker } from "vue3-google-map";


</script>

<style scoped></style>