// server/api/property/[id]/index.delete.ts

import { defineEventHandler, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';

export default defineEventHandler(async (event) => {
        const { id } = getRouterParams(event);

        if (!id) {
                throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
        }

        try {
                // 💡 Prisma Schema에 `onDelete: Cascade`가 설정되어 있으므로,
                // Property 레코드 하나만 삭제하면 연관된 모든 하위 테이블(Location, Facility, Files 등)이
                // 데이터베이스 레벨에서 자동으로 삭제됩니다. 별도의 수동 삭제 로직이 필요 없습니다.
                const deletedProperty = await prisma.property.delete({
                        where: { id },
                });

                return {
                        status: 'success',
                        message: `Property ${id} deleted successfully.`,
                        data: deletedProperty
                };

        } catch (error: any) {
                console.error('Property Delete Error:', error);

                // Prisma Error: Record to delete does not exist.
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                        throw createError({ statusCode: 404, statusMessage: 'Property not found.' });
                }

                throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to delete property.',
                        data: error.message
                });
        }
});