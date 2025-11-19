<template>
        <div class="flex">
                <div class="absolute top-0 right-0">
                        <button class="bg-rose-400 text-white px-[0.5em] py-[0.2em] mr-10 mt-2 rounded-lg shadow-lg text-sm"
                                @click="() => { debug = !debug }">Preview</button>
                </div>
                <div class="bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none ]" :class="{
                        'w-3/4': debug && shrinkPreview && !growPreview,
                        'w-2/4': debug && !shrinkPreview && !growPreview,
                        'w-1/4': debug && !shrinkPreview && growPreview,
                        'w-full': !debug,
                }">

                        <div class="relative 
                        px-[2.5em] pt-[7.5em] pb-[2.5em] 
                        backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                        border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] 
                        flex flex-col gap-10">

                                <div class="absolute top-0 left-[50%] -translate-x-[50%] 
                                        px-[1.5em] py-[1.0em] md:py-[0.5em] 
                                        text-center text-cbre_primary_3 text-[1.5em] 
                                        rounded-[0_0_20px_20px] 
                                        bg-[rgba(230,234,234,1)]
                                        before:content-[''] before:absolute before:top-0 before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:bg-transparent  before:shadow-[15px_0_0_0_rgba(230,234,234,1)]
                                        after:content-[''] after:absolute after:top-0 after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:bg-transparent  after:shadow-[-15px_0_0_0_rgba(230,234,234,1)]
                                        ">
                                        Upload Images
                                </div>

                                <div class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] ">
                                        <label class="absolute -top-[1em] left-[1em]
                                                text-cbre_primary_3/60 text-xs 
                                                border border-[rgba(255,255,255,0.4)] rounded-[5px] 
                                                px-[0.7em] py-[0.2em] 
                                                bg-[rgba(230,234,234,1)]
                                                shadow-sm
                                                backdrop-blur-3xl
                                                ">
                                                Photos
                                        </label>
                                        <AssetRegisterFileUploader name="photos" multiple composed @transfer="storeFileData"  @delete="deleteFileData"  />
                                </div>

                                <!-- <div class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] ">
                                        <label class="absolute -top-[1em] left-[1em]
                                                text-cbre_primary_3/60 text-xs 
                                                border border-[rgba(255,255,255,0.4)] rounded-[5px] 
                                                px-[0.7em] py-[0.2em] 
                                                bg-[rgba(230,234,234,1)]
                                                shadow-sm
                                                backdrop-blur-3xl
                                                ">
                                                Brochure
                                        </label>
                                        <AssetRegisterFileUploader name="brochure" type="file" composed
                                                @transfer="storeFileData" />
                                </div> -->

                                <div class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] ">
                                        <label class="absolute -top-[1em] left-[1em]
                                                text-cbre_primary_3/60 text-xs 
                                                border border-[rgba(255,255,255,0.4)] rounded-[5px] 
                                                px-[0.7em] py-[0.2em] 
                                                bg-[rgba(230,234,234,0.6)]
                                                shadow-sm
                                                backdrop-blur-3xl
                                                ">
                                                Floor Plan
                                        </label>
                                        <div class="grid grid-cols-2 gap-5">

                                                <div
                                                        class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] my-[1em]">
                                                        <label class="absolute -top-[1em] left-[1em]
                                                text-cbre_primary_3/60 text-xs 
                                                border border-[rgba(255,255,255,0.4)] rounded-[5px] 
                                                px-[0.7em] py-[0.2em] 
                                                bg-[rgba(230,234,234,1)]
                                                shadow-sm
                                                backdrop-blur-3xl
                                                ">
                                                                Logitudinal Section
                                                        </label>
                                                        <AssetRegisterFileUploader name="floor_plan_logitudinal" composed
                                                                @transfer="storeFileData"  @delete="deleteFileData" />
                                                </div>
                                                <div
                                                        class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] my-[1em]">
                                                        <label class="absolute -top-[1em] left-[1em]
                                                text-cbre_primary_3/60 text-xs 
                                                border border-[rgba(255,255,255,0.4)] rounded-[5px] 
                                                px-[0.7em] py-[0.2em] 
                                                bg-[rgba(230,234,234,1)]
                                                shadow-sm
                                                backdrop-blur-3xl
                                                ">
                                                                Cross Section
                                                        </label>
                                                        <AssetRegisterFileUploader name="floor_plan_cross" composed
                                                                @transfer="storeFileData"  @delete="deleteFileData" />
                                                </div>
                                        </div>
                                        <div
                                                class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] my-[1em]">
                                                <label class="absolute -top-[1em] left-[1em]
                                                text-cbre_primary_3/60 text-xs 
                                                border border-[rgba(255,255,255,0.4)] rounded-[5px] 
                                                px-[0.7em] py-[0.2em] 
                                                bg-[rgba(230,234,234,0.6)]
                                                shadow-sm
                                                backdrop-blur-3xl
                                                ">
                                                        Each Floor
                                                </label>
                                                <div class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] my-[1em]
                                                         grid grid-cols-1 md:grid-cols-3 lg:grid-flow-row lg:auto-rows-max 	 gap-5
                                                        ">
                                                        <label class="absolute -top-[1em] left-[1em]
                                                text-cbre_primary_3/60 text-xs 
                                                border border-[rgba(255,255,255,0.4)] rounded-[5px] 
                                                px-[0.7em] py-[0.2em] 
                                                bg-[rgba(230,234,234,0.6)]
                                                shadow-sm
                                                backdrop-blur-3xl
                                                ">
                                                                Upper Levels
                                                        </label>
                                                        <div v-for="n in Number(sizes.upperLevels)"
                                                                :key="`upper_floor_photo_${n}`">

                                                                <div
                                                                        class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] my-[1em]">
                                                                        <label class="absolute -top-[1em] left-[1em]
                                                                                text-cbre_primary_3/60 text-xs 
                                                                                border border-[rgba(255,255,255,0.4)] rounded-[5px] 
                                                                                px-[0.7em] py-[0.2em] 
                                                                                bg-[rgba(230,234,234,1)]
                                                                                shadow-sm
                                                                                backdrop-blur-3xl
                                                                                ">
                                                                                # {{ n }} floor
                                                                        </label>
                                                                        <AssetRegisterFileUploader name="upper_levels" :num="n"
                                                                                composed @transfer="storeFileData"  @delete="deleteFileData" />
                                                                </div>
                                                        </div>
                                                </div>

                                                <div class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] my-[1em]
                                                        grid grid-cols-1 md:grid-cols-3 lg:grid-flow-row lg:auto-rows-max gap-5
                                                        ">
                                                        <label class="absolute -top-[1em] left-[1em]
                                                                        text-cbre_primary_3/60 text-xs 
                                                                        border border-[rgba(255,255,255,0.4)] rounded-[5px] 
                                                                        px-[0.7em] py-[0.2em] 
                                                                        bg-[rgba(230,234,234,0.6)]
                                                                        shadow-sm
                                                                        backdrop-blur-3xl
                                                                        ">
                                                                Basement Levels
                                                        </label>
                                                        <div v-for="n in Number(sizes.basementLevels)"
                                                                :key="`upper_floor_photo_${n}`">

                                                                <div
                                                                        class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] my-[1em]">
                                                                        <label class="absolute -top-[1em] left-[1em]
                                                                                text-cbre_primary_3/60 text-xs 
                                                                                border border-[rgba(255,255,255,0.4)] rounded-[5px] 
                                                                                px-[0.7em] py-[0.2em] 
                                                                                bg-[rgba(230,234,234,1)]
                                                                                shadow-sm
                                                                                backdrop-blur-3xl
                                                                                ">
                                                                                # {{ n }} floor
                                                                        </label>
                                                                        <AssetRegisterFileUploader name="basement_levels"
                                                                                :num="n" composed @transfer="storeFileData" @imageDelete="deleteFileData" />
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>

                                <div class="grid grid-cols-2 gap-3">
                                        <button v-if="tabIndex > 0"
                                                class="w-full h-[5vh]  rounded-[10px] bg-cbre_primary_3/60 text-cbre_primary_5/50"
                                                type="button" @click.prevent="handleGoBack">Prev</button>
                                        <button class="w-full h-[5vh]  rounded-[10px] 
                                                        hover:bg-cbre_primary_2 hover:text-white bg-cbre_primary_1/60 text-cbre_primary_5/50"
                                                         type="button" @click.prevent="()=>handleSubmit()">Next</button>

                                        
                                </div>
                        </div>
                </div>
                <div class="relative flex-1 pl-[2.5em]" :class="debug ? 'flex w-1/2' : 'hidden'">
                        <AssetRegisterPreview />

                </div>

        </div>
