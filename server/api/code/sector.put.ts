import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '@/prisma/cbredb';

interface UpdateSectorPayload {
        id: string;
        name: string;
}

export default defineEventHandler(async (event) => {
        const body = await readBody<UpdateSectorPayload>(event);

        if (!body.id || !body.name) {
                throw createError({ statusCode: 400, statusMessage: 'Sector ID and name are required.' });
        }

        try {
                const updatedSector = await prisma.sector.update({
                        where: { id: body.id },
                        data: {
                                name: body.name,
                        },
                });
                return updatedSector;
        } catch (error: any) {
                console.error('Update Sector Error:', error);
                throw createError({ statusCode: 500, statusMessage: 'Failed to update sector.', data: error.message });
        }
});