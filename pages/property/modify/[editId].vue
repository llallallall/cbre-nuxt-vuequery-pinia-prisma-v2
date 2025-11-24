<template>
  <div>
    <div v-if="isGlobalLoading" class="flex items-center justify-center h-screen">
      <p class="text-2xl text-gray-500">Loading Asset Data...</p>
    </div>

    <div v-else-if="asset?.id" :key="propertyId" class="relative w-full flex overflow-hidden">
      <AssetPreviewsContainer :floorDataKey="floorDataKey" />
    </div>

    <div v-else class="flex items-center justify-center h-screen">
      <p class="text-2xl text-red-500">Failed to load asset.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, showError } from '#app';

// 💡 수정 3: 새로운 Store Import
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';         // ModifyPanelStore 대체
import { useStatusStore } from '~/stores/status'; // AppStore 대체
// import type { PropertyType } from '~/types/property.type'; // 필요 시 명시적 타입 임포트

// --- 페이지 설정 ---
definePageMeta({
  middleware: "auth",
  layout: 'admin-layout',
});

// --- 스토어 및 라우트 설정 ---
const route = useRoute();
const propertyStore = usePropertyStore();
const uiStore = useUiStore();         // UI & Panel 상태
const statusStore = useStatusStore(); // 전역 로딩 상태

// 💡 Store State 반응형 참조 (storeToRefs 권장)
const { currentProperty: asset } = storeToRefs(propertyStore);
const { isGlobalLoading } = storeToRefs(statusStore);
const { isModifyPanelOpen, currentSection } = storeToRefs(uiStore);

// --- ID 추출 로직 ---
const propertyId = computed(() => {
  const rawId = route.params.editId as string;

  // 💡 중요: 기존 코드에 있던 `slice(5, -5)` 로직입니다.
  // 만약 새로운 v2 시스템에서 ID를 평문으로 넘긴다면 아래 slice를 제거하고 `return rawId;`를 사용하세요.
  // 현재는 안전하게 rawId를 그대로 사용하도록 변경했습니다. (기존 로직 필요 시 주석 해제)

  return rawId;
  // return rawId.slice(5, -5); // <= 구버전 ID 난독화 해제 로직이 필요하다면 사용
});


// --- 데이터 로딩 로직 (Top-level Await) ---
// 페이지 컴포넌트 setup 내에서 await를 사용하면 Suspense가 처리합니다 (Nuxt 3 권장)
if (propertyId.value) {
  // 💡 수정 4: fetchPropertyDetail 액션 사용 (StatusStore 로딩 제어 포함됨)
  await propertyStore.fetchPropertyDetail(propertyId.value);

  // Admin 수정 패널을 위해 현재 작업 중인 ID 설정
  // uiStore.openModifyPanel(propertyId.value, 'general'); // 필요 시 초기화
} else {
  showError({ statusCode: 400, message: 'Property ID is missing.' });
}


// --- UI 관련 상태 관리 (패널 동작 감지) ---
const lastSection = ref<string | null>(null); // 마지막으로 열었던 섹션
const floorDataKey = ref(0); // 플로어 플랜 강제 리렌더링용 키

// 1. 현재 섹션 변경 감지
watch(currentSection, (newSection) => {
  // uiStore의 currentSection 타입은 AdminModifySectionType (null 가능)
  if (newSection) {
    lastSection.value = newSection;
  }
});

// 2. 패널 열림/닫힘 감지 (Floor Plan 업데이트 로직 유지)
watch(isModifyPanelOpen, (isOpen, wasOpen) => {
  // 패널이 닫혔고(wasOpen -> !isOpen), 마지막 섹션이 'floorplan' 이었다면 키 증가
  // 주의: 기존 코드는 'floorPlan'이었으나, Step 2 ui.ts의 타입 정의는 'floorplan' (소문자) 입니다.
  // 타입 정의에 맞춰 소문자로 비교합니다.
  if (wasOpen && !isOpen && lastSection.value === 'floorplan') {
    floorDataKey.value++;
    console.log('Floor Plan 업데이트 트리거:', floorDataKey.value);
  }
});

// --- 정리 (Cleanup) ---
onUnmounted(() => {
  // 페이지를 떠날 때 수정 패널 닫기 및 상태 초기화
  uiStore.closeModifyPanel();

  // 선택 사항: 자산 상세 정보 초기화가 필요하다면
  // propertyStore.$reset(); 
});

</script>

<style scoped></style>