</template>

<script setup lang="ts">
import { createToast } from 'mosha-vue-toastify';
import { usePropertyStore  } from '~/stores/property';
import { AssetPhotoType, FloorPlanPhotoType, FileType } from '~/types/asset.type'
const { debug, shrinkPreview, growPreview, sizes, photoList, floorPlanPhotoList } = storeToRefs(usePropertyStore());
const { tabIndex } = defineProps({
        tabIndex: {
                required: true,
                type: Number
        }
})
const emit = defineEmits(["next"]);
const isLoading = ref(false)
interface FileProps {
        name: string,
        uuid: any,
        url:any,
        obj : object
}


const currentFileList = ref([] as FileProps[]) 

const currentFloorPlanLogitudinalFileList = ref([] as FileProps[]) 
const currentFloorPlanCrossFileList = ref([] as FileProps[]) 

//each floor
const currentUpperLevelsFileList = ref([] as FileProps[]) 
const currentBasementLevelsFileList = ref([] as FileProps[]) 

const storeFileData = async (response: any) => {

        if (response.data.length > 0) {

                switch (response.name) {
                        case 'floor_plan_logitudinal':
                        
                                for (let i = 0; i < response.data.length; i++) {
                                                let fileData = response.data[i] 

                                                let uploadResult = await handleFileUpload('photo', fileData);
                                
                                                if(uploadResult) {

                                                        let floorPlanPhoto = new Object() as FloorPlanPhotoType
                                                        floorPlanPhoto.type = 'LOGITUDINALSECTION'.toUpperCase();
                                                        floorPlanPhoto.floor = i;
                                                        floorPlanPhoto.fileUuid = fileData.uuid;
                                                        floorPlanPhoto.fileContentType = fileData.obj.type;
                                                        floorPlanPhoto.fileName = fileData.name;
                                                        floorPlanPhoto.fileKey = uploadResult.fileKey;
                                                        floorPlanPhoto.fileUrl = uploadResult.fileUrl;
                                                        
                                                        //console.log(photo)
                                                        floorPlanPhotoList.value.logitudinal.push(floorPlanPhoto)

                                                        createToast({
                                                                        title: 'Image uploaded successful.',
                                                                        description: 'If you want to delete image click X mark'
                                                                        }, {
                                                                                type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                                                                                timeout: 5000,
                                                                                showCloseButton: true,
                                                                                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                                                                transition: 'bounce',
                                                                                hideProgressBar: false,
                                                                                swipeClose: true,
                                                                        })
                                                                        
                                                } 
                                        }

                                break;
                        case 'floor_plan_cross':
                        for (let i = 0; i < response.data.length; i++) {
                                                let fileData = response.data[i] 

                                                let uploadResult = await handleFileUpload('photo', fileData);
                                
                                                if(uploadResult) {

                                                        let floorPlanPhoto = new Object() as FloorPlanPhotoType
                                                        floorPlanPhoto.type = 'CROSSSECTION'.toUpperCase();
                                                        floorPlanPhoto.floor = i;
                                                        floorPlanPhoto.fileUuid = fileData.uuid;
                                                        floorPlanPhoto.fileContentType = fileData.obj.type;
                                                        floorPlanPhoto.fileName = fileData.name;
                                                        floorPlanPhoto.fileKey = uploadResult.fileKey;
                                                        floorPlanPhoto.fileUrl = uploadResult.fileUrl;
                                                        
                                                        //console.log(photo)
                                                        floorPlanPhotoList.value.cross.push(floorPlanPhoto)

                                                        createToast({
                                                                        title: 'Image uploaded successful.',
                                                                        description: 'If you want to delete image click X mark'
                                                                        }, {
                                                                                type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                                                                                timeout: 5000,
                                                                                showCloseButton: true,
                                                                                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                                                                transition: 'bounce',
                                                                                hideProgressBar: false,
                                                                                swipeClose: true,
                                                                        })
                                                                        
                                                } 
                                        }
                                break;
                       
                               
                        
                                       
                        case 'upper_levels':

                                let upper_levels_index = response.num ?? 0 
                                let upper_levels_files = response.data

                                console.log(response)

                                for (let i = 0; i < upper_levels_files.length; i++) {
                                                let fileData = upper_levels_files[i] 

                                                let uploadResult = await handleFileUpload('photo', fileData);
                                
                                                if(uploadResult) {
                                                        
                                                        let floorPlanPhoto = new Object() as FloorPlanPhotoType
                                                        floorPlanPhoto.type = 'upper'.toUpperCase();
                                                        floorPlanPhoto.floor = upper_levels_index+i;
                                                        floorPlanPhoto.fileUuid = fileData.uuid;
                                                        floorPlanPhoto.fileContentType = fileData.obj.type;
                                                        floorPlanPhoto.fileName = fileData.name;
                                                        floorPlanPhoto.fileKey = uploadResult.fileKey;
                                                        floorPlanPhoto.fileUrl = uploadResult.fileUrl;
                                                        
                                                        //console.log(photo)
                                                        floorPlanPhotoList.value.eachFloor.uppers.push(floorPlanPhoto)

                                                                createToast({
                                                                                title: 'Image uploaded successful.',
                                                                                description: 'If you want to delete image click X mark'
                                                                                }, {
                                                                                        type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                                                                                        timeout: 5000,
                                                                                        showCloseButton: true,
                                                                                        position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                                                                        transition: 'bounce',
                                                                                        hideProgressBar: false,
                                                                                        swipeClose: true,
                                                                                })
                                                } 
                                        }
                                break;
                                 
                        case 'basement_levels':
                                let basement_levels_index = response.num ?? 0 
                                let basement_levels_files = response.data

                                for (let i = 0; i < basement_levels_files.length; i++) {
                                        let fileData = basement_levels_files[i] 

                                        let uploadResult = await handleFileUpload('photo', fileData);
                                
                                        if(uploadResult) {
                                                
                                                let floorPlanPhoto = new Object() as FloorPlanPhotoType
                                                floorPlanPhoto.type = 'basement'.toUpperCase();
                                                floorPlanPhoto.floor = basement_levels_index+i;
                                                floorPlanPhoto.fileUuid = fileData.uuid;
                                                floorPlanPhoto.fileContentType = fileData.obj.type;
                                                floorPlanPhoto.fileName = fileData.name;
                                                floorPlanPhoto.fileKey = uploadResult.fileKey;
                                                floorPlanPhoto.fileUrl = uploadResult.fileUrl;
                                                
                                                //console.log(photo)
                                                floorPlanPhotoList.value.eachFloor.basements.push(floorPlanPhoto)

                                                        createToast({
                                                                        title: 'Image uploaded successful.',
                                                                        description: 'If you want to delete image click X mark'
                                                                        }, {
                                                                                type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                                                                                timeout: 5000,
                                                                                showCloseButton: true,
                                                                                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                                                                transition: 'bounce',
                                                                                hideProgressBar: false,
                                                                                swipeClose: true,
                                                                        })

                                                }
                                        } 
                                break;

                        default:  //photos

                        for (let i = 0; i < response.data.length; i++) {
                                let fileData = response.data[i] 
                                console.log('switch photo')
                                console.log(response.data[i])
                                let uploadResult = await handleFileUpload('photo', fileData);
                                        
                                if(uploadResult) {
                                        let photo = new Object() as AssetPhotoType
                                        photo.fileUuid = fileData.uuid;
                                        photo.fileContentType = fileData.obj.type;
                                        photo.fileName = fileData.name;
                                        photo.fileKey = uploadResult.fileKey;
                                        photo.fileUrl = uploadResult.fileUrl;
                                                
                                        //console.log(photo)
                                        photoList.value.push(photo)

                                        createToast({
                                                        title: 'Image uploaded successful.',
                                                        description: 'If you want to delete image click X mark'
                                                        }, {
                                                                type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                                                                timeout: 5000,
                                                                showCloseButton: true,
                                                                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                                                transition: 'bounce',
                                                                hideProgressBar: false,
                                                                swipeClose: true,
                                        })
                                }
                                
                        }
                 }
        }


}

