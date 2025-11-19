<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-6">
      
      <div class="relative w-full h-full">
        <label for="propertyName" class="block text-sm font-medium text-gray-700"><span class="text-sm text-red-500"> * </span>Property Name</label>
        <input 
          id="propertyName"
          name="propertyName" 
          type="text" 
          placeholder="Please enter the asset name"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          v-model="formData.propertyName"
        />
        <p v-if="errors.propertyName" class="text-red-500 text-sm mt-1">{{ errors.propertyName }}</p>
      </div>
      
      <div>
        <label for="sector" class="block text-sm font-medium text-gray-700"><span class="text-sm text-red-500"> * </span>Sector</label>
         <select 
          id="sector"
          name="sector" 
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          :value="formData.sector?.id"
          @change="onSectorChange" 
        >
          <option value="" disabled>Please Select a Sector</option>
          <option 
            v-for="option in sectorOptions" 
            :key="option.id" 
            :value="option.id"
          >
            {{ option.name }}
          </option>
        </select>
        <p v-if="errors.sector" class="text-red-500 text-sm mt-1">{{ errors.sector }}</p>
      </div>

      <div v-if="subSectorOptions.length > 0"> 
        <label for="subSector" class="block text-sm font-medium text-gray-700">Sub-Sector</label>
        <select 
          id="subSector"
          name="subSector" 
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          :value="formData.subSector?.id"
          @change="onSubSectorChange" 
        >
          <option value="" disabled>Please Select a Sub Sector</option>
          <option 
            v-for="option in subSectorOptions" 
            :key="option.id" 
            :value="option.id"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
      
      <h3 class="text-lg font-semibold mt-4 pt-4 border-t">Warehouse Temperature Ratios (%)</h3>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label for="room" class="block text-sm font-medium text-gray-700">Room</label>
          <input 
            id="room"
            name="general.warehouse.room" 
            type="number" 
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            v-model.number="formData.general.warehouse.room"
          />
        </div>
        <div>
          <label for="low" class="block text-sm font-medium text-gray-700">Low</label>
          <input 
            id="low"
            name="general.warehouse.low" 
            type="number" 
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            v-model.number="formData.general.warehouse.low"
          />
        </div>
        <div>
          <label for="constant" class="block text-sm font-medium text-gray-700">Constant</label>
          <input 
            id="constant"
            name="general.warehouse.constant" 
            type="number" 
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            
            :value="formData.general.warehouse.constant"
          />
        </div>
      </div>

      <div class="flex flex-row items-center justify-end pt-8 border-t">
        <button
            type="button"
            @click="emit('close')"
            :disabled="computedIsLoading"
            class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
            Cancel
        </button>
        <button 
          type="button" 
          @click="resetForm()" 
          class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >Reset</button>
        <button 
          type="submit" 
          :disabled="!isFormValid || computedIsLoading" 
          class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white hover:text-primary font-bold py-2 px-4 rounded-[10px] transition duration-150 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center "
        >
          <svg v-if="computedIsLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ computedIsLoading ? 'Saving...' : 'Save and Close' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { createToast } from 'mosha-vue-toastify';
import { ref, watch, computed, reactive } from 'vue'; 
import { usePropertyStore } from '~/stores/property';
import { useMenuStore } from '~/stores/menu'; 
import { useAppStore } from '~/stores/app'; 

import type { CbreAsset, SectorType, SubSectorType } from '~/types/asset.type';

// --- 컴포넌트 설정 ---
const emit = defineEmits(['close']);

// --- 스토어 및 상태 ---
const propertyStore = usePropertyStore();
const menuStore = useMenuStore();
const appStore = useAppStore();
const computedIsLoading = computed(() => appStore.isLoading);

// --- 폼 타입 정의 (생략 없음) ---
interface GeneralPayload {
  propertyName: string;
  sector: { id: string; name: string } | null; 
  subSector: { id: string; name: string } | null;
  general: {
    warehouse: {
      room: number | null;
      low: number | null;
      constant: number | null;
    }
  };
}

// 💡 폼 데이터 초기화
const formData = reactive<GeneralPayload>({
  propertyName: '',
  sector: null,
  subSector: null,
  general: {
    warehouse: { room: null, low: null, constant: null },
  },
});

