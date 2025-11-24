<script setup lang="ts">
import type { NuxtError } from '#app'
import { computed } from 'vue'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })

const errorMessage = computed(() => {
  const code = props.error?.statusCode
  if (code === 404) return 'Page Not Found'
  if (code === 500) return 'Server Error'
  return 'An Error Occurred'
})

const errorDescription = computed(() => {
  const code = props.error?.statusCode
  if (code === 404) return 'The page you are looking for does not exist or has been moved.'
  if (code === 500) return 'Our servers are currently experiencing issues. Please try again later.'
  return 'Something went wrong. Please try again.'
})
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden font-notoSans">
    <!-- Background Slider -->
    <div class="absolute inset-0 z-0 bg-slider">
      <div class="bg-slider-cover"></div>
      <div class="bg-image-01"></div>
      <div class="bg-image-02"></div>
      <div class="bg-image-03"></div>
      <div class="bg-image-04"></div>
    </div>

    <!-- Content (Centered Card) -->
    <div class="relative z-20 flex flex-col items-center justify-center min-h-screen p-4">
      <div class="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center max-w-md w-full backdrop-blur-sm bg-white/90">
        <!-- Icon -->
        <div class="mb-6 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm8 104a12 12 0 1 1 12-12a12 12 0 0 1-12 12"/></svg>
        </div>
        
        <!-- Main Message -->
        <h1 class="text-2xl font-calibreBold text-primary mb-2">
          {{ errorMessage }}
        </h1>
        
        <!-- Description -->
        <p class="text-gray-500 mb-8 font-notoSans text-sm md:text-base">
          {{ errorDescription }}
        </p>

        <!-- Button -->
        <button @click="handleError" class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors font-calibreMedium mb-8 text-sm">
          Back to Home
        </button>

        <!-- Error Code (Small, at bottom) -->
        <span class="text-[10px] text-gray-300 font-mono">
          Error Code: {{ error?.statusCode }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-slider {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.bg-slider-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #435254;
  opacity: 0.25;
  z-index: 20;
}

.bg-image-01 {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/assets/images/background/global-mid-year-outlook.jpg');
  background-size: cover;
  background-position: center;
  animation: fade 16s forwards infinite;
  animation-delay: 0s;
  opacity: 0;
}

.bg-image-02 {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/assets/images/background/zero_ph2_dataviz_homepage_2736x1824px_1110.jpg');
  background-size: cover;
  background-position: center;
  animation: fade 16s forwards infinite;
  animation-delay: 4s;
  opacity: 0;
}

.bg-image-03 {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/assets/images/background/cr_carousel_2736x1824_brighter_2.jpg');
  background-size: cover;
  background-position: center;
  animation: fade 16s forwards infinite;
  animation-delay: 8s;
  opacity: 0;
}

.bg-image-04 {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/assets/images/background/tech-talent-2023.jpg');
  background-size: cover;
  background-position: center;
  animation: fade 16s forwards infinite;
  animation-delay: 12s;
  opacity: 0;
}

@keyframes fade {
  0% { opacity: 0; }
  25% { opacity: 1; }
  40% { opacity: 0; }
  100% { opacity: 0; }
}
</style>