const handleFileUpload = async (formDataType:string, fileData:any) => {
        
        if(!currentFileList.value.find((el) => el.name === fileData.name)) {
                console.log('new file')
                currentFileList.value.push(fileData)

                // 폼데이터 객체 생성
                const formData = new FormData();
                console.log(fileData)
                //let blob = fileData.obj.slice(0, fileData.obj.size, fileData.obj.type); 

                //원본이미지 확장자    
                let strArry = fileData.obj.type?.toString().split('/') as []
                let originExt = (strArry.pop()+'' as string).toLowerCase()

                //현재 시간을 기반으로 고유한 파일 키 생성
                let today = new Date();
                let date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,'0')+'-'+today.getDate().toString().padStart(2,'0');
                let time = today.getHours().toString().padStart(2,'0') + "" + today.getMinutes().toString().padStart(2,'0') + "" + today.getSeconds().toString().padStart(2,'0');
                let dateTime = date+'_'+time;

                let key = `${dateTime}_${fileData.uuid}.${originExt}`;

                //let newFile = new File([blob], key, {type: fileData.obj.type});
                
                // file 추가
        //         let fileName:string
        // let fileSize:number
        // let fileBuffer:Buffer
                formData.append('fileName', fileData.name);
                formData.append('fileSize', fileData.obj.size);
                formData.append('fileObj', fileData.obj);
                formData.append('fileKey', key);
                //formData.append('url', fileData.url);
                // 이미지 리사이즈

                // 원본이미지 localstorage 업로드
                // let originFileUrl = '';
                // try {
                //         await useFetch('/api/upload/localImage', {
                //         method: 'POST',
                //         body : formData,
                //         onResponse(context) {
                //                         originFileUrl = context.response._data;
                //                 },
                //         });
                //         return {fileKey : key, fileUrl : originFileUrl};
                // } catch (error) {
                //         console.log(error);
                // }

                // minio signedUrl 업로드
                let uploadUrl = '';
                let fileKey = '';
                console.log('fetch minioFileUploader')
                try {
                        const { data, pending, error, status } = await useFetch('/api/upload/minioFileUploader', {
                                method: 'POST',
                                body : formData,
                        // query: {
                        //                 fileUuid: fileData.uuid,
                        //                 fileName: fileData.name,
                        //                 fileType: fileData.obj.type,
                        //                 fileUrl: fileData.url,
                        //         },
                        // onResponse({ request, response, options }) {
                        //         console.log(response)
                        //         let resullt = JSON.parse(response.body+''.toString())
                        //         console.log(resullt)
                        //         //console.log(options)
                        //                 originFileUrl = '';
                        //         },
                        });

                        // console.log(originFileUrl)
                        if(data.value) {

                                let result = JSON.parse(JSON.stringify(data.value))
                                uploadUrl = result.uploadUrl
                                fileKey = result.fileKey
                        }
                        
                        return {fileKey : key, fileUrl : uploadUrl};
                } catch (error) {
                        console.log(error);
                }
        }

}

