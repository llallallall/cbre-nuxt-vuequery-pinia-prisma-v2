<template>
  <div>
    <div class="py-2 font-financier text-2xl text-primary w-full ">
      <div class="flex justify-between gap-3 w-full mb-5">
        <div class="w-1/2 flex justify-start">Floors Information</div>
        <div class="w-1/2 flex justify-end">
          <div class="bg-primary/10 hover:bg-primary/25 
                      text-primary rounded-full
                      px-4 py-1 min-w-[100px]
                      flex justify-center items-center ">
            {{ info ? info.length : 0 }}
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-primary/10 hover:bg-primary/25 ">
            <tr>
              <th class="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                Details
              </th>
              <th class="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Floor & Type
              </th>
              <th
                class="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                Ceiling Height
              </th>
              <th
                class="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                Floor Load
              </th>
              <th class="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total Area (㎡)
              </th>
              <th
                class="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                Truck Berths
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <template v-for="(floorItem, index) in info" :key="floorItem.id">
              <tr class="hover:bg-primary/5 transition duration-150">
                <td class="py-3 px-4 text-sm font-medium text-gray-900 text-center">
                  <button @click="toggleExpand(floorItem.id)" :aria-expanded="expandedFloors.includes(floorItem.id)"
                    class="p-1 rounded-full text-primary hover:bg-primary/20 transition duration-150 focus:outline-none"
                    :class="{ 'rotate-90': expandedFloors.includes(floorItem.id) }">
                    <svg class="w-5 h-5 transition-transform transform" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </td>
                <td class="py-3 px-4 text-sm font-medium text-gray-800">
                  {{ floorItem.type === 'BASEMENT' ? 'B' : '' }}{{ Math.abs(floorItem.floor || 0) }}F
                  <span class="text-gray-400 text-xs ml-1">({{ floorItem.use || 'General' }})</span>
                </td>
                <td class="py-3 px-4 text-sm text-gray-500 text-right hidden sm:table-cell">{{
                  formatNumber(floorItem.ceilingHeight) }} {{ floorItem.ceilingHeightUnit || 'm' }}</td>
                <td class="py-3 px-4 text-sm text-gray-500 text-right hidden md:table-cell">{{
                  formatNumber(floorItem.floorLoad) }} {{ floorItem.floorLoadUnit || 't/㎡' }}</td>
                <td class="py-3 px-4 text-sm font-medium text-gray-800 text-right">{{
                  formatNumber(floorItem.totalAreaSqm) }}</td>
                <td class="py-3 px-4 text-sm text-gray-500 text-right hidden lg:table-cell">{{ floorItem.truckBerths ||
                  '0' }}</td>
              </tr>

              <tr v-if="expandedFloors.includes(floorItem.id)" class="bg-gray-50">
                <td :colspan="6" class="p-0">
                  <div class="px-4 py-4 border-t border-gray-200 shadow-inner">
                    <h4 class="text-sm font-bold text-gray-700 mb-3 ml-1">Unit Details ({{ floorItem.floorPartial ?
                      floorItem.floorPartial.length : 0 }})</h4>

                    <div v-if="floorItem.floorPartial && floorItem.floorPartial.length > 0"
                      class="overflow-x-auto rounded-lg border border-gray-200">
                      <table class="min-w-full bg-white text-xs">
                        <thead class="bg-gray-100 border-b border-gray-200">
                          <tr>
                            <th class="py-2 px-3 text-left font-semibold text-gray-600 w-20">Unit No.</th>
                            <th class="py-2 px-3 text-left font-semibold text-gray-600 w-32">Tenant</th>
                            <th class="py-2 px-3 text-right font-semibold text-gray-600 w-24">Area (PY)</th>
                            <th class="py-2 px-3 text-right font-semibold text-gray-600 hidden sm:table-cell">Deposit
                            </th>
                            <th class="py-2 px-3 text-right font-semibold text-gray-600 hidden md:table-cell">Rent</th>
                            <th class="py-2 px-3 text-right font-semibold text-gray-600 hidden md:table-cell">Mgt Fee
                            </th>
                            <th class="py-2 px-3 text-center font-semibold text-gray-600 hidden lg:table-cell">Term</th>
                            <th class="py-2 px-3 text-left font-semibold text-gray-600 hidden xl:table-cell">Rent Free
                            </th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                          <tr v-for="partial in floorItem.floorPartial" :key="partial.id" class="hover:bg-blue-50/50">
                            <td class="py-2 px-3 font-medium text-gray-800">{{ partial.unitNumber || '-' }}</td>
                            <td class="py-2 px-3 text-gray-600 truncate max-w-[150px]" :title="partial.tenant || ''">{{
                              partial.tenant || 'Vacant' }}</td>
                            <td class="py-2 px-3 font-medium text-indigo-600 text-right">{{
                              formatNumber(partial.leaseAreaPy) }}</td>
                            <td class="py-2 px-3 text-gray-600 text-right hidden sm:table-cell">{{
                              formatNumber(partial.depositKrw) }}</td>
                            <td class="py-2 px-3 text-gray-600 text-right hidden md:table-cell">{{
                              formatNumber(partial.monthlyRent) }}</td>
                            <td class="py-2 px-3 text-gray-600 text-right hidden md:table-cell">{{
                              formatNumber(partial.monthlyManagementFee) }}</td>
                            <td class="py-2 px-3 text-gray-500 text-center hidden lg:table-cell">
                              {{ partial.leaseStartDate ? formatDate(partial.leaseStartDate) : '' }}
                              <span v-if="partial.leaseStartDate && partial.leaseEndDate">~</span>
                              {{ partial.leaseEndDate ? formatDate(partial.leaseEndDate) : '' }}
                            </td>
                            <td class="py-2 px-3 text-gray-500 hidden xl:table-cell truncate max-w-[100px]"
                              :title="partial.rentFree || ''">{{ partial.rentFree || '-' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p v-else class="text-sm text-gray-400 italic ml-1">No detailed unit information available for this
                      floor.</p>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div v-if="!info || info.length === 0" class="text-center py-10 text-gray-500">
        <p>No floor data available to display.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useFormat } from '~/composables/useFormat';
// 💡 수정: FloorType 임포트 추가
import type { FloorType } from '~/types/property.type';

// 💡 수정: defineProps에 Generic Type 적용
// 이렇게 하면 info가 FloorType[] 배열임을 TypeScript가 알게 되어 에러가 사라집니다.
const props = withDefaults(defineProps<{
  info?: FloorType[]
}>(), {
  info: () => []
});

const { numberFormat } = useFormat();

const expandedFloors: Ref<string[]> = ref([]);

const toggleExpand = (floorId: string) => {
  const index = expandedFloors.value.indexOf(floorId);
  if (index > -1) {
    expandedFloors.value.splice(index, 1);
  } else {
    expandedFloors.value.push(floorId);
  }
};

const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-';
  return numberFormat(value, 0);
};

const formatDate = (date: Date | string | null): string => {
  if (!date) return '-';
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '-';
  return dateObj.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' });
};

</script>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
}
</style>