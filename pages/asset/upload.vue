<template>
    <div class="wrapper px-10 py-10">
        <div class="w-full bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none ] ">
            <div
                class="relative px-[2.5em] pt-[7.5em] pb-[2.5em] backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] flex flex-col gap-5">

                <!-- Header Title -->
                <div
                    class="absolute top-0 left-[50%] -translate-x-[50%] px-[1.5em] py-[1.0em] md:py-[0.5em] text-center text-cbre_primary_3 text-[1.5em] rounded-[0_0_20px_20px] bg-[rgba(230,234,234,1)] before:content-[''] before:absolute before:top-0 before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:bg-transparent before:shadow-[15px_0_0_0_rgba(230,234,234,1)] after:content-[''] after:absolute after:top-0 after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:bg-transparent after:shadow-[-15px_0_0_0_rgba(230,234,234,1)]">
                    Upload Excel Sheets
                </div>

                <!-- Control Buttons -->
                <div class="gap-10 grid grid-flow-col justify-stretch items-stretch font-calibre text-white text-lg mb-2">
                    <div>
                        <button
                            class="w-full h-full rounded-[10px] outline-non bg-cbre_primary_1/60 text-cbre_primary_5/50 px-4 py-2"
                            type="submit" @click.prevent="downloadFile">Download Sample File</button>
                    </div>

                    <div>
                        <!-- File Input -->
                        <input ref="fileInputRef" name="file" type="file" @change="handleFileChange"
                            class="rounded-[10px] w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cbre_primary_1/60 file:text-cbre_primary_5/50 hover:file:bg-cbre_primary_1/80"
                            accept=".xlsx, .xls" />

                        <div style="margin-top: 20px">
                            <!-- Upload/Reset Buttons -->
                            <button v-if="isDisabled"
                                class="w-full h-[5vh] rounded-[10px] outline-non bg-cbre_primary_1/60 text-cbre_primary_5/50 cursor-not-allowed"
                                type="submit" disabled>Select Excel File</button>
                            <div v-else class="flex flex-row justify-between w-full h-[5vh] gap-2 ">
                                <button class="w-full h-[5vh] rounded-[10px] outline-non bg-cbre_primary_2 text-white "
                                    type="submit" @click.prevent="handleFileUpload">Upload Excel File</button>
                                <button class="w-full h-[5vh] rounded-[10px] outline-non bg-cbre_primary_1/60 text-white "
                                    type="reset" @click.prevent="handleResetUpload">Reset</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- NEW: Sheet Preview Area -->
                <div v-if="sheetsData.length > 0" class="mt-8 bg-white/80 p-4 rounded-[10px] text-gray-800">
                    <!-- Sheet Tabs -->
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

                    <!-- Active Sheet Table -->
                    <div v-if="sheetsData[activeSheetIndex]">
                        <h3 class="text-xl font-semibold mb-2 text-cbre_primary_3">{{ sheetsData[activeSheetIndex].name
                        }}</h3>
                        <vue-table-lite :is-static-mode="true" :columns="sheetsData[activeSheetIndex].columns"
                            :rows="sheetsData[activeSheetIndex].rows"
                            :total="sheetsData[activeSheetIndex].rows.length" class="rounded-[10px]"></vue-table-lite>
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

/* vue3-table-lite default styles override (optional, for better dark mode compatibility) */
.vtl {
    background-color: #ffffff;
    /* White background for table */
    color: #333333;
    /* Dark text for readability */
}

.vtl-table {
    border-collapse: collapse;
    width: 100%;
}

.vtl-thead-th {
    background-color: #f4f4f4;
    /* Light gray header */
    border-bottom: 2px solid #ddd;
}

