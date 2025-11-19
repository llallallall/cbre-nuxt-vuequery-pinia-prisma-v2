<template>
        <div>
                <form @submit.prevent="onSubmit" class="space-y-6">
                        <h3 class="text-base font-semibold pt-4 border-t">Elevators</h3>
                        <div class="grid grid-cols-4 gap-4">
                                <div class="relative w-full">
                                        <label for="passenger"
                                                class="block text-sm font-medium text-gray-700">Passenger</label>
                                        <input id="passenger" type="number"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-right"
                                                v-model.number="formData.elevatorsPassenger" />
                                </div>
                                <div class="relative w-full">
                                        <label for="service"
                                                class="block text-sm font-medium text-gray-700">Service</label>
                                        <input id="service" type="number"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-right"
                                                v-model.number="formData.elevatorsService" />
                                </div>
                                <div class="relative w-full">
                                        <label for="freight"
                                                class="block text-sm font-medium text-gray-700">Freight</label>
                                        <input id="freight" type="number"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-right"
                                                v-model.number="formData.elevatorsFreight" />
                                </div>
                                <div class="relative w-full">
                                        <label for="total" class="block text-sm font-medium text-gray-700">Total</label>
                                        <input id="total" type="number"
                                                class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-right cursor-not-allowed"
                                                :value="elevatorsTotal" readonly />
                                </div>
                        </div>

                        <h3 class="text-base font-semibold pt-4 border-t">Parking</h3>
                        <div class="grid grid-cols-2 gap-4">
                                <div class="flex flex-col">
                                        <label class="text-sm font-medium mb-1">Parking Capacity(existing)</label>
                                        <input type="number" v-model.number="formData.cpsExisting"
                                                class="border border-gray-300 rounded-md p-2 text-right" />
                                </div>
                                <div class="flex flex-col">
                                        <label class="text-sm font-medium mb-1">Parking Capacity(required)</label>
                                        <input type="number" v-model.number="formData.cpsRequired"
                                                class="border border-gray-300 rounded-md p-2 text-right" />
                                </div>
                                <div class="flex flex-col">
                                        <label class="text-sm font-medium mb-1">Free Parking (Sqm)</label>
                                        <input type="number" v-model.number="formData.freeCpsSqm" step="0.01"
                                                class="border border-gray-300 rounded-md p-2 text-right" />
                                </div>
                                <div class="flex flex-col">
                                        <label class="text-sm font-medium mb-1">Free Parking (Py)</label>
                                        <input type="number" v-model.number="formData.freeCpsPy" step="0.01"
                                                class="border border-gray-300 rounded-md p-2 text-right" />
                                </div>
                                <div class="flex flex-col">
                                        <label class="text-sm font-medium mb-1">Paid Parking Fee</label>
                                        <input type="number" v-model.number="formData.paidParkingFee"
                                                class="border border-gray-300 rounded-md p-2 text-right" />
                                </div>
                        </div>

                        <h3 class="text-base font-semibold pt-4 border-t">Materials</h3>
                        <div class="space-y-4">
                                <div class="relative w-full">
                                        <label class="block text-sm font-medium text-gray-700">Roof Material</label>
                                        <input type="text" v-model="formData.roofMaterial"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                </div>
                        </div>

                        <div class="pt-5 border-t mt-6 flex justify-end">
                                <button type="button" @click="emit('close')"
                                        class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] mr-4">Cancel</button>
                                <button type="submit" :disabled="computedIsLoading"
                                        class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white font-bold py-2 px-4 rounded-[10px]">Save</button>
                        </div>
                </form>
        </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { createToast } from 'mosha-vue-toastify';

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { isGlobalLoading: computedIsLoading } = storeToRefs(statusStore);
const { currentProperty } = storeToRefs(propertyStore);

// 초기값 로드 (Flat Structure)
const getInitialData = () => {
        const f = currentProperty.value?.facility;
        return {
                // Elevators
                elevatorsPassenger: f?.elevatorsPassenger ?? 0,
                elevatorsService: f?.elevatorsService ?? 0,
                elevatorsFreight: f?.elevatorsFreight ?? 0,
                // Parking
                cpsExisting: f?.cpsExisting ?? 0,
                cpsRequired: f?.cpsRequired ?? 0,
                freeCpsSqm: f?.freeCpsSqm ?? null,
                freeCpsPy: f?.freeCpsPy ?? null,
                paidParkingFee: f?.paidParkingFee ?? null,
                // Materials
                roofMaterial: f?.roofMaterial ?? '',
                facade: f?.facade ?? '',
                mechanicalElectrical: f?.mechanicalElectrical ?? null,
                lighting: f?.lighting ?? '',
                fireFighting: f?.fireFighting ?? '',
        };
};

const formData = reactive(getInitialData());

// Total 계산 Computed
const elevatorsTotal = computed(() => {
        return (formData.elevatorsPassenger || 0) + (formData.elevatorsService || 0) + (formData.elevatorsFreight || 0);
});

const onSubmit = async () => {
        statusStore.setGlobalLoading(true);

        const payload = {
                ...formData,
                elevatorsTotal: elevatorsTotal.value, // Total 값 포함 전송
        };

        try {
                await propertyStore.updatePropertySection('facility', payload as any);
                emit('close');
                createToast({ title: 'Facility saved.' }, { type: 'success' });
        } catch (error) {
                createToast({ title: 'Error saving facility.' }, { type: 'danger' });
        } finally {
                statusStore.setGlobalLoading(false);
        }
};
</script>