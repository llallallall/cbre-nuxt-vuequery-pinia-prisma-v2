// stores/map.ts

import { defineStore } from 'pinia';
import { usePropertyStore } from './property';
// 💡 분리된 상수와 타입 Import
import { MapDefaultOptions } from '~/context/mapData';
import type { MapState, Coordinate } from '~/types/map.type';

// ----------------------------------------------------------------------
// 1. 초기 상태 정의
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

        mapLanguage: null,

        // 💡 context/mapData.ts에서 가져온 기본값 사용
        mapStyleOptions: { ...MapDefaultOptions },

        searchedMarkers: [],
        searchedMarkersChanged: Date.now(),
        kakaoAddress: [],
        kakaoKeyword: [],
        googleGeocoder: [],
});


// ----------------------------------------------------------------------
// 2. Pinia Store 정의
// ----------------------------------------------------------------------

export const useMapStore = defineStore('map', {
        state: getInitialState,

        getters: {
                /**
                 * @description 현재 필터링된 자산의 좌표 목록을 Property Store에서 가져와 Map Pin 데이터로 변환합니다.
                 */
                filteredPinCoordinates: (state) => {
                        const propertyStore = usePropertyStore();
                        return propertyStore.filteredAssets.map(asset => ({
                                id: asset.id,
                                name: asset.name,
                                latitude: asset.location?.latitude || 0,
                                longitude: asset.location?.longitude || 0,
                        })).filter(pin => pin.latitude !== 0 && pin.longitude !== 0);
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
                 * @description 지도에서 특정 자산 핀을 클릭했을 때 상세 정보를 로드합니다.
                 */
                async selectAssetPin(assetId: string) {
                        const propertyStore = usePropertyStore();
                        await propertyStore.fetchPropertyDetail(assetId);
                },

                /**
                 * @description 검색 결과 마커를 지도에 추가하거나 제거합니다.
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
                        this.searchedMarkersChanged = Date.now();
                },

                /**
                 * @description 검색 마커 전체 초기화
                 */
                clearSearchedMarkers() {
                        this.searchedMarkers = [];
                        this.searchedMarkersChanged = Date.now();
                }
        },
});