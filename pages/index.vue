<template>
    <div class="w-screen h-screen overflow-hidden">
        <div ref="wrapperElement" class="relative flex w-full pt-[80px] h-full">

            <div :class="[
                'h-full overflow-hidden transition-all duration-300',
                uiStore.isHiddenList ? 'w-full' : 'flex-1'
            ]">
                <button v-if="uiStore.isHiddenList" @click="uiStore.isHiddenList = false"
                    class="absolute top-[90px] right-[80px] z-10 bg-white p-2 rounded-md shadow-md border border-gray-300 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-300 animate-fade-in">
                    <Icon name="ph:sidebar-simple" size="20" />
                    <span>Show List</span>
                </button>
                <MapContainer />


            </div>

            <div v-show="!uiStore.isHiddenList" :class="[
                'h-full transition-all duration-300 border-l border-gray-200',
                uiStore.isExpandedList ? 'w-[50%]' : 'w-[40%] min-w-[400px] max-w-[600px]'
            ]">
                <ListCard :data="filteredProperties" :totalCount="filteredProperties.length" :itemsPerRender="6"
                    containerClasses="bg-[#f4f7f7] p-4 h-full" defaultLoadingColor="#222" />
            </div>

            <div ref="fabElement" class="floating-snap-btn-wrapper drop-shadow-xl select-none left"
                :class="{ 'fab-active': uiStore.isFabOpen }">

                <!-- BEGIN :: Floating Button -->
                <div class="fab-btn shadow-md flex justify-center cursor-pointer"
                    :class="uiStore.isFabOpen ? ' bg-primary/90 delay-300' : ' bg-primary '">
                    <Icon name="ion:add-sharp" :class="uiStore.isFabOpen ? 'rotate-45' : 'rotate-0'"
                        class="transition-transform duration-300 w-6 h-6 text-white" />
                </div>
                <!-- BEGIN :: Expand Section -->
                <ul class="fab-menu-ul select-none">


                    <li class="fab-menu-li shadow-md bg-white" @click="resetUserSelection" title="Reset Selection">
                        <label>Reset</label>
                        <Icon name="ion:refresh" class="fab-menu-icon" />
                    </li>

                    <li class="fab-menu-li shadow-md bg-white" @click="openInfoModal" title="Show Transaction Info">
                        <label>Info</label>
                        <Icon name="ion:document-text" class="fab-menu-icon" />
                    </li>
                    <li class="fab-menu-li shadow-md bg-white" @click="uiStore.showMiniMap = !uiStore.showMiniMap"
                        title="Toggle Mini Map">
                        <label>Toggle</label>
                        <Icon name="ion:map" class="fab-menu-icon" />
                    </li>
                </ul>
            </div>

            <div v-if="uiStore.isFabOpen || uiStore.showInfoModal" @click="closeFabMenu"
                class="backdrop fixed inset-0 top-[80px] bg-black/10 transition-opacity"
                :class="uiStore.isFabOpen ? 'block z-40' : 'hidden z-0'">
            </div>
        </div>
        <ModalInfoModal :show="uiStore.showInfoModal" :items="propertyStore.keptProperties" @close="closeInfoModal" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from '~/composables/useToast';

// 1. Store 임포트
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useMapStore } from '~/stores/map'; // 필요 시 사용

// 2. 컴포넌트 임포트 (동적 임포트 또는 일반 임포트)

// 3. Store 인스턴스
const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const mapStore = useMapStore();

// 4. 반응형 상태 (Store)
const { filteredProperties } = storeToRefs(propertyStore);
const { mapStyleOptions } = storeToRefs(mapStore);


// 5. DOM 참조
const wrapperElement = ref<HTMLElement | null>(null);
const fabElement = ref<HTMLElement | null>(null);

// 6. 라이프사이클
onMounted(async () => {
    // 초기 데이터 로드 (이미 app.vue에서 호출했다면 중복 호출 방지 로직이 store 내부에 있어야 함)
    await propertyStore.fetchInitialData();
});

