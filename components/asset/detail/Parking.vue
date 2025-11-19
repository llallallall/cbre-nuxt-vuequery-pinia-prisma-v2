<template>
        <div class="font-financier text-2xl text-primary mb-2">Parking Information</div>

        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 md:grid-cols-2 gap-4">

                <li v-if="(item.facility?.cpsExisting !== null) || (item.facility?.cpsRequired !== null)"
                        class="flex items-center col-span-full">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Parking Capacity :
                        </div>
                        <div class="flex-1">
                                <span v-if="item.facility?.cpsExisting !== null">
                                        {{ formatInt(item.facility.cpsExisting) }} units
                                </span>
                                <span v-if="item.facility?.cpsRequired !== null">
                                        (required {{ formatInt(item.facility.cpsRequired) }} units)
                                </span>
                        </div>
                </li>

                <li v-if="(item.facility?.freeCpsSqm !== null) || (item.facility?.freeCpsPy !== null)"
                        class="flex items-center col-span-full">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Free Parking :
                        </div>
                        <div class="flex-1">
                                <span v-if="item.facility?.freeCpsSqm !== null">
                                        {{ formatDecimal(item.facility.freeCpsSqm) }} units/sqm
                                </span>
                                <span v-if="item.facility?.freeCpsPy !== null">
                                        ({{ formatDecimal(item.facility.freeCpsPy) }} units/py)
                                </span>
                        </div>
                </li>

                <li v-if="item.facility?.paidParkingFee !== null" class="flex items-center col-span-full">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Paid Parking Fee :
                        </div>
                        <div class="flex-1">
                                <span>KRW {{ formatInt(item.facility.paidParkingFee) }} /unit (VAT include)</span>
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