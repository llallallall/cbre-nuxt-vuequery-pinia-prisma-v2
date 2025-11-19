/**
 * @file useGoogleReverseGeocoding.ts
 * @description Google Maps API를 사용하여 좌표를 기반으로 영문 주소 구성 요소를 추출하는 Composable 함수.
 */

import { useRuntimeConfig } from '#app';
// Google Maps types는 프로젝트에 @types/google.maps가 설치되어 있다고 가정합니다.

// 🚩 수정된 인터페이스: 모든 주소 필드는 값이 없을 경우를 대비하여 'null'을 허용해야 합니다.
interface EnglishAddressComponents {
    addressFull: string | null;         // 전체 도로명 주소 (Formatted Address)
    addressFullJibun: string | null;    // 전체 지번 주소 (Lot Number)
    addressProvince: string | null;     // 시/도 (Administrative Area Level 1)
    addressCity: string | null;         // 시/군/구 (Locality/Sublocality)
}

/**
 * 주어진 위도/경도를 Google Reverse Geocoding API에 전달하여 영문 주소 구성 요소를 얻습니다.
 * 언어 파라미터 `language=en`을 사용하여 결과를 영어로 요청합니다.
 * @param lat 위도
 * @param lng 경도
 * @returns 영문 주소 구성 요소 객체 또는 오류 발생 시 null을 반환하는 Promise
 */
export function useGoogleReverseGeocoding() {
    
    // Google Maps API는 useGoogleMapsApi.js에서 전역으로 로드되지만,
    // Geocoder 객체를 사용하기 위해 API가 준비되었는지 확인해야 합니다.

    const getEnglishAddressComponents = (
        lat: number, 
        lng: number
    ): Promise<EnglishAddressComponents | null> => {

        return new Promise((resolve) => {
            const google = (window as any).google;
            
            // Google API가 로드되지 않았거나 Geocoder 서비스가 없는 경우
            if (!google || !google.maps || !google.maps.Geocoder) {
                console.error("Google Maps API (Geocoder) is not fully loaded.");
                return resolve(null);
            }

            const geocoder = new google.maps.Geocoder();
            const latlng = { lat, lng };

            // Geocoding 옵션 설정: 언어는 영문(en)으로 고정
            geocoder.geocode({ location: latlng, language: 'en' }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
                
                if (status !== google.maps.GeocoderStatus.OK || !results[0]) {
                    console.error("Google Reverse Geocoding Failed. Status:", status);
                    return resolve(null);
                }

                const result = results[0];
                const components = result.address_components;

                // 🚩 내부 초기화 시에도 null을 사용하여 타입 일관성 유지
                const parsedAddress: EnglishAddressComponents = {
                    addressFull: result.formatted_address || null, // 도로명 주소(Formatted Address)
                    addressFullJibun: null,
                    addressProvince: null,
                    addressCity: null,
                };
                
                // 1. 주소 구성 요소 파싱
                components.forEach((component: google.maps.GeocoderAddressComponent) => {
                    const type = component.types[0];
                    const long_name = component.long_name;
                    
                    switch (type) {
                        // 시/도 (Province)
                        case 'administrative_area_level_1':
                            parsedAddress.addressProvince = long_name;
                            break;
                        // 시/군/구 (City/District)
                        case 'locality': // 도시 이름
                        case 'sublocality': // 구(district) 이름
                            // Sublocality(구)가 더 상세하므로, 둘 중 하나를 사용
                            // 이미 locality가 설정되지 않은 경우에만 설정
                            if (!parsedAddress.addressCity) {
                                parsedAddress.addressCity = long_name;
                            }
                            break;
                        // 기타 필요한 구성 요소는 필요에 따라 추가
                    }
                });

                // 2. addressFullJibun (영문 지번/Lot No.) 구성
                // 지번 주소는 street_number와 sublocality를 조합하여 Lot No. 포맷으로 만듭니다.
                const streetNumber = components.find(comp => comp.types.includes('street_number'))?.long_name;
                const sublocality = components.find(comp => comp.types.includes('sublocality'))?.long_name;

                if (streetNumber && sublocality) {
                    // Lot No. ${number}, ${sublocality/dong}, ${city}, ${province} 포맷을 따름
                    const cityPart = parsedAddress.addressCity ? `${parsedAddress.addressCity}, ` : '';
                    const provincePart = parsedAddress.addressProvince ? parsedAddress.addressProvince : '';
                    
                    parsedAddress.addressFullJibun = `Lot No. ${streetNumber}, ${sublocality}, ${cityPart}${provincePart}`;
                } else {
                    // 지번 구성 요소를 찾기 어려운 경우 도로명 주소를 그대로 사용
                    parsedAddress.addressFullJibun = parsedAddress.addressFull; 
                }
                
                // 모든 필드가 string | null 타입을 가지도록 보장
                resolve(parsedAddress);
            });
        });
    };

    return {
        getEnglishAddressComponents,
    };
}