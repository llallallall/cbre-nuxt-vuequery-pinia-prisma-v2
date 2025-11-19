<template>
<div>
  <div class="py-2 font-financier text-2xl text-primary w-full ">

                        <div class="flex justify-between gap-3 w-full mb-5">
                                <div class="w-1/2 flex justify-start">Floors Information</div>

                                <div class="w-1/2 flex justify-end">
                                        <div  class="bg-primary/10 hover:bg-primary/25 
                                        text-primary rounded-full
                                        px-4 py-1 min-w-[100px]
                                        flex justify-center items-center ">
                                                {{ info ? info.length : 0}}
                                        </div>
                                </div>
                        </div>

  </div>      
  <div>
        
    <div class="shadow-lg rounded-xl overflow-hidden bg-white">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-primary/10 hover:bg-primary/25 ">
          <tr>
            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
              Details
            </th>
            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Floor & Type
            </th>
            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
              Ceiling Height
            </th>
            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
              Floor Load
            </th>
            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Total Area (SQM)
            </th>
            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
              Truck Berths
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <template v-for="(floorItem, index) in info" :key="floorItem.id">
            <!-- Main Floor Row -->
            <tr class="hover:bg-primary/25 transition duration-150">
              <td class="py-3 px-4 text-sm font-medium text-gray-900">
                <button 
                  @click="toggleExpand(floorItem.id)"
                  :aria-expanded="expandedFloors.includes(floorItem.id)"
                  class="p-1 rounded-full text-primary hover:bg-primary/25 transition duration-150"
                  :class="{ 'rotate-90': expandedFloors.includes(floorItem.id) }"
                >
                    <svg class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </td>
              <td class="py-3 px-4 text-sm font-medium text-gray-800">{{ floorItem.floor || 'N/A' }} ({{ floorItem.type || 'F' }})</td>
              <td class="py-3 px-4 text-sm text-gray-500 hidden sm:table-cell">{{ floorItem.ceilingHeight || '—' }} {{ floorItem.ceilingHeightUnit || '' }}</td>
              <td class="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">{{ floorItem.floorLoad || '—' }} {{ floorItem.floorLoadUnit || '' }}</td>
              <td class="py-3 px-4 text-sm font-medium text-gray-800">{{ formatNumber(floorItem.totalAreaSqm) }}</td>
              <td class="py-3 px-4 text-sm text-gray-500 hidden lg:table-cell">{{ floorItem.truckBerths || '0' }}</td>
            </tr>

            <!-- Nested FloorPartial Details Row -->
            <tr v-if="expandedFloors.includes(floorItem.id)" class="bg-gray-100/50">
              <td :colspan="6" class="p-0">
                <div class="px-4 py-3 border-t border-primary/10">
                    <h4 class="text-md font-semibold text-primary mb-3">Unit Details ({{ floorItem.floorPartial.length }} Units)</h4>
                    
                    <!-- Inner FloorPartial Table -->
                    <div v-if="floorItem.floorPartial.length > 0" class="overflow-x-auto">
                        <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead class="bg-white">
                                <tr>
                                    <th class="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase border-b w-20">Unit No.</th>
                                    <th class="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase border-b w-32">Tenant</th>
                                    <th class="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase border-b w-32">Area (PY)</th>
                                    <th class="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase border-b hidden sm:table-cell">Deposit (KRW)</th>
                                    <th class="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase border-b hidden md:table-cell">Monthly Rent</th>
                                    <th class="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase border-b hidden md:table-cell">Mgmt Fee</th>
                                    <th class="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase border-b hidden lg:table-cell">Contract Start</th>
                                    <th class="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase border-b hidden lg:table-cell">Contract End</th>
                                    <th class="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase border-b hidden xl:table-cell">Rent Free</th>
                                    <th class="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase border-b hidden xl:table-cell">Fit Out</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="partial in floorItem.floorPartial" :key="partial.id" class="border-b last:border-b-0 hover:bg-gray-50">
                                    <td class="py-2 px-3 text-sm font-medium text-gray-800">{{ partial.unitNumber || 'N/A' }}</td>
                                    <td class="py-2 px-3 text-sm text-gray-600">{{ partial.tenant || 'Vacant' }}</td>
                                    <td class="py-2 px-3 text-sm font-medium text-indigo-600 text-right">{{ formatNumber(partial.leaseAreaPy) }}</td>
                                    <td class="py-2 px-3 text-sm text-gray-600 text-right hidden sm:table-cell">{{ formatNumber(partial.depositRrw) }}</td>
                                    <td class="py-2 px-3 text-sm text-gray-600 text-right hidden md:table-cell">{{ formatNumber(partial.monthlyRent) }}</td>
                                    <td class="py-2 px-3 text-sm text-gray-600 text-right hidden md:table-cell">{{ formatNumber(partial.monthlyManagementFee) }}</td>
                                    <td class="py-2 px-3 text-sm text-gray-600 hidden lg:table-cell">{{ partial.leaseStartDate ? formatDate(partial.leaseStartDate) : '—' }}</td>
                                    <td class="py-2 px-3 text-sm text-gray-600 hidden lg:table-cell">{{ partial.leaseEndDate ? formatDate(partial.leaseEndDate) : '—' }}</td>
                                    <td class="py-2 px-3 text-sm text-gray-600 hidden xl:table-cell">{{ partial.rentFree || 'None' }}</td>
                                    <td class="py-2 px-3 text-sm text-gray-600 hidden xl:table-cell">{{ partial.fitOut || 'None' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p v-else class="text-sm text-gray-500 italic">No detailed unit information available for this floor.</p>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="info?.length === 0" class="text-center py-10 text-gray-500">
        <p>No floor data available to display.</p>
    </div>
  </div>
</div>  
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';


const { info } = defineProps({
        info: {
                required: false,
                type: Object
        }
        
})


// --- 컴포넌트 로직 ---

// 확장된 행 ID를 추적하는 상태
// Set 대신 Array를 사용하여 includes로 간단히 처리합니다.
const expandedFloors: Ref<string[]> = ref([]);

/**
 * 층 ID를 받아 확장 상태를 토글합니다.
 */
const toggleExpand = (floorId: string) => {
    const index = expandedFloors.value.indexOf(floorId);
    if (index > -1) {
        expandedFloors.value.splice(index, 1); // 제거 (닫기)
    } else {
        expandedFloors.value.push(floorId); // 추가 (열기)
    }
};

/**
 * 숫자를 포맷하는 헬퍼 함수
 */
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || value === 0) return '—';
  // KRW 단위가 필요한 필드는 천단위 콤마만 찍고, 단위는 테이블 헤더에서 처리
  return value.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
};

/**
 * 날짜 객체를 간단한 문자열로 포맷하는 헬퍼 함수
 */
const formatDate = (date: Date | null): string => {
    if (!date) return '—';
    // Date 객체이거나 Date 문자열을 받아 처리
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '—';
    return dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
};


// --- 기존 mock 데이터 삭제 및 props 사용으로 대체 ---
// 1. floorListArray ref 삭제
// 2. <template>에서 floorListArray 대신 info 사용

</script>

<style scoped>
/* 기본적인 테이블 스타일은 Tailwind CSS 클래스로 처리되었습니다. */
/* 추가적인 애니메이션이나 커스텀 스타일이 필요하다면 여기에 추가합니다. */
.rotate-90 {
    transform: rotate(90deg);
}
</style>
