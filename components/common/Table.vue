<template>
        <div class="w-full">
                <div class="w-full overflow-x-auto mb-4 rounded-[10px]">
                        <table class="w-full text-sm text-left text-gray-500">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                                <th v-if="checkable" scope="col" class="p-4">
                                                        <div class="flex items-center">
                                                                <input id="checkbox-all" type="checkbox"
                                                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                                        :checked="isAllChecked" @change="toggleAll">
                                                                <label for="checkbox-all"
                                                                        class="sr-only">checkbox</label>
                                                        </div>
                                                </th>
                                                <th v-for="col in columns" :key="col.key" scope="col"
                                                        class="px-6 py-3 cursor-pointer" @click="toggleSort(col)">
                                                        <div class="flex items-center">
                                                                {{ col.header }}
                                                                <span v-if="col.sortable" class="ml-1">
                                                                        <Icon v-if="sortKey === col.key && sortOrder === 'asc'"
                                                                                name="solar:sort-from-bottom-to-top-linear"
                                                                                size="14" />
                                                                        <Icon v-else-if="sortKey === col.key && sortOrder === 'desc'"
                                                                                name="solar:sort-from-top-to-bottom-linear"
                                                                                size="14" />
                                                                        <Icon v-else name="solar:sort-vertical-linear"
                                                                                size="14" class="text-gray-300" />
                                                                </span>
                                                        </div>
                                                </th>
                                        </tr>
                                </thead>
                                <tbody>
                                        <tr v-for="(item, index) in data" :key="item[rowKey] || index"
                                                class="bg-white border-b hover:bg-gray-50">
                                                <td v-if="checkable" class="w-4 p-4">
                                                        <div class="flex items-center">
                                                                <input :id="`checkbox-${item[rowKey]}`" type="checkbox"
                                                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                                        :checked="checkedIds.includes(item[rowKey])"
                                                                        @change="$emit('toggle-check', item[rowKey])">
                                                                <label :for="`checkbox-${item[rowKey]}`"
                                                                        class="sr-only">checkbox</label>
                                                        </div>
                                                </td>
                                                <td v-for="col in columns" :key="col.key" class="px-6 py-4">
                                                        <slot :name="col.slotName" :item="item" :index="index">
                                                                <NuxtLink v-if="col.link" :to="col.link(item)"
                                                                        :target="col.target"
                                                                        class="hover:text-blue-600 underline">
                                                                        {{ item[col.key] }}
                                                                </NuxtLink>
                                                                <span v-else>
                                                                        {{ item[col.key] }}
                                                                </span>
                                                        </slot>
                                                </td>
                                        </tr>
                                        <tr v-if="data.length === 0">
                                                <td :colspan="columns.length + (checkable ? 1 : 0)"
                                                        class="px-6 py-4 text-center">
                                                        No data found.
                                                </td>
                                        </tr>
                                </tbody>
                        </table>
                </div>

                <div class="flex justify-between items-center flex-wrap gap-3">
                        <div class="flex items-center gap-4">
                                <select :value="rowsPerPage"
                                        @input="$emit('update:rowsPerPage', Number(($event.target as HTMLInputElement).value))"
                                        class="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-cbre_primary_1 focus:border-cbre_primary_1">
                                        <option :value="5">5 per page</option>
                                        <option :value="10">10 per page</option>
                                        <option :value="20">20 per page</option>
                                        <option :value="50">50 per page</option>
                                        <option :value="100">100 per page</option>
                                </select>
                                <CommonPagination :current-page="currentPage" :total-pages="totalPages"
                                        @prev="$emit('page-change', currentPage - 1)"
                                        @next="$emit('page-change', currentPage + 1)"
                                        @go-to="(page) => $emit('page-change', page)" />
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Column {
        header: string;
        key: string;
        slotName?: string;
        sortable?: boolean;
        link?: (item: any) => string;
        target?: string;
}

const props = withDefaults(defineProps<{
        columns: Column[];
        data: any[];
        checkable?: boolean;
        checkedIds?: string[];
        rowKey?: string;
        currentPage?: number;
        totalPages?: number;
        rowsPerPage?: number;
}>(), {
        checkable: false,
        checkedIds: () => [],
        rowKey: 'id',
        currentPage: 1,
        totalPages: 1,
        rowsPerPage: 10
});

const emit = defineEmits<{
        (e: 'toggle-check', id: string): void;
        (e: 'toggle-all-check', checked: boolean): void;
        (e: 'update:rowsPerPage', val: number): void;
        (e: 'page-change', page: number): void;
        (e: 'sort-change', sort: { key: string, order: 'asc' | 'desc' | null }): void;
}>();

const sortKey = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc' | null>(null);

const isAllChecked = computed(() => {
        return props.data.length > 0 && props.data.every(item => props.checkedIds.includes(item[props.rowKey]));
});

const toggleAll = (event: Event) => {
        const checked = (event.target as HTMLInputElement).checked;
        emit('toggle-all-check', checked);
};

const toggleSort = (col: Column) => {
        if (!col.sortable) return;

        if (sortKey.value === col.key) {
                if (sortOrder.value === 'asc') {
                        sortOrder.value = 'desc';
                } else if (sortOrder.value === 'desc') {
                        sortOrder.value = null;
                        sortKey.value = null;
                } else {
                        sortOrder.value = 'asc';
                }
        } else {
                sortKey.value = col.key;
                sortOrder.value = 'asc';
        }

        emit('sort-change', { key: sortKey.value || '', order: sortOrder.value });
};
</script>
