<template>
    <div class="wrapper px-10 py-10">
        <div class="w-full bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none ] ">
            <div
                class="relative px-[2.5em] pt-[7.5em] pb-[2.5em] backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] flex flex-col gap-5">

                <div
                    class="absolute top-0 left-[50%] -translate-x-[50%] px-[1.5em] py-[1.0em] md:py-[0.5em] text-center text-cbre_primary_3 text-[1.5em] rounded-[0_0_20px_20px] bg-[rgba(230,234,234,1)] before:content-[''] before:absolute before:top-0 before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:bg-transparent before:shadow-[15px_0_0_0_rgba(230,234,234,1)] after:content-[''] after:absolute after:top-0 after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:bg-transparent after:shadow-[-15px_0_0_0_rgba(230,234,234,1)]">
                    Upload Excel Sheets
                </div>

                <div
                    class="gap-10 grid grid-flow-col justify-stretch items-stretch font-calibre text-white text-lg mb-2">
                    <div>
                        <button
                            class="w-full h-full rounded-[10px] outline-non bg-cbre_primary_1/60 text-cbre_primary_5/50 px-4 py-2"
                            type="submit" @click.prevent="downloadFile">Download Sample File</button>
                    </div>

                    <div>
                        <input ref="fileInputRef" name="file" type="file" @change="handleFileChange"
                            class="rounded-[10px] w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cbre_primary_1/60 file:text-cbre_primary_5/50 hover:file:bg-cbre_primary_1/80"
                            accept=".xlsx, .xls" />

                        <div style="margin-top: 20px">
                            <button v-if="isDisabled"
                                class="w-full h-[5vh] rounded-[10px] outline-non bg-cbre_primary_1/60 text-cbre_primary_5/50 cursor-not-allowed"
                                type="submit" disabled>Select Excel File</button>
                            <div v-else class="flex flex-row justify-between w-full h-[5vh] gap-2 ">
                                <button class="w-full h-[5vh] rounded-[10px] outline-non bg-cbre_primary_2 text-white "
                                    type="submit" @click.prevent="handleFileUpload">Upload Excel File</button>
                                <button
                                    class="w-full h-[5vh] rounded-[10px] outline-non bg-cbre_primary_1/60 text-white "
                                    type="reset" @click.prevent="handleResetUpload">Reset</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="sheetsData.length > 0" class="mt-8 bg-white/80 p-4 rounded-[10px] text-gray-800">
                    <div class="flex border-b border-gray-400 mb-4 overflow-x-auto">
                        <button v-for="(sheet, index) in sheetsData" :key="sheet.name" @click="activeSheetIndex = index"
                            class="py-2 px-4 whitespace-nowrap font-medium" :class="[
                                activeSheetIndex === index
                                    ? 'border-b-2 border-cbre_primary_2 text-cbre_primary_2'
                                    : 'text-gray-600 hover:text-cbre_primary_3'
                            ]">
                            {{ sheet.name }}
                        </button>
                    </div>

                    <div v-if="sheetsData[activeSheetIndex]">
                        <h3 class="text-xl font-semibold mb-2 text-cbre_primary_3">{{ sheetsData[activeSheetIndex].name
                            }}</h3>
                        <vue-table-lite :is-static-mode="true" :columns="sheetsData[activeSheetIndex].columns"
                            :rows="sheetsData[activeSheetIndex].rows" :total="sheetsData[activeSheetIndex].rows.length"
                            class="rounded-[10px]"></vue-table-lite>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

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

/* vue3-table-lite default styles override */
.vtl {
    background-color: #ffffff;
    color: #333333;
}

.vtl-table {
    border-collapse: collapse;
    width: 100%;
}

.vtl-thead-th {
    background-color: #f4f4f4;
    border-bottom: 2px solid #ddd;
}

