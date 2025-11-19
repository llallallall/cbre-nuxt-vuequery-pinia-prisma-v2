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
                                        Floor
                                </div>

                                <ClientOnly>
                                        <VeeForm :validation-schema="validationSchema" @submit="handleSubmit" v-slot="{ meta }"
                                                class="flex-col space-y-5">



                                                <div class="flex justify-stretch">

                                                        <div class="flex-none justify-self-start min-w-[16em] mr-[0.4em]
                                                                flex items-center justify-center
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none 
                                                                                text-white text-sm 
                                                                                  focus:outline-none 
                                                                                  select-none">


                                                                <span>Upper Levels</span>

                                                        </div>

                                                        <div class="grow grid grid-cols-q gap-1">
                                                                <div class="relative w-full">
                                                                        <VeeField name="upper_levels_count"
                                                                                v-model="sizes.upperLevels"
                                                                                v-slot="{ field, meta }">
                                                                                <input v-bind="field" type="text" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0] outline-none 
                                                                        text-white text-right
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]
                                                                         " :class="{
                                                                                 'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                 'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                         }" autocomplete="one-time-code"
                                                                                        placeholder="Enter the number of ground floors"
                                                                                        @keyup="$event.preventDefault(); handleMakeUpperInputs();" />
                                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                        v-if="meta.valid && meta.touched">
                                                                                        <i
                                                                                                class="fas fa-check text-cbre_primary_2/60"></i>
                                                                                </span>
                                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                        v-else-if="!meta.valid && meta.touched">
                                                                                        <i
                                                                                                class="fas fa-x text-cbre_system_12/60 "></i>
                                                                                </span>
                                                                                <VeeErrorMessage name="upper_levels_count"
                                                                                        as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </VeeField>
                                                                </div>
                                                        </div>


                                                </div>

                                                <div v-if="sizes.upperLevels && sizes.upperLevels !== 0"
                                                        class="grid grid-cols-1 pl-10">


                                                        <div class="relative flex justify-stretch"
                                                                v-for="(item, index) in floorList.filter((el:any)=> el.type == 'UPPER').sort(( a:any, b:any) => {return b.floor - a.floor}) " :key="index">

                                                                <div class="flex-none justify-self-start min-w-[16em]  mr-[0.4em]
                                                                                flex items-center justify-center
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none 
                                                                                text-white text-sm 
                                                                                  focus:outline-none select-none">


                                                                        <span>{{ (item.type+'').toLowerCase() }}&nbsp;{{ item.floor }}</span>

                                                                </div>

                                                                <div class="flex-1 grid grid-cols-3 gap-1">

                                                                        <VeeField :name="`ceiling_height_upper_${index}`"
                                                                                v-slot="{ field, meta }"
                                                                                v-model="floorList.filter((el:any)=> el.type == 'UPPER')[index].ceilingHeight">
                                                                                <div class="relative w-full">
                                                                                        <input v-bind="field" type="text"
                                                                                                :class="{
                                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                                }"
                                                                                                class="relative w-full
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                                                        text-white text-right 
                                                                                                        px-[1.5em] py-[0.5em]
                                                                                                        focus:outline-none 
                                                                                                        placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                                autocomplete="one-time-code"
                                                                                                placeholder="Ceiling Height" />
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-if="meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-check text-cbre_primary_2/60"></i>
                                                                                        </span>
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-else-if="!meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-x text-cbre_system_12/60 "></i>
                                                                                        </span>
                                                                                        <VeeErrorMessage
                                                                                                :name="`ceiling_height_upper_${index}`"
                                                                                                as="div"
                                                                                                class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                                </div>
                                                                        </VeeField>

                                                                        <VeeField :name="`floor_load_upper_${index}`"
                                                                                v-slot="{ field, meta }"
                                                                                v-model="floorList.filter((el:any)=> el.type == 'UPPER')[index].floorLoad">
                                                                                <div class="relative w-full">
                                                                                        <input v-bind="field" type="text"
                                                                                                :class="{
                                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                                }"
                                                                                                class="relative w-full
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                                                        text-white text-right 
                                                                                                        px-[1.5em] py-[0.5em]
                                                                                                        focus:outline-none 
                                                                                                        placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                                autocomplete="one-time-code"
                                                                                                placeholder="Floor Load" />
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-if="meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-check text-cbre_primary_2/60"></i>
                                                                                        </span>
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-else-if="!meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-x text-cbre_system_12/60 "></i>
                                                                                        </span>
                                                                                        <VeeErrorMessage
                                                                                                :name="`floor_load_upper_${index}`"
                                                                                                as="div"
                                                                                                class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                                </div>
                                                                        </VeeField>


                                                                        <VeeField :name="`truck_berths_upper_${index}`"
                                                                                v-slot="{ field, meta }"
                                                                                v-model="floorList.filter((el:any)=> el.type == 'UPPER')[index].truckBerths">
                                                                                <div class="relative w-full">
                                                                                        <input v-bind="field" type="text"
                                                                                                :class="{
                                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                                }"
                                                                                                class="relative w-full
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0] outline-none 
                                                                                                        text-white text-right 
                                                                                                        px-[1.5em] py-[0.5em]
                                                                                                        focus:outline-none 
                                                                                                        placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                                autocomplete="one-time-code"
                                                                                                placeholder="Truck Berths" />
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-if="meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-check text-cbre_primary_2/60"></i>
                                                                                        </span>
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-else-if="!meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-x text-cbre_system_12/60 "></i>
                                                                                        </span>
                                                                                        <VeeErrorMessage
                                                                                                :name="`truck_berths_basement_${index}`"
                                                                                                as="div"
                                                                                                class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                                </div>
                                                                        </VeeField>

                                                                </div>


                                                        </div>


                                                </div>



                                                <div class="flex justify-stretch">

                                                        <div class="flex-none justify-self-start min-w-[16em] mr-[0.4em]
                                                                flex items-center justify-center
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none 
                                                                                text-white text-sm 
                                                                                  focus:outline-none 
                                                                                  select-none">


                                                                <span>Basement Levels</span>

                                                        </div>

                                                        <div class="grow grid grid-cols-1 gap-1">
                                                                <div class="relative w-full">
                                                                        <VeeField name="basement_levels_count"
                                                                                v-model="sizes.basementLevels"
                                                                                v-slot="{ field, meta }">
                                                                                <input v-bind="field" type="text"
                                                                                        class="relative w-full
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0] outline-none 
                                                                                text-white  text-right
                                                                                px-[1.5em] py-[0.5em]
                                                                                focus:outline-none 
                                                                                placeholder:text-[rgba(255,255,255,0.4)]" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" autocomplete="one-time-code"
                                                                                        placeholder="Enter the number of basement floors"
                                                                                        @keyup="handleMakeBasementInputs" />
                                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                        v-if="meta.valid && meta.touched">
                                                                                        <i
                                                                                                class="fas fa-check text-cbre_primary_2/60"></i>
                                                                                </span>
                                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                        v-else-if="!meta.valid && meta.touched">
                                                                                        <i
                                                                                                class="fas fa-x text-cbre_system_12/60 "></i>
                                                                                </span>
                                                                                <VeeErrorMessage name="basement_levels_count"
                                                                                        as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </VeeField>
                                                                </div>

                                                        </div>

                                                </div>

                                                <div v-if="floorList.filter( (el:any)=> el.type == 'BASEMENT') && floorList.filter((el:any)=>el.type == 'BASEMENT').length !== 0"
                                                        class="grid grid-cols-1 pl-10">

                                                        <div class="relative flex justify-stretch"
                                                                v-for="(item, index) in floorList.filter((el:any)=>el.type == 'BASEMENT').sort(( a:any, b:any) => {return a.floor - b.floor}) " :key="`basement${index}`">

                                                                <div class="flex-none justify-self-start min-w-[16em]  mr-[0.4em]
                                                                                flex items-center justify-center
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none 
                                                                                text-white text-sm 
                                                                                  focus:outline-none select-none">


                                                                        <span>{{ (item.type+'').toLowerCase() }}&nbsp;{{ item.floor }}</span>

                                                                </div>

                                                                <div class="flex-1 grid grid-cols-3 gap-1">

                                                                        <VeeField :name="`ceiling_height_basement_${index}`"
                                                                                v-slot="{ field, meta }"
                                                                                v-model="floorList.filter((el:any)=>el.type == 'BASEMENT')[index].ceilingHeight">
                                                                                <div class="relative w-full">
                                                                                        <input v-bind="field" type="text"
                                                                                                :class="{
                                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                                }"
                                                                                                class="relative w-full
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                                                        text-white text-right 
                                                                                                        px-[1.5em] py-[0.5em]
                                                                                                        focus:outline-none 
                                                                                                        placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                                autocomplete="one-time-code"
                                                                                                placeholder="Ceiling Height" />
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-if="meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-check text-cbre_primary_2/60"></i>
                                                                                        </span>
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-else-if="!meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-x text-cbre_system_12/60 "></i>
                                                                                        </span>
                                                                                        <VeeErrorMessage
                                                                                                :name="`ceiling_height_basement_${index}`"
                                                                                                as="div"
                                                                                                class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                                </div>
                                                                        </VeeField>

                                                                        <VeeField :name="`floor_load_basement_${index}`"
                                                                                v-slot="{ field, meta }"
                                                                                v-model="floorList.filter((el:any)=>el.type == 'BASEMENT')[index].floorLoad">
                                                                                <div class="relative w-full">
                                                                                        <input v-bind="field" type="text"
                                                                                                :class="{
                                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                                }"
                                                                                                class="relative w-full
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                                                        text-white text-right 
                                                                                                        px-[1.5em] py-[0.5em]
                                                                                                        focus:outline-none 
                                                                                                        placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                                autocomplete="one-time-code"
                                                                                                placeholder="Floor Load" />
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-if="meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-check text-cbre_primary_2/60"></i>
                                                                                        </span>
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-else-if="!meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-x text-cbre_system_12/60 "></i>
                                                                                        </span>
                                                                                        <VeeErrorMessage
                                                                                                :name="`floor_load_basement_${index}`"
                                                                                                as="div"
                                                                                                class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                                </div>
                                                                        </VeeField>


                                                                        <VeeField :name="`truck_berths_basement_${index}`"
                                                                                v-slot="{ field, meta }"
                                                                                v-model="floorList.filter((el:any)=>el.type == 'BASEMENT')[index].truckBerths">
                                                                                <div class="relative w-full">
                                                                                        <input v-bind="field" type="text"
                                                                                                :class="{
                                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                                }"
                                                                                                class="relative w-full
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0] outline-none 
                                                                                                        text-white text-right 
                                                                                                        px-[1.5em] py-[0.5em]
                                                                                                        focus:outline-none 
                                                                                                        placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                                autocomplete="one-time-code"
                                                                                                placeholder="Truck Berths" />
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-if="meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-check text-cbre_primary_2/60"></i>
                                                                                        </span>
                                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                                v-else-if="!meta.valid && meta.touched">
                                                                                                <i
                                                                                                        class="fas fa-x text-cbre_system_12/60 "></i>
                                                                                        </span>
                                                                                        <VeeErrorMessage
                                                                                                :name="`truck_berths_basement_${index}`"
                                                                                                as="div"
                                                                                                class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                                </div>
                                                                        </VeeField>

                                                                </div>



                                                        </div>

                                                </div>

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
                                <!-- <div>
                                {{ floorList }}
                                </div> -->

                        </div>

                </div>
                <div class="relative flex-1 pl-[2.5em]" :class="debug ? 'flex w-1/2' : 'hidden'">
                        <AssetRegisterPreview />

                </div>
        </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import { object, string } from "yup";
