// /server/api/property/bulk/index.delete.ts

import { PrismaClient } from '@prisma/client';
// [TODO]: 인증 및 권한 검사 유틸리티 import 필요

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
        // 1. [인증/권한 검사] (선택 사항)
        // const user = await checkAuth(event, ['ADMIN']); 
        // if (!user) return createError({ statusCode: 401, statusMessage: 'Unauthorized' });

        // 2. 요청 바디에서 propertyIds 배열 추출
        const body = await readBody(event);
        const propertyIds: string[] = body.propertyIds;

        if (!propertyIds || propertyIds.length === 0) {
                return createError({ statusCode: 400, statusMessage: '삭제할 propertyIds가 제공되지 않았습니다.' });
        }

        try {
                // 3. Prisma를 이용한 일괄 삭제
                // 하나의 트랜잭션으로 처리하여 원자성(Atomicity) 보장
                const result = await prisma.$transaction(async (tx) => {
                        // Property 모델에서 일괄 삭제 (WHERE id IN [...])
                        const deleteCount = await tx.property.deleteMany({
                                where: {
                                        id: {
                                                in: propertyIds, // 배열에 포함된 모든 ID 삭제
                                        },
                                },
                        });

                        // [TODO]: MinIO/S3에 저장된 자산의 이미지/파일도 여기서 일괄 삭제 로직 추가

                        return deleteCount;
                });

                // 4. 성공 응답
                return {
                        status: 'success',
                        deletedCount: result.count,
                        message: `${result.count}개의 자산이 성공적으로 삭제되었습니다.`,
                };
        } catch (error) {
                console.error('Bulk property deletion failed:', error);
                return createError({
                        statusCode: 500,
                        statusMessage: '자산 일괄 삭제 중 서버 오류가 발생했습니다.',
                });
        }
});