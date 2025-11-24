<template>
  <div class="flex flex-col">
    <label class="text-sm font-medium mb-1">GFA (㎡)</label>
    <input type="text" :value="displayValues.gfaSqm" @input="e => handleInput(e, 'gfaSqm', true)"
      class="border border-gray-300 rounded-md p-2 text-right" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useFormat } from '~/composables/useFormat';
import { createToast } from 'mosha-vue-toastify';

const { numberFormat, processNumberInput } = useFormat();
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);
const emit = defineEmits(['close']);

// 초기 데이터 (Scale)
const getInitialData = () => JSON.parse(JSON.stringify(currentProperty.value?.scale || {}));
const formData = reactive(getInitialData());

// 화면 표시용 값 관리
const displayValues = reactive<Record<string, string>>({});

// 초기화 시 displayValues 세팅
Object.keys(formData).forEach(key => {
  displayValues[key] = numberFormat(formData[key], 2);
});

// 입력 핸들러
const handleInput = (e: Event, field: string, isDecimal: boolean) => {
  const val = (e.target as HTMLInputElement).value;
  const { formattedValue, numericValue } = processNumberInput(val, isDecimal);

  displayValues[field] = formattedValue; // 화면엔 콤마 포함
  formData[field] = numericValue;        // 데이터엔 숫자
};

const onSubmit = async () => {
  statusStore.setGlobalLoading(true);
  try {
    // 💡 수정: scale 섹션 업데이트
    await propertyStore.updatePropertySection('scale', formData);
    emit('close');
    createToast({ title: 'Scale saved.' }, { type: 'success' });
  } catch (e) {
    createToast({ title: 'Error saving.' }, { type: 'danger' });
  } finally {
    statusStore.setGlobalLoading(false);
  }
};
</script>