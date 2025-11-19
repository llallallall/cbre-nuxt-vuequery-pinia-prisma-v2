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
                                        Upload Brochure
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
                                                Brochure
                                        </label>
                                        <AssetRegisterFileUploader name="brochure" type="file" composed
                                                @transfer="storeFileData" @delete="deleteFileData"  />
                                </div>

                               <div v-if="currentFileList && currentFileList.length > 0">
                                        <ClientOnly>
                                                <vue-pdf-app theme="light" style="height: 50vh;" :pdf="currentPdfFilePath"></vue-pdf-app>
                                        </ClientOnly>

                               </div>

                                <div class="grid grid-cols-2 gap-3">
                                        <button v-if="tabIndex > 0"
                                                class="w-full h-[5vh]  rounded-[10px] bg-cbre_primary_3/60 text-cbre_primary_5/50"
                                                type="button" @click.prevent="handleGoBack">Prev</button>
                                        <button class="w-full h-[5vh]  rounded-[10px]
                                                        hover:bg-cbre_primary_2 hover:text-white bg-cbre_primary_1/60 text-cbre_primary_5/50
                                                        " type="button" @click.prevent="handleSubmit">Confirm</button>
                                </div>
                               
                        </div>
                </div>
                <div class="relative flex-1 pl-[2.5em]" :class="debug ? 'flex w-1/2' : 'hidden'">
                        <AssetRegisterPreview />

                </div>

        </div>
</template>

<script setup lang="ts">
import {  FileType } from '~/types/asset.type'
import VuePdfApp from "vue3-pdf-app";
// import this to use default icons for buttons
import "vue3-pdf-app/dist/icons/main.css";
import { createToast } from 'mosha-vue-toastify';
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app';
const { debug, shrinkPreview, growPreview, brochureList } = storeToRefs(usePropertyStore());

const propertyStore = usePropertyStore()
const app = useAppStore();
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
const currentPdfFilePath = ref('/sample/files/empty.pdf') 
const router = useRouter()

const storeFileData = async (response: any) => {

        if (response.data.length > 0) {

                // 1 ) upload to server
                let fileData = response.data[0]

                currentFileList.value = [] as FileProps[]
                currentFileList.value.push(fileData)

                // 폼데이터 객체 생성
                const formData = new FormData();
                //let blob = fileData.obj.slice(0, fileData.obj.size, fileData.obj.type); 

                // 원본이미지 확장자    
                let strArry = fileData.obj.type?.toString().split('/') as []
                let originExt = strArry.pop()+'' as string

                // 현재 시간을 기반으로 고유한 파일 키 생성
                let today = new Date();
                let date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,'0')+'-'+today.getDate().toString().padStart(2,'0');
                let time = today.getHours().toString().padStart(2,'0') + "" + today.getMinutes().toString().padStart(2,'0') + "" + today.getSeconds().toString().padStart(2,'0');
                let dateTime = date+'_'+time;

                let key = `${dateTime}_${fileData.uuid}.${originExt}`;

                //let newFile = new File([blob], key, {type: fileData.obj.type});
                
                // file 추가
                //formData.append('file', newFile);
                formData.append('url', fileData.url);
                
                // minio signedUrl 업로드
        let originFileUrl = '';
                // console.log('fetch minioFileUploader')
                try {
                        await useFetch('/api/upload/minioFileUploader', {
                        method: 'POST',
                        //body : formData,
                        query: {
                                        fileUuid: fileData.uuid,
                                        fileName: fileData.name,
                                        fileType: fileData.obj.type,
                                        fileUrl: fileData.url,
                                },
                        onResponse(context) {
                                        originFileUrl = context.response._data;
                                },
                        });

                        brochureList.value = []
                        brochureList.value.push(fileData)

                        // console.log(brochureList.value)
                        createToast({
                                title: 'File uploaded successful.',
                                        description: 'check file content in preview section'
                                        }, {
                                                type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                                                timeout: 5000,
                                                showCloseButton: true,
                                                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                                transition: 'bounce',
                                                hideProgressBar: false,
                                                swipeClose: true,
                        });

                        return {fileKey : key, fileUrl : originFileUrl};
                } catch (error) {
                        console.log(error);
                }

        }
}


const deleteFileData = async (response: any) => {

        let fileKey
        if(response.uuid) {
                fileKey = brochureList.value.find((el : any) => el.fileUuid == response.uuid)?.fileKey
        }
        //console.log(s3FileName)
        try {

                const result = await useFetch('/api/upload/localFile' , {
                        method: 'DELETE',
                        query : {
                                key: fileKey
                        },
                        headers: {
                                'Content-Type': 'application/json',
                        },
                })

                console.log('result', result)


                if (result.status.value === "success") {
                        
                // 2) delete file on file list 
                if(response.uuid) {
                        let index = brochureList.value.findIndex((el:any) => el.fileUuid == response.uuid)
                        if( index > -1) {
                                brochureList.value = brochureList.value.filter((el:any) => el.fileUuid !== response.uuid)
                                currentFileList.value = currentFileList.value.filter((el : any) => el.fileUuid !== response.uuid)
                                
                        }
                }

                if( brochureList.value.length > 0 ) {

                        let nextFile = brochureList.value[(brochureList.value.length-1)] && (brochureList.value[(brochureList.value.length-1)].fileUrl+'').length > 0 ? brochureList.value[(brochureList.value.length-1)].fileUrl : '/sample/files/empty.pdf'
                        currentPdfFilePath.value = nextFile+''
                         
                } else {
                        currentPdfFilePath.value = '/sample/files/empty.pdf' 
                }

                // console.log(currentPdfFilePath.value)
                
                // 4) TOAST                                        
                createToast({
                                title: 'File deleted successful.',
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
        app.setLoading(true);
        try {
                // insert to database 
                console.log('File.vue :: upload to database')
                // console.log(propertyStore.general)

                // 2 ) store file info to database
                const { data, error, status } = await useFetch('/api/upload/updateDatabase', {
                                        method: "POST",
                                        body: {
                                        values : propertyStore
                                        }
                }); 
                // console.log(status)
                // console.log(data)
                // window.location.href='/admin';
                if(status.value === 'success') {
                        window.location.href='/admin';
                        // router.push({ path: "/admin" })
                }

        } catch (error: any) {
                console.log(error)

        } finally {
                isLoading.value = false
                app.setLoading(false);
                //actions.resetForm();
        }
}


</script>

<style scoped></style>