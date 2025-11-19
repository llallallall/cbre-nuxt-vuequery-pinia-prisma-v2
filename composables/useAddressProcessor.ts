/**
 * @file useAddressProcessor.ts
 * @description 주소 문자열을 입력받아 한국 주소 -> Kakao 좌표 -> Google 영문 주소 구성요소로 변환하는 복합 Composable.
 * 이 모듈은 다중 검색 결과를 반환하여 사용자에게 주소 선택 기회를 제공하도록 수정되었습니다.
 */

import { useRuntimeConfig } from '#app';
import { useGoogleReverseGeocoding } from './useGoogleReverseGeocoding'; 

// ---------------------------------------------
// 새 인터페이스: 주소 후보 목록의 각 항목
// ---------------------------------------------
export interface GeocodingCandidate {
    id: string; // 고유 식별자 (place_id 또는 임시 ID, Vue에서 key로 사용)
    addressKorean: string; // Google Geocoding이 반환한 표준 한국어 주소
    latitude: number; // Google의 초기 좌표
    longitude: number; // Google의 초기 좌표
}

// 최종 결과 데이터 모델
export interface StandardizedLocation {
    latitude: number | null;
    longitude: number | null;
    addressFull: string | null;         // 영문 도로명 주소 (Formatted Address)
    addressFullJibun: string | null;    // 영문 지번 주소 (Lot Number Address)
    addressProvince: string | null;     // 시/도 (Administrative Area Level 1)
    addressCity: string | null;         // 시/군/구 (Locality/Sublocality)
}

// ---------------------------------------------
// Step 1: Google Geocoding (입력 주소 -> 한국어 주소 및 Google 좌표 획득)
// 다중 검색 결과를 반환하도록 수정
// ---------------------------------------------
function geocodeWithGoogle(address: string): Promise<GeocodingCandidate[]> {
    return new Promise((resolve) => {
        // 클라이언트 환경에서만 Google Maps API 사용 가능 여부 확인
        if (typeof window.google === 'undefined' || !window.google.maps) {
            console.error('ERROR: Google Maps API is not loaded.');
            resolve([]);
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        
        // Google Geocoding 요청: 입력 주소를 기반으로 검색 (언어: 한국어)
        geocoder.geocode({ 
            address: address,
            region: 'kr', 
            language: 'ko' // 한국 주소 포맷으로 결과를 받기 위함
        }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            
            if (status !== window.google.maps.GeocoderStatus.OK || !results || results.length === 0) {
                console.warn(`[Google Geocoding] WARN: Failed or no results for input address: ${address}. Status: ${status}`);
                resolve([]); // 결과가 없을 경우 빈 배열 반환
                return;
            }

            // 모든 검색 결과를 GeocodingCandidate 배열로 변환
            const candidates: GeocodingCandidate[] = results.map((result, index) => ({
                id: result.place_id || `temp-${index}`, // place_id가 없으면 임시 ID 사용
                addressKorean: result.formatted_address,
                latitude: result.geometry.location.lat(),
                longitude: result.geometry.location.lng(),
            }));
            
            resolve(candidates);
        });
    });
}

