<template>
        <div class="bg-white mt-4">
                <div class="relative font-financier text-2xl text-primary mb-4 flex justify-between">
                        <span>Sale Information</span>
                        <button @click="openEditPanel"
                                class="outline-none bg-cbre_primary_2 text-white text-sm font-medium py-1 px-3 border rounded-[10px] transition duration-150">
                                Edit
                        </button>
                </div>

                <div v-if="sales.length > 0">
                        <div class="overflow-x-auto">
                                <table class="table-auto w-full border border-gray-300">
                                        <thead>
                                                <tr class="bg-gray-100 text-sm font-medium">
                                                        <th class="px-2 py-1 text-left">Date</th>
                                                        <th class="px-2 py-1 text-left">Type</th>
                                                        <th class="px-2 py-1 text-left">Buyer</th>
                                                        <th class="px-2 py-1 text-left">Seller</th>
                                                        <th class="px-2 py-1 text-right">Price (KRW)</th>
                                                        <th class="px-2 py-1 text-right">Cap Rate (%)</th>
                                                        <th class="px-2 py-1 text-right">GFA (Py)</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(t, index) in sales" :key="index" class="text-left border-t">
                                                        <td class="px-2 py-1">{{ t.year }} / {{ t.quarter || '-' }}</td>
                                                        <td class="px-2 py-1">{{ displayValue(t.sale?.saleType) }}</td>
                                                        <td class="px-2 py-1 truncate max-w-[150px]"
                                                                :title="t.sale?.buyer || ''">{{
                                                                displayValue(t.sale?.buyer) }}</td>
                                                        <td class="px-2 py-1 truncate max-w-[150px]"
                                                                :title="t.sale?.seller || ''">{{
                                                                displayValue(t.sale?.seller) }}</td>
                                                        <td class="px-2 py-1 text-right">{{ formatInt(t.sale?.priceKrw)
                                                                }}</td>
                                                        <td class="px-2 py-1 text-right">{{
                                                                formatDecimal(t.sale?.estCapRate) }}</td>
                                                        <td class="px-2 py-1 text-right">{{ formatDecimal(t.sale?.gfaSqm
                                                                ? t.sale.gfaSqm / 3.3058 : 0) }}</td>
                                                </tr>
                                        </tbody>
                                </table>
                        </div>
                </div>
                <div v-else class="text-gray-500 text-sm mt-2 text-center">
                        No sale information available.
                </div>
        </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useFormat } from '~/composables/useFormat';

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const { numberFormat, displayValue } = useFormat();

const { currentProperty: property } = storeToRefs(propertyStore);
const formatInt = (v: any) => numberFormat(v, 0);
const formatDecimal = (v: any) => numberFormat(v, 2);

const openEditPanel = () => {
        uiStore.openModifyForm(propertyStore.currentPropertyId, 'sale');
};

const sales = computed(() => {
        return property.value?.transaction?.filter(
                (t: any) => t.type === 'SALE'
        ) || [];
});
</script>
