<template>
        <div class="font-financier text-2xl text-primary mb-4">
                Facility Information</div>


        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 gap-y-2">

                <li v-if="item.facility?.elevatorsTotal > 0" class="flex items-center ">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Elevators :
                        </div>
                        <div class="flex-1 text-base">
                                <span class="font-semibold">{{ item.facility.elevatorsTotal }}</span>
                                <span v-if="item.facility.elevatorsTotal > 0" class="text-gray-600 text-sm ml-2">
                                        (
                                        <span v-if="item.facility.elevatorsPassenger">{{
                                                item.facility.elevatorsPassenger }} Passenger</span>
                                        <span v-if="item.facility.elevatorsService"> / {{ item.facility.elevatorsService
                                                }} Service</span>
                                        <span v-if="item.facility.elevatorsFreight"> / {{ item.facility.elevatorsFreight
                                                }} Freight</span>
                                        )
                                </span>
                        </div>
                </li>

                <li v-if="item.facility?.facade" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Façade :
                        </div>
                        <div class="flex-1">
                                {{ item.facility.facade }}
                        </div>
                </li>

                <li v-if="item.facility?.roofMaterial" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Roof Material :
                        </div>
                        <div class="flex-1">
                                {{ item.facility.roofMaterial }}
                        </div>
                </li>

                <li v-if="item.facility?.lighting" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Lighting :
                        </div>
                        <div class="flex-1">
                                {{ item.facility.lighting }}
                        </div>
                </li>

                <li v-if="item.facility?.mechanicalElectrical" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                M & E :
                        </div>
                        <div class="flex-1">
                                {{ thousandsFormat(item.facility.mechanicalElectrical) }} kW
                        </div>
                </li>

                <li v-if="item.facility?.fireFighting" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Fire Fighting :
                        </div>
                        <div class="flex-1">
                                {{ item.facility.fireFighting }}
                        </div>
                </li>

        </ul>
</template>

<script setup lang="ts">
import { useFormat } from '~/composables/useFormat';

const { item } = defineProps({
        item: {
                required: true,
                type: Object
        }
})

const { numberFormat } = useFormat();
const thousandsFormat = (val: any) => numberFormat(val, 0);
</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>