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
                                                <input id="distanceToIc" type="text" v-model="formData.distanceToIc"
                                                        placeholder="e.g. 5.2 km"
                                                        class="border border-gray-300 rounded-md p-2" />
                                        </div>
                                        <div class="flex flex-col">
                                                <label for="timeTakenToCityHall" class="text-sm font-medium mb-1">Time
                                                        taken to City Hall</label>
                                                <input id="timeTakenToCityHall" type="text"
                                                        v-model="formData.timeTakenToCityHall" placeholder="e.g. 20 min"
                                                        class="border border-gray-300 rounded-md p-2" />
                                        </div>
                                        <div class="flex flex-col">
                                                <label for="timeTakenToSubway" class="text-sm font-medium mb-1">Time
                                                        taken to Subway</label>
                                                <input id="timeTakenToSubway" type="text"
                                                        v-model="formData.timeTakenToSubway"
                                                        placeholder="e.g. 10 min by walk"
                                                        class="border border-gray-300 rounded-md p-2" />
                                        </div>
                                </div>
                        </fieldset>

                        <fieldset class="border p-4 rounded-lg space-y-4">
                                <legend class="text-sm font-semibold text-gray-600 px-2">Nearby Information</legend>
                                <div class="flex flex-col">
                                        <label for="nearbyFacilities" class="text-sm font-medium mb-1">Nearby
                                                Facilities</label>
                                        <textarea id="nearbyFacilities" v-model="formData.nearbyFacilities" rows="3"
                                                placeholder="e.g. Bank, Post Office, Hospital..."
                                                class="border border-gray-300 rounded-md p-2"></textarea>
                                </div>
                                <div class="flex flex-col">
                                        <label for="nearbyAttractions" class="text-sm font-medium mb-1">Nearby
                                                Attractions</label>
                                        <textarea id="nearbyAttractions" v-model="formData.nearbyAttractions" rows="3"
                                                placeholder="e.g. Park, Museum, Shopping Mall..."
                                                class="border border-gray-300 rounded-md p-2"></textarea>
                                </div>
                                <div class="flex flex-col">
                                        <label for="nearbyPlaces" class="text-sm font-medium mb-1">Nearby Places
                                                (Other)</label>
                                        <textarea id="nearbyPlaces" v-model="formData.nearbyPlaces" rows="3"
                                                placeholder="Other specific places or information"
                                                class="border border-gray-300 rounded-md p-2"></textarea>
                                </div>
                        </fieldset>

                        <div class="flex justify-end pt-4 border-t">
                                <button type="button" @click="emit('close')" :disabled="computedIsLoading"
                                        class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] mr-4">
                                        Cancel
                                </button>
                                <button type="button" @click="resetForm()" :disabled="computedIsLoading"
                                        class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] mr-4">
                                        Reset
                                </button>
                                <button type="submit" :disabled="computedIsLoading"
                                        class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white font-bold py-2 px-4 rounded-[10px] flex items-center justify-center">
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
import { reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { createToast } from 'mosha-vue-toastify';

// 💡 1. Form 전용 인터페이스 정의 (모두 string 타입)
interface AccessibilityForm {
        distanceToIc: string;
        timeTakenToCityHall: string;
        timeTakenToSubway: string;
        nearbyFacilities: string;
        nearbyAttractions: string;
        nearbyPlaces: string;
}

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();

const { isGlobalLoading: computedIsLoading } = storeToRefs(statusStore);
const { currentProperty } = storeToRefs(propertyStore);

// 💡 2. 초기 데이터 로드 (null -> 빈 문자열 변환)
const getInitialData = (): AccessibilityForm => {
        const a = currentProperty.value?.accessibility;
        return {
                distanceToIc: a?.distanceToIc || '',
                timeTakenToCityHall: a?.timeTakenToCityHall || '',
                timeTakenToSubway: a?.timeTakenToSubway || '',
                nearbyFacilities: a?.nearbyFacilities || '',
                nearbyAttractions: a?.nearbyAttractions || '',
                nearbyPlaces: a?.nearbyPlaces || '',
        };
};

const formData = reactive<AccessibilityForm>(getInitialData());

const resetForm = () => {
        Object.assign(formData, getInitialData());
};

const onSubmit = async () => {
        if (!propertyStore.currentPropertyId) return;

        statusStore.setGlobalLoading(true);

        // 💡 3. Payload 생성 (빈 문자열 -> null 변환)
        // API는 null을 허용하므로, 값이 없을 경우 null로 보내 DB를 깔끔하게 유지합니다.
        const payload = {
                distanceToIc: formData.distanceToIc || null,
                timeTakenToCityHall: formData.timeTakenToCityHall || null,
                timeTakenToSubway: formData.timeTakenToSubway || null,
                nearbyFacilities: formData.nearbyFacilities || null,
                nearbyAttractions: formData.nearbyAttractions || null,
                nearbyPlaces: formData.nearbyPlaces || null,
        };

        try {
                await propertyStore.updatePropertySection('accessibility', payload as any);

                emit('close');
                createToast({ title: 'Accessibility saved successfully.' }, { type: 'success' });

        } catch (error) {
                console.error('API Error:', error);
                createToast({ title: 'Failed to save.' }, { type: 'danger' });
        } finally {
                statusStore.setGlobalLoading(false);
        }
};
</script>