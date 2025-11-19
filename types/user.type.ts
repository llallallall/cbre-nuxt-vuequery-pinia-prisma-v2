// /types/user.type.ts

import type { SessionProfile } from '~/types/auth.d';

// ----------------------------------------------------------------------
// --- 1. 기본 API 응답 및 Input 타입 ---
// ----------------------------------------------------------------------

export interface IUser {
        id: string | null // DB 모델에 맞춰 string으로 변경
        email: string
        name: string
        password?: string
        verified: boolean
        verification_code: string
        role: string
        created_at: string
        updated_at: string
}

export interface GenericResponse {
        status: string
        message: string
}

export interface ILoginInput {
        email: string
        password: string
}

export interface ISignUpInput {
        name: string
        email: string
        password: string
        passwordConfirm: string
}

export interface ILoginResponse {
        status: string
        access_token: string
}

export interface ISignUpResponse {
        status: string
        message: string
}

export interface IUserResponse {
        status: string
        data: {
                user: IUser
        }
}

// ----------------------------------------------------------------------
// --- 2. Pinia Store 및 Frontend 핵심 타입 (DB 스키마 반영) ---
// ----------------------------------------------------------------------

/**
 * @description DB 'Profile' 모델 필드를 Pinia Store에 맞게 camelCase로 정의한 타입
 */
export interface ProfileType {
        id: string | null; // Profile의 고유 ID
        userId: string | null; // User 모델과의 외래 키

        // 🎯 SessionProfile (snake_case)와 달리 Store는 camelCase를 사용합니다.
        imageUrl: string | null; // DB: image_url
        company: string | null;
        branch: string | null;
        department: string | null;
        title: string | null;

        useProfileImage: boolean; // DB: use_profile_image
}

/**
 * @description API 응답 (DB User 모델) 기반 타입: 세션 기본 정보 + Profile 관계
 */
export interface UserType {
        id: string | null;           // DB ID
        name: string | null;
        email: string | null;
        image: string | null;        // Auth.js provider image (URL)
        role: string | null;

        profile: ProfileType | null; // ProfileType과의 1:1 관계 (camelCase)
}
