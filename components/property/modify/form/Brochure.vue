<template>
    <div class="space-y-6">
        <form @submit.prevent="onSubmit" class="space-y-6">
            <div class="flex justify-start mb-6">
                <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden" multiple
                    accept="application/pdf">
                <button type="button" @click="fileInput?.click()"
                    class="outline-none bg-cbre_primary_2 hover:bg-cbre_primary_1 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
                    + Add PDF File
                </button>
            </div>

            <div v-if="formData.brochureList && formData.brochureList.length > 0" class="space-y-3">
                <div v-for="(brochure, index) in formData.brochureList" :key="brochure.fileUuid ?? index"
                    class="relative border border-gray-300 rounded-lg p-3 flex justify-between items-center bg-gray-50">
                    <div class="flex-1 min-w-0 flex items-center space-x-2">
                        <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0-3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1-5a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 100-2H7z"
                                clip-rule="evenodd"></path>
                        </svg>
                        <span class="text-sm font-medium text-gray-700 truncate"
                            :title="brochure.fileName ?? 'No Name'">
                            {{ brochure.fileName || 'Unnamed File' }}
                        </span>
                        <div v-if="brochure.fileUrl" @click="openPdfModal(brochure.fileUrl)"
                            class="text-xs text-blue-500 hover:text-blue-700 ml-2 cursor-pointer">(View)</div>
                    </div>
                    <div v-if="brochure.isNew" class="text-xs text-red-500 flex-shrink-0 mr-4">Uploading...</div>
                    <button type="button" @click="handleDeleteBrochure(index)"
                        class="ml-4 flex-shrink-0 text-gray-400 hover:text-red-600 transition duration-150">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div v-else
                class="text-center py-5 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                No pdf files have been added.
            </div>

            <div class="flex justify-end pt-4 border-t">
                <button type="button" @click="emit('close')" :disabled="computedIsLoading"
                    class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                <button type="button" @click="resetForm"
                    class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4">Reset</button>
                <button type="submit" :disabled="computedIsLoading"
                    class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white hover:text-primary font-bold py-2 px-4 rounded-[10px] transition duration-150 disabled:opacity-50">
                    {{ computedIsLoading ? 'Saving...' : 'Save and Close' }}
                </button>
            </div>
        </form>
        <ModalsContainer />
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
import { ModalsContainer } from 'vue-final-modal';
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