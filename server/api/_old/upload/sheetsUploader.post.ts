//@ts-nocheck
import * as XLSX from 'xlsx';
import { FloorObj } from './../../../types/asset.type';
import prisma from '@/prisma/cbredb'

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
XLSX.set_cptable(cpexcel);

export default defineEventHandler(async (event) => {
        
        console.log('sheets uploader')
        try {

                let sectorList = await prisma.sector.findMany({
                        select: {
                                id: true,
                                name: true,
                        },
                })

                let subSectorList = await prisma.subSector.findMany({
                        select: {
                                id: true,
                                sector_id: true,
                                name: true,
                        },
                })

                const files = await readMultipartFormData(event);

                if(files) {
                        //===============================================================================================================================================
                        //===============================================================================================================================================
                        console.log('sheets parsing first sheet ')
                        //===============================================================================================================================================
                        //===============================================================================================================================================
                        const workbook = XLSX.read(files[0].data, {cellDates:true});
                        const sheetName = workbook.SheetNames[0];
                        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                        /* create an array of arrays */
                        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

                        const raw_datas = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) //, { header: "A" }) 

                        /* create column array */
                        const range = XLSX.utils.decode_range(workbook.Sheets[sheetName]["!ref"]||"A1");
                        const columns = Array.from({ length: range.e.c + 1 }, (_, i) => ({
                                field: String(i+1), // vtl will access row["0"], row["1"], etc
                                label: XLSX.utils.encode_col(i), // the column labels will be A, B, etc
                              })); 
                        //console.log(raw_datas)   

                        let tempNoList = [];
                        let floorList = [];

                        for(let i = 0; i<raw_datas.length; i++){

                                let tempNo  = null
                                tempNo = raw_datas[i]['Temp No.'] != undefined ? raw_datas[i]['Temp No.'] : null
                                console.log("first sheet " + tempNo )   

                                if(tempNo != null ) {

                                        let tempNoPropertyId = new Object();

                                        // headers 

                                        let propertyName
                                        let sectorName
                                        let subSectorName
                                        let warehouseRoom
                                        let warehouseLow
                                        let warehouseConstant
                                        let histotyCompletion
                                        let histotyRenovation1
                                        let histotyRenovation2
                                        let profitabilityGrade
                                        let profitabilityEffRatio
                                        let addressFull
                                        let addressJibun
                                        let addressProvince
                                        let addressCity
                                        let addressLatitude
                                        let addressLongitude
                                        let accessibilityDistanceToIc
                                        let accessibilityTimeTakenToCityHall
                                        let accessibilityTimeTakenToSubway
                                        let accessibilityNearbyFacilities
                                        let accessibilityNearbyAttractions
                                        let accessibilityNearbyPlaces
                                        let sizesNoOfBuildings
                                        let sizesNoOfUpperLevels
                                        let sizesNoOfBasementLevels
                                        let sizesGFAsqm
                                        let sizesGFApy
                                        let sizesNFAsqm
                                        let sizesNFApy
                                        let sizesSiteAreasqm
                                        let sizesSiteAreapy
                                        let sizesGrossLeasableAreasqm
                                        let sizesGrossLeasableAreapy
                                        let sizesNetLeasableAreasqm
                                        let sizesNetLeasableAreapy
                                        let sizesFloorAreaRatioExisting
                                        let sizesFloorAreaRatioPermitted
                                        let sizesBuildingCoverageRatioExisting
                                        let sizesBuildingCoverageRatioPermitted
                                        let sizesFloorPlatesqm
                                        let sizesFloorPlatepy
                                        let facilityElevatorsPassenger
                                        let facilityElevatorsService
                                        let facilityElevatorsShuttle
                                        let facilityParkingCPSExisting
                                        let facilityParkingCPSRequired
                                        let facilityParkingFreeCPSsqm
                                        let facilityParkingFreeCPSpy
                                        let facilityPaidParkingFee
                                        let materialsRoofMaterial
                                        let materialsFaçade
                                        let materialsMechanicalElectrical
                                        let materialsLighting
                                        let materialsFireFighting


                                        propertyName = raw_datas[i]['Property Name'] != undefined ? raw_datas[i]['Property Name'] : null
                                        //console.log(propertyName)
                                        sectorName = raw_datas[i]['Sector Name'] != undefined ? raw_datas[i]['Sector Name'] : null
                                        //console.log(sectorName)
                                        subSectorName = raw_datas[i]['Sub Sector Name'] != undefined ? raw_datas[i]['Sub Sector Name'] : null
                                        //console.log(subSectorName)

                                        warehouseRoom = raw_datas[i]['Warehouse - Room'] != undefined ? raw_datas[i]['Warehouse - Room'] : null
                                        //console.log(warehouseRoom)
                                        warehouseLow = raw_datas[i]['Warehouse - Low'] != undefined ? raw_datas[i]['Warehouse - Low'] : null
                                        //console.log(warehouseLow)
                                        warehouseConstant = raw_datas[i]['Warehouse - Constant'] != undefined ? raw_datas[i]['Warehouse - Constant'] : null
                                        //console.log(warehouseConstant)

                                        histotyCompletion = raw_datas[i]['Histoty - Completion'] != undefined ? raw_datas[i]['Histoty - Completion'] : null
                                        //console.log(histotyCompletion)
                                        histotyRenovation1 = raw_datas[i]['Histoty - Renovation #1'] != undefined ? raw_datas[i]['Histoty - Renovation #1'] : null
                                        //console.log(histotyRenovation1)
                                        histotyRenovation2 = raw_datas[i]['Histoty - Renovation #2'] != undefined ? raw_datas[i]['Histoty - Renovation #2'] : null
                                        //console.log(histotyRenovation2)

                                        profitabilityGrade = raw_datas[i]['Profitability - Grade'] != undefined ? raw_datas[i]['Profitability - Grade'] : null
                                        //console.log(profitabilityGrade)
                                        profitabilityEffRatio = raw_datas[i]['Profitability - Eff. Ratio'] != undefined ? raw_datas[i]['Profitability - Eff. Ratio'] : null
                                        //console.log(profitabilityEffRatio)

                                        addressFull = raw_datas[i]['Address - Full'] != undefined ? raw_datas[i]['Address - Full'] : null
                                        //console.log(addressFull)
                                        addressJibun = raw_datas[i]['Address - Jibun'] != undefined ? raw_datas[i]['Address - Jibun'] : null
                                        //console.log(addressJibun)
                                        addressProvince = raw_datas[i]['Address - Province'] != undefined ? raw_datas[i]['Address - Province'] : null
                                        //console.log(addressProvince)
                                        addressCity = raw_datas[i]['Address - City'] != undefined ? raw_datas[i]['Address - City'] : null
                                        //console.log(addressCity)
                                        addressLatitude = raw_datas[i]['Address - Latitude'] != undefined ? raw_datas[i]['Address - Latitude'] : null
                                        //console.log(raw_datas[i]['addressLatitude'] )
                                        addressLongitude = raw_datas[i]['Address - Longitude'] != undefined ? raw_datas[i]['Address - Longitude'] : null
                                        //console.log(addressLongitude)
                                        accessibilityDistanceToIc = raw_datas[i]['Accessibility - Distance To Ic'] != undefined ? raw_datas[i]['Accessibility - Distance To Ic'] : null
                                        //console.log(accessibilityDistanceToIc)
                                        accessibilityTimeTakenToCityHall = raw_datas[i]['Accessibility - Time Taken To CityHall'] != undefined ? raw_datas[i]['Accessibility - Time Taken To CityHall'] : null
                                        //console.log(accessibilityTimeTakenToCityHall)
                                        accessibilityTimeTakenToSubway = raw_datas[i]['Accessibility - Time Taken To Subway'] != undefined ? raw_datas[i]['Accessibility - Time Taken To Subway'] : null
                                        //console.log(accessibilityTimeTakenToSubway)
                                        accessibilityNearbyFacilities = raw_datas[i]['Accessibility - Nearby Facilities'] != undefined ? raw_datas[i]['Accessibility - Nearby Facilities'] : null
                                        //console.log(accessibilityNearbyFacilities)
                                        accessibilityNearbyAttractions = raw_datas[i]['Accessibility - Nearby Attractions'] != undefined ? raw_datas[i]['Accessibility - Nearby Attractions'] : null
                                        //console.log(accessibilityNearbyAttractions)
                                        accessibilityNearbyPlaces = raw_datas[i]['Accessibility - Nearby Places'] != undefined ? raw_datas[i]['Accessibility - Nearby Places'] : null
                                        //console.log(accessibilityNearbyPlaces)

                                        sizesNoOfBuildings = raw_datas[i]['Sizes - No. of Buildings'] != undefined ? raw_datas[i]['Sizes - No. of Buildings'] : null
                                        //console.log(sizesNoOfBuildings)
                                        sizesNoOfUpperLevels = raw_datas[i]['Sizes - No. of Upper Levels'] != undefined ? raw_datas[i]['Sizes - No. of Upper Levels'] : null
                                        //console.log(sizesNoOfUpperLevels)
                                        sizesNoOfBasementLevels = raw_datas[i]['Sizes - No. of Basement Levels'] != undefined ? raw_datas[i]['Sizes - No. of Basement Levels'] : null
                                        //console.log(sizesNoOfBasementLevels)
                                        sizesGFAsqm = raw_datas[i]['Sizes - GFA (sqm)'] != undefined ? raw_datas[i]['Sizes - GFA (sqm)'] : null
                                        //console.log(sizesGFAsqm)
                                        sizesGFApy = raw_datas[i]['Sizes - GFA (py)'] != undefined ? raw_datas[i]['Sizes - GFA (py)'] : null
                                        //console.log(sizesGFApy)
                                        sizesNFAsqm = raw_datas[i]['Sizes - NFA (sqm)'] != undefined ? raw_datas[i]['Sizes - NFA (sqm)'] : null
                                        //console.log(sizesNFAsqm)
                                        sizesNFApy = raw_datas[i]['Sizes - NFA (py)'] != undefined ? raw_datas[i]['Sizes - NFA (py)'] : null
                                        //console.log(sizesNFApy)
                                        sizesSiteAreasqm = raw_datas[i]['Sizes - Site Area (sqm)'] != undefined ? raw_datas[i]['Sizes - Site Area (sqm)'] : null
                                        //console.log(sizesSiteAreasqm)
                                        sizesSiteAreapy = raw_datas[i]['Sizes - Site Area (py)'] != undefined ? raw_datas[i]['Sizes - Site Area (py)'] : null
                                        //console.log(sizesSiteAreapy)
                                        sizesGrossLeasableAreasqm = raw_datas[i]['Sizes - Gross Leasable Area (sqm)'] != undefined ? raw_datas[i]['Sizes - Gross Leasable Area (sqm)'] : null
                                        //console.log(sizesGrossLeasableAreasqm)
                                        sizesGrossLeasableAreapy = raw_datas[i]['Sizes - Gross Leasable Area (py)'] != undefined ? raw_datas[i]['Sizes - Gross Leasable Area (py)'] : null
                                        //console.log(sizesGrossLeasableAreapy)
                                        sizesNetLeasableAreasqm = raw_datas[i]['Sizes - Gross Leasable Area (py)'] != undefined ? raw_datas[i]['Sizes - Gross Leasable Area (py)'] : null
                                        //console.log(sizesNetLeasableAreasqm)
                                        sizesNetLeasableAreapy = raw_datas[i]['Sizes - Net Leasable Area (sqm)'] != undefined ? raw_datas[i]['Sizes - Net Leasable Area (sqm)'] : null
                                        //console.log(sizesNetLeasableAreapy)
                                        sizesFloorAreaRatioExisting = raw_datas[i]['Sizes - Net Leasable Area (py)'] != undefined ? raw_datas[i]['Sizes - Net Leasable Area (py)'] : null
                                        //console.log(sizesFloorAreaRatioExisting)
                                        sizesFloorAreaRatioPermitted = raw_datas[i]['Sizes - Floor Area Ratio Existing'] != undefined ? raw_datas[i]['Sizes - Floor Area Ratio Existing'] : null
                                        //console.log(sizesFloorAreaRatioPermitted)
                                        sizesBuildingCoverageRatioExisting = raw_datas[i]['Sizes - Floor Area Ratio Permitted'] != undefined ? raw_datas[i]['Sizes - Floor Area Ratio Permitted'] : null
                                        //console.log(sizesBuildingCoverageRatioExisting)
                                        sizesBuildingCoverageRatioPermitted = raw_datas[i]['Sizes - Building Coverage Ratio Existing'] != undefined ? raw_datas[i]['Sizes - Building Coverage Ratio Existing'] : null
                                        //console.log(sizesBuildingCoverageRatioPermitted)
                                        sizesBuildingCoverageRatioPermitted = raw_datas[i]['Sizes - building Coverage Ratio Permitted'] != undefined ? raw_datas[i]['Sizes - building Coverage Ratio Permitted'] : null
                                        //console.log(sizesBuildingCoverageRatioPermitted)
                                        sizesFloorPlatesqm = raw_datas[i]['Sizes - Floor Plate(sqm)'] != undefined ? raw_datas[i]['Sizes - Floor Plate(sqm)'] : null
                                        //console.log(sizesFloorPlatesqm)
                                        sizesFloorPlatepy = raw_datas[i]['Sizes - Floor Plate(py)'] != undefined ? raw_datas[i]['Sizes - Floor Plate(py)'] : null
                                        //console.log(sizesFloorPlatepy)

                                        facilityElevatorsPassenger = raw_datas[i]['Facility - Elevators # (passenger)'] != undefined ? raw_datas[i]['Facility - Elevators # (passenger)'] : null
                                        //console.log(facilityElevatorsPassenger )
                                        facilityElevatorsService = raw_datas[i]['Facility - Elevators # (service)'] != undefined ? raw_datas[i]['Facility - Elevators # (service)'] : null
                                        //console.log(facilityElevatorsService )
                                        facilityElevatorsShuttle = raw_datas[i]['Facility - Elevators # (shuttle)'] != undefined ? raw_datas[i]['Facility - Elevators # (shuttle)'] : null
                                        //console.log(facilityElevatorsShuttle )
                                        facilityParkingCPSExisting = raw_datas[i]['Facility - Parking # (CPS Existing)'] != undefined ? raw_datas[i]['Facility - Parking # (CPS Existing)'] : null
                                        //console.log(facilityParkingCPSExisting)
                                        facilityParkingCPSRequired = raw_datas[i]['Facility - Parking # (CPS Required)'] != undefined ? raw_datas[i]['Facility - Parking # (CPS Required)'] : null
                                        //console.log(facilityParkingCPSRequired)
                                        facilityParkingFreeCPSsqm = raw_datas[i]['Facility - Parking # (Free CPS - sqm)'] != undefined ? raw_datas[i]['Facility - Parking # (Free CPS - sqm)'] : null
                                        //console.log(facilityParkingFreeCPSsqm)
                                        facilityParkingFreeCPSpy = raw_datas[i]['Facility - Parking # (Free CPS - py)'] != undefined ? raw_datas[i]['Facility - Parking # (Free CPS - py)'] : null
                                        //console.log(facilityParkingFreeCPSpy)
                                        facilityPaidParkingFee = raw_datas[i]['Facility - Paid Parking Fee'] != undefined ? raw_datas[i]['Facility - Paid Parking Fee'] : null
                                        //console.log(facilityPaidParkingFee)

                                        materialsRoofMaterial = raw_datas[i]['Materials - Roof Material'] != undefined ? raw_datas[i]['Materials - Roof Material'] : null
                                        //console.log(materialsRoofMaterial)
                                        materialsFaçade = raw_datas[i]['Materials - Façade'] != undefined ? raw_datas[i]['Materials - Façade'] : null
                                        //console.log(materialsFaçade)
                                        materialsMechanicalElectrical = raw_datas[i]['Materials - Mechanical Electrical'] != undefined ? raw_datas[i]['Materials - Mechanical Electrical'] : null
                                        //console.log(materialsMechanicalElectrical)
                                        materialsLighting = raw_datas[i]['Materials - Lighting'] != undefined ? raw_datas[i]['Materials - Lighting'] : null
                                        //console.log(materialsLighting )
                                        materialsFireFighting = raw_datas[i]['Materials - Fire Fighting'] != undefined ? raw_datas[i]['Materials - Fire Fighting'] : null
                                        //console.log(materialsFireFighting)


                                        // db upload
                                        console.log('upload to database ')
                                        let sectorId
                                        let subSectorId

                                        if (sectorName != null) {
                                        sectorList.filter(function (sector) {

                                                if (sector['name'].toString().toLowerCase().trim() === sectorName.toString().toLowerCase().trim() ) {
                                                        sectorId = sector['id']
                                                }

                                        });
                        
                                        }

                                        if (subSectorName != null) {
                                                subSectorList.filter(function (subSector) {

                                                        if (subSector['name'].split(" ")[0].toString().toLowerCase().trim() === subSectorName.split(" ")[0].toString().toLowerCase().trim() && subSector['sector_id'] === sectorId ) {
                                                                subSectorId = subSector['id']
                                                        }
                                                });
                                
                                                }

                                

                                        // 1) create propertyId 
                                        let propertyResult = await prisma.property.create(
                                                {
                                                data: {
                                                        name          : propertyName,
                                                        sector_id      : sectorId != undefined ? sectorId : null,
                                                        subsector_id   : subSectorId != undefined ? subSectorId : null,
                                                        //image         :,
                                                        //historyId     :,
                                                        //transactionId :
                                                },
                                                }
                                        )
                                        //console.log(propertyResult)   
                                        
                                        let propertyId = propertyResult.id


                                        tempNoPropertyId.tempNo = tempNo;
                                        tempNoPropertyId.propertyId = propertyId;
                                        tempNoList.push(tempNoPropertyId)
                                        

                                        // 2)  Warehouse (optional)
                                        if(warehouseRoom) {
                                                let warehouseRoomResult = await prisma.warehouse.create(
                                                        {
                                                        data: {
                                                                property_id              : propertyId,
                                                                temperature_type        : 'ROOM',
                                                                ratio                   : Number(warehouseRoom),
                                                        },
                                                        }
                                                )
                                                //console.log(warehouseRoomResult) 
                                        }

                                        if(warehouseLow) {
                                                let warehouseLowResult = await prisma.warehouse.create(
                                                        {
                                                        data: {
                                                                property_id              : propertyId,
                                                                temperature_type        : 'LOW',
                                                                ratio                   : Number(warehouseLow),
                                                        },
                                                        }
                                                )
                                                //console.log(warehouseLowResult) 
                                        }

                                        if(warehouseConstant) {
                                                let warehouseConstantResult = await prisma.warehouse.create(
                                                        {
                                                        data: {
                                                                property_id              : propertyId,
                                                                temperature_type        : 'CONSTANT',
                                                                ratio                   : Number(warehouseConstant),
                                                        },
                                                        }
                                                )
                                                //console.log(warehouseConstantResult) 
                                        }


                                        // 3)  historyList
                                        // COMPLETION RENOVATION

                                        let historyList = []
                                        
                                        if(histotyCompletion) {
                                                let history = new Object();
                                                history.propertyId = propertyId
                                                history.year = histotyCompletion.toString()
                                                history.type = 'COMPLETION'
                                                historyList.push(history)
                                        }

                                        if(histotyRenovation1) {
                                                let history = new Object();
                                                history.propertyId = propertyId
                                                history.year = histotyRenovation1.toString()
                                                history.type = 'RENOVATION'
                                                historyList.push(history)
                                        }

                                        if(histotyRenovation2) {
                                                let history = new Object();
                                                history.propertyId = propertyId
                                                history.year = histotyRenovation2.toString()
                                                history.type = 'RENOVATION'
                                                historyList.push(history)
                                        }


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
                                                //console.log(historyResult) 
                                        }  

                                        // 4)  Profitability
                                        let profitabilityResult = await prisma.profitability.create(
                                                {
                                                        data: {
                                                        property_id              : propertyId,
                                                        grade                   : profitabilityGrade,
                                                        effective_ratio         : Number(profitabilityEffRatio),
                                                        },
                                                }
                                        )
                                        //console.log(profitabilityResult) 

                                        // 5)  location
                                        let locationResult = await prisma.location.create(
                                                {
                                                data: {
                                                        property_id        : propertyId,
                                                        address_full       : addressFull,
                                                        address_full_jibun : addressJibun,
                                                        address_province   : addressProvince,
                                                        address_city       : addressCity,
                                                        latitude           : Number(addressLatitude),
                                                        longitude          : Number(addressLongitude),
                                                },
                                                }
                                        )
                                        //console.log(locationResult)

                                        // 6)  accessibility
                                        let accessibilityResult = await prisma.accessibility.create(
                                                {
                                                data: {
                                                        property_id             : propertyId,
                                                        distance_to_ic          : accessibilityDistanceToIc,
                                                        time_taken_to_city_hall : accessibilityTimeTakenToCityHall,
                                                        time_taken_to_subway    : accessibilityTimeTakenToSubway,
                                                        nearby_facilities       : accessibilityNearbyFacilities,
                                                        nearby_attractions      : accessibilityNearbyAttractions,
                                                        nearby_places           : accessibilityNearbyPlaces,
                                                },
                                                }
                                        )
                                        //console.log(accessibilityResult)


                                        // 7)  sizes
                                        let sizesResult = await prisma.scale.create(
                                                {
                                                        data: {
                                                        property_id                       : propertyId,
                                                        no_of_buildings                   : Number(sizesNoOfBuildings),
                                                        upper_levels                      : Number(sizesNoOfUpperLevels),
                                                        basement_levels                   : Number(sizesNoOfBasementLevels),
                                                        gfa_sqm                           : Number(sizesGFAsqm),
                                                        gfa_py                            : Number(sizesGFApy),
                                                        nfa_sqm                           : Number(sizesNFAsqm),
                                                        nfa_py                            : Number(sizesNFApy),
                                                        site_area_sqm                     : Number(sizesSiteAreasqm),
                                                        site_area_py                      : Number(sizesSiteAreapy),
                                                        gross_leasable_area_sqm           : Number(sizesGrossLeasableAreasqm),
                                                        gross_leasable_area_py            : Number(sizesGrossLeasableAreapy),
                                                        net_leasable_area_sqm             : Number(sizesNetLeasableAreasqm),
                                                        net_leasable_area_py              : Number(sizesNetLeasableAreapy),
                                                        floor_area_ratio_existing         : Number(sizesFloorAreaRatioExisting),
                                                        floor_area_ratio_permitted        : Number(sizesFloorAreaRatioPermitted),
                                                        building_coverage_ratio_existing  : Number(sizesBuildingCoverageRatioExisting),
                                                        building_coverage_ratio_permitted : Number(sizesBuildingCoverageRatioPermitted),
                                                        floor_plate_sqm                   : Number(sizesFloorPlatesqm),
                                                        floor_plate_py                    : Number(sizesFloorPlatepy),
                                                        },
                                                }
                                        )
                                        //console.log(sizesResult)


                                        // 8)  facility
                                        let facilityResult = await prisma.facility.create(
                                                {
                                                        data: {
                                                        property_id             : propertyId,
                                                        elevators_total         : Number(facilityElevatorsPassenger)+Number(facilityElevatorsService)+Number(facilityElevatorsShuttle),
                                                        elevators_passenger     : Number(facilityElevatorsPassenger),
                                                        elevators_service       : Number(facilityElevatorsService),
                                                        elevators_freight       : Number(facilityElevatorsShuttle),
                                                        cps_existing            : Number(facilityParkingCPSExisting),
                                                        cps_required            : Number(facilityParkingCPSRequired),
                                                        free_cps_sqm            : Number(facilityParkingFreeCPSsqm),
                                                        free_cps_py             : Number(facilityParkingFreeCPSpy),
                                                        paid_parking_fee        : Number(facilityPaidParkingFee),
                                                        roof_material           : materialsRoofMaterial,
                                                        facade                  : materialsFaçade,
                                                        mechanical_electrical   : Number(materialsMechanicalElectrical),
                                                        lighting                : materialsLighting,
                                                        fire_fighting           : materialsFireFighting,
                                                        },
                                                }
                                        )
                                        //console.log(facilityResult)
                                
                                
                                }
                        }
                             
                        console.log('==================  end of uploading primary excel sheet ==================')      ;
                
                      

                        //===============================================================================================================================================
                        //===============================================================================================================================================
                        console.log('sheets parsing second sheet ')
                        //===============================================================================================================================================
                        //===============================================================================================================================================
                        const secondSheetName = workbook.SheetNames[1];
                        const secondSheet = XLSX.utils.sheet_to_json(workbook.Sheets[secondSheetName]);

                        /* create an array of arrays */
                        const secondSheetRows = XLSX.utils.sheet_to_json(workbook.Sheets[secondSheetName], { header: 1 });

                        const secondSheetRaw_datas = XLSX.utils.sheet_to_json(workbook.Sheets[secondSheetName]) //, { header: "A" }) 

                        /* create column array */
                        const secondSheetRange = XLSX.utils.decode_range(workbook.Sheets[secondSheetName]["!ref"]||"A1");
                        const secondSheetColumns = Array.from({ length: secondSheetRange.e.c + 1 }, (_, i) => ({
                                field: String(i+1), // vtl will access row["0"], row["1"], etc
                                label: XLSX.utils.encode_col(i), // the column labels will be A, B, etc
                              })); 
                        console.log(secondSheetRaw_datas)   

                        for(let l = 0; l<secondSheetRaw_datas.length; l++){

                                let tempNo = null  
                                tempNo = secondSheetRaw_datas[l]['Temp No.'] != undefined ? secondSheetRaw_datas[l]['Temp No.'] : null
                                console.log("second sheet " + tempNo )   
                                
                                let propertyIdBytempNo = null
                                // search propertyId by tempNo
                                for(let m=0; m<tempNoList.length; m++) {
                                        if(tempNoList[m].tempNo === tempNo) {
                                                propertyIdBytempNo = tempNoList[m].propertyId
                                        }
                                }

                                // db upload
                                
                                if(tempNo !=null && propertyIdBytempNo != null) {

                                        // console.log('upload second sheet to database')
                                        // console.log('tempNo ' + tempNo)
                                        // console.log('propertyIdBytempNo ' + propertyIdBytempNo)

                                         // headers 

                                         let floorType
                                         let floorNo
                                        //  let usage
                                         let totalArea_sqm
                                         let totalArea_py
                                         let grossLeasableArea_sqm
                                         let grossLeasableArea_py
                                         let netLeasableArea_sqm
                                         let netLeasableArea_py
                                         let ceilingHeight
                                         let floorLoad
                                         let truckBerths

                                         floorType = secondSheetRaw_datas[l]['Floor Type'] != undefined ? secondSheetRaw_datas[l]['Floor Type'].trim().toUpperCase() : null
                                         floorNo = secondSheetRaw_datas[l]['Floor No.'] != undefined ? secondSheetRaw_datas[l]['Floor No.'] : null
                                        //  usage = secondSheetRaw_datas[l]['Usage'] != undefined ? secondSheetRaw_datas[l]['Usage'] : null
 
                                         totalArea_sqm = secondSheetRaw_datas[l]['Total Area(sqm)'] != undefined ? secondSheetRaw_datas[l]['Total Area(sqm)'] : null
                                         totalArea_py = secondSheetRaw_datas[l]['Total Area(py)'] != undefined ? secondSheetRaw_datas[l]['Total Area(py)'] : null
                                         grossLeasableArea_sqm = secondSheetRaw_datas[l]['Gross Leasable Area(sqm)'] != undefined ? secondSheetRaw_datas[l]['Gross Leasable Area(sqm)'] : null
                                         grossLeasableArea_py = secondSheetRaw_datas[l]['Gross Leasable Area(py)'] != undefined ? secondSheetRaw_datas[l]['Gross Leasable Area(py)'] : null
                                         netLeasableArea_sqm = secondSheetRaw_datas[l]['Net Leasable Area(sqm)'] != undefined ? secondSheetRaw_datas[l]['Net Leasable Area(sqm)'] : null
                                         netLeasableArea_py = secondSheetRaw_datas[l]['Net Leasable Area(py)'] != undefined ? secondSheetRaw_datas[l]['Net Leasable Area(py)'] : null

                                         ceilingHeight = secondSheetRaw_datas[l]['Ceiling Height(m)'] != undefined ? secondSheetRaw_datas[l]['Ceiling Height(m)'] : null
                                         floorLoad = secondSheetRaw_datas[l]['Floor Load(ton/㎡)'] != undefined ? secondSheetRaw_datas[l]['Floor Load(ton/㎡)'] : null
                                         truckBerths = secondSheetRaw_datas[l]['Truck Berths(units)'] != undefined ? secondSheetRaw_datas[l]['Truck Berths(units)'] : null

                                         // db upload
                                        //  console.log('floorType ' + floorType)
                                        //  console.log('floorNo ' + floorNo)
                                         if(floorType && floorNo) {
                                                let floorInfoResult = await prisma.floor.create(
                                                        {
                                                        data: {
                                                                property_id             : propertyIdBytempNo,
                                                                type                    : floorType,
                                                                floor                   : Number(floorNo),
                                                                
                                                                // use                     : usage,
                                                                total_area_sqm          : Number(totalArea_sqm),
                                                                total_area_py           : Number(totalArea_py),
                                                                gross_leasable_area_sqm : Number(grossLeasableArea_sqm),
                                                                gross_leasable_area_py  : Number(grossLeasableArea_py),
                                                                net_leasable_area_sqm   : Number(netLeasableArea_sqm),
                                                                net_leasable_area_py    : Number(netLeasableArea_py),

                                                                ceiling_height          : Number(ceilingHeight),
                                                                floor_load              : Number(floorLoad),
                                                                truck_berths            : Number(truckBerths),
                                                                },
                                                        }
                                                )
                                                // console.log('floorInfoResult' + floorInfoResult) 


                                                let floorIdObj = new Object()

                                                floorIdObj.tempNo = tempNo;
                                                floorIdObj.propertyId = propertyIdBytempNo;
                                                floorIdObj.floorType = floorType;
                                                floorIdObj.floorNo = floorNo;
                                                floorIdObj.floorId = floorInfoResult.id;
                                                floorList.push(floorIdObj)
                                        }
 

                                }

                        }    
                        console.log('==================  end of uploading secondary excel sheet ==================')      ;    


                         //===============================================================================================================================================
                        //===============================================================================================================================================
                        console.log('sheets parsing third sheet ')
                        //===============================================================================================================================================
                        //===============================================================================================================================================
                        const thirdSheetName = workbook.SheetNames[2];
                        const thirdSheet = XLSX.utils.sheet_to_json(workbook.Sheets[thirdSheetName]);

                        /* create an array of arrays */
                        const thirdSheetRows = XLSX.utils.sheet_to_json(workbook.Sheets[thirdSheetName], { header: 1 });

                        const thirdSheetRaw_datas = XLSX.utils.sheet_to_json(workbook.Sheets[thirdSheetName]) //, { header: "A" }) 

                        /* create column array */
                        const thirdSheetRange = XLSX.utils.decode_range(workbook.Sheets[thirdSheetName]["!ref"]||"A1");
                        const thirdSheetColumns = Array.from({ length: thirdSheetRange.e.c + 1 }, (_, i) => ({
                                field: String(i+1), // vtl will access row["0"], row["1"], etc
                                label: XLSX.utils.encode_col(i), // the column labels will be A, B, etc
                              })); 
                        //console.log(thirdSheetRaw_datas)   
                        console.log('thirdSheetRaw_datas.length ' + thirdSheetRaw_datas.length)
                        for(let o = 0; o<thirdSheetRaw_datas.length; o++){


                                let tempNo = null 
                                let floorType_temp = null
                                let floorType = null
                                let floorNo = null 
                                tempNo          = thirdSheetRaw_datas[o]['Temp No.'] != undefined ? thirdSheetRaw_datas[o]['Temp No.'] : null
                                floorType_temp       = thirdSheetRaw_datas[o]['Floor Type'] != undefined ? thirdSheetRaw_datas[o]['Floor Type'] : null
                                
                                if (floorType_temp != null) {
                                        floorType = floorType_temp.toString().trim().toUpperCase()
                                }

                                floorNo         = thirdSheetRaw_datas[o]['Floor No.'] != undefined ? thirdSheetRaw_datas[o]['Floor No.'] : null
                                console.log("third sheet " + tempNo + ', '+ (Number(o)+1) + ' row' )   
                                console.log('tempNo : ' + tempNo + ', floorType : ' + floorType + ', floorNo : ' + floorNo)
                                let floorIdForRoom = null
                                // search propertyId by tempNo
                                for(let k=0; k<floorList.length; k++) {
                                        if(floorList[k].tempNo === tempNo && floorList[k].floorType === floorType && floorList[k].floorNo === floorNo) {
                                                floorIdForRoom = floorList[k].floorId
                                                console.log('found ' + floorIdForRoom)
                                        } else {
                                                console.log('not found ' + floorIdForRoom)
                                        }
                                }
                                console.log('floor Id : ' + floorIdForRoom)
                                

                                // console.log('property Id : ' + propertyIdForRoom)
                                // console.log('floor Id : ' + floorIdForRoom)
                                // console.log('floor type: ' + floorType)
                                // console.log('floor no. : ' + floorNo)
                               
                                // db upload
                                if( floorIdForRoom != null  ) {

                                        
                                        // headers 
                                        // let floorType
                                        // let floorNo
                                        let unitNumber_temp
                                        let unitNumber = null
                                        let tenant
                                        let unitUsage_temp
                                        let unitUsage
                                        let tenantEquipment_temp
                                        let tenantEquipment
                                        let leaseArea_sqm
                                        let leaseArea_py
                                        let leaseStartDate_temp
                                        let leaseStartDate
                                        let leaseEndDate_temp
                                        let leaseEndDate
                                        let deposit_krw
                                        let rent_krw_mth_py
                                        let rent_krw_mth
                                        let managementFee_krw_mth_py
                                        let managementFee_krw_mth
                                        let escalationConditions_deposit
                                        let escalationConditions_rent
                                        let escalationConditions_mgmtFee
                                        let rentFree
                                        let fitOut

                                        unitNumber_temp = thirdSheetRaw_datas[o]['Unit Number'] != undefined ? thirdSheetRaw_datas[o]['Unit Number'] : null
                                        unitNumber = unitNumber_temp !=null ? unitNumber_temp.toString().trim(): unitNumber_temp;
                                        tenant = thirdSheetRaw_datas[o]['Tenant'] != undefined ? thirdSheetRaw_datas[o]['Tenant'] : null
                                        unitUsage_temp = thirdSheetRaw_datas[o]['Unit Usage'] != undefined ? thirdSheetRaw_datas[o]['Unit Usage'] : null
                                        unitUsage = unitUsage_temp != null ? unitUsage_temp.toString().trim().toUpperCase() : unitUsage_temp;
                                        tenantEquipment_temp = thirdSheetRaw_datas[o]['Tenant Equipment'] != undefined ? thirdSheetRaw_datas[o]['Tenant Equipment'] : null
                                        tenantEquipment = tenantEquipment_temp != null ? (tenantEquipment_temp.toString().trim().toUpperCase() === 'Y' ? Boolean(true) : Boolean(false)) :  Boolean(false);

                                        leaseArea_sqm = thirdSheetRaw_datas[o]['Lease Area(sqm)'] != undefined ? thirdSheetRaw_datas[o]['Lease Area(sqm)'] : null
                                        leaseArea_py = thirdSheetRaw_datas[o]['Lease Area(py)'] != undefined ? thirdSheetRaw_datas[o]['Lease Area(py)'] : null

                                        leaseStartDate = thirdSheetRaw_datas[o]['Lease Start Date'] != undefined ? thirdSheetRaw_datas[o]['Lease Start Date'] : null
                                        leaseEndDate = thirdSheetRaw_datas[o]['Lease End Date'] != undefined ? thirdSheetRaw_datas[o]['Lease End Date'] : null

                                        deposit_krw = thirdSheetRaw_datas[o]['Deposit(krw)'] != undefined ? thirdSheetRaw_datas[o]['Deposit(krw)'] : null
                                        rent_krw_mth_py = thirdSheetRaw_datas[o]['Rent(krw/mth/py)'] != undefined ? thirdSheetRaw_datas[o]['Rent(krw/mth/py)'] : null
                                        rent_krw_mth = thirdSheetRaw_datas[o]['Rent(krw/mth)'] != undefined ? thirdSheetRaw_datas[o]['Rent(krw/mth)'] : null
                                        managementFee_krw_mth_py = thirdSheetRaw_datas[o]['Management Fee(krw/mth/py)'] != undefined ? thirdSheetRaw_datas[o]['Management Fee(krw/mth/py)'] : null
                                        managementFee_krw_mth = thirdSheetRaw_datas[o]['Management Fee(krw/mth)'] != undefined ? thirdSheetRaw_datas[o]['Management Fee(krw/mth)'] : null

                                        escalationConditions_deposit = thirdSheetRaw_datas[o]['Escalation Conditions - Deposit'] != undefined ? thirdSheetRaw_datas[o]['Escalation Conditions - Deposit'] : null
                                        escalationConditions_rent = thirdSheetRaw_datas[o]['Escalation Conditions - Rent'] != undefined ? thirdSheetRaw_datas[o]['Escalation Conditions - Rent'] : null
                                        escalationConditions_mgmtFee = thirdSheetRaw_datas[o]['Escalation Conditions - Mgmt Fee'] != undefined ? thirdSheetRaw_datas[o]['Escalation Conditions - Mgmt Fee'] : null

                                        rentFree = thirdSheetRaw_datas[o]['Rent Free'] != undefined ? thirdSheetRaw_datas[o]['Rent Free'] : null
                                        fitOut = thirdSheetRaw_datas[o]['Fit Out'] != undefined ? thirdSheetRaw_datas[o]['Fit Out'] : null

                                         // db upload
                                         if(floorIdForRoom !=null  && unitNumber != null) {
                                                console.log('upload third sheet to database')

                                                let roomDetailsResult = await prisma.floorPartial.create(
                                                        {
                                                        data: {
                                                                floor_id                                : floorIdForRoom,
                                                                unit_number                             : unitNumber,
                                                                tenant                                  : tenant,
                                                                tenant_use                              : unitUsage,
                                                                tenant_equipment                        : tenantEquipment,

                                                                lease_area_sqm                          : Number(leaseArea_sqm),
                                                                lease_area_py                           : Number(leaseArea_py),
                                                               
                                                                lease_start_date                        : leaseStartDate,
                                                                lease_end_date                          : leaseEndDate,

                                                                deposit_krw                             : Number(deposit_krw),
                                                                monthly_rent_per_py                     : Number(rent_krw_mth_py),
                                                                monthly_rent                            : Number(rent_krw_mth),
                                                                monthly_management_per_py               : Number(managementFee_krw_mth_py),
                                                                monthly_management_fee                  : Number(managementFee_krw_mth),

                                                                increase_conditions_for_deposit         : escalationConditions_deposit,
                                                                increase_conditions_for_rent            : escalationConditions_rent,
                                                                increase_conditions_for_management_fee  : escalationConditions_mgmtFee,

                                                                rent_free                               : rentFree,
                                                                fit_out                                 : fitOut,
                                                                },
                                                        }
                                                )
                                                console.log(roomDetailsResult) 
                                        }
 

                                }

                        }     
                        console.log('==================  end of uploading third excel sheet ==================')      ;

                        return { rows : rows, columns : columns };;

                } else { 
                        console.log('error');
                        return createError({
                                statusCode: 500,
                                statusMessage: 'Something went wrong.',
                        }); 
                } // if(files)

               
                
        } catch (error) {
                console.log(error);
                return createError({
                        statusCode: 500,
                        statusMessage: 'Something went wrong.',
                });
        }
});
