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
                                        Facility
                                </div>

                                <ClientOnly>
                                        <VeeForm :validation-schema="validationSchema" @submit="handleSubmit" v-slot="{ meta }"
                                                class=" space-y-5">

                                                <div class="flex justify-stretch">

                                                        <div class="flex-none justify-self-start min-w-[16em] mr-[0.4em]
                                                                flex items-center justify-center
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none 
                                                                                text-white text-sm 
                                                                                  focus:outline-none 
                                                                                  select-none">


                                                                Elevators<span
                                                                        v-if="facility.elevators.total && Number(facility.elevators.total) > 0">&nbsp;({{
                                                                                facility.elevators.total }})</span>

                                                        </div>

                                                        <div class="grow grid grid-cols-3 gap-1">

                                                                <VeeField name="elevators_passenger" v-slot="{ field, meta }"
                                                                        v-model="facility.elevators.passenger">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Passenger"
                                                                                        @change.prevent="handleSumElevaotor" />
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
                                                                                <VeeErrorMessage name="elevators_passenger"
                                                                                        as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>

                                                                <VeeField name="elevators_service" v-slot="{ field, meta }"
                                                                        v-model="facility.elevators.service">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Service"
                                                                                        @change.prevent="handleSumElevaotor" />
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
                                                                                <VeeErrorMessage name="elevators_service"
                                                                                        as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>

                                                                <VeeField name="elevators_freight" v-slot="{ field, meta }"
                                                                        v-model="facility.elevators.shuttle">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Freight"
                                                                                        @change.prevent="handleSumElevaotor" />
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
                                                                                <VeeErrorMessage name="elevators_freight"
                                                                                        as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>
                                                        </div>

                                                </div>

                                                <div class="flex justify-stretch">

                                                        <div class="flex-none justify-self-start min-w-[16em]  mr-[0.4em]
                                                                flex items-center justify-center
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none 
                                                                                text-white text-sm 
                                                                                  focus:outline-none select-none">


                                                                <span>CPS</span>

                                                        </div>


                                                        <div class="flex-1 grid grid-cols-2 gap-1">


                                                                <VeeField name="cps_existing" v-slot="{ field, meta }"
                                                                        v-model="facility.parking.cpsExisting">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Existing" />
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
                                                                                <VeeErrorMessage name="cps_existing" as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>




                                                                <VeeField name="cps_required" v-slot="{ field, meta }"
                                                                        v-model="facility.parking.cpsRequired">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Required" />
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
                                                                                <VeeErrorMessage name="cps_required" as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>

                                                        </div>

                                                </div>


                                                <div class="flex justify-stretch">

                                                        <div class="flex-none justify-self-start min-w-[16em]  mr-[0.4em]
                                                                 flex items-center justify-center
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none 
                                                                                text-white text-sm 
                                                                                  focus:outline-none select-none">


                                                                <span>Free CPS </span>

                                                        </div>

                                                        <div class="flex-1 grid grid-cols-3 gap-1">

                                                                <VeeField name="free_cps_sqm" v-slot="{ field, meta }"
                                                                        v-model="facility.parking.freeCpsSqm">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="sqm" />
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
                                                                                <VeeErrorMessage name="free_cps_sqm" as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>

                                                                <VeeField name="free_cps_py" v-slot="{ field, meta }"
                                                                        v-model="facility.parking.freeCpsPy">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Free CPS py" />
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
                                                                                <VeeErrorMessage name="free_cps_py" as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>


                                                                <VeeField name="paid_parking_fee" v-slot="{ field, meta }"
                                                                        v-model="facility.parking.paidParkingFee">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Paid Parking Fee" />
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
                                                                                <VeeErrorMessage name="paid_parking_fee"
                                                                                        as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>

                                                        </div>


                                                </div>



                                                <div class="flex justify-stretch">

                                                        <div class="flex-none justify-self-start min-w-[16em]  mr-[0.4em]
                                                                 flex items-center justify-center
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none 
                                                                                text-white text-sm 
                                                                                  focus:outline-none select-none">


                                                                <span>Exterior </span>

                                                        </div>

                                                        <div class="flex-1 grid grid-cols-2 gap-1">

                                                                <VeeField name="roof_material" v-slot="{ field, meta }"
                                                                        v-model="facility.materials.roofMaterial">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Roof Material" />
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
                                                                                <VeeErrorMessage name="roof_material" as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>


                                                                <VeeField name="facade" v-slot="{ field, meta }"
                                                                        v-model="facility.materials.facade">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0ß] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Façade" />
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
                                                                                <VeeErrorMessage name="facade" as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>

                                                        </div>


                                                </div>







                                                <div class="flex justify-stretch">

                                                        <div class="flex-none justify-self-start min-w-[16em]  mr-[0.4em]
                                                                 flex items-center justify-center
                                                                                bg-[rgba(255,255,255,0.1)]
                                                                                  border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none 
                                                                                text-white text-sm 
                                                                                  focus:outline-none select-none">


                                                                <span>Interior </span>

                                                        </div>

                                                        <div class="flex-1 grid grid-cols-3 gap-1">

                                                                <VeeField name="mechanical_electrical" v-slot="{ field, meta }"
                                                                        v-model="facility.materials.mechanicalElectrical">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Mechanical Electrical" />
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
                                                                                <VeeErrorMessage name="mechanical_electrical"
                                                                                        as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>


                                                                <VeeField name="lighting" v-slot="{ field, meta }"
                                                                        v-model="facility.materials.lighting">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Lighting" />
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
                                                                                <VeeErrorMessage name="lighting" as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>


                                                                <VeeField name="fire_fighting" v-slot="{ field, meta }"
                                                                        v-model="facility.materials.fireFighting">
                                                                        <div class="relative w-full">
                                                                                <input v-bind="field" type="text" :class="{
                                                                                        'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                                                        'bg-cbre_system_12/10': !meta.valid && meta.touched
                                                                                }" class="relative w-full
                                                                        bg-[rgba(255,255,255,0.1)]
                                                                          border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0] outline-none 
                                                                        text-white 
                                                                          px-[1.5em] py-[0.5em]
                                                                          focus:outline-none 
                                                                          placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Fire Fighting" />
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
                                                                                <VeeErrorMessage name="fire_fighting" as="div"
                                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                                        </div>
                                                                </VeeField>

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

                        </div>

                </div>
                <div class="relative flex-1 pl-[2.5em]" :class="debug ? 'flex w-1/2' : 'hidden'">
                        <AssetRegisterPreview />

                </div>
        </div>
