<template>
        <div class="w-full h-full overflow-y-auto overflow-x-hidden mt-2 mb-5 space-y-4 custom-scrollbar">

                <div v-if="kakaoAddress.length > 0">
                        <h3 class="text-sm font-bold text-gray-500 mb-2 px-1">Kakao Address</h3>
                        <div v-for="(item, index) in kakaoAddress" :key="`ka-${index}`">
                                <NavWebSearchResultAddress :item="item" />
                        </div>
                </div>

                <div v-if="kakaoKeyword.length > 0">
                        <h3 class="text-sm font-bold text-gray-500 mb-2 px-1 mt-4">Kakao Places</h3>
                        <div v-for="(item, index) in kakaoKeyword" :key="`kk-${index}`">
                                <NavWebSearchResultKeyword :item="item" />
                        </div>
                </div>

                <div v-if="googleGeocoder.length > 0">
                        <h3 class="text-sm font-bold text-gray-500 mb-2 px-1 mt-4">Google Results</h3>
                        <div v-for="(item, index) in googleGeocoder" :key="`gg-${index}`">
                                <NavWebSearchResultGeocoder :item="item" />
                        </div>
                </div>

                <div v-if="!hasResults && hasSearched" class="text-center text-gray-400 py-10">
                        No results found.
                </div>

        </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';
import useGoogleMapsApi from '@/composables/useGoogleMapsApi';

const config = useRuntimeConfig();
const KAKAO_API_KEY = config.public.kakaoLocalApiToken;

const mapStore = useMapStore();
const { kakaoAddress, kakaoKeyword, googleGeocoder } = storeToRefs(mapStore);
const hasSearched = ref(false);

const hasResults = computed(() =>
        kakaoAddress.value.length > 0 ||
        kakaoKeyword.value.length > 0 ||
        googleGeocoder.value.length > 0
);

// Google Maps API 로드
onMounted(async () => {
        try {
                // @ts-ignore
                await useGoogleMapsApi();
        } catch (e) {
                console.error('Google Maps API Load Error:', e);
        }
});

/**
 * 🔍 통합 검색 함수 (부모 컴포넌트에서 호출)
 */
const searchResult = async (keyword: string) => {
        hasSearched.value = true;

        // 1. 결과 초기화
        kakaoAddress.value = [];
        kakaoKeyword.value = [];
        googleGeocoder.value = [];

        // 2. 병렬로 검색 요청 실행
        await Promise.allSettled([
                searchKakaoAddress(keyword),
                searchKakaoKeyword(keyword),
                searchGoogleGeocoder(keyword)
        ]);
};

// --- A. Kakao Address Search ---
const searchKakaoAddress = async (query: string) => {
        try {
                // Nuxt Server API Proxy 사용 (CORS 회피 및 키 숨김)
                // server/api/utils/websearch/kakao.ts 등을 활용하거나 직접 호출

                const { data } = await useFetch<any>('https://dapi.kakao.com/v2/local/search/address.json', {
                        headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
                        params: { query, analyze_type: 'similar', page: 1, size: 10 }
                });

                if (data.value?.documents) {
                        kakaoAddress.value = data.value.documents.map((item: any) => ({
                                name: item.address_name,
                                type: item.address_type,
                                province: item.address?.region_1depth_name,
                                city: item.address?.region_2depth_name,
                                street: item.address?.region_3depth_name,
                                longitude: item.x,
                                latitude: item.y
                        }));
                }
        } catch (e) {
                console.error('Kakao Address Search Error:', e);
        }
};

// --- B. Kakao Keyword Search ---
const searchKakaoKeyword = async (query: string) => {
        try {
                const { data } = await useFetch<any>('https://dapi.kakao.com/v2/local/search/keyword.json', {
                        headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
                        params: { query, page: 1, size: 10 }
                });

                if (data.value?.documents) {
                        kakaoKeyword.value = data.value.documents.map((item: any) => ({
                                name: item.place_name,
                                type: 'KEYWORD',
                                category: item.category_name,
                                address: item.address_name,
                                place_url: item.place_url,
                                road_address: item.road_address_name,
                                longitude: item.x,
                                latitude: item.y
                        }));
                }
        } catch (e) {
                console.error('Kakao Keyword Search Error:', e);
        }
};

// --- C. Google Geocoder Search ---
const searchGoogleGeocoder = async (query: string) => {
        if (!window.google || !window.google.maps) return;

        try {
                const geocoder = new window.google.maps.Geocoder();

                // Promise로 래핑하여 비동기 처리
                const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
                        geocoder.geocode({ address: query }, (results, status) => {
                                if (status === 'OK' && results) resolve(results);
                                else reject(status);
                        });
                });

                if (results) {
                        googleGeocoder.value = results.map((item) => {
                                // Viewport(Bounds) 계산
                                const bounds = item.geometry.viewport;
                                const ne = bounds.getNorthEast();
                                const sw = bounds.getSouthWest();

                                // 대략적인 중심점 계산 (이미 location이 있지만 viewport 활용 예시)
                                const lat = item.geometry.location.lat();
                                const lng = item.geometry.location.lng();

                                return {
                                        name: item.formatted_address,
                                        type: 'Google',
                                        category: item.types[0], // 주 타입
                                        address: item.formatted_address,
                                        latitude: lat,
                                        longitude: lng,
                                        // 추가 정보 파싱 (City, Province 등)
                                        // components: item.address_components
                                };
                        });
                }

        } catch (e) {
                console.warn('Google Geocoding failed:', e);
        }
};

// 💡 defineExpose를 통해 부모 컴포넌트(SearchPannel)에서 searchResult 함수를 호출할 수 있게 함
defineExpose({
        searchResult
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
        width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #e5e7eb;
        border-radius: 3px;
}
</style>