// ---------------------------------------------
// Step 2: Kakao Geocoding (한국어 주소 -> 최고 정확도 좌표 획득)
// 기존 코드를 내부 함수로 통합 (useKakaoGeocoding 파일 삭제에 따름)
// ---------------------------------------------
async function geocodeWithKakao(addressKorean: string, token: string): Promise<{ latitude: number; longitude: number } | null> {
    
    if (!token) {
        console.error('[Kakao Geocoding] ERROR: Kakao API Token is missing.');
        return null;
    }

    const API_URL = 'https://dapi.kakao.com/v2/local/search/address.json';

    // 🇰🇷 Kakao API 검색에 적합하게 주소 정제 (불필요한 정보 제거)
    let cleanedAddress = addressKorean.replace(/South Korea|대한민국/i, '').trim();

    const parts = cleanedAddress.split(' ');
    if (parts.length > 5) {
        cleanedAddress = parts.slice(0, 5).join(' '); // 시/도, 시/군/구, 읍/면/동, 번지 등
    }
    
    const encodedAddress = encodeURIComponent(cleanedAddress);
    const url = `${API_URL}?query=${encodedAddress}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `KakaoAK ${token}`
            }
        });

        if (!response.ok) {
            console.error(`[Kakao Geocoding] ERROR: Status: ${response.status}. Response Body: ${await response.text()}`);
            return null;
        }

        const data = await response.json();
        
        if (data.documents && data.documents.length > 0) {
            const result = data.documents[0];
            
            const coordinates = {
                latitude: parseFloat(result.y),
                longitude: parseFloat(result.x)
            };

            return coordinates;
        } else {
            console.log(`[Kakao Geocoding] INFO: No results found for: ${cleanedAddress}`);
            return null;
        }

    } catch (error) {
        console.error('[Kakao Geocoding] ERROR: Fetch exception:', error);
        return null;
    }
}


// ---------------------------------------------
// Step 3: Google Reverse Geocoding (Kakao 좌표 -> 영문 주소 구성 요소 획득)
// useGoogleReverseGeocoding을 통해 수행됩니다.
// ---------------------------------------------

/**
 * 주소 입력(검색) 단계: 입력 문자열을 기반으로 주소 후보 목록을 검색합니다.
 * @param addressInput 사용자가 입력한 주소 문자열
 * @returns 주소 후보 목록 (GeocodingCandidate[])
 */
async function searchAddressCandidates(addressInput: string): Promise<GeocodingCandidate[]> {
    if (!addressInput) return [];
    
    try {
        // Google Maps API 로드는 useGoogleMapsApi.ts 또는 geocodeWithGoogle 내부에서 처리됩니다.
        const candidates = await geocodeWithGoogle(addressInput);
        return candidates;

    } catch (error) {
        console.error('ERROR in searchAddressCandidates:', error);
        return [];
    }
}


/**
 * 주소 선택 후 처리 단계: 선택된 주소 후보를 기반으로 최종 표준화된 위치 정보를 생성합니다.
 * @param selectedCandidate 사용자가 선택한 주소 후보 객체
 * @returns 최종 표준화된 위치 정보 (StandardizedLocation)
 */
async function processSelectedAddress(selectedCandidate: GeocodingCandidate): Promise<StandardizedLocation | null> {
    const config = useRuntimeConfig();
    const googleReverse = useGoogleReverseGeocoding();
    
    // 💡 Kakao API 토큰을 useRuntimeConfig에서 가져오고, 없으면 하드코딩된 디버깅 키 사용
    const KAKAO_API_TOKEN = 
        config.public.kakaoLocalApiToken || 
        '682945c66a61d3094061c9b6cf181736'; 

    let result: StandardizedLocation = {
        latitude: null,
        longitude: null,
        addressFull: null,
        addressFullJibun: null,
        addressProvince: null,
        addressCity: null,
    };

    // 1. Kakao Geocoding: 선택된 한국어 주소 -> 최고 정확도 Kakao 좌표 획득
    const kakaoCoords = await geocodeWithKakao(selectedCandidate.addressKorean, KAKAO_API_TOKEN);

    if (!kakaoCoords) {
        console.error("Failed to get high-precision coordinates from Kakao Geocoding. Aborting.");
        return null; // 실패 시 null 반환
    }

    // 좌표 업데이트 (Kakao의 고정밀 좌표 사용)
    result.latitude = kakaoCoords.latitude;
    result.longitude = kakaoCoords.longitude;

    // 2. Google Reverse Geocoding: Kakao 좌표 -> 영문 주소 구성 요소 획득
    const englishComponents = await googleReverse.getEnglishAddressComponents(
        kakaoCoords.latitude, 
        kakaoCoords.longitude
    );

    if (englishComponents) {
        // 영문 주소 구성 요소 업데이트
        result.addressFull = englishComponents.addressFull;
        result.addressFullJibun = englishComponents.addressFullJibun;
        result.addressProvince = englishComponents.addressProvince;
        result.addressCity = englishComponents.addressCity;
    } else {
        console.warn("Failed to get English address components from Google Reverse Geocoding.");
    }
    
    return result;
}

/**
 * 주소 처리 컴포저블의 최종 반환 객체
 */
export function useAddressProcessor() {
    return {
        searchAddressCandidates, // 검색 (다중 결과 반환)
        processSelectedAddress,  // 선택 후 최종 처리 (단일 결과)
    };
}