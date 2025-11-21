<template>
        <div class="flex flex-col w-full h-full z-20">
                <div class="w-full flex flex-col justify-start items-start px-6">
                        <p class="text-4xl 4xs:text-6xl font-financier pt-2 mb-0">Search</p>
                        <p class="text-2xl 4xs:text-4xl font-financier pt-1 mb-5">Assets</p>
                        <p class="hidden 4xs:flex text-base font-financier text-primary">
                                You can search for an asset by its name, administrative district, or city.
                        </p>
                </div>

                <ul class="w-full grid grid-cols-1 px-6 mt-10">
                        <li class="flex flex-col">
                                <div class="flex items-center w-full h-full">
                                        <div class="input-wrapper relative flex-1 flex">
                                                <input v-model="searchKeyword" type="text" name="search"
                                                        @keyup.enter="onSearchText" class="peer search-input-pannel relative flex-1
                                   text-sm text-primary flex border-t-0 border-l-0 border-r-0 border-b-2 
                                   focus:border-b-2 focus:border-primary/70 focus:outline-0
                                   z-20 border-primary/50" />

                                                <label v-if="!searchKeyword" class="absolute top-0 items-center justify-start 
                                                w-full h-full pl-1
                                                peer-[.search-input-pannel]:peer-focus:text-[8px] 
                                                peer-[.search-input-pannel]:peer-focus:items-center 
                                                peer-[.search-input-pannel]:peer-focus:-top-4
                                                z-0 flex transition-all text-[12px] text-white/50">
                                                        Search by Name, Address
                                                </label>
                                        </div>

                                        <div class="magnifier flex cursor-pointer" @click="onSearchText">
                                                <IconMagnifier width="18px" height="18px"
                                                        class="text-inherit hover:text-accent" />
                                        </div>
                                </div>
                        </li>
                        <li class="w-full flex justify-end mt-10">
                                <div class="flex justify-center items-center relative p-0 gap-0 ml-2 hover:cursor-pointer"
                                        @click="emit('isClosed', true)">
                                        <div class="relative flex-1 flex justify-center items-center h-[28px]
                                                border-2 rounded-xl 
                                                py-1 px-2 
                                                border-primary bg-[#e6eaea]
                                                hover:border-[#767676] hover:bg-white">
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
import { storeToRefs } from "pinia";
import { usePropertyStore } from '~/stores/property';

// 💡 Store 교체: FilterStore -> PropertyStore
const propertyStore = usePropertyStore();
const { searchKeyword } = storeToRefs(propertyStore);

const emit = defineEmits(['isClosed']);

// 💡 검색 로직 구현
const onSearchText = () => {
        // 검색어 변경 시 필터 적용 액션 호출
        propertyStore.applyFilter();

        // 모바일 환경 등에서 검색 후 패널을 닫고 싶다면 아래 주석 해제
        // emit('isClosed', true);
};
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
        right: 30px;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        z-index: 100;
}

.search-input-pannel {
        background-color: transparent;
        height: 30px;
        padding-left: 10px;
        padding-right: 10px;
        width: 100%;
}

.search-input-pannel::placeholder {
        font-size: 14px;
}
</style>