import { toTypedSchema } from '@vee-validate/yup';
import { configure } from "vee-validate"

import { storeToRefs } from 'pinia'
import { usePropertyStore } from '~/stores/property';
const { debug, shrinkPreview, growPreview, floorList, sizes } = storeToRefs(usePropertyStore());
const { tabIndex } = defineProps({
        tabIndex: {
                required: true,
                type: Number
        }
})
const emit = defineEmits(["next"]);

const isLoading = ref(false)

configure({
        validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
        validateOnChange: false, // controls if `change` events should trigger validation with `handleChange` handler
        validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
        validateOnModelUpdate: false, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})

const digitsOnly = (value: any) => /^\d+$/.test(value)

const validationSchema = toTypedSchema(object(
        {

                upper_levels_count: string().test('Digits only', 'The field should have digits only', digitsOnly).required().label("Upper Levels"),
                basement_levels_count: string().test('Digits only', 'The field should have digits only', digitsOnly).required().label("Basement Levels"),

        }
));

onMounted(()=>{

        console.log(floorList.value)
        if (sizes.value.upperLevels && Number(sizes.value.upperLevels) >= 0) {

                handleMakeUpperInputs();
        }
        
        if (sizes.value.basementLevels && Number(sizes.value.basementLevels) >= 0) {
                handleMakeBasementInputs();
        }
})
const handleMakeUpperInputs = () => {

        let item = {
                type: 'UPPER',
                floor: null,
                ceilingHeight: null,
                ceilingHeightUnit: '',
                floorLoad: null,
                floorLoadUnit: '',
                truckBerths: null,
                use: null,
                totalAreaSqm: null,
                totalAreaPy: null,
        } as any

        
        let array = new Array()
        
        if (sizes.value.upperLevels && Number(sizes.value.upperLevels) >= 0) {
                let maxLevel = sizes.value.upperLevels ?? 0 

                // make empty array
                for (let i = 0; i < Number(sizes.value.upperLevels); i++) {
                        array.push({ ...item, floor: i + 1 })
                }
  
                // if not exist, makes empty inputs
                let existUpperLevels = floorList.value.filter((el:any)=> el.type && el.type == 'UPPER' && el.floor <= maxLevel)
                let existUpperFloorArray = new Array()
                
                for(let i=0; i < existUpperLevels.length; i++) {
                        if(!existUpperFloorArray.includes(existUpperLevels[i].floor) ) existUpperFloorArray.push(existUpperLevels[i].floor)
                }

                let basementLevels = floorList.value.filter((el:any)=> el.type && el.type == 'BASEMENT' )
                let doesNotExistUpperLevels = array.filter(el => !existUpperFloorArray.includes(el.floor))
                let newUpperLevels = [...existUpperLevels, ...doesNotExistUpperLevels]
                let newUpperLevels_desc = newUpperLevels.sort((a, b) => {
                        return b.floor - a.floor;
                });

                
                let upperLevels = newUpperLevels_desc.filter((el:any) => el.floor <= maxLevel)
                
                floorList.value = [...upperLevels, ...basementLevels]

        }

}

