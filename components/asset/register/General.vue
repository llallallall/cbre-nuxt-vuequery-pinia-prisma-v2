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
                                        General Infomation
                                </div>

                                <ClientOnly>
                                        <VeeForm :validation-schema="validationSchema" @submit="handleSubmit" v-slot="{ meta }"
                                                class=" space-y-5">
                                                <VeeField name="name" v-slot="{ field, meta }" v-model="propertyName">
                                                        <div class="relative w-full">
                                                                <input v-bind="field" type="text" :class="(meta.valid && meta.touched) ? 'bg-cbre_primary_2/10' :
                                                                        'bg-cbre_system_12/10'
                                                                        " class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[10px] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                        autocomplete="one-time-code"
                                                                        placeholder="Property Name" />
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="name" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>




                                                <VeeField name="sector" v-slot="{ field, errorMessage }"
                                                        v-model="general.sector" :rules="validateField">
                                                        <VeeSelectInput :options="menuStore.sector" v-bind="field" key-prop="id"
                                                                label-prop="name" />

                                                        <span class="text-red-500">{{ errorMessage }}</span>
                                                </VeeField>


                                                <div class="w-full
                                                bg-[rgba(255,255,255,0.1)]
                                                border border-[rgba(255,255,255,0.4)] rounded-[10px] outline-none 
                                                text-white 
                                                px-[1.3em] py-[0.5em]
                                                focus:outline-none ">

                                                        <VeeSelectInputComposed
                                                                :options="menuStore.subsector.filter((el) => { return el.sector_id === general.sector?.id })"
                                                                name="subsector" v-model="general.subSector" key-prop="name"
                                                                :composed="general.sector" label-prop="name"
                                                                :rules="validateField" />

                                                </div>

                                                <div v-if="general?.sector?.name === 'Logistics'" class="w-full
                                                bg-[rgba(255,255,255,0.1)]
                                                border border-[rgba(255,255,255,0.4)] rounded-[10px] outline-none 
                                                text-white 
                                                px-[1.3em] py-[0.5em]
                                                focus:outline-none ">

                                                        <div class="grid grid-cols-3 gap-3 text-sm ">
                                                                <div class="flex flex-col">
                                                                        <div class="w-full text-center">Room</div>
                                                                        <div class="relative w-full">
                                                                                <input v-model="general.warehouse.room"
                                                                                        type="text"
                                                                                        @change.prevent="handleSumTemperature"
                                                                                        class="w-full text-right pr-[1.5em] bg-transparent outline-none border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] min-h-[2em]" />
                                                                                <label
                                                                                        class="absolute top-[50%] -translate-y-[50%] right-0 pr-[0.5em]">%</label>
                                                                        </div>
                                                                </div>
                                                                <div class="flex flex-col">
                                                                        <div class="w-full text-center ">Low</div>
                                                                        <div class="relative w-full">
                                                                                <input v-model="general.warehouse.low"
                                                                                        type="text"
                                                                                        @change.prevent="handleSumTemperature"
                                                                                        class="w-full text-right pr-[1.5em] bg-transparent outline-none border border-[rgba(255,255,255,0.4)] rounded-[0] min-h-[2em]" />
                                                                                <label
                                                                                        class="absolute top-[50%] -translate-y-[50%] right-0 pr-[0.5em]">%</label>
                                                                        </div>
                                                                </div>
                                                                <div class="flex flex-col">
                                                                        <div class="w-full text-center">Constant</div>
                                                                        <div class="relative w-full">
                                                                                <input disabled
                                                                                        v-model="general.warehouse.constant"
                                                                                        type="text"
                                                                                        class="w-full text-right pr-[1.5em] bg-transparent outline-none border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0px] min-h-[2em]" />
                                                                                <label
                                                                                        class="absolute top-[50%] -translate-y-[50%] right-0 pr-[0.5em]">%</label>
                                                                        </div>
                                                                </div>

                                                        </div>

                                                </div>

                                                <VeeField name="noOfBuildings" v-slot="{ field, errorMessage }"
                                                        v-model="sizes.noOfBuildings" :rules="numberRules">

                                                        <input v-bind="field" type="text" maxlength="2" autocomplete="one-time-code"
                                                                                        placeholder="No. of Buildings" 
                                                                                        class="relative w-full rounded-[10px] 
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border border-[rgba(255,255,255,0.4)] outline-none 
                                                                                                        text-white 
                                                                                                        px-[1.5em] py-[0.5em]
                                                                                                        focus:outline-none 
                                                                                                        placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        />        

                                                        <span class="text-red-500">{{ errorMessage }}</span>
                                                </VeeField>

                                                <button class="w-full h-[5vh] rounded-[10px] outline-none" type="submit"
                                                        :disabled="!meta.valid"
                                                        :class="meta.valid ? 'bg-cbre_primary_2 text-white' : 'bg-cbre_primary_1/60 text-cbre_primary_5/50'">Next</button>
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
import { useMenuStore } from '~/stores/menu';
const menuStore = useMenuStore()

import { usePropertyStore } from '~/stores/property';
const {propertyName, general, sizes } = storeToRefs(usePropertyStore());
const { debug, shrinkPreview, growPreview} = storeToRefs(useModifyPanelStore());


const { tabIndex } = defineProps({
        tabIndex: {
                required: true,
                type: Number
        }
})
const emit = defineEmits(["next"]);
// const debug = ref(true)
import { object, string } from "yup";
import { toTypedSchema } from '@vee-validate/yup';
import { configure } from "vee-validate"

const isLoading = ref(false)

const digitsOnly = (value: any) => /^\d+$/.test(value)
const numberRules = string().required().test('Digits only', 'The field should have digits only', digitsOnly).test((value: string) => {
        if (Number(value) > 0) {
                return true
        } else { return false }
}).min(1).max(2).label("no. of Buildings")

configure({
        validateOnBlur: false, // controls if `blur` events should trigger validation with `handleChange` handler
        validateOnChange: false, // controls if `change` events should trigger validation with `handleChange` handler
        validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
        validateOnModelUpdate: false, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})
const validationSchema = toTypedSchema(object(
        {
                name: string().required().min(4).label("Property Name"),
                sector: object().required().label("Sector"),
        }
));



function validateField(value: any) {
        // console.log(value)
        if (!value) {
                return "This field is required";
        }

        if (value.name === "Invalid") {
                return "This field is invalid";
        }

        return true;
}


const handleSumTemperature = (event: any) => {
        event.preventDefault();
        if (Number(general.value.warehouse.room) > 100) return
        if (Number(general.value.warehouse.low) > 100) return
        general.value.warehouse.constant = (100 - Number(general.value.warehouse.room) - Number(general.value.warehouse.low))


}
const handleSubmit = async (values: any, actions: any) => {
        isLoading.value = true
        try {
                //console.log(values)
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