</template>

<script setup lang="ts">

import { usePropertyStore } from '~/stores/property';
const { debug, shrinkPreview, growPreview, facility } = storeToRefs(usePropertyStore());
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
        validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
        validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
        validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
        validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})

const digitsOnly = (value: any) => /^\d+$/.test(value)
const validationSchema = toTypedSchema(object(
        {
                elevators_total: string().nullable().label("Elevators Total"),
                elevators_passenger: string().test('Digits only', 'The field should have digits only', digitsOnly).nullable().label("Elevators Passenger"),
                elevators_service: string().test('Digits only', 'The field should have digits only', digitsOnly).nullable().label("Elevators Service"),
                elevators_freight: string().test('Digits only', 'The field should have digits only', digitsOnly).nullable().label("Elevators Freight"),
                cps_existing: string().test('Digits only', 'The field should have digits only', digitsOnly).nullable().label("CPS Existing"),
                cps_required: string().test('Digits only', 'The field should have digits only', digitsOnly).nullable().label("CPS Required"),
                free_cps_sqm: string().nullable().label("Free CPS sqm"),
                free_cps_py: string().nullable().label("FRee CPS py"),
                paid_parking_fee: string().nullable().label("Paid Parking Fee"),
                roof_material: string().nullable().label("Roof Material"),
                facade: string().nullable().label("Façade"),
                mechanical_electrical: string().nullable().label("Mechanical Electrical"),
                lighting: string().nullable().label("Lighting"),
                fire_fighting: string().nullable().label("Fire Fighting"),
        }
));

const handleSumElevaotor = (event: any) => {
        event.preventDefault();

        facility.value.elevators.total = Number(facility.value.elevators.passenger) + Number(facility.value.elevators.service) + Number(facility.value.elevators.shuttle)


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