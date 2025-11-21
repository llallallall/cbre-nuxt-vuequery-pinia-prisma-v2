<template>
        <div class="flex flex-col w-full h-full">
                <div class="w-full h-[225px] flex flex-col justify-center items-center relative select-none bg-black">
                        <div
                                class="z-10 text-white font-financier flex flex-col justify-start items-start pl-6 w-full h-full pt-4">
                                <p class="text-4xl 4xs:text-6xl mb-0">Web Search</p>
                                <p class="text-2xl 4xs:text-4xl pl-1 mb-4">on google & kakao</p>
                                <p class="hidden 4xs:flex text-base pl-1 opacity-80 max-w-[90%]">
                                        You can display a location on a map by searching for a name, address, etc.
                                        through a search engine.
                                </p>
                        </div>

                        <video width="100%" height="100%" poster="~/assets/images/points-on-the-map.png" autoplay loop
                                muted playsinline
                                class="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-60">
                                <source type="video/webm" src="~/assets/videos/points-on-the-map.webm">
                                <source type="video/mp4" src="~/assets/videos/points-on-the-map.mp4">
                        </video>
                </div>

                <div class="flex flex-col w-full h-[calc(100%-285px)] justify-start px-4 bg-white">
                        <div
                                class="relative flex w-full items-end h-[60px] border-b-2 border-primary/50 focus-within:border-primary/70 mb-2">

                                <input v-model="searchWebText" type="text" name="search" autocomplete="off"
                                        @keyup.enter="onSearchText"
                                        class="peer search-input relative h-[50px] text-sm text-primary flex-1 border-none focus:ring-0 bg-transparent z-20 pl-2"
                                        placeholder=" " />

                                <label
                                        class="absolute top-4 left-2 text-[16px] text-primary/50 transition-all duration-200 ease-out pointer-events-none
                 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs">
                                        Search for Name, Address, and More...
                                </label>

                                <div class="magnifier flex items-center justify-center z-50 cursor-pointer p-2"
                                        @click="onSearchText">
                                        <IconMagnifier width="18px" height="18px"
                                                class="text-inherit hover:text-accent" />
                                </div>

                                <div v-if="searchWebText !== ''"
                                        class="closer flex items-center justify-center cursor-pointer z-50 p-2 mr-8"
                                        @click="onResetKeyword">
                                        <Icon name="ic:sharp-close" size="18"
                                                class="text-gray-400 hover:text-gray-600" />
                                </div>
                        </div>

                        <NavWebGeocoder ref="geocoderRef" />
                </div>

                <div class="w-full h-[60px] px-6 bg-white flex items-center justify-end border-t border-gray-100">
                        <div class="flex justify-center items-center relative p-0 gap-0 ml-2 hover:cursor-pointer"
                                @click="handleClose">
                                <div
                                        class="relative flex px-4 py-1 items-center border-2 rounded-xl border-primary bg-[#e6eaea] hover:border-[#767676] hover:bg-white transition-colors">
                                        <Icon name="mdi:close" size="20" />
                                        <span
                                                class="font-calibreLight hover:font-calibre text-lg ml-1 -translate-y-[1px]">Close</span>
                                </div>
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';

// 💡 자식 컴포넌트 (Geocoder.vue)의 타입을 임시로 정의 (expose된 메소드)
interface GeocoderComponent {
        searchResult: (keyword: string) => Promise<void>;
}

const emit = defineEmits(['isClosed']);
const mapStore = useMapStore();
const { searchedMarkers, kakaoAddress, kakaoKeyword, googleGeocoder } = storeToRefs(mapStore);

const searchWebText = ref('');
const geocoderRef = ref<GeocoderComponent | null>(null); // 💡 타입 명시

// 검색 실행
const onSearchText = () => {
        if (!searchWebText.value.trim()) {
                alert('Please enter text to search.');
                return;
        }
        // 자식 컴포넌트의 searchResult 함수 호출
        geocoderRef.value?.searchResult(searchWebText.value);
};

// 검색어 초기화
const onResetKeyword = () => {
        searchWebText.value = '';
        // Store의 검색 결과 상태 초기화
        searchedMarkers.value = [];
        kakaoAddress.value = [];
        kakaoKeyword.value = [];
        googleGeocoder.value = [];
};

const handleClose = () => {
        emit('isClosed', true);
        onResetKeyword();
};
</script>

<style scoped>
/* 스타일은 Tailwind로 대부분 대체되었으므로 최소화 */
.search-input:not(:placeholder-shown)~label {
        /* v-model 값이 있을 때 label 위로 이동 (floating label) */
        top: -8px;
        font-size: 12px;
        color: var(--color-primary);
}
</style>