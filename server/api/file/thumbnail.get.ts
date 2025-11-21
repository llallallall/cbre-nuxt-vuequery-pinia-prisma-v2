// server/api/file/thumbnail.get.ts

import { defineEventHandler, getQuery, sendRedirect, createError } from 'h3';
import * as Minio from 'minio';
import { createThumbnail, getThumbnailKey } from '~/utils/imageResizer';

// MinIO 설정 (기존 코드 재사용)
const config = useRuntimeConfig();
const minioClient = new Minio.Client({
    endPoint: config.MINIO_SERVER_URL,
    port: Number(config.MINIO_SERVER_PORT),
    useSSL: true,
    accessKey: config.MINIO_ACCESS_KEY,
    secretKey: config.MINIO_SECRET_KEY
});
const bucket = 'cbre-assets';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const originalKey = query.key as string;

    if (!originalKey) {
        throw createError({ statusCode: 400, statusMessage: 'File key is required' });
    }

    const thumbKey = getThumbnailKey(originalKey);
    const publicBaseUrl = `https://${config.MINIO_SERVER_URL}/${bucket}`;

    try {
        // 1. 썸네일이 이미 존재하는지 확인 (statObject)
        await minioClient.statObject(bucket, thumbKey);
        
        // 2. 존재하면 해당 URL로 바로 리다이렉트 (307 Temporary Redirect)
        // 브라우저는 이 URL을 받아 이미지를 로드합니다.
        return sendRedirect(event, `${publicBaseUrl}/${thumbKey}`, 307);

    } catch (err: any) {
        // 3. 썸네일이 없으면(NoSuchKey) 원본을 찾아 생성 시도
        if (err.code === 'NoSuchKey' || err.code === 'NotFound') {
            try {
                // A. 원본 파일 가져오기
                const dataStream = await minioClient.getObject(bucket, originalKey);
                const chunks: Buffer[] = [];
                
                for await (const chunk of dataStream) {
                    chunks.push(chunk);
                }
                const originalBuffer = Buffer.concat(chunks);

                // B. 리사이징 (유틸리티 사용)
                const thumbBuffer = await createThumbnail(originalBuffer, 300); // 너비 300px

                if (thumbBuffer) {
                    // C. 썸네일 업로드
                    await minioClient.putObject(bucket, thumbKey, thumbBuffer, thumbBuffer.length, {
                        'Content-Type': 'image/jpeg' // 또는 원본 타입 감지 필요
                    });

                    // D. 생성된 썸네일로 리다이렉트
                    return sendRedirect(event, `${publicBaseUrl}/${thumbKey}`, 307);
                }
            } catch (genError) {
                console.error('Thumbnail generation failed:', genError);
                // 썸네일 생성 실패 시 원본 이미지라도 보여줌 (Fallback)
                return sendRedirect(event, `${publicBaseUrl}/${originalKey}`, 307);
            }
        }
        
        // 그 외 에러 (원본도 없는 경우 등)
        throw createError({ statusCode: 404, statusMessage: 'Image not found' });
    }
});