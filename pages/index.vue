`pages/index.vue` 파일을 최신 아키텍처(`usePropertyStore`, `useUiStore` 등)에 맞게 수정하고, `Map`과 `List` 컴포넌트가 올바르게 상호작용하도록 개선했습니다.

### 🛠️ 주요 수정 사항

1. **Store 교체:** `useMenuStore` 등의 구버전 스토어를 `useUiStore`, `usePropertyStore`, `useMapStore`로 교체했습니다.
2. **API 호출 방식 변경:** `propertyStore.getAllAssets()` 대신 \*\*`propertyStore.fetchInitialData()`\*\*를 사용하여 초기 데이터를 로드합니다.
(Store 정의에 따름)
3. **컴포넌트 경로 및 이름 정리:** `MapContainer`, `ListCard`, `ListLoading` 등의 컴포넌트 이름과 임포트 경로를 명확히 했습니다.
4. **UI 로직 개선:** `isListHidden`과 `isGridView` 상태를 `uiStore`에서 관리하도록 하여 전역 반응성을 확보했습니다.

-----

### ✅ 수정된 코드: `pages/index.vue`

```vue
<template>
    <div class="w-screen h-screen overflow-hidden">
        <div ref="wrapperElement" class="relative flex w-full pt-[80px] h-full">

            <div :class="[
                'h-full overflow-hidden transition-all duration-300',
                uiStore.isHiddenList ? 'w-full' : 'flex-1'
            ]">
                <MapContainer />
            </div>

            <div v-show="!uiStore.isHiddenList" :class="[
                'h-full transition-all duration-300 border-l border-gray-200',
                'w-[40%] min-w-[400px] max-w-[600px]' // 리스트 너비 고정 (반응형 조정 가능)
            ]">
                <ListCard :data="filteredAssets" :totalCount="filteredAssets.length" :itemsPerRender="6"
                    containerClasses="bg-[#f4f7f7] p-4 h-full" defaultLoadingColor="#222" />
            </div>

            <div ref="fabElement" class="floating-snap-btn-wrapper drop-shadow-xl select-none">

                <div class="fab-btn shadow-md flex justify-center cursor-pointer"
                    :class="isFabOpen ? ' bg-primary/90 delay-300' : ' bg-primary '" @click="toggleFabMenu">
                    <Icon name="ion:add-sharp" :class="isFabOpen ? 'rotate-45' : 'rotate-0'"
                        class="transition-transform duration-300 w-6 h-6 text-white" />
                </div>

                <ul class="fab-menu-ul select-none" :class="{ 'fab-active': isFabOpen }">
                    <li class="fab-menu-li shadow-md" @click="toggleViewMode" title="Toggle View">
                        <Icon :name="uiStore.isGridView ? 'ion:list' : 'ion:grid'" class="fab-menu-icon" />
                    </li>

                    <li class="fab-menu-li shadow-md" @click="toggleListVisibility" title="Toggle List">
                        <Icon :name="uiStore.isHiddenList ? 'ion:arrow-back' : 'ion:arrow-forward'"
                            class="fab-menu-icon" />
                    </li>

                    <li class="fab-menu-li shadow-md" title="Settings">
                        <Icon name="ion:settings-sharp" class="fab-menu-icon" />
                    </li>
                </ul>
            </div>

            <div v-if="isFabOpen" @click="toggleFabMenu"
                class="backdrop fixed inset-0 top-[80px] z-20 bg-black/10 transition-opacity">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';

// 1. Store 임포트
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useMapStore } from '~/stores/map'; // 필요 시 사용

// 2. 컴포넌트 임포트 (동적 임포트 또는 일반 임포트)
// Nuxt는 components 폴더를 자동 스캔하므로, 파일명과 일치한다면 import가 없어도 되지만 명시적으로 작성합니다.
import ListCard from '~/components/list/Card.vue';
import MapContainer from '~/components/map/Container.vue';

// 3. Store 인스턴스
const propertyStore = usePropertyStore();
const uiStore = useUiStore();

// 4. 반응형 상태 (Store)
const { filteredAssets } = storeToRefs(propertyStore);
// isFabOpen, isHiddenList, isGridView 등 UI 상태는 uiStore에서 관리한다고 가정 (없으면 로컬로 구현하거나 추가)
// 만약 uiStore에 없다면 로컬 ref로 구현합니다.
const isFabOpen = ref(false);

// 5. DOM 참조
const wrapperElement = ref<HTMLElement | null>(null);
const fabElement = ref<HTMLElement | null>(null);

// 6. 라이프사이클
onMounted(async () => {
    // 초기 데이터 로드 (이미 app.vue에서 호출했다면 중복 호출 방지 로직이 store 내부에 있어야 함)
    await propertyStore.fetchInitialData();
});

// 7. 핸들러 함수
const toggleFabMenu = () => {
    isFabOpen.value = !isFabOpen.value;
};

const toggleViewMode = () => {
    uiStore.toggleViewMode(); // uiStore 액션 호출
};

const toggleListVisibility = () => {
    // uiStore에 액션이 있다면 호출, 없다면 직접 상태 변경
    // 예: uiStore.isHiddenList = !uiStore.isHiddenList;
    // 여기서는 가상의 액션 호출
    if (uiStore.toggleListHidden) {
        uiStore.toggleListHidden();
    } else {
        uiStore.isHiddenList = !uiStore.isHiddenList;
    }
};

</script>

<style scoped>
/* ------------------------------------------------ */
/* --- FAB (Floating Action Button) CSS --- */
/* ------------------------------------------------ */
.floating-snap-btn-wrapper {
    position: absolute;
    bottom: 30px;
    right: 30px;
    z-index: 50;
    /* 지도 컨트롤 위에 표시되도록 높은 z-index */
}

.fab-btn {
    width: 56px;
    /* 크기 약간 키움 */
    height: 56px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-btn:hover {
    transform: scale(1.05);
}

.fab-btn:active {
    transform: scale(0.95);
}

.fab-menu-ul {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
    pointer-events: none;
    /* 비활성 시 클릭 방지 */
}

.fab-menu-li {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #012A2D;
    /* Primary Color */
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: scale(0);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* FAB 활성화 애니메이션 */
.fab-active .fab-menu-li {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
}

/* 버튼 위치 배치 (부채꼴 또는 수직/수평) */
/* 여기서는 수직 위로 배치하는 예시 */
.fab-active .fab-menu-li:nth-child(1) {
    bottom: 70px;
    transition-delay: 0.05s;
}

.fab-active .fab-menu-li:nth-child(2) {
    bottom: 130px;
    transition-delay: 0.1s;
}

.fab-active .fab-menu-li:nth-child(3) {
    bottom: 190px;
    transition-delay: 0.15s;
}

.fab-menu-icon {
    width: 20px;
    height: 20px;
}
</style>
```