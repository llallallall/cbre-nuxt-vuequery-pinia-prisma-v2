<template>
        <div class="w-screen h-screen">
                <div ref="wrapperElement" class="relative flex w-full  pt-[80px]">
                        <div :class="`flex-1 h-[calc(100vh-80px)]  overflow-hidden flex`">
                                <MapContainer />
                        </div>
                        <div
                                :class="`flex h-[calc(100vh-80px)]  ${menuStore.isHidden ? 'w-full' : 'w-[' + (100 - mapStore.mapStyleOptions.MapRatio * 1) + '%] min-w-[40%]'} `">
                                <ListCard :data="filteredAssets" :totalCount="filteredAssets.length" :itemsPerRender="6"
                                        containerClasses="bg-[#f4f7f7] p-4" defaultLoadingColor="#222" />
                        </div>
                        <div ref="fabElement" class="floating-snap-btn-wrapper drop-shadow-xl select-none">
                                <!-- BEGIN :: Floating Button -->
                                <div class="fab-btn shadow-md flex justify-center"
                                        :class="menuStore.isFabOpen ? ' bg-primary/25 delay-300' : ' bg-primary '">
                                        <IconPlus :class="menuStore.isFabOpen ? 'rotate-45 ' : 'rotate-0 '"
                                                class="transition ease-in-out duration-100 delay-100" />
                                </div>
                                <!-- END :: Floating Button -->
                                <!-- BEGIN :: Expand Section -->
                                <ul>
                                        <li class="flex justify-center items-center pl-1 bg-white relative">
                                                <IconTrash
                                                        class="relative w-[20px] h-[20px] -translate-x-[1px] translate-y-[3px]"
                                                        @click="resetUserSelection" />
                                                <div class="badge absolute top-[7px] left-[12px] text-[6px]"
                                                        :class="mapStore.showMiniMap ? 'text-primary' : 'text-gray-400'">
                                                        Reset
                                                </div>
                                        </li>
                                        <li class="flex justify-center items-center pl-1 relative"
                                                :class="mapStore.showMiniMap ? 'bg-primary/10' : 'bg-white'">
                                                <IconMap class="relative w-[24px] h-[24px] -translate-x-[2px] translate-y-[3px]"
                                                        :class="mapStore.showMiniMap ? 'text-primary' : 'text-gray-400'"
                                                        @click="mapStore.showMiniMap = !mapStore.showMiniMap" />
                                                <div class="badge absolute top-[7px] left-[15px] text-[6px]"
                                                        :class="mapStore.showMiniMap ? 'text-primary' : 'text-gray-400'">
                                                        Mini
                                                </div>
                                        </li>
                                        <li class="flex justify-center items-center bg-white relative">
                                                <IconSquare
                                                        class="relative w-[16px] h-[16px] -translate-x-[0px] translate-y-[3px] text-primary"
                                                        @click="openInfoModal" />
                                                <div class="badge absolute top-[7px] left-[15px] text-[6px] text-primary">
                                                        Info
                                                </div>
                                        </li>
                                </ul>
                                <!-- END :: Expand Section -->
                        </div>
                </div>
                <TransitionRoot appear :show="showInfoModal" as="template">
                        <Dialog as="div" @close="closeInfoModal" class="detail-card-wrapper relative z-10 overflow-hidden">
                                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                                        enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100"
                                        leave-to="opacity-0">
                                        <div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
                                </TransitionChild>

                                <div class="detail-card-outer fixed inset-0 overflow-auto">
                                        <div class="detail-card-inner relative flex items-center justify-center text-center">
                                                <div class="modalCloseButton">
                                                        <button type="button"
                                                                class="inline-flex justify-center items-center rounded-md px-2 text-sm font-medium text-primary hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                @click="closeInfoModal">
                                                                <IconPlus class="rotate-45 w-[14px]" />
                                                                Close
                                                        </button>
                                                </div>
                                                <div class="flex w-full h-full items-center justify-center p-4 text-center">
                                                        <TransitionChild as="template" enter="duration-300 ease-out"
                                                                enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
                                                                leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                                                                leave-to="opacity-0 scale-95">
                                                                <DialogPanel
                                                                        class="detail-card-contents w-full max-w-[calc(100%-100px)] max-h-[calc(100%-200px)] p-6 mt-[80px] overflow-y-scroll bg-white text-left align-middle shadow-xl transform transition-all relative">
                                                                        <DialogTitle as="h3"
                                                                                class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6 text-primary">
                                                                                <div class="flex items-end">
                                                                                        <div>Selected Assets Information</div>

                                                                                        <div class="max-w-[200px] flex justify-center items-center relative p-0 pb-2 gap-0 ml-10"
                                                                                                @click="onDownloadExcel()">
                                                                                                <div class="relative flex-1 flex justify-center items-center h-[28px]
                                  border-2 rounded-xl 
                                  py-1 px-2 border-primary bg-[#e6eaea]">
                                                                                                        <Icon name="vscode-icons:file-type-excel2"
                                                                                                                class=" w-[18px] h-[18px] " />
                                                                                                        <span
                                                                                                                class="ml-1 font-calibreLight text-sm">Download
                                                                                                                Excel</span>
                                                                                                </div>
                                                                                        </div>
                                                                                        <div
                                                                                                class="max-w-[130px] flex justify-center items-center relative p-0 pb-2 gap-0 ml-5">
                                                                                                <span
                                                                                                        class="mr-1 font-calibreLight text-sm">All
                                                                                                        Datas</span>
                                                                                                <Switch v-model="selectAll"
                                                                                                        :class="selectAll ? 'bg-teal-900' : 'bg-gray-300'"
                                                                                                        class="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                                                        <span aria-hidden="true"
                                                                                                                :class="selectAll ? 'translate-x-5' : 'translate-x-0'"
                                                                                                                class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                                                                </Switch>
                                                                                        </div>
                                                                                        <div
                                                                                                class="max-w-[200px] flex justify-center items-center relative p-0 pb-2 gap-0 ml-5">
                                                                                                <span
                                                                                                        class="mr-1 font-calibreLight text-sm">All
                                                                                                        Transactions</span>
                                                                                                <Switch v-model="selectTransactions"
                                                                                                        :class="selectTransactions ? 'bg-teal-900' : 'bg-gray-300'"
                                                                                                        class="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                                                        <span aria-hidden="true"
                                                                                                                :class="selectTransactions ? 'translate-x-5' : 'translate-x-0'"
                                                                                                                class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                                                                </Switch>
                                                                                        </div>
                                                                                        <div
                                                                                                class="max-w-[130px] flex justify-center items-center relative p-0 pb-2 gap-0 ml-5">
                                                                                                <span
                                                                                                        class="mr-1 font-calibreLight text-sm">All
                                                                                                        Leases</span>
                                                                                                <Switch v-model="selectLeases"
                                                                                                        :class="selectLeases ? 'bg-teal-900' : 'bg-gray-300'"
                                                                                                        class="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                                                        <span aria-hidden="true"
                                                                                                                :class="selectLeases ? 'translate-x-5' : 'translate-x-0'"
                                                                                                                class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                                                                </Switch>
                                                                                        </div>
                                                                                </div>
                                                                        </DialogTitle>
                                                                        <div class="mt-2">
                                                                                <p class="text-sm text-gray-500">
                                                                                        You can check and change the selection
                                                                                        status of transaction details
                                                                                        for each asset.
                                                                                </p>
                                                                        </div>

                                                                        <div
                                                                                class="mt-4 grid grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4">
                                                                                <div v-for="(item, index) in selectedAssets"
                                                                                        class="border border-primary/10 p-4 shadow-md">
                                                                                        <div
                                                                                                class="font-financierMedium text-2xl text-primary pb-2 mb-2 border-b border-gray-200">
                                                                                                {{ item.propertyName }}
                                                                                        </div>

                                                                                        <div
                                                                                                class="font-calibreLight text-lg text-primary pb-2 mb-2 border-b border-gray-200 flex justify-between">
                                                                                                <div v-if="item.profitability.grade">
                                                                                                        <span
                                                                                                                class="font-calibre">Grade</span><br />{{
                                                                                                                        item.profitability.grade }}
                                                                                                </div>
                                                                                                <div v-if="item.general.sector">
                                                                                                        <span
                                                                                                                class="font-calibre">Sector</span><br />{{
                                                                                                                        item.general.sector.name }}
                                                                                                </div>
                                                                                                <div v-if="item.general.subSector">
                                                                                                        <span
                                                                                                                class="font-calibre">SubSector</span><br />{{
                                                                                                                        item.general.subSector.name
                                                                                                                }}
                                                                                                </div>
                                                                                        </div>
                                                                                        <div
                                                                                                class="flex justify-start items-center gap-3 select-none">
                                                                                                <div v-for="preview in item.photoList"
                                                                                                        class="w-[120px] h-[90px] border-white/25 border-1 border-gray-400 hover:scale-125 transition-all">
                                                                                                        <img :src=preview.fileUrl class="object-cover w-full h-full" />
                                                                                                </div>
                                                                                        </div>
                                                                                        <ul :key="index"
                                                                                                class="bulletList font-calibreLight text-lg text-primary grid grid-cols-2 gap-5">
                                                                                                <li class="flex flex-col" v-if="item.transactionInfo.transactions &&
                                                                                                        item.transactionInfo.totalTransactions > 0
                                                                                                        ">
                                                                                                        <div
                                                                                                                class="whitespace-nowrap mr-4 font-calibre">
                                                                                                                Sales</div>
                                                                                                        <div
                                                                                                                class="flex-1 flex flex-col">
                                                                                                                <div v-for="(el, idx) in item.transactionInfo.transactions"
                                                                                                                        class="flex flex-row items-center justify-between">
                                                                                                                        <span>{{
                                                                                                                                el.transactionIdx
                                                                                                                                +
                                                                                                                                ".&nbsp;"
                                                                                                                                +
                                                                                                                                el.transactionYear
                                                                                                                                +
                                                                                                                                "/"
                                                                                                                                +
                                                                                                                                el.transactionQuarter
                                                                                                                        }}&nbsp;:&nbsp;
                                                                                                                        </span>
                                                                                                                        <div
                                                                                                                                class="flex items-center">
                                                                                                                                <Switch v-model="el.value"
                                                                                                                                        @click="setTransactions(item.propertyId + '-' + el.transactionIdx)"
                                                                                                                                        :key="idx"
                                                                                                                                        :class="el.value ? 'bg-teal-900' : 'bg-gray-300'"
                                                                                                                                        class="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                                                                                        <span aria-hidden="true"
                                                                                                                                                :class="el.value ? 'translate-x-5' : 'translate-x-0'"
                                                                                                                                                class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                                                                                                </Switch>
                                                                                                                        </div>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </li>

                                                                                                <li v-if="item.leaseInfo.leases && item.leaseInfo.totalLeasesActual > 0"
                                                                                                        class="flex flex-col">
                                                                                                        <div
                                                                                                                class="whitespace-nowrap mr-4 font-calibre">
                                                                                                                Leases</div>
                                                                                                        <div
                                                                                                                class="flex-1 flex flex-col">
                                                                                                                <div v-for="(el, idx) in item.leaseInfo.leases"
                                                                                                                        class="flex flex-row items-center justify-between">
                                                                                                                        <span>{{
                                                                                                                                el.leaseIdx
                                                                                                                                +
                                                                                                                                ".&nbsp;"
                                                                                                                                +
                                                                                                                                el.actualLeaseStartDate.substr(0,
                                                                                                                                        4)
                                                                                                                                +
                                                                                                                                "/"
                                                                                                                                +
                                                                                                                                el.actualLeaseStartDate.substr(5,
                                                                                                                                        2)
                                                                                                                        }}&nbsp;:&nbsp;
                                                                                                                        </span>
                                                                                                                        <div
                                                                                                                                class="flex items-center">
                                                                                                                                <Switch v-model="el.value"
                                                                                                                                        @click="setLeases(item.propertyId + '-' + el.leaseIdx)"
                                                                                                                                        :key="idx"
                                                                                                                                        :class="el.value ? 'bg-teal-900' : 'bg-gray-300'"
                                                                                                                                        class="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                                                                                        <span aria-hidden="true"
                                                                                                                                                :class="el.value ? 'translate-x-5' : 'translate-x-0'"
                                                                                                                                                class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                                                                                                </Switch>
                                                                                                                        </div>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </li>
                                                                                        </ul>
                                                                                </div>
                                                                        </div>
                                                                </DialogPanel>
                                                        </TransitionChild>
                                                </div>
                                        </div>
                                </div>
                        </Dialog>
                </TransitionRoot>
                <div class="backdrop" :class="menuStore.isFabOpen || menuStore.showInfoModal ? 'block z-10' : 'hidden z-0'
                        "></div>
        </div>
</template>

<script lang="ts" setup>
definePageMeta({
        middleware: "auth"
});

import { storeToRefs } from "pinia";
import { useMenuStore } from "~/stores/menu";
import { useDataStore } from "~/stores/data";
import { useMapStore } from "~/stores/map";

import { useFilterStore } from "~/stores/filter";
const menuStore = useMenuStore();
const dataStore = useDataStore();
const mapStore = useMapStore();

const filterStore = useFilterStore();

import { useUserStore } from '~/stores/user';
const userStore = useUserStore();

onMounted(async ()=>{
        const { getSession } = useAuth()
        await getSession().then((currentUser : any )=>{
                // alert(currentUser.user.id)
                // console.log(currentUser)
                userStore.getUserProfile(currentUser as any)
        }) as any
        

})


const {
        showMiniMap,
} = storeToRefs(useMapStore());

const {
        isHidden,
        isFabOpen,
        showInfoModal,
} = storeToRefs(useMenuStore());

const {
        keptAssetIds,
        filteredAssets,
} = storeToRefs(useDataStore());






import { ref, onMounted, onBeforeUnmount, watch } from "vue";
const wrapperElement = ref(null) as any;
const fabElement = ref(null) as any;

const selectedAssets = ref([]) as any;
const selectedAssetsTransactions = ref([] as string[]);
const selectedAssetsLeases = ref([] as string[]);

const setTransactions = (idx: string) => {

        let tempState = new Array()
        tempState.push(...selectedAssetsTransactions.value)
        const found = tempState.find((el: any) => el === idx)
        if (found) {
                tempState = tempState.filter((el: any) => { if (el !== idx) return el })
        } else {
                tempState.push(idx)
        }
        selectedAssetsTransactions.value = tempState
        //console.log(selectedAssetsTransactions.value)
}

const setLeases = (idx: string) => {

        let tempState = new Array()
        tempState.push(...selectedAssetsLeases.value)
        const found = tempState.find((el: any) => el === idx)
        if (found) {
                tempState = tempState.filter((el: any) => { if (el !== idx) return el })
        } else {
                tempState.push(idx)
        }
        selectedAssetsLeases.value = tempState
        //console.log(selectedAssetsLeases.value)
}

const openInfoModal = () => {
        if (dataStore.keptAssetIds.length > 0) {
                selectedAssets.value = dataStore.filteredAssets.filter((el: any) => {
                        if (dataStore.keptAssetIds.includes(el.propertyId as string)) return el;
                });
                menuStore.showInfoModal = true;
        } else {
                alert("There are no assets selected.");
        }
};

const closeInfoModal = () => {
        menuStore.showInfoModal = false;
};

const resetUserSelection = () => {
        //console.log("reset");
        filterStore.$reset()
        dataStore.keptAssetIds = [];
        dataStore.filteredAssetsIds = [];
        dataStore.filteredAssets = dataStore.initialAllAssets;
        dataStore.filteredMapInfos = dataStore.allMapInfos;
};

import { makeExcelFile } from '@/composables/useExcel.js';
const selectAll = ref(false)
const selectTransactions = ref(false)
const selectLeases = ref(false)
const onDownloadExcel = async () => {

        // loader.value = true
        // loadingMessage.value = 'Creating the excel file process is in progress. Please wait a moment...'
        //console.log(selectAll.value)
        if (selectAll.value) {
                makeExcelFile(null, null, null, null, null, selectedAssets.value);
        } else {

                // 선택된 자산 체크 
                if (selectedAssets.value.length > 0) {

                        makeExcelFile(selectTransactions.value, selectLeases.value, selectedAssetsTransactions.value, selectedAssetsLeases.value, selectedAssetsLeases.value, selectedAssets.value);


                } else {

                        alert('There are no assets selected')


                }
        }
        // setTimeout(() => {
        //   loader.value = false
        // }, 3000)

}


import {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogPanel,
        DialogTitle,
} from "@headlessui/vue";
import { Switch } from "@headlessui/vue";

let oldPositionX: any;
let oldPositionY: any;

const move = (e: any) => {
        if (!fabElement.value.classList.contains("fab-active")) {
                if (e.type === "touchmove") {
                        fabElement.value.style.top = e.touches[0].clientY + "px";
                        fabElement.value.style.left = e.touches[0].clientX + "px";
                } else {
                        fabElement.value.style.top = e.clientY + "px";
                        fabElement.value.style.left = e.clientX + "px";
                }
        }
};

const mouseDown = (e: any) => {
        // console.log("mouse down ");
        oldPositionY = fabElement.value.style.top;
        oldPositionX = fabElement.value.style.left;
        if (e.type === "mousedown") {
                window.addEventListener("mousemove", move);
        } else {
                window.addEventListener("touchmove", move);
        }

        fabElement.value.style.transition = "none";
};

const mouseUp = (e: any) => {
        // console.log("mouse up");
        if (e.type === "mouseup") {
                window.removeEventListener("mousemove", move);
        } else {
                window.removeEventListener("touchmove", move);
        }
        snapToSide(e);
        fabElement.value.style.transition = "0.3s ease-in-out left";
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

        // console.log(currPositionX)
        // console.log(currPositionY)
        if (currPositionY < 50) {
                fabElement.style.top = 50 + "px";
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
};


onMounted(() => {


        fabElement.value.addEventListener("mousedown", mouseDown);

        fabElement.value.addEventListener("mouseup", mouseUp);

        fabElement.value.addEventListener("touchstart", mouseDown);

        fabElement.value.addEventListener("touchend", mouseUp);

        fabElement.value.addEventListener("click", (_e: any) => {
                if (
                        oldPositionY === fabElement.value.style.top &&
                        oldPositionX === fabElement.value.style.left
                ) {
                        fabElement.value.classList.toggle("fab-active");
                        menuStore.isFabOpen = !menuStore.isFabOpen;
                }
        });
});

onBeforeUnmount(() => {
        fabElement.value.removeEventListener("mousedown", mouseDown);

        fabElement.value.removeEventListener("mouseup", mouseUp);

        fabElement.value.removeEventListener("touchstart", mouseDown);

        fabElement.value.removeEventListener("touchend", mouseUp);

        fabElement.value.removeEventListener("click", (_e: any) => { });
});
</script>

<style scoped>
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
        z-index: 30;
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
        z-index: 1000;
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
        transform: scale(0.95);
        transition: 0.5s;
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
