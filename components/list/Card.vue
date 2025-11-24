<template>
    <div id="container" :class="containerClasses" class="w-full h-full overflow-y-auto pr-1">

        <div v-if="totalCount > 0"
            class="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-2 border-b mb-4 flex justify-between items-center">
            <div class="text-sm">
                <span class="font-bold text-lg pl-3">{{ totalCount }}</span> Properties found
            </div>

            <div class="flex items-center gap-2">
                <div class="flex border border-gray-300 rounded-lg overflow-hidden h-[32px]">
                    <button @click="uiStore.isGridView = false"
                        class="px-3 flex items-center justify-center transition-colors"
                        :class="!uiStore.isGridView ? 'bg-gray-100 text-cbre_primary_1' : 'bg-white text-gray-400 hover:bg-gray-50'">
                        <Icon name="ph:list-bullets" size="18" />
                    </button>
                    <div class="w-[1px] bg-gray-300"></div>
                    <button @click="uiStore.isGridView = true"
                        class="px-3 flex items-center justify-center transition-colors"
                        :class="uiStore.isGridView ? 'bg-gray-100 text-cbre_primary_1' : 'bg-white text-gray-400 hover:bg-gray-50'">
                        <Icon name="ph:squares-four" size="18" />
                    </button>
                </div>

                <button @click="uiStore.isExpandedList = !uiStore.isExpandedList"
                    class="h-[32px] px-3 border border-gray-300 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-gray-50">
                    <Icon :name="uiStore.isExpandedList ? 'ph:arrows-in-simple' : 'ph:arrows-out-simple'"
                        size="16" />
                    {{ uiStore.isExpandedList ? 'Shrink List' : 'Expand List' }}
                </button>
            </div>
        </div>

        <div v-if="itemsToDisplay.length > 0" class="relative pb-10"
            :class="uiStore.isGridView ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-4'">

            <template v-for="(item, index) in itemsToDisplay" :key="item.id">
                <ListItem :item="item" :idx="totalCount - index" />
            </template>

            <div v-if="isLoadingMore" class="col-span-full flex justify-center py-4">
                <ListLoading color="#003F2D" />
            </div>

            <div ref="loadMoreTrigger" class="h-4 w-full -mt-10 pointer-events-none opacity-0"></div>

        </div>

        <div v-else class="h-full flex flex-col items-center justify-center text-gray-400">
            <Icon name="ph:buildings" size="48" class="mb-2 opacity-50" />
            <p>No properties found.</p>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import type { PropertyType } from '~/types/property.type';
import ListItem from './Item.vue';
import ListLoading from './Loading.vue';

const props = defineProps({
    data: { type: Array as () => PropertyType[], default: () => [] }, // 전체 데이터 (필터링된)
    totalCount: { type: Number, default: 0 },
    itemsPerRender: { type: Number, default: 10 }, // 한 번에 렌더링할 개수 증가 (성능 고려)
    containerClasses: { type: String, default: '' },
});

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const { filteredProperties } = storeToRefs(propertyStore);

// Local State
const itemsToDisplay = ref<PropertyType[]>([]);
const page = ref(1);
const isLoadingMore = ref(false);
const loadMoreTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// --- Infinite Scroll Logic ---

// 1. 초기화 함수
const resetList = () => {
    page.value = 1;
    itemsToDisplay.value = props.data.slice(0, props.itemsPerRender);

    // 데이터가 변경되면 Observer 재연결 시도
    if (loadMoreTrigger.value) {
        setupObserver();
    }
};

// 2. 더 불러오기 함수
const loadMore = () => {
    if (itemsToDisplay.value.length >= props.data.length || isLoadingMore.value) return;

    isLoadingMore.value = true;

    // 약간의 지연을 주어 UX 개선 (너무 빠르면 깜빡임처럼 보일 수 있음)
    setTimeout(() => {
        const nextBatch = props.data.slice(
            itemsToDisplay.value.length,
            itemsToDisplay.value.length + props.itemsPerRender
        );
        itemsToDisplay.value = [...itemsToDisplay.value, ...nextBatch];
        isLoadingMore.value = false;
    }, 300);
};

// 3. Intersection Observer 설정
const setupObserver = () => {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMore();
        }
    }, {
        root: null, // viewport 기준
        rootMargin: '100px', // 바닥에 닿기 100px 전에 미리 로드
        threshold: 0.1
    });

    if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value);
    }
};

// Watchers
// 데이터 원본(props.data)이 바뀌면 리스트 초기화
watch(() => props.data, () => {
    resetList();
}, { immediate: true });

// Lifecycle
onMounted(() => {
    setupObserver();
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script>