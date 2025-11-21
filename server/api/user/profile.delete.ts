// server/api/user/profile.delete.ts

import { defineEventHandler, getQuery, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';

export default defineEventHandler(async (event) => {
        // DELETE 요청은 Query Parameter로 userId를 받는 것이 일반적입니다.
        const query = getQuery(event);
        const userId = query.userId as string;

        if (!userId) {
                throw createError({ statusCode: 400, statusMessage: 'User ID is required.' });
        }

        try {
                // 프로필 삭제
                await prisma.profile.delete({
                        where: { userId: userId }
                });

                return { status: 'success', message: 'Profile deleted successfully.' };

        } catch (error: any) {
                console.error('Delete Profile Error:', error);

                // 레코드가 없을 경우
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                        throw createError({ statusCode: 404, statusMessage: 'Profile not found.' });
                }

                throw createError({ statusCode: 500, statusMessage: 'Failed to delete profile.', data: error.message });
        }
});