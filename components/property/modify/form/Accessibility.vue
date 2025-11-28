<template>
        <div>
                <form @submit.prevent="onSubmit" class="space-y-6 font-financier">

                        <div class="grid grid-cols-2 gap-10">
                                <div>
                                        <label for="distanceToIc"
                                                class="block text-base font-semibold text-primary mb-2">Distance to
                                                IC</label>
                                        <input id="distanceToIc" type="text" placeholder="Enter distance to IC"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary"
                                                v-model="formData.distanceToIc" />
                                </div>

                                <div>
                                        <label for="timeTakenToCityHall"
                                                class="block text-base font-semibold text-primary mb-2">Time to City
                                                Hall</label>
                                        <input id="timeTakenToCityHall" type="text"
                                                placeholder="Enter time to City Hall"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary"
                                                v-model="formData.timeTakenToCityHall" />
                                </div>
                        </div>

                        <div class="grid grid-cols-2 gap-10">
                                <div>
                                        <label for="timeTakenToSubway"
                                                class="block text-base font-semibold text-primary mb-2">Time to
                                                Subway</label>
                                        <input id="timeTakenToSubway" type="text" placeholder="Enter time to Subway"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary"
                                                v-model="formData.timeTakenToSubway" />
                                </div>
                                <div>
                                        <label for="nearbyFacilities"
                                                class="block text-base font-semibold text-primary mb-2">Nearby
                                                Facilities</label>
                                        <input id="nearbyFacilities" type="text" placeholder="Enter nearby facilities"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary"
                                                v-model="formData.nearbyFacilities" />
                                </div>
                        </div>

                        <div class="grid grid-cols-2 gap-10">
                                <div>
                                        <label for="nearbyAttractions"
                                                class="block text-base font-semibold text-primary mb-2">Nearby
                                                Attractions</label>
                                        <input id="nearbyAttractions" type="text" placeholder="Enter nearby attractions"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary"
                                                v-model="formData.nearbyAttractions" />
                                </div>
                                <div>
                                        <label for="nearbyPlaces"
                                                class="block text-base font-semibold text-primary mb-2">Nearby
                                                Places</label>
                                        <input id="nearbyPlaces" type="text" placeholder="Enter nearby places"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-calibreLight text-lg text-primary"
                                                v-model="formData.nearbyPlaces" />
                                </div>
                        </div>

                        <div class="flex justify-end gap-2">
                                <button type="button" @click="emit('close')"
                                        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit"
                                        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Save</button>
                        </div>
                </form>
        </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);
const { isGlobalLoading: computedIsLoading } = storeToRefs(statusStore);
const { showToast } = useToast();

// 초기 데이터
const getInitialData = () => {
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

const formData = reactive(getInitialData());

const onSubmit = async () => {
        statusStore.setGlobalLoading(true);
        try {
                await propertyStore.updatePropertySection('accessibility', formData as any);
                emit('close');
                showToast('Accessibility saved.', 'success');
        } catch (e) {
                showToast('Error saving.', 'danger');
        } finally {
                statusStore.setGlobalLoading(false);
        }
};
</script>
