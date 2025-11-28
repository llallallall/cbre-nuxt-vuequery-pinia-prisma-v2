// /composables/useToast.ts
// Nuxt 3에서는 composables 폴더의 파일은 자동으로 import 됩니다.

import type { ToastOptions } from 'mosha-vue-toastify';

/**
 * @description mosha-vue-toastify 플러그인 ($toast)을 컴포저블 형태로 간편하게 사용하기 위한 래퍼입니다.
 */
export const useToast = () => {
        // useNuxtApp() 호출은 이 파일에서만 이루어집니다.
        const { $toast } = useNuxtApp();

        // SSR에서는 $toast가 없을 수 있으므로 no-op 함수를 제공합니다.
        const showToast = ($toast || (() => { })) as (
                content: string | { title: string; description: string },
                type?: 'info' | 'success' | 'warning' | 'danger',
                options?: ToastOptions
        ) => void;

        return {
                showToast,
        };
};