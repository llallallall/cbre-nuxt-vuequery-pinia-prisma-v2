<template>
        <div class="relative w-screen h-screen">
                <div class="h-[80px]">

                        <Head>
                                <Title>{{ item?.name || 'Asset Detail' }}</Title>
                                <Meta name="description" :content="item?.name || 'Asset Detail'" />
                                <Style type="text/css" children="body { background-color: green; }" />
                        </Head>
                </div>

                <div
                        class="detail-card-contents w-full h-full p-6 pb-[100px] overflow-y-scroll bg-white text-left align-middle transform transition-all relative">

                        <div ref="detailCardPrintAreaRef" class="w-full p-0 m-0 relative overflow-y-scroll">

                                <div
                                        class="detail-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6 text-primary">
                                        {{ item?.name }}
                                </div>

                                <div class="mt-6 flex gap-5 relative flex-col lg:flex-row">
                                        <div class="w-full lg:w-1/2 flex flex-col">
                                                <AssetDetailActionSlide :item="(item as any)" />
                                        </div>
                                        <div class="w-full lg:w-1/2 h-full flex flex-col justify-start">
                                                <div class="remarks -mt-2 border-b border-gray-200 pb-2">
                                                        <AssetDetailGeneral :item="(item as any)" />
                                                </div>
                                                <div class="highlights mt-4 border-0 border-gray-200 pb-0">
                                                        <AssetDetailHistoryList :item="(item as any)" />
                                                </div>
                                        </div>
                                </div>

                                <div class="sales relative mt-4 border-b border-gray-200 pb-5" />

                                <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">
                                        <AssetDetailSizesAndMeasurements :item="(item as any)" />
                                </div>

                                <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">
                                        <AssetDetailFacility :item="(item as any)" />
                                </div>

                                <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">
                                        <AssetDetailParking :item="(item as any)" />
                                </div>

                                <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">
                                        <AssetDetailFloorPlanPhotos :item="(item as any)" />
                                </div>

                                <div class="sales relative mt-4 border-b border-gray-200 pb-10">
                                        <AssetDetailFloorDataTable :info="item?.floor" />
                                </div>

                                <div v-if="hasSales" class="sales relative mt-4 border-b border-gray-200 pb-10">
                                        <AssetDetailSales :info="item?.transaction" />
                                </div>

                                <div v-if="hasLeaseActual"
                                        class="lease-actual relative mt-4 border-b border-gray-200 pb-10">
                                        <AssetDetailLeaseActual :info="item?.transaction" />
                                </div>

                                <div v-if="hasLeaseAsking"
                                        class="lease-asking relative mt-4 border-b border-gray-200 pb-10">
                                        <AssetDetailLeaseAsking :info="item?.transaction" />
                                </div>

                                <div class="location mt-4 border-0 border-gray-200 relative">
                                        <AssetDetailLocation :item="(item as any)" />
                                </div>

                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
// 💡 1. 새로운 Store Import
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui'; // MenuStore 대체

definePageMeta({
        middleware: "auth",
        layout: 'page-layout',
});

const route = useRoute();

// 💡 2. Data Store -> Property Store 교체
const propertyStore = usePropertyStore();
// currentProperty 상태를 반응형으로 가져옵니다.
const { currentProperty: item } = storeToRefs(propertyStore);

// 💡 3. Menu Store -> UI Store 교체
const uiStore = useUiStore();
// printAreaRef 등 UI 관련 로직이 있다면 uiStore나 statusStore 사용

const detailCardPrintAreaRef = inject('detailCardPrintAreaRef');

// 💡 4. 데이터 로드 (Nuxt 3 Async Data 패턴)
// SSR과 클라이언트 사이드 네비게이션 모두에서 작동하도록 useAsyncData 또는 await 사용
// 페이지 진입 시 ID에 해당하는 자산 상세 정보를 서버에서 가져옵니다.
await useAsyncData('property-detail', async () => {
        if (route.params.id) {
                await propertyStore.fetchPropertyDetail(route.params.id as string);
        }
});

// 💡 5. Computed Properties for Template Logic (v-if 조건 처리를 위한 헬퍼)
// 새로운 PropertyType 구조에 맞춰 데이터 존재 여부를 확인합니다.

const hasSales = computed(() => {
        if (!item.value?.transaction) return false;
        return item.value.transaction.some(t => t.type === 'SALE');
});

const hasLeaseActual = computed(() => {
        if (!item.value?.transaction) return false;
        return item.value.transaction.some(t => t.type === 'LEASE' && t.lease?.leaseType === 'ACTUAL');
});

const hasLeaseAsking = computed(() => {
        if (!item.value?.transaction) return false;
        return item.value.transaction.some(t => t.type === 'LEASE' && t.lease?.leaseType === 'ASKING');
});

</script>

<style scoped></style>