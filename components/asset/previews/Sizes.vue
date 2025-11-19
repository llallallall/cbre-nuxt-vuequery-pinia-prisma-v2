<template>
  <div class="bg-white mt-4">

    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Sizes and Measurements</span>
      <button @click="panelStore.openPanel('sizes')" 
              class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <ul 
      class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1 pl-[20px] gap-4 border-b pb-2" 
    >
        <li v-if="property.sizes?.noOfBuildings" class="flex items-center ">
                <h3 class="text-base font-semibold">
                No. of Buildings : 
                </h3>
                <div class="flex-1 pl-2">
                {{ property.sizes.noOfBuildings.toLocaleString() }} 
                </div>
      </li>

      <li v-if="property.sizes?.upperLevels" class="flex items-center ">
                <h3 class="text-base font-semibold">
                Upper Levels : 
                </h3>
                <div class="flex-1 pl-2">
                {{ property.sizes.upperLevels.toLocaleString() }} 
                </div>
      </li>

      <li v-if="property.sizes?.basementLevels" class="flex items-center ">
                <h3 class="text-base font-semibold">
                Basement Levels : 
                </h3>
                <div class="flex-1 pl-2">
                {{ property.sizes.basementLevels.toLocaleString() }} 
                </div>
      </li>

    </ul>

    <ul 
      class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1 pl-[20px] gap-4  border-b py-2" 
    >
      <li v-if="property.sizes?.gfaSqm" class="flex items-center ">
        <h3 class="text-base font-semibold">
        GFA (㎡) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes.gfaSqm.toLocaleString() }} 
        </div>
      </li>
      
      <li v-if="property.sizes?.gfaPy" class="flex items-center">
        <h3 class="text-base font-semibold">
        GFA (py) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes.gfaPy.toLocaleString() }} 
        </div>
      </li>

      <li v-if="property.sizes?.nfaSqm" class="flex items-center">
        <h3 class="text-base font-semibold">
        NFA (㎡) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes.nfaSqm.toLocaleString() }} 
        </div>
      </li>

      <li v-if="property.sizes?.nfaPy" class="flex items-center">
        <h3 class="text-base font-semibold">
        NFA (py) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes.nfaPy.toLocaleString() }} 
        </div>
      </li>

</ul>
<ul 
      class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1 pl-[20px] gap-4  border-b py-2"  
    >
       <li v-if="property.sizes?.siteAreaSqm" class="flex items-center">
        <h3 class="text-base font-semibold">
        Land Area (㎡) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes?.siteAreaSqm.toLocaleString() }} 
        </div>
      </li>

      <li v-if="property.sizes?.siteAreaPy" class="flex items-center">
        <h3 class="text-base font-semibold">
        Land Area (py) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes.siteAreaPy.toLocaleString() }} 
        </div>
      </li>


       <li v-if="property.sizes?.floorPlateSqm" class="flex items-center">
        <h3 class="text-base font-semibold">
        Floor Plate (㎡) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes?.floorPlateSqm.toLocaleString() }} 
        </div>
      </li>

      <li v-if="property.sizes?.floorPlatePy" class="flex items-center">
        <h3 class="text-base font-semibold">
        Floor Plate (py) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes.floorPlatePy.toLocaleString() }} 
        </div>
      </li>

</ul>
<ul 
      class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1 pl-[20px] gap-4 border-b py-2"  
    >
<!-- Gross Leasable Area -->

      <li v-if="property.sizes?.grossLeasableAreaSqm" class="flex items-center">
        <h3 class="text-base font-semibold">
        Gross Leasable Area (㎡) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes?.grossLeasableAreaSqm.toLocaleString() }} 
        </div>
      </li>

      <li v-if="property.sizes?.grossLeasableAreaPy" class="flex items-center">
        <h3 class="text-base font-semibold">
        Gross Leasable Area (py) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes.grossLeasableAreaPy.toLocaleString() }} 
        </div>
      </li>


<!-- Net Leasable Area -->

      <li v-if="property.sizes?.netLeasableAreaSqm" class="flex items-center">
        <h3 class="text-base font-semibold">
        Net Leasable Area (㎡) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes?.netLeasableAreaSqm.toLocaleString() }} 
        </div>
      </li>

      <li v-if="property.sizes?.netLeasableAreaPy" class="flex items-center">
        <h3 class="text-base font-semibold">
        Net Leasable Area (py) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes.netLeasableAreaPy.toLocaleString() }} 
        </div>
      </li>
</ul>
<ul 
      class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1 pl-[20px] gap-4 pt-2" 
    >

<!-- Floor Area Ratio -->

      <li v-if="property.sizes?.floorAreaRatioExisting" class="flex items-center">
        <h3 class="text-base font-semibold">
        Floor Area Ratio (existing / ㎡) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes?.floorAreaRatioExisting.toLocaleString() }} 
        </div>
      </li>

      <li v-if="property.sizes?.floorAreaRatioPermitted" class="flex items-center">
        <h3 class="text-base font-semibold">
        Floor Area Ratio (permitted / ㎡) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes.floorAreaRatioPermitted.toLocaleString() }} 
        </div>
      </li>


<!-- Building Coverage Ratio -->

      <li v-if="property.sizes?.buildingCoverageRatioExisting" class="flex items-center">
        <h3 class="text-base font-semibold">
        Building Coverage Ratio (existing / ㎡) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes?.buildingCoverageRatioExisting.toLocaleString() }} 
        </div>
      </li>

      <li v-if="property.sizes?.buildingCoverageRatioPermitted" class="flex items-center">
        <h3 class="text-base font-semibold">
        Building Coverage Ratio (permitted / ㎡) : 
        </h3>
        <div class="flex-1 pl-2">
          {{ property.sizes.buildingCoverageRatioPermitted.toLocaleString() }} 
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

const property = computed(() => propertyStore.$state);
</script>