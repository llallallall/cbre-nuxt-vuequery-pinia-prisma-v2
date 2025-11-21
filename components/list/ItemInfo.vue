<template>
        <div class="flex w-full justify-between">
                <div class="font-financierSemibold" :class="textClass">
                        GFA :
                </div>
                <div class="text-right whitespace-nowrap">
                        {{ numberFormat(item.scale?.gfaSqm, 2) }} m<sup>2</sup>
                </div>
        </div>

        <div class="flex w-full justify-between">
                <div class="font-financierSemibold" :class="textClass">
                        NFA :
                </div>
                <div class="text-right whitespace-nowrap">
                        {{ numberFormat(item.scale?.nfaSqm, 2) }} m<sup>2</sup>
                </div>
        </div>

        <div class="flex w-full justify-between">
                <div class="font-financierSemibold" :class="textClass">
                        Site Area :
                </div>
                <div class="text-right whitespace-nowrap">
                        {{ numberFormat(item.scale?.siteAreaSqm, 2) }} m<sup>2</sup>
                </div>
        </div>

        <div class="flex w-full justify-between">
                <div class="flex-auto font-financierSemibold" :class="textClass">
                        YR. BLT / RENO :
                </div>
                <div class="flex-none text-right whitespace-nowrap">
                        {{ getCompletionYear(item) }} / {{ getRenovationYear(item) }}
                </div>
        </div>

        <div class="flex w-full justify-between">
                <div class="flex-auto font-financierSemibold" :class="textClass">
                        CONFIGURATION :
                </div>
                <div class="flex-none text-right whitespace-nowrap">
                        {{ formatConfiguration(item) }}
                </div>
        </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from "pinia";
import { useUiStore } from '~/stores/ui'; // MenuStore -> UiStore
import { useFormat } from '~/composables/useFormat';
import type { PropertyType } from '~/types/property.type';

const { numberFormat } = useFormat();
const uiStore = useUiStore();
const { isGridView } = storeToRefs(uiStore);

const props = defineProps<{
        item: PropertyType
}>();

// Grid 뷰일 때 텍스트 스타일 조정
const textClass = computed(() =>
        isGridView.value
                ? 'text-ellipsis xl:truncate overflow-auto xl:overflow-hidden'
                : 'whitespace-nowrap xl:whitespace-break-spaces'
);

// Helpers
const getCompletionYear = (item: PropertyType) => {
        const h = item.history?.find(el => el.type === 'COMPLETION');
        return h?.year || 'N.A.';
};

const getRenovationYear = (item: PropertyType) => {
        const h = item.history?.find(el => el.type === 'RENOVATION');
        return h?.year || 'N.A.';
};

const formatConfiguration = (item: PropertyType) => {
        const b = item.scale?.basementLevels;
        const u = item.scale?.upperLevels;

        const basement = (b && b > 0) ? `B${b}F - ` : '';
        const upper = (u && u > 0) ? `${u}F` : 'N.A.';

        return `${basement}${upper}`;
};
</script>