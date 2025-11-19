<template>
  <div class="bg-white mt-4">
    <div
      class="relative font-financier text-2xl text-primary mb-4 flex justify-between"
    >
      <span>Profitability</span>
      <button
        @click="panelStore.openPanel('profitability')"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150"
      >
        Edit
      </button>
    </div>

    <ul
      class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-3 grid-cols-1"
    >
      <li v-if="property.profitability?.grade" class="flex items-center">
        <h3 class="text-base font-semibold">Grade :</h3>
        <div class="flex-1 pl-2">
          {{ property.profitability.grade }}
        </div>
      </li>

      <li v-if="property.profitability?.effRatio !== null" class="flex items-center">
        <h3 class="text-base font-semibold">Effective Ratio :</h3>
        <div class="flex-1 pl-2">
          {{ property.profitability?.effRatio }}%
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useModifyPanelStore } from '~/stores/modifyPanel';

const propertyStore = usePropertyStore();
const panelStore = useModifyPanelStore();

// Pinia 스토어의 데이터를 사용합니다.
const property = computed(() => propertyStore.$state);
</script>

<style scoped>
/* General.vue에 정의된 스타일 또는 전역 스타일을 따른다고 가정합니다. */
.cbre_bulletList {
  list-style: none;
  padding: 0 0 0 20px;
  line-height: 2;
}
</style>