.vtl-tbody-td {
    border-bottom: 1px solid #eee;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue';
import VueTableLite from "vue3-table-lite/ts";
import { useAppStore } from "~/stores/app";
import * as XLSX from 'xlsx'; // <-- 1. Import xlsx library
import { createToast } from 'mosha-vue-toastify';

definePageMeta({
    middleware: "auth",
    layout: 'admin-layout',
});

const appStore = useAppStore();

// --- 2. New State for Sheet Preview ---
type Column = { field: string; label: string; };
type SheetData = {
    name: string;
    columns: Column[];
    rows: any[];
};

const file = ref<File | string>('');
const fileInputRef = ref<HTMLInputElement | null>(null);
const sheetsData = ref<SheetData[]>([]); // Holds all parsed sheet data
const activeSheetIndex = ref(0); // Tracks a-ctive tab

const isDisabled = computed(() => !file.value);
// --- End of New State ---


const downloadFile = () => {
    const link = document.createElement('a')
    link.href = '/assets/files/property_upload_sample.xlsx'
    link.download = 'property_upload_sample.xlsx'
    link.target = '_blank'
    link.click()
}

// --- 3. Modified Reset Handler ---
const handleResetUpload = () => {
    file.value = '';
    sheetsData.value = []; // Clear preview data
    activeSheetIndex.value = 0; // Reset active tab

    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
}

// --- 4. Modified File Change Handler (Core Preview Logic) ---
const handleFileChange = (event: Event) => {
    appStore.setLoading(true);
    const target = event.target as HTMLInputElement;

    if (target.files && target.files[0]) {
        file.value = target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                // Parse the file data
                const workbook = XLSX.read(data, { type: 'array' });

                const parsedSheets: SheetData[] = [];
                // Loop through each sheet
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    // Convert sheet to JSON array of objects
                    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

                    if (jsonData.length > 0) {
                        // Create columns from object keys
                        const keys = Object.keys(jsonData[0]);
                        const sheetColumns: Column[] = keys.map(key => ({
                            field: key,
                            label: key,
                        }));
                        
                        // Add sheet data to our state
                        parsedSheets.push({
                            name: sheetName,
                            columns: sheetColumns,
                            rows: jsonData,
                        });
                    }
                });

                sheetsData.value = parsedSheets; // Update Vue state
                activeSheetIndex.value = 0; // Set to first tab
                
            } catch (error) {
                console.error("Error parsing Excel file:", error);
                // alert("Failed to read the Excel file. It might be corrupted or in an unsupported format.");
                createToast({
                                title: 'Failed to read the Excel file.',
                                        description: 'It might be corrupted or in an unsupported format.'
                                        }, {
                                                type: 'warning', // 'info', 'danger', 'warning', 'success', 'default'
                                                timeout: 5000,
                                                showCloseButton: true,
                                                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                                transition: 'bounce',
                                                hideProgressBar: false,
                                                swipeClose: true,
                        });

                handleResetUpload(); // Clear state on error
            } finally {
                appStore.setLoading(false);
            }
        };

        reader.onerror = (error) => {
            console.error("FileReader error:", error);
        //     alert("Error reading file.");
            createToast({
                                title: 'Error reading file.',
                                        description: 'check file content in preview section'
                                        }, {
                                                type: 'warning', // 'info', 'danger', 'warning', 'success', 'default'
                                                timeout: 5000,
                                                showCloseButton: true,
                                                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                                transition: 'bounce',
                                                hideProgressBar: false,
                                                swipeClose: true,
                        });

            appStore.setLoading(false);
        };

        // Read the file as an ArrayBuffer
        reader.readAsArrayBuffer(file.value);
    } else {
        // No file selected or deselected
        handleResetUpload();
        appStore.setLoading(false);
    }
};

// --- 5. Upload Handler (Kept as-is for actual upload) ---
// This function now sends the file to the server AFTER user has previewed it.
const handleFileUpload = async () => {
    if (!file.value) {
        alert("Please select a file first.");
        return;
    }
    appStore.setLoading(true);

    const formData = new FormData();
    formData.append('file', file.value);

    try {
        const { data, pending, error, status } = await useFetch('/api/upload/sheetsUploader', {
            method: 'POST',
            body: formData,
        });

        if (data.value) {
            // Success! The server has processed the file.
            // You might want to show a success message or clear the form.
            console.log('Upload success', data.value);
        //     alert('File uploaded successfully!');
            createToast({
                                title: 'File uploaded successfully!',
                                        description: 'check file content in preview section'
                                        }, {
                                                type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
                                                timeout: 5000,
                                                showCloseButton: true,
                                                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                                transition: 'bounce',
                                                hideProgressBar: false,
                                                swipeClose: true,
                        });

            // Note: The user's original code populated 'rows' and 'columns' here.
            // Since we are showing a preview, this is no longer strictly necessary,
            // unless you want to *replace* the preview with server data after upload.
            
            // let result = JSON.parse(JSON.stringify(data.value))
            // rows.value = result.rows; // (These refs no longer exist)
            // columns.value = result.columns // (These refs no longer exist)

            // --- MODIFIED: 3초 후에 페이지 이동 ---
            if (status.value === 'success') {
                console.log('Upload successful, redirecting in 3 seconds...');
                setTimeout(() => {
                    window.location.href = '/admin';
                    // Nuxt 3를 사용 중이라면 router.push() 대신 navigateTo()를 권장합니다.
                    // (navigateTo('/admin')를 사용하려면 import { navigateTo } from '#app'가 필요합니다.)
                }, 5000); // 3000 밀리초 = 3초
            }
            // --- END OF MODIFICATION ---
            
            
        } else {
            console.log('Upload failed', error.value);
        //     alert('File upload failed. Please check the console for details.');
            createToast({
                                title: 'File upload failed. Please check the console for details.',
                                        description: 'check file content in preview section'
                                        }, {
                                                type: 'danger', // 'info', 'danger', 'warning', 'success', 'default'
                                                timeout: 5000,
                                                showCloseButton: true,
                                                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                                transition: 'bounce',
                                                hideProgressBar: false,
                                                swipeClose: true,
                        });
                        
        }

      

    } catch (error) {
        console.log(error);
        // alert('An error occurred during upload.');
        createToast({
                                title: 'An error occurred during upload.',
                                        description: 'check file content in preview section'
                                        }, {
                                                type: 'danger', // 'info', 'danger', 'warning', 'success', 'default'
                                                timeout: 5000,
                                                showCloseButton: true,
                                                position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                                                transition: 'bounce',
                                                hideProgressBar: false,
                                                swipeClose: true,
                        });

    } finally {
        appStore.setLoading(false)
    }
};
</script>

<style scoped>
/* Scoped styles */
img {
    width: 500px;
}

pre {
    font-family: Consolas, monospace;
    background-color: #ddd;
}
</style>
