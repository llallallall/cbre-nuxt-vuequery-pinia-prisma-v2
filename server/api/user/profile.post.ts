// server/api/user/profile.post.ts

import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import type { ProfileType } from '~/types/user.type';

interface CreateProfilePayload {
        userId: string;
        imageUrl?: string | null;
        company?: string | null;
        branch?: string | null;
        department?: string | null;
        title?: string | null;
        useProfileImage?: boolean;
}

export default defineEventHandler(async (event) => {
        const body = await readBody<CreateProfilePayload>(event);

        if (!body.userId) {
                throw createError({ statusCode: 400, statusMessage: 'User ID is required.' });
        }

        try {
                // 1. 이미 프로필이 존재하는지 확인
                const existingProfile = await prisma.profile.findUnique({
                        where: { userId: body.userId }
                });

                if (existingProfile) {
                        throw createError({ statusCode: 409, statusMessage: 'Profile already exists for this user.' });
                }

                // 2. 프로필 생성 (camelCase Payload -> snake_case DB Columns)
                const newProfile = await prisma.profile.create({
                        data: {
                                userId: body.userId,
                                image_url: body.imageUrl,
                                company: body.company,
                                branch: body.branch,
                                department: body.department,
                                title: body.title,
                                use_profile_image: body.useProfileImage ?? false,
                        }
                });

                // 3. 결과 반환 (snake_case DB Data -> camelCase Client Type)
                return {
                        id: newProfile.id,
                        userId: newProfile.userId,
                        imageUrl: newProfile.image_url,
                        company: newProfile.company,
                        branch: newProfile.branch,
                        department: newProfile.department,
                        title: newProfile.title,
                        useProfileImage: newProfile.use_profile_image,
                } as ProfileType;

        } catch (error: any) {
                console.error('Create Profile Error:', error);
                throw createError({ statusCode: 500, statusMessage: 'Failed to create profile.', data: error.message });
        }
});