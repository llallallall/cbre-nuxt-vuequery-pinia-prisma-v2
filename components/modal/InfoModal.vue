<template>
        <TransitionRoot appear :show="show" as="template">
                <Dialog as="div" @close="$emit('close')" class="detail-card-wrapper relative z-10 overflow-hidden">
                        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                                enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100"
                                leave-to="opacity-0">
                                <div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
                        </TransitionChild>

                        <div class="detail-card-outer fixed inset-0 overflow-auto">
                                <div class="detail-card-inner relative flex items-center justify-center text-center">
                                        <div class="modalCloseButton">
                                                <button type="button"
                                                        class="inline-flex justify-center items-center rounded-md px-2 text-sm font-medium text-primary hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                        @click="$emit('close')">
                                                        <IconPlus class="rotate-45 w-[14px]" />
                                                        Close
                                                </button>
                                        </div>
                                        <div class="flex w-full h-full items-center justify-center p-4 text-center">
                                                <TransitionChild as="template" enter="duration-300 ease-out"
                                                        enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
                                                        leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                                                        leave-to="opacity-0 scale-95">
                                                        <DialogPanel
                                                                class="detail-card-contents w-full max-w-[calc(100%-100px)] max-h-[calc(100%-200px)] p-6 mt-[80px] overflow-y-scroll bg-white text-left align-middle shadow-xl transform transition-all relative">
                                                                <DialogTitle as="h3"
                                                                        class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6 text-primary">
                                                                        <div class="flex items-end">
                                                                                <div>Selected Properties Information
                                                                                </div>

                                                                                <div class="max-w-[200px] flex justify-center items-center relative p-0 pb-2 gap-0 ml-10 cursor-pointer transition-transform active:scale-95 hover:scale-105"
                                                                                        @click="onDownloadExcel()">
                                                                                        <div class="relative flex-1 flex justify-center items-center h-[28px] hover:bg-cbre_primary_2 hover:text-cbre_primary_1
                                  border-2 rounded-xl 
                                  py-1 px-2 border-primary bg-[#e6eaea]">
                                                                                                <Icon name="vscode-icons:file-type-excel2"
                                                                                                        class=" w-[18px] h-[18px] " />
                                                                                                <span
                                                                                                        class="flex font-calibreLight text-sm leading-none">
                                                                                                        <span
                                                                                                                class="mx-1">Download</span>
                                                                                                        <span
                                                                                                                class="hidden lg:block">Excel</span>
                                                                                                </span>
                                                                                        </div>
                                                                                </div>
                                                                                <div
                                                                                        class="max-w-[130px] flex justify-center items-center relative p-0 pb-2 gap-0 ml-5">

                                                                                        <span
                                                                                                class="flex font-calibreLight text-sm leading-none">
                                                                                                <span
                                                                                                        class="mx-1">No</span>
                                                                                                <span
                                                                                                        class="mr-1 hidden lg:block">Transaction</span>
                                                                                        </span>
                                                                                        <Switch v-model="filterNoTransaction"
                                                                                                :class="filterNoTransaction ? 'bg-teal-900' : 'bg-gray-300'"
                                                                                                class="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                                                <span aria-hidden="true"
                                                                                                        :class="filterNoTransaction ? 'translate-x-5' : 'translate-x-0'"
                                                                                                        class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                                                        </Switch>
                                                                                </div>
                                                                                <div
                                                                                        class="max-w-[200px] flex justify-center items-center relative p-0 pb-2 gap-0 ml-5">


                                                                                        <span
                                                                                                class="flex font-calibreLight text-sm leading-none">
                                                                                                <span
                                                                                                        class="mx-1 hidden lg:block">All</span>
                                                                                                <span
                                                                                                        class="mr-1">Sales</span>

                                                                                        </span>
                                                                                        <Switch v-model="filterSale"
                                                                                                :class="filterSale ? 'bg-teal-900' : 'bg-gray-300'"
                                                                                                class="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                                                <span aria-hidden="true"
                                                                                                        :class="filterSale ? 'translate-x-5' : 'translate-x-0'"
                                                                                                        class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                                                        </Switch>
                                                                                </div>
                                                                                <div
                                                                                        class="max-w-[130px] flex justify-center items-center relative p-0 pb-2 gap-0 ml-5">

                                                                                        <span
                                                                                                class="flex font-calibreLight text-sm leading-none">
                                                                                                <span
                                                                                                        class="mx-1 hidden lg:block">All</span>
                                                                                                <span
                                                                                                        class="mr-1">Leases</span>

                                                                                        </span>
                                                                                        <Switch v-model="filterLease"
                                                                                                :class="filterLease ? 'bg-teal-900' : 'bg-gray-300'"
                                                                                                class="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                                                <span aria-hidden="true"
                                                                                                        :class="filterLease ? 'translate-x-5' : 'translate-x-0'"
                                                                                                        class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                                                        </Switch>
                                                                                </div>
                                                                        </div>
                                                                </DialogTitle>
                                                                <div class="mt-2">
                                                                        <p class="text-sm text-gray-500">
                                                                                The filters above apply only to the screen view. Use the toggles on each card to control data inclusion in the Excel download.
                                                                        </p>
                                                                </div>

                                                                <div
                                                                        class="mt-4 grid grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4">
                                                                        <div v-for="(item, index) in filteredItems"
                                                                                class="border border-primary/10 p-4 shadow-md transition-colors duration-200"
                                                                                :class="isGeneralSelected(item.id) ? 'bg-white' : 'bg-gray-100'">
                                                                                <div
                                                                                        class="font-financierMedium text-2xl text-primary pb-2 mb-2 border-b border-gray-200">
                                                                                        {{ item.name }}
                                                                                </div>

                                                                                <div
                                                                                        class="font-calibreLight text-lg text-primary pb-2 mb-2 border-b border-gray-200 flex justify-between">
                                                                                        <div class="flex flex-col">
                                                                                                <span
                                                                                                        class="font-calibre">Grade</span>
                                                                                                <span
                                                                                                        v-if="item.profitability?.grade">{{
                                                                                                                item.profitability.grade
                                                                                                        }}</span>
                                                                                                <span v-else
                                                                                                        class="text-xs text-gray-500">Not
                                                                                                        Available</span>
                                                                                        </div>
                                                                                        <div class="flex flex-col">
                                                                                                <span
                                                                                                        class="font-calibre">Sector</span>
                                                                                                <span v-if="item.sector"
                                                                                                        class="text-sm">{{
                                                                                                                item.sector.name
                                                                                                        }}</span>
                                                                                                <span v-else
                                                                                                        class="text-xs text-gray-500">Not
                                                                                                        Available</span>
                                                                                        </div>

                                                                                        <div class="flex flex-col">
                                                                                                <span
                                                                                                        class="font-calibre">SubSector</span>
                                                                                                <span v-if="item.subsector"
                                                                                                        class="text-sm">{{
                                                                                                                item.subsector.name
                                                                                                        }}</span>
                                                                                                <span v-else
                                                                                                        class="text-xs text-gray-500">Not
                                                                                                        Available</span>
                                                                                        </div>


                                                                                </div>
                                                                                <div
                                                                                        class="flex justify-start items-center gap-3 select-none">
                                                                                        <div v-for="preview in item.propertyImageFile"
                                                                                                class="w-[120px] h-[90px] border-white/25 border-1 border-gray-400 hover:scale-125 transition-all">
                                                                                                <img :src="getThumbnailUrl(preview.fileUrl)"
                                                                                                        class="object-cover w-full h-full" />
                                                                                        </div>
                                                                                </div>
                                                                                <ul :key="index"
                                                                                        class="bulletList font-calibreLight text-lg text-primary grid grid-cols-2 gap-5">
                                                                                        <li class="flex flex-col" v-if="item.transaction &&
                                                                                                item.transaction.length > 0
                                                                                        ">
                                                                                                <div
                                                                                                        class="whitespace-nowrap mr-4 font-calibre">
                                                                                                        Sales
                                                                                                </div>
                                                                                                <div
                                                                                                        class="flex-1 flex flex-col">
                                                                                                        <div v-for="(el, idx) in item.transaction"
                                                                                                                class="flex flex-row items-center justify-between">
                                                                                                                <span>{{
                                                                                                                        (idx
                                                                                                                                +
                                                                                                                                1)
                                                                                                                        +
                                                                                                                        ".&nbsp;"
                                                                                                                        +
                                                                                                                        el.year
                                                                                                                        +
                                                                                                                        "/"
                                                                                                                        +
                                                                                                                        el.quarter
                                                                                                                }}&nbsp;:&nbsp;
                                                                                                                </span>
                                                                                                                <div
                                                                                                                        class="flex items-center">
                                                                                                                        <Switch :model-value="isSaleSelected(item.id, idx)"
                                                                                                                                @update:model-value="toggleSale(item.id, idx)"
                                                                                                                                :key="idx"
                                                                                                                                :class="isSaleSelected(item.id, idx) ? 'bg-teal-900' : 'bg-gray-300'"
                                                                                                                                class="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                                                                                <span aria-hidden="true"
                                                                                                                                        :class="isSaleSelected(item.id, idx) ? 'translate-x-5' : 'translate-x-0'"
                                                                                                                                        class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                                                                                        </Switch>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </li>

                                                                                        <li v-if="getLeases(item).length > 0"
                                                                                                class="flex flex-col">
                                                                                                <div
                                                                                                        class="whitespace-nowrap mr-4 font-calibre">
                                                                                                        Leases
                                                                                                </div>
                                                                                                <div
                                                                                                        class="flex-1 flex flex-col">
                                                                                                        <div v-for="(el, idx) in getLeases(item)"
                                                                                                                class="flex flex-row items-center justify-between">
                                                                                                                <span>{{
                                                                                                                        (idx
                                                                                                                                +
                                                                                                                                1)
                                                                                                                        +
                                                                                                                        ".&nbsp;"
                                                                                                                        +
                                                                                                                        formatDate(el.leaseStartDate)
                                                                                                                }}&nbsp;:&nbsp;
                                                                                                                </span>
                                                                                                                <div
                                                                                                                        class="flex items-center">
                                                                                                                        <Switch :model-value="isLeaseSelected(item.id, idx)"
                                                                                                                                @update:model-value="toggleLease(item.id, idx)"
                                                                                                                                :key="idx"
                                                                                                                                :class="isLeaseSelected(item.id, idx) ? 'bg-teal-900' : 'bg-gray-300'"
                                                                                                                                class="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                                                                                <span aria-hidden="true"
                                                                                                                                        :class="isLeaseSelected(item.id, idx) ? 'translate-x-5' : 'translate-x-0'"
                                                                                                                                        class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                                                                                        </Switch>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </li>

                                                                                        
                                                                                </ul>

                                                                                <div
                                                                                        class="flex flex-row items-center justify-between mt-2">
                                                                                        <div class="font-calibreLight" :class="isGeneralSelected(item.id) ? 'text-teal-700' : 'text-red-400'">{{ isGeneralSelected(item.id) ? 'Included in Excel' : 'Excluded from Excel' }}</div>
                                                                                        <div
                                                                                                class="flex items-center">
                                                                                                <Switch :model-value="isGeneralSelected(item.id)"
                                                                                                        @update:model-value="toggleGeneral(item.id)"
                                                                                                        :class="isGeneralSelected(item.id) ? 'bg-teal-900' : 'bg-gray-300'"
                                                                                                        class="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                                                        <span aria-hidden="true"
                                                                                                                :class="isGeneralSelected(item.id) ? 'translate-x-5' : 'translate-x-0'"
                                                                                                                class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                                                                                                </Switch>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </DialogPanel>
                                                </TransitionChild>
                                        </div>
                                </div>
                        </div>
                </Dialog>
        </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogPanel,
        DialogTitle,
        Switch
} from "@headlessui/vue";
import type { PropertyType } from '~/types/property.type';
import { useFormat } from '~/composables/useFormat';
const { getThumbnailUrl } = useFormat();
const props = defineProps<{
        show: boolean;
        items: PropertyType[];
}>();

