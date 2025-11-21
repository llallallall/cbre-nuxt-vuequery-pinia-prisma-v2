// /store/map.ts

// 지도 관련 UI 상태 (핀 위치, 확대/축소, 검색 결과).

import { defineStore } from 'pinia';
import { usePropertyStore } from './property'; // 필터링된 자산 목록을 가져오기 위해 참조

// ----------------------------------------------------------------------
// 1. 타입 정의
// ----------------------------------------------------------------------

/**
 * @description 지도상의 핀 좌표 및 줌 레벨 정의
 */
type Coordinate = {
        latitude: number;
        longitude: number;
        zoom?: number;
        speed?: number;
        curve?: number;
};

/**
 * @description Map Store의 상태 정의
 */
interface MapState {
        // 1. UI 상태
        showMiniMap: boolean;
        keepStateMiniMap: boolean; // 미니맵 상태 유지 여부
        filterMapPins: boolean; // 핀 필터링 활성화 여부

        // 2. 지도 컨트롤 상태
        flyTo: boolean; // 특정 좌표로 지도를 이동해야 하는지 여부
        pinCoordinate: Coordinate; // 지도 이동 대상 좌표

        // 3. 지도 스타일/설정
        mapLanguage: any; // 지도 언어 설정 (MapboxLanguage 플러그인 인스턴스를 저장)
        mapStyleOptions: Record<string, any>; // 지도 스타일 옵션

        // 4. 검색 결과 (Kakao, Google Geocoder)
        searchedMarkers: Coordinate[]; // 사용자가 지도에 추가한 검색 마커 목록
        searchedMarkersChanged: number; // 마커 목록 변경 시 UI 갱신을 위한 타임스탬프
        kakaoAddress: any[];
        kakaoKeyword: any[];
        googleGeocoder: any[];
}


// ----------------------------------------------------------------------
// 2. 초기 상태 정의
// ----------------------------------------------------------------------

const getInitialState = (): MapState => ({
        showMiniMap: true,
        keepStateMiniMap: true,
        filterMapPins: false,

        flyTo: false,
        pinCoordinate: {
                latitude: 0,
                longitude: 0,
                zoom: 18,
                speed: 1,
                curve: 1,
        },

        mapLanguage: 'ko', // 기본값 설정 (필요에 따라 Nuxt i18n 설정 사용)
        mapStyleOptions: {}, // [TODO] 기본 MapDefaultOptions 로드 필요

        searchedMarkers: [],
        searchedMarkersChanged: Date.now(),
        kakaoAddress: [],
        kakaoKeyword: [],
        googleGeocoder: [],
});


// ----------------------------------------------------------------------
// 3. Pinia Store 정의 (useMapStore)
// ----------------------------------------------------------------------

export const useMapStore = defineStore('map', {
        state: getInitialState,

        getters: {
                /**
                 * @description 현재 필터링된 자산의 좌표 목록을 Property Store에서 가져와 Map Pin 데이터로 변환합니다.
                 */
                filteredPinCoordinates: (state) => {
                        const propertyStore = usePropertyStore();
                        // PropertyStore의 filteredAssets를 기반으로 지도에 표시할 핀 데이터 생성
                        return propertyStore.filteredAssets.map(asset => ({
                                id: asset.id,
                                name: asset.name,
                                latitude: asset.location?.latitude || 0,
                                longitude: asset.location?.longitude || 0,
                        })).filter(pin => pin.latitude !== 0 && pin.longitude !== 0); // 유효한 좌표만 반환
                },
        },

        actions: {
                /**
                 * @description 지도 이동 좌표를 설정하고 flyTo 플래그를 활성화합니다.
                 */
                setPinCoordinate(lng: number, lat: number, zoom?: number) {
                        this.pinCoordinate.longitude = lng;
                        this.pinCoordinate.latitude = lat;
                        if (zoom) this.pinCoordinate.zoom = zoom;
                        this.flyTo = true;
                },

                /**
                 * @description 지도에서 특정 핀을 클릭했을 때, 해당 자산의 상세 정보를 Property Store에 요청합니다.
                 */
                async selectAssetPin(assetId: string) {
                        const propertyStore = usePropertyStore();
                        // Property Store 액션을 호출하여 상세 정보 로드 위임
                        await propertyStore.fetchPropertyDetail(assetId);
                        // [TODO]: 상세 화면을 새 창으로 띄우는 컴포넌트 이벤트 발생 로직 추가
                },

                /**
                 * @description 지도 검색 결과 마커를 추가하거나 제거합니다.
                 */
                toggleSearchedMarker(lng: number, lat: number) {
                        const coordinate: Coordinate = { longitude: lng, latitude: lat };
                        const index = this.searchedMarkers.findIndex(
                                (el) => el.latitude === coordinate.latitude && el.longitude === coordinate.longitude
                        );

                        if (index > -1) {
                                this.searchedMarkers.splice(index, 1);
                        } else {
                                this.searchedMarkers.push(coordinate);
                        }
                        // UI 갱신을 위해 타임스탬프 업데이트
                        this.searchedMarkersChanged = Date.now();
                },
        },
});