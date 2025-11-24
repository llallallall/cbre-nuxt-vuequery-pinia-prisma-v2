<template>
        <div class="font-financier text-2xl text-primary mb-2">History</div>

        <ul v-if="hasHistory" class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 gap-y-1">
                <li class="flex items-center" v-for="(h, index) in item.history" :key="h.id || index">
                        <div v-if="h.type === 'COMPLETION'" class="w-full flex items-center">
                                <IconMinus class="w-[18px] mr-1" />
                                <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                        <span class="text-xs font-normal">#{{ index + 1 }}</span> YR. Built :
                                </div>
                                <div class="flex-1">
                                        {{ h.year }}
                                </div>
                        </div>
                        <div v-else class="w-full flex items-center">
                                <IconMinus class="w-[18px] mr-1" />
                                <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                        <span class="text-xs font-normal">#{{ index + 1 }}</span> YR. Reno. :
                                </div>
                                <div class="flex-1">
                                        {{ h.year }}
                                </div>
                        </div>
                </li>
        </ul>
        <div v-else class="text-gray-400 text-sm italic pl-6">No history data.</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
        item: {
                required: true,
                type: Object
        }
});

// 데이터 존재 여부 확인
const hasHistory = computed(() => {
        return props.item.history && props.item.history.length > 0 && props.item.history[0].year;
});
</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        margin: 0 0 1em;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>