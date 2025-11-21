import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '@/prisma/cbredb';

interface UpdateSubSectorPayload {
        id: string;
        name: string;
        sectorId?: string; // 상위 섹터 변경 가능성 고려
}

export default defineEventHandler(async (event) => {
        const body = await readBody<UpdateSubSectorPayload>(event);

        if (!body.id || !body.name) {
                throw createError({ statusCode: 400, statusMessage: 'SubSector ID and name are required.' });
        }

        try {
                const updatedSubSector = await prisma.subSector.update({
                        where: { id: body.id },
                        data: {
                                name: body.name,
                                // sectorId가 제공된 경우에만 업데이트
                                ...(body.sectorId && { sector_id: body.sectorId }),
                        },
                });

                return {
                        id: updatedSubSector.id,
                        sectorId: updatedSubSector.sector_id,
                        name: updatedSubSector.name
                };
        } catch (error: any) {
                console.error('Update SubSector Error:', error);
                throw createError({ statusCode: 500, statusMessage: 'Failed to update subsector.', data: error.message });
        }
});