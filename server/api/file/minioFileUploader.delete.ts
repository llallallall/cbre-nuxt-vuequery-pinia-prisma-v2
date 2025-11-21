// server/api/file/minioFileUploader.delete.ts

import { defineEventHandler, getQuery } from 'h3';
import * as Minio from 'minio';
import { getThumbnailKey } from '~/utils/imageResizer'; // 유틸리티 import

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

                // 2. 썸네일 파일 삭제 (시도)
                // 이미지인지 아닌지 Key만 보고 확실치 않으므로, 그냥 썸네일 키를 만들어 삭제 시도합니다.
                // (MinIO는 없는 객체를 삭제하려고 해도 에러를 내지 않고 성공으로 처리하므로 안전합니다.)
                const thumbKey = getThumbnailKey(key);
                await minioClient.removeObject(bucket, thumbKey);

                return { status: 'success', result: `Removed object: ${key}` };

        } catch (e: any) {
                console.error('Minio Deletion Error:', e);
                return { status: 'failure', result: e.message };
        }
});