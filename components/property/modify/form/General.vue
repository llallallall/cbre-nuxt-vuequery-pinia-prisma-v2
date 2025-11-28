<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-6 font-financier">
      <div class="relative w-full h-full">
        <label for="propertyName" class="block text-base font-semibold text-primary mb-2"><span
            class="text-sm text-red-500"> *
          </span>Property Name</label>
        <input id="propertyName" type="text"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
          v-model="formData.name" />
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
      </div>

      <div>
        <label for="sector" class="block text-base font-semibold text-primary mb-2"><span class="text-sm text-red-500">
            *
          </span>Sector</label>
        <select id="sector"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
          v-model="formData.sectorId" @change="onSectorChange">
          <option value="" disabled>Please Select a Sector</option>
          <option v-for="option in sectorOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
        </select>
      </div>

      <div v-if="subSectorOptions.length > 0">
        <label for="subSector" class="block text-base font-semibold text-primary mb-2">Sub-Sector</label>
        <select id="subSector"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
          v-model="formData.subsectorId">
          <option value="" disabled>Please Select a Sub Sector</option>
          <option v-for="option in subSectorOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
        </select>
      </div>

      <h3 class="text-lg font-semibold mt-4 pt-4 border-t text-primary">Warehouse Temperature Ratios (%)</h3>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-base font-semibold text-primary mb-2">Room</label>
          <input type="number"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
            v-model.number="warehouseData.room" />
        </div>
        <div>
          <label class="block text-base font-semibold text-primary mb-2">Low</label>
          <input type="number"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
            v-model.number="warehouseData.low" />
        </div>
        <div>
          <label class="block text-base font-semibold text-primary mb-2">Constant</label>
          <input type="number"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary"
            :value="warehouseData.constant" readonly />
        </div>
      </div>

      <div class="flex flex-row items-center justify-end pt-8 border-t font-financierMedium">
        <button type="button" @click="emit('close')"
          class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white py-2 px-4 rounded-[10px] mr-4 transition duration-150">Cancel</button>
        <button type="submit" :disabled="computedIsLoading"
          class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useStatusStore } from '~/stores/status';


// build test
const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);
const { sectorList, subsectorList } = storeToRefs(uiStore);
const { isGlobalLoading: computedIsLoading } = storeToRefs(statusStore);
const { showToast } = useToast();

// 초기 데이터 (General) 
const formData = reactive({
  name: '',
  sectorId: '',
  subsectorId: '',
});

// 초기 데이터 (Warehouse) - 배열에서 추출
const getWarehouseVal = (type: string) => currentProperty.value?.warehouse?.find((w: any) => w.temperatureType === type)?.ratio || 0;

const warehouseData = reactive({
  room: 0,
  low: 0,
  constant: 0,
});

// 💡 [수정] 데이터 로드 시점 차이로 인한 초기값 누락 방지 (Watch)
watch(currentProperty, (newVal) => {
  if (newVal) {
    formData.name = newVal.name || '';
    formData.sectorId = newVal.sectorId || '';
    formData.subsectorId = newVal.subsectorId || '';

    warehouseData.room = getWarehouseVal('ROOM');
    warehouseData.low = getWarehouseVal('LOW');
    warehouseData.constant = getWarehouseVal('CONSTANT');
  }
}, { immediate: true, deep: true });

// Constant 자동 계산
watch([() => warehouseData.room, () => warehouseData.low], () => {
  const room = warehouseData.room || 0;
  const low = warehouseData.low || 0;
  warehouseData.constant = Math.max(0, 100 - room - low);
});

const errors = reactive({ name: '' });

// Options
const sectorOptions = computed(() => uiStore.sectorList || []);
const subSectorOptions = computed(() => {
  if (!formData.sectorId || !uiStore.subsectorList) return [];
  return uiStore.subsectorList.filter((s: any) => s.sectorId === formData.sectorId);
});

const onSectorChange = () => {
  formData.subsectorId = '';
};

const onSubmit = async () => {
  if (!formData.name) {
    errors.name = 'Property Name is required.';
    return;
  }
  statusStore.setGlobalLoading(true);

  const payload = {
    name: formData.name,
    sectorId: formData.sectorId,
    subsectorId: formData.subsectorId || null,
    warehouse: [
      { temperatureType: 'ROOM', ratio: warehouseData.room },
      { temperatureType: 'LOW', ratio: warehouseData.low },
      { temperatureType: 'CONSTANT', ratio: warehouseData.constant },
    ]
  };

  try {
    const updatedAsset = await $fetch(`/api/upload/${propertyStore.currentPropertyId}/general`, {
      method: 'PUT',
      body: payload,
    });

    // 💡 수정: setProperty 삭제 -> currentProperty 직접 업데이트
    if (propertyStore.currentProperty) {
      Object.assign(propertyStore.currentProperty, updatedAsset);
    }

    emit('close');
    showToast('Saved.', 'success');
  } catch (error) {
    console.error(error);
    showToast('Error.', 'danger');
  } finally {
    statusStore.setGlobalLoading(false);
  }
}



</script>