// server/api/user/allusers.ts

import { defineEventHandler, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import type { UserType } from '~/types/user.type';

export default defineEventHandler(async (event) => {
        try {
                const users = await prisma.user.findMany({
                        include: {
                                profile: true
                        },
                        orderBy: {
                                name: 'asc'
                        }
                });

                // 💡 리스트 매핑
                const mappedUsers: UserType[] = users.map(user => ({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role,

                        profile: user.profile ? {
                                id: user.profile.id,
                                userId: user.profile.userId,
                                imageUrl: user.profile.image_url,
                                company: user.profile.company,
                                branch: user.profile.branch,
                                department: user.profile.department,
                                title: user.profile.title,
                                useProfileImage: user.profile.use_profile_image
                        } : null
                }));

                return mappedUsers;

        } catch (error) {
                console.error('Get All Users Error:', error);
                throw createError({ statusCode: 500, statusMessage: 'Failed to fetch users' });
        }
});