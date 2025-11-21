// server/api/file/minioFileUploader.delete.ts

import { defineEventHandler, getQuery } from 'h3';
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
        const query = getQuery(event);
        const key = query.key as string;

        if (!key) {
                return { status: 'failure', result: 'Minio file key is missing.' };
        }

        try {
                // 1. 원본 파일 삭제
                await minioClient.removeObject(bucket, key);

                // 썸네일 삭제 로직 제거 (Client-side resizing으로 인해 별도 썸네일 없음)

                return { status: 'success', result: `Removed object: ${key}` };

        } catch (e: any) {
                console.error('Minio Deletion Error:', e);
                return { status: 'failure', result: e.message };
        }
});