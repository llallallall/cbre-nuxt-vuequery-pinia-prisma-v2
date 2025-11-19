<template>
  <div class="bg-white mt-4">
    <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
      <span>Facility</span>
      <button @click="panelStore.openPanel('facility')"
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
            <th class="px-2 py-1">Shuttle</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center border-t">
            <td class="px-2 py-1">{{ formatInt(property.facility?.elevators?.total) }}</td>
            <td class="px-2 py-1">{{ formatInt(property.facility?.elevators?.passenger) }}</td>
            <td class="px-2 py-1">{{ formatInt(property.facility?.elevators?.service) }}</td>
            <td class="px-2 py-1">{{ formatInt(property.facility?.elevators?.shuttle) }}</td>
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
        <li v-if="property.facility?.parking?.cpsExisting !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Parking Capacity(existing) :</h3>
          <div class="flex-1 pl-2">
            {{ formatInt(property.facility?.parking?.cpsExisting) }} units
          </div>
        </li>
        <li v-if="property.facility?.parking?.cpsRequired !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Parking Capacity(required) :</h3>
          <div class="flex-1 pl-2">
            {{ formatInt(property.facility?.parking?.cpsRequired) }} units
          </div>
        </li>
        <li v-if="property.facility?.parking?.paidParkingFee !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Paid Parking Fee (VAT include) :</h3>
          <div class="flex-1 pl-2">
            {{ formatDecimal(property.facility?.parking?.paidParkingFee) }} KRW/Unit
          </div>
        </li>
      </ul>
      <ul class="relative cbre_bulletList font-calibreLight text-lg text-primary grid md:grid-cols-2 grid-cols-1">
        <li v-if="property.facility?.parking?.freeCpsSqm !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Free Parking :</h3>
          <div class="flex-1 pl-2">
            {{ formatDecimal(property.facility?.parking?.freeCpsSqm) }} units/m²
          </div>
        </li>
        <li v-if="property.facility?.parking?.freeCpsPy !== null" class="flex items-center">
          <h3 class="text-base font-semibold">Free Parking :</h3>
          <div class="flex-1 pl-2">
            {{ formatDecimal(property.facility?.parking?.freeCpsPy) }} units/py
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
        <li v-if="property.facility?.materials?.roofMaterial" class="flex items-start">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Roof Material :</h3>
          <div class="flex-1 pl-2">{{ property.facility?.materials?.roofMaterial }}</div>
        </li>
        <li v-if="property.facility?.materials?.facade" class="flex items-start">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Facade :</h3>
          <div class="flex-1 pl-2">{{ property.facility?.materials?.facade }}</div>
        </li>
        <li v-if="property.facility?.materials?.mechanicalElectrical" class="flex items-start">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Mechanical/Electrical :</h3>
          <div class="flex-1 pl-2">{{ property.facility?.materials?.mechanicalElectrical }}</div>
        </li>
        <li v-if="property.facility?.materials?.lighting" class="flex items-start">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Lighting :</h3>
          <div class="flex-1 pl-2">{{ property.facility?.materials?.lighting }}</div>
        </li>
        <li v-if="property.facility?.materials?.fireFighting" class="flex items-start">
          <h3 class="text-base font-semibold w-[150px] whitespace-nowrap">Fire Fighting :</h3>
          <div class="flex-1 pl-2">{{ property.facility?.materials?.fireFighting }}</div>
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
import { usePropertyStore } from '~/stores/property';
import { useModifyPanelStore } from '~/stores/modifyPanel';
import { useFormat } from '~/composables/useFormat';

const propertyStore = usePropertyStore();
const panelStore = useModifyPanelStore();
const property = computed(() => propertyStore.$state);

// ⭐ 컴포저블 사용: numberFormat 함수 사용
const { numberFormat } = useFormat();

// ⭐ 포맷팅 헬퍼 함수 정의 (Preview 표시용)
// 1. 정수형 (엘리베이터 대수, 주차 대수)
const formatInt = (value: any) => numberFormat(value, 0);
// 2. 소수점형 (주차 요금, 주차 비율)
const formatDecimal = (value: any) => numberFormat(value, 2);

// ⭐ 섹션별 정보 유무를 판단하는 Computed 속성 추가
const hasElevatorInfo = computed(() => {
  const e = property.value.facility?.elevators;
  // total, passenger, service, shuttle 중 하나라도 값이 있으면 true
  return e && (e.total !== null || e.passenger !== null || e.service !== null || e.shuttle !== null);
});

const hasParkingInfo = computed(() => {
  const p = property.value.facility?.parking;
  // 모든 Parking 필드 중 하나라도 값이 있으면 true
  return p && (p.cpsExisting !== null || p.cpsRequired !== null || p.paidParkingFee !== null || p.freeCpsSqm !== null || p.freeCpsPy !== null);
});

const hasMaterialsInfo = computed(() => {
  const m = property.value.facility?.materials;
  // roofMaterial, facade, mechanicalElectrical, lighting, fireFighting 중 하나라도 값이 있으면 true
  return m && (m.roofMaterial || m.facade || m.mechanicalElectrical || m.lighting || m.fireFighting);
});
</script>

<style scoped>
.cbre_bulletList {
  list-style: none;
  padding: 0 0 0 20px;
  line-height: 2;
}
</style>