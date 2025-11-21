// server/api/auth/[...].ts

import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/prisma/cbredb';
import bcrypt from 'bcrypt';

export default NuxtAuthHandler({
    // .env의 NUXT_AUTH_SECRET 사용 (없으면 경고 발생)
    secret: useRuntimeConfig().authSecret,
    
    pages: {
        signIn: '/login', // 커스텀 로그인 페이지 경로
    },
    
    providers: [
        // 💡 [수정] GitHub 제거하고 Credentials(DB 로그인)만 유지
        // @ts-expect-error: NextAuth 타입 정의 호환성 문제 우회
        CredentialsProvider.default({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials: any) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // 1. 사용자 조회
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                // 2. 사용자가 없거나 비밀번호가 설정되지 않은 경우 (소셜 가입 등)
                if (!user || !user.hashedPassword) {
                    throw new Error('Invalid email or password');
                }

                // 3. 비밀번호 검증
                const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);

                if (!isValid) {
                    throw new Error('Invalid email or password');
                }

                // 4. 성공 시 세션에 담을 기본 정보 반환
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],

    session: {
        strategy: 'jwt', // JWT 기반 세션
    },

    callbacks: {
        // JWT 토큰 생성 시 사용자 ID와 Role 추가
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        // 클라이언트 세션 조회 시 토큰 정보 전달
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore: auth.d.ts 확장이 적용되지 않았을 경우를 대비해 ignore 처리
                session.user.id = token.id as string;
                // @ts-ignore
                session.user.role = token.role as string;
            }
            return session;
        },
    },
});