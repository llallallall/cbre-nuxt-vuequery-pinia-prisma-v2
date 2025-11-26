<template>
    <div class="p-6 space-y-6">
        <form @submit.prevent="onSubmit" class="space-y-8 font-financier">

            <PropertyModifyFormFloorPlanFileHandler title="1. Longitudinal Section"
                :type="FloorFlanTypeEnum.LOGITUDINALSECTION" :files="logitudinalFiles"
                @update:files="files => updateFiles(FloorFlanTypeEnum.LOGITUDINALSECTION, files)" />

            <PropertyModifyFormFloorPlanFileHandler title="2. Cross Section" :type="FloorFlanTypeEnum.CROSSSECTION"
                :files="crossFiles" @update:files="files => updateFiles(FloorFlanTypeEnum.CROSSSECTION, files)" />

            <div class="border p-4 rounded-lg shadow-md bg-white space-y-4">
                <h3 class="text-lg font-bold text-primary mb-4">3. Each Floor Plans </h3>

                <PropertyModifyFormFloorPlanFileHandler title="Upper Floors" :type="FloorFlanTypeEnum.UPPERSECTION"
                    :files="upperFiles" @update:files="files => updateFiles(FloorFlanTypeEnum.UPPERSECTION, files)" />

                <PropertyModifyFormFloorPlanFileHandler title="Basement Floors"
                    :type="FloorFlanTypeEnum.BASEMENTSECTION" :files="basementFiles"
                    @update:files="files => updateFiles(FloorFlanTypeEnum.BASEMENTSECTION, files)" />
            </div>

            <div class="flex flex-row items-center justify-end pt-8 border-t font-financierMedium">
                <button type="button" @click="emit('close')"
                    class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white py-2 px-4 rounded-[10px] mr-4 transition duration-150">Cancel</button>
                <button type="submit" :disabled="computedIsLoading"
                    class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150">Save</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useToast } from '~/composables/useToast';
import type { FloorPlanFileType } from '~/types/property.type';

// 💡 Enum 상수 정의
const FloorFlanTypeEnum = {
    LOGITUDINALSECTION: 'LOGITUDINALSECTION',
    CROSSSECTION: 'CROSSSECTION',
    UPPERSECTION: 'UPPERSECTION',
    BASEMENTSECTION: 'BASEMENTSECTION',
} as const;

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { showToast } = useToast();

const { currentProperty } = storeToRefs(propertyStore);
const computedIsLoading = computed(() => statusStore.isGlobalLoading);

// 💡 Flat List 상태 관리
// DB에서 가져온 전체 파일 리스트의 복사본
const allFiles = ref<FloorPlanFileType[]>([]);

// 초기화 로직
watch(() => currentProperty.value?.floorPlanFile, (newFiles) => {
    if (newFiles) {
        allFiles.value = JSON.parse(JSON.stringify(newFiles));
    } else {
        allFiles.value = [];
    }
}, { immediate: true, deep: true });


// 💡 Computed: 타입별 필터링 (자식 컴포넌트에 전달용)
const logitudinalFiles = computed(() => allFiles.value.filter(f => f.type ===
    FloorFlanTypeEnum.LOGITUDINALSECTION));
const crossFiles = computed(() => allFiles.value.filter(f => f.type ===
    FloorFlanTypeEnum.CROSSSECTION));
const upperFiles = computed(() => allFiles.value.filter(f => f.type ===
    FloorFlanTypeEnum.UPPERSECTION));
const basementFiles = computed(() => allFiles.value.filter(f => f.type ===
    FloorFlanTypeEnum.BASEMENTSECTION));


// 💡 Update Handler: 자식 컴포넌트 변경 사항 반영
// 전체 리스트에서 해당 타입의 파일들을 제거하고, 새로운 파일들로 교체합니다.
const updateFiles = (type: string, newFiles: FloorPlanFileType[]) => {
    // 1. 다른 타입의 파일들만 남김
    const otherFiles = allFiles.value.filter(f => f.type !== type);
    // 2. 새로운 파일들과 합침
    allFiles.value = [...otherFiles, ...newFiles];
};


// --- Submit ---
const onSubmit = async () => {
    statusStore.setGlobalLoading(true);

    // API Payload (전체 리스트 전송)
    // id가 없는 새 파일의 경우 undefined로 보내면 Prisma가 생성 처리 (설정에 따라 다름)
    // 여기서는 전체 교체 로직(deleteMany -> createMany)이나 upsert를 백엔드에서 처리한다고 가정
    // 보통 File 처리는 복잡하므로, 백엔드 로직에 맞춰 페이로드 구성이 중요합니다.
    // 여기서는 단순하게 전체 리스트를 보냅니다.

    const payload = allFiles.value.map(f => ({
        id: f.id,
        propertyId: propertyStore.currentPropertyId,
        type: f.type,
        floor: f.floor, // 층별 평면도의 경우 floor 번호 할당 로직 추가 필요 (UI에서 입력받지 않으므로 null 가능성)
        fileUuid: f.fileUuid,
        fileName: f.fileName,
        fileKey: f.fileKey,
        fileUrl: f.fileUrl,
        fileContentType: f.fileContentType,
    }));

    try {
        // 💡 API 경로 수정 (floorplan -> floorPlanFile 등 관계명 확인)
        await propertyStore.updatePropertySection('floorPlanFile', payload as any);

        showToast('Floor Plan Photos saved successfully.', 'success');
        emit('close');

    } catch (error) {
        console.error('Update Error:', error);
        showToast('Failed to update floor plan photos.', 'danger');
    } finally {
        statusStore.setGlobalLoading(false);
    }
};

const resetForm = () => {
    if (currentProperty.value?.floorPlanFile) {
        allFiles.value = JSON.parse(JSON.stringify(currentProperty.value.floorPlanFile));
    } else {
        allFiles.value = [];
    }
    showToast('Form reset.', 'info');
}
</script>
