import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '@/prisma/cbredb';

interface CreatePropertyPayload {
        name: string;
        sectorId: string;
}

export default defineEventHandler(async (event) => {
        const body = await readBody<CreatePropertyPayload>(event);

        if (!body.name || !body.sectorId) {
                throw createError({ statusCode: 400, statusMessage: 'Property Name and Sector are required.' });
        }

        try {
                // 최소 정보로 자산 레코드 생성
                const newProperty = await prisma.property.create({
                        data: {
                                name: body.name,
                                sector_id: body.sectorId,
                                // 나머지 필드는 default 값 또는 null로 생성됨
                        },
                        select: {
                                id: true // 생성된 ID만 반환
                        }
                });

                return { id: newProperty.id };

        } catch (error: any) {
                console.error('Property Create Error:', error);
                throw createError({ statusCode: 500, statusMessage: 'Failed to create property.' });
        }
});