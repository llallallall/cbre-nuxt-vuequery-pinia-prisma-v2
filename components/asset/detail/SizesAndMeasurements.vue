<template>
        <div class="font-financier text-2xl text-primary mb-2">Sizes and Measurements Information</div>
        <ul
                class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-y-2">

                <li class="flex items-center" v-if="item.scale?.gfaSqm > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">GFA :</div>
                        <div class="flex-1">
                                {{ formatDecimal(item.scale.gfaSqm) }} ㎡ ({{ formatDecimal(item.scale.gfaPy) }} py)
                        </div>
                </li>

                <li class="flex items-center" v-if="item.scale?.nfaSqm > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">NFA :</div>
                        <div class="flex-1">
                                {{ formatDecimal(item.scale.nfaSqm) }} ㎡ ({{ formatDecimal(item.scale.nfaPy) }} py)
                        </div>
                </li>

                <li class="flex items-center" v-if="item.scale?.siteAreaSqm > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">Land Area :</div>
                        <div class="flex-1">
                                {{ formatDecimal(item.scale.siteAreaSqm) }} ㎡ ({{ formatDecimal(item.scale.siteAreaPy)
                                }} py)
                        </div>
                </li>

                <li class="flex items-center" v-if="item.scale?.floorPlateSqm > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">Floor Plate :</div>
                        <div class="flex-1">
                                {{ formatDecimal(item.scale.floorPlateSqm) }} ㎡ ({{
                                        formatDecimal(item.scale.floorPlatePy) }} py)
                        </div>
                </li>

        </ul>

        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 mt-2 gap-y-2">
                <li class="flex items-center" v-if="item.scale?.floorAreaRatioExisting > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">Floor Area Ratio :
                        </div>
                        <div class="flex-1">
                                Existing {{ formatDecimal(item.scale.floorAreaRatioExisting) }}%
                                <span v-if="item.scale.floorAreaRatioPermitted"> (Permitted: {{
                                        formatDecimal(item.scale.floorAreaRatioPermitted) }}%)</span>
                        </div>
                </li>

                <li class="flex items-center" v-if="item.scale?.buildingCoverageRatioExisting > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">Building Coverage :
                        </div>
                        <div class="flex-1">
                                Existing {{ formatDecimal(item.scale.buildingCoverageRatioExisting) }}%
                                <span v-if="item.scale.buildingCoverageRatioPermitted"> (Permitted: {{
                                        formatDecimal(item.scale.buildingCoverageRatioPermitted) }}%)</span>
                        </div>
                </li>
        </ul>
</template>

<script setup lang="ts">
import { useFormat } from '~/composables/useFormat';

const props = defineProps({
        item: {
                required: true,
                type: Object
        }
});

const { numberFormat } = useFormat();
const formatDecimal = (val: any) => numberFormat(val, 2);
</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        margin: 0 0 1em;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>