<template>
  <div class="space-y-6 mp-10">
    <div class="space-y-6">
      <!-- File Input Trigger -->
      <div class="flex items-center justify-center w-full">
        <label for="dropzone-file"
          class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id="dropzone-file" type="file" class="hidden" multiple @change="handleFileUpload" ref="fileInput" />
        </label>
      </div>

      <!-- File List -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        <div v-for="(file, index) in localFiles" :key="file.id || index"
          class="relative border border-gray-300 rounded-lg p-2 flex flex-col items-center">

          <div class="w-full h-32 mb-2 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
            <img v-if="isImage(file) && file.fileUrl" :src="file.fileUrl" class="object-contain w-full h-full"
              :alt="file.fileName || ''" />
            <div v-else class="text-gray-500 text-center p-4">
              <span class="text-4xl">📄</span>
              <p class="text-xs truncate max-w-[100px] font-calibreLight">{{ file.fileName }}</p>
              <p class="text-xs text-red-500" v-if="file.isNew">Uploading...</p>
            </div>
          </div>

          <div class="text-sm font-calibreLight text-primary truncate w-full text-center">{{ file.fileName }}</div>

          <button type="button" @click="removeFile(index, file)"
            class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition duration-150 shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status'; // AppStore 대체
import { useMinio } from '~/composables/useMinio';
import { useToast } from '~/composables/useToast';
import { useConfirmModal } from '~/composables/useConfirmModal';
import type { FloorPlanFileType } from '~/types/property.type'; // 💡 새로운 타입 사용

// Props & Emits
const props = defineProps<{
  title: string;
  type: string; // Enum 값 (문자열)
  files: FloorPlanFileType[];
}>();

const emit = defineEmits<{
  (e: 'update:files', files: FloorPlanFileType[]): void;
}>();

// Stores & Composables
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { uploadFile, deleteFile } = useMinio();
const { showToast } = useToast();
const { show: openConfirmModal } = useConfirmModal();

const fileInput = ref<HTMLInputElement | null>(null);
const propertyId = computed(() => propertyStore.currentPropertyId);

// Local State (Props와 동기화)
// tempFile 속성 추가를 위해 타입 확장
type LocalFileItem = FloorPlanFileType & { tempFile?: File; isNew?: boolean };
const localFiles = ref<LocalFileItem[]>([]);

watch(() => props.files, (newFiles) => {
  if (newFiles) {
    localFiles.value = JSON.parse(JSON.stringify(newFiles));
  } else {
    localFiles.value = [];
  }
}, { immediate: true, deep: true });

// --- Handlers ---

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0 || !propertyId.value) {
    showToast('Property ID missing or no file selected.', 'danger');
    return;
  }

  statusStore.setGlobalLoading(true);

  try {
    const uploadPromises = Array.from(files).map(async (file) => {
      // 1. MinIO 업로드
      const result = await uploadFile(file, propertyId.value);

      if (result) {
        // 2. 성공 시 객체 생성
        const newFile: LocalFileItem = {
          id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // 임시 문자열 ID 할당(TypeScript 에러 해결)
          propertyId: propertyId.value,
          type: props.type as any, // Enum Type Casting
          floor: null, // (Section.vue에서 처리 필요 시 추가 로직)
          fileUuid: result.fileKey,
          fileName: file.name,
          fileKey: result.fileKey,
          fileUrl: result.fileUrl,
          fileContentType: file.type,
          createdAt: new Date(),
          updatedAt: new Date(),
          isNew: false, // 업로드 완료됨
        };
        return newFile;
      }
      return null;
    });

    const results = await Promise.all(uploadPromises);
    const validFiles = results.filter((f): f is LocalFileItem => f !== null);

    // 3. 로컬 상태 업데이트 및 부모에게 알림
    localFiles.value.push(...validFiles);
    emit('update:files', localFiles.value);

    showToast(`${validFiles.length} file(s) uploaded.`, 'success');

  } catch (error) {
    console.error(error);
    showToast('Upload error.', 'danger');
  } finally {
    statusStore.setGlobalLoading(false);
    if (fileInput.value) fileInput.value.value = '';
  }
};

const removeFile = async (index: number, file: LocalFileItem) => {
  const confirmed = await openConfirmModal({
    title: 'Delete File',
    message: `Delete '${file.fileName}'?`,
    confirmText: 'Delete'
  });

  if (!confirmed) return;

  statusStore.setGlobalLoading(true);

  try {
    // 1. MinIO 삭제 (Key가 있는 경우)
    if (file.fileKey) {
      await deleteFile(file.fileKey);
    }

    // 2. 로컬 상태 제거
    localFiles.value.splice(index, 1);
    emit('update:files', localFiles.value);

    showToast('File deleted.', 'success');
  } catch (error) {
    showToast('Deletion failed.', 'danger');
  } finally {
    statusStore.setGlobalLoading(false);
  }
};

const isImage = (file: LocalFileItem) => {
  return file.fileContentType && file.fileContentType.startsWith('image/');
};
</script>