.vtl-tbody-td {
    border-bottom: 1px solid #eee;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue';
import VueTableLite from "vue3-table-lite/ts";
import * as XLSX from 'xlsx';
import { createToast } from 'mosha-vue-toastify';

// 💡 1. 수정: App Store 제거 -> Status Store 도입
// import { useAppStore } from "~/stores/app"; // 삭제
import { useStatusStore } from "~/stores/status"; // 추가

definePageMeta({
    middleware: "auth",
    layout: 'admin-layout',
});

// 💡 2. 수정: Store 인스턴스 생성
// const appStore = useAppStore(); // 삭제
const statusStore = useStatusStore(); // 추가

// --- Type Definitions ---
type Column = { field: string; label: string; };
type SheetData = {
    name: string;
    columns: Column[];
    rows: any[];
};

const file = ref<File | string>('');
const fileInputRef = ref<HTMLInputElement | null>(null);
const sheetsData = ref<SheetData[]>([]);
const activeSheetIndex = ref(0);

const isDisabled = computed(() => !file.value);

const downloadFile = () => {
    const link = document.createElement('a')
    link.href = '/assets/files/property_upload_sample.xlsx'
    link.download = 'property_upload_sample.xlsx'
    link.target = '_blank'
    link.click()
}

const handleResetUpload = () => {
    file.value = '';
    sheetsData.value = [];
    activeSheetIndex.value = 0;

    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
}

const handleFileChange = (event: Event) => {
    // 💡 3. 수정: 로딩 상태 호출 변경
    statusStore.setGlobalLoading(true, 'filePreview');

    const target = event.target as HTMLInputElement;

    if (target.files && target.files[0]) {
        file.value = target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });

                const parsedSheets: SheetData[] = [];
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

                    if (jsonData.length > 0) {
                        const keys = Object.keys(jsonData[0]);
                        const sheetColumns: Column[] = keys.map(key => ({
                            field: key,
                            label: key,
                        }));

                        parsedSheets.push({
                            name: sheetName,
                            columns: sheetColumns,
                            rows: jsonData,
                        });
                    }
                });

                sheetsData.value = parsedSheets;
                activeSheetIndex.value = 0;

            } catch (error) {
                console.error("Error parsing Excel file:", error);
                createToast({
                    title: 'Failed to read the Excel file.',
                    description: 'It might be corrupted or in an unsupported format.'
                }, { type: 'warning', timeout: 5000, showCloseButton: true, position: 'top-right', transition: 'bounce' });

                handleResetUpload();
            } finally {
                // 💡 3. 수정: 로딩 상태 호출 변경
                statusStore.setGlobalLoading(false);
            }
        };

        reader.onerror = (error) => {
            console.error("FileReader error:", error);
            createToast({
                title: 'Error reading file.',
                description: 'check file content in preview section'
            }, { type: 'warning', timeout: 5000, showCloseButton: true, position: 'top-right', transition: 'bounce' });

            // 💡 3. 수정: 로딩 상태 호출 변경
            statusStore.setGlobalLoading(false);
        };

        reader.readAsArrayBuffer(file.value);
    } else {
        handleResetUpload();
        // 💡 3. 수정: 로딩 상태 호출 변경
        statusStore.setGlobalLoading(false);
    }
};

const handleFileUpload = async () => {
    if (!file.value) {
        alert("Please select a file first.");
        return;
    }
    // 💡 3. 수정: 로딩 상태 호출 변경
    statusStore.setGlobalLoading(true, 'uploadFile');

    const formData = new FormData();
    formData.append('file', file.value);

    try {
        const { data, error, status } = await useFetch('/api/upload/sheetsUploader', {
            method: 'POST',
            body: formData,
        });

        if (data.value) {
            console.log('Upload success', data.value);
            createToast({
                title: 'File uploaded successfully!',
                description: 'check file content in preview section'
            }, { type: 'success', timeout: 5000, showCloseButton: true, position: 'top-right', transition: 'bounce' });

            if (status.value === 'success') {
                console.log('Upload successful, redirecting in 3 seconds...');
                setTimeout(() => {
                    // Nuxt 3 Navgiate 권장
                    navigateTo('/admin');
                }, 5000);
            }

        } else {
            console.log('Upload failed', error.value);
            createToast({
                title: 'File upload failed. Please check the console for details.',
                description: 'check file content in preview section'
            }, { type: 'danger', timeout: 5000, showCloseButton: true, position: 'top-right', transition: 'bounce' });
        }

    } catch (error) {
        console.log(error);
        createToast({
            title: 'An error occurred during upload.',
            description: 'check file content in preview section'
        }, { type: 'danger', timeout: 5000, showCloseButton: true, position: 'top-right', transition: 'bounce' });

    } finally {
        // 💡 3. 수정: 로딩 상태 호출 변경
        statusStore.setGlobalLoading(false);
    }
};
</script>

<style scoped>
img {
    width: 500px;
}

pre {
    font-family: Consolas, monospace;
    background-color: #ddd;
}
</style>