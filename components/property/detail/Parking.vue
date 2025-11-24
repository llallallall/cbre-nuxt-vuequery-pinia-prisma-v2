<template>
        <div class="font-financier text-2xl text-primary mb-2">Parking Information</div>

        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 md:grid-cols-2 gap-4">

                <li v-if="(facility?.cpsExisting !== null) || (facility?.cpsRequired !== null)"
                        class="flex items-center col-span-full">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Parking Capacity :
                        </div>
                        <div class="flex-1">
                                <span v-if="facility?.cpsExisting !== null">
                                        {{ formatInt(facility?.cpsExisting) }} units
                                </span>
                                <span v-if="facility?.cpsRequired !== null">
                                        (required {{ formatInt(facility?.cpsRequired) }} units)
                                </span>
                        </div>
                </li>

                <li v-if="(facility?.freeCpsSqm !== null) || (facility?.freeCpsPy !== null)"
                        class="flex items-center col-span-full">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Free Parking :
                        </div>
                        <div class="flex-1">
                                <span v-if="facility?.freeCpsSqm !== null">
                                        {{ formatDecimal(facility?.freeCpsSqm) }} units/sqm
                                </span>
                                <span v-if="facility?.freeCpsPy !== null">
                                        ({{ formatDecimal(facility?.freeCpsPy) }} units/py)
                                </span>
                        </div>
                </li>

                <li v-if="facility?.paidParkingFee !== null" class="flex items-center col-span-full">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Paid Parking Fee :
                        </div>
                        <div class="flex-1">
                                <span>KRW {{ formatInt(facility?.paidParkingFee) }} /unit (VAT include)</span>
                        </div>
                </li>
        </ul>
</template>

<script setup lang="ts">
import { useFormat } from '~/composables/useFormat';
import type { FacilityType } from '~/types/property.type';

const props = defineProps<{
        facility: FacilityType | null | undefined
}>();

const { numberFormat } = useFormat();
const formatInt = (val: any) => numberFormat(val, 0);
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