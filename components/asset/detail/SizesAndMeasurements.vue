<template>
        <div class="font-financier text-2xl text-primary">
                Sizes and Measurements Information</div>
        <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3">

                <li class="flex items-center" 
                v-if="item.sizes.gfaSqm
                                        &&
                                        item.sizes.gfaSqm
                                        > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                GFA :
                        </div>
                        <div class="flex-1">
                                {{
                                        item.sizes.gfaSqm
                                        &&
                                        item.sizes.gfaSqm
                                        > 0 ?
                                        numberFormat(item.sizes.gfaSqm,
                                                2) +
                                        `㎡ (`
                                        +
                                        numberFormat(item.sizes.gfaPy,
                                                2) +
                                        'py)' :
                                        'N.A.'
                                }}
                        </div>
                </li>
                <li class="flex items-center" 
                v-if="item.sizes.nfaSqm
                                        &&
                                        item.sizes.nfaSqm
                                        > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                NFA :
                        </div>
                        <div class="flex-1">



                                {{
                                        item.sizes.nfaSqm
                                        &&
                                        item.sizes.nfaSqm
                                        > 0 ?
                                        numberFormat(item.sizes.nfaSqm,
                                                2) +
                                        `㎡ (`
                                        +
                                        numberFormat(item.sizes.nfaPy,
                                                2) +
                                        'py)' :
                                        'N.A.'
                                }}
                        </div>
                </li>
                <li class="flex items-center"
                v-if="item.sizes.siteAreaSqm
                                        &&
                                        item.sizes.siteAreaSqm
                                        > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Land Area :
                        </div>
                        <div class="flex-1">



                                {{
                                        item.sizes.siteAreaSqm
                                        &&
                                        item.sizes.siteAreaSqm
                                        > 0 ?
                                        numberFormat(item.sizes.siteAreaSqm,
                                                2) +
                                        `㎡ (`
                                        +
                                        numberFormat(item.sizes.siteAreaPy,
                                                2) +
                                        'py)' :
                                        'N.A.'
                                }}
                        </div>
                </li>
                <li class="flex items-center" v-if="item.sizes.floorPlateSqm
                                        &&
                                        item.sizes.floorPlateSqm
                                        > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Floor Plate :
                        </div>
                        <div class="flex-1">



                                {{
                                        item.sizes.floorPlateSqm
                                        &&
                                        item.sizes.floorPlateSqm
                                        > 0 ?
                                        numberFormat(item.sizes.floorPlateSqm,
                                                2) +
                                        `㎡ (`
                                        +
                                        numberFormat(item.sizes.floorPlatePy,
                                                2) +
                                        'py)' :
                                        'N.A.'
                                }}
                        </div>
                </li>
                <li class="flex items-center"
                v-if="item.sizes.grossLeasableAreaSqm
                                        &&
                                        item.sizes.grossLeasableAreaSqm
                                        > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Gross Leasable Area :
                        </div>
                        <div class="flex-1">



                                {{
                                        item.sizes.grossLeasableAreaSqm
                                        &&
                                        item.sizes.grossLeasableAreaSqm
                                        > 0 ?
                                        numberFormat(item.sizes.grossLeasableAreaSqm,
                                                2) +
                                        `㎡ (`
                                        +
                                        numberFormat(item.sizes.grossLeasableAreaPy,
                                                2) +
                                        'py)' :
                                        'N.A.'
                                }}
                        </div>
                </li>
                <li class="flex items-center"
                v-if="item.sizes.netLeasableAreaSqm
                                        &&
                                        item.sizes.netLeasableAreaSqm
                                        > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Net Leasable Area :
                        </div>
                        <div class="flex-1">



                                {{
                                        item.sizes.netLeasableAreaSqm
                                        &&
                                        item.sizes.netLeasableAreaSqm
                                        > 0 ?
                                        numberFormat(item.sizes.netLeasableAreaSqm,
                                                2) +
                                        `㎡ (`
                                        +
                                        numberFormat(item.sizes.netLeasableAreaPy,
                                                2) +
                                        'py)' :
                                        'N.A.'
                                }}
                        </div>
                </li>


                </ul>
                <ul class="cbre_bulletList font-calibreLight text-lg text-primary grid grid-cols-1">
                
                
                <li class="flex items-center"
                v-if="item.sizes.floorAreaRatioExisting
                                        &&
                                        item.sizes.floorAreaRatioExisting
                                        > 0">
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Floor Area Ratio :
                        </div>
                        <div class="flex-1">



                                {{
                                        item.sizes.floorAreaRatioExisting
                                        &&
                                        item.sizes.floorAreaRatioExisting
                                        > 0 ?
                                        'existing ' + numberFormat(item.sizes.floorAreaRatioExisting,
                                                2) +
                                        `㎡ (`
                                        + 'permitted : ' +
                                        numberFormat(item.sizes.floorAreaRatioPermitted,
                                                2) +
                                        '㎡)' :
                                        'N.A.'
                                }}
                        </div>
                </li>
                

                <li class="flex items-center"
                        v-if="item.sizes.buildingCoverageRatioExisting
                                        &&
                                        item.sizes.buildingCoverageRatioExisting
                                        > 0"
                >
                        <IconMinus class="w-[18px] mr-1" />
                        <div class="min-w-[130px] whitespace-nowrap text-right mr-4 font-calibre">
                                Building Coverage Ratio :
                        </div>
                        <div class="flex-1">



                                {{
                                        item.sizes.buildingCoverageRatioExisting
                                        &&
                                        item.sizes.buildingCoverageRatioExisting
                                        > 0 ?
                                        'existing ' + numberFormat(item.sizes.buildingCoverageRatioExisting,
                                                2) +
                                        `㎡ (`
                                        + 'permitted : ' +
                                        numberFormat(item.sizes.buildingCoverageRatioPermitted,
                                                2) +
                                        '㎡)' :
                                        'N.A.'
                                }}
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

</script>

<style scoped>
.cbre_bulletList {
        list-style: none;
        margin: 0 0 1em;
        padding: 0 0 0 20px;
        line-height: 2;
}
</style>