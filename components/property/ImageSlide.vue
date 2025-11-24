<template>
        <div class="image-slide w-full h-[500px] select-none">
                <img ref="slide"
                        :src="images.length < 1 ? '/images/placeholder.jpg' : images[images.length - 1]?.remoteFileUrl ? images[images.length - 1]?.remoteFileUrl : images[images.length - 1]?.fileUrl ? images[images.length - 1]?.fileUrl : '/images/placeholder.jpg'"
                        class="object-cover w-full max-h-[500px] relative " />
                <div class="small-previews w-full h-[100px] flex justify-center items-end gap-3 z-10 ">
                        <div v-for="preview in images"
                                class="preview overflow-hidden w-[50px] h-[50px] border-white/25 border-4 shadow-xl hover:scale-125 transition-all">
                                <img :src="(preview?.remoteFileUrl ? preview?.remoteFileUrl : preview?.fileUrl as string)"
                                        @click="setImageSrc(preview?.remoteFileUrl as string)"
                                        class="object-cover w-full  border-white/25 border-2 " />

                        </div>
                </div>

                <div class="expand-icon text-primary hover:text-white backdrop-blur-sm bg-white/25 hover:bg-primary/75"
                        @click="() => open()">
                        <IconExpand />
                </div>
        </div>
</template>

<script setup lang="ts">

import { useModal } from 'vue-final-modal'
import ModalFullscreen from '@/components/modal/FullscreenModal.vue'

const { images } = defineProps({
        images: {
                required: true,
                type: Object
        }
})

const slide = ref()
const setImageSrc = (src: string) => {
        slide.value.src = src
}

const currentImgUrl = ref(images[images.length - 1]?.remoteFileUrl ? images[images.length - 1]?.remoteFileUrl : images[images.length - 1]?.fileUrl)


const { open, close } = useModal({
        component: ModalFullscreen,
        attrs: {
                imgUrl: currentImgUrl,
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
