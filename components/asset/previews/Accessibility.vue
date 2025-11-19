<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Accessibility</span>
      <button @click="openEditPanel"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <div v-if="hasAccessibilityInfo">
      <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1">
        <li v-if="property?.accessibility?.distanceToIc" class="flex items-center">
          <h3 class="text-base font-semibold">Distance to IC :</h3>
          <div class="flex-1 pl-2">
            {{ property.accessibility.distanceToIc }}
          </div>
        </li>
        <li v-if="property?.accessibility?.timeTakenToCityHall" class="flex items-center">
          <h3 class="text-base font-semibold">Time taken to cityHall :</h3>
          <div class="flex-1 pl-2">
            {{ property.accessibility.timeTakenToCityHall }}
          </div>
        </li>
        <li v-if="property?.accessibility?.timeTakenToSubway" class="flex items-center">
          <h3 class="text-base font-semibold">Time taken to subway :</h3>
          <div class="flex-1 pl-2">
            {{ property.accessibility.timeTakenToSubway }}
          </div>
        </li>
        <li v-if="property?.accessibility?.nearbyFacilities" class="col-span-full flex items-center">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Nearby Facilities :</h3>
          <div class="flex-1 pl-2">{{ property.accessibility.nearbyFacilities }}</div>
        </li>
        <li v-if="property?.accessibility?.nearbyAttractions" class="col-span-full flex items-center">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Nearby attractions :</h3>
          <div class="flex-1 pl-2 items-start justify-start">{{ property.accessibility.nearbyAttractions }}</div>
        </li>
        <li v-if="property?.accessibility?.nearbyPlaces" class="col-span-full flex items-center">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Nearby places :</h3>
          <div class="flex-1 pl-2">{{ property.accessibility.nearbyPlaces }}</div>
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
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';

const propertyStore = usePropertyStore();
const uiStore = useUiStore();

const { currentProperty: property } = storeToRefs(propertyStore);

const openEditPanel = () => {
  uiStore.openModifyPanel(propertyStore.currentPropertyId, 'accessibility');
};

const hasAccessibilityInfo = computed(() => {
  const a = property.value?.accessibility;
  if (!a) return false;
  return (
    !!a.distanceToIc || !!a.timeTakenToCityHall || !!a.timeTakenToSubway ||
    !!a.nearbyFacilities || !!a.nearbyAttractions || !!a.nearbyPlaces
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