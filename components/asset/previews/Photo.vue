<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Photo</span>
      <button @click="openEditPanel"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <div v-if="validPhotos.length > 0" class="grid md:grid-cols-3 grid-cols-1 gap-10 pl-[20px]">
      <div v-for="photo in validPhotos" :key="photo.id"
        class="border-white/25 border-4 shadow-xl hover:scale-105 transition-all cursor-pointer"
        @click="openModal(photo.fileUrl || '')">
        <img :src="photo.fileUrl || ''" class="object-contain w-full h-full border-white/25 border-2" />
        <div v-if="photo.main" class="w-full text-xs text-[#ff6057] font-semibold text-center pt-1">* main</div>
      </div>
    </div>
    <div v-else class="text-center py-10 text-gray-500 text-sm">
      No photos have been uploaded.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useModal } from 'vue-final-modal';
import ModalFullscreen from '~/components/modal/Fullscreen.vue';

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const { currentProperty: property } = storeToRefs(propertyStore);
const currentImgUrl = ref<string>('');

const openEditPanel = () => {
  uiStore.openModifyPanel(propertyStore.currentPropertyId, 'photo');
};

// 💡 유효한 이미지 필터링
const validPhotos = computed(() => {
  return property.value?.propertyImageFile?.filter(
    (el: any) => el.fileUrl && (el.fileUrl + '').trim().length > 0
  ) || [];
});

const { open, close } = useModal({
  component: ModalFullscreen,
  attrs: {
    imgUrl: currentImgUrl,
    onClose() { close() },
    clickToClose: true,
    escToClose: true,
  } as any,
});

const openModal = (url: string) => {
  currentImgUrl.value = url;
  open();
};
</script>