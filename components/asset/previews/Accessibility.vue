<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Accessibility</span>
      <button @click="panelStore.openPanel('accessibility')"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <div v-if="hasAccessibilityInfo">
      <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1">
        <li v-if="property.accessibility?.distanceToIc !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Distance to IC :</h3>
          <div class="flex-1 pl-2">
            {{ property.accessibility?.distanceToIc }}
          </div>
        </li>
        <li v-if="property.accessibility?.timeTakenToCityHall !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Time taken to cityHall :</h3>
          <div class="flex-1 pl-2">
            {{ property.accessibility?.timeTakenToCityHall }}
          </div>
        </li>
        <li v-if="property.accessibility?.timeTakenToSubway !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Time taken to subway :</h3>
          <div class="flex-1 pl-2">
            {{ property.accessibility?.timeTakenToSubway }}
          </div>
        </li>


        <li v-if="property.accessibility?.nearbyFacilities" class="col-span-full flex items-center">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Nearby Facilities :</h3>
          <div class="flex-1 pl-2">{{ property.accessibility?.nearbyFacilities }}</div>
        </li>
        <li v-if="property.accessibility?.nearbyAttractions !== null" class="col-span-full flex items-center">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Nearby attractions :</h3>
          <div class="flex-1 pl-2 items-start justify-start">{{ property.accessibility?.nearbyAttractions }}</div>
        </li>
        <li v-if="property.accessibility?.nearbyPlaces !== null" class="col-span-full flex items-center">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Nearby places :</h3>
          <div class="flex-1 pl-2">{{ property.accessibility?.nearbyPlaces }}</div>
        </li>
      </ul>
    </div>
    <div v-else class="text-gray-500 italic mt-2 text-center text-sm">
      No accessibility information available.
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useModifyPanelStore } from '~/stores/modifyPanel';

const propertyStore = usePropertyStore();
const panelStore = useModifyPanelStore();
const property = computed(() => propertyStore.$state);

// ⭐ 접근성 정보 유무를 판단하는 Computed 속성 추가
const hasAccessibilityInfo = computed(() => {
  const a = property.value.accessibility;

  if (!a) return false;

  // distanceToIc, timeTakenToCityHall, timeTakenToSubway, nearbyFacilities, nearbyAttractions, nearbyPlaces
  // 중 하나라도 null이 아니면 (즉, 데이터가 존재하면) true 반환
  return (
    a.distanceToIc !== null ||
    a.timeTakenToCityHall !== null ||
    a.timeTakenToSubway !== null ||
    a.nearbyFacilities !== null ||
    a.nearbyAttractions !== null ||
    a.nearbyPlaces !== null
  );
});

</script>

<style scoped>
.cbre_bulletList {
  list-style: none;
  padding: 0 0 0 20px;
  line-height: 2;
}
</style>