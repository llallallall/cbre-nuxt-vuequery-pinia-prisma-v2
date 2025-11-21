import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '@/prisma/cbredb';

interface CreateSubSectorPayload {
        sectorId: string;
        name: string;
}

export default defineEventHandler(async (event) => {
        const body = await readBody<CreateSubSectorPayload>(event);

        if (!body.sectorId || !body.name) {
                throw createError({ statusCode: 400, statusMessage: 'Sector ID and name are required.' });
        }

        try {
                const newSubSector = await prisma.subSector.create({
                        data: {
                                sector_id: body.sectorId, // DB snake_case 매핑
                                name: body.name,
                        },
                });
                // camelCase 반환
                return {
                        id: newSubSector.id,
                        sectorId: newSubSector.sector_id,
                        name: newSubSector.name
                };
        } catch (error: any) {
                console.error('Create SubSector Error:', error);
                throw createError({ statusCode: 500, statusMessage: 'Failed to create subsector.', data: error.message });
        }
});