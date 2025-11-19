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
                                        Sizes and Measurements
                                </div>

                                <ClientOnly>
                                        <VeeForm :validation-schema="validationSchema" @submit="handleSubmit" v-slot="{ meta }"
                                                class=" space-y-5">
                                                <div class="grid grid-cols-2 gap-4">

                                                        
                                               
                                                <VeeField name="gfaSqm" v-slot="{ field, meta }" v-model="sizes.gfaSqm">
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
                                                                        autocomplete="one-time-code" placeholder="gfaSqm" @change="convertSqmPy('gfa')"
                                                                        />
                                                                        <span v-if="sizes.gfaSqm" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                                gfa sqm
                                                                </span>          
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="gfaSqm" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>




                                                <VeeField name="gfaPy" v-slot="{ field, meta }"
                                                        v-model="sizes.gfaPy">
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
                                                                        placeholder="gfaPy" />
                                                                        <span v-if="sizes.gfaPy" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                                gfa py
                                                                </span>          
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="gfaPy" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>


                                                <VeeField name="nfaSqm" v-slot="{ field, meta }"
                                                        v-model="sizes.nfaSqm">
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
                                                                        placeholder="nfaSqm" 
                                                                        @change="convertSqmPy('nfa')"
                                                                        />
                                                                <span v-if="sizes.nfaSqm" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                        nfa sqm
                                                                </span>        
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="nfaSqm" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>


                                                <VeeField name="nfaPy" v-slot="{ field, meta }"
                                                        v-model="sizes.nfaPy">
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
                                                                        placeholder="nfaPy" />
                                                                <span v-if="sizes.nfaPy" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                                nfa py
                                                                </span> 
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="nfaPy" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>

                                                <VeeField name="siteAreaSqm" v-slot="{ field, meta }"
                                                        v-model="sizes.siteAreaSqm">
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
                                                                        placeholder="siteAreaSqm" 
                                                                        @change="convertSqmPy('siteArea')"
                                                                        />
                                                                <span v-if="sizes.siteAreaSqm" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                        site area sqm
                                                                </span> 
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="siteAreaSqm" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>


                                                <VeeField name="siteAreaPy" v-slot="{ field, meta }"
                                                        v-model="sizes.siteAreaPy">
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
                                                                        placeholder="siteAreaPy" />
                                                                        <span v-if="sizes.siteAreaPy" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                        site area py
                                                                </span> 
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="siteAreaPy" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>


                                                <VeeField name="grossLeasableAreaSqm" v-slot="{ field, meta }"
                                                        v-model="sizes.grossLeasableAreaSqm">
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
                                                                        placeholder="grossLeasableAreaSqm" 
                                                                        @change="convertSqmPy('grossLeasableArea')"
                                                                        />
                                                                <span v-if="sizes.grossLeasableAreaSqm" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                        gross leasable area sqm
                                                                </span> 
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="grossLeasableAreaSqm" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>

                                                <VeeField name="grossLeasableAreaPy" v-slot="{ field, meta }"
                                                        v-model="sizes.grossLeasableAreaPy">
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
                                                                        placeholder="grossLeasableAreaPy" />
                                                                <span v-if="sizes.grossLeasableAreaPy" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                        gross leasable area py
                                                                </span> 
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="grossLeasableAreaPy" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>

                                                <VeeField name="netLeasableAreaSqm" v-slot="{ field, meta }"
                                                        v-model="sizes.netLeasableAreaSqm">
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
                                                                        placeholder="netLeasableAreaSqm"
                                                                        @change="convertSqmPy('netLeasableArea')"
                                                                         />
                                                                <span v-if="sizes.netLeasableAreaSqm" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                        net leasable area sqm
                                                                </span> 
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="netLeasableAreaSqm" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>

                                                <VeeField name="netLeasableAreaPy" v-slot="{ field, meta }"
                                                        v-model="sizes.netLeasableAreaPy">
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
                                                                        placeholder="netLeasableAreaPy" />
                                                                
                                                                <span v-if="sizes.netLeasableAreaPy" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                        net leasable area py
                                                                </span> 
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="netLeasableAreaPy" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>


                                                <VeeField name="floorAreaRatioExisting" v-slot="{ field, meta }"
                                                        v-model="sizes.floorAreaRatioExisting">
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
                                                                        placeholder="floorAreaRatioExisting" 
                                                                        
                                                                        />
                                                                
                                                                        <span v-if="sizes.floorAreaRatioExisting" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                                floor area ratio existing
                                                                </span> 
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="floorAreaRatioExisting" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>


                                                <VeeField name="floorAreaRatioPermitted" v-slot="{ field, meta }"
                                                        v-model="sizes.floorAreaRatioPermitted">
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
                                                                        placeholder="floorAreaRatioPermitted" />
                                                                        <span v-if="sizes.floorAreaRatioPermitted" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                                floor area ratio permitted
                                                                </span> 
                                                                
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="floorAreaRatioPermitted" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>


                                                <VeeField name="buildingCoverageRatioExisting" v-slot="{ field, meta }"
                                                        v-model="sizes.buildingCoverageRatioExisting">
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
                                                                        placeholder="buildingCoverageRatioExisting" />
                                                                <span v-if="sizes.buildingCoverageRatioExisting" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                        building coverage ratio existing
                                                                </span> 
                                                                
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="buildingCoverageRatioExisting" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>


                                                <VeeField name="buildingCoverageRatioPermitted" v-slot="{ field, meta }"
                                                        v-model="sizes.buildingCoverageRatioPermitted">
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
                                                                        placeholder="buildingCoverageRatioPermitted" />
                                                                
                                                                <span v-if="sizes.buildingCoverageRatioPermitted" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                                building coverage ratio permitted
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="buildingCoverageRatioPermitted" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>


                                                <VeeField name="floorPlateSqm" v-slot="{ field, meta }"
                                                        v-model="sizes.floorPlateSqm">
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
                                                                        placeholder="floorPlateSqm" 
                                                                        @change="convertSqmPy('floorPlate')"
                                                                        />

                                                                <span v-if="sizes.floorPlateSqm" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                        floor plate sqm
                                                                </span>        
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="floorPlateSqm" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>


                                                <VeeField name="floorPlatePy" v-slot="{ field, meta }"
                                                        v-model="sizes.floorPlatePy">
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
                                                                        placeholder="floorPlatePy" />

                                                                <span v-if="sizes.floorPlatePy" class="absolute bg-transparent left-[1em] top-[5%] -translate-y-[5%] text-[rgba(255,255,255,0.4)] pr-2 right-0 text-xs text-left">
                                                                        floor plate py
                                                                </span>        
                                                                
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-if="meta.valid && meta.touched">
                                                                        <i class="fas fa-check text-cbre_primary_2/60"></i>
                                                                </span>
                                                                <span class="absolute bg-transparent top-[50%] -translate-y-[50%] pr-2 right-0 text-xs text-right"
                                                                        v-else-if="!meta.valid && meta.touched">
                                                                        <i class="fas fa-x text-cbre_system_12/60 "></i>
                                                                </span>
                                                                <VeeErrorMessage name="floorPlatePy" as="div"
                                                                        class="w-full absolute -bottom-[1.5em] left-[2.0em] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                                        </div>
                                                </VeeField>

                                                <!-- <div>
                                                {{ sizes }}
                                                </div> -->
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
import { object, string } from "yup";
import { toTypedSchema } from '@vee-validate/yup';
import { configure } from "vee-validate"
import { usePropertyStore } from '~/stores/property';
const { debug, shrinkPreview, growPreview, sizes } = storeToRefs(usePropertyStore());
const { tabIndex } = defineProps({
        tabIndex: {
                required: true,
                type: Number
        }
})
const emit = defineEmits(["next"]);

