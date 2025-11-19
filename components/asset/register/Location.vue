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
                                        Location
                                </div>

                                <ClientOnly>
                                        <VeeForm :validation-schema="validationSchema" @submit="handleSubmit" v-slot="{ meta }"
                                                class=" space-y-5">
                                                <div class="flex justify-start mt-4">

                                                        <div class="min-w-[6em] mr-[0.4em]
                                                                flex items-center justify-center
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none 
                                                                                text-white text-sm 
                                                                                  focus:outline-none ">

                                                                <span> Address</span>


                                                        </div>

                                                        <VeeField name="address_full" v-slot="{ field, meta }"
                                                                v-model="searchText">
                                                                <div class="relative w-full">

                                                                        <input v-bind="field" type="text" :class="{
                                                                                'bg-cbre_primary_2/10': (meta.valid && meta.touched),
                                                                                'bg-cbre_system_12/10': !(meta.valid && meta.touched)
                                                                        }"
                                                                                class="relative w-full
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border border-[rgba(255,255,255,0.4)] outline-none 
                                                                                                        text-white 
                                                                                                        px-[1.5em] py-[0.5em]
                                                                                                        focus:outline-none 
                                                                                                        placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                autocomplete="one-time-code"
                                                                                placeholder="Input Road Name Address to search latitude and longitude"
                                                                                @keypress="handleKeypress" />
                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                v-if="meta.valid && meta.touched">
                                                                                <i
                                                                                        class="fas fa-check text-cbre_primary_2/60"></i>
                                                                        </span>
                                                                        <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                                v-else-if="!meta.valid && meta.touched">
                                                                                <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                        </span>
                                                                        <VeeErrorMessage name="address_full" as="div"
                                                                                class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                </div>
                                                        </VeeField>



                                                        <button type="button" class="min-w-[6em] ml-[0.4em]
                                                                                        flex items-center justify-center
                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0] outline-none 
                                                                                        text-white text-sm 
                                                                                          focus:outline-none "
                                                                @click="$event.preventDefault(); handleSearch();">
                                                                Search
                                                        </button>
                                                </div>

                                                <div v-if="geocoderResult?.length > 0">
                                                        <div v-for="( result, index  ) in  geocoderResult "
                                                                :key="`geocoderResult${index}`" class="mb-2">

                                                                <Disclosure v-slot="{ open }">
                                                                        <DisclosureButton
                                                                                class="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium  
                                                                                hover:bg-cbre_primary_5 hover:text-cbre_primary_1 
                                                                                focus:outline-none focus-visible:ring focus-visible:ring-cbre_primary_2/75"
                                                                                :class="{
                                                                                        'bg-cbre_primary_5 text-cbre_primary_1': open && !(selectedId === result?.place_id),
                                                                                        'bg-[rgba(255,255,255,0.1)] text-cbre_primary_5': !open && !(selectedId === result?.place_id),
                                                                                        'bg-[rgba(255,255,255,0.1)] text-cbre_primary_1': open && (selectedId === result?.place_id),
                                                                                        'bg-[rgba(255,255,255,0.1)] text-cbre_primary_2': !open && (selectedId === result?.place_id),
                                                                                }
                                                                                        ">
                                                                                <span>{{ result.formatted_address }}</span>
                                                                                <div class="max-w-1/2 flex justify-between ">
                                                                                        <ChevronUpIcon
                                                                                                :class="open ? 'rotate-180 transform' : ''"
                                                                                                class="h-5 w-5 text-cbre_primary_2/60 self-end">

                                                                                        </ChevronUpIcon>
                                                                                        <div @click="handleSelect(result)"
                                                                                                class="px-2 py-1 rounded-[10px]"
                                                                                                :class="selectedId === result?.place_id ? 'bg-cbre_primary_2/50 text-white' : 'bg-white/50 text-black/50'">
                                                                                                Select</div>

                                                                                </div>

                                                                        </DisclosureButton>
                                                                        <DisclosurePanel
                                                                                class="py-2 pl-2 pr-0 text-sm text-cbre_primary_1">
                                                                                <!-- <pre>{{ result }}</pre> -->
                                                                                <div class="relative flex gap-0 w-full">


                                                                                        <div
                                                                                                class="min-w-[6em] w-1/2
                                                                                                        flex items-center justify-between
                                                                                                        p-1 pl-2
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border-0 outline-none 
                                                                                                        text-white/40 text-sm 
                                                                                                        focus:outline-none ">

                                                                                                <div class="flex-1">
                                                                                                        Type
                                                                                                        :</div>
                                                                                                <div
                                                                                                        class="text-white/80 flex-1">
                                                                                                        {{
                                                                                                                result?.geometry?.location_type
                                                                                                        }}</div>


                                                                                        </div>

                                                                                        <div
                                                                                                class="min-w-[6em] w-1/2
                                                                                                        flex items-center justify-between
                                                                                                        p-1 pl-2
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border-0 outline-none 
                                                                                                        text-white/40 text-sm 
                                                                                                        focus:outline-none ">

                                                                                                <div class="flex-1">
                                                                                                        Partial Match
                                                                                                        :</div>
                                                                                                <div
                                                                                                        class="text-white/80 flex-1">
                                                                                                        {{
                                                                                                                result?.partial_match
                                                                                                        }}</div>


                                                                                        </div>

                                                                                </div>
                                                                                <div class="relative flex gap-0  w-full">


                                                                                        <div
                                                                                                class="min-w-[6em] w-1/2
                                                                                                        flex items-center justify-between
                                                                                                        p-1 pl-2
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border-0 outline-none 
                                                                                                        text-white/40 text-sm 
                                                                                                        focus:outline-none ">

                                                                                                <div class="flex-1">
                                                                                                        Latitude
                                                                                                        :</div>
                                                                                                <div
                                                                                                        class="text-white/80 flex-1">
                                                                                                        {{
                                                                                                                result?.geometry?.location.toString().split(',')[0].replace('(',
                                                                                                                        '')
                                                                                                        }}</div>


                                                                                        </div>

                                                                                        <div
                                                                                                class="min-w-[6em] w-1/2
                                                                                                        flex items-center justify-between
                                                                                                        p-1 pl-2
                                                                                                        bg-[rgba(255,255,255,0.1)]
                                                                                                        border-0 outline-none 
                                                                                                        text-white/40 text-sm 
                                                                                                        focus:outline-none ">

                                                                                                <div class="flex-1">
                                                                                                        Longitude
                                                                                                        :</div>
                                                                                                <div
                                                                                                        class="text-white/80 flex-1">
                                                                                                        {{
                                                                                                                result?.geometry?.location.toString().split(',')[1].replace(')',
                                                                                                                        '')
                                                                                                        }}</div>


                                                                                        </div>

                                                                                </div>
                                                                        </DisclosurePanel>
                                                                </Disclosure>

                                                        </div>
                                                </div>





                                                <div class=" grid grid-cols-2 gap-3">


                                                        <button v-if="tabIndex > 0"
                                                                class="w-full h-[5vh]  rounded-[10px] bg-cbre_primary_3/60 text-cbre_primary_5/50"
                                                                type="button" @click="handleGoBack">Prev</button>
                                                        <button class="w-full h-[5vh]  rounded-[10px]" type="submit"
                                                                :disabled="!meta.valid"
                                                                :class="meta.valid && location?.addressFull ? 'bg-cbre_primary_2 text-white' : 'bg-cbre_primary_1/60 text-cbre_primary_5/50'">Next</button>

                                                </div>
                                        </VeeForm>
                                </ClientOnly>
                                <!-- <div>

                                {{location}}

                                </div> -->

                        </div>

                </div>
                <div class="relative flex-1 pl-[2.5em]" :class="debug ? 'flex w-1/2' : 'hidden'">
                        <AssetRegisterPreview />

                </div>
        </div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronUpIcon } from '@heroicons/vue/solid'
