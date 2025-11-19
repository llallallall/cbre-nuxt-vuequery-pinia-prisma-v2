
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
                                        Construction History
                                </div>


                                <ClientOnly>
                                        <VeeForm @submit="handleSubmit" v-slot="{ meta }" class=" space-y-5">
                                                <div v-for="(history, index) in   historyList  " :key="index">
                                                        <div class="flex justify-start mt-4">

                                                                <div class="min-w-[6em] mr-[0.4em]
                                                                flex items-center justify-center
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none 
                                                                                text-white text-sm 
                                                                                  focus:outline-none ">

                                                                        <span v-if="index == 0"> Built Year</span>
                                                                        <span v-else>Renovated</span>

                                                                </div>

                                                                <VeeField :name="`historyList[${index}].year`"
                                                                        :value="historyList[index].year" :rules="yearRules"
                                                                        v-slot="{ field, meta }">
                                                                        <div class="relative w-full">

                                                                                <input v-bind="field" type="text" maxlength="4"
                                                                                        @change="handleChange(index, $event, meta.valid)"
                                                                                        :class="{
                                                                                                'bg-cbre_primary_2/10': (meta.valid && meta.touched),
                                                                                                'bg-cbre_system_12/10': !(meta.valid && meta.touched),
                                                                                                'rounded-[0_10px_10px_0]': index == 0,
                                                                                                'rounded-[0]': index > 0
                                                                                        }
                                                                                                "
                                                                                        class="relative w-full
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border border-[rgba(255,255,255,0.4)] outline-none 
                                                                                                        text-white 
                                                                                                        px-[1.5em] py-[0.5em]
                                                                                                        focus:outline-none 
                                                                                                        placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Enter Year" />
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
                                                                                        :name="`historyList[${index}].year`"
                                                                                        as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>



                                                                <button type="button" class="min-w-[6em] ml-[0.4em]
                                                                                        flex items-center justify-center
                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0] outline-none 
                                                                                        text-white text-sm 
                                                                                          focus:outline-none "
                                                                        @click="remove(index)" v-show="index != 0">
                                                                        Remove
                                                                </button>
                                                        </div>

                                                </div>
                                                <div class="grid grid-cols-3 gap-3">
                                                        <button class="w-full h-[5vh]  rounded-[10px] bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] outline-none 
                                                                                  text-white text-sm " type="button"
                                                                @click="addMore()"> Add More </button>

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
const { debug, shrinkPreview, growPreview, historyList } = storeToRefs(usePropertyStore());
const { tabIndex } = defineProps({
        tabIndex: {
                required: true,
                type: Number
        }
})
const emit = defineEmits(["next"]);
import { object, string } from "yup";
import { configure } from "vee-validate"

const isLoading = ref(false)

configure({
        validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
        validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
        validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
        validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})

const digitsOnly = (value: any) => /^\d+$/.test(value)
const yearRules = string().required().test('Digits only', 'The field should have digits only', digitsOnly).test((value: string) => {
        if ((new Date(value) > new Date('1900')) && (new Date(value) <= new Date())) {
                return true
        } else { return false }
}).min(4).max(4).label("Year")



const addMore = () => {
        let newHistory = { propertyId : '', year: '', type: '' }
        historyList.value.push(newHistory)

}

const remove = (index: number) => {
        historyList.value.splice(index, 1);
}

const handleChange = (index: number, event: any, valid: Boolean) => {
        if (valid) {
                let type = index === 0 ? 'COMPLETION' : 'RENOVATION'
                historyList.value[index].type = type
                historyList.value[index].year = event.target.value
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
                //console.log(values.historyList)

                // values.historyList.forEach((el: any, index: number) => { index === 0 ? el.type = 'COMPLETED' : el.type = 'RENOVATED' })
                // historyList.value = values.historyList
                emit('next', tabIndex + 1);
        } catch (error: any) {
                console.log(error)

        } finally {
                isLoading.value = false
        }
}


</script>

<style scoped></style>