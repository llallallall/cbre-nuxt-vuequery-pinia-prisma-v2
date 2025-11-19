/**
 * @file useGoogleMapsApi.ts
 * @description Google Maps JavaScript API를 비동기적으로 로드하고, 로드 완료 시 Promise<typeof google.maps>를 반환하는 Composable.
 * 이 모듈은 Google Maps API 스크립트가 DOM에 단 한 번만 로드되도록 보장합니다.
 * (이전 경고 메시지 'loaded directly without loading=async'를 최소화하기 위해 콜백 패턴 사용)
 */

import { useRuntimeConfig } from '#app';

// Google Maps API가 전역으로 주입하는 'google' 객체와 콜백 함수 'initGoogle'에 대한 타입 정의
declare global {
    interface Window {
        // Google Maps API 로드 완료 시 호출될 전역 콜백 함수
        initGoogle: (() => void) | undefined;
        // Google Maps API 객체
        google: typeof google | undefined; 
    }
}

// Google Maps API의 최소한의 구조를 선언하여 TypeScript 오류를 방지합니다.
// (실제 타입은 @types/google.maps가 설치되어 있다면 제공됩니다.)
declare const google: {
    maps: {
        [key: string]: any; // Google Maps의 모든 하위 객체를 포함
    };
    [key: string]: any; // 다른 Google 객체 (예: google.maps)
};

// 모듈 스코프에서 로딩 상태를 공유하는 전역 Promise 변수
let googleMapsPromise: Promise<typeof google.maps> | null = null;

/**
 * Google Maps API 스크립트를 동적으로 로드하고, API의 'maps' 객체를 Promise로 반환합니다.
 * - 이미 로딩 중이라면 기존 Promise를 반환하여 중복 로드를 방지합니다.
 * @returns 로드 성공 시 `google.maps` 객체를 resolve하는 Promise
 */
export default function useGoogleMapsApi(): Promise<typeof google.maps> {
    const config = useRuntimeConfig();

    // 1. 이미 Promise가 존재하면 그것을 반환합니다 (중복 로드 방지)
    if (googleMapsPromise) {
        return googleMapsPromise;
    }

    // 2. 새로운 로딩 Promise를 생성하고 저장합니다.
    googleMapsPromise = new Promise((resolve, reject) => {
        const apiKey = config.public.googleApiToken;
        
        // API 키가 없는 경우 바로 에러 처리
        if (!apiKey) {
             return reject(new Error("Google Maps API Key (googleApiToken) is missing in runtime config."));
        }

        // 1. API가 이미 로드되었는지 확인 (콜백 없이 로딩 완료된 경우 포함)
        if (typeof window.google?.maps !== 'undefined') {
            return resolve(window.google.maps);
        }

        // 2. SSR 환경 확인
        if (typeof window === 'undefined') {
             // SSR 환경에서는 스크립트 로딩을 시도하지 않고 에러 처리
             // Promise를 null로 초기화하여 클라이언트 측에서 재시도할 수 있도록 합니다.
             googleMapsPromise = null; 
             return reject(new Error("Cannot load Google Maps API on the server side (SSR)."));
        }

        // 3. Google Maps API 로드 완료 시 호출될 전역 콜백 함수 정의
        window.initGoogle = () => {
            if (window.google?.maps) {
                // API가 로드되고 콜백이 호출되면 Promise를 해결합니다.
                resolve(window.google.maps);
            } else {
                // 콜백이 호출되었는데 google.maps가 정의되지 않은 예외 상황
                reject(new Error("Google Maps API callback executed, but google.maps object is missing."));
            }
            
            // 한 번 호출된 후에는 전역 함수를 정리합니다.
            delete window.initGoogle;
        };
        
        const link =
            'https://maps.googleapis.com/maps/api/js?key=' +
            apiKey +
            '&callback=initGoogle' + // 콜백 파라미터 사용
            '&region=KR' +
            '&language=en' +
            '&libraries=places';

        // 4. 이미 스크립트 태그가 있는지 확인 (중복 DOM 추가 방지)
        // key의 일부만 사용하여 선택자를 일반화합니다.
        const googleScript = document.querySelector(
            `script[src^="https://maps.googleapis.com/maps/api/js?key=${apiKey.substring(0, 5)}"]`
        );

        if (!googleScript) {
            // [TypeScript 수정]: document.createElement('script')의 결과를 HTMLScriptElement로 명시적 캐스팅
            const newScript = document.createElement('script') as HTMLScriptElement;
            
            newScript.src = link;
            newScript.async = true; // 비동기 로드 설정
            
            document.head.append(newScript);

            // 5. 로드 실패 시 에러 처리
            newScript.addEventListener('error', (e) => {
                // Promise를 null로 초기화하여 재시도 가능하게 합니다.
                googleMapsPromise = null; 
                reject(new Error(`Google Maps API failed to load: ${e}`));
            });
        } 
        // Note: 스크립트가 이미 존재한다면, 정의된 window.initGoogle 콜백이 호출될 때까지 기다립니다.
    });

    return googleMapsPromise;
}