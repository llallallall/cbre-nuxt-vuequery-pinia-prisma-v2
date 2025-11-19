<template>
  <div class="space-y-6">
    <form @submit.prevent="onSubmit" class="space-y-6">

      <div class="flex justify-start mb-6">
        <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden" multiple accept="image/*">
        <button type="button" @click="fileInput?.click()"
          class="outline-none bg-cbre_primary_2 hover:bg-cbre_primary_1 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
          + Add Photo
        </button>
      </div>

      <div v-if="formData.photoList && formData.photoList.length > 0" class="grid md:grid-cols-3 grid-cols-1 gap-4">

        <div v-for="(photo, index) in formData.photoList" :key="photo.fileUuid ?? index"
          class="relative border border-gray-300 rounded-lg p-2 flex flex-col items-center">

          <div class="w-full h-32 mb-2 overflow-hidden rounded-md bg-gray-100">
            <img v-if="photo.fileUrl" :src="photo.fileUrl" class="object-contain w-full h-full" alt="Asset Photo" />
            <div v-else class="text-gray-500 text-center pt-12">No Image</div>
          </div>

          <div class="flex justify-between w-full items-center">

            <label class="flex items-center space-x-2 text-sm text-gray-700">
              <input type="checkbox" :checked="photo.main ?? false" @change="setAsMain(index)"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
              <span class="text-xs">Set as Main</span>
            </label>

            <button type="button" @click="removePhoto(index, photo)"
              class="text-red-500 hover:text-red-700 transition duration-150" title="Delete Photo">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                </path>
              </svg>
            </button>
          </div>

        </div>
      </div>
      <div v-else class="text-center py-10 text-gray-500 ">
        No photos uploaded yet.
      </div>

      <div class="flex justify-end pt-4 border-t mt-8">
        <button type="button" @click="emit('close')" :disabled="computedIsLoading" class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
          Cancel
        </button>
        <button type="button" @click="resetForm()"
          class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4">
          Reset
        </button>

        <button type="submit" :disabled="computedIsLoading" class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white hover:text-primary font-bold py-2 px-4 rounded-[10px] transition duration-150 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
          <svg v-if="computedIsLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ computedIsLoading ? 'Saving...' : 'Save and Close' }}
        </button>
      </div>


    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app';
import type { CbreAsset, AssetPhotoType } from '~/types/asset.type';
import { createToast } from 'mosha-vue-toastify';
import { useConfirmModal } from '~/composables/useConfirmModal';
import { useMinio } from '~/composables/useMinio'; // useMinio.ts 파일 경로를 가정
const { show: openConfirmModal } = useConfirmModal();

// --------------------------------------------------------------------------------
// Store Initialization
// --------------------------------------------------------------------------------
const propertyStore = usePropertyStore();
const appStore = useAppStore();
// useMinio 컴포저블을 사용하여 파일 업로드/삭제 함수를 가져옵니다.
const { uploadFile, deleteFile } = useMinio();

// --------------------------------------------------------------------------------
// Data and State
// --------------------------------------------------------------------------------
const fileInput = ref<HTMLInputElement | null>(null);
const propertyId = computed(() => propertyStore.propertyId);
const computedIsLoading = computed(() => appStore.isLoading);
const initialPhotoListSnapshot = ref<AssetPhotoType[]>(
  propertyStore.photoList
    ? JSON.parse(JSON.stringify(propertyStore.photoList))
    : []
);

// Pinia 스토어의 photoList를 복사하여 폼 데이터로 사용 (로컬 수정용)
const formData = ref<{ photoList: AssetPhotoType[] }>({
  photoList: propertyStore.photoList ? [...propertyStore.photoList] : [],
});

// Pinia의 propertyId가 변경될 때마다 formData 업데이트 (수정됨)
watch(() => propertyStore.photoList, (newPhotoList) => {
  // 1. Pinia 상태가 변경되면 로컬 폼 데이터도 동기화합니다.
  formData.value.photoList = newPhotoList ? [...newPhotoList] : [];

  // 2. 🎯 [추가] 초기 상태 스냅샷도 새로 저장합니다.
  // 이는 외부 요인으로 Pinia 상태가 변경되어 폼을 다시 로드해야 할 때를 대비합니다.
  initialPhotoListSnapshot.value = newPhotoList
    ? JSON.parse(JSON.stringify(newPhotoList))
    : [];
}, { immediate: true });


// --------------------------------------------------------------------------------
// Form Logic
// --------------------------------------------------------------------------------
const resetForm = () => {

  // 1. 로컬 폼 데이터 (화면) 원복
  // formData를 초기 스냅샷의 깊은 복사본으로 설정하여 UI를 원상태로 되돌립니다.
  formData.value.photoList = initialPhotoListSnapshot.value
    ? JSON.parse(JSON.stringify(initialPhotoListSnapshot.value))
    : [];

  // 2. Pinia 스토어 원복
  // Pinia의 setProperty 액션을 사용하여 photoList만 초기 상태로 업데이트합니다.
  // 이 업데이트로 인해 위에서 정의한 watch가 다시 트리거될 수도 있지만,
  // 이미 같은 값(초기 스냅샷)으로 설정하고 있으므로 문제 없습니다.
  propertyStore.setProperty({ photoList: initialPhotoListSnapshot.value });

  createToast({
    title: 'Form restored to current asset data.',
    // description: 'If you want to delete image click X mark'
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


// --------------------------------------------------------------------------------
// File Upload Logic (MinIO 사용)
// --------------------------------------------------------------------------------
/**
 * @description 파일을 선택했을 때 호출되며, useMinio를 사용하여 MinIO에 파일을 업로드합니다.
 * @param event - 파일 입력 이벤트
 */
