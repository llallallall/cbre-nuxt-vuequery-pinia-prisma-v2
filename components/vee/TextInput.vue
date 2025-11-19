<template>
        <div class="relative flex-col justify-start items-start m-0 p-0">
                <label v-if="label" class="p-0 m-0 text-left text-sm">
                        {{ label }}
                </label>
                <ClientOnly>
                        <VeeField :name="name" v-slot="{ field, meta }" autocomplete="off">
                                <template class="relative text-md w-full h-[5vh] grid grid-col-1 justify-bwtween">
                                        <input v-bind="field" :type="type" :class="{
                                                'bg-cbre_primary_2/10': meta.valid && meta.touched,
                                                'bg-cbre_system_12/10': !meta.valid && meta.touched
                                        }" :style="{
        'color': !textColor ?
                'text-cbre_system_14' : textColor
}" :placeholder="placeholder" class="flex items-center
                                                                px-7 h-[3vh] rounded-sm text-sm
                                                                ring-1 outline-0 border-0 bg-white/10  ring-white/20
                                                                focus:ring-1 focus:outline-0 focus:border-0 
                                                                placeholder:text-white/50 placeholder:text-sm
                                                                " autocomplete="one-time-code" />
                                        <span
                                                class="absolute bg-transparent top-0 h-[3vh] flex items-center pl-2 left-0 text-sm text-gray-300 text-left">
                                                <i class="fas" :class="leftIcon"></i>
                                        </span>
                                        <span class="absolute bg-transparent top-0 h-[3vh] flex items-center pr-2 right-0 text-xs text-right"
                                                v-if="meta.valid && meta.touched">
                                                <i class="fas fa-check text-cbre_primary_2/60"></i>
                                        </span>
                                        <span class="absolute bg-transparent top-0 h-[3vh] flex items-center pr-2 right-0 text-xs text-right"
                                                v-else-if="!meta.valid && meta.touched">
                                                <i class="fas fa-x text-cbre_system_12/60"></i>
                                        </span>

                                        <VeeErrorMessage :name="name" as="div"
                                                class="w-full h-[2vh] bg-transparent text-cbre_system_12/60 text-xs flex items-end" />
                                </template>
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
        textColor: {
                type: String,
                required: false,
        }

})

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