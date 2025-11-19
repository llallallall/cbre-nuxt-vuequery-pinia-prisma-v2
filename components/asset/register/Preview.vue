<template>
        <div class="bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none w-full">

                <div class="relative 
                        px-[0.5em] pt-[0.5em] pb-[2.5em] 
                        backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                        border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] 
                        flex flex-col gap-10">

 
                        <div class="relative bg-white w-full min-h-[50em] overflow-hidden rounded-[10px] ">
                                <div class="absolute top-0 left-0 w-full h-[2em] flex items-center justify-between border-b">
                                        <div class="flex items-center">
                                                <span
                                                        class="rounded-full w-[0.6em] h-[0.6em] bg-[#ff6057] ml-[1em] first-line:cursor-pointer"></span>
                                                <span
                                                        class="rounded-full w-[0.6em] h-[0.6em] bg-[#febc2e] ml-[0.5em] cursor-pointer"></span>
                                                <span
                                                        class="rounded-full w-[0.6em] h-[0.6em] bg-[#28c840] ml-[0.5em] cursor-pointer"></span>
                                        </div>
                                        <div class="flex flex-1 items-center justify-end">
                                                <icon name="ic:outline-minus" size="1.2em"
                                                        class="mr-[0.5em] text-cbre_primary_4 cursor-pointer" :class="{
                                                                'bg-cbre_primary_2/40 rounded-full ': shrinkPreview,
                                                                'bg-transparent ': !shrinkPreview,
                                                        }" @click.prevent="() => {
                                                                shrinkPreview = !shrinkPreview;
                                                                growPreview = false
                                                        }" />
                                                <icon name="openmoji:overlapping-white-squares" size="1.2em"
                                                        class="mr-[0.5em] text-cbre_primary_4 cursor-pointer" :class="{
                                                                'bg-cbre_primary_2/40 rounded-full ': growPreview,
                                                                'bg-transparent ': !growPreview,
                                                        }" @click.prevent="() => {
                                                        growPreview = !growPreview;
                                                        shrinkPreview = false
                                                }" />
                                        </div>
                                </div>
                                <div
                                        class="absolute top-[2em] left-0 w-full h-[calc(100%-2em)]  p-6  overflow-x-hidden overflow-y-scroll">

                                        <div class="detail-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-financierMedium leading-6 text-primary">
                                                {{ propertyName }}

                                        </div>


                                        <div v-if="propertyName"
                                                class="flex-1 flex justify-end items-center gap-3 font-calibre text-base">

                                                <div class="action-buttons bg-primary/10 hover:bg-primary/25 
                                                text-primary rounded-full 
                                                whitespace-nowrap
                                                px-4 py-1 
                                                flex justify-center items-center gap-1" @click="moveToFloorPlan()">
                                                        <IconFloorPlan class="text-primary w-[20px] h-[20px] " />
                                                        Floor Plan
                                                </div>
                                                <div class="action-buttons bg-primary/10 hover:bg-primary/25 text-primary rounded-full whitespace-nowrap
                                                                                                                                px-4 py-1
                                                                                                                                flex justify-center items-center gap-1"
                                                        >
                                                        <IconBook class="text-primary w-[20px] h-[20px] " />
                                                        <!-- <img src="/images/icon-print.png" class="text-primary w-[20px] h-[20px] " /> -->

                                                        Brochure
                                                </div>
                                                <div class="action-buttons bg-primary/10 hover:bg-primary/25 text-primary rounded-full whitespace-nowrap
                                                                                                                                px-4 py-1
                                                                                                                                flex justify-center items-center gap-1"
                                                        @click="moveToMap()">
                                                        <IconMap class="text-primary w-[20px] h-[20px] " />
                                                        Map
                                                </div>
                                        </div>

                                        

                                        <div class="w-full mt-6 flex gap-5 relative " :class="{
                                                                'flex-row justify-between': growPreview,
                                                                'flex-col': !growPreview,
                                                        }">
                                                
                                                <div class="flex-1 flex gap-5 relative flex-col justify-start">

                                                        <div class="remarks -mt-2 border-b border-gray-200 pb-2">
                                                                <AssetPreviewsGeneral :item="(item as any)" /> 
                                                        </div>
                                                        <div class="highlights mt-4 border-0 border-gray-200 pb-0">
                                                                <AssetPreviewsHistoryList :item="(item as any)"  />
                                                        </div>

                                                
                                                </div>

                                                <div v-if="item.photoList && (item.photoList.filter((el:any)=> el.fileUrl && + (el.fileUrl+'').trim().length > 0)).length > 0 " class="flex-1 flex flex-col">
                                                        <div v-if="!growPreview" class="sales relative mt-4 border-t border-gray-200 pb-5" />
                                                        <div class="relative font-financier text-2xl text-primary pb-5" >Photos </div>

                                                                <AssetPreviewsImageList :images="(item.photoList as any[])" />
                                                </div>
                                                
                                                

                                                
                                        </div>

                                        <!-- <div>
                                        {{ photoList }}
                                        </div> -->

                                        

                                        <div class="sales relative mt-4 border-b border-gray-200 pb-5" />

                                        <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">

                                                <AssetPreviewsAccessibility :item="(item as any)" />


                                        </div>

                                        <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">

                                                <AssetDetailSizesAndMeasurements :item="(item as any)" />


                                        </div>

                                        <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">

                                                <AssetDetailFacility :item="(item as any)" />


                                        </div>

                                        <div class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">

                                                <AssetDetailParking :item="(item as any)" />


                                        </div>

                                        <div ref="previewFloorPlanRef" class="sales relative mt-4 border-b border-gray-200 pt-5 pb-10">

                                                <AssetPreviewsFloorPlan :item="(item as any)" />


                                        </div>

                                        <div class="sales relative mt-4 border-b border-gray-200 pb-10">

                                                <AssetPreviewsFloors :info="item?.floorList" />
                                        </div>


                                        <div v-if="item?.transactionInfo && Number(item.transactionInfo.totalTransactions) > 0"
                                                class="sales relative mt-4 border-b border-gray-200 pb-10">

                                                <AssetDetailSales :info="item.transactionInfo" />


                                        </div>
                                        <div v-if="item?.leaseInfo && Number(item?.leaseInfo.totalLeasesActual) > 0"
                                                class="lease-actual relative mt-4 border-b border-gray-200 pb-10">


                                                <AssetDetailLeaseActual :info="item?.leaseInfo" />


                                        </div>
                                        <div v-if="item?.leaseInfo && Number(item.leaseInfo.totalLeasesAsking) > 0"
                                                class="lease-asking relative mt-4 border-b border-gray-200 pb-10">

                                                <AssetDetailLeaseAsking :info="item.leaseInfo" />


                                        </div>

                                        <div ref="previewMapRef" class="location mt-4 border-0 border-gray-200 relative">
                                                <AssetDetailLocation :item="(item as any)" />
                                        </div>

                                </div>
                        </div>

                </div>
        </div>