const emit = defineEmits<{
        (e: 'close'): void;
}>();

const selectedPropertiesSales = ref([] as string[]);
const selectedPropertiesLeases = ref([] as string[]);
const selectedPropertiesGeneral = ref([] as string[]);

// Filters
const filterNoTransaction = ref(false);
const filterSale = ref(false);
const filterLease = ref(false);

// Helper Functions
const getLeases = (item: PropertyType) => {
        return item.transaction
                ?.filter(t => t.type === 'LEASE' && t.lease?.leaseType === 'ACTUAL')
                .map(t => t.lease!) || [];
};

const hasSale = (item: PropertyType) => {
        return item.transaction?.some(t => t.type === 'SALE');
};

const hasLease = (item: PropertyType) => {
        return getLeases(item).length > 0;
};

const filteredItems = computed(() => {
        // If no filters are active, show all items
        if (!filterNoTransaction.value && !filterSale.value && !filterLease.value) {
                return props.items;
        }

        return props.items.filter(item => {
                const isNoTransaction = !hasSale(item) && !hasLease(item);
                const isSale = hasSale(item);
                const isLease = hasLease(item);

                // Check if item matches any of the active filters
                if (filterNoTransaction.value && isNoTransaction) return true;
                if (filterSale.value && isSale) return true;
                if (filterLease.value && isLease) return true;

                return false;
        });
});