// 7. 핸들러 함수
const listWidthClass = computed(() => {
    if (uiStore.isHiddenList) {
        // 리스트가 숨겨지면 맵이 전체 너비(w-full)를 차지합니다.
        return 'w-0 hidden';
    }
    // 리스트가 열려 있을 때: mapStyleOptions.MapRatio를 사용하여 비율을 계산합니다.
    const mapRatio = mapStyleOptions.value.MapRatio || 60; // 기본값 60% 가정
    const listRatio = 100 - mapRatio;

    // Tailwind CSS의 동적 클래스 바인딩을 위해 문자열로 반환
    return `w-[${listRatio}%] min-w-[40%]`;
});

// 8. Fab Menu
let oldPositionX: any;
let oldPositionY: any;
let startMouseX: number = 0;
let startMouseY: number = 0;
const DRAG_THRESHOLD = 5;

const move = (e: any) => {
    if (fabElement.value && fabElement.value.style && !fabElement.value.classList.contains("fab-active")) {
        let clientX, clientY;
        if (e.type === "touchmove") {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        if (Math.abs(clientX - startMouseX) < DRAG_THRESHOLD && Math.abs(clientY - startMouseY) < DRAG_THRESHOLD) {
            return;
        }

        fabElement.value.style.top = clientY + "px";
        fabElement.value.style.left = clientX + "px";
    }
};

const mouseDown = (e: any) => {
    // console.log("mouse down ");
    if (fabElement.value && fabElement.value.style) {

        oldPositionY = fabElement.value.style.top;
        oldPositionX = fabElement.value.style.left;
        if (e.type === "mousedown") {
            startMouseX = e.clientX;
            startMouseY = e.clientY;
            window.addEventListener("mousemove", move);
        } else {
            startMouseX = e.touches[0].clientX;
            startMouseY = e.touches[0].clientY;
            window.addEventListener("touchmove", move);
        }

        fabElement.value.style.transition = "none";
    }
};

const mouseUp = (e: any) => {
    // console.log("mouse up");
    if (e.type === "mouseup") {
        window.removeEventListener("mousemove", move);
    } else {
        window.removeEventListener("touchmove", move);
    }
    snapToSide(e);
    if (fabElement.value && fabElement.value.style) {
        fabElement.value.style.transition = "0.3s ease-in-out left";
    }

};

const snapToSide = (e: any) => {
    // console.log(e)
    const windowWidth = window.innerWidth;
    let currPositionX = 0;
    let currPositionY = 0;
    if (e.type === "touchend") {
        currPositionX = e.changedTouches[0].clientX;
        currPositionY = e.changedTouches[0].clientY;
    } else {
        currPositionX = e.clientX;
        currPositionY = e.clientY;
    }

    if (fabElement.value && fabElement.value.style && wrapperElement.value) {
        // console.log(currPositionX)
        // console.log(currPositionY)
        if (currPositionY < 50) {
            fabElement.value.style.top = 50 + "px";
        }
        if (currPositionY > wrapperElement.value.clientHeight - 50) {
            fabElement.value.style.top = wrapperElement.value.clientHeight - 50 + "px";
        }
        if (currPositionX < windowWidth / 2) {
            fabElement.value.style.left = 30 + "px";
            fabElement.value.classList.remove("right");
            fabElement.value.classList.add("left");
        } else {
            fabElement.value.style.left = windowWidth - 30 + "px";
            fabElement.value.classList.remove("left");
            fabElement.value.classList.add("right");
        }
    }
};

onMounted(() => {

    if (fabElement.value && fabElement.value.style) {
        // Initialize inline styles with computed values to ensure first click works
        const computedStyle = window.getComputedStyle(fabElement.value);
        fabElement.value.style.top = computedStyle.top;
        fabElement.value.style.left = computedStyle.left;

        if (fabElement.value) {
            fabElement.value.addEventListener("mousedown", mouseDown);
        }

        if (fabElement.value) {
            fabElement.value.addEventListener("mouseup", mouseUp);
        }

        if (fabElement.value) {
            fabElement.value.addEventListener("touchstart", mouseDown);
        }

        fabElement.value.addEventListener("touchend", mouseUp);

        fabElement.value.addEventListener("click", (_e: any) => {

            if (
                oldPositionY === fabElement.value?.style.top &&
                oldPositionX === fabElement.value?.style.left
            ) {
                // fabElement.value?.classList.toggle("fab-active"); // Removed this line
                uiStore.isFabOpen = !uiStore.isFabOpen;
            }
        });

    }

});

onBeforeUnmount(() => {
    fabElement.value?.removeEventListener("mousedown", mouseDown);
    fabElement.value?.removeEventListener("mouseup", mouseUp);
    fabElement.value?.removeEventListener("touchstart", mouseDown);
    fabElement.value?.removeEventListener("touchend", mouseUp);
    fabElement.value?.removeEventListener("click", (_e: any) => { });
});

// 9. Fab Elements


const { showToast } = useToast();

const openInfoModal = () => {
    // console.log(propertyStore.keptPropertyIds)
    if (propertyStore.keptPropertyIds.length > 0) {
        uiStore.showInfoModal = true;
    } else {
        showToast("There are no properties selected.", 'warning');
    }
};

const closeInfoModal = () => {
    uiStore.showInfoModal = false;
    uiStore.isFabOpen = false;
};

const closeFabMenu = () => {
    uiStore.isFabOpen = false;
    uiStore.showInfoModal = false;
};

const resetUserSelection = () => {
    //console.log("reset");
    propertyStore.resetFilter()
    propertyStore.keptPropertyIds = [];
    propertyStore.filteredPropertyIds = [];
    propertyStore.filteredProperties = propertyStore.initialProperties;
    //mapStore.filteredMapInfos = mapStore.allMapInfos;
};


// 10. EXCEL

const onDownloadExcel = async () => {
}

</script>

<style scoped>
/* ------------------------------------------------ */
/* --- FAB (Floating Action Button) CSS --- */
/* ------------------------------------------------ */

.backdrop {
    display: hidden;
    position: absolute;
    top: 80px;
    right: 0px;
    width: 100%;
    height: calc(100% - 80px);
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(10px);
}

.floating-snap-btn-wrapper {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 60%;
    left: 30px;
    /* bottom: calc(3% + 55px);
right: 0px; */
    width: 50px;
    height: 50px;
    border-radius: 50%;
    z-index: 50;
}

.floating-snap-btn-wrapper .fab-btn {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    /* background-color: #003F2D; */
    color: white;
    z-index: 100;
    box-shadow: 0px 2px 17px -1px rgba(0, 0, 0, 0.3);
}

.floating-snap-btn-wrapper ul {
    position: relative;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.floating-snap-btn-wrapper ul li {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    list-style-type: none;
    transition: 0.4s;
    transition-property: top, left;
    border-radius: 50%;
}

.floating-snap-btn-wrapper.fab-active li:hover {
    background-color: #17e88f;
    transform: scale(1.1);
}

.floating-snap-btn-wrapper.fab-active.left li:nth-child(1) {
    top: 0%;
    left: 450%;
    transition-delay: 0s;
}

.floating-snap-btn-wrapper.fab-active.left li:nth-child(2) {
    top: 0%;
    left: 300%;
    transition-delay: 0.2s;
}

.floating-snap-btn-wrapper.fab-active.left li:nth-child(3) {
    top: 0%;
    left: 150%;
    transition-delay: 0.4s;
}

.floating-snap-btn-wrapper.fab-active.right li:nth-child(1) {
    top: 0%;
    left: -300%;
    transition-delay: 0s;
}

.floating-snap-btn-wrapper.fab-active.right li:nth-child(2) {
    top: 0%;
    left: -200%;
    transition-delay: 0.2s;
}

.floating-snap-btn-wrapper.fab-active.right li:nth-child(3) {
    top: 0%;
    left: -100%;
    transition-delay: 0.4s;
}

.fab-menu-li {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1px;
}



.fab-menu-li label {
    font-size: 8px;
    font-weight: 600;
    color: gray;
}

.fab-menu-li:hover label {
    color: black;
}

.fab-menu-icon {
    color: gray;
    font-size: 18px;
}

.fab-menu-li:hover .fab-menu-icon {
    color: black;
}


.detail-card-wrapper {
    width: 100%;
    height: 100%;
}

.detail-card-outer {
    width: 100%;
    height: 100%;
}

.detail-card-inner {
    width: 100%;
    height: 100%;
}

.detail-card-contents {
    width: 100%;
    height: 100%;
}

.modalCloseButton {
    position: absolute;
    top: 165px;
    right: 70px;
    z-index: 100;
}

.bulletList {
    list-style: none;
    margin: 0;
    padding: 0;
    line-height: 2;
}
</style>