// --- 유효성 검사 에러 상태 ---
const errors = reactive({
  propertyName: '',
  sector: '',
});

// --- Pinia Store에서 데이터가 로드될 때 폼 데이터 초기화 ---

// 이 로직은 컴포넌트 마운트 시와 propertyStore.propertyName이 변경될 때 폼 데이터를 초기화합니다.
const initializeForm = () => {
    if (propertyStore.propertyId) {
        formData.propertyName = propertyStore.propertyName || '';
        
        // Pinia 객체를 얕은 복사하여 바인딩
        formData.sector = propertyStore.general?.sector ? { ...propertyStore.general.sector } : null;
        formData.subSector = propertyStore.general?.subSector ? { ...propertyStore.general.subSector } : null;

        if (propertyStore.general?.warehouse) {
            formData.general.warehouse.room = propertyStore.general.warehouse.room;
            formData.general.warehouse.low = propertyStore.general.warehouse.low;
            // Constant는 Room/Low 값으로 자동 계산되므로 따로 복사할 필요는 없습니다.
        }
    }
}

watch(() => propertyStore.propertyName, initializeForm, { immediate: true }); 


// --- 🎯 Reset 기능 추가 ---
const resetForm = () => {
    // 폼 데이터를 propertyStore의 현재 값으로 복원합니다.
    initializeForm();
    
    // 에러 메시지도 초기화
    errors.propertyName = '';
    errors.sector = '';

    //alert('폼이 현재 자산의 정보로 복원되었습니다.'); // 사용자 피드백 제공
      createToast({
        title: 'Form restored to current asset data.',
        // description: 'If you want to delete image click X mark'
        }, {
                type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                timeout: 5000,
                showCloseButton: true,
                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                transition: 'bounce',
                hideProgressBar: false,
                swipeClose: true,
        })
}

watch(() => propertyStore.propertyName, (newVal) => {
    if (propertyStore.propertyId) { 
        formData.propertyName = propertyStore.propertyName || '';
        
        // Pinia 객체를 얕은 복사하여 바인딩
        formData.sector = propertyStore.general?.sector ? { ...propertyStore.general.sector } : null;
        formData.subSector = propertyStore.general?.subSector ? { ...propertyStore.general.subSector } : null;

        if (propertyStore.general?.warehouse) {
            formData.general.warehouse.room = propertyStore.general.warehouse.room;
            formData.general.warehouse.low = propertyStore.general.warehouse.low;
            formData.general.warehouse.constant = propertyStore.general.warehouse.constant;
        }
    }
}, { immediate: true }); 

// --- 유효성 검사 로직 ---
const isFormValid = computed(() => {
    const noErrors = !errors.propertyName && !errors.sector;
    const requiredFieldsFilled = formData.propertyName.length >= 4 && !!formData.sector?.id;
    return noErrors && requiredFieldsFilled;
});

watch(() => formData.propertyName, (newValue) => {
  if (!newValue || newValue.length < 4) {
    errors.propertyName = 'The asset name must be at least 4 characters long.';
  } else {
    errors.propertyName = '';
  }
}); 

watch(() => formData.sector, (newValue) => {
  if (!newValue || !newValue.id) {
    errors.sector = 'Sector is a required selection. Please select a Sector.';
  } else {
    errors.sector = '';
  }
}, { deep: true });


// --- 커스텀 로직: Warehouse 온도 계산 ---
const calculateConstant = () => {
  const room = Number(formData.general.warehouse.room) || 0;
  const low = Number(formData.general.warehouse.low) || 0;
  const constant = Number(formData.general.warehouse.constant) || 0;
  
  let sum = room + low + constant;
  if (sum > 100) {
      formData.general.warehouse.constant = 100 - room - low;
   
      return; 
  }
  
  const constantValue = 100 - room - low;
  formData.general.warehouse.constant = constantValue;
};

// Room 또는 Low 값이 변경될 때마다 Constant 값을 자동 계산합니다.
watch([() => formData.general.warehouse.room, () => formData.general.warehouse.low, () => formData.general.warehouse.constant], () => {
  calculateConstant();
}, { deep: true }); 