</template>
 
<script setup lang="ts">

import { AccessibilityType, HistoryType, AssetPhotoType, CbreAsset, 
        EachFloorPhotoType, ElevatorsType, FacilityType, FileType, 
        FloorPlanPhotoListType, FloorPlanPhotoType, FloorType, 
        GeneralType, LocationType, MaterialsType, ParkingType, ProfitabilityType, 
        SectorType, SizesType, SubSectorType, WarehouseType } from '~/types/asset.type'

import { usePropertyStore } from '~/stores/property';
const { shrinkPreview, growPreview, propertyName, general, historyList, profitability, location, 
        accessibility, facility, floorList, photoList, brochureList, floorPlanPhotoList, sizes } = storeToRefs(usePropertyStore());

const previewFloorPlanRef = ref(null)
const previewMapRef = ref(null)

const moveToFloorPlan = () => {
        //@ts-ignore
        previewFloorPlanRef.value.scrollIntoView({ behavior: 'smooth' })
}
const moveToMap = () => {
        //@ts-ignore
        previewMapRef.value.scrollIntoView({ behavior: 'smooth' })
}

// const debug = ref(false)
const isLoading = ref(false)
 
const item = computed(() => {
        let obj = new Object as CbreAsset

        obj.propertyName = propertyName.value as string

        

        // obj.transactionInfo = transactionInfo.value

        // obj.leaseInfo = leaseInfo.value

        let generalObj = {
                sector: {
                        id: '',
                name: '',
                } as SectorType,
                subSector: {id: '',
                sectorId: '',
                name: '',} as SubSectorType | null,

                warehouse: {
                        room: 0 || null,
                        low: 0 || null,
                        constant: 0 || null,
                } as WarehouseType,
        } as GeneralType

        obj.general = generalObj

        
        let locationObj = {
                addressFull: location.value.addressFull + '' as string,
                addressFullJibun: location.value.addressFullJibun + '' as string,
                addressProvince: location.value.addressProvince + '' as string,
                addressCity: location.value.addressCity + '' as string,
                latitude: Number(location.value.latitude) as number,
                longitude: Number(location.value.longitude) as number
        } as LocationType

        obj.location = locationObj

        let profitabilityObj = {
                grade : profitability.value.grade + '' as string,
                effRatio : Number(profitability.value.effRatio) as number
        } as ProfitabilityType
        
        obj.profitability = profitabilityObj

        let facilityObj = new Object as FacilityType

        let initElevators = {
                total: facility.value.elevators.total as number,
                passenger: facility.value.elevators.passenger as number,
                service: facility.value.elevators.service as number,
                shuttle: facility.value.elevators.shuttle as number
        } as ElevatorsType
        facilityObj.elevators = initElevators

        let parkingObj = {
                cpsExisting: facility.value.parking.cpsExisting as number,
                cpsRequired: facility.value.parking.cpsRequired as number,
                freeCpsSqm: facility.value.parking.freeCpsSqm as number,
                freeCpsPy: facility.value.parking.freeCpsPy as number,
                paidParkingFee: facility.value.parking.paidParkingFee as number,
        } as ParkingType
        facilityObj.parking = parkingObj

        let materialsObj = {
                roofMaterial: facility.value.materials.roofMaterial as string,
                facade: facility.value.materials.facade as string,
                mechanicalElectrical: Number(facility.value.materials.mechanicalElectrical) as number,
                lighting: facility.value.materials.lighting as string,
                fireFighting: facility.value.materials.fireFighting as string,
        } as MaterialsType

        facilityObj.materials = materialsObj
        
        obj.facility = facilityObj
        

        let accessibilityObj = new Object as AccessibilityType
        accessibilityObj = {
                distanceToIc: accessibility.value.distanceToIc as string,
                timeTakenToCityHall: accessibility.value.timeTakenToCityHall as string,
                timeTakenToSubway: accessibility.value.timeTakenToSubway as string,
                nearbyFacilities: accessibility.value.nearbyFacilities as string,
                nearbyAttractions: accessibility.value.nearbyAttractions as string,
                nearbyPlaces: accessibility.value.nearbyPlaces as string
        } 
        obj.accessibility = accessibilityObj

        let sizesObj = new Object as SizesType
        sizesObj = {
                noOfBuildings: sizes.value.noOfBuildings as number,
                upperLevels: sizes.value.upperLevels as number,
                basementLevels: sizes.value.basementLevels as number,

                gfaSqm: sizes.value.gfaSqm as number ,
                gfaPy: sizes.value.gfaPy as number ,
                nfaSqm: sizes.value.nfaSqm as number ,
                nfaPy: sizes.value.nfaPy as number ,
                siteAreaSqm: sizes.value.siteAreaSqm as number ,
                siteAreaPy: sizes.value.siteAreaPy as number ,
                grossLeasableAreaSqm: sizes.value.grossLeasableAreaSqm as number ,
                grossLeasableAreaPy: sizes.value.grossLeasableAreaPy as number , 
                netLeasableAreaSqm: sizes.value.netLeasableAreaSqm as number ,
                netLeasableAreaPy: sizes.value.netLeasableAreaPy as number , 
                floorAreaRatioExisting: sizes.value.floorAreaRatioExisting as number ,
                floorAreaRatioPermitted: sizes.value.floorAreaRatioPermitted as number , 
                buildingCoverageRatioExisting: sizes.value.buildingCoverageRatioExisting as number , 
                buildingCoverageRatioPermitted: sizes.value.buildingCoverageRatioPermitted as number ,
                floorPlateSqm: sizes.value.floorPlateSqm as number , 
                floorPlatePy: sizes.value.floorPlatePy as number , 
        }
        obj.sizes = sizesObj
       
        obj.historyList = historyList.value as HistoryType[]

        obj.floorList = floorList.value as FloorType[]

        obj.floorPlanPhotoList = floorPlanPhotoList.value as FloorPlanPhotoListType

        obj.photoList = photoList.value as AssetPhotoType[]

        obj.brochureList = brochureList.value as FileType[]

        


        return obj
})
// const handleGoBack = () => {
//         if (tabIndex - 1 > 0) {
//                 emit('next', tabIndex + 1);
//         }
// }

// const handleSubmit = () => {
//         isLoading.value = true
//         try {
//                 //emit('next', tabIndex + 1);
//                 console.log('upload to server')
//         } catch (error: any) {
//                 console.log(error)

//         } finally {
//                 isLoading.value = false
//                 //actions.resetForm();
//         }
// }

</script>

<style scoped></style>