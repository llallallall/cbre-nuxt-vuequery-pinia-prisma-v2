<template>
  <div class="space-y-6 mp-10">
    <form class="space-y-6">
        <div class="flex justify-between items-end mb-4">
            <h2 class="text-xl font-bold text-gray-700">{{ title  }}</h2>

            <div class="flex justify-start">
                <input
                type="file"
                ref="fileInput"
                @change="handleFileUpload"
                class="hidden"
                multiple
                accept="image/*,application/pdf"
                />
                <button
                type="button"
                @click="fileInput?.click()"
                class="outline-none bg-cbre_primary_2 hover:bg-cbre_primary_1 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150"
                >
                + Add File
                </button>
            </div>
         </div>

      <div
        v-if="formData && formData.length > 0"
        class="grid md:grid-cols-3 grid-cols-1 gap-4"
      >
        <div
          v-for="(file, index) in formData"
          :key="file.fileUuid ?? index"
          class="relative border border-gray-300 rounded-lg p-2 flex flex-col items-center"
        >
          <div class="w-full h-32 mb-2 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
            <img
              v-if="isImage(file) && file.fileUrl"
              :src="file.fileUrl"
              class="object-contain w-full h-full"
              :alt="file.fileName || ''"
            />
            <div v-else class="text-gray-500 text-center p-4">
                <Icon name="i-heroicons-document" class="w-8 h-8 mx-auto mb-1" />
                <p class="text-xs truncate max-w-[100px]">{{ file.fileName }}</p>
                <p class="text-xs text-red-500" v-if="file.tempFile">Uploading...</p>
            </div>
          </div>
          
          <div class="text-sm text-gray-600 truncate w-full text-center">{{ file.fileName }}</div>

          <button
            type="button"
            @click="removeFile(file, index)"
            class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition duration-150"
          >
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>
      </div>

      
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'; // 💡 watch import 추가
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app'; // 로딩 상태 관리를 위해 추가
import { useMinio } from '@/composables/useMinio'; // useMinio composable 경로 확인 필요
import { createToast } from 'mosha-vue-toastify';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성 유틸리티 가정
import type { FloorPlanPhotoType } from '~/types/asset.type'; // 타입 경로 확인 필요
import { useModal } from 'vue-final-modal';
import { useConfirmModal } from '~/composables/useConfirmModal';

// Pinia Store 및 Composable 초기화
const propertyStore = usePropertyStore();
const appStore = useAppStore();
const { uploadFile, deleteFile } = useMinio();
const { show: openConfirmModal } = useConfirmModal();

// v-model 구현을 위한 emit 정의
const emit = defineEmits<{
    (e: 'update:files', files: FloorPlanPhotoType[]): void;
    (e: 'close'): void; 
}>();

const props = defineProps<{
    title: string;
    type: 'LOGITUDINALSECTION' | 'CROSSSECTION' | 'UPPERSECTION' |  'BASEMENTSECTION';
    files : FloorPlanPhotoType[] // 💡 v-model:files를 위한 prop 복구
    // NOTE: Floor Plan 타입이 아닌 경우 floorList prop이 필요할 수 있으나, 현재 로직에서는 사용되지 않으므로 제거
}>();

// --------------------------------------------------------------------------------
// Data and State
// --------------------------------------------------------------------------------
const fileInput = ref<HTMLInputElement | null>(null);
const propertyId = computed(() => propertyStore.propertyId);

// v-model:files prop을 위한 로컬 상태
// tempFile 속성을 사용하기 위해 any 캐스팅을 사용합니다.
const formData = ref<(FloorPlanPhotoType & { tempFile?: File | null })[]>([]);

// props.files가 변경될 때 local formData를 동기화
watch(() => props.files, (newFiles) => {
    // 깊은 복사본을 생성하여 로컬에서 안전하게 변경 가능하도록 함
    if (newFiles) {
        // tempFile이 있을 수 있으므로 타입 선언을 확장합니다.
        formData.value = JSON.parse(JSON.stringify(newFiles));
    } else {
        formData.value = [];
    }
}, { immediate: true });


