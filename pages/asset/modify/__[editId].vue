<template>
  <!-- 1. 데이터 로딩 중일 때 표시할 UI -->
  <div v-if="pending" class="flex items-center justify-center h-screen">
    <p class="text-2xl text-gray-500">Loading Asset Data...</p>
    <!-- 여기에 스피너 컴포넌트 등을 추가할 수 있습니다. -->
  </div>

  <!-- 2. 에러 발생 시 표시할 UI -->
  <div v-else-if="error" class="flex items-center justify-center h-screen">
    <p class="text-2xl text-red-500">Failed to load asset: {{ error.message }}</p>
  </div>

  <!-- 3. 데이터 로딩 성공 시 표시할 기존 UI -->

  <div v-else class="relative sm:px-0 px-10">
    <!-- <TabGroup manual :selectedIndex="selectedTab" @change="changeTab">
      <TabList
        class="fixed top-[80px] left-0 w-full space-x-6 bg-[#e6eaea] bg-opacity-75 py-2.5 px-10 backdrop-blur-sm z-10">
        <Tab v-for="(category, index ) in categories" as="template" :key="index" v-slot="{ selected }">
          <button :class="[
            'text-sm leading-5 text-primary',
            'focus:outline-none focus:ring-0 ',
            (selectedTab === index)
              ? 'border-b-2 border-primary '
              : 'border-b-2 hover:border-primary',
          ]">
            {{ category.name }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="w-full mt-10">
        <TabPanel class='w-full p-10'>
          <AssetRegisterGeneral :tabIndex="selectedTab" @next="changeTab" />
        </TabPanel>
        <TabPanel class='w-full p-10'>
          <AssetRegisterHistory :tabIndex="selectedTab" @next="changeTab" />
        </TabPanel>
        <TabPanel class='w-full p-10'>
          <AssetRegisterProfitability :tabIndex="selectedTab" @next="changeTab" />
        </TabPanel>
        <TabPanel class='w-full p-10'>
          <AssetRegisterLocation :tabIndex="selectedTab" @next="changeTab" />
        </TabPanel>
        <TabPanel class='w-full p-10'>
          <AssetRegisterAcccessibility :tabIndex="selectedTab" @next="changeTab" />
        </TabPanel>
        <TabPanel class='w-full p-10'>
          <AssetRegisterSizes :tabIndex="selectedTab" @next="changeTab" />
        </TabPanel>
        <TabPanel class='w-full p-10'>
          <AssetRegisterFacility :tabIndex="selectedTab" @next="changeTab" />
        </TabPanel>
        <TabPanel class='w-full p-10'>
          <AssetModifyFloor :tabIndex="selectedTab" @next="changeTab" />
        </TabPanel>
        <TabPanel class='w-full p-10'>
          <AssetModifyPhoto :tabIndex="selectedTab" @next="changeTab" />
        </TabPanel>
        <TabPanel class='w-full p-10'>
          <AssetModifyFile :tabIndex="selectedTab" @next="changeTab" />
        </TabPanel>
      </TabPanels>
    </TabGroup> -->
  </div>

</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { useRoute, showError, useAsyncData, useHead } from '#app';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
import { usePropertyStore } from '~/stores/property';
import { adminAssetMenuCategory } from '~/context/menu';
import type { CbreAsset } from '~/types/asset.type';

// --- 페이지 설정 ---
definePageMeta({
  middleware: "auth",
  layout: 'admin-layout',
});

// --- 데이터 로딩 및 상태 관리 ---
const route = useRoute();
const propertyStore = usePropertyStore();
const propertyId = route.params.editId as string;


// Nuxt의 useAsyncData를 사용하여 API로부터 직접 데이터 로드
const { data: asset, pending, error } = await useAsyncData<CbreAsset>(
  `asset-details-${propertyId}`, // 페이지마다 고유한 키를 부여
  () => $fetch(`/api/data/${propertyId}`), // 서버 API 엔드포인트 호출
  {
    server: false, // ✨ 서버에서는 실행하지 않고, 클라이언트에서만 실행
    // ✨ transform 함수: API 응답(data)을 받아 타입을 명시적으로 지정하고 반환합니다.
    transform: (data): CbreAsset => {
      // 이 시점에서 data는 API가 반환한 객체입니다.
      // 필요하다면 여기서 데이터 가공(예: 날짜 포맷 변경 등)을 할 수도 있습니다.
      // 지금은 타입만 지정해서 그대로 반환합니다.
      return data as CbreAsset;
    },
  }
);

// 데이터 로딩 실패 시 에러 페이지로 리디렉션
if (error.value) {
  // 500, 403 등 서버에서 발생한 에러 처리
  throw showError({ statusCode: 500, statusMessage: 'Could not fetch asset details.' });
}
if (!asset.value) {
  // API가 데이터를 찾지 못해 null을 반환한 경우 (404 Not Found)
  throw showError({ statusCode: 404, statusMessage: 'Asset not found.' });
}

// API로부터 받은 데이터를 Pinia 스토어에 동기화
watch(asset, (newAssetData) => {
  if (newAssetData) {
    propertyStore.setProperty(newAssetData);
  }
}, { immediate: true }); // immediate: true로 초기 로딩 시에도 즉시 실행

// [수정] 페이지를 벗어날 때 스토어 상태를 초기화하여 데이터 오염 방지
onUnmounted(() => {
  propertyStore.reset();
});

// --- 페이지 헤더 및 UI 상태 ---
// ✨ [수정] computed를 사용하여 동적으로 페이지 타이틀 관리
const title = computed(() => asset.value?.propertyName || 'Modify Property');

// ✨ [수정] useHead 컴포저블을 사용하여 Head 정보 관리
useHead({
  title: title, // computed 속성을 직접 연결
  meta: [
    { name: 'description', content: title }
  ],
  // 기존의 <Style> 태그는 body 전체에 영향을 주므로 layout이나 nuxt.config.ts에서 관리하는 것이 더 적합합니다.
  // 만약 이 페이지에서만 특정 스타일이 필요하다면 scoped style을 사용하는 것을 권장합니다.
});

const selectedTab = ref(0);
const categories = ref(adminAssetMenuCategory);

const changeTab = (index: number) => {
  selectedTab.value = index;
};
</script>

<style scoped>
/* 이 페이지에만 필요한 스타일이 있다면 여기에 추가 */
</style>