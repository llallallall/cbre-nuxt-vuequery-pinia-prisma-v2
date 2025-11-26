<template>
        <nav aria-label="Page navigation example">
                <ul class="inline-flex -space-x-px text-sm">
                        <li>
                                <button @click="$emit('prev')" :disabled="currentPage === 1"
                                        class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Previous
                                </button>
                        </li>
                        <li v-for="page in displayedPages" :key="page">
                                <button @click="$emit('go-to', page)"
                                        class="flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                                        :class="currentPage === page ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 bg-white'">
                                        {{ page }}
                                </button>
                        </li>
                        <li>
                                <button @click="$emit('next')" :disabled="currentPage === totalPages"
                                        class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Next
                                </button>
                        </li>
                </ul>
        </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
        currentPage: number;
        totalPages: number;
}>();

defineEmits<{
        (e: 'prev'): void;
        (e: 'next'): void;
        (e: 'go-to', page: number): void;
}>();

const displayedPages = computed(() => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, props.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(props.totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
        }
        return pages;
});
</script>
