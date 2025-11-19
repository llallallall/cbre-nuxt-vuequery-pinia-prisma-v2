<template>
        <div class="flex flex-col w-full h-full">
                <div class="w-full h-[225px] flex flex-col justify-center items-center relative select-none">
                        <div class="z-10 text-white font-financier  
                        flex flex-col justify-start items-start pl-6  w-full h-[225px] ">
                                <p class="text-4xl 4xs:text-6xl pt-2 mt-2 mb-0">Web Search</p>
                                <p class="text-2xl 4xs:text-4xl pt-1 pl-1 mb-5">on google & kakao</p>
                                <p class="hidden 4xs:flex text-base pl-1">You can display a location on a map by
                                        searching for a
                                        name, address, etc. through a search engine such as Google.</p>
                        </div>

                        <video width="420px" height="225px" poster="~/assets/images/points-on-the-map.png" autoplay loop muted
                                class="absolute top-0 left-0 w-full z-0 overflow-hidden">
                                <source type="video/webm" src="~/assets/videos/points-on-the-map.webm">
                                <source type="video/mp4" src="~/assets/videos/points-on-the-map.mp4">
                        </video>
                </div>
                <div class="flex flex-col w-full h-[calc(100%-285px)] justify-start px-4 ">
                        <div class="relative flex w-full items-end h-[60px]">
                                <input v-model="searchWebText" type="text" name="search" autocomplete="off"
                                        @keyup.enter="onSearchText()" class="peer search-input relative  h-[60px]
                                                text-sm text-primary flex border-t-0 border-l-0 border-r-0 border-b-2 
                                                focus:border-b-2  focus:outline-0 
                                                z-20 border-primary/50 focus:border-primary/70 " />
                                <label v-if="!searchWebText" class="absolute top-1 items-center justify-start 
                                                w-full h-full pl-1
                                                peer-[.search-input]:peer-focus:text-[8px] 
                                                peer-[.search-input]:peer-focus:items-center 
                                                peer-[.search-input]:peer-focus:-top-4
                                                peer-[.search-input]:peer-focus:left-1
                                                z-0 flex
                                                transition-all
                                                text-[16px]  
                                                text-primary/50
                                                ">
                                        <span>Search for Name, Address, and More...</span>
                                </label>
                                <div class="magnifier flex z-50" @click="onSearchText()">
                                        <IconMagnifier width=" 18px" height="18px" class="text-inherit hover:text-accent " />
                                </div>

                                <div v-if="searchWebText !== ''" class="closer flex cursor-pointer z-50"
                                        @click="onResetKeyword()">
                                        <icon name="ic:sharp-close" size="18" class="text-gray-400" />
                                </div>
                        </div>
                        <NavWebGeocoder ref="searchComponent" />



                </div>

                <ul class="w-full h-[60px] grid grid-cols-1 px-6">
                        <li class="w-full flex justify-end">
                                <div class="flex justify-center items-center relative p-0 gap-0 ml-2 hover:cursor-pointer"
                                        @click="emit('isClosed', true); onResetKeyword()">
                                        <div class="relative flex-1 flex justify-center items-center h-[28px]
                                                border-2 rounded-xl 
                                                py-1 px-2 
                                                border-primary bg-[#e6eaea]
                                                hover:border-[#767676] hover:bg-white ">

                                                <Icon name="mdi:close" size="20" />
                                                <span
                                                        class="font-calibreLight hover:font-calibre text-lg -translate-y-[1px] pr-1">Close</span>
                                        </div>


                                </div>
                        </li>
                </ul>
        </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['isClosed'])

const searchWebText = ref('')
const searchComponent = ref(null)
const onSearchText = () => {
        if (searchWebText.value !== '' || searchWebText.value.length > 0) {
                //@ts-ignore
                searchComponent.value.searchResult(searchWebText.value)
        } else {
                alert('insert Text')
        }

}


import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';
const { searchedMarkers, kakaoAddress, kakaoKeyword, googleGeocoder } = storeToRefs(useMapStore());

const onResetKeyword = () => {
        searchWebText.value = '';
        searchedMarkers.value = [];
        kakaoAddress.value = [];
        kakaoKeyword.value = [];
        googleGeocoder.value = [];
}
</script>

<style scoped>
.search {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
}

.magnifier {
        position: absolute;
        top: 5px;
        right: 0;
        background-color: transparent;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
}

.closer {
        position: absolute;
        top: 5px;
        right: 20px;
        background-color: transparent;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
}

.search-input {
        background-color: transparent;
        height: 50px;
        padding-left: 10px;
        padding-right: 10px;
        width: 100%;

}

.search-input::placeholder {
        font-size: 14px;
}
</style>