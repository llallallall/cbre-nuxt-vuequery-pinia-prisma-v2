// server/api/user/account.put.ts

import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import bcrypt from 'bcrypt';

interface UpdateAccountPayload {
        userId: string;
        name?: string;
        password?: string; // 비밀번호 변경 시
        // image?: string; // 소셜 로그인 이미지는 보통 직접 수정하지 않으므로 제외하거나 필요시 추가
}

export default defineEventHandler(async (event) => {
        const body = await readBody<UpdateAccountPayload>(event);

        if (!body.userId) {
                throw createError({ statusCode: 400, statusMessage: 'User ID is required.' });
        }

        // 업데이트할 데이터를 담을 객체
        const updateData: any = {};

        // 1. 이름 변경
        if (body.name) {
                updateData.name = body.name;
        }

        // 2. 비밀번호 변경 (해싱 처리)
        if (body.password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(body.password, salt);
                updateData.hashedPassword = hashedPassword;
        }

        // 변경할 내용이 없으면 리턴
        if (Object.keys(updateData).length === 0) {
                return { message: 'No changes provided.' };
        }

        try {
                const updatedUser = await prisma.user.update({
                        where: { id: body.userId },
                        data: updateData,
                        select: {
                                id: true,
                                name: true,
                                email: true,
                                // hashed password는 반환하지 않음
                        }
                });

                return {
                        status: 'success',
                        data: updatedUser
                };

        } catch (error: any) {
                console.error('Update Account Error:', error);
                throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to update account info.',
                        data: error.message
                });
        }
});