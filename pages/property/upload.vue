<template>
    <div class="wrapper px-10 py-10">
        <div class="w-[50%] mx-auto bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none ] ">
            <div
                class="relative px-[2.5em] pt-[7.5em] pb-[2.5em] backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] flex flex-col gap-5">

                <div
                    class="absolute top-0 left-[50%] -translate-x-[50%] px-[1.5em] py-[1.0em] md:py-[0.5em] text-center text-cbre_primary_3 text-[1.5em] rounded-[0_0_20px_20px] bg-[rgba(230,234,234,1)] before:content-[''] before:absolute before:top-0 before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:bg-transparent before:shadow-[15px_0_0_0_rgba(230,234,234,1)] after:content-[''] after:absolute after:top-0 after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:bg-transparent after:shadow-[-15px_0_0_0_rgba(230,234,234,1)]">
                    Upload Excel Sheets
                </div>

                <div class="flex flex-col items-center justify-center gap-8 py-8 min-h-[200px]">
                    <!-- Initial State: No File Selected -->
                    <div v-if="!file" class="flex flex-col md:flex-row gap-6 w-full max-w-2xl justify-center">
                        <button
                            class="px-8 py-4 rounded-[10px] border-2 border-white/30 text-white text-lg  bg-cbre_primary_3 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                            @click.prevent="downloadSampleExcel">
                            <Icon name="solar:download-outline" size="20"
                                class="text-gray-400 group-hover:text-primary" />
                            Download Sample
                        </button>
                        <button
                            class="px-8 py-4 rounded-[10px] bg-cbre_primary_1 text-white text-lg  shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                            @click.prevent="triggerFileInput">
                            <Icon name="solar:upload-outline" size="20"
                                class="text-gray-400 group-hover:text-primary" />
                            Select Excel File
                        </button>
                    </div>

                    <!-- File Selected State -->
                    <div v-else class="flex flex-col items-center gap-6 w-full max-w-xl animate-fade-in">
                        <div
                            class="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-[10px] p-4 text-center">
                            <div class="text-white/60 text-sm uppercase tracking-wider mb-1">Selected File</div>
                            <div class="text-white text-xl font-medium truncate px-4">
                                {{ (file as File).name }}
                            </div>
                        </div>

                        <div class="flex gap-4 w-full">
                            <button
                                class="flex-1 py-4 rounded-[10px] bg-cbre_primary_2 text-white text-lg font-semibold shadow-lg hover:bg-cbre_primary_3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cbre_primary_2 flex items-center justify-center gap-2"
                                :disabled="isDisabled || hasCriticalErrors" @click.prevent="handleFileUpload">
                                <span v-if="!hasCriticalErrors">🚀</span>
                                {{ hasCriticalErrors ? 'Fix Errors to Upload' : 'Upload File' }}
                            </button>
                            <button
                                class="px-8 py-4 rounded-[10px] bg-red-500/80 text-white text-lg font-semibold hover:bg-red-600 transition-all duration-300"
                                @click.prevent="handleResetUpload">
                                Reset
                            </button>
                        </div>
                    </div>

                    <!-- Hidden Input -->
                    <input ref="fileInputRef" type="file" class="hidden" accept=".xlsx, .xls"
                        @change="handleFileChange" />
                </div>

                <!-- Validation Dashboard -->
                <div v-if="sheetsData.length > 0" class="mt-8 bg-white/90 p-6 rounded-[10px] text-gray-800 shadow-lg">
                    <h3 class="text-2xl font-bold mb-4 text-cbre_primary_3 border-b pb-2">Upload Summary</h3>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div class="text-sm text-blue-600 font-semibold uppercase">Total Sheets</div>
                            <div class="text-3xl font-bold text-blue-800">{{ sheetsData.length }}</div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div class="text-sm text-green-600 font-semibold uppercase">Valid Rows</div>
                            <div class="text-3xl font-bold text-green-800">{{ totalValidRows }}</div>
                        </div>
                        <div
                            :class="['p-4 rounded-lg border', totalErrors > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200']">
                            <div
                                :class="['text-sm font-semibold uppercase', totalErrors > 0 ? 'text-red-600' : 'text-gray-600']">
                                Errors</div>
                            <div :class="['text-3xl font-bold', totalErrors > 0 ? 'text-red-800' : 'text-gray-800']">{{
                                totalErrors }}</div>
                        </div>
                    </div>

                    <div class="flex border-b border-gray-300 mb-4 overflow-x-auto">
                        <button v-for="(sheet, index) in sheetsData" :key="sheet.name" @click="activeSheetIndex = index"
                            class="py-2 px-4 whitespace-nowrap font-medium transition-colors duration-200" :class="[
                                activeSheetIndex === index
                                    ? 'border-b-2 border-cbre_primary_2 text-cbre_primary_2 bg-blue-50/50'
                                    : 'text-gray-600 hover:text-cbre_primary_3 hover:bg-gray-50',
                                sheet.errors.length > 0 ? 'text-red-500' : ''
                            ]">
                            {{ sheet.name }}
                            <span v-if="sheet.errors.length > 0"
                                class="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{{
                                    sheet.errors.length }}</span>
                        </button>
                    </div>

                    <div v-if="sheetsData[activeSheetIndex]">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-xl font-semibold text-cbre_primary_3">
                                {{ sheetsData[activeSheetIndex].name }}
                                <span class="text-sm font-normal text-gray-500 ml-2">({{
                                    sheetsData[activeSheetIndex].rows.length }} rows)</span>
                            </h3>
                            <div v-if="sheetsData[activeSheetIndex].errors.length > 0"
                                class="text-red-600 text-sm font-medium">
                                {{ sheetsData[activeSheetIndex].errors.length }} Issues Found
                            </div>
                        </div>

                        <!-- Error List for Active Sheet -->
                        <div v-if="sheetsData[activeSheetIndex].errors.length > 0"
                            class="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                            <ul class="list-disc list-inside text-sm text-red-700">
                                <li v-for="(err, i) in sheetsData[activeSheetIndex].errors" :key="i">{{ err }}</li>
                            </ul>
                        </div>

                        <Vue3EasyDataTable :headers="sheetsData[activeSheetIndex].columns"
                            :items="sheetsData[activeSheetIndex].rows" :rows-per-page="10"
                            class="rounded-[10px] border border-gray-200">
                        </Vue3EasyDataTable>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStatusStore } from "~/stores/status";