const digitsOnly = (value: any) => /^(\d*)[\.]?(\d{1,2})?$/g.test(value)

const isLoading = ref(false)

const convertSqmPy = (mode : string) => {
        let py = 0.3025
        // console.log(mode)
        if( mode =='gfa')  sizes.value.gfaPy = Number((( sizes?.value.gfaSqm ?? 0 ) * py).toFixed(2))
        if( mode =='nfa')  sizes.value.nfaPy = Number((( sizes?.value.nfaSqm ?? 0 ) * py).toFixed(2))
        if( mode =='siteArea')  sizes.value.siteAreaPy = Number((( sizes?.value.siteAreaSqm ?? 0 ) * py).toFixed(2))
        if( mode =='grossLeasableArea')  sizes.value.grossLeasableAreaPy = Number((( sizes?.value.grossLeasableAreaSqm ?? 0 ) * py).toFixed(2))
        if( mode =='netLeasableArea')  sizes.value.netLeasableAreaPy = Number((( sizes?.value.netLeasableAreaSqm ?? 0 ) * py).toFixed(2))
        if( mode =='floorPlate')  sizes.value.floorPlatePy = Number((( sizes?.value.floorPlateSqm ?? 0 ) * py).toFixed(2))
}

configure({
        validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
        validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
        validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
        validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})
const validationSchema = toTypedSchema(object(
        {
                gfaSqm: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("GFA sqm"),
                gfaPy: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("GFA py"),
                nfaSqm: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("NFA sqm"),
                nfaPy: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("NFA py"),
                siteAreaSqm: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Site Area sqm"),
                siteAreaPy: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Site Area py"),
                grossLeasableAreaSqm: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Gross Leasable Area sqm"),
                grossLeasableAreaPy: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Gross Leasable Area py"),
                netLeasableAreaSqm: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Net Leasable Area sqm"),
                netLeasableAreaPy: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Net Leasable Area py"),
                floorAreaRatioExisting: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Floor Area Ratio sqm"),
                floorAreaRatioPermitted: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Floor Area Ratio py"),
                buildingCoverageRatioExisting: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Building Coverage Ratio sqm"),
                buildingCoverageRatioPermitted: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Building Coverage Ratio py"),
                floorPlateSqm: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Floor Plate sqm"),
                floorPlatePy: string().test('Digits only', 'The field should have digits only or up to 2 decimal places', digitsOnly).required().label("Floor Plate py"),
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