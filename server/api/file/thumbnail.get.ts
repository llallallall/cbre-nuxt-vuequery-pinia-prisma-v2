// server/api/file/thumbnail.get.ts

import { defineEventHandler, getQuery, sendRedirect, createError } from 'h3';
import * as Minio from 'minio';

// MinIO 설정 (기존 코드 재사용)
const config = useRuntimeConfig();
const bucket = 'cbre-assets';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const originalKey = query.key as string;

    if (!originalKey) {
        throw createError({ statusCode: 400, statusMessage: 'File key is required' });
    }

    const publicBaseUrl = `https://${config.MINIO_SERVER_URL}/${bucket}`;

    // Client-side resizing이 적용되었으므로, 별도의 썸네일 생성 없이 원본(이미 압축됨)으로 리다이렉트
    return sendRedirect(event, `${publicBaseUrl}/${originalKey}`, 307);
});