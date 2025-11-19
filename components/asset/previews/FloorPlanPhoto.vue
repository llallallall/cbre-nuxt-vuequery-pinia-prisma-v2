<template>
  <div class="bg-white mt-4">

    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Floor Plan Photo</span>
      <button @click="panelStore.openPanel('floorplan')" 
              class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <div  v-if="property.floorPlanPhotoList && 
    (property.floorPlanPhotoList.logitudinal.length > 0 ||
    property.floorPlanPhotoList.cross.length > 0 ||
    property.floorPlanPhotoList.eachFloor.uppers.length > 0 ||
    property.floorPlanPhotoList.eachFloor.basements.length > 0 
    )
    "  >
        <h3 class="text-md font-bold mt-6 mb-2 text-primary pr-2 ">- Logitudinal Section</h3>


         <div class="grid grid-cols-3 gap-4 pl-[20px] w-full">
                <div v-for="(photo, index) in property.floorPlanPhotoList.logitudinal.filter((el:any) => el.fileUrl && (el.fileUrl+'').trim().length > 0 )"
                        :key="photo.fileUuid || index"
                        class="flex justify-center items-center hover:scale-105 transition-all border border-transparent">
                        
                        <img v-if="photo.fileUrl" 
                        :src="photo.fileUrl"
                        class="object-contain border-white/25 relative  border-4 shadow-xl cursor-pointer"
                        @click="open();currentImgUrl=photo.fileUrl;"/>
                </div>
        </div>
        <h3 class="text-md font-bold mt-6 mb-2 text-primary pr-2 ">- Cross Section</h3>
        <div class="grid grid-cols-3 gap-4 pl-[20px] w-full">
                <div v-for="(photo, index) in property.floorPlanPhotoList.cross.filter((el:any) => el.fileUrl && (el.fileUrl+'').trim().length > 0 )"
                        :key="photo.fileUuid || index"
                        class="flex justify-center items-center hover:scale-105 transition-all border border-transparent">
                        
                        <img v-if="photo.fileUrl" 
                        :src="photo.fileUrl"
                        class="object-contain border-white/25 relative  border-4 shadow-xl cursor-pointer"
                        @click="open();currentImgUrl=photo.fileUrl;"/>
                </div>
        </div>

        
        <h3 class="text-md font-bold mt-6 mb-2 text-primary pr-2 "> - Each Floors</h3>
        <div class="flex flex-col w-full bg-gray-50 p-4 rounded-lg mt-6">
                <h3 class="text-md font-semibold mt-6 mb-2 text-primary pr-2 ">- Uppers</h3>
                <div class="grid grid-cols-3 gap-4 pl-[20px] w-full">
                        <div v-for="(photo, index) in property.floorPlanPhotoList.eachFloor.uppers.filter((el:any) => el.fileUrl && (el.fileUrl+'').trim().length > 0 )"
                                :key="photo.fileUuid || index"
                                class="flex justify-center items-center hover:scale-105 transition-all border border-transparent">
                                
                                <img v-if="photo.fileUrl" 
                                :src="photo.fileUrl"
                                class="object-contain border-white/25 relative  border-4 shadow-xl cursor-pointer"
                                @click="open();currentImgUrl=photo.fileUrl;"/>
                        </div>
                </div>
                
                
                <h3 class="text-md font-semibold mt-6 mb-2 text-primary pr-2 ">- Basements</h3>

                <div class="grid grid-cols-3 gap-4 pl-[20px] w-full">
                        <div v-for="(photo, index) in property.floorPlanPhotoList.eachFloor.basements.filter((el:any) => el.fileUrl && (el.fileUrl+'').trim().length > 0 )"
                                :key="photo.fileUuid || index"
                                class="flex justify-center items-center hover:scale-105 transition-all border border-transparent">
                                
                                <img v-if="photo.fileUrl" 
                                :src="photo.fileUrl"
                                class="object-contain border-white/25 relative  border-4 shadow-xl cursor-pointer"
                                @click="open();currentImgUrl=photo.fileUrl;"/>
                        </div>
                </div>
        </div>
        
       
    </div>

    <div v-else class="text-center py-10 text-gray-500 text-sm">
         No photos have been uploaded.
    </div>

</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePropertyStore } from '~/stores/property';

import { useModal } from 'vue-final-modal'
import ModalFullscreen from '@/components/modal/Fullscreen.vue'

// 이전 단계에서 정의한 패널 상태 관리 스토어
import { useModifyPanelStore } from '~/stores/modifyPanel'; 

const propertyStore = usePropertyStore();
const panelStore = useModifyPanelStore();

const property = computed(() => propertyStore.$state);
const currentImgUrl = ref<string | null>(null);

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
/* 기존 스타일 유지 */
.cbre_bulletList {
        list-style: none;
        padding: 0 0 0 20px;
        line-height: 2;
}
.expand-icon {
        position: absolute;
        top: 0;
        right: 0;
}
</style>