// 파일 업로드 핸들러
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0 || !propertyId.value) {
    createToast({ title: 'The file is missing or the asset ID is absent.' }, { type: 'danger' });
    return;
  }
  // 전체 로딩 상태는 파일 서버 통신(MinIO)이 끝난 후 한 번만 해제
  appStore.setLoading(true);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileUuid = uuidv4();
    
    // 1. 임시 데이터 추가 (로딩 상태 표시용)
  const tempPhoto: FloorPlanPhotoType & { tempFile: File | null } = {
        propertyId: propertyId.value,
        type: props.type as any, // enum 이름을 그대로 사용
        floor: null,
        fileUuid: fileUuid,
        fileName: file.name,
        fileKey: null,
        fileUrl: null,
        fileContentType: file.type,
        isNew: true,
        tempFile: file,
    };
    formData.value.push(tempPhoto);

    try {
        // 2. MinIO 서버에 파일 업로드
        const uploadResult = await uploadFile(file, propertyId.value);

        if (uploadResult) {
            // 3. 업로드 성공 후 데이터 업데이트
            const uploadedFileIndex = formData.value.findIndex( (p : any) => p.fileUuid === fileUuid);
            if (uploadedFileIndex !== -1) {
                formData.value[uploadedFileIndex].fileKey = uploadResult.fileKey;
                formData.value[uploadedFileIndex].fileUrl = uploadResult.fileUrl;
                formData.value[uploadedFileIndex].tempFile = null; // 임시 파일 제거
            }
            createToast({ title: `${file.name}, Upload successful.` }, { type: 'success' });
        } else {
            // 업로드 실패 시 목록에서 제거
            formData.value = formData.value.filter((p : any) => p.fileUuid !== fileUuid);
            createToast({ title: `${file.name}, Upload failed.` }, { type: 'danger' });
        }

    } catch (e) {
        console.error('File Upload Error:', e);
        formData.value = formData.value.filter((p : any) => p.fileUuid !== fileUuid);
        createToast({ title: `${file.name}, Exception occurred during upload` }, { type: 'danger' });
    }
  }

  // 데이터 변경 사항을 부모 컴포넌트에 알림
  emit('update:files', formData.value as FloorPlanPhotoType[]);

  // 파일 입력 초기화
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  appStore.setLoading(false);
};

// 파일 삭제 핸들러
const removeFile = async (fileToRemove: FloorPlanPhotoType, index: number) => {
    if (!fileToRemove.fileKey && !fileToRemove.isNew) {
        console.warn('파일 키가 없어 서버에서 삭제는 불가하며, 목록에서만 제거했습니다.', fileToRemove);
        formData.value.splice(index, 1);
        // 목록에서 제거 후 부모에게 알림
        emit('update:files', formData.value as FloorPlanPhotoType[]);
        createToast({ title: 'File Key is missing for an existing file. Removing from list only.' }, { type: 'warning' });
        return;
    }

    // MinIO에 이미 업로드된 파일인 경우에만 MinIO에서 삭제 시도
    if (fileToRemove.fileKey) {
        const confirmResult = await openConfirmModal({
            title: 'Delete Photo(s)',
            message: `'${fileToRemove.fileName}', Confirm File Deletion?`,
            confirmText: 'Delete'
        });
        if (!confirmResult) return;

        appStore.setLoading(true);
        try {
            const deleteResult = await deleteFile(fileToRemove.fileKey);

            if ((deleteResult as any).status === 'success' || deleteResult === null) { // MinIO 삭제 응답 처리에 따라 수정
                // MinIO 삭제 성공 시, 목록에서 제거
                formData.value.splice(index, 1);
                // 파일 제거 후 부모에게 알림
                emit('update:files', formData.value as FloorPlanPhotoType[]);
                createToast({ title: `'${fileToRemove.fileName}', The file was successfully deleted` }, { type: 'success' });
              } else {
                // MinIO 삭제 실패 시, 사용자에게 알림
                createToast({ title: `File deletion failed : ${(deleteResult as any).result}` }, { type: 'danger' });
        }
        } catch (e) {
          console.error('File Deletion Error:', e);
          createToast({ title: 'An exception occurred while deleting the file.' }, { type: 'danger' });
        } finally {
                appStore.setLoading(false);
        }
    } else {
        // MinIO에 업로드 되기 전 (tempFile만 있는 경우) 목록에서 바로 제거
        formData.value.splice(index, 1);
        // 💡 목록에서 제거 후 부모에게 알림
       emit('update:files', formData.value as FloorPlanPhotoType[]);
       createToast({ title: `'${fileToRemove.fileName}', The file has been removed from the list.` }, { type: 'info' });
    }
};


// 유틸리티 함수
const isImage = (file: FloorPlanPhotoType) => {
  return file.fileContentType && file.fileContentType.startsWith('image/');
};


</script>