<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Facility</span>
      <button @click="openEditPanel"
        class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
        Edit
      </button>
    </div>

    <h3 class="text-md font-semibold mt-6 mb-2 text-primary pr-2 ">- Elevators</h3>

    <template v-if="hasElevatorInfo">
      <table class="table-auto w-[calc(100%-20px)] border border-gray-300 text-primary text-sm ml-[20px]">
        <thead>
          <tr class="bg-gray-100 font-semibold text-center">
            <th class="px-2 py-1">Total</th>
            <th class="px-2 py-1">Passenger</th>
            <th class="px-2 py-1">Service</th>
            <th class="px-2 py-1">Freight</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center border-t">
            <td class="px-2 py-1">{{ formatInt(property?.facility?.elevatorsTotal) }}</td>
            <td class="px-2 py-1">{{ formatInt(property?.facility?.elevatorsPassenger) }}</td>
            <td class="px-2 py-1">{{ formatInt(property?.facility?.elevatorsService) }}</td>
            <td class="px-2 py-1">{{ formatInt(property?.facility?.elevatorsFreight) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <div v-else class="text-gray-500 text-sm mt-2 text-center italic">
      No Elevators information available.
    </div>

    <h3 class="text-md font-semibold mt-6 mb-2 text-primary pr-2">- Parking</h3>

    <template v-if="hasParkingInfo">
      <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1">
        <li v-if="property?.facility?.cpsExisting !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Parking Capacity(existing) :</h3>
          <div class="flex-1 pl-2">
            {{ formatInt(property?.facility?.cpsExisting) }} units
          </div>
        </li>
        <li v-if="property?.facility?.cpsRequired !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Parking Capacity(required) :</h3>
          <div class="flex-1 pl-2">
            {{ formatInt(property?.facility?.cpsRequired) }} units
          </div>
        </li>
        <li v-if="property?.facility?.paidParkingFee !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Paid Parking Fee (VAT include) :</h3>
          <div class="flex-1 pl-2">
            {{ formatDecimal(property?.facility?.paidParkingFee) }} KRW/Unit
          </div>
        </li>
      </ul>
      <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1">
        <li v-if="property?.facility?.freeCpsSqm !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Free Parking :</h3>
          <div class="flex-1 pl-2">
            {{ formatDecimal(property?.facility?.freeCpsSqm) }} units/m²
          </div>
        </li>
        <li v-if="property?.facility?.freeCpsPy !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Free Parking :</h3>
          <div class="flex-1 pl-2">
            {{ formatDecimal(property?.facility?.freeCpsPy) }} units/py
          </div>
        </li>
      </ul>
    </template>
    <div v-else class="text-gray-500 text-sm mt-2 text-center italic">
      No Parking information available.
    </div>

    <h3 class="text-md font-semibold mt-6 mb-2 text-primary pr-2">- Building Materials & Systems</h3>

    <template v-if="hasMaterialsInfo">
      <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1">
        <li v-if="property?.facility?.roofMaterial" class="flex items-start">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Roof Material :</h3>
          <div class="flex-1 pl-2">{{ property?.facility?.roofMaterial }}</div>
        </li>
        <li v-if="property?.facility?.facade" class="flex items-start">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Facade :</h3>
          <div class="flex-1 pl-2">{{ property?.facility?.facade }}</div>
        </li>
        <li v-if="property?.facility?.mechanicalElectrical" class="flex items-start">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Mechanical/Electrical :</h3>
          <div class="flex-1 pl-2">{{ property?.facility?.mechanicalElectrical }}</div>
        </li>
        <li v-if="property?.facility?.lighting" class="flex items-start">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Lighting :</h3>
          <div class="flex-1 pl-2">{{ property?.facility?.lighting }}</div>
        </li>
        <li v-if="property?.facility?.fireFighting" class="flex items-start">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Fire Fighting :</h3>
          <div class="flex-1 pl-2">{{ property?.facility?.fireFighting }}</div>
        </li>
      </ul>
    </template>
    <div v-else class="text-gray-500 text-sm mt-2 text-center italic">
      No Building Materials & Systems information available.
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui'; // ModifyPanelStore 대체
import { useFormat } from '~/composables/useFormat';

const propertyStore = usePropertyStore();
const uiStore = useUiStore();

// 💡 수정: currentProperty 참조
const { currentProperty: property } = storeToRefs(propertyStore);

// 컴포저블 사용
const { numberFormat } = useFormat();

// 포맷팅 헬퍼
const formatInt = (value: any) => numberFormat(value, 0);
const formatDecimal = (value: any) => numberFormat(value, 2);

// 패널 열기
const openEditPanel = () => {
  uiStore.openModifyPanel(propertyStore.currentPropertyId, 'facility');
}

// 💡 수정: 섹션별 정보 유무 판단 (Flat 구조 반영)
const hasElevatorInfo = computed(() => {
  const f = property.value?.facility;
  // elevatorsTotal, elevatorsPassenger, elevatorsService, elevatorsFreight
  return f && (
    f.elevatorsTotal !== null ||
    f.elevatorsPassenger !== null ||
    f.elevatorsService !== null ||
    f.elevatorsFreight !== null
  );
});

const hasParkingInfo = computed(() => {
  const f = property.value?.facility;
  // cpsExisting, cpsRequired, paidParkingFee, freeCpsSqm, freeCpsPy
  return f && (
    f.cpsExisting !== null ||
    f.cpsRequired !== null ||
    f.paidParkingFee !== null ||
    f.freeCpsSqm !== null ||
    f.freeCpsPy !== null
  );
});

const hasMaterialsInfo = computed(() => {
  const f = property.value?.facility;
  // roofMaterial, facade, mechanicalElectrical, lighting, fireFighting
  return f && (
    !!f.roofMaterial ||
    !!f.facade ||
    f.mechanicalElectrical !== null ||
    !!f.lighting ||
    !!f.fireFighting
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