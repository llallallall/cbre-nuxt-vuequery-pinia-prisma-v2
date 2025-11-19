<template>
        <div class="flex">
                <div class="absolute top-0 right-0">
                        <button class="bg-rose-400 text-white px-[0.5em] py-[0.2em] mr-10 mt-2 rounded-lg shadow-lg text-sm"
                                @click="() => { debug = !debug }">Preview</button>
                </div>
                <div class="bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none ]" :class="{
                        'w-3/4': debug && shrinkPreview && !growPreview,
                        'w-2/4': debug && !shrinkPreview && !growPreview,
                        'w-1/4': debug && !shrinkPreview && growPreview,
                        'w-full': !debug,
                }">

                        <div class="relative 
                        px-[2.5em] pt-[7.5em] pb-[2.5em] 
                        backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                        border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] 
                        flex flex-col gap-5">

                                <div class="absolute top-0 left-[50%] -translate-x-[50%] 
                                        px-[1.5em] py-[1.0em] md:py-[0.5em] 
                                        text-center text-cbre_primary_3 text-[1.5em] 
                                        rounded-[0_0_20px_20px] 
                                        bg-[rgba(230,234,234,1)]
                                        before:content-[''] before:absolute before:top-0 before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:bg-transparent  before:shadow-[15px_0_0_0_rgba(230,234,234,1)]
                                        after:content-[''] after:absolute after:top-0 after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:bg-transparent  after:shadow-[-15px_0_0_0_rgba(230,234,234,1)]
                                        ">
                                        Accessibility
                                </div>

                                <ClientOnly>
                                        <VeeForm :validation-schema="validationSchema" @submit="handleSubmit" v-slot="{ meta }"
                                                class=" space-y-5">
                                                <VeeField name="distance_to_ic" v-slot="{ field, meta }"
                                                        v-model="accessibility.distanceToIc">
                                                        <div class="relative w-full">
                                                                <input v-bind="field" type="text" :class="{
                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[10px] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                        autocomplete="one-time-code"
                                                                        placeholder="Distance to IC" />
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="distance_to_ic" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>

                                                <VeeField name="time_taken_to_city_hall" v-slot="{ field, meta }"
                                                        v-model="accessibility.timeTakenToCityHall">
                                                        <div class="relative w-full">
                                                                <input v-bind="field" type="text" :class="{
                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[10px] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                        autocomplete="one-time-code"
                                                                        placeholder="Time Taken To City Hall" />
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="time_taken_to_city_hall" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>

                                                <VeeField name="time_taken_to_subway" v-slot="{ field, meta }"
                                                        v-model="accessibility.timeTakenToSubway">
                                                        <div class="relative w-full">
                                                                <input v-bind="field" type="text" :class="{
                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[10px] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                        autocomplete="one-time-code"
                                                                        placeholder="Time Taken to Subway" />
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="time_taken_to_subway" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>

                                                <VeeField name="nearby_facilities" v-slot="{ field, meta }"
                                                        v-model="accessibility.nearbyFacilities">
                                                        <div class="relative w-full">
                                                                <input v-bind="field" type="text" :class="{
                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[10px] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                        autocomplete="one-time-code"
                                                                        placeholder="Nearby Facilities" />
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="nearby_facilities" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>

                                                <VeeField name="nearby_attractions" v-slot="{ field, meta }"
                                                        v-model="accessibility.nearbyAttractions">
                                                        <div class="relative w-full">
                                                                <input v-bind="field" type="text" :class="{
                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[10px] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                        autocomplete="one-time-code"
                                                                        placeholder="Nearby Attractions" />
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="nearby_attractions" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>




                                                <VeeField name="nearby_places" v-slot="{ field, meta }"
                                                        v-model="accessibility.nearbyPlaces">
                                                        <div class="relative w-full">
                                                                <input v-bind="field" type="text" :class="{
                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[10px] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                        autocomplete="one-time-code"
                                                                        placeholder="Nearby Places" />
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="nearby_places" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>


                                                <div class="grid grid-cols-2 gap-3">


                                                        <button v-if="tabIndex > 0"
                                                                class="w-full h-[5vh]  rounded-[10px] bg-cbre_primary_3/60 text-cbre_primary_5/50"
                                                                type="button" @click="handleGoBack">Prev</button>
                                                        <button class="w-full h-[5vh]  rounded-[10px]" type="submit"
                                                                :disabled="!meta.valid"
                                                                :class="meta.valid ? 'bg-cbre_primary_2 text-white' : 'bg-cbre_primary_1/60 text-cbre_primary_5/50'">Next</button>

                                                </div>
                                        </VeeForm>
                                </ClientOnly>

                        </div>

                </div>
                <div class="relative flex-1 pl-[2.5em]" :class="debug ? 'flex w-1/2' : 'hidden'">
                        <AssetRegisterPreview />

                </div>
        </div>
</template>

<script setup lang="ts">

import { usePropertyStore } from '~/stores/property';
const { debug, shrinkPreview, growPreview, accessibility } = storeToRefs(usePropertyStore());
const { tabIndex } = defineProps({
        tabIndex: {
                required: true,
                type: Number
        }
})
const emit = defineEmits(["next"]);
import { object, string } from "yup";
import { toTypedSchema } from '@vee-validate/yup';
import { configure } from "vee-validate"

const isLoading = ref(false)

configure({
        validateOnBlur: false, // controls if `blur` events should trigger validation with `handleChange` handler
        validateOnChange: false, // controls if `change` events should trigger validation with `handleChange` handler
        validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
        validateOnModelUpdate: false, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})
const validationSchema = toTypedSchema(object(
        {
                distance_to_ic: string().nullable().label("DISTANCE TO IC"),
                time_taken_to_city_hall: string().nullable().label("TIME TAKEN TO CITY HALL"),
                time_taken_to_subway: string().nullable().label("TIME TAKEN TO SUBWAY"),
                nearby_facilities: string().nullable().label("NEARBY FACILITIES"),
                nearby_attractions: string().nullable().label("NEARBY ATTRACTIONS"),
                nearby_places: string().nullable().label("NEARBY PLACES"),
        }
));


const handleGoBack = () => {
        if (tabIndex - 1 > 0) {
                emit('next', tabIndex - 1);
        }
}

const handleSubmit = async (values: any, actions: any) => {
        isLoading.value = true
        try {
                emit('next', tabIndex + 1);
        } catch (error: any) {
                console.log(error)

        } finally {
                isLoading.value = false
                //actions.resetForm();
        }
}


</script>

<style scoped></style>