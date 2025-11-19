<template>
  <div>
    <div v-if="appStore.isLoading" class="flex items-center justify-center h-screen">
      <p class="text-2xl text-gray-500">Loading Asset Data...</p>
    </div>

    <div 
        v-else-if="asset.propertyId" 
        :key="propertyId" 
        class="relative w-full flex overflow-hidden"
    >
        <AssetPreviewsContainer :floorDataKey="floorDataKey" />
    </div>

    <div v-else class="flex items-center justify-center h-screen">
      <p class="text-2xl text-red-500">Failed to load asset.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, showError, createError } from '#app';
import { usePropertyStore } from '~/stores/property';
import { useModifyPanelStore } from '~/stores/modifyPanel';
import { useAppStore } from '~/stores/app'; // App Store import 추가 (로딩 상태 관리용)
import type { CbreAsset } from '~/types/asset.type';

// --- 페이지 설정 (유지) ---
definePageMeta({
  middleware: "auth",
  layout: 'admin-layout',
});


// --- 스토어 및 라우트 설정 ---
const route = useRoute();
const propertyStore = usePropertyStore();
const panelStore = useModifyPanelStore();
const appStore = useAppStore(); // App Store 인스턴스

// URL에서 propertyId 추출 (computed로 동적 반응성 유지)
const propertyId = computed(() => {
  const fullId = route.params.editId as string;
  return fullId.slice(5, -5);
});
// console.log(route.params.editId )
// console.log(propertyId.value )
// Pinia Store의 현재 자산 데이터를 computed로 가져옵니다.
const asset = computed(() => propertyStore.$state as CbreAsset);

// --- 데이터 로딩 로직 (Pinia Action 사용) ---

/**
 * @description 자산 데이터를 로드하는 함수
 */
const loadAssetData = async (id: string | null) => {
      if (!id) {
        // ID가 없으면 에러 페이지로 리디렉션하거나 오류를 표시합니다.
        console.error('에러: propertyId가 없습니다.');
        showError({ statusCode: 400, message: 'Property ID is missing.' });
        return;
      }
      
      // Pinia Store 액션을 호출하여 데이터 로드
      const success = await propertyStore.getProperty(id);

    
    if (!success) {
      // 로드 실패 시 에러 표시
      console.error(`에러: 자산 ID ${id} 로드 실패`);
      showError({ statusCode: 404, message: 'Asset not found.' });
    }
};

// 1. 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
    // 페이지 접근 시 바로 데이터 로드
    loadAssetData(propertyId.value);
});


// 2. propertyId가 변경될 때마다 데이터 다시 로드 (Nuxt의 watch 옵션 대체)
// 이는 사용자가 자산 A 상세 페이지 -> 자산 B 상세 페이지로 이동할 때 발생합니다.
// watch(propertyId, (newId, oldId) => {
//     // console.log(`[editId].vue: propertyId 변경 감지: ${oldId} -> ${newId}`); // propertyId 변경 감지
//     if (newId && newId !== oldId) {
//         loadAssetData(newId);
//     }
// });


// --- UI 관련 상태 관리 (기존 로직 유지) ---
const lastSection = ref<string | null>(null); // 마지막으로 열었던 섹션을 저장
const floorDataKey = ref(0); // 플로어 플랜 업데이트를 위한 키

watch(() => panelStore.currentSection, (newSection) => {
    lastSection.value = newSection;
});

watch(() => panelStore.isOpen, (isNewOpen, isOldOpen) => {
    if (isOldOpen && !isNewOpen && lastSection.value === 'floorPlan') {
        // Floor Plan 패널이 닫힐 때만 키를 증가시켜 Floor Plan 컴포넌트를 강제로 업데이트합니다.
        floorDataKey.value++;
        // console.log('floorDataKey 증가', floorDataKey.value); // floorDataKey 증가
    }
});

// // Pinia Store의 currentPropertyId를 라우트 ID와 일치하도록 보장
// onUnmounted(() => {
//     // 페이지를 떠날 때 currentPropertyId를 초기화할 필요는 없지만,
//     // 필요에 따라 propertyStore.$reset() 등의 액션을 호출할 수 있습니다.
// });
</script>

<style scoped></style>