<template>
    <div class="p-6 space-y-6">
        <form @submit.prevent="onSubmit" class="space-y-8">
            
            <AssetModifyFormFloorPlanFileHandler 
                    title="1. Longitudinal Section" 
                    type="LOGITUDINALSECTION"
                    v-model:files="formData.logitudinal"
                />

                <AssetModifyFormFloorPlanFileHandler
                    title="2. Cross Section" 
                    type="CROSSSECTION"
                    v-model:files="formData.cross"
                />

            <div class="border p-4 rounded-lg shadow-md bg-white space-y-4">
                <h3 class="text-xl font-bold text-primary mb-4">3. Each Floor Plans </h3>
                
                <AssetModifyFormFloorPlanFileHandler
                    title="Upper Floors"
                    type="UPPERSECTION"
                    :floorList="upperFloors"
                    v-model:files="formData.eachFloor.uppers"
                />
                
                <AssetModifyFormFloorPlanFileHandler
                    title="Basement Floors"
                    type="BASEMENTSECTION"
                    :floorList="basementFloors"
                    v-model:files="formData.eachFloor.basements"
                />
            </div>

            <div class="flex justify-end pt-4 border-t mt-8">
                <button 
                        type="button" 
                        @click="resetForm()" 
                        class="bg-gray-300 hover:bg-red-500 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-[10px] transition duration-150 mr-4"
                        >
                        Reset
                        </button>
                        
                        <button 
                        type="submit" 
                        :disabled="computedIsLoading" 
                        class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white hover:text-primary font-bold py-2 px-4 rounded-[10px] transition duration-150 
                                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                        <svg v-if="computedIsLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ computedIsLoading ? 'Saving...' : 'Save and Close' }}
                    </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePropertyStore } from '~/stores/property';
import { useAppStore } from '~/stores/app'; // 로딩 상태 관리를 위해 추가

import { createToast } from 'mosha-vue-toastify';
import type { FloorPlanPhotoListType, FloorPlanPhotoType } from '~/types/asset.type'; // 타입 경로 확인 필요

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const appStore = useAppStore();

const computedIsLoading = computed(() => appStore.isLoading);

// Pinia 스토어에서 데이터를 가져와 깊은 복사본을 만들어 로컬 상태로 사용합니다.
const initialDataSnapshot = ref<FloorPlanPhotoListType | null>(null);

const formData = ref<FloorPlanPhotoListType>({
    logitudinal: [],
    cross: [],
    eachFloor: {
        uppers: [],
        basements: [],
    }
});

// Pinia 스토어의 데이터가 변경될 때마다 로컬 폼 데이터 및 초기 스냅샷을 업데이트
watch(() => propertyStore.floorPlanPhotoList, (newList) => {
    if (newList) {
        // 깊은 복사를 통해 Pinia 상태가 변경되어도 로컬 상태가 영향을 받지 않도록 처리
        formData.value = JSON.parse(JSON.stringify(newList));
        initialDataSnapshot.value = JSON.parse(JSON.stringify(newList));
    }
}, { immediate: true });


// 층별 평면도 구분을 위한 층 리스트 필터링 (FloorType에 floor: number | null 가정이 포함됨)
const upperFloors = computed(() => propertyStore.floorList
    // 1. floorList가 null/undefined일 경우 빈 배열([]) 반환
    ?.filter(f => f.type === 'UPPER')
    .sort((a, b) => {
        // 2. a.floor와 b.floor가 null일 경우 0으로 처리하여 안전하게 숫자 비교
        const floorA = a.floor ?? 0;
        const floorB = b.floor ?? 0;
        // UPPER 층은 높은 층부터 (내림차순)
        return floorB - floorA; 
    }) || []
);

const basementFloors = computed(() => propertyStore.floorList
    // 1. floorList가 null/undefined일 경우 빈 배열([]) 반환
    ?.filter(f => f.type === 'BASEMENT')
    .sort((a, b) => {
        // 2. a.floor와 b.floor가 null일 경우 0으로 처리하여 안전하게 숫자 비교
        const floorA = a.floor ?? 0;
        const floorB = b.floor ?? 0;
        // BASEMENT 층은 낮은 숫자(B1)부터 (오름차순, 예를 들어 -1F -> -2F)
        // B1(-1)이 B2(-2)보다 위에 있으므로, B1(-1) - B2(-2) = 1 (양수). b가 먼저.
        // B1, B2 순서로 표시하려면 오름차순 정렬을 해야 합니다.
        // -1 > -2 이므로, b.floor - a.floor를 하면 B1, B2 순서가 됩니다. 
        // 일반적으로 지하층은 '숫자가 커질수록 (절댓값이 커질수록) 아래'로 내려가므로 오름차순 정렬이 맞습니다.
        return floorB - floorA; 
    }) || []
);


// --- 제출 (Submission) 로직 ---
const onSubmit = async () => {
    appStore.setLoading(true);
    
    // 💡 모든 목록을 하나로 모아서 서버로 전송
    const payload: FloorPlanPhotoListType = {
        logitudinal: formData.value.logitudinal.filter(f => f.fileUrl),
        cross: formData.value.cross.filter(f => f.fileUrl),
        eachFloor: {
            uppers: formData.value.eachFloor.uppers.filter(f => f.fileUrl), 
            basements: formData.value.eachFloor.basements.filter(f => f.fileUrl),
        }
    };
    
    // 💡 API Endpoint
    try {
        // 단일 API 호출
        const updatedList = await $fetch<FloorPlanPhotoListType>(
            `/api/upload/${propertyStore.propertyId}/floorplan`, 
            {
                method: 'PUT',
                body: payload,
            }
        );

        // Pinia 스토어 업데이트
        propertyStore.setProperty({ floorPlanPhotoList: updatedList });
        
        createToast({ title: 'Floor Plan Photo has been successfully saved.' }, { type: 'success' });
        emit('close');

    } catch (error) {
        console.error('API 업데이트 오류:', error);
        createToast({ title: 'Failed to update floor plan photos.'}, { type: 'danger' });
    } finally {
        appStore.setLoading(false);
    }
};

const resetForm = () => {
    // 초기 스냅샷으로 폼 데이터 초기화
    if (initialDataSnapshot.value) {
        formData.value = JSON.parse(JSON.stringify(initialDataSnapshot.value));
    }

    createToast({
        title: 'Form restored to current asset data.',
        // description: 'If you want to delete image click X mark'
        }, {
                type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                timeout: 5000,
                showCloseButton: true,
                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                transition: 'bounce',
                hideProgressBar: false,
                swipeClose: true,
    })

    return true;
}
</script>