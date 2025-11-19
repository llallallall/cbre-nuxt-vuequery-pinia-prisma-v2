import { FloorObj } from './../../../types/asset.type';
import prisma from '@/prisma/cbredb'

export default eventHandler(async (event) => {
            
        const body = await readBody(event)

         console.log("update database")
 
        // console.log(body.values)
    
        // 1) create propertyId 
        // let propertyResult = await prisma.property.create(
        //         {
        //             data: {
        //                     name          : body.values.propertyName,
        //                     sector_id      : body.values.general.sector ? body.values.general.sector.id : null,
        //                     subsector_id   : body.values.general.subsector? body.values.general.subsector.id : null,
        //                     //image         :,
        //                     //historyId     :,
        //                     //transactionId :
        //             },
        //         }
        // )
        // console.log(body.values.propertyId)   
            
        let propertyId = body.values.propertyId+'' as string

        if(propertyId) {

        // 2)  historyList
        const deleteHistory = await prisma.history.deleteMany({
            where: {
                property_id: propertyId,
            },
          })

      
        let historyList = body.values.historyList
        for (let i=0; i < historyList.length; i++) {
            let history = historyList[i]
            let historyResult = await prisma.history.create(
                    {
                        data: {
                            property_id      : propertyId,
                            year            : history.year,
                            type            : history.type
                        },
                    }
                )
            // console.log(historyResult) 
        }  


        // 3)  Warehouse (optional)

        const deleteWarehouse = await prisma.warehouse.deleteMany({
            where: {
                property_id: propertyId,
            },
          })

        if(body.values.general.warehouse.room) {

             let warehouseRoomResult = await prisma.warehouse.create(
                {
                    data: {
                        property_id              : propertyId,
                        temperature_type        : 'ROOM',
                        ratio                   : Number(body.values.general.warehouse.room),
                    },
                }
            )
            // console.log(warehouseRoomResult) 
        }

        if(body.values.general.warehouse.low) {

  

            let warehouseLowResult = await prisma.warehouse.create(
                {
                    data: {
                        property_id              : propertyId,
                        temperature_type        : 'LOW',
                        ratio                   : Number(body.values.general.warehouse.low),
                    },
                }
            )
            // console.log(warehouseLowResult) 
        }

        if(body.values.general.warehouse.constant) {
            let warehouseConstantResult = await prisma.warehouse.create(
                {
                    data: {
                        property_id              : propertyId,
                        temperature_type        : 'CONSTANT',
                        ratio                   : Number(body.values.general.warehouse.constant),
                    },
                }
            )
            // console.log(warehouseConstantResult) 
        }


        // 4)  Profitability

        
        const deleteProfitability = await prisma.profitability.deleteMany({
            where: {
                property_id: propertyId,
            },
          })

        let profitabilityResult = await prisma.profitability.create(
                {
                    data: {
                        property_id              : propertyId,
                        grade                   : body.values.profitability.grade,
                        effective_ratio         : Number(body.values.profitability.effRatio),
                    },
                }
        )
            // console.log(profitabilityResult) 


        // 5)  location

        const deleteLocation = await prisma.location.deleteMany({
            where: {
                property_id: propertyId,
            },
          })
        let locationResult = await prisma.location.create(
                {
                    data: {
                        property_id         : propertyId,
                        address_full       : body.values.location.addressFull,
                        address_full_jibun : body.values.location.addressFullJibun,
                        address_province   : body.values.location.addressProvince,
                        address_city       : body.values.location.addressCity,
                        latitude           : Number(body.values.location.latitude),
                        longitude          : Number(body.values.location.longitude),
                    },
                }
        )
            // console.log(locationResult)


        // 6)  accessibility

        const deleteAccessibility = await prisma.accessibility.deleteMany({
            where: {
                property_id: propertyId,
            },
          })

        let accessibilityResult = await prisma.accessibility.create(
                {
                    data: {
                        property_id              : propertyId,
                        distance_to_ic          : body.values.accessibility.distanceToIc,
                        time_taken_to_city_hall : body.values.accessibility.timeTakenToCityHall,
                        time_taken_to_subway    : body.values.accessibility.timeTakenToSubway,
                        nearby_facilities       : body.values.accessibility.nearbyFacilities,
                        nearby_attractions      : body.values.accessibility.nearbyAttractions,
                        nearby_places           : body.values.accessibility.nearbyPlaces,
                    },
                }
        )
            // console.log(accessibilityResult)

        // 7)  sizes

        const deleteScale = await prisma.scale.deleteMany({
            where: {
                property_id: propertyId,
            },
          })

        let sizesResult = await prisma.scale.create(
                {
                    data: {
                        property_id                        : propertyId,
                        no_of_buildings                   : Number(body.values.sizes.noOfBuildings),
                        upper_levels                      : Number(body.values.sizes.upperLevels),
                        basement_levels                   : Number(body.values.sizes.basementLevels),
                        gfa_sqm                           : Number(body.values.sizes.gfaSqm),
                        gfa_py                            : Number(body.values.sizes.gfaPy),
                        nfa_sqm                           : Number(body.values.sizes.nfaSqm),
                        nfa_py                            : Number(body.values.sizes.nfaPy),
                        site_area_sqm                     : Number(body.values.sizes.siteAreaSqm),
                        site_area_py                      : Number(body.values.sizes.siteAreaPy),
                        gross_leasable_area_sqm           : Number(body.values.sizes.grossLeasableAreaSqm),
                        gross_leasable_area_py            : Number(body.values.sizes.grossLeasableAreaPy),
                        net_leasable_area_sqm             : Number(body.values.sizes.netLeasableAreaSqm),
                        net_leasable_area_py              : Number(body.values.sizes.netLeasableAreaPy),
                        floor_area_ratio_existing         : Number(body.values.sizes.floorAreaRatioExisting),
                        floor_area_ratio_permitted        : Number(body.values.sizes.floorAreaRatioPermitted),
                        building_coverage_ratio_existing  : Number(body.values.sizes.buildingCoverageRatioExisting),
                        building_coverage_ratio_permitted : Number(body.values.sizes.buildingCoverageRatioPermitted),
                        floor_plate_sqm                   : Number(body.values.sizes.floorPlateSqm),
                        floor_plate_py                    : Number(body.values.sizes.floorPlatePy),
                    },
                }
        )
            // console.log(sizesResult)


        // 8)  facility

        const deleteFacility = await prisma.facility.deleteMany({
            where: {
                property_id: propertyId,
            },
          })


        let facilityResult = await prisma.facility.create(
                {
                    data: {
                        property_id                        : propertyId,
                        elevators_total         : Number(body.values.facility.elevators.total),
                        elevators_passenger     : Number(body.values.facility.elevators.passenger),
                        elevators_service       : Number(body.values.facility.elevators.service),
                        elevators_freight       : Number(body.values.facility.elevators.shuttle),
                        cps_existing            : Number(body.values.facility.parking.cpsExisting),
                        cps_required            : Number(body.values.facility.parking.cpsRequired),
                        free_cps_sqm            : Number(body.values.facility.parking.freeCpsSqm),
                        free_cps_py             : Number(body.values.facility.parking.freeCpsPy),
                        paid_parking_fee        : Number(body.values.facility.parking.paidParkingFee),
                        roof_material           : body.values.facility.materials.roofMaterial,
                        facade                  : body.values.facility.materials.facade,
                        mechanical_electrical   : Number(body.values.facility.materials.mechanicalElectrical),
                        lighting                : body.values.facility.materials.lighting,
                        fire_fighting           : body.values.facility.materials.fireFighting,
                    },
                }
        )
            // console.log(facilityResult)


        // 8)  floor

        const deleteFloor = await prisma.floor.deleteMany({
            where: {
                property_id: propertyId,
            },
          })

        //   console.log(body.values)

        
        let upperFloorListResult = body.values.floorList.filter((el:any)=> el.type && el.type == 'UPPER' )
        // console.log(upperFloorListResult)

        if(upperFloorListResult ) {
            for (let i=0; i < upperFloorListResult.length; i++) {
                let upper = upperFloorListResult[i]
                let upperFloorResult = await prisma.floor.create(
                        {
                            data: {
                                property_id     : propertyId,
                                type            : 'UPPER',
                                floor           : Number(upper.floor),
                                ceiling_height  : Number(upper.ceilingHeight),
                                floor_load      : Number(upper.floorLoad),
                                truck_berths    : Number(upper.truckBerths),
                            },
                        }
                    )
                // console.log(upperFloorResult) 

        }
            
        }  

        
        let basementFloorListResult = body.values.floorList.filter((el:any)=> el.type && el.type == 'BASEMENT' )
        // console.log(basementFloorListResult)

        if(basementFloorListResult) {

            for (let i=0; i < basementFloorListResult.length; i++) {
                let basement = basementFloorListResult[i]
                let basementFloorResult = await prisma.floor.create(
                        {
                            data: {
                                property_id     : propertyId,
                                type            : 'BASEMENT',
                                floor           : Number(basement.floor),
                                ceiling_height  : Number(basement.ceilingHeight),
                                floor_load      : Number(basement.floorLoad),
                                truck_berths    : Number(basement.truckBerths),
                            },
                        }
                    )
                // console.log(basementFloorResult) 
        }
            
        }  


        // 9) photoList

        const deletePropertyImageFile = await prisma.propertyImageFile.deleteMany({
            where: {
                property_id: propertyId,
            },
          })

        let photoListResult = body.values.photoList

        if(photoListResult) {
            for (let i=0; i < photoListResult.length; i++) {
                let photo = photoListResult[i]
                if(photo.fileUuid) {


                    let photoResult = await prisma.propertyImageFile.create(
                        {
                            data: {
                                property_id       : propertyId,
                                file_uuid         : photo.fileUuid,
                                file_name         : photo.fileName,
                                file_key          : photo.fileKey,
                                file_url          : photo.fileUrl,
                                file_content_type : photo.fileContentType,
                            },
                        }
                    )
                // console.log(photoResult) 
                }

        }
            
                
        }  

        // 10) floorPlanPhotoList
        let floorPlanPhotoList = body.values.floorPlanPhotoList

        if(floorPlanPhotoList.logitudinal.length > 0 || floorPlanPhotoList.cross.length > 0 || floorPlanPhotoList.eachFloor.uppers.length > 0 || floorPlanPhotoList.eachFloor.basements.length > 0  ) {

            const deleteFloorPlanFile = await prisma.floorPlanFile.deleteMany({
                    where: {
                        property_id: propertyId,
                    },
                })
        }

          

            // logitudinal
                let logitudinalList = floorPlanPhotoList.logitudinal

                if(logitudinalList){
                    for (let i=0; i < logitudinalList.length; i++) {
                        let logitudinal = logitudinalList[i]
                        let logitudinalResult = await prisma.floorPlanFile.create(
                                {
                                    data: {
                                        property_id         : propertyId,
                                        type                : "LOGITUDINALSECTION",
                                        floor               : logitudinal.floor,
                                        file_uuid           : logitudinal.fileUuid,
                                        file_name           : logitudinal.fileName,
                                        file_key            : logitudinal.fileKey,
                                        file_url            : logitudinal.fileUrl,
                                        file_content_type   : logitudinal.fileContentType,
                                    },
                                }
                            )
                        // console.log(logitudinalResult) 
                    }  

                }

                


            // cross
                let crossList = floorPlanPhotoList.cross

                if(crossList) {
                    for (let i=0; i < crossList.length; i++) {
                        let cross = crossList[i]
                        let crossResult = await prisma.floorPlanFile.create(
                                {
                                    data: {
                                        property_id         : propertyId,
                                        type                : "CROSSSECTION",
                                        floor               : cross.floor,
                                        file_uuid           : cross.fileUuid,
                                        file_name           : cross.fileName,
                                        file_key            : cross.fileKey,
                                        file_url            : cross.fileUrl,
                                        file_content_type   : cross.fileContentType,
                                    },
                                }
                            )
                        // console.log(crossResult) 
                    } 

                }

                

            // eachFloor - uppers
                let uppersList =  floorPlanPhotoList.eachFloor.uppers
                if(uppersList && uppersList.length > 0){
                    for (let i=0; i < uppersList.length; i++) {
                        let uppers = uppersList[i]
                        if(uppers.fileUuid) {

                            let uppersResult = await prisma.floorPlanFile.create(
                                {
                                    data: {
                                        property_id         : propertyId,
                                        type                : "UPPERSECTION",
                                        floor               : uppers.floor,
                                        file_uuid           : uppers.fileUuid,
                                        file_name           : uppers.fileName,
                                        file_key            : uppers.fileKey,
                                        file_url            : uppers.fileUrl,
                                        file_content_type   : uppers.fileContentType,
                                    },
                                }
                            )
                        // console.log(uppersResult) 
                        }
                        
                    } 

                }
                

            // eachFloor - basements

                let basementsList =  floorPlanPhotoList.eachFloor.basements

                if(basementsList && basementsList.length > 0) {
                    for (let i=0; i < basementsList.length; i++) {
                        let basements = basementsList[i]

                        if(basements.fileUuid) {
                            let basementsResult = await prisma.floorPlanFile.create(
                                    {
                                        data: {
                                            property_id         : propertyId,
                                            type                : "BASEMENTSECTION",
                                            floor               : basements.floor,
                                            file_uuid           : basements.fileUuid,
                                            file_name           : basements.fileName,
                                            file_key            : basements.fileKey,
                                            file_url            : basements.fileUrl,
                                            file_content_type   : basements.fileContentType,
                                        },
                                    }
                                )
                            // console.log(basementsResult) 
                        }
                    } 

                }
                

        // 11) brocherFileList

        const deletePropertyBrochureFile = await prisma.propertyBrochureFile.deleteMany({
            where: {
                property_id: propertyId,
            },
          })
          
        let brochureList = body.values.brochureList

        if(brochureList) {
            for (let i=0; i < brochureList.length; i++) {
                let brochure = brochureList[i]
                let brochureResult = await prisma.propertyBrochureFile.create(
                        {
                            data: {
                                property_id         : propertyId,
                                file_uuid           : brochure.fileUuid,
                                file_name           : brochure.fileName,
                                file_key            : brochure.fileKey,
                                file_url            : brochure.fileUrl,
                                file_content_type   : brochure.fileContentType,
                            },
                        }
                    )
                // console.log(brochureResult) 
            }   


          }
        } // if(propertyId) 
        

        return  {uploadUrl:null, fileName: null};
})


        