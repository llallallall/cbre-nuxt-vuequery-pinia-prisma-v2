<template>
        <div class="group w-full h-full relative select-none"
                :class="dataStore.keptAssetIds.includes(item.propertyId) ? 'bg-primary/10 border border-primary/25' : 'bg-white'">
                <!-- 카드 상단 -->
                <div class="upper flex w-full relative"
                        :class="menuStore.isGrid ? 'flex-col  h-[520px] 3xl:h-[410px]' : 'flex-row h-[260px]'">

                        <div class="left overflow-hidden relative"
                                :class="menuStore.isGrid ? 'w-full h-[260px] 3xl:h-[150px] ' : 'flex h-[260px] w-1/2 '">
                                <img :src="item.mainImageUrl && (item.mainImageUrl+'').trim().length > 1 ? item.mainImageUrl : '/images/placeholder.jpg'"
                                        class="object-cover w-full h-full group-hover:scale-125 transition-all" />
                                        
                        </div>
                        
 
                        <div class="right card-info  flex flex-col  h-[260px] relative pt-2 pl-2 pr-12"
                                :class="menuStore.isGrid ? 'w-full ' : 'w-1/2'">
                                <div class="peer title font-notoSansBold truncate overflow-hidden mb-2
                                hover:underline"
                                        @click="openDetail(item.propertyId.toString(), Number(item.location.latitude), Number(item.location.longitude))">
                                        {{
                                                item?.propertyName }}</div>

                                        <div v-if="item.location.addressProvince && item.location.addressProvince.length > 0" class="address 
                                                        font-barlow text-gray-400 w-full 
                                                        flex items-center px-0">
                                                <div class="bg-[#528184] w-[4px] h-[4px] rounded-full overflow-hidden mr-[4px]">
                                                </div>
                                                <div class="truncate overflow-hidden relative">
                                                        {{ item.location.addressProvince }} <span  v-if="item.location.addressCity && item.location.addressCity.length > 0">/ {{ item.location_address_city }} </span>
                                                </div>

                                        </div>

                                        <div v-if="item.location.addressFull && item.location.addressFull.length > 0" class="address font-barlow text-gray-600 w-full  flex items-center px-0 ">
                                                <div class="bg-[#528184] w-[4px] h-[4px] rounded-full overflow-hidden mr-[4px]">
                                                </div>
                                                <div class="truncate overflow-hidden relative">

                                                        {{
                                                                item.location.addressFull }}</div>
                                        </div>

                                        

                                <div class="flex-1 more-info flex flex-col gap-y-2 font-financier text-sm mt-2">

                                        <ListItemInfo :item="item" />

                                </div>

                                <div class="badges flex justify-start items-end gap-2 mt-2 pb-1 h-[30px] ">
                                        <div class="border border-primary/25 bg-primary/25 text-white text-xs px-2  rounded-md">
                                                {{ idx }}
                                        </div>
                                        <!-- <div class="border border-gray-400 text-gray-400 text-xs px-2  rounded-md">
                                               {{ item.property_id }}
                                        </div> -->
                                </div>
                        </div>
                </div>
                <!-- 카드 하단 -->
                <!-- <div class="lower flex w-full h-[66px]  py-2 pl-15">
                        <div class="addresses flex flex-col w-full text-base relative">

                                <div v-if="item.location_address_full && item.location_address_full.length > 0" class="address 
                                font-barlow text-gray-600 w-full 
                                flex items-center px-2 ">
                                        <div class="bg-[#528184] w-[4px] h-[4px] rounded-full overflow-hidden mx-[4px]">
                                        </div>
                                        <div class="truncate overflow-hidden relative">

                                                {{
                                                        item.location_address_full }}</div>
                                </div>

                                <div v-if="item.addrFullJibun && item.addrFullJibun.length > 0" class="address 
                                font-barlow text-gray-400 w-full 
                                flex items-center px-2">
                                        <div class="bg-[#528184] w-[4px] h-[4px] rounded-full overflow-hidden mx-[4px]">
                                        </div>
                                        <div class="truncate overflow-hidden relative">
                                                {{ item.addrFullJibun }}
                                        </div>

                                </div>

                        </div>
                </div> -->
                <!-- 우측 버튼 -->
                <div :class="menuStore.isGrid ? 'right-[10px] top-[270px] 3xl:top-[160px] ' : 'top-4 right-3'"
                        class="actions absolute  shrink-0 w-[50px] flex flex-col items-end gap-3 font-bold font-spaceMonoBold backdrop-shadow-xl ">
                        <div class="grade w-[30px] h-[30px] bg-primary rounded-full 
                        flex justify-center items-center text-white shadow-md hover:scale-110">
                                {{ item.profitability.grade }}
                        </div>
                        <div @click="mapStore.setPinCoordinate(Number(item.location.latitude), Number(item.location.longitude))"
                                class="map-marker w-[30px] h-[30px] flex justify-center items-center text-white  bg-primary rounded-full shadow-md hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="24px"
                                        fill="currentColor">
                                        <path d="M0 0h24v24H0z" fill="none" />
                                        <path
                                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                        </div>
                        <div @click="keepAssets(item.propertyId)"
                                class="asset-keep w-[30px] h-[30px] bg-primary flex justify-center items-center  rounded-full shadow-md hover:scale-110"
                                :class="dataStore.keptAssetIds.includes(item.propertyId) ? 'text-accent' : 'text-white'">
                                <svg x="0px" y="0px" width="16px" height="12px" fill="currentColor"
                                        viewBox="0 0 122.88 116.864">
                                        <g>
                                                <polygon fill-rule="evenodd" clip-rule="evenodd"
                                                        points="61.44,0 78.351,41.326 122.88,44.638 88.803,73.491 99.412,116.864 61.44,93.371 23.468,116.864 34.078,73.491 0,44.638 44.529,41.326 61.44,0" />
                                        </g>
                                </svg>
                        </div>
                        <div v-if="item.transactionInfo.totalTransactions > 0"
                                class="lease w-[30px] h-[30px] bg-primary/10 rounded-full shadow-md hover:scale-110 relative">
                                <div class="text-center text-primary/75 translate-y-[2px]">{{ item.transactionInfo.totalTransactions }}
                                </div>
                                <div
                                        class="border border-primary/25 px-1 scale-50 rounded-[5px] font-spaceMono absolute bottom-0 translate-y-[10px] left-[50%] -translate-x-[50%]">
                                        Sale</div>
                        </div>
                        <div v-if="item.leaseInfo.totalLeasesActual > 0"
                                class="transaction w-[30px] h-[30px] bg-primary/10 rounded-full shadow-md hover:scale-110 relative">
                                <div class="text-center text-primary/75 translate-y-[2px]">{{ item.leaseInfo.totalLeasesActual }}</div>
                                <div
                                        class="border border-primary/25 px-1 scale-50 rounded-[5px] font-spaceMono absolute bottom-0 translate-y-[10px] left-[50%] -translate-x-[50%]">
                                        Lease</div>
                        </div>
                </div>
                <!-- 상세 카드  -->

                <!-- <TransitionRoot appear :show="menuStore.isDetailModalOpened" as="template">
                        <Dialog as="div" class="detail-card-wrapper relative  overflow-hidden">
                                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                                        enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100"
                                        leave-to="opacity-0">
                                        <div @close="closeDetailModal"
                                                class="detail-card-background fixed inset-0  bg-black bg-opacity-5 backdrop-blur-[2px] hover:backdrop-blur-none" />
                                </TransitionChild>

                                <div class="detail-card-outer fixed inset-0 overflow-auto ">

                                        <div class="detail-card-inner relative flex items-center justify-center text-center">
                                                <div class="modalCloseButton">
                                                        <button type="button"
                                                                class="inline-flex justify-center items-center rounded-md px-2 text-sm font-medium text-primary hover:bg-primary/10  
                                                                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                @click="closeDetailModal">
                                                                <IconPlus class="rotate-45 w-[14px]" />
                                                                Close
                                                        </button>
                                                </div>

                                                <TransitionChild as="template" enter="duration-300 ease-out"
                                                        enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
                                                        leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                                                        leave-to="opacity-0 scale-95">


                                                        <DialogPanel class="detail-card-contents w-full max-w-[calc(100%-100px)] 
                                                                max-h-[calc(100%-200px)] 
                                                                p-6
                                                                mt-[80px]
                                                                overflow-y-scroll 
                                                                bg-white 
                                                                text-left align-middle 
                                                         
                                                                transform transition-all 
                                                                relative">

                                                                <div :ref="el => { menuStore.detailCardPrintAreaRef[item.propertyId] = el }"
                                                                        class="w-full p-0 m-0 relative">

                                                                        <DialogTitle as="h3"
                                                                                class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6 text-primary">
                                                                                {{ item.propertyName }}

                                                                        </DialogTitle>

                                                                        <div
                                                                                class="mt-6 flex gap-5 relative flex-col lg:flex-row">

                                                                                <div class="w-full lg:w-1/2 flex flex-col">

                                                                                        <ActionSlide :item="item" />
                                                                                </div>
                                                                                <div
                                                                                        class="w-full lg:w-1/2 h-full flex flex-col justify-start">
                                                                                        <div
                                                                                                class="remarks -mt-2 border-b border-gray-200 pb-2">

                                                                                                <Remarks :item="item" />
                                                                                        </div>
                                                                                        <div
                                                                                                class="highlights mt-4 border-0 border-gray-200 pb-0">
                                                                                                <Highlight :item="item" />
                                                                                        </div>


                                                                                </div>
                                                                        </div>



                                                                        <div v-if="item.transaction_info && item.transaction_info.total > 0"
                                                                                class="sales relative mt-4 border-b border-gray-200 pb-10">

                                                                                <Sales :info="item.transaction_info" />


                                                                        </div>
                                                                        <pre>{{ item.lease_info }}</pre>
                                                                        <div v-if="item.lease_info && item.lease_info.actualCnt > 0"
                                                                                class="lease-actual relative mt-4 border-b border-gray-200 pb-10">


                                                                                <LeaseActual :info="item.lease_info" />


                                                                        </div>
                                                                        <div v-if="item.lease_info && item.lease_info.askingCnt > 0"
                                                                                class="lease-asking relative mt-4 border-b border-gray-200 pb-10">

                                                                                <LeaseAsking :info="item.lease_info" />


                                                                        </div>

                                                                        <div
                                                                                class="location mt-4 border-0 border-gray-200 relative">
                                                                                <Location :item="item" />
                                                                        </div>

                                                                </div>
                                                        </DialogPanel>

                                                </TransitionChild>

                                        </div>
                                </div>
                        </Dialog>
                </TransitionRoot> -->
        </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMenuStore } from '~/stores/menu';
