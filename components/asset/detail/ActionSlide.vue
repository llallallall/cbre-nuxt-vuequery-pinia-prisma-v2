<template>
        <div class="w-full flex flex-col sm:flex-row items-center justify-between">

                <div class="addresses w-full sm:w-1/2  mb-2 flex flex-col text-base relative">

                        <div v-if="item.location && item.location.addressProvince" class="address 
                                font-barlow text-gray-400 w-full 
                                flex items-center px-2">

                                <div class="truncate overflow-hidden relative">
                                        {{
                                                item.location.addressProvince 
                                        }}
                                        <span v-if="item.location && item.location.addressCity" > / {{  item.location.addressCity  }}</span>
                                </div>

                        </div>


                        <div v-if="item.location && item.location.addressFull" class="address 
                                font-barlow text-gray-600 w-full 
                                flex items-center px-2 ">

                                <div class="truncate overflow-hidden relative">

                                        {{
                                                item.location.addressFull
                                        }}
                                </div>
                        </div>

                       

                </div>

                <div
                        class="action-buttons-group w-full sm:w-1/2 flex my-4 sm:my-0 justify-start sm:justify-end items-center gap-3 font-calibre text-base">

                        <div class="action-buttons bg-primary/10 hover:bg-primary/25 
                        text-primary rounded-full 
                        whitespace-nowrap
                        px-4 py-1 
                        flex justify-center items-center gap-1" @click="moveToFloorPlan(item.propertyId)">
                                <IconFloorPlan class="text-primary w-[20px] h-[20px] " />
                                Floor Plan
                        </div>
                        <div class="action-buttons bg-primary/10 hover:bg-primary/25 text-primary rounded-full whitespace-nowrap
                                                                                                         px-4 py-1
                                                                                                         flex justify-center items-center gap-1"
                                @click="downloadAsPdf()">
                                <IconBook class="text-primary w-[20px] h-[20px] " />
                                <!-- <img src="/images/icon-print.png" class="text-primary w-[20px] h-[20px] " /> -->

                                Brochure
                        </div>
                        <div class="action-buttons bg-primary/10 hover:bg-primary/25 text-primary rounded-full whitespace-nowrap
                                                                                                         px-4 py-1
                                                                                                         flex justify-center items-center gap-1"
                                @click="moveToMap(item.propertyId)">
                                <IconMap class="text-primary w-[20px] h-[20px] " />
                                Map
                        </div>
                </div>

        </div>
      

        <div class="image-slide w-full h-[500px] select-none mt-2">
                <img :src="item.photoList.length < 1 ? '/images/placeholder.jpg' : currentImgUrl"
                        class="object-cover w-full h-full relative " />
                <div v-if="item.photoList " class="small-previews w-full h-[100px] flex justify-center items-end gap-3 z-10 ">
                        <div v-for="preview in item.photoList.filter((el:any) => el.fileUrl && (el.fileUrl+'').trim().length > 0 )"
                                class="preview overflow-hidden w-[50px] h-[50px] border-white/25 border-4 shadow-xl hover:scale-125 transition-all">
                                <img :src=preview.fileUrl
                                        @click="setImageSrc(preview.fileUrl)"
                                        class="object-cover w-full h-full border-white/25 border-2 " />
                        </div>
                </div>
                <div class="expand-icon text-primary hover:text-white backdrop-blur-sm bg-white/25 hover:bg-primary/75"
                @click="()=>open()">
                        <IconExpand />
                </div>
        </div>
</template>

<script setup lang="ts">
const { item } = defineProps({
        item: {
                required: true,
                type: Object
        }
})

import { useModal } from 'vue-final-modal'
import ModalFullscreen from '@/components/modal/Fullscreen.vue'
import { useMenuStore } from '~/stores/menu';
const menuStore = useMenuStore()
const runtimeConfig = useRuntimeConfig()

const setImageSrc = (src: string) => {
        currentImgUrl.value = src
}
const downloadAsPdf = () => {
        // alert('pdf')
        const pdfUrl = '/sample/files/P17230501783ad0470bcb501f9d81317eda.pdf'
        window.open(pdfUrl, '_blank');
}
const moveToFloorPlan = (id: string) => {
        menuStore.detailFloorPlanRef[id as any].scrollIntoView({ behavior: 'smooth' })

}

const moveToMap = (id: string) => {
        menuStore.detailMapRef[id as any].scrollIntoView({ behavior: 'smooth' })

}


// import printJS from 'print-js'
const googleApiKey = runtimeConfig.public.GOOGLE_TOKEN

const detailCardPrintAreaRef = inject('detailCardPrintAreaRef') as any;

import { onMounted } from 'vue';

const currentImgUrl = ref(item.photoList[0] && item.photoList[0]?.fileUrl ? item.photoList[0]?.fileUrl as string : '')


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
.image-slide {
        position: relative;
}

.small-previews {
        position: absolute;
        bottom: 10px;
        display: flex;
        flex-direction: row;
        justify-content: center;
}

.preview {
        display: inline-block;
        width: 120px;
        height: 90px;
        /* border: 4px solid white; */
        margin: 4px;

}

.expand-icon {
        position: absolute;
        top: 0;
        right: 0;
}
</style>
