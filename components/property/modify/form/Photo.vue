<template>
  <div class="space-y-6">
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div class="flex justify-start mb-6">
        <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden" multiple accept="image/*">
        <button type="button" @click="fileInput?.click()" class="bg-cbre_primary_2 text-white py-1 px-3 rounded-lg">+
          Add Photo</button>
      </div>

      <div v-if="formData.photoList.length > 0" class="grid md:grid-cols-3 gap-4">
        <div v-for="(photo, index) in formData.photoList" :key="photo.fileUuid || index"
          class="relative border rounded-lg p-2 flex flex-col items-center">

          <div class="w-full h-32 mb-2 bg-gray-100 overflow-hidden rounded">
            <img v-if="photo.fileUrl" :src="photo.fileUrl" class="object-cover w-full h-full" />
            <div v-else class="text-center pt-12 text-gray-400">No Image</div>
          </div>

          <div class="flex justify-between w-full items-center px-2">
            <label class="flex items-center space-x-2 text-sm">
              <input type="radio" name="mainPhoto" :checked="photo.main" @change="setAsMain(index)" />
              <span>Main</span>
            </label>
            <button type="button" @click="removePhoto(index)" class="text-red-500 hover:text-red-700">Delete</button>
          </div>

          <div v-if="photo.isNew" class="absolute top-2 right-2 bg-yellow-200 text-xs px-2 py-1 rounded">Uploading...
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t">
        <button type="button" @click="emit('close')" class="bg-gray-200 py-2 px-4 rounded mr-2">Cancel</button>
        <button type="submit" class="bg-cbre_primary_1 text-white py-2 px-4 rounded">Save</button>
      </div>
    </form>
    <ModalsContainer />
  </div>
</template>

<script setup lang="ts">
// ... (Imports: useMinio, useToast 등 Brochure와 동일) ...
import { ref, reactive } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useMinio } from '~/composables/useMinio';
import { useToast } from '~/composables/useToast';
import { useConfirmModal } from '~/composables/useConfirmModal';
import { ModalsContainer } from 'vue-final-modal';

const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { uploadFile, deleteFile } = useMinio();
const { showToast } = useToast();
const { show: openConfirmModal } = useConfirmModal();
const emit = defineEmits(['close']);

const fileInput = ref<HTMLInputElement | null>(null);

// 💡 PropertyImageFile 타입 사용
const formData = reactive({
  photoList: JSON.parse(JSON.stringify(propertyStore.currentProperty?.propertyImageFile || []))
});

// 메인 사진 설정
const setAsMain = (index: number) => {
  formData.photoList.forEach((p: any, i: number) => p.main = i === index);
};

// 파일 업로드
const handleFileUpload = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files?.length) return;

  statusStore.setGlobalLoading(true);
  try {
    // 병렬 업로드
    const uploads = Array.from(files).map(async (file) => {
      const res = await uploadFile(file, propertyStore.currentPropertyId);
      if (res) {
        return {
          fileUuid: res.fileKey,
          fileName: file.name,
          fileUrl: res.fileUrl,
          fileKey: res.fileKey,
          fileContentType: file.type,
          main: false, // 기본값
          isNew: false
        };
      }
    });

    const results = await Promise.all(uploads);
    const validResults = results.filter(r => r !== undefined);
    formData.photoList.push(...validResults);

    // 첫 사진이면 메인으로 설정
    if (formData.photoList.length === validResults.length) {
      setAsMain(0);
    }
    showToast(`${validResults.length} photos uploaded.`, 'success');

  } catch (error) {
    showToast('Upload failed.', 'danger');
  } finally {
    statusStore.setGlobalLoading(false);
    if (fileInput.value) fileInput.value.value = '';
  }
};

// 파일 삭제
const removePhoto = async (index: number) => {
  const photo = formData.photoList[index];
  const confirm = await openConfirmModal({ title: 'Delete Photo', message: 'Delete this photo?', confirmText: 'Delete' });
  if (!confirm) return;

  statusStore.setGlobalLoading(true);
  try {
    if (photo.fileKey) await deleteFile(photo.fileKey);
    formData.photoList.splice(index, 1);
    showToast('Photo deleted.', 'success');
  } catch (e) {
    showToast('Delete failed.', 'danger');
  } finally {
    statusStore.setGlobalLoading(false);
  }
};

// 저장
const onSubmit = async () => {
  statusStore.setGlobalLoading(true);
  try {
    await propertyStore.updatePropertySection('propertyImageFile', formData.photoList);
    emit('close');
    showToast('Photos saved.', 'success');
  } catch (e) {
    showToast('Save failed.', 'danger');
  } finally {
    statusStore.setGlobalLoading(false);
  }
};
</script>