<template>
    <div class="p-6 space-y-6">
        <form @submit.prevent="onSubmit" class="space-y-8 font-financier">
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-primary">Brochure Files</h3>
                    <div class="relative">
                        <input type="file" ref="fileInput" accept="application/pdf" multiple @change="handleFileUpload"
                            class="hidden" id="brochure-upload" />
                        <label for="brochure-upload"
                            class="cursor-pointer bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150 flex items-center gap-2">
                            <span>Upload PDF</span>
                        </label>
                    </div>
                </div>

                <div v-if="formData.brochureList.length === 0"
                    class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                    No brochures uploaded yet.
                </div>

                <div v-else class="space-y-3">
                    <div v-for="(item, index) in formData.brochureList" :key="item.fileKey || index"
                        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="flex items-center gap-3 overflow-hidden">
                            <div class="bg-red-100 p-2 rounded text-red-600">
                                <!-- PDF Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="flex flex-col overflow-hidden">
                                <span class="text-sm font-medium text-gray-900 truncate" :title="item.fileName || ''">{{
                                    item.fileName || 'Untitled' }}</span>
                                <span class="text-xs text-gray-500">{{ item.isNew ? 'New' : 'Uploaded' }}</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <button type="button" v-if="item.fileUrl" @click="openPdfModal(item.fileUrl)"
                                class="text-blue-600 hover:text-blue-800 text-sm font-medium px-2">
                                View
                            </button>
                            <button type="button" @click="handleDeleteBrochure(index)"
                                class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-row items-center justify-end pt-8 border-t font-financierMedium">
                <button type="button" @click="emit('close')"
                    class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white py-2 px-4 rounded-[10px] mr-4 transition duration-150">Cancel</button>
                <button type="submit" :disabled="computedIsLoading"
                    class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150">Save</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useMinio } from '~/composables/useMinio';
import { useToast } from '~/composables/useToast';
import { useConfirmModal } from '~/composables/useConfirmModal';
import type { PropertyBrochureFileType } from '~/types/property.type';

// 1. Composable & Store 초기화
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { showToast } = useToast();
const { show: openConfirmModal } = useConfirmModal();
const { uploadFile, deleteFile } = useMinio();

const emit = defineEmits(['close']);
const fileInput = ref<HTMLInputElement | null>(null);

const { currentProperty } = storeToRefs(propertyStore);
const computedIsLoading = computed(() => statusStore.isGlobalLoading);

// 2. 로컬 타입 정의 (UI 상태 관리용 확장)
interface BrochureListItem extends Partial<PropertyBrochureFileType> {
    isNew?: boolean;
    tempFile?: File;
}

// 3. 데이터 초기화
const getInitialData = () => {
    // deep copy
    return JSON.parse(JSON.stringify(currentProperty.value?.propertyBrochureFile || []));
};

const formData = reactive({
    brochureList: getInitialData() as BrochureListItem[],
});

// 4. PDF 뷰어 모달
const openPdfModal = (url: string) => {
    statusStore.openViewerModal(url, 'pdf');
};

// 5. 파일 업로드 핸들러
const handleFileUpload = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    // PDF 필터링
    const pdfFiles = Array.from(files).filter(f => f.type === 'application/pdf');
    if (pdfFiles.length === 0) {
        showToast('Only PDF files can be uploaded.', 'warning');
        return;
    }

    statusStore.setGlobalLoading(true);

    try {
        const newItems: BrochureListItem[] = [];

        // 병렬 업로드 처리
        await Promise.all(pdfFiles.map(async (file) => {
            const result = await uploadFile(file, propertyStore.currentPropertyId);
            if (result) {
                newItems.push({
                    fileUuid: result.fileKey, // Key를 UUID처럼 사용 (또는 별도 UUID 생성)
                    fileName: file.name,
                    fileUrl: result.fileUrl,
                    fileKey: result.fileKey,
                    fileContentType: file.type,
                    isNew: false, // 업로드 완료됨
                });
            }
        }));

        // 목록에 추가
        formData.brochureList.push(...newItems);
        showToast(`${newItems.length} file(s) uploaded successfully.`, 'success');

    } catch (error) {
        console.error('Upload Error:', error);
        showToast('Error during file upload.', 'danger');
    } finally {
        statusStore.setGlobalLoading(false);
        if (fileInput.value) fileInput.value.value = '';
    }
};

// 6. 파일 삭제 핸들러
const handleDeleteBrochure = async (index: number) => {
    const item = formData.brochureList[index];
    const confirmed = await openConfirmModal({
        title: 'Delete Brochure',
        message: `Are you sure you want to delete '${item.fileName}'?`,
        confirmText: 'Delete'
    });

    if (!confirmed) return;

    statusStore.setGlobalLoading(true);
    try {
        if (item.fileKey) {
            const res = await deleteFile(item.fileKey);
            if (res.status !== 'success') throw new Error(res.result);
        }
        // 리스트에서 제거
        formData.brochureList.splice(index, 1);
        showToast('File deleted.', 'success');
    } catch (error) {
        showToast('Failed to delete file.', 'danger');
    } finally {
        statusStore.setGlobalLoading(false);
    }
};

// 7. 최종 저장 (DB 업데이트)
const onSubmit = async () => {
    statusStore.setGlobalLoading(true);
    try {
        // 전체 리스트 업데이트 (순서 변경 등 포함)
        await propertyStore.updatePropertySection('propertyBrochureFile', formData.brochureList as any);

        emit('close');
        showToast('Brochure list saved.', 'success');
    } catch (error) {
        showToast('Failed to save brochure list.', 'danger');
    } finally {
        statusStore.setGlobalLoading(false);
    }
};

const resetForm = () => {
    formData.brochureList = getInitialData();
    showToast('Form reset.', 'info');
};
</script>