const handleMakeBasementInputs = () => {
        let item = {
                type: 'BASEMENT',
                floor: null,
                ceilingHeight: null,
                ceilingHeightUnit: '',
                floorLoad: null,
                floorLoadUnit: '',
                truckBerths: null,
                use: null,
                totalAreaSqm: null,
                totalAreaPy: null,
        } as any

        
        let array = new Array()
        
        if (sizes.value.basementLevels && Number(sizes.value.basementLevels) >= 0) {
                let maxLevel = sizes.value.basementLevels ?? 0 

                // make empty array
                for (let i = 0; i < Number(sizes.value.basementLevels); i++) {
                        array.push({ ...item, floor: i + 1 })
                }
  
                // if not exist, makes empty inputs
                let existBasementLevels = floorList.value.filter((el:any)=> el.type && el.type == 'BASEMENT' && el.floor <= maxLevel  )
                let existBasementFloorArray = new Array()
                
                for(let i=0; i < existBasementLevels.length; i++) {
                        if(!existBasementFloorArray.includes(existBasementLevels[i].floor)) existBasementFloorArray.push(existBasementLevels[i].floor)
                }
                let upperLevels = floorList.value.filter((el:any)=> el.type && el.type == 'UPPER' )
                let doesNotExistBasementLevels = array.filter(el => !existBasementFloorArray.includes(el.floor))
                let newBasementLevels = [...existBasementLevels, ...doesNotExistBasementLevels]
                let newBasementLevels_asc = newBasementLevels.sort((a:any, b:any) => {
                        return a.floor - b.floor;
                });
                
                let basementLevels = newBasementLevels_asc.filter((el:any) => el.floor <= maxLevel)
                
                floorList.value = [...upperLevels, ...basementLevels]

        }
}


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