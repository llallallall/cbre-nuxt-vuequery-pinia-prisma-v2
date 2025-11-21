// composables/useMinio.ts

import { useToast } from './useToast';

export interface UploadResult {
    fileKey: string;
    fileUrl: string;
}

export const useMinio = () => {
    const { showToast } = useToast();

    /**
     * 파일 업로드 (단일 파일)
     */
    const uploadFile = async (file: File, uuid: string): Promise<UploadResult | null> => {
        // 1. 파일명 생성 (YYYY-MM-DD_HHMMSS_UUID.ext)
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const key = `${timestamp}_${uuid}.${ext}`;

        // 2. FormData 생성
        const formData = new FormData();
        formData.append('file', file); // 서버 API에서 'file' 키로 받음
        formData.append('fileKey', key);
        formData.append('uuid', uuid);

        try {
            const { data, error } = await useFetch('/api/upload/minioFileUploader', {
                method: 'POST',
                body: formData,
            });

            if (error.value) {
                throw new Error(error.value.statusMessage || 'Upload failed');
            }

            // 서버 응답 포맷에 따라 조정 (예: { url: '...', key: '...' })
            const result = data.value as any;
            return {
                fileKey: result.fileKey || key,
                fileUrl: result.fileUrl || result.url,
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