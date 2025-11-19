<template>
    <div class="w-screen h-screen">
        <div ref="wrapperElement" class="relative flex w-full pt-[80px]">
            <div 
                :class="`flex-1 h-[calc(100vh-80px)] overflow-hidden flex ${isListHidden ? 'w-full' : ''}`"
            >
                <!-- <MapContainer /> -->
            </div>
            
            <div
                :class="`flex h-[calc(100vh-80px)] ${listWidthClass}`"
            >
                <!-- <ListCard 
                    :data="filteredAssets" 
                    :totalCount="filteredAssets.length" 
                    :isGridView="isGridView"
                    :itemsPerRender="6"
                    containerClasses="bg-[#f4f7f7] p-4" 
                    defaultLoadingColor="#222" 
                /> -->
            </div>

            <div ref="fabElement" class="floating-snap-btn-wrapper drop-shadow-xl select-none">
                <div 
                    class="fab-btn shadow-md flex justify-center cursor-pointer"
                    :class="isFabOpen ? ' bg-primary/25 delay-300' : ' bg-primary '"
                    @click="toggleFabMenu"
                >
                    <Icon name="ion:add-sharp" :class="isFabOpen ? 'rotate-45 ' : 'rotate-0 '"
                        class="transition ease-in-out duration-100 delay-100 w-6 h-6 text-white" />
                </div>
                <ul class="fab-menu-ul select-none" :class="{ 'fab-active': isFabOpen }">
                    <li class="fab-menu-li shadow-md" @click="toggleViewMode">
                        <Icon :name="isGridView ? 'ion:list' : 'ion:grid'" class="fab-menu-icon" />
                    </li>
                    <li class="fab-menu-li shadow-md" @click="uiStore.toggleListHidden()">
                        <Icon :name="isListHidden ? 'ion:arrow-back' : 'ion:arrow-forward'" class="fab-menu-icon" />
                    </li>
                    <li class="fab-menu-li shadow-md">
                        <Icon name="ion:settings-sharp" class="fab-menu-icon" />
                    </li>
                </ul>
            </div>
            
            <div 
                v-if="isFabOpen" 
                @click="toggleFabMenu" 
                class="backdrop fixed inset-0 top-[80px] z-20 bg-black/10"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

// ----------------------------------------------------
// 1. Store 및 상태 임포트
// ----------------------------------------------------
import { usePropertyStore } from '~/stores/property';
import { useMapStore } from '~/stores/map';
import { useUiStore } from '~/stores/ui'; 

// Pinia Store 인스턴스
const propertyStore = usePropertyStore();
const mapStore = useMapStore();
const uiStore = useUiStore();

// 반응성을 위한 storeToRefs 구조 분해 할당
const { filteredAssets } = storeToRefs(propertyStore);
const { isFabOpen, isListHidden, isGridView } = storeToRefs(uiStore); // isListHidden 상태 가정
const { mapStyleOptions } = storeToRefs(mapStore);


// ----------------------------------------------------
// 2. DOM 요소 참조
// ----------------------------------------------------
const wrapperElement = ref<HTMLElement | null>(null);
const fabElement = ref<HTMLElement | null>(null);

// ----------------------------------------------------
// 3. 라이프사이클 훅 및 데이터 초기화
// ----------------------------------------------------

onMounted(() => {
    // 💡 메인 페이지 로드 시 전체 자산 데이터를 가져옵니다. 
    // (앱의 설계에 따라 app.vue나 이 페이지 중 한 곳에서 호출하는 것이 권장됩니다.)
    propertyStore.getAllAssets();
});

// ----------------------------------------------------
// 4. 이벤트 핸들러 및 계산된 속성
// ----------------------------------------------------

/**
 * @description 플로팅 액션 버튼(FAB) 메뉴 상태를 토글합니다.
 */
const toggleFabMenu = () => {
    uiStore.toggleFabOpen(); // useUiStore에 toggleFabOpen 액션이 있다고 가정
};

/**
 * @description 리스트 뷰의 표시 방식을 전환합니다.
 */
const toggleViewMode = () => {
    uiStore.toggleViewMode(); // useUiStore에 toggleViewMode 액션이 있다고 가정 (Grid/List)
};

/**
 * @description 맵과 리스트의 너비 비율을 계산합니다.
 */
const listWidthClass = computed(() => {
    if (isListHidden.value) {
        // 리스트가 숨겨지면 맵이 전체 너비(w-full)를 차지합니다.
        return 'w-0 hidden'; 
    }
    // 리스트가 열려 있을 때: mapStyleOptions.MapRatio를 사용하여 비율을 계산합니다.
    const mapRatio = mapStyleOptions.value.MapRatio || 60; // 기본값 60% 가정
    const listRatio = 100 - mapRatio;

    // Tailwind CSS의 동적 클래스 바인딩을 위해 문자열로 반환
    return `w-[${listRatio}%] min-w-[40%]`; 
});

</script>

<style scoped>

/* ------------------------------------------------ */
/* --- FAB (Floating Action Button) CSS (유지) --- */
/* ------------------------------------------------ */
.floating-snap-btn-wrapper {
    position: absolute;
    bottom: 25px;
    right: 25px;
    z-index: 30; /* FAB이 다른 요소 위에 있도록 z-index 조정 */
}

.fab-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
}

.fab-btn svg {
    width: 20px;
    height: 20px;
    fill: white;
}

.fab-menu-ul {
    display: flex;
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
}

.fab-menu-li {
    position: relative;
    top: 0;
    right: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #012A2D; /* dark color */
    color: white;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    opacity: 0;
    pointer-events: none;
    transform: translateY(100%); /* 기본 위치 */
}

.fab-menu-li:last-child {
    margin-right: 0;
}

.fab-active .fab-menu-li {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0); /* 활성화 시 원래 위치 */
}

/* 개별 아이템의 지연 시간 설정 (수평 배치) */
.fab-active .fab-menu-li:nth-child(1) {
    /* 첫 번째 버튼: 가장 오른쪽 */
    right: -100%; 
    transition-delay: 0.4s;
}

.fab-active .fab-menu-li:nth-child(2) {
    /* 두 번째 버튼 */
    right: 120%; 
    transition-delay: 0.2s;
}

.fab-active .fab-menu-li:nth-child(3) {
    /* 세 번째 버튼: 가장 왼쪽 */
    right: 340%; 
    transition-delay: 0s;
}

.fab-menu-icon {
    width: 20px;
    height: 20px;
}
/* ------------------------------------------------ */
/* --- 기존 CSS 끝 -------------------------------- */
/* ------------------------------------------------ */
</style>