const deleteFileData = async (response: any) => {

        //console.log(response)
        let fileKey

        switch (response.name) {
                        case 'floor_plan_logitudinal':
                                if(response.uuid) {
                                        fileKey = floorPlanPhotoList.value.logitudinal.find((el : any) => el.fileUuid == response.uuid)?.fileKey
                                }
                                break;
                        case 'floor_plan_cross':
                                if(response.uuid) {
                                        fileKey = floorPlanPhotoList.value.cross.find((el : any) => el.fileUuid == response.uuid)?.fileKey
                                }
                                break;
                                       
                        case 'upper_levels':
                                if(response.uuid) {
                                        fileKey = floorPlanPhotoList.value.eachFloor.uppers.find((el : any) => el.fileUuid == response.uuid)?.fileKey
                                }
                                break;
                                 
                        case 'basement_levels':
                                if(response.uuid) {
                                        fileKey = floorPlanPhotoList.value.eachFloor.basements.find((el : any) => el.fileUuid == response.uuid)?.fileKey
                                }
                                break;

                        default:  //photos

                                if(response.uuid) {
                                        fileKey = photoList.value.find((el : any) => el.fileUuid == response.uuid)?.fileKey
                                }
                 }
       

        try {
                const result = await useFetch('/api/upload/minioFileUploader' , {
                        method: 'DELETE',
                        query : {
                                key: fileKey
                        },
                        headers: {
                                'Content-Type': 'application/json',
                        },
                })

                if (result.status.value === "success") {

                // 2) delete file on file list 
                

                switch (response.name) {
                        case 'floor_plan_logitudinal':

                                if(response.uuid) {
                                        let index = floorPlanPhotoList.value.logitudinal.findIndex((el:any) => el.fileUuid == response.uuid)
                                        if( index > -1) {
                                                floorPlanPhotoList.value.logitudinal = floorPlanPhotoList.value.logitudinal.filter((el:any) => el.fileUuid !== response.uuid)
                                                currentFileList.value = currentFileList.value.filter((el : any) => el.fileUuid !== response.uuid)
                                        }
                                }
                                break;

                        case 'floor_plan_cross':
               

                                if(response.uuid) {
                                        let index = floorPlanPhotoList.value.cross.findIndex((el:any) => el.fileUuid == response.uuid)
                                        if( index > -1) {
                                                floorPlanPhotoList.value.cross = floorPlanPhotoList.value.cross.filter((el:any) => el.fileUuid !== response.uuid)
                                                currentFileList.value = currentFileList.value.filter((el : any) => el.fileUuid !== response.uuid)
                                        }
                                }
                                break;
                       
                               
                        
                                       
                        case 'upper_levels':
           
                                if(response.uuid) {
                                        let index = floorPlanPhotoList.value.eachFloor.uppers.findIndex((el:any) => el.fileUuid == response.uuid)
                                        if( index > -1) {
                                                floorPlanPhotoList.value.eachFloor.uppers = floorPlanPhotoList.value.eachFloor.uppers.filter((el:any) => el.fileUuid !== response.uuid)
                                                currentFileList.value = currentFileList.value.filter((el : any) => el.fileUuid !== response.uuid)
                                        }
                                }
                                break;
                                 
                        case 'basement_levels':
                  
                                if(response.uuid) {
                                        let index = floorPlanPhotoList.value.eachFloor.basements.findIndex((el:any) => el.fileUuid == response.uuid)
                                        if( index > -1) {
                                                floorPlanPhotoList.value.eachFloor.basements = floorPlanPhotoList.value.eachFloor.basements.filter((el:any) => el.fileUuid !== response.uuid)
                                                currentFileList.value = currentFileList.value.filter((el : any) => el.fileUuid !== response.uuid)
                                        }
                                }
                                break;

                        default:  //photos

                                if(response.uuid) {
                                        let index = photoList.value.findIndex((el:any) => el.fileUuid == response.uuid)
                                        if( index > -1) {
                                                photoList.value = photoList.value.filter((el:any) => el.fileUuid !== response.uuid)
                                                currentFileList.value = currentFileList.value.filter((el : any) => el.fileUuid !== response.uuid)
                                        }
                                }

                      
                 }

                // 3 ) delete file info from database
                // const deleteDatabase = await $fetch('/api/upload/deleteFile', {
                //                                 method: 'get',
                //                                 query: {
                //                                         propertyId : '3333',
                //                                         fileUuid: response.uuid,
                //                                 },
                //                         }) as any  // {uploadUrl:signedUrl, fileName:key}; 
                
                // 4) TOAST                                        
                 createToast({
                                title: 'Image deleted successful.',
                                //@ts-ignore
                                description: response.fileName
                                }, {
                                        type: 'info', // 'info', 'danger', 'warning', 'success', 'default'
                                        timeout: 5000,
                                        showCloseButton: true,
                                        position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                        transition: 'bounce',
                                        hideProgressBar: false,
                                        swipeClose: true,
                        })
                        

                }


        } catch (error: any) {
                console.log(error)
        }

}



const handleGoBack = () => {
        if (tabIndex - 1 > 0) {
                emit('next', tabIndex - 1);
        }
}

const handleSubmit = async () => {
        isLoading.value = true
        try {
                emit('next', tabIndex + 1);
        } catch (error: any) {
                console.log(error)

        } finally {
                isLoading.value = false

        }
}


</script>

<style scoped></style>