// =======================================================================
// 🎯 useMinio.ts
// =======================================================================

// 💡 필수 타입 정의 (실제 프로젝트에서는 ~/types/ 파일에서 가져오는 것이 좋습니다.)
// 파일 업로드 성공 시 반환되는 결과 타입
interface UploadResult {
    fileKey: string;
    fileUrl: string;
}

// MinIO 파일 삭제 API 응답 타입 (API 응답 구조 가정)
interface MinioDeleteResponse {
    status: 'success' | 'fail';
    result: string; // 실패 메시지 또는 성공 메시지
}

// ⚠️ 외부 유틸리티 함수 타입 정의 (실제 사용 시에는 해당 유틸리티에서 import 필요)
declare function createToast(options: { title: string, description?: string }, config: { type: 'success' | 'danger' | 'warning', timeout?: number }): void;
// declare function openConfirmModal(message: string): Promise<boolean>; // deleteFile에서는 사용하지 않음

export function useMinio() {
    
    /**
     * @description MinIO 파일 서버로 파일을 업로드하고 URL/Key를 반환합니다.
     * @param file - 업로드할 File 객체
     * @param uuid - 파일명 생성에 사용될 고유 ID (예: Asset ID 또는 UUID)
     * @returns 성공 시 UploadResult 객체, 실패 시 null
     */
    const uploadFile = async (file: File, uuid: string): Promise<UploadResult | null> => {
        
        // 1. Key Generation Logic
        let strArry = file.type?.toString().split('/') || [];
        let originExt = (strArry.pop() + '' as string).toLowerCase();

        // 파일 이름에 사용할 타임스탬프 생성
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const hour = today.getHours().toString().padStart(2, '0');
        const minute = today.getMinutes().toString().padStart(2, '0');
        const second = today.getSeconds().toString().padStart(2, '0');
        
        const dateTime = `${year}-${month}-${day}_${hour}${minute}${second}`;
        const key = `${dateTime}_${uuid}.${originExt}`;
        
        // 2. FormData preparation
        const uploadFormData = new FormData();
        uploadFormData.append('fileName', file.name);
        uploadFormData.append('fileSize', file.size.toString());
        uploadFormData.append('fileObj', file); 
        uploadFormData.append('fileKey', key); 

        // 3. Minio Upload API Call
        try {
            // Nuxt의 useFetch를 사용하여 API 호출
            const { data, error } = await useFetch('/api/upload/minioFileUploader', {
                method: 'POST',
                body: uploadFormData,
            });

            if (error.value || !data.value) {
                console.error('Minio Upload Error:', error.value || 'No data returned.');
                createToast({ title: 'MinIO Upload Failed', description: error.value?.toString() }, { type: 'danger' });
                return null;
            }

            // 서버 응답 구조가 { uploadUrl: string, fileKey: string } 이라고 가정
            const result = JSON.parse(JSON.stringify(data.value));
            const uploadUrl = result.uploadUrl as string;
            const fileKeyFromServer = result.fileKey as string; 

            return { 
                fileKey: fileKeyFromServer || key, // 서버에서 받은 키가 있으면 사용, 없으면 직접 생성한 키 사용
                fileUrl: uploadUrl 
            };

        } catch (e) {
            console.error('File Upload failed:', e);
            createToast({ title: 'File Upload Exception', description: e?.toString() }, { type: 'danger' });
            return null;
        }
    };

    /**
     * @description MinIO 서버에서 파일을 삭제합니다.
     * @param fileKey - MinIO에 저장된 파일 Key
     * @returns MinioDeleteResponse 객체 (성공/실패 상태)
     */
    const deleteFile = async (fileKey: string): Promise<MinioDeleteResponse> => {
        if (!fileKey) {
            return { status: 'fail', result: 'MinIO File Key is missing.' };
        }

        try {
            // MinIO 파일 삭제 요청
            const res = await $fetch<MinioDeleteResponse>('/api/upload/minioFileUploader', {
                method: 'DELETE',
                query: { key: fileKey },
            });
            
            return res;

        } catch (error) {
            console.error('MinIO 파일 삭제 오류:', error);
            return { 
                status: 'fail', 
                result: error instanceof Error ? error.message : 'Network/Server Error During Photo Deletion.' 
            };
        }
    };
    
    return {
        uploadFile,
        deleteFile,
    };
}