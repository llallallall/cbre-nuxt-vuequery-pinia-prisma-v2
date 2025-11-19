<template >
        <div class="font-financier text-2xl text-primary">
                History</div>


        <ul v-if="item.historyList && item.historyList.length > 0 && item.historyList[0].year.length > 0"
                class="cbre_bulletList font-calibreLight text-lg text-primary grid " :class="{
                        'grid-cols-1': propertyStore.shrinkPreview && !propertyStore.growPreview,
                        'grid-cols-2': !propertyStore.shrinkPreview && !propertyStore.growPreview,
                        'grid-cols-3': !propertyStore.shrinkPreview && propertyStore.growPreview,
                }">

                <li class="flex items-center" v-for="(history, index) in item.historyList" :key="history">
                        <div v-if="history.type == 'COMPLETION'" class="w-full flex items-center">
                                <IconMinus class="w-[18px] mr-1" />
                                <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                        <span class="text-xs font-normal">#{{ index + 1 }}</span> YR. Built :
                                </div>
                                <div class="flex-1">
                                        {{
                                                history.year
                                        }}

                                </div>
                        </div>
                        <div v-else class="w-full flex items-center">
                                <IconMinus class="w-[18px] mr-1" />
                                <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                        <span class="text-xs font-normal">#{{ index + 1 }}</span> YR. Reno. :
                                </div>
                                <div class="flex-1">
                                        {{
                                                history.year
                                        }}

                                </div>
                        </div>
                </li>
        </ul>
</template>

<script setup lang="ts">
import { usePropertyStore } from '~/stores/property';
const propertyStore = usePropertyStore()
const { item } = defineProps({
        item: {
                required: true,
                type: Object
        }
})


</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        margin: 0 0 1em;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>