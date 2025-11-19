<template>
        <div class="p-6 space-y-6">
                <form @submit.prevent="onSubmit" class="space-y-6">

                        <fieldset class="border p-4 rounded-lg space-y-4">
                                <legend class="text-sm font-semibold text-gray-600 px-2">Transportation Accessibility
                                </legend>
                                <div class="grid md:grid-cols-2 gap-6">

                                        <div class="flex flex-col">
                                                <label for="distanceToIc" class="text-sm font-medium mb-1">Distance to
                                                        IC</label>
                                                <input id="distanceToIc" type="text" v-model="distanceToIc"
                                                        placeholder="e.g. 5.2 km"
                                                        class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1" />
                                        </div>

                                        <div class="flex flex-col">
                                                <label for="timeTakenToCityHall" class="text-sm font-medium mb-1">Time
                                                        taken to City Hall</label>
                                                <input id="timeTakenToCityHall" type="text"
                                                        v-model="timeTakenToCityHall" placeholder="e.g. 20 min"
                                                        class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1" />
                                        </div>

                                        <div class="flex flex-col">
                                                <label for="timeTakenToSubway" class="text-sm font-medium mb-1">Time
                                                        taken to Subway</label>
                                                <input id="timeTakenToSubway" type="text" v-model="timeTakenToSubway"
                                                        placeholder="e.g. 10 min by walk"
                                                        class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1" />
                                        </div>
                                </div>
                        </fieldset>

                        <fieldset class="border p-4 rounded-lg space-y-4">
                                <legend class="text-sm font-semibold text-gray-600 px-2">Nearby Information</legend>

                                <div class="flex flex-col">
                                        <label for="nearbyFacilities" class="text-sm font-medium mb-1">Nearby
                                                Facilities</label>
                                        <textarea id="nearbyFacilities" v-model="nearbyFacilities" rows="3"
                                                placeholder="e.g. Bank, Post Office, Hospital..."
                                                class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:border-cbre_primary_1"></textarea>
                                </div>

                                <div class="flex flex-col">
                                        <label for="nearbyAttractions" class="text-sm font-medium mb-1">Nearby
                                                Attractions</label>
                                        <textarea id="nearbyAttractions" v-model="nearbyAttractions" rows="3"
                                                placeholder="e.g. Park, Museum, Shopping Mall..."
                                                class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:focus:border-cbre_primary_1"></textarea>
                                </div>

                                <div class="flex flex-col">
                                        <label for="nearbyPlaces" class="text-sm font-medium mb-1">Nearby Places
                                                (Other)</label>
                                        <textarea id="nearbyPlaces" v-model="nearbyPlaces" rows="3"
                                                placeholder="Other specific places or information"
                                                class="border border-gray-300 rounded-md p-2 focus:ring-cbre_primary_1 focus:focus:border-cbre_primary_1"></textarea>
                                </div>
                        </fieldset>

                        <div class="flex justify-end pt-4 border-t">
                                <button type="button" @click="emit('close')" :disabled="computedIsLoading"
                                        class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                        Cancel
                                </button>
                                <button type="button" @click="resetForm()" :disabled="computedIsLoading"
                                        class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                        Reset
                                </button>
                                <button type="submit" :disabled="computedIsLoading"
                                        class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white hover:text-primary font-bold py-2 px-4 rounded-[10px] transition duration-150 
                                        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ">
                                        <svg v-if="computedIsLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                        stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                        </svg>
                                        {{ computedIsLoading ? 'Saving...' : 'Save and Close' }}
                                </button>
                        </div>
                </form>
        </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app';
import { createToast } from 'mosha-vue-toastify';
import type { AccessibilityType } from '~/types/asset.type';

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
// ⭐ appStore 사용
const appStore = useAppStore();

// ⭐ 전역 로딩 상태를 사용하는 computedIsLoading 정의
const computedIsLoading = computed(() => appStore.isLoading);

// 초기 데이터 (Pinia Store에서 가져옴)
const initialData: AccessibilityType = JSON.parse(JSON.stringify(propertyStore.accessibility || {
        distanceToIc: null,
        timeTakenToCityHall: null,
        timeTakenToSubway: null,
        nearbyFacilities: null,
        nearbyAttractions: null,
        nearbyPlaces: null,
}));

// 폼 데이터 (반응형 상태)
const formData = reactive<AccessibilityType>(initialData);

// ⭐ v-model 에러 해결을 위한 Computed 속성 정의 (Getter/Setter)
const distanceToIc = computed({
        get: () => formData.distanceToIc ?? '',
        set: (value: string) => { formData.distanceToIc = value === '' ? null : value; }
});
const timeTakenToCityHall = computed({
        get: () => formData.timeTakenToCityHall ?? '',
        set: (value: string) => { formData.timeTakenToCityHall = value === '' ? null : value; }
});
const timeTakenToSubway = computed({
        get: () => formData.timeTakenToSubway ?? '',
        set: (value: string) => { formData.timeTakenToSubway = value === '' ? null : value; }
});
const nearbyFacilities = computed({
        get: () => formData.nearbyFacilities ?? '',
        set: (value: string) => { formData.nearbyFacilities = value === '' ? null : value; }
});
const nearbyAttractions = computed({
        get: () => formData.nearbyAttractions ?? '',
        set: (value: string) => { formData.nearbyAttractions = value === '' ? null : value; }
});
const nearbyPlaces = computed({
        get: () => formData.nearbyPlaces ?? '',
        set: (value: string) => { formData.nearbyPlaces = value === '' ? null : value; }
});


// Reset 기능 구현
const resetForm = () => {
        if (computedIsLoading.value) return;
        Object.assign(formData, JSON.parse(JSON.stringify(initialData)));
};

// 폼 제출 핸들러
const onSubmit = async () => {
        if (!propertyStore.propertyId) {
                createToast({ title: 'Property ID is missing.' }, { type: 'danger' });
                return;
        }


        if (computedIsLoading.value) return; // 중복 제출 방지

        // ⭐ 로딩 시작 (appStore 사용)
        appStore.setLoading(true);

        // Pinia Store의 데이터 구조를 API Payload 구조(snake_case)로 변환
        const payload = {
                distance_to_ic: formData.distanceToIc,
                time_taken_to_city_hall: formData.timeTakenToCityHall,
                time_taken_to_subway: formData.timeTakenToSubway,
                nearby_facilities: formData.nearbyFacilities,
                nearby_attractions: formData.nearbyAttractions,
                nearby_places: formData.nearbyPlaces,
        };

        try {
                // API 호출: /api/property/[id]/accessibility (PUT 요청)
                const updatedAccessibility = await $fetch<AccessibilityType>(`/api/upload/${propertyStore.propertyId}/accessibility`, {
                        method: 'PUT',
                        body: payload,
                });

                // Pinia 스토어 업데이트
                propertyStore.setProperty({ accessibility: updatedAccessibility });

                // 초기 데이터 갱신 (저장 후 isDirty를 false로 만들기 위해)
                Object.assign(initialData, updatedAccessibility);

                emit('close');

                createToast({ title: 'Accessibility information has been successfully saved.' }, { type: 'success' });

        } catch (error) {
                console.error('API 업데이트 오류:', error);
                createToast({ title: 'Failed to update accessibility information.' }, { type: 'danger' });
        } finally {
                // ⭐ 로딩 종료 (appStore 사용)
                appStore.setLoading(false);
        }
};
</script>