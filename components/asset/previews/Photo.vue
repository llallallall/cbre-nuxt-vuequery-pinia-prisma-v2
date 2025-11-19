<template>
  <div class="bg-white mt-4">

    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Photo</span>
      <button @click="panelStore.openPanel('photo')" 
              class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <div  v-if="property.photoList && property.photoList.length > 0" class="grid md:grid-cols-3 grid-cols-1 gap-10 pl-[20px]" >
        
        <div v-for="photo in property.photoList.filter((el:any) => el.fileUrl && (el.fileUrl+'').trim().length > 0 )"
                class="border-white/25 border-4 shadow-xl hover:scale-105 transition-all"
                @click="open();currentImgUrl=photo.fileUrl;">
                <img v-if=photo.fileUrl :src=photo.fileUrl
                        class="object-contain w-full h-full border-white/25 border-2 " />
                
                <div v-if="photo.main" class="w-full text-xs text-[#ff6057] font-semibold text-center pt-1" >* main</div>        
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