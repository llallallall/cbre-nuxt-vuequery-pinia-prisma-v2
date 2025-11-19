<template>
  <!-- isLoading이 true일 때만 로더를 표시합니다. -->
  <div v-if="isLoading" class="global-loader-overlay">
    <div class="loader-content">
      <div class="spinner"></div>
      <p class="text-white mt-4 text-lg">
        Loading...
      </p>
    </div>
  </div>
</template>

<script setup>
// Pinia 스토어 훅을 가정합니다.
// 실제 스토어 이름(예: useDataStore)으로 변경해야 합니다.
import { storeToRefs } from 'pinia';
import { useStatusStore } from '~/stores/status';

// 스토어에서 상태 가져오기
const statusStore = useStatusStore();
const { isGlobalLoading: isLoading } = storeToRefs(statusStore);

</script>

<style scoped>
/* 로딩 오버레이: 전체 화면을 덮습니다. */
.global-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  /* 반투명 검은색 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  /* 모든 요소 위에 표시 */
  transition: opacity 0.3s ease;
}

/* 로딩 내용 컨테이너 */
.loader-content {
  text-align: center;
}

/* 스피너 (간단한 CSS 애니메이션) */
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #4ade80;
  /* Nuxt의 연한 초록색 계열 */
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
