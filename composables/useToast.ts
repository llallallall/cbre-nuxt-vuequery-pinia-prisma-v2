// /composables/useToast.ts
// Nuxt 3에서는 composables 폴더의 파일은 자동으로 import 됩니다.

import type { ToastOptions } from 'mosha-vue-toastify';

/**
 * @description mosha-vue-toastify 플러그인 ($toast)을 컴포저블 형태로 간편하게 사용하기 위한 래퍼입니다.
 */
export const useToast = () => {
        // ⚠️ console log는 한글로 작성되어야 합니다.
        // useNuxtApp() 호출은 이 파일에서만 이루어집니다.
        const { $toast } = useNuxtApp();

        // 타입 추론을 위한 래퍼 함수 (플러그인에서 정의된 $toast의 타입을 활용)
        const showToast = $toast as (
                message: string,
                type?: 'info' | 'success' | 'warning' | 'danger',
                options?: ToastOptions
        ) => void;

        return {
                // 영어로 노출되는 함수 이름 (화면 텍스트가 모두 영어여야 하므로)
                showToast,
                // showToast: $toast, // 간단하게는 이렇게도 가능하지만, 위처럼 타입을 명시하는 것이 좋습니다.
        };
};