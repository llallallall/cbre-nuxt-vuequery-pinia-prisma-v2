<template>
    <div class="flex flex-col gap-10">
        <!-- History Information -->
        <div v-if="item">
            <PropertyDetailHistoryList :history="item?.history" />
        </div>

        <!-- Floor Data Table -->
        <div v-if="item?.floor && item.floor.length > 0">
            <PropertyDetailFloorDataTable :info="item.floor" />
        </div>
    </div>
</template>

<script setup lang="ts">
import PropertyDetailHistoryList from '~/components/property/detail/HistoryList.vue';
import PropertyDetailFloorDataTable from '~/components/property/detail/FloorDataTable.vue';
import type { PropertyType } from '~/types/property.type';

defineProps<{
    item: PropertyType | null | undefined;
}>();
</script>
