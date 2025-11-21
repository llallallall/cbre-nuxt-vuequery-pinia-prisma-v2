import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '@/prisma/cbredb';

export default defineEventHandler(async (event) => {
        const body = await readBody<{ name: string }>(event);

        if (!body.name) {
                throw createError({ statusCode: 400, statusMessage: 'Sector name is required.' });
        }

        try {
                const newSector = await prisma.sector.create({
                        data: {
                                name: body.name,
                        },
                });
                return newSector;
        } catch (error: any) {
                console.error('Create Sector Error:', error);
                throw createError({ statusCode: 500, statusMessage: 'Failed to create sector.', data: error.message });
        }
});