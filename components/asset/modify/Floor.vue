<template>
        <div class="flex">
                <div class="absolute top-0 right-0">
                        <button class="bg-rose-400 text-white px-[0.5em] py-[0.2em] mr-10 mt-2 rounded-lg shadow-lg text-sm"
                                @click="() => { debug = !debug }">Preview</button>
                </div>
                <div class="bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none ]" :class="{
                        'w-3/4': debug && uiStore.isShrunkPreview && !uiStore.isGrownPreview,
                        'w-2/4': debug && !uiStore.isShrunkPreview && !uiStore.isGrownPreview,
                        'w-1/4': debug && !uiStore.isShrunkPreview && uiStore.isGrownPreview,
                        'w-full': !debug,
                }">

                        <div
                                class="relative px-[2.5em] pt-[7.5em] pb-[2.5em] backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] flex flex-col gap-5">

                                <div
                                        class="absolute top-0 left-[50%] -translate-x-[50%] px-[1.5em] py-[1.0em] md:py-[0.5em] text-center text-cbre_primary_3 text-[1.5em] rounded-[0_0_20px_20px] bg-[rgba(230,234,234,1)]">
                                        Floor
                                </div>

                                <ClientOnly>
                                        <VeeForm :validation-schema="validationSchema" @submit="handleSubmit"
                                                v-slot="{ meta }" class="flex-col space-y-5">

                                                <div class="flex justify-stretch">
                                                        <div
                                                                class="flex-none justify-self-start min-w-[16em] mr-[0.4em] flex items-center justify-center bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none text-white text-sm focus:outline-none select-none">
                                                                <span>Upper Levels</span>
                                                        </div>
                                                        <div class="grow grid grid-cols-q gap-1">
                                                                <div class="relative w-full">
                                                                        <VeeField name="upper_levels_count"
                                                                                v-model="upperLevelsCount"
                                                                                v-slot="{ field, meta }">
                                                                                <input v-bind="field" type="text"
                                                                                        class="relative w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.4)] rounded-[0_10px_10px_0] outline-none text-white text-right px-[1.5em] py-[0.5em] focus:outline-none placeholder:text-[rgba(255,255,255,0.4)]"
                                                                                        :class="{ 'bg-cbre_primary_2/10': meta.valid && meta.touched, 'bg-cbre_system_12/10': !meta.valid && meta.touched }"
                                                                                        autocomplete="one-time-code"
                                                                                        placeholder="Enter the number of ground floors"
                                                                                        @keyup="handleMakeUpperInputs" />
                                                                        </VeeField>
                                                                </div>
                                                        </div>
                                                </div>

                                                <div v-if="upperLevelsCount && Number(upperLevelsCount) !== 0"
                                                        class="grid grid-cols-1 pl-10">
                                                        <div class="relative flex justify-stretch"
                                                                v-for="(item, index) in upperFloors" :key="index">
                                                                <div
                                                                        class="flex-none justify-self-start min-w-[16em] mr-[0.4em] flex items-center justify-center bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.4)] rounded-[10px_0_0_10px] outline-none text-white text-sm focus:outline-none select-none">
                                                                        <span>{{ item.type }} {{ item.floor }}F</span>
                                                                </div>
                                                                <div class="flex-1 grid grid-cols-3 gap-1">
                                                                        <VeeField
                                                                                :name="`ceiling_height_upper_${index}`"
                                                                                v-model="item.ceilingHeight"
                                                                                v-slot="{ field }">
                                                                                <input v-bind="field" type="text"
                                                                                        class="relative w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.4)] text-white text-right px-[1.5em] py-[0.5em]"
                                                                                        placeholder="Ceiling Height" />
                                                                        </VeeField>
                                                                </div>
                                                        </div>
                                                </div>

                                                <div class="grid grid-cols-2 gap-3">
                                                        <button v-if="tabIndex > 0"
                                                                class="w-full h-[5vh] rounded-[10px] bg-cbre_primary_3/60 text-cbre_primary_5/50"
                                                                type="button" @click="handleGoBack">Prev</button>
                                                        <button class="w-full h-[5vh] rounded-[10px]" type="submit"
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
import { ref, computed, onMounted } from 'vue';
import { object, string } from "yup";
import { toTypedSchema } from '@vee-validate/yup';
import { configure } from "vee-validate";
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';

// Store
const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const { currentProperty } = storeToRefs(propertyStore);

// Local State for Form
// 기존 sizes.upperLevels -> local ref 사용 (또는 store의 scale 데이터 사용)
const upperLevelsCount = ref(currentProperty.value?.scale?.upperLevels || 0);
const basementLevelsCount = ref(currentProperty.value?.scale?.basementLevels || 0);
// Floor List 임시 저장소
const floorList = ref(currentProperty.value?.floor || []);

// Computed for filtering
const upperFloors = computed(() => floorList.value.filter((f: any) => f.type === 'UPPER').sort((a: any, b: any) => b.floor - a.floor));
const basementFloors = computed(() => floorList.value.filter((f: any) => f.type === 'BASEMENT').sort((a: any, b: any) => a.floor - b.floor));

const debug = ref(true);

const { tabIndex } = defineProps({ tabIndex: { required: true, type: Number } });
const emit = defineEmits(["next"]);

configure({
        validateOnBlur: true,
        validateOnChange: false,
        validateOnInput: false,
        validateOnModelUpdate: false,
});

const digitsOnly = (value: any) => /^\d+$/.test(value);
const validationSchema = toTypedSchema(object({
        upper_levels_count: string().test('Digits only', 'Digits only', digitsOnly).required().label("Upper Levels"),
        basement_levels_count: string().test('Digits only', 'Digits only', digitsOnly).required().label("Basement Levels"),
}));

// Input Generation Logic (간소화)
const handleMakeUpperInputs = () => {
        // 로직: upperLevelsCount 값에 따라 floorList 배열 조정 (기존 데이터 유지)
        // (기존 코드의 복잡한 로직을 그대로 유지하되, floorList.value 참조만 수정하면 됨)
};

const handleGoBack = () => {
        if (tabIndex - 1 >= 0) emit('next', tabIndex - 1);
};

const handleSubmit = async () => {
        // PropertyStore에 업데이트 요청
        // 예: await propertyStore.updatePropertySection('floor', floorList.value);
        emit('next', tabIndex + 1);
};
</script>