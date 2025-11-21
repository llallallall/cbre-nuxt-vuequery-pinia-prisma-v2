// server/api/file/minioFileUploader.post.ts

import * as Minio from 'minio';

export default defineEventHandler(async (event) => {
        const { MINIO_SERVER_URL, MINIO_SERVER_PORT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY } = useRuntimeConfig();

        const minioClient = new Minio.Client({
                endPoint: MINIO_SERVER_URL,
                port: Number(MINIO_SERVER_PORT),
                useSSL: true,
                accessKey: MINIO_ACCESS_KEY,
                secretKey: MINIO_SECRET_KEY
        });

        const bucket = 'cbre-assets';
        const files = await readMultipartFormData(event);

        if (!files || files.length === 0) {
                return { uploadUrl: null, fileKey: null };
        }

        // MultiPart Form Data 파싱
        const fileObj = files.find(e => e.name === 'file' || e.name === 'fileObj');
        const keyObj = files.find(e => e.name === 'fileKey');

        if (!fileObj || !keyObj) {
                throw createError({ statusCode: 400, statusMessage: 'File or FileKey missing.' });
        }

        const fileBuffer = fileObj.data;
        const fileKey = keyObj.data.toString();
        const contentType = fileObj.type || 'application/octet-stream';
        const fileSize = fileBuffer.length;

        try {
                // 1. 원본 파일 업로드
                await minioClient.putObject(bucket, fileKey, fileBuffer, fileSize, {
                        'Content-Type': contentType
                });

                // 2. 이미지 파일인 경우 썸네일 생성 및 업로드 (Client Side Resizing으로 대체됨)
                // if (contentType.startsWith('image/')) { ... }

                // 3. 결과 반환 (원본 URL 반환)
                const publicUrl = `https://${MINIO_SERVER_URL}/${bucket}/${fileKey}`;

                return {
                        uploadUrl: publicUrl,
                        fileKey: fileKey
                };

        } catch (err) {
                console.error('MinIO Upload Error:', err);
                throw createError({ statusCode: 500, statusMessage: 'File upload failed.' });
        }
});