<template>
        <div class="relative w-full border border-[rgba(255,255,255,0.4)] rounded-[10px] p-[1.5em] ">
                <label
                        class="absolute -top-[1em] left-[1em] text-cbre_primary_3/60 text-xs border border-[rgba(255,255,255,0.4)] rounded-[5px] px-[0.7em] py-[0.2em] bg-[rgba(230,234,234,1)] shadow-sm backdrop-blur-3xl">
                        Photos
                </label>
                <PropertyRegisterFileUploader name="photos" multiple composed @transfer="storeFileData"
                        @delete="deleteFileData" />
        </div>

        <PropertyRegisterFileUploader name="LOGITUDINALSECTION" composed @transfer="storeFileData"
                @delete="deleteFileData" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createToast } from 'mosha-vue-toastify';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useStatusStore } from '~/stores/status'; // 로딩 제어

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const statusStore = useStatusStore();

const { currentProperty } = storeToRefs(propertyStore);
const debug = ref(true);

// Enum 정의
const FloorFlanTypeEnum = {
        LOGITUDINALSECTION: 'LOGITUDINALSECTION',
        CROSSSECTION: 'CROSSSECTION',
        UPPERSECTION: 'UPPERSECTION',
        BASEMENTSECTION: 'BASEMENTSECTION',
} as const;

const storeFileData = async (response: any) => {
        if (response.data.length > 0) {
                // 1. 파일 업로드 (API 호출)
                const fileData = response.data[0];
                // ... (FormData 생성 로직 유지) ...

                // 2. Store 업데이트 (API 호출 후 결과 반영)
                // response.name으로 타입 구분
                if (response.name === 'photos') {
                        // propertyImageFile에 추가
                } else if (response.name === FloorFlanTypeEnum.LOGITUDINALSECTION) {
                        // floorPlanFile에 추가 (type: LOGITUDINALSECTION)
                }
                // ...
        }
};

const deleteFileData = async (response: any) => {
        // 삭제 로직 구현 (API 호출 -> Store 갱신)
};

// ...
</script>