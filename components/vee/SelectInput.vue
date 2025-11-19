<template>
        <Listbox :model-value="value || modelValue" @update:modelValue="$emit('update:modelValue', $event)">
                <div class="relative w-full
                                                bg-[rgba(255,255,255,0.1)]
                                                border border-[rgba(255,255,255,0.4)] rounded-[10px] outline-none 
                                                text-white 
                                                px-[1.3em] py-[0.5em]
                                                focus:outline-none"
                        :class="(value && value?.id) ? 'bg-cbre_primary_2/10' : 'bg-cbre_system_12/10'">
                        <ListboxButton class=" relative text-[1em] text-left w-full focus:outline-none ">
                                <span class=" block truncate"
                                        :class="(value || modelValue)?.[labelProp] ? 'text-white' : 'text-[rgba(255,255,255,0.4)]'">{{
                                                (value || modelValue)?.[labelProp] || "Please select an option"
                                        }}</span>
                                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <SelectorIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
                                </span>
                        </ListboxButton>

                        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
                                leave-to-class="opacity-0">
                                <ListboxOptions
                                        class="absolute w-full py-1 mt-1 overflow-auto text-base bg-[rgba(255,255,255,0.8)] border border-[rgba(255,255,255,0.4)]  rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-100">
                                        <ListboxOption v-slot="{ active, selected }" v-for=" option  in  options "
                                                :key="option[keyProp]" :value="option" as="template">
                                                <li :class="[
                                                        active ? 'text-amber-900 bg-amber-100' : 'text-gray-900',
                                                        'cursor-default select-none relative py-2 pl-10 pr-4',
                                                ]
                                                        ">
                                                        <span :class="[
                                                                selected ? 'font-medium' : 'font-normal',
                                                                'block truncate',
                                                        ]
                                                                ">{{ option[labelProp] }}</span>
                                                        <span v-if="selected"
                                                                class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                <CheckIcon class="w-5 h-5" aria-hidden="true" />
                                                        </span>
                                                </li>
                                        </ListboxOption>
                                </ListboxOptions>
                        </transition>


                </div>
        </Listbox>
</template>

<script>
import {
        Listbox,
        ListboxLabel,
        ListboxButton,
        ListboxOptions,
        ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/solid";

export default {
        components: {
                Listbox,
                ListboxLabel,
                ListboxButton,
                ListboxOptions,
                ListboxOption,
                CheckIcon,
                SelectorIcon,
        },
        props: {
                options: {
                        type: Array,
                        required: true,
                },
                modelValue: {
                        type: null,
                },
                value: {
                        type: null,
                },
                keyProp: {
                        type: String,
                        required: true,
                },
                labelProp: {
                        type: String,
                        required: true,
                },

        },
        emits: ["update:modelValue"],
};
</script>