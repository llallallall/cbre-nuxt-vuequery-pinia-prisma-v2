<template>
    <NuxtLayout name="page-layout">
        <ClientOnly>
            <div class="fixed w-full h-[calc(100%-80px)]">
                <div v-if="pending" class="w-full h-full flex flex-col justify-center items-center">
                    <div class="w-[100px] h-[30px] bg-gray-100 mb-1"></div>
                    <div class="w-[60px] h-[30px] bg-gray-100"></div>
                </div>

                <div v-else class="w-full h-full relative transform transition-all overflow-y-scroll">
                    <Head>
                        <Title>{{ item?.name || 'Property Detail' }}</Title>
                        <Meta name="description" :content="item?.name || 'Property Detail'" />
                    </Head>

                    <div ref="detailCardPrintAreaRef" class="relative w-full bg-white p-6 m-0 ">

                        <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6
                                text-primary">
                            {{ item?.name || 'Property Detail' }}
                        </div>

                        <div class="mt-6 flex gap-5 relative flex-col lg:flex-row">

                            <div class="w-full lg:w-1/2 flex flex-col">
                                <PropertyDetailActionSlide :location="item?.location" :images="item?.propertyImageFile"
                                    :brochure="item?.propertyBrochureFile" />
                            </div>
                            <div class="w-full lg:w-1/2 h-full flex flex-col justify-start">
                                <div class="remarks -mt-2 border-b border-gray-200 pb-2">
                                    <PropertyDetailGeneral :profitability="item?.profitability" :scale="item?.scale"
                                        :sector="item?.sector" :subsector="item?.subsector" :warehouse="item?.warehouse" />
                                </div>
                                <div class="highlights mt-4 border-0 border-gray-200 pb-0">
                                    <PropertyDetailHistoryList :history="item?.history" />
                                </div>
                            </div>
                        </div>

                        <div class="relative mt-4 border-b border-gray-200 pb-5" />

                        <div class="relative mt-4 border-b border-gray-200 pt-5 pb-10">
                            <PropertyDetailSizesAndMeasurements :scale="item?.scale" />
                        </div>

                        <div class="relative mt-4 border-b border-gray-200 pt-5 pb-10">
                            <PropertyDetailFacility :facility="item?.facility" />
                        </div>

                        <div class="relative mt-4 border-b border-gray-200 pt-5 pb-10">
                            <PropertyDetailParking :facility="item?.facility" />
                        </div>

                        <div class="relative mt-4 border-b border-gray-200 pt-5 pb-10">
                            <PropertyDetailFloorPlanPhotos :floorPlanFile="item?.floorPlanFile" />
                        </div>

                        <div class="relative mt-4 border-b border-gray-200 pb-10">
                            <PropertyDetailFloorsUsage :info="item?.floor" />
                        </div>

                        <div v-if="hasSales" class="relative mt-4 border-b border-gray-200 pb-10">
                            <PropertyDetailSales :transaction="item?.transaction" />
                        </div>

                        <div v-if="hasLeaseActual" class="relative mt-4 border-b border-gray-200 pb-10">
                            <PropertyDetailLeaseActual :transaction="item?.transaction" />
                        </div>

                        <div v-if="hasLeaseAsking" class="relative mt-4 border-b border-gray-200 pb-10">
                            <PropertyDetailLeaseAsking :transaction="item?.transaction" />
                        </div>

                        <div class="relative mt-4 border-0 border-gray-200">
                            <PropertyDetailLocation :location="item?.location" />
                        </div>

                    </div>
                </div>
            </div>
        </ClientOnly>
    </NuxtLayout>
</template>

<script setup lang="ts">
import PropertyDetailActionSlide from '~/components/property/detail/ActionSlide.vue';
import PropertyDetailLocation from '~/components/property/detail/Location.vue';
import PropertyDetailGeneral from '~/components/property/detail/General.vue';
import PropertyDetailFloorsUsage from '~/components/property/detail/FloorsUsage.vue';
import PropertyDetailSizesAndMeasurements from '~/components/property/detail/SizesAndMeasurements.vue';
import PropertyDetailHistoryList from '~/components/property/detail/HistoryList.vue';
import PropertyDetailFacility from '~/components/property/detail/Facility.vue';
import PropertyDetailParking from '~/components/property/detail/Parking.vue';
import PropertyDetailFloorPlanPhotos from '~/components/property/detail/FloorPlanPhotos.vue';
import PropertyDetailSales from '~/components/property/detail/Sales.vue';
import PropertyDetailLeaseActual from '~/components/property/detail/LeaseActual.vue';
import PropertyDetailLeaseAsking from '~/components/property/detail/LeaseAsking.vue';

import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { storeToRefs } from 'pinia';

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
const { data: propertyData, pending } = await useAsyncData(`property-detail-${route.params.id}+${Math.floor(Math.random() * 900) + 100}`, async () => {
    if (route.params.id) {
        await propertyStore.fetchPropertyDetail(route.params.id as string);
        return propertyStore.currentProperty;
    }
    return null;
}, {
    watch: [() => route.params.id]
});

// 💡 Hydration Fix: Ensure store is updated with hydrated data
watch(propertyData, (newVal) => {
    if (newVal) {
        propertyStore.currentProperty = newVal;
    }
}, { immediate: true });

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

<style scoped>


</style>