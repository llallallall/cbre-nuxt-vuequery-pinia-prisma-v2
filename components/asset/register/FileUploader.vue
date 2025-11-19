<template>
        <form  method="post" enctype="multipart/form-data">
        <div class="relative border-2 border-dashed border-[rgba(255,255,255,0.2)] rounded-[5px] min-h-[5em] bg-[rgba(230,234,234,0.1)] 
                                                flex items-center justify-center
                                                " @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave"
                @drop.prevent="onDrop">
                <div class="relative block text-white text-xs flex-wrap px-[4em] text-center">
                        <span v-if="!isDragging">Drag & Drop {{ type !== 'image' ? 'PDF/Excel file' : type }}<span
                                        v-if="multiple">s</span>
                                here or <span class="text-cbre_primary_6 hover:text-cbre_primary_1 cursor-pointer duration-400"
                                        role="button" @click="selectFiles">Choose</span></span>
                        <div v-else class="text-cbre_primary_6 hover:text-cbre_primary_1 cursor-pointer duration-400">Drop
                                {{ type !== 'image' ? 'PDF/Excel file' : type }}<span v-if="multiple">s</span> here
                        </div>
                        <input ref="fileInput" name="file" type="file" :multiple="multiple" class="hidden"
                                @change="onFileSelect" :accept="(type === 'file') ? 'application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel' :
                                        'image/x-png,image/gif,image/jpeg'" />
                </div>
        </div>
        <div class="w-full h-auto flex flex-wrap max-h-[200px] relative mb-[1em]">
                <template v-if="type === 'image'">
                        <div v-for="image in images" :key="image.uuid"
                                class="text-rose-600/80 w-[5em] h-[5em] relative mt-[1em] mr-[1em] ">
                                <span class="absolute -top-[0.3em] right-[0.3em] cursor-pointer text-lg z-100"
                                        @click="deleteImage(name, image.uuid, image.name)">&times;</span>
                                <img :src="image?.url" class="w-[5em] h-[5em] rounded-[5px] mb-[1.5em] " />

                        </div>
                </template>
                <template v-else-if="type === 'file'">
                        <div v-for="(file, index) in docFiles" :key="file.uuid" class="relative mt-[1em] mr-[1em] ">

                                <span class="text-sm text-cbre_primary_4">
                                        {{ file.name }}
                                </span>
                                <span class="ml-[0.3em] cursor-pointer text-lg z-100" @click="deleteFile(name, file.uuid, file.name)">&times;</span>

                        </div>
                </template>

        </div>
        <!-- <button type="submit">Upload</button> -->
        </form>
</template>

<script setup lang="ts">
//@ts-ignore
import { v4 as uuidv4 } from 'uuid';
const { name, num, multiple, type, composed } = defineProps({
        name: {
                required: true,
                type: String,
        },
        num: {
                required: false,
                type: Number,
                default: 0,
        },
        multiple: {
                required: false,
                type: Boolean,
                default: false
        },
        type: {
                required: false,
                type: String,
                default: 'image'
        },
        composed: {
                required: false,
                type: Boolean,
                default: false
        },

})

interface FileProps {
        name: string,
        uuid: any,
        url:any,
        obj : object
}
const images = ref([] as FileProps[])
const docFiles = ref([] as FileProps[])
const isDragging = ref(false)
const fileInput = ref()
const selectFiles = () => {
        //console.log('selectFiles')
        fileInput.value.click()
}


const emit = defineEmits(["transfer","delete"]);


const onFileSelect = (event: any) => {
        //console.log('onFileSelect')
        event.preventDefault();
        const files = event.target.files;

        
        // console.log(files)
        if (files && files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
                //console.log(files[i])

                switch (type) {
                        case 'file':
                                // if (files[i].type.split("/")[0] != "image") continue;
                                //console.log('file');
                                //console.log(docFiles.value)
                                

                                if (!docFiles.value.some((el) => el.name === files[i].name)) {
                                        //reset
                                        docFiles.value = [] as FileProps[]
                                        docFiles.value.push({
                                                name: files[i].name,
                                                url: URL.createObjectURL(files[i]),
                                                uuid : uuidv4(),
                                                obj:files[i]
                                        })
                                }
                                break;

                        default:
                                if (files[i].type.split("/")[0] != "image") continue;
                                if (!images.value.some((el) => el.name === files[i].name)) {
                                        images.value.push({
                                                name: files[i].name,
                                                url: URL.createObjectURL(files[i]),
                                                uuid : uuidv4(),
                                                obj:files[i]
                                        })
                                }
                }

        }

        switch (type) {
                case 'file':
                onEmitTransfer(name, num, docFiles.value)
                        break;

                default:
                onEmitTransfer(name, num, images.value)
        }

}

const deleteImage = (name: string, uuid : string, fileName:string) => {
        
        if( uuid ) {
                onEmitDelete(name, uuid, fileName) 
                images.value = images.value.filter((el) => el.uuid !== uuid )
        }
}
 
     

const deleteFile = (name:string, uuid : string, fileName:string) => {
        
        //clear list
        docFiles.value = []

        //clear input 
        fileInput.value.value = []
        if( uuid ) {
                onEmitDelete(name, uuid, fileName) 
        }
}

const onDragOver = (event: any) => {
        event.preventDefault();
        isDragging.value = true
        event.dataTransfer.dropEffect = "copy"
}

const onDragLeave = (event: any) => {
        event.preventDefault();
        isDragging.value = false
}

const onDrop = (event: any) => {
        event.preventDefault();
        isDragging.value = false
        const files = event.dataTransfer.files

        for (let i = 0; i < files.length; i++) {

                switch (type) {
                        case 'file':
                                docFiles.value = [] as FileProps[]
                                docFiles.value.push({
                                        name: files[i].name,
                                        url: URL.createObjectURL(files[i]),
                                        uuid : uuidv4(),
                                        obj: files[i]
                                })
                                break;

                        default:
                                if (files[i].type.split("/")[0] != "image") continue;
                                if (!images.value.some((el) => el.name === files[i].name)) {
                                        images.value.push({
                                                name: files[i].name,
                                                url: URL.createObjectURL(files[i]),
                                                uuid : uuidv4(),
                                                obj:files[i]
                                        })
                                }
                }

        }

        switch (type) {
                case 'file':
                onEmitTransfer(name, num, docFiles.value)
                        break;

                default:
                onEmitTransfer(name, num, images.value)
        }

}

const onEmitTransfer = (name: string, num: number, data: any) => {
        emit('transfer', { name: name, num: num, data: data });
}

const onEmitDelete = (name: string, uuid : string, fileName : string) => {
        emit('delete', { name : name, uuid : uuid, fileName : fileName});
}


</script>

<style scoped></style>