import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '@/prisma/cbredb';

export default defineEventHandler(async (event) => {
        // 1. Body 파싱
        const body = await readBody(event);
        const propertyIds = body.propertyIds;

        // 2. 유효성 검사
        if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
                throw createError({
                        statusCode: 400,
                        statusMessage: 'A valid array of Property IDs is required.'
                });
        }

        try {
                // 3. 일괄 삭제 실행
                // Prisma Schema에 관계 설정(onDelete: Cascade)이 되어 있다면,
                // Property만 삭제해도 하위 테이블 데이터가 자동으로 삭제됩니다.
                const result = await prisma.property.deleteMany({
                        where: {
                                id: {
                                        in: propertyIds, // ID 배열에 포함된 모든 레코드 삭제
                                },
                        },
                });

                return {
                        status: 'success',
                        message: `${result.count} properties have been successfully deleted.`,
                        deletedCount: result.count,
                };

        } catch (error: any) {
                console.error('Bulk Property Delete Error:', error);
                throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to delete properties.',
                        data: error.message
                });
        }
});