<template>
        <div class="relative flex-col justify-start items-start m-0 p-0">
                <label v-if="label" class="p-0 m-0 text-left text-sm">
                        {{ label }}
                </label>
                <ClientOnly>
                        <VeeField :name="name" v-slot="{ meta, value }" as="select"
                                class="relative text-sm w-full h-[5vh] grid grid-col-1 justify-bwtween outline-none focus:outline-none">

                                <option value="" class="text-cbre_system_14">Select a {{ type }}</option>
                                <option v-for="(item, index) in (type === 'sector' ? menuStore.sector : menuStore.subsector)"
                                        :key="index" :value="item" :selected="value && value === item" :class="{
                                                'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                'bg-cbre_system_12/10': !meta.valid && meta.touched,
                                        }" class="flex items-center
                                                                px-7 h-[3vh] rounded-sm text-sm
                                                                ring-1 outline-0 border-0 bg-white/10  ring-white/20
                                                                focus:ring-1 focus:outline-0 focus:border-0 
                                                                placeholder:text-white/50 placeholder:text-sm
                                                                text-cbre_system_14" autocomplete="one-time-code">{{
                                                                        item }}</option>
                                <span
                                        class="absolute bg-transparent top-0 h-[3vh] flex items-center pl-2 left-0 text-sm text-gray-300 text-left">
                                        <i class="fas" :class="leftIcon"></i>
                                </span>


                                <VeeErrorMessage :name="name" as="div"
                                        class="w-full h-[2vh] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                        </VeeField>
                </ClientOnly>


        </div>
</template>

<script setup lang="ts">
const props = defineProps({
        type: {
                type: String,
                default: "text",
        },
        name: {
                type: String,
                required: true,
        },
        label: {
                type: String,
                required: true,
        },
        placeholder: {
                type: String,
                default: "",
        },
        leftIcon: {
                type: String,
                default: "",
        },
        debug: {
                type: Boolean,
                default: false
        }

})

import { useMenuStore } from '~/stores/menu';
const menuStore = useMenuStore()

</script>

<style >
/* Remove Chrome's autofill background color  */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
        color: gray !important;
}
</style>