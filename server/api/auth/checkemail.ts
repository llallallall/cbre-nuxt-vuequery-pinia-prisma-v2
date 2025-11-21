// server/api/auth/checkemail.ts

import { defineEventHandler, getQuery, createError } from 'h3';
import prisma from '@/prisma/cbredb';

export default defineEventHandler(async (event) => {
        const query = getQuery(event);
        const email = query.email as string;

        if (!email) {
                throw createError({ statusCode: 400, statusMessage: 'Email is required.' });
        }

        try {
                const user = await prisma.user.findUnique({
                        where: { email },
                        select: { id: true } // ID만 가져와서 존재 여부만 확인
                });

                // 사용자가 존재하면 true (중복됨), 없으면 false (사용 가능)
                return user ? true : false;

        } catch (error) {
                console.error('Check Email Error:', error);
                throw createError({ statusCode: 500, statusMessage: 'Failed to check email.' });
        }
});