definePageMeta({
    middleware: "auth",
    layout: 'admin-layout',
});

const statusStore = useStatusStore();
const { showToast } = useToast();

import 'vue3-easy-data-table/dist/style.css';
import Vue3EasyDataTable from 'vue3-easy-data-table';

import { useExcel } from "~/composables/useExcel";

const {
    file,
    fileInputRef,
    sheetsData,
    activeSheetIndex,
    isDisabled,
    totalErrors,
    totalValidRows,
    hasCriticalErrors,
    downloadSampleExcel,
    parseExcel: handleFileChange,
    resetUpload: handleResetUpload
} = useExcel();

const triggerFileInput = () => {
    fileInputRef.value?.click();
};

const handleFileUpload = async () => {
    if (!file.value) {
        alert("Please select a file first.");
        return;
    }
    if (hasCriticalErrors.value) {
        alert("Please fix validation errors before uploading.");
        return;
    }

    statusStore.setGlobalLoading(true, 'uploadFile');

    const formData = new FormData();
    formData.append('file', file.value);

    try {
        const { data, error, status } = await useFetch('/api/property/bulk', {
            method: 'POST',
            body: formData,
        });

        if (data.value) {
            console.log('Upload success', data.value);
            showToast('File uploaded successfully! All properties have been imported.', 'success', { timeout: 5000, showCloseButton: true, position: 'top-right', transition: 'bounce' });

            if (status.value === 'success') {
                console.log('Upload successful, redirecting in 3 seconds...');
                setTimeout(() => {
                    navigateTo('/admin');
                }, 3000);
            }

        } else {
            console.log('Upload failed', error.value);
            showToast(`File upload failed. ${error.value?.statusMessage || 'Please check the console for details.'}`, 'danger', { timeout: 5000, showCloseButton: true, position: 'top-right', transition: 'bounce' });
        }

    } catch (error) {
        console.log(error);
        showToast('An error occurred during upload. Please check the console.', 'danger', { timeout: 5000, showCloseButton: true, position: 'top-right', transition: 'bounce' });

    } finally {
        statusStore.setGlobalLoading(false);
    }
};
</script>

<style>
/* Your existing styles */
.staticBorder {
    border: khaki dashed 1px;
    text-align: center;
    width: 220px;
    background-color: #17E88F;
    color: black;
    border-radius: 10px;
    margin: 5px
}
</style>

<style scoped>
img {
    width: 500px;
}

pre {
    font-family: Consolas, monospace;
    background-color: #ddd;
}
</style>
