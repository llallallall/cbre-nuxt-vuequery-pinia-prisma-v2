<template>
    <div class="flex flex-col gap-10">
        <!-- General Information -->
        <div v-if="item">
            <PropertyDetailGeneral :profitability="item?.profitability" :scale="item?.scale"
                :sector="item?.sector" :subsector="item?.subsector" :warehouse="item?.warehouse" />
        </div>

        <!-- Floors Usage Summary -->
        <div v-if="item?.floor && item.floor.length > 0">
            <PropertyDetailFloorsUsage :info="item.floor" />
        </div>
    </div>
</template>

<script setup lang="ts">
import PropertyDetailGeneral from '~/components/property/detail/General.vue';
import PropertyDetailFloorsUsage from '~/components/property/detail/FloorsUsage.vue';
import type { PropertyType } from '~/types/property.type';

defineProps<{
    item: PropertyType | null | undefined;
}>();
</script>
