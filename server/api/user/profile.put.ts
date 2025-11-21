// server/api/user/profile.put.ts

import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import { Prisma } from '@prisma/client';
import type { ProfileType } from '~/types/user.type';

interface UpdateProfilePayload {
        userId: string;
        imageUrl?: string | null;
        company?: string | null;
        branch?: string | null;
        department?: string | null;
        title?: string | null;
        useProfileImage?: boolean;
}

export default defineEventHandler(async (event) => {
        const body = await readBody<UpdateProfilePayload>(event);

        if (!body.userId) {
                throw createError({ statusCode: 400, statusMessage: 'User ID is required.' });
        }

        try {
                // 1. 프로필 업데이트 (upsert를 사용하여 없으면 생성하도록 할 수도 있습니다)
                // 여기서는 update를 사용하여 존재하지 않을 경우 에러를 냅니다.
                const updatedProfile = await prisma.profile.update({
                        where: { userId: body.userId },
                        data: {
                                image_url: body.imageUrl,
                                company: body.company,
                                branch: body.branch,
                                department: body.department,
                                title: body.title,
                                use_profile_image: body.useProfileImage,
                                // updated_at은 Prisma가 자동으로 갱신 (@updatedAt)
                        }
                });

                // 2. 결과 반환 (매핑)
                return {
                        id: updatedProfile.id,
                        userId: updatedProfile.userId,
                        imageUrl: updatedProfile.image_url,
                        company: updatedProfile.company,
                        branch: updatedProfile.branch,
                        department: updatedProfile.department,
                        title: updatedProfile.title,
                        useProfileImage: updatedProfile.use_profile_image,
                } as ProfileType;

        } catch (error: any) {
                console.error('Update Profile Error:', error);

                // 레코드가 없을 경우 (P2025)
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                        throw createError({ statusCode: 404, statusMessage: 'Profile not found.' });
                }

                throw createError({ statusCode: 500, statusMessage: 'Failed to update profile.', data: error.message });
        }
});