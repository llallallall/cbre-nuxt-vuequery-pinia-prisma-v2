<template>
        <div class="font-financier text-2xl text-primary">
                Parking Information</div>


        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid" :class="{
                'grid-cols-1': propertyStore.shrinkPreview && !propertyStore.growPreview,
                'grid-cols-2': !propertyStore.shrinkPreview && !propertyStore.growPreview,
                'grid-cols-3': !propertyStore.shrinkPreview && propertyStore.growPreview,
        }">



                <li v-if="(item.facility && item.facility?.parking?.cpsExisting) || (item.facility && item.facility?.parking?.cpsRequired)" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Parking Capacity
                                :
                        </div>
                        <div class="flex-1">

                                <span v-if="item.facility && item.facility?.parking?.cpsExisting"> {{ thousandsFormat(item.facility?.parking?.cpsExisting) }}
                                        units</span>

                                <span v-if="item.facility && item.facility?.parking?.cpsRequired">(required {{ thousandsFormat(item.facility?.parking?.cpsRequired)
                                }} units)</span>
                        </div>
                </li>
                <li v-if="(item.facility && item.facility?.parking?.freeCpsSqm) || (item.facility && item.facility?.parking?.freeCpsPy)" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Free
                                Parking
                                :
                        </div>
                        <div class="flex-1">
                                <span v-if="item.facility && item.facility?.parking?.freeCpsSqm"> {{ thousandsFormat(item.facility?.parking?.freeCpsSqm) }}
                                        units/sqm</span>

                                <span v-if="item.facility && item.facility?.parking?.freeCpsPy">({{ thousandsFormat(item.facility?.parking?.freeCpsPy) }}
                                        units/py)</span>
                        </div>
                </li>
                <li v-if="item.facility && item.facility?.parking?.paidParkingFee" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Paid
                                Parking
                                Fee
                                :
                        </div>
                        <div class="flex-1">

                                <span v-if="item.facility && item.facility?.parking?.paidParkingFee">KRW {{ thousandsFormat(item.facility?.parking?.paidParkingFee)
                                }} /unit
                                        (VAT
                                        include)</span>

                        </div>
                </li>
        </ul>
</template>

<script setup lang="ts">
const { item } = defineProps({
        item: {
                required: true,
                type: Object
        }
})
import { usePropertyStore } from '~/stores/property';
const propertyStore = usePropertyStore()
</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        margin: 0 0 1em;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>