const handleFileUpload = async (event: Event) => {
  // console.log('파일 업로드 이벤트 처리 시작');
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (!files || files.length === 0 || !propertyId.value) {
    // console.log('선택된 파일이 없거나 Property ID가 없습니다.');
    createToast({ title: 'Error', description: 'Property ID is missing or no file selected.' }, { type: 'danger' });
    return;
  }

  const newPhotos: AssetPhotoType[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // useMinio의 uploadFile 함수를 사용하여 파일을 업로드합니다.
    // propertyId를 파일명/경로 생성에 사용할 UUID로 전달합니다.
    const uploadResult = await uploadFile(file, propertyId.value);

    if (uploadResult) {
      // console.log('파일 업로드 성공:', uploadResult);

      // AssetPhotoType 형식에 맞춰 로컬 폼 데이터에 추가할 객체 생성
      const newPhoto: AssetPhotoType = {
        id: undefined, // DB에 저장될 때 생성되므로 초기값은 undefined
        fileUuid: uploadResult.fileKey, // MinIO Key를 UUID로 사용
        fileName: file.name,
        fileUrl: uploadResult.fileUrl,
        fileKey: uploadResult.fileKey,
        fileContentType: file.type,
        main: formData.value.photoList.length === 0 && newPhotos.length === 0, // 첫 번째 업로드된 파일만 main으로 설정
      };
      newPhotos.push(newPhoto);
    } else {
      console.error('개별 파일 업로드 실패:', file.name);
      // 업로드 실패 토스트는 useMinio.ts 내에서 처리되므로 여기서는 생략합니다.
    }
  }

  // 성공적으로 업로드된 파일을 formData에 추가
  formData.value.photoList.push(...newPhotos);

  // 파일 입력 필드 초기화 (같은 파일을 다시 선택할 수 있도록)
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};


// --------------------------------------------------------------------------------
// File Delete Logic (MinIO 사용)
// --------------------------------------------------------------------------------
/**
 * @description Photo List에서 항목을 제거하고, useMinio를 사용하여 MinIO 서버에서 파일을 삭제합니다.
 * @param index - formData.photoList에서 제거할 인덱스
 * @param photo - 제거할 PhotoListItem 객체
 */
