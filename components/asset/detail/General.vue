<template>
        <div class="relative font-financier text-2xl text-primary">
                General Infomation</div>


        <ul
                class="relative cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 md:grid-cols-2 gap-4">

                <li v-if="item.profitability?.grade" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Grade :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.profitability.grade
                                }}
                        </div>
                </li>
                <li v-if="item.profitability?.effectiveRatio" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Effective Ratio :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.profitability.effectiveRatio
                                }} %
                        </div>
                </li>
                <li v-if="item.scale?.noOfBuildings" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                No. of Buildings :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.scale.noOfBuildings
                                }}
                        </div>
                </li>
                <li v-if="item.sector?.name" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Sector :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.sector.name
                                }}
                        </div>
                </li>
                <li v-if="item.subsector?.name" class="flex items-center">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                SubSector
                                :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.subsector.name
                                }}
                        </div>
                </li>
                <li v-if="item.sector?.name === 'Logistics' && item.warehouse && item.warehouse.length > 0"
                        class="flex items-start mt-0 col-span-full">
                        <IconMinus class="w-[18px] mr-1 mt-2" />
                        <div class="w-[130px] whitespace-nowrap text-right mr-4 font-calibre pt-1">
                                Usage :
                        </div>
                        <div class="flex-1">
                                <table class="text-xs mt-1 w-auto border border-gray-200">
                                        <thead>
                                                <tr class="text-center bg-gray-50">
                                                        <th class="px-3 py-1 border-b">Room</th>
                                                        <th class="px-3 py-1 border-b">Low</th>
                                                        <th class="px-3 py-1 border-b">Constant</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr class="text-center">
                                                        <td class="px-3 py-1"> {{ getWarehouseRatio('ROOM') }}%</td>
                                                        <td class="px-3 py-1"> {{ getWarehouseRatio('LOW') }}%</td>
                                                        <td class="px-3 py-1"> {{ getWarehouseRatio('CONSTANT') }}%</td>
                                                </tr>
                                        </tbody>
                                </table>
                        </div>
                </li>
        </ul>
</template>

<script setup lang="ts">
const props = defineProps({
        item: {
                required: true,
                type: Object
        }
});

// 💡 Warehouse 비율 추출 헬퍼 함수
const getWarehouseRatio = (type: string) => {
        const w = props.item?.warehouse?.find((item: any) => item.temperatureType === type);
        return Number(w?.ratio) || 0;
};

</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>