<template>
  <Transition name="slide-fade">
    <div class="bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none flex w-full justify-start">
      <div v-if="uiStore.isModifyPanelOpen" class="fixed mt-[100px] right-[20px] mb-[20px] top-0 bottom-0 
                w-full ml-[30px] lg:w-[calc(50%-60px)] 
                backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] 
                z-20">

        <div class="m-2 p-6 bg-white rounded-[15px] h-[calc(100%-20px)] overflow-y-auto">
          <div class="flex justify-between items-center border-b pb-4 mb-6">
            <h3 class="text-xl font-bold text-gray-800">Modify : {{ title }} </h3>
            <button @click="uiStore.closeModifyPanel()" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="uiStore.currentSection === 'general'">
            <AssetModifyFormGeneral @close="uiStore.closeModifyPanel()" />
          </div>

          <div v-if="uiStore.currentSection === 'location'">
            <AssetModifyFormLocation @close="uiStore.closeModifyPanel()" />
          </div>

          <div v-if="uiStore.currentSection === 'photo'">
            <AssetModifyFormPhoto @close="uiStore.closeModifyPanel()" />
          </div>

          <div v-if="uiStore.currentSection === 'brochure'">
            <AssetModifyFormBrochure @close="uiStore.closeModifyPanel()" />
          </div>

          <div v-if="uiStore.currentSection === 'profitability'">
            <AssetModifyFormProfitability @close="uiStore.closeModifyPanel()" />
          </div>

          <div v-if="uiStore.currentSection === 'history'">
            <AssetModifyFormHistory @close="uiStore.closeModifyPanel()" />
          </div>

          <div v-if="uiStore.currentSection === 'scale'">
            <AssetModifyFormSizes @close="uiStore.closeModifyPanel()" />
          </div>

          <div v-if="uiStore.currentSection === 'floor'">
            <AssetModifyFormFloor @close="uiStore.closeModifyPanel()" />
          </div>

          <div v-if="uiStore.currentSection === 'floorplan'">
            <AssetModifyFormFloorPlanSection @close="uiStore.closeModifyPanel()" />
          </div>
          <div v-if="uiStore.currentSection === 'facility'">
            <AssetModifyFormFacility @close="uiStore.closeModifyPanel()" />
          </div>

          <div v-if="uiStore.currentSection === 'accessibility'">
            <AssetModifyFormAccessibility @close="uiStore.closeModifyPanel()" />
          </div>

          <div v-if="uiStore.currentSection === 'sale'">
            <AssetModifyFormSale @close="uiStore.closeModifyPanel()" />
          </div>

          <div v-if="uiStore.currentSection === 'lease'">
            <AssetModifyFormLease @close="uiStore.closeModifyPanel()" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUiStore } from '~/stores/ui'; // 💡 수정

const uiStore = useUiStore();

const title = computed(() => {
  switch (uiStore.currentSection) {
    case 'general':
      return 'General Information';
    case 'photo':
      return 'Photo List';
    case 'brochure':
      return 'Brochure List';
    case 'profitability':
      return 'Profitability Infromation';
    case 'history':
      return 'History List';
    case 'scale': // sizes -> scale
      return 'Sizes and Measurements';
    case 'floor':
      return 'Floor Data';
    case 'floorplan':
      return 'Floor Plan Photos';
    case 'location':
      return 'Location & Coordinates Information';
    case 'facility':
      return 'Facility Information';
    case 'accessibility':
      return 'Accessibility Information';
    case 'sale':
      return 'Sales Information';
    case 'lease':
      return 'Leases Information';
    default:
      return 'Property Information';
  }
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>