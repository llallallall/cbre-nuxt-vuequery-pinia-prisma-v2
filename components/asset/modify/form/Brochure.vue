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
                        <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0-3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1-5a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 100-2H7z"
                                clip-rule="evenodd"></path>
                        </svg>
                        <span class="text-sm font-medium text-gray-700 truncate"
                            :title="brochure.fileName ?? 'No File Name'">
                            {{ brochure.fileName || 'Unnamed File' }}
                        </span>
                        <div v-if="brochure.fileUrl" @click="openPdfModal(brochure.fileUrl)"
                            class="text-xs text-blue-500 hover:text-blue-700 ml-2">(View)</div>
                    </div>

                    <div v-if="brochure.isNew" class="text-xs text-red-500 flex-shrink-0 mr-4">Uploading...</div>

                    <button type="button" @click="handleDeleteBrochure(index)"
                        class="ml-4 flex-shrink-0 text-gray-400 hover:text-red-600 transition duration-150"
                        title="Remove File">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
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
                <button type="button" @click="emit('close')" :disabled="computedIsLoading" class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    Cancel
                </button>
                <button type="button" @click="resetForm"
                    class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4">
                    Reset
                </button>
                <button type="submit" :disabled="computedIsLoading"
                    class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white hover:text-primary font-bold py-2 px-4 rounded-[10px] transition duration-150">
                    {{ computedIsLoading ? 'Saving...' : 'Save and Close' }}
                </button>
            </div>

        </form>

        <ModalsContainer />

    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'; // computed import 추가
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app';
import { useMinio } from '@/composables/useMinio'; // 💡 useMinio import 추가

import { ModalsContainer } from 'vue-final-modal';
import { useConfirmModal } from '~/composables/useConfirmModal';

import { createToast } from 'mosha-vue-toastify';
const { show: openConfirmModal } = useConfirmModal();

// --- 타입 정의 (useMinio에서 사용되는 타입은 useMinio.ts에서 가져오거나 정의되어 있어야 함) ---
// MinioDeleteResponse 타입은 useMinio.ts에 정의되어 있음.
// UploadResult 타입은 useMinio.ts에 정의되어 있음.

interface BrochureListItem {
    id?: string;
    fileUuid: string | null;
    fileName: string | null;
    fileUrl: string | null;
    fileKey: string | null;
    fileContentType: string | null;
    isNew?: boolean; // 새 파일 표시 (Minio 업로드 전/후 상태 추적용)
    tempFile?: File; // 실제 파일 객체 (Minio 업로드 전용)
}


const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const appStore = useAppStore();

const computedIsLoading = computed(() => appStore.isLoading);
const fileInput = ref<HTMLInputElement | null>(null);
const { uploadFile, deleteFile } = useMinio(); // 💡 useMinio Composable 사용

const openPdfModal = (url: string) => {
    appStore.setPdfModalOpen(url);
};

// 폼 데이터 초기화: Pinia Store에서 현재 브로슈어 목록을 복사
const formData = ref<{ brochureList: BrochureListItem[] }>({
    brochureList: JSON.parse(JSON.stringify(propertyStore.$state.brochureList || [])),
});

// 초기 데이터 스냅샷 (Reset을 위해)
const initialDataSnapshot = JSON.parse(JSON.stringify(formData.value.brochureList));


// 새로 추가된 파일들을 Minio에 업로드하고 결과를 반영하는 비동기 함수
const processNewBrochures = async (newItems: BrochureListItem[]) => {
    appStore.setLoading(true);
    let successfulUploadCount = 0;
    let failedUploadCount = 0;

    try {
        const uploadPromises = newItems.map(async (item) => {
            if (item.tempFile && propertyStore.propertyId) {
                // 💡 useMinio.uploadFile 사용: propertyStore.propertyId를 uuid로 전달
                const result = await uploadFile(item.tempFile, propertyStore.propertyId);

                // 로컬 목록의 해당 항목을 찾아서 업데이트 (fileUuid를 사용하여 고유하게 식별)
                const index = formData.value.brochureList.findIndex(b => b.fileUuid === item.fileUuid);

                if (result && index !== -1) {
                    // Minio 업로드 성공 시, 실제 URL과 Key로 업데이트
                    formData.value.brochureList[index].fileUrl = result.fileUrl;
                    formData.value.brochureList[index].fileKey = result.fileKey;
                    formData.value.brochureList[index].isNew = false; // 업로드 완료 표시
                    delete formData.value.brochureList[index].tempFile;
                    successfulUploadCount++;
                } else if (index !== -1) {
                    // Minio 업로드 실패 시, 로컬 목록에서 제거
                    formData.value.brochureList.splice(index, 1);
                    failedUploadCount++;
                }
            } else if (item.tempFile) {
                // propertyId가 없는 경우 (업로드 불가)
                const index = formData.value.brochureList.findIndex(b => b.fileUuid === item.fileUuid);
                if (index !== -1) formData.value.brochureList.splice(index, 1);
                failedUploadCount++;
                createToast({ title: 'Property ID is missing. File upload aborted.' }, { type: 'danger', timeout: 5000 });
            }
        });

        await Promise.all(uploadPromises);

        if (successfulUploadCount > 0) {
            createToast({
                title: `${successfulUploadCount} brochure file(s) uploaded successfully.`,
            }, { type: 'success', timeout: 3000 });
        }
        if (failedUploadCount > 0) {
            createToast({ title: `${failedUploadCount} file(s) failed to upload. They have been removed from the list.` }, { type: 'danger', timeout: 5000 });
        }

    } catch (error) {
        console.error('Batch Upload Error:', error);
        createToast({ title: 'An unknown error occurred during file upload.' }, { type: 'danger', timeout: 5000 });
    } finally {
        appStore.setLoading(false);
    }
}

