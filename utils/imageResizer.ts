// /utils/imageResizer.ts

import sharp from 'sharp';

/**
 * 이미지 버퍼를 받아 썸네일(Resize) 버퍼로 변환합니다.
 * @param buffer 원본 파일 버퍼
 * @param width 너비 (기본값 300px)
 * @returns 썸네일 버퍼 (실패 시 null 반환)
 */
export const createThumbnail = async (buffer: Buffer, width: number = 300): Promise<Buffer | null> => {
        try {
                // sharp를 사용하여 리사이징 및 최적화
                // jpeg, png 등 포맷을 유지하면서 크기만 줄입니다.
                return await sharp(buffer)
                        .resize({ width })
                        .toBuffer();
        } catch (error) {
                console.error('Thumbnail creation failed:', error);
                return null;
        }
};

/**
 * 파일명에 'thumb_' 접두어를 붙여 반환합니다.
 * 경로가 포함된 경우 파일명 부분만 수정합니다.
 * 예: 'folder/image.jpg' -> 'folder/thumb_image.jpg'
 */
export const getThumbnailKey = (originalKey: string): string => {
        const parts = originalKey.split('/');
        const fileName = parts.pop(); // 마지막 부분이 파일명
        if (!fileName) return originalKey;

        const thumbName = `thumb_${fileName}`;
        return [...parts, thumbName].join('/'); // 다시 경로 조합
};