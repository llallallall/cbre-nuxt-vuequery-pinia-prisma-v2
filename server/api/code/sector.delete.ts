import { defineEventHandler, getQuery, createError } from 'h3';
import prisma from '@/prisma/cbredb';

export default defineEventHandler(async (event) => {
        const query = getQuery(event);
        const id = query.id as string;

        if (!id) {
                throw createError({ statusCode: 400, statusMessage: 'Sector ID is required.' });
        }

        try {
                // 연결된 Subsector나 Property가 있으면 삭제가 제한될 수 있음 (FK 제약조건)
                // 여기서는 단순 삭제 시도
                const deletedSector = await prisma.sector.delete({
                        where: { id },
                });
                return { message: 'Sector deleted successfully.', id: deletedSector.id };
        } catch (error: any) {
                console.error('Delete Sector Error:', error);
                // 외래키 제약조건 에러(P2003) 처리 등 필요 시 추가
                throw createError({ statusCode: 500, statusMessage: 'Failed to delete sector.', data: error.message });
        }
});