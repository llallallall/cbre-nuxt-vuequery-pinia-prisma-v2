// /plugins/toast.ts
// Nuxt 3.6.5, Vue 3.3.7 기준

import { createToast, type ToastOptions } from 'mosha-vue-toastify';

/**
 * @description mosha-vue-toastify를 Nuxt의 전역 $toast 유틸리티로 등록합니다.
 */
export default defineNuxtPlugin((nuxtApp) => {

        // console.log('mosha-vue-toastify 플러그인을 $toast로 등록했습니다.');

        // 래핑 함수 정의
        const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info', options: ToastOptions = {}) => {
                // 모든 토스트에 기본 옵션을 적용합니다.
                const defaultOptions: ToastOptions = {
                        timeout: 3000,
                        showIcon: true,
                        position: 'top-right',
                        type: type, // 타입 설정
                        // [TODO]: 다국어 지원 시, options.message를 i18n으로 처리하는 로직 추가
                };

                // 토스트 표시
                createToast(message, { ...defaultOptions, ...options });
        };

        // $toast 이름으로 템플릿 및 컴포저블에서 접근 가능하도록 주입
        return {
                provide: {
                        toast: showToast,
                },
        };
});