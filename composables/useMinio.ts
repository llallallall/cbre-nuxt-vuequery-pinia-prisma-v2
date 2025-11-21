// composables/useMinio.ts

import { useToast } from './useToast';
import imageCompression from 'browser-image-compression';

export interface UploadResult {
    fileKey: string;
    fileUrl: string;
}

export const useMinio = () => {
    const { showToast } = useToast();

    /**
     * 파일 업로드 (단일 파일 + 썸네일 자동 생성)
     */
    const uploadFile = async (file: File, uuid: string): Promise<UploadResult | null> => {
        // 1. 파일명 생성 (YYYY-MM-DD_HHMMSS_UUID.ext)
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const originalKey = `${timestamp}_${uuid}.${ext}`;

        try {
            // 2. 원본 파일 업로드
            const originalFormData = new FormData();
            originalFormData.append('file', file);
            originalFormData.append('fileKey', originalKey);
            originalFormData.append('uuid', uuid);

            const { data: orgData, error: orgError } = await useFetch('/api/upload/minioFileUploader', {
                method: 'POST',
                body: originalFormData,
            });

            if (orgError.value) throw new Error(orgError.value.statusMessage || 'Original upload failed');

            const orgResult = orgData.value as any;

            // 3. 이미지인 경우 썸네일 생성 및 업로드 (병렬 처리 가능하지만 순차 처리로 안정성 확보)
            if (file.type.startsWith('image/')) {
                try {
                    const options = {
                        maxSizeMB: 0.3, // 썸네일용이므로 300KB 이하로 제한
                        maxWidthOrHeight: 600, // 리스트용이므로 600px 정도면 충분
                        useWebWorker: true,
                    };
                    const compressedBlob = await imageCompression(file, options);
                    // thumb_ 접두사를 붙여서 파일 생성
                    const thumbFile = new File([compressedBlob], `thumb_${file.name}`, { type: file.type });

                    // 키: thumb_YYYY... (같은 폴더 내에 위치하도록)
                    const thumbKey = `thumb_${originalKey}`;

                    const thumbFormData = new FormData();
                    thumbFormData.append('file', thumbFile);
                    thumbFormData.append('fileKey', thumbKey);
                    thumbFormData.append('uuid', uuid);

                    // 썸네일 업로드 (실패해도 원본은 올라갔으므로 치명적이지 않음)
                    await useFetch('/api/upload/minioFileUploader', {
                        method: 'POST',
                        body: thumbFormData,
                    });

                } catch (thumbError) {
                    console.warn('Client-side thumbnail generation/upload failed:', thumbError);
                }
            }

            return {
                fileKey: orgResult.fileKey || originalKey,
                fileUrl: orgResult.fileUrl || orgResult.url,
            };

        } catch (e: any) {
            console.error('MinIO Upload Error:', e);
            showToast(`Failed to upload ${file.name}`, 'danger');
            return null;
        }
    };

    /**
     * 파일 삭제
     */
    const deleteFile = async (fileKey: string): Promise<{ status: 'success' | 'fail', result: string }> => {
        if (!fileKey) return { status: 'fail', result: 'No file key provided' };

        try {
            const { data, error } = await useFetch('/api/upload/minioFileUploader', {
                method: 'DELETE',
                query: { key: fileKey },
            });

            if (error.value) {
                throw new Error(error.value.statusMessage || 'Delete failed');
            }

            return { status: 'success', result: 'Deleted successfully' };

        } catch (e: any) {
            console.error('MinIO Delete Error:', e);
            return { status: 'fail', result: e.message };
        }
    };

    return {
        uploadFile,
        deleteFile,
    };
};