import { useMapStore } from '~/stores/map';
import { useDataStore } from '~/stores/data';
const menuStore = useMenuStore()
const dataStore = useDataStore()
const mapStore = useMapStore()
const { isDetailModalOpened, googleMapCenter } = storeToRefs(useMenuStore());
const { showMiniMap, keepStateMiniMap, } = storeToRefs(useMapStore());
const { keptAssetIds, currentAssetId } = storeToRefs(useDataStore());

const { item, idx } = defineProps({
        item: {
                required: true,
                type: Object
        },
        idx: {
                required: true,
                type: Number
        }
})

const keepAssets = (id: string) => {
        let tempState = new Array()
        tempState.push(...dataStore.keptAssetIds)
        //기존 클릭 되었었는지 확인
        const found = tempState.find((el: any) => el === id)
        if (found) {
                tempState = tempState.filter((el: any) => { if (el !== id) return el })
        } else {
                tempState.push(id)
        }
        dataStore.keptAssetIds = tempState
}

const router = useRouter();


function openDetail(id: string, lat: number, lng: number) {

        if (dataStore.setAssetNav(id)) {
                menuStore.googleMapCenter.lat = lng
                menuStore.googleMapCenter.lng = lat
                //router.push({ path: "/asset/" + id });
                let href = "/asset/" + id
                
                Object.assign(document.createElement('a'), {
                target: '_blank',
                rel: 'noopener noreferrer',
                href: href,
                }).click();
        }
        return false

}


</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        margin: 0 0 1em;
        padding: 0 0 0 20px;
        line-height: 2;
}



.modalCloseButton {
        position: absolute;
        top: 150px;
        right: 60px;
        z-index: 100;
}

.detail-card-wrapper {
        width: 100%;
        height: 100%;
}

.detail-card-background {
        z-index: 10;
}

.detail-card-outer {
        width: 100%;
        height: 100%;
        z-index: 30;

}

.detail-card-inner {
        width: 100%;
        height: 100%;
}

.detail-card-contents {
        width: 100%;
        height: 100%;
}
</style>