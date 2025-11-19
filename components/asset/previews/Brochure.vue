<template>
  <div class="bg-white mt-4">

    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Brochure</span>
      <button @click="panelStore.openPanel('brochure')" 
              class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <div  v-if="property.brochureList && property.brochureList.length > 0" class="grid grid-cols-1 gap-10 pl-[20px]" >
        
        <div v-for="(file, index) in property.brochureList.filter((el:any) => el.fileUrl && (el.fileUrl+'').trim().length > 0 )"
                class="border-white/25 hover:text-blue-500 transition-all">
                <span v-if=file.fileUrl @click="openPdfModal(file.fileUrl)"
                        class="object-contain w-full h-full border-white/25 border-2 ">
                        {{index+1}}. {{file?.fileName}} 
                </span>
        </div>

    </div>
    <div v-else class="text-center py-10 text-gray-500 text-sm">
         No brochure files have been uploaded.
    </div>
   
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app';


// 이전 단계에서 정의한 패널 상태 관리 스토어
import { useModifyPanelStore } from '~/stores/modifyPanel'; 
import { ModalsContainer, useModal } from 'vue-final-modal';


const propertyStore = usePropertyStore();
const panelStore = useModifyPanelStore();
const appStore = useAppStore();

const property = computed(() => propertyStore.$state);

const openPdfModal = (url: string) => {
    appStore.setPdfModalOpen(url);
};


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