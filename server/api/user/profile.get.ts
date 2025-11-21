// server/api/user/userProfile.get.ts

import { defineEventHandler, getQuery, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import type { UserType } from '~/types/user.type';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const userId = query.id as string;

    if (!userId) {
        // id가 없으면 현재 세션에서 가져오는 로직을 추가할 수도 있습니다.
        // 여기서는 id 파라미터가 필수라고 가정합니다.
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true, // 프로필 정보 포함
            }
        });

        if (!user) {
            throw createError({ statusCode: 404, statusMessage: 'User not found' });
        }

        // 💡 DB(snake_case) -> Client(camelCase) 매핑
        const response: UserType = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image, // Social Login Image
            role: user.role,

            profile: user.profile ? {
                id: user.profile.id,
                userId: user.profile.userId,
                // 🎯 필드명 변환
                imageUrl: user.profile.image_url,
                company: user.profile.company,
                branch: user.profile.branch,
                department: user.profile.department,
                title: user.profile.title,
                useProfileImage: user.profile.use_profile_image
            } : null
        };

        return response;

    } catch (error) {
        console.error('Get User Profile Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch user profile' });
    }
});