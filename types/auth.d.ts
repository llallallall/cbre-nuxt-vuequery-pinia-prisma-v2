// ~/types/auth.d.ts

// 'next-auth'의 기본 타입 정의를 확장합니다.
// @sidebase/nuxt-auth가 내부적으로 next-auth를 사용하므로 이 방식으로 확장합니다.
import 'next-auth';

// ----------------------------------------------------------------------
// 1. 세션에 포함된 Profile 데이터의 타입 정의
// ----------------------------------------------------------------------

/**
 * @description DB Profile 모델 필드를 세션에 추가할 때 사용되는 타입 (snake_case 기반)
 */
export type SessionProfile = {
        image_url: string | null;
        company: string | null;
        branch: string | null;
        department: string | null;
        title: string | null;
        use_profile_image: boolean;
}


declare module 'next-auth' {

        // ------------------------------------------------------------------
        // 2. User (JWT Payload) 타입 확장
        // ------------------------------------------------------------------

        // JWT에 포함된 사용자 정보에 커스텀 필드를 추가합니다.
        interface User {
                // 이 필드들이 Nuxt Auth 설정(callbacks.jwt)에서 JWT에 추가되어야 합니다.
                id: string; // 사용자 ID (DB Primary Key)
                role: string; // 사용자 권한
        }

        // ------------------------------------------------------------------
        // 3. Session 타입 확장
        // ------------------------------------------------------------------

        // useAuth().data.value.user 객체에 커스텀 필드를 추가합니다.
        interface Session {
                user: User & {
                        // next-auth의 user 객체는 name, email, image만 기본으로 가지지만, 
                        // 커스텀 User (JWT) 타입을 확장하여 id와 role을 포함시킵니다.
                        id: string;
                        role: string;

                        // 서버에서 세션에 직접 추가한 Profile 관계 데이터
                        profile?: SessionProfile;
                };
        }
}