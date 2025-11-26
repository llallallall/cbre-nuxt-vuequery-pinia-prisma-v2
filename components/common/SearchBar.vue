<template>
        <div class="relative w-full max-w-md">
                <input type="text" :value="keyword" @input="updateKeyword" @keyup.enter="$emit('search')"
                        placeholder="Search..."
                        class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-cbre_primary_1 transition-colors" />
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Icon name="tabler:search" size="18" />
                </div>
        </div>
</template>

<script setup lang="ts">
defineProps<{
        keyword: string;
}>();

const emit = defineEmits(['update:keyword', 'search']);

const updateKeyword = (event: Event) => {
        const target = event.target as HTMLInputElement;
        emit('update:keyword', target.value);
};
</script>
