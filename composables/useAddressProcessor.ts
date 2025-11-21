// composables/useAddressProcessor.ts

import { useRuntimeConfig } from '#app';
import { useToast } from './useToast';

// 주소 후보 타입
export interface GeocodingCandidate {
    id: string;
    addressKorean: string; // 전체 도로명 주소
    roadAddress: string;
    jibunAddress: string;
    zonecode: string;
    // Kakao API에서 주는 좌표 (필요시 사용)
    x?: string; // longitude
    y?: string; // latitude
}

// 정제된 최종 주소 타입
export interface StandardizedLocation {
    addressFull: string;      // 도로명 (한글)
    addressFullJibun: string; // 지번 (한글)
    addressProvince: string;  // 시/도 (한글)
    addressCity: string;      // 시/군/구 (한글)
    latitude: number;
    longitude: number;
}

export const useAddressProcessor = () => {
    const config = useRuntimeConfig();
    const { showToast } = useToast();

    /**
     * Kakao 주소 검색 API 호출 (클라이언트 사이드)
     * 또는 자체 백엔드 API를 통해 호출
     */
    const searchAddressCandidates = async (query: string): Promise<GeocodingCandidate[]> => {
        // 1. Kakao API 직접 호출 예시 (Script 로드 필요)
        // 만약 백엔드 프록시를 쓴다면 fetch('/api/map/search', ...) 사용

        // 여기서는 window.daum.Postcode 대신 Kakao REST API를 사용하거나
        // Google Maps Geocoding API를 사용하는 예시를 듭니다.
        // (프로젝트 상황에 맞게 조정 필요. 여기서는 Google Geocoding으로 가정)

        if (!window.google || !window.google.maps) {
            showToast('Google Maps API not loaded.', 'danger');
            return [];
        }

        const geocoder = new window.google.maps.Geocoder();

        return new Promise((resolve, reject) => {
            geocoder.geocode({ address: query }, (results, status) => {
                if (status === 'OK' && results) {
                    const candidates = results.map((res, idx) => ({
                        id: res.place_id,
                        addressKorean: res.formatted_address, // 구글은 포맷팅된 주소 제공
                        roadAddress: res.formatted_address,
                        jibunAddress: '', // 구글은 지번 분리가 어려울 수 있음
                        zonecode: '',
                        x: res.geometry.location.lng().toString(),
                        y: res.geometry.location.lat().toString()
                    }));
                    resolve(candidates);
                } else {
                    console.warn('Geocoding status:', status);
                    resolve([]);
                }
            });
        });
    };

    /**
     * 선택된 주소를 상세 분석하여 좌표와 행정구역 정보를 추출
     */
    const processSelectedAddress = async (candidate: GeocodingCandidate): Promise<StandardizedLocation | null> => {
        if (!window.google || !window.google.maps) return null;

        const geocoder = new window.google.maps.Geocoder();

        return new Promise((resolve, reject) => {
            // placeId로 상세 조회하거나, 이미 좌표가 있다면 역지오코딩 수행
            // 여기서는 좌표(x,y)가 있으면 바로 사용하고, 없으면 address로 다시 조회
            const lat = parseFloat(candidate.y || '0');
            const lng = parseFloat(candidate.x || '0');

            if (lat && lng) {
                // 좌표가 이미 있는 경우 역지오코딩으로 행정구역 상세 파싱 추천
                // (Google API로 행정구역 파싱 로직 추가 가능)
                resolve({
                    addressFull: candidate.roadAddress,
                    addressFullJibun: candidate.jibunAddress || candidate.roadAddress, // 지번 없으면 도로명 대체
                    addressProvince: '', // 구글 결과에서 parsing 필요 (administrative_area_level_1)
                    addressCity: '',     // (locality or sublocality)
                    latitude: lat,
                    longitude: lng
                });

                // 실제로는 Google Geocoding 결과를 순회하며 components를 파싱해야 Province/City가 정확합니다.
                // 아래는 단순 예시입니다.
            } else {
                // 좌표가 없으면 다시 Geocoding
                geocoder.geocode({ address: candidate.addressKorean }, (results, status) => {
                    if (status === 'OK' && results && results[0]) {
                        const res = results[0];
                        const lat = res.geometry.location.lat();
                        const lng = res.geometry.location.lng();

                        // 주소 컴포넌트 파싱
                        let province = '';
                        let city = '';

                        res.address_components.forEach(comp => {
                            if (comp.types.includes('administrative_area_level_1')) province = comp.long_name;
                            if (comp.types.includes('locality') || comp.types.includes('sublocality_level_1')) {
                                if (!city) city = comp.long_name; // 가장 큰 단위 우선
                            }
                        });

                        resolve({
                            addressFull: res.formatted_address,
                            addressFullJibun: res.formatted_address, // 구글은 구분 안됨
                            addressProvince: province,
                            addressCity: city,
                            latitude: lat,
                            longitude: lng
                        });
                    } else {
                        resolve(null);
                    }
                });
            }
        });
    };

    return {
        searchAddressCandidates,
        processSelectedAddress
    };
};