// --- Select Options (Menu Store에서 가져오기) ---
const sectorOptions = computed<SectorType[]>(() => {
    // Menu Store의 sectors를 SectorType 배열로 가정
    return (menuStore.sector as SectorType[]) || []; 
});

// 🎯 Sub-Sector 목록 필터링 로직 개선
const subSectorOptions = computed<SubSectorType[]>(() => {
    // 1. Sector가 선택되지 않았으면 빈 배열 반환
    if (!formData.sector) {
        return [];
    }
    
    // 2. Subsector 데이터는 항상 배열(Store 정의에 따름)이므로 바로 필터링합니다.
    // 불필요한 !menuStore.subsector 체크를 제거하여 잠재적인 문제를 해결합니다.
    const allSubSectors = menuStore.subsector as any[]; // as SubSectorType[];
    
    const filteredSubSectors = allSubSectors.filter(
        (sub) => sub.sector_id === formData.sector?.id
    );
    
    return filteredSubSectors;
});

// --- Select 필드용 이벤트 핸들러 ---

const onSectorChange = (event: Event) => {
    const selectedId = (event.target as HTMLSelectElement).value;
    // Sector Options는 SectorType[] 배열이므로 find 시 타입을 명확히 지정
    const selectedOption = sectorOptions.value.find(o => o.id === selectedId);
    
    // 1. Sector 업데이트
    formData.sector = selectedOption || null;
    
    // 2. 새로운 Sector를 선택했으므로 Sub-Sector는 **무조건 초기화**합니다.
    // 이전 Sector에서 선택된 Sub-Sector 정보가 남아있지 않도록 합니다.
    formData.subSector = null; 
};

const onSubSectorChange = (event: Event) => {
    const selectedId = (event.target as HTMLSelectElement).value;
    // SubSector Options는 필터링된 SubSectorType[] 배열이므로 find 시 타입을 명확히 지정
    const selectedOption = subSectorOptions.value.find(o => o.id === selectedId);
    
    formData.subSector = selectedOption || null;
};


// --- API 제출 핸들러 ---
const onSubmit = async () => {
  if (!isFormValid.value) {
      //alert('필수 입력 항목을 확인해 주세요.');
      createToast({
          title: 'Please check the required fields.',
          // description: 'If you want to delete image click X mark'
          }, {
                  type: 'warning', // 'info', 'danger', 'warning', 'success', 'default'
                  timeout: 5000,
                  showCloseButton: true,
                  position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                  transition: 'bounce',
                  hideProgressBar: false,
                  swipeClose: true,
          })
      return; 
  }
  
  
  appStore.setLoading(true)
  //isLoading.value = true;
  
  const payload = {
      propertyName: formData.propertyName,
      sectorId: formData.sector?.id,     
      subSectorId: formData.subSector?.id,
      warehouse: {                          
          room: formData.general.warehouse.room,
          low: formData.general.warehouse.low,
          constant: formData.general.warehouse.constant,
      }
  };

  try {
    // API 호출: General 섹션만 업데이트하는 PUT 요청 (이전 단계에서 구현된 API 호출)
    const updatedAsset = await $fetch<Partial<CbreAsset>>(
      `/api/upload/${propertyStore.propertyId}/general`, 
      {
        method: 'PUT',
        body: payload,
      }
    );

    // Pinia 스토어 업데이트
    propertyStore.setProperty(updatedAsset);
    
    emit('close'); // 패널 닫기 이벤트 전달

    createToast({
          title: 'The changes have been saved successfully.',
          // description: 'If you want to delete image click X mark'
          }, {
                  type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                  timeout: 5000,
                  showCloseButton: true,
                  position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                  transition: 'bounce',
                  hideProgressBar: false,
                  swipeClose: true,
          })

  } catch (error) {
    console.error('API 업데이트 오류:', error);
    //alert('자산 정보 수정에 실패했습니다.');
    createToast({
          title: 'Failed to update asset information.',
          // description: 'If you want to delete image click X mark'
          }, {
                  type: 'danger', // 'info', 'danger', 'warning', 'success', 'default'
                  timeout: 5000,
                  showCloseButton: true,
                  position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                  transition: 'bounce',
                  hideProgressBar: false,
                  swipeClose: true,
          })

  } finally {
    //isLoading.value = false;
      appStore.setLoading(false)
  }
};
</script>