import googleMapsApi from '@/composables/useGoogleMapsApi';
import { usePropertyStore } from '~/stores/property';
import { object, string } from "yup";
import { toTypedSchema } from '@vee-validate/yup';
import { configure } from "vee-validate"
import { createToast } from 'mosha-vue-toastify';

onBeforeMount(async () => {
        await googleMapsApi();
        // new google.maps.places.Autocomplete(addressInput.value);
})


const { debug, shrinkPreview, growPreview, location } = storeToRefs(usePropertyStore());

console.log("Location.vue")
console.log(location)

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
        validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
        validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
        validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})
const validationSchema = toTypedSchema(object(
        {
                address_full: string().required().min(4).label("Address"),
        }
));

interface GeocoderResultProps {
        types: string[],
        formatted_address: string,
        address_components: {
                short_name: string,
                long_name: string,
                postcode_localities: string[],
                types: string[]
        }[],
        partial_match: boolean,
        place_id: string,
        plus_code: {
                compound_code: string,
                global_code: string
        },
        postcode_localities: string[],
        geometry: {
                location: any,
                location_type: string
                viewport: any,
                bounds: any
        }
}
const searchText = ref(location?.value?.addressFull)
const geocoderResult = ref([] as GeocoderResultProps[])
const selectedId = ref('')

const handleSelect = (result: GeocoderResultProps) => {

              // toggle select
        if (selectedId.value) {
                selectedId.value = ''

                // reset
                location.value.addressFull = ''
                location.value.addressFullJibun = ''
                location.value.addressProvince = ''
                location.value.addressCity = ''
                location.value.latitude = Number('')
                location.value.longitude = Number('')

        } else {
                selectedId.value = result.place_id

                location.value.addressFull = result.formatted_address
                location.value.addressFullJibun = result?.plus_code?.compound_code
                location.value.addressProvince = result.address_components.find((el: any) => el.types.includes('administrative_area_level_1'))?.long_name as string
                location.value.addressCity = result.address_components.find((el: any) => el.types.includes('locality'))?.long_name as string
                location.value.latitude = Number(result?.geometry?.location.toString().split(',')[0].replace('(',
                        ''))
                location.value.longitude = Number(result?.geometry?.location.toString().split(',')[1].replace(')',
                        ''))

        }

        //   console.log(result)
}

const handleKeypress = (event: any) => {
        if (event.key === 'Enter') {
                event.preventDefault();
                return handleSearch()
        }
        return event
}



const handleSearch = () => {

        let keyword = searchText.value + '' as string

        geocoderResult.value = [];

        try {
                //@ts-ignore
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: keyword }, (results: GeocoderResultProps[], status: any) => {

                        if (status == "OK" && results.length > 0) {
                                console.log(results[0].geometry.location)
                                geocoderResult.value = results
                                createToast({
                                        title: 'The search was successful.',
                                        description: 'Select one address from the address list'
                                }, {
                                        type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                                        timeout: 5000,
                                        showCloseButton: true,
                                        position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                        transition: 'bounce',
                                        hideProgressBar: false,
                                        swipeClose: true,
                                })

                        } else {
                                console.log('google geocoder callback : ' + status)
                                createToast({
                                        title: 'Address search failed.',
                                        description: `Google Geocoder callback+${status}`
                                }, {
                                        type: 'warning', // 'info', 'danger', 'warning', 'success', 'default'
                                        timeout: 5000,
                                        showCloseButton: true,
                                        position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                        transition: 'bounce',
                                        hideProgressBar: false,
                                        swipeClose: true,
                                })
                        }
                }
                );
        } catch (error) {
                console.log(error)
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