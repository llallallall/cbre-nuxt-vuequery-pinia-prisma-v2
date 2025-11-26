<template>
        <div>
                <form @submit.prevent="onSubmit" class="space-y-6 font-financier">
                        <h3 class="text-lg font-semibold pt-4 border-t text-primary">Elevators</h3>
                        <div class="grid grid-cols-4 gap-4">
                                <div class="relative w-full">
                                        <label for="passenger"
                                                class="block text-base font-semibold text-primary mb-2">Passenger</label>
                                        <input id="passenger" type="number"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary"
                                                v-model.number="formData.elevatorsPassenger" />
                                </div>
                                <div class="relative w-full">
                                        <label for="service"
                                                class="block text-base font-semibold text-primary mb-2">Service</label>
                                        <input id="service" type="number"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary"
                                                v-model.number="formData.elevatorsService" />
                                </div>
                                <div class="relative w-full">
                                        <label for="freight"
                                                class="block text-base font-semibold text-primary mb-2">Freight</label>
                                        <input id="freight" type="number"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary"
                                                v-model.number="formData.elevatorsFreight" />
                                </div>
                                <div class="relative w-full">
                                        <label for="total"
                                                class="block text-base font-semibold text-primary mb-2">Total</label>
                                        <input id="total" type="number"
                                                class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-right cursor-not-allowed font-calibreLight text-lg text-primary"
                                                :value="elevatorsTotal" readonly />
                                </div>
                        </div>

                        <h3 class="text-lg font-semibold pt-4 border-t text-primary">Parking</h3>
                        <div class="grid grid-cols-2 gap-4">
                                <div class="flex flex-col">
                                        <label class="text-base font-semibold text-primary mb-2">Parking
                                                Capacity(existing)</label>
                                        <input type="number" v-model.number="formData.cpsExisting"
                                                class="border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
                                </div>
                                <div class="flex flex-col">
                                        <label class="text-base font-semibold text-primary mb-2">Parking
                                                Capacity(required)</label>
                                        <input type="number" v-model.number="formData.cpsRequired"
                                                class="border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
                                </div>
                                <div class="flex flex-col">
                                        <label class="text-base font-semibold text-primary mb-2">Free Parking
                                                (Sqm)</label>
                                        <input type="number" v-model.number="formData.freeCpsSqm" step="0.01"
                                                class="border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
                                </div>
                                <div class="flex flex-col">
                                        <label class="text-base font-semibold text-primary mb-2">Free Parking
                                                (Py)</label>
                                        <input type="number" v-model.number="formData.freeCpsPy" step="0.01"
                                                class="border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
                                </div>
                                <div class="flex flex-col">
                                        <label class="text-base font-semibold text-primary mb-2">Paid Parking
                                                Fee</label>
                                        <input type="number" v-model.number="formData.paidParkingFee"
                                                class="border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
                                </div>
                        </div>

                        <h3 class="text-lg font-semibold pt-4 border-t text-primary">Materials & Systems</h3>
                        <div class="space-y-4">
                                <div class="relative w-full">
                                        <label class="block text-base font-semibold text-primary mb-2">Roof
                                                Material</label>
                                        <input type="text" v-model="formData.roofMaterial"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary" />
                                </div>
                                <div class="relative w-full">
                                        <label class="block text-base font-semibold text-primary mb-2">Facade</label>
                                        <input type="text" v-model="formData.facade"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary" />
                                </div>
                                <div class="relative w-full">
                                        <label class="block text-base font-semibold text-primary mb-2">Mechanical /
                                                Electrical</label>
                                        <input type="number" v-model.number="formData.mechanicalElectrical"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary" />
                                </div>
                                <div class="relative w-full">
                                        <label class="block text-base font-semibold text-primary mb-2">Lighting</label>
                                        <input type="text" v-model="formData.lighting"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary" />
                                </div>
                                <div class="relative w-full">
                                        <label class="block text-base font-semibold text-primary mb-2">Fire
                                                Fighting</label>
                                        <input type="text" v-model="formData.fireFighting"
                                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 font-calibreLight text-lg text-primary" />
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
import { reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { createToast } from 'mosha-vue-toastify';

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { isGlobalLoading: computedIsLoading } = storeToRefs(statusStore);
const { currentProperty } = storeToRefs(propertyStore);

// 초기값 로드
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
                elevatorsTotal: elevatorsTotal.value,
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
