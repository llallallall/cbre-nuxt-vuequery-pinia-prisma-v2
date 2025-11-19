<template>
  <div class="p-6 space-y-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="col-span-full flex items-end gap-2">
          <div class="flex-grow">
            <label class="block text-sm font-medium text-gray-700">Address Input</label>
            <input type="text" v-model="addressInput" @keypress.enter.prevent="handleSearch"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Search address..." />
          </div>
          <button type="button" @click="handleSearch"
            class="px-4 py-2 bg-blue-600 text-white rounded-md h-[42px]">Search</button>
        </div>

        <div v-if="geocoderResults.length > 0" class="col-span-full border rounded p-2 max-h-40 overflow-y-auto">
          <div v-for="item in geocoderResults" :key="item.id" @click="handleCandidateSelect(item)"
            class="p-2 hover:bg-gray-100 cursor-pointer" :class="{ 'bg-blue-50': selectedCandidate?.id === item.id }">
            {{ item.addressKorean }}
          </div>
        </div>

        <div v-if="selectedCandidate" class="col-span-full">
          <button type="button" @click="handleFinalizeGeocode" class="w-full py-2 bg-green-600 text-white rounded-md">
            Finalize Geocode
          </button>
        </div>

        <div><label class="text-xs">Address (Full)</label><input type="text" v-model="formState.addressFull" disabled
            class="w-full border bg-gray-50 rounded p-2" /></div>
        <div><label class="text-xs">Latitude</label><input type="text" v-model="formState.latitude" disabled
            class="w-full border bg-gray-50 rounded p-2" /></div>
        <div><label class="text-xs">Longitude</label><input type="text" v-model="formState.longitude" disabled
            class="w-full border bg-gray-50 rounded p-2" /></div>
      </div>

      <div class="flex justify-end pt-4 border-t">
        <button type="button" @click="emit('close')" class="bg-gray-200 px-4 py-2 rounded mr-2">Cancel</button>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useToast } from '~/composables/useToast';
// 💡 useAddressProcessor 사용
import { useAddressProcessor, type GeocodingCandidate } from '~/composables/useAddressProcessor';
import useGoogleMapsApi from '@/composables/useGoogleMapsApi';
import type { LocationType } from '~/types/property.type';

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { showToast } = useToast();
const { currentProperty } = storeToRefs(propertyStore);

// Composable 초기화
const { searchAddressCandidates, processSelectedAddress } = useAddressProcessor();

// Local State
const addressInput = ref('');
const geocoderResults = ref<GeocodingCandidate[]>([]);
const selectedCandidate = ref<GeocodingCandidate | null>(null);

const formState = reactive<Partial<LocationType>>({
  addressFull: null,
  addressFullJibun: null,
  addressProvince: null,
  addressCity: null,
  latitude: null,
  longitude: null
});

// 초기 데이터 로드
const initialize = () => {
  const loc = currentProperty.value?.location;
  if (loc) {
    Object.assign(formState, loc);
    addressInput.value = loc.addressFull || loc.addressFullJibun || '';
  }
};

onMounted(async () => {
  initialize();
  try {
    // @ts-ignore
    await useGoogleMapsApi();
  } catch (e) {
    console.error('Maps API Load Error', e);
  }
});

// 1. 검색 핸들러
const handleSearch = async () => {
  if (!addressInput.value) return;
  statusStore.setGlobalLoading(true);
  geocoderResults.value = [];
  selectedCandidate.value = null;

  try {
    const results = await searchAddressCandidates(addressInput.value);
    if (results.length > 0) {
      geocoderResults.value = results;
      if (results.length === 1) selectedCandidate.value = results[0];
    } else {
      showToast('No address found.', 'warning');
    }
  } catch (e) {
    showToast('Search failed.', 'danger');
  } finally {
    statusStore.setGlobalLoading(false);
  }
};

// 2. 선택 핸들러
const handleCandidateSelect = (item: GeocodingCandidate) => {
  selectedCandidate.value = item;
};

// 3. 확정 핸들러
const handleFinalizeGeocode = async () => {
  if (!selectedCandidate.value) return;
  statusStore.setGlobalLoading(true);

  try {
    const final = await processSelectedAddress(selectedCandidate.value);
    if (final) {
      Object.assign(formState, final);
      geocoderResults.value = []; // 목록 닫기
      showToast('Address finalized.', 'success');
    }
  } catch (e) {
    showToast('Geocoding failed.', 'danger');
  } finally {
    statusStore.setGlobalLoading(false);
  }
};

// 4. 저장 핸들러
const handleSubmit = async () => {
  statusStore.setGlobalLoading(true);
  try {
    // API 호출
    await propertyStore.updatePropertySection('location', formState as LocationType);
    emit('close');
    showToast('Location saved.', 'success');
  } catch (e) {
    showToast('Save failed.', 'danger');
  } finally {
    statusStore.setGlobalLoading(false);
  }
};
</script>