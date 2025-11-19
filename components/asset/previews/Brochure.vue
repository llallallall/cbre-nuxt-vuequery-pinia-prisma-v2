<template>
        <div class="bg-white mt-4">

                <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
                        <span>Brochure</span>
                        <button @click="openEditPanel"
                                class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
                                Edit
                        </button>
                </div>

                <div v-if="property?.propertyBrochureFile && property.propertyBrochureFile.length > 0"
                        class="grid grid-cols-1 gap-10 pl-[20px]">

                        <div v-for="(file, index) in validBrochures" :key="file.id || index"
                                class="border-white/25 hover:text-blue-500 transition-all">
                                <span v-if="file.fileUrl" @click="openPdfModal(file.fileUrl)"
                                        class="object-contain w-full h-full border-white/25 border-2 cursor-pointer">
                                        {{ index + 1 }}. {{ file.fileName }}
                                </span>
                        </div>

                </div>
                <div v-else class="text-center py-10 text-gray-500 text-sm">
                        No brochure files have been uploaded.
                </div>

        </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status'; // AppStore 대체
import { useUiStore } from '~/stores/ui';         // ModifyPanelStore 대체

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const statusStore = useStatusStore();

// 💡 수정: currentProperty 참조
const { currentProperty: property } = storeToRefs(propertyStore);

// 유효한 브로슈어 목록 필터링
const validBrochures = computed(() => {
        return property.value?.propertyBrochureFile?.filter(
                (el: any) => el.fileUrl && (el.fileUrl + '').trim().length > 0
        ) || [];
});

const openEditPanel = () => {
        // 💡 수정: uiStore 사용
        uiStore.openModifyPanel(propertyStore.currentPropertyId, 'brochure');
};

const openPdfModal = (url: string) => {
        // 💡 수정: statusStore 사용
        statusStore.openViewerModal(url, 'pdf');
};
</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>