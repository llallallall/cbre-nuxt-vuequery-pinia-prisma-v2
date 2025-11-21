// server/api/auth/register.post.ts

import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

interface RegisterPayload {
        email: string;
        password: string;
        name: string;
}

export default defineEventHandler(async (event) => {
        const body = await readBody<RegisterPayload>(event);

        if (!body.email || !body.password || !body.name) {
                throw createError({
                        statusCode: 400,
                        statusMessage: 'Bad Request',
                        message: 'Email, password, and name are required.',
                });
        }

        // 이메일 중복 확인
        const existingUser = await prisma.user.findUnique({
                where: { email: body.email },
        });

        if (existingUser) {
                throw createError({
                        statusCode: 409,
                        statusMessage: 'Conflict',
                        message: 'User already exists with this email.',
                });
        }

        // 비밀번호 해싱
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        try {
                // 사용자 생성
                const newUser = await prisma.user.create({
                        data: {
                                email: body.email,
                                name: body.name,
                                hashedPassword: hashedPassword,
                                role: Role.USER, // 기본 권한
                                profile: {
                                        create: {}, // 빈 프로필 생성
                                },
                        },
                        select: {
                                id: true,
                                email: true,
                                name: true,
                                role: true,
                                // hashedPassword는 반환하지 않음
                        }
                });

                return newUser;

        } catch (error: any) {
                console.error('Registration Error:', error);
                throw createError({
                        statusCode: 500,
                        statusMessage: 'Internal Server Error',
                        message: 'Failed to create user account.',
                });
        }
});