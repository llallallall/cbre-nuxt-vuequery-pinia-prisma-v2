<template>
        <div :ref="el => { menuStore.detailFloorPlanRef[item.propertyId] = el }"
                class="font-financier text-2xl text-primary mb-[20px]">
                Floor Plan</div>
      
        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-2 ">
                <li class="flex items-center">

                        <div class="relative w-full max-h-[600px] p-4 select-none">
                                <div class="absolute h-[30px] top-0 left-0 pl-[16px] font-financier text-xl text-primary z-10 ">
                                        Logitudinal Section
                                </div>
                              

                                <div v-if="item.floorPlanPhotoList.logitudinal && item.floorPlanPhotoList.logitudinal[0]?.fileUrl " 
                                        class="flex-1 flex flex-col mt-[30px]">
                                      <AssetImageSlide :images="(item.floorPlanPhotoList.logitudinal as any[])" />
                                </div>
                        </div>
                </li>
                <li class="flex items-center">

                        <div class="relative w-full max-h-[600px] p-4 select-none">
                                <div class="absolute h-[30px]  top-0 left-0 pl-[20px] font-financier text-xl text-primary z-10">
                                        Cross Section
                                </div>
                             
                                <div v-if="item.floorPlanPhotoList.cross && item.floorPlanPhotoList.cross[0]?.fileUrl" 
                                        class="mt-[30px] flex-1 flex flex-col">
                                      <AssetImageSlide :images="(item.floorPlanPhotoList?.cross as any[])" />
                                </div>
                        </div>
                </li>



        </ul>

        <Disclosure defaultOpen>
                <DisclosureButton class="relative flex justify-between gap-3 w-full p-4 py-2 pr-0 select-none ">


                        <div class="w-1/2 flex justify-start pl-[20px] font-financier text-xl text-primary ">Each Floor Plan
                        </div>

                        <div class="w-1/2 flex justify-end">
                                <div class="bg-primary/10 hover:bg-primary/25 
                                                                        text-primary rounded-full
                                                                        px-4 py-1 min-w-[100px]
                                                                        flex justify-center items-center ">
                                        {{  Number(item.sizes.upperLevels ?? 0) + Number(item.sizes.basementLevels ?? 0) }}
                                </div>
                        </div>


                </DisclosureButton>
                <DisclosurePanel class="w-full font-calibreLight text-lg text-primary ">

                        <ul  
                                class="w-full font-calibreLight text-lg text-primary gap-10 grid grid-cols-2 lg:grid-cols-2 3xl:grid-cols-2">

                                <li v-if="item.sizes.upperLevels > 0 && item.floorPlanPhotoList.eachFloor.uppers[0]?.fileUrl" v-for="(floor, index) in item.floorPlanPhotoList?.eachFloor?.uppers" :key="index"
                                        class="relative flex items-center ml-8">

                                        <div 
                                                class="relative w-full max-h-[500px] flex justify-center select-none bg-gray-200/25 " >
                                              
                                                <div class="absolute h-[30px]  top-0 left-0 pl-[20px] font-financier text-xl text-primary z-10">
                                                        {{ floor.type }} {{ floor.floor }} F
                                                </div>
                                                <div class="absolute top-0 right-0 text-primary hover:text-white backdrop-blur-sm bg-white/25 hover:bg-primary/75"
                                                  @click="()=> {currentImgUrl.value=floor?.fileUrl; open();}"      >
                                                        <IconExpand />
                                                </div> 
                                                <div 
                                                        class="mt-[30px] flex-1 flex flex-col">
                                                        <img :src="floor?.fileUrl ? floor?.fileUrl : ''" 
                                                        class="object-contain w-[calc(100%-2.5rem)] p-5 pt-10" />
                                                </div>
                                        </div>
                                </li>

                                <li v-if="item.sizes.basementLevels > 0 && floorPlanPhotoList.eachFloor.basements[0]?.fileUrl" v-for="(floor, index) in item.floorPlanPhotoList.eachFloor.basements" :key="index"
                                        class="relative flex items-center ml-8">

                                        <div 
                                                class="relative w-full max-h-[500px] flex justify-center select-none bg-gray-200/25 " >
                                              
                                                <div class="absolute h-[30px]  top-0 left-0 pl-[20px] font-financier text-xl text-primary z-10">
                                                        {{ floor.type }} {{ floor.floor }} F
                                                </div>
                                                <div class="absolute top-0 right-0 text-primary hover:text-white backdrop-blur-sm bg-white/25 hover:bg-primary/75"
                                                  @click="()=> {currentImgUrl.value=floor?.fileUrl; open();}"      >
                                                        <IconExpand />
                                                </div> 
                                                <div 
                                                        class="mt-[30px] flex-1 flex flex-col">
                                                        <img :src="floor?.fileUrl ? floor?.fileUrl : ''" 
                                                        class="object-contain w-[calc(100%-2.5rem)] p-5 pt-10" />
                                                </div>
                                        </div>
                                </li>

                                
                        </ul>

                </DisclosurePanel>
        </Disclosure>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMenuStore } from '~/stores/menu';
const menuStore = useMenuStore()
const { detailFloorPlanRef } = storeToRefs(useMenuStore());

import { usePropertyStore  } from '~/stores/property';
const { debug, shrinkPreview, growPreview, sizes, floorPlanPhotoList } = storeToRefs(usePropertyStore());

const { item } = defineProps({
        item: {
                required: true,
                type: Object
        }
})

import {
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
} from '@headlessui/vue'

import { useModal } from 'vue-final-modal'
import ModalFullscreen from '@/components/modal/Fullscreen.vue'

const currentImgUrl = ref()


const { open, close } = useModal({
    component: ModalFullscreen,
    attrs: {
      imgUrl : currentImgUrl,
      onClose() {
        close()
      },
      clickToClose: true,
      escToClose: true,
    } as any,
    
  })

</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        margin: 0 0 1em;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>