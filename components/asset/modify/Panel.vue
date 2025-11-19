<template>
  <Transition name="slide-fade">
    <div class="bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none 
                    flex w-full justify-start">
      <div v-if="panelStore.isOpen" class="fixed mt-[100px] right-[20px] mb-[20px] top-0 bottom-0 
                w-full ml-[30px] lg:w-[calc(50%-60px)] 
                backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] 
                z-20">

        <div class="m-2 p-6 bg-white rounded-[15px] h-[calc(100%-20px)] overflow-y-auto">
          <div class="flex justify-between items-center border-b pb-4 mb-6">
            <h3 class="text-xl font-bold text-gray-800">Modify : {{ title }} </h3>
            <button @click="panelStore.closePanel()" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="panelStore.currentSection === 'general'">
            <AssetModifyFormGeneral @close="panelStore.closePanel()" />
          </div>

          <div v-if="panelStore.currentSection === 'location'">
            <AssetModifyFormLocation @close="panelStore.closePanel()" />
          </div>

          <div v-if="panelStore.currentSection === 'photo'">
            <AssetModifyFormPhoto @close="panelStore.closePanel()" />
          </div>

          <div v-if="panelStore.currentSection === 'brochure'">
            <AssetModifyFormBrochure @close="panelStore.closePanel()" />
          </div>

          <div v-if="panelStore.currentSection === 'profitability'">
            <AssetModifyFormProfitability @close="panelStore.closePanel()" />
          </div>

          <div v-if="panelStore.currentSection === 'history'">
            <AssetModifyFormHistory @close="panelStore.closePanel()" />
          </div>

          <div v-if="panelStore.currentSection === 'sizes'">
            <AssetModifyFormSizes @close="panelStore.closePanel()" />
          </div>

          <div v-if="panelStore.currentSection === 'floor'">
            <AssetModifyFormFloor @close="panelStore.closePanel()" />
          </div>

          <div v-if="panelStore.currentSection === 'floorplan'">
            <AssetModifyFormFloorPlanSection @close="panelStore.closePanel()" />
          </div>
          <div v-if="panelStore.currentSection === 'facility'">
            <AssetModifyFormFacility @close="panelStore.closePanel()" />
          </div>

          <div v-if="panelStore.currentSection === 'accessibility'">
            <AssetModifyFormAccessibility @close="panelStore.closePanel()" />
          </div>

          <div v-if="panelStore.currentSection === 'sale'">
            <AssetModifyFormSale @close="panelStore.closePanel()" />
          </div>

          <div v-if="panelStore.currentSection === 'lease'">
            <AssetModifyFormLease @close="panelStore.closePanel()" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useModifyPanelStore } from '~/stores/modifyPanel';

const panelStore = useModifyPanelStore();

const title = computed(() => {
  switch (panelStore.currentSection) {
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
    case 'sizes':
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
    // ... 나머지 섹션 추가 ...
    default:
      return 'Property Information';
  }
});
</script>

<style scoped>
/* 사이드 패널 애니메이션 */
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