const formatDate = (date: Date | string | null) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${year}/${month}`;
};

const isSaleSelected = (propertyId: string, idx: number) => {
        return selectedPropertiesSales.value.includes(`${propertyId}-${idx}`);
};

const toggleSale = (propertyId: string, idx: number) => {
        const key = `${propertyId}-${idx}`;
        const index = selectedPropertiesSales.value.indexOf(key);
        if (index === -1) {
                selectedPropertiesSales.value.push(key);
        } else {
                selectedPropertiesSales.value.splice(index, 1);
        }
};

const isLeaseSelected = (propertyId: string, idx: number) => {
        return selectedPropertiesLeases.value.includes(`${propertyId}-${idx}`);
};

const toggleLease = (propertyId: string, idx: number) => {
        const key = `${propertyId}-${idx}`;
        const index = selectedPropertiesLeases.value.indexOf(key);
        if (index === -1) {
                selectedPropertiesLeases.value.push(key);
        } else {
                selectedPropertiesLeases.value.splice(index, 1);
        }
};

const isGeneralSelected = (propertyId: string) => {
        return selectedPropertiesGeneral.value.includes(propertyId);
};

const toggleGeneral = (propertyId: string) => {
        const index = selectedPropertiesGeneral.value.indexOf(propertyId);
        const item = props.items.find(i => i.id === propertyId);

        if (index === -1) {
                // Enable General
                selectedPropertiesGeneral.value.push(propertyId);
                
                // Auto-select all Sales and Leases for this property
                if (item) {
                        // Select Sales
                        if (item.transaction) {
                                item.transaction.forEach((t, idx) => {
                                        if (t.type === 'SALE') {
                                                const key = `${propertyId}-${idx}`;
                                                if (!selectedPropertiesSales.value.includes(key)) {
                                                        selectedPropertiesSales.value.push(key);
                                                }
                                        }
                                });
                        }
                        
                        // Select Leases
                        const leases = getLeases(item);
                        leases.forEach((_, idx) => {
                                const key = `${propertyId}-${idx}`;
                                if (!selectedPropertiesLeases.value.includes(key)) {
                                        selectedPropertiesLeases.value.push(key);
                                }
                        });
                }
        } else {
                // Disable General
                selectedPropertiesGeneral.value.splice(index, 1);

                // Auto-deselect all Sales and Leases for this property
                if (item) {
                        // Deselect Sales
                        if (item.transaction) {
                                item.transaction.forEach((t, idx) => {
                                        if (t.type === 'SALE') {
                                                const key = `${propertyId}-${idx}`;
                                                const saleIndex = selectedPropertiesSales.value.indexOf(key);
                                                if (saleIndex !== -1) {
                                                        selectedPropertiesSales.value.splice(saleIndex, 1);
                                                }
                                        }
                                });
                        }
                        
                        // Deselect Leases
                        const leases = getLeases(item);
                        leases.forEach((_, idx) => {
                                const key = `${propertyId}-${idx}`;
                                const leaseIndex = selectedPropertiesLeases.value.indexOf(key);
                                if (leaseIndex !== -1) {
                                        selectedPropertiesLeases.value.splice(leaseIndex, 1);
                                }
                        });
                }
        }
};

import { useExcel } from '~/composables/useExcel';

const { downloadExcel } = useExcel();

const onDownloadExcel = async () => {
        // Use props.items (all kept items) instead of filteredItems (visual filter)
        // Filter items based on individual selections
        const dataToExport = props.items
                .filter(item => isGeneralSelected(item.id)) // First, check if the asset itself is selected
                .map(item => {
                        // Create a shallow copy to modify transactions without affecting original
                        const newItem = { ...item };

                        // Filter Transactions (Sales and Leases)
                        if (newItem.transaction && newItem.transaction.length > 0) {
                                newItem.transaction = newItem.transaction.filter((t, idx) => {
                                        if (t.type === 'SALE') {
                                                return isSaleSelected(item.id, idx);
                                        } else if (t.type === 'LEASE') {
                                                const leases = getLeases(item);
                                                const leaseIdx = leases.findIndex(l => l === t.lease);
                                                
                                                if (leaseIdx !== -1) {
                                                        return isLeaseSelected(item.id, leaseIdx);
                                                }
                                                return false;
                                        }
                                        return false; 
                                });
                        }
                        return newItem;
                });

        if (dataToExport.length > 0) {
                await downloadExcel(dataToExport);
        }
}

// Initialize selections when items change or modal opens
import { watch } from 'vue';
watch(() => props.items, (newItems) => {
    // Select all items and their transactions by default
    newItems.forEach(item => {
        // General
        if (!selectedPropertiesGeneral.value.includes(item.id)) {
            selectedPropertiesGeneral.value.push(item.id);
        }

        // Sales
        if (item.transaction) {
            item.transaction.forEach((t, idx) => {
                if (t.type === 'SALE') {
                    const key = `${item.id}-${idx}`;
                    if (!selectedPropertiesSales.value.includes(key)) {
                        selectedPropertiesSales.value.push(key);
                    }
                }
            });
        }

        // Leases
        const leases = getLeases(item);
        leases.forEach((_, idx) => {
            const key = `${item.id}-${idx}`;
            if (!selectedPropertiesLeases.value.includes(key)) {
                selectedPropertiesLeases.value.push(key);
            }
        });
    });
}, { immediate: true });
</script>

<style scoped>
.detail-card-wrapper {
        width: 100%;
        height: 100%;
}

.detail-card-outer {
        width: 100%;
        height: 100%;
}

.detail-card-inner {
        width: 100%;
        height: 100%;
}

.detail-card-contents {
        width: 100%;
        height: 100%;
}

.modalCloseButton {
        position: absolute;
        top: 165px;
        right: 70px;
        z-index: 100;
}

.bulletList {
        list-style: none;
        margin: 0;
        padding: 0;
        line-height: 2;
}
</style>
