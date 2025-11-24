// types/map.type.ts

import type { MapDefaultOptionsType } from '~/context/mapData';

/**
 * @description 지도상의 핀 좌표 및 줌 레벨 정의
 */
export interface Coordinate {
        latitude: number;
        longitude: number;
        zoom?: number;
        speed?: number;
        curve?: number;
}

/**
 * @description Map Store의 상태 정의
 */
export interface MapState {
        // 1. UI 상태
        keepStateMiniMap: boolean;
        filterMapPins: boolean;

        // 2. 지도 컨트롤 상태
        flyTo: boolean;
        pinCoordinate: Coordinate;

        // 3. 지도 스타일/설정
        mapLanguage: any; // MapboxLanguage 플러그인 인스턴스 (non-serializable)
        mapStyleOptions: MapDefaultOptionsType; // 정적 옵션의 반응형 복사본

        // 4. 검색 결과 (Kakao, Google Geocoder)
        searchedMarkers: Coordinate[];
        searchedMarkersChanged: number;
        kakaoAddress: any[];
        kakaoKeyword: any[];
        googleGeocoder: any[];

}