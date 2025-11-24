<template>
        <div class="font-financier text-2xl text-primary mb-4">
                Facility Information</div>


        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 gap-y-2">

                <li v-if="facility?.elevatorsTotal > 0" class="flex items-center ">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Elevators :
                        </div>
                        <div class="flex-1 text-base">
                                <span class="font-semibold">{{ facility?.elevatorsTotal }}</span>
                                <span v-if="facility?.elevatorsTotal > 0" class="text-gray-600 text-sm ml-2">
                                        (
                                        <span v-if="facility?.elevatorsPassenger">{{
                                                facility?.elevatorsPassenger }} Passenger</span>
                                        <span v-if="facility?.elevatorsService"> / {{ facility?.elevatorsService
                                                }} Service</span>
                                        <span v-if="facility?.elevatorsFreight"> / {{ facility?.elevatorsFreight
                                                }} Freight</span>
                                        )
                                </span>
                        </div>
                </li>
                <li v-if="facility?.facade" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Façade :
                        </div>
                        <div class="flex-1">
                                {{ facility?.facade }}
                        </div>
                </li>

                <li v-if="facility?.roofMaterial" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Roof Material :
                        </div>
                        <div class="flex-1">
                                {{ facility?.roofMaterial }}
                        </div>
                </li>

                <li v-if="facility?.lighting" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Lighting :
                        </div>
                        <div class="flex-1">
                                {{ facility?.lighting }}
                        </div>
                </li>

                <li v-if="facility?.mechanicalElectrical" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                M & E :
                        </div>
                        <div class="flex-1">
                                {{ thousandsFormat(facility?.mechanicalElectrical) }} kW
                        </div>
                </li>

                <li v-if="facility?.fireFighting" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Fire Fighting :
                        </div>
                        <div class="flex-1">
                                {{ facility?.fireFighting }}
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
const thousandsFormat = (val: any) => numberFormat(val, 0);
</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>