const removePhoto = async (index: number, photo: AssetPhotoType) => {
  // console.log('사진 삭제 요청 시작:', photo.fileName, photo.fileKey);

  // 1. 삭제 확인 모달

  const isConfirmed = await openConfirmModal({
    title: 'Delete Photo(s)',
    message: `Are you sure you want to remove '${photo.fileName}' from the list? It will also be deleted from the MinIO server.`,
    confirmText: 'Delete'
  })

  if (!isConfirmed) {
    return; // 사용자가 취소하면 작업을 끝냅니다.
  }
  appStore.setLoading(true);

  // 1. MinIO 서버에서 파일 삭제 요청
  if (photo.fileKey) {
    const deleteRes = await deleteFile(photo.fileKey);

    if (deleteRes.status === 'fail') {
      // console.error('MinIO 파일 삭제 실패:', deleteRes.result);
      // 서버 측 파일 삭제 실패 시 사용자에게 알리고 로컬 삭제는 막습니다.
      createToast({
        title: 'Failed to delete photo from server.',
        description: 'Please try again. If the issue persists, the file may not exist on the server.'
      }, { type: 'danger' });
      return;
    }
    // console.log('MinIO 파일 삭제 성공:', deleteRes.result);
  } else {
    // console.warn('MinIO Key가 없어 서버에서 삭제할 파일이 없습니다. 로컬 목록만 제거합니다.');
  }

  // 2. 로컬 formData.photoList에서 항목 제거
  // 메인 이미지 재설정 로직 (제거된 항목이 메인이었다면, 다음 항목을 메인으로 설정)
  const wasMain = photo.main;
  formData.value.photoList.splice(index, 1);

  if (wasMain && formData.value.photoList.length > 0) {
    formData.value.photoList[0].main = true;
  }

  createToast({
    title: 'Photo removed.',
    description: photo.fileKey ? 'The file has been deleted from the server and list.' : 'The file has been removed from the list.'
  }, { type: 'success' });

  // NOTE: 데이터베이스 반영은 onSubmit()에서 처리됩니다.
  appStore.setLoading(false);
}

// --------------------------------------------------------------------------------
// Main Photo Setter (main 사진 설정)
// --------------------------------------------------------------------------------
/**
 * @description 선택된 사진을 메인으로 설정하고, 나머지 사진의 main 속성을 false로 변경합니다.
 * @param index - 메인으로 설정할 사진의 인덱스
 */
const setAsMain = (index: number) => {
  // console.log('메인 사진 설정:', index);
  formData.value.photoList.forEach((p, i) => {
    p.main = i === index; // 선택된 인덱스의 사진만 main: true로 설정
  });
};

// --------------------------------------------------------------------------------
// Form Submission Logic (DB 업데이트)
// --------------------------------------------------------------------------------
const emit = defineEmits(['close']);

/**
 * @description 변경된 사진 목록을 데이터베이스에 반영하고 Pinia Store를 업데이트합니다.
 */
const onSubmit = async () => {
  // console.log('사진 정보 업데이트 시작');
  // propertyId가 없으면 업데이트를 진행하지 않습니다.
  if (!propertyId.value) {
    // console.error('Property ID가 없습니다. 업데이트를 진행할 수 없습니다.');
    createToast({ title: 'Error', description: 'Property ID is missing.' }, { type: 'danger' });
    return;
  }

  try {
    appStore.setLoading(true);
    // fileUrl과 fileKey를 포함한 전체 photoList를 API로 전송합니다.
    const payload = {
      photoList: formData.value.photoList,
    };

    // /api/property/[id]/photo.put.ts API 호출 (PUT 요청)
    const updatedAsset = await $fetch<Partial<CbreAsset>>(
      `/api/upload/${propertyId.value}/photo`,
      {
        method: 'PUT',
        body: payload,
      }
    );

    // Pinia 스토어 업데이트
    // updatedAsset은 photoList만 포함하는 Partial<CbreAsset> 구조로 가정합니다.
    propertyStore.setProperty({ photoList: updatedAsset.photoList });

    emit('close');

    createToast({
      title: 'The changes have been saved successfully.',
      // description: 'If you want to delete image click X mark'
    }, {
      type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
      timeout: 5000,
      showCloseButton: true,
      position: 'top-right',
      transition: 'bounce',
      hideProgressBar: false,
      swipeClose: true,
    })

  } catch (error) {
    // console.error('Photo Update Process Error:', error);
    createToast({
      title: 'Failed to update asset information.',
      // description: 'If you want to delete image click X mark'
    }, {
      type: 'danger',
      timeout: 5000,
      showCloseButton: true,
      position: 'top-right',
      transition: 'bounce',
      hideProgressBar: false,
      swipeClose: true,
    })
  } finally {
    appStore.setLoading(false);
  }
};

</script>