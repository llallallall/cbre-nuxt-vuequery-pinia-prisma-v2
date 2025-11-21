import { defineEventHandler, getQuery, createError } from 'h3';
import prisma from '@/prisma/cbredb';

export default defineEventHandler(async (event) => {
        const query = getQuery(event);
        const id = query.id as string;

        if (!id) {
                throw createError({ statusCode: 400, statusMessage: 'SubSector ID is required.' });
        }

        try {
                const deletedSubSector = await prisma.subSector.delete({
                        where: { id },
                });
                return { message: 'SubSector deleted successfully.', id: deletedSubSector.id };
        } catch (error: any) {
                console.error('Delete SubSector Error:', error);
                throw createError({ statusCode: 500, statusMessage: 'Failed to delete subsector.', data: error.message });
        }
});