// --- 파일 핸들러 ---
const handleFileUpload = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    // PDF 파일만 필터링
    const filesArray = Array.from(files).filter(file => file.type.trim() === 'application/pdf');

    if (filesArray.length === 0) {
        createToast({ title: 'Only PDF files can be uploaded.' }, { type: 'warning', timeout: 3000 });
        return;
    }

    // 1. 파일을 로컬 목록에 임시로 추가 (Minio 업로드 전)
    const newFileItems: BrochureListItem[] = filesArray.map(file => {
        return {
            fileUuid: crypto.randomUUID(),
            fileName: file.name,
            fileUrl: URL.createObjectURL(file), // 임시 URL (업로드 전 임시 표시용)
            fileKey: null,
            fileContentType: file.type,
            isNew: true, // 업로드 중 상태 표시
            tempFile: file, // 실제 파일 객체 저장
        };
    });

    formData.value.brochureList.push(...newFileItems);

    // 2. Minio 업로드 시작 (비동기)
    processNewBrochures(newFileItems);

    // 파일 입력 초기화
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const handleDeleteBrochure = async (index: number) => {
    // 1. 삭제할 파일 정보 추출
    const fileToDelete = formData.value.brochureList[index];
    const fileName = fileToDelete?.fileName || 'This file';
    const fileKey = fileToDelete?.fileKey;   // Minio 서버 파일 키

    // isNew 상태인 경우 (아직 업로드 안 된 경우)
    if (fileToDelete.isNew || !fileKey) {
        // Minio 통신 없이 로컬 목록에서만 제거
        const isConfirmed = await openConfirmModal({
            title: 'Delete File(s)',
            message: `Are you sure you want to remove '${fileName}' from the list?`,
            confirmText: 'Delete'
        });
        if (isConfirmed) {
            formData.value.brochureList.splice(index, 1);
            createToast({ title: 'File removed from list.' }, { type: 'info', timeout: 3000 });
        }
        return;
    }


    // 2. 삭제 확인 모달
    const isConfirmed = await openConfirmModal({
        title: 'Delete File(s)',
        message: `Are you sure you want to remove '${fileName}?'`,
        confirmText: 'Delete'
    });

    if (!isConfirmed) return; // 사용자가 취소하면 작업을 끝냅니다.

    if (!fileKey) {
        // 이미 위에서 isNew 체크했지만, 혹시 모를 경우를 대비하여
        formData.value.brochureList.splice(index, 1);
        createToast({ title: 'File Deletion Failed', description: 'File Key is missing. Removed from list only.' }, { type: 'danger', timeout: 5000 });
        return;
    }

    try {
        // 3. 💡 useMinio.deleteFile 사용
        const deleteResult = await deleteFile(fileKey);

        // 4. API 작업이 성공적으로 끝 (status: "success") 로컬 상태 업데이트
        if (deleteResult.status === "success") {
            // 로컬 formData.value.brochureList에서 파일 제거
            formData.value.brochureList.splice(index, 1);

            createToast({
                title: 'File Deletion Complete',
                description: `${fileName} has been removed from the server and the list.`,
            }, {
                type: 'success',
                timeout: 3000
            });

        } else {
            // API 호출은 성공했으나, 서버 측에서 Minio 또는 DB 오류로 실패한 경우
            createToast({
                title: 'Server Processing Error',
                description: `File deletion request failed: ${deleteResult.result}`,
            }, {
                type: 'danger',
                timeout: 5000,
            });
        }

    } catch (error: any) {
        console.error('File deletion failed (API call error):', error);
        createToast({
            title: 'Communication Error During Deletion',
            description: 'The file deletion request failed due to a network issue.',
        }, {
            type: 'danger',
            timeout: 5000,
        });
    }
};

// --- 최종 제출 핸들러 (Minio 업로드가 완료된 목록을 DB에 반영) ---
const onSubmit = async () => {
    // isNew 상태가 남아있는지 재확인
    if (formData.value.brochureList.some(b => b.isNew)) {
        createToast({ title: 'Upload in progress. Please wait.' }, { type: 'warning', timeout: 5000 });
        return;
    }

    appStore.setLoading(true);

    // 서버에 전송할 페이로드 (Minio 업로드 완료된 파일만)
    const payload = {
        brochureList: formData.value.brochureList.map(b => ({
            id: b.id,
            fileUuid: b.fileUuid,
            fileName: b.fileName,
            fileUrl: b.fileUrl,
            fileKey: b.fileKey,
            fileContentType: b.fileContentType,
        })),
    };

    try {
        // 서버의 DB 업데이트 API 호출 (Minio 업로드는 이미 완료됨)
        const updatedAsset = await $fetch<any>(
            `/api/upload/${propertyStore.propertyId}/brochure`,
            {
                method: 'PUT',
                body: payload,
            }
        );

        // Pinia 스토어 업데이트
        propertyStore.setProperty({ brochureList: updatedAsset.brochureList });

        emit('close');

        createToast({ title: 'Changes saved successfully.' }, { type: 'success', timeout: 5000 });

    } catch (error) {
        console.error('Brochure Update Process Error:', error);
        createToast({ title: 'Failed to update asset information.' }, { type: 'danger', timeout: 5000 });

    } finally {
        appStore.setLoading(false);
    }
};

const resetForm = () => {
    // 초기 스냅샷으로 복원
    formData.value.brochureList = JSON.parse(JSON.stringify(initialDataSnapshot));
    createToast({
        title: 'Form has been reset.',
    }, {
        type: 'info',
        timeout: 3000,
    });
}
</script>