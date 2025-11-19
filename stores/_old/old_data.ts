//import { LeaseActualObj } from './../context/asset'

import { defineStore } from 'pinia'

import { CbreAsset, MapDataType, MapDataFeaturesType, MapDataGeometryType, MapDataPropertyType, AdminListType } from '~/types/asset.type'
import { useFilterStore } from './filter'
import { useMapStore } from './map'
export const useDataStore = defineStore('data', {
        state: () => ({
                //data
                initialDataLoaded: false,
                initialAllAssets: [] as CbreAsset[],
                initialAssetIds: [] as string[],

                currentAssetId: '' as string,
                previousAssetId: '' as string,
                nextAssetId: '' as string,

                filteredAssets: [] as CbreAsset[],
                filteredAssetsIds: [] as string[],
                keptAssetIds: [] as string[], //list card 에서 체크한 자산들의 id
                allMapInfos: {},
                filteredMapInfos: {},

                // 💡 Admin List 전용 상태 추가
                adminList: [] as AdminListType[], 
                adminListLoaded: false, // 로딩 상태 플래그
                filteredAdminList: [] as AdminListType[], 
                checkedAssetIds: [] as string[], //list card 에서 체크한 자산들의 id
        }),
  
        getters: {
                getAssetById: (state) => {
                        return (id: any) =>
                                state.initialAllAssets.find(
                                        (el) =>
                                                el.propertyId.toString() ===
                                                id.toString()
                                )
                },
        },

        actions: {

                /**
                 * Admin List 화면을 위한 최소 필드 데이터만 가져오는 액션 (성능 최적화)
                 * - API: /api/asset/all.get.ts 사용 (AdminListType 반환)
                 */
                async getAdminList() {

                        // 🎯 1. API 응답 타입을 함수 내부 또는 인접한 위치에 별도로 정의합니다.
                        type AdminListResponse = { 
                                status: string, 
                                data: AdminListType[] 
                        }

                        if (this.adminListLoaded && this.adminList.length > 0) {
                                // 이미 로드된 경우 재요청 방지
                                return true; 
                        }
                        try {
                                // AdminListType[] 배열을 반환하는 새로운 API 엔드포인트 호출
                                // $fetch 제네릭에 정의된 타입을 명확하게 사용합니다. (AS 키워드 대신 제네릭 `<T>` 사용)
                                const response = await $fetch<AdminListResponse>('/api/data/adminList', {
                                method: 'GET',
                                }); 

                                //sconsole.log(response.data)

                                this.adminList = response.data // Admin List 전용 데이터 저장
                               
                                this.filteredAdminList = this.adminList;
                                this.adminListLoaded = true;

                                return true

                        } catch (error) {
                                console.error('Error in getAdminList action:', error)
                                return false
                        }
                },


                async getAllAssets() {
                        try {
                                let res = await useFetch(
                                        '/api/data/items'
                                )

                                //console.log(res.data.value)
                                this.setAllMapInfos(res.data.value as CbreAsset[])
                                this.setInitialAllAssets(res.data.value)
                                this.setSubSectors(res.data.value)

                                //console.log(this.initialAllAssets)
                                //console.log(this.filteredAssets)

                                this.initialDataLoaded = true

                                return res.data.value
                        } catch (error) {
                                this.initialDataLoaded = false
                                console.log(error)

                                return error
                        }
                },

                setAllMapInfos(data: CbreAsset[]) {
                        // console.log(data)
                        if(data) {
                        try {

                                // MapDataType, MapDataFeaturesType, MapDataGeometryType, MapDataPropertyType
                                let mapData = new Object() as MapDataType
                                
                                //mapData.crs = data.crs
                                
                                mapData.type = "FeatureCollection"

                                let mapFeatures: MapDataFeaturesType[] = []
                                // console.log(resp.features[0])
                                for (let i = 0; i < data.length; i++) {
                                        let mapDataFeatures = new Object() as MapDataFeaturesType
                                        mapDataFeatures.type = "Feature"

                                        let geometry = new Object() as MapDataGeometryType
                                        geometry.type = "Point"

                                        let coordinates = [Number(data[i].location.longitude), Number(data[i].location.latitude)] 
                                        geometry.coordinates = coordinates
                                        mapDataFeatures.geometry = geometry

                                        let property = new Object() as MapDataPropertyType
                                        property.propertyId = data[i].propertyId
                                        property.sector = data[i].general.sector.name
                                        property.subSector = data[i].general.subSector?.name ?? null
                                        property.propertyName = data[i].propertyName
                                        property.mainImageUrl = data[i].mainImageUrl
                                        property.province = data[i].location?.addressProvince ? data[i].location?.addressProvince : null
                                        property.city = data[i].location?.addressCity ? data[i].location?.addressCity : null
                                        property.grade = data[i].profitability?.grade ?? null
                                        property.effRatio = data[i].profitability?.effRatio ?? null

                                        mapDataFeatures.properties = property

                                        mapFeatures.push(mapDataFeatures)
                                }
                                mapData.features = mapFeatures

                                this.allMapInfos = mapData
                                this.filteredMapInfos = mapData
                                return true
                        } catch (error) {
                                console.log(error)

                                return error
                        }

                        }
                },

                setInitialAllAssets(data: any) {

                        if(data){
                        try {
                                let propertyIds: string[] = []
                                let assets = [] as CbreAsset[]
                                let assetsSorted = [] as CbreAsset[]

                                this.initialAllAssets = data

                                this.filteredAssets = data
                                
                                for (let i = 0; i < data.length; i++) {
                                        propertyIds.push(data[i].general.propertyId)
                                } 
                                this.initialAssetIds = propertyIds               

                                /*
                                // for (let i = 0; i < data.length; i++) {


                                //         let properties = data[i]

                                //         let currentProperty = new Object() as any

                                //         //general 
                                //         currentProperty.propertyId=data[i].property_id
                                //         currentProperty.propertyName=data[i].property_name

                                //         currentProperty.sector=data[i].sector
                                //         currentProperty.sectorId=data[i].sector_id
                                //         currentProperty.subSector=data[i].subsector
                                //         currentProperty.subSectorId=data[i].subsector_id

                                //         let warehouseObj = new Object() as any;
                                //         warehouseObj.room = Number(data[i].warehouse_room)
                                //         warehouseObj.low = Number(data[i].warehouse_low)
                                //         warehouseObj.constant = Number(data[i].warehouse_contant)

                                //         currentProperty.warehouse = warehouseObj

                                //         currentProperty.mainImageUrl = data[i].image

                                //         //accessibility
                                //         let accessibilityObj = new Object() as any;
                                //         accessibilityObj.distanceToIc = data[i].accessibility_distance_to_ic
                                //         accessibilityObj.timeTakenToCityHall = data[i].accessibility_time_taken_to_city_hall
                                //         accessibilityObj.timeTakenToSubway = data[i].accessibility_time_taken_to_subway
                                //         accessibilityObj.nearbyFacilities = data[i].accessibility_nearby_facilities
                                //         accessibilityObj.nearbyAttractions = data[i].accessibility_nearby_attractions
                                //         accessibilityObj.nearbyPlaces = data[i].accessibility_nearby_places

                                //         currentProperty.accessibility = accessibilityObj

                                //         //facility
                                //         let facilityObj = new Object() as any;
                                //                 let elevatorsObj = new Object() as any;
                                //                 elevatorsObj.total =  Number(data[i].facility_elevators_total)
                                //                 elevatorsObj.passenger =  Number(data[i].facility_elevators_passenger)
                                //                 elevatorsObj.service =  Number(data[i].facility_elevators_service)
                                //                 elevatorsObj.shuttle =  Number(data[i].facility_elevators_freight)
                                //                 facilityObj.elevators = elevatorsObj

                                //                 let parkingObj = new Object() as any;
                                //                 parkingObj.cpsExisting =  Number(data[i].facility_elevators_freight)
                                //                 parkingObj.cpsRequired =  Number(data[i].facility_elevators_freight)
                                //                 parkingObj.freeCpsSqm =  Number(data[i].facility_elevators_freight)
                                //                 parkingObj.freeCpsPy = Number(data[i].facility_elevators_freight)
                                //                 parkingObj.paidParkingFee =  Number(data[i].facility_elevators_freight)
                                //                 facilityObj.parking = parkingObj
                                                
                                //                 let materialsObj = new Object() as any;
                                //                 materialsObj.roofMaterial =  data[i].facility_roof_material
                                //                 materialsObj.facade =  data[i].facility_facade
                                //                 materialsObj.mechanicalElectrical =  Number(data[i].facility_mechanical_electrical)
                                //                 materialsObj.lighting =  data[i].facility_lighting
                                //                 materialsObj.fireFighting =  data[i].facility_fire_fighting
                                //                 facilityObj.materials = materialsObj

                                //         currentProperty.facility = facilityObj


                                //         //location 
                                //         let locationObj = new Object() as any;
                                //         locationObj.addressFull  =  data[i].location_address_full
                                //         locationObj.addressFullJibun =  data[i].location_address_full_jibun
                                //         locationObj.addressProvince =  data[i].location_address_province
                                //         locationObj.addressCity =  data[i].location_address_city
                                //         locationObj.latitude =  Number(data[i].location_latitude)
                                //         locationObj.longitude =  Number(data[i].location_longitude)

                                //         currentProperty.location = locationObj

                                //         //profitability
                                //         let profitabilityObj = new Object() as any;
                                //         profitabilityObj.grade = data[i].profitability_grade
                                //         profitabilityObj.effectiveRatio = Number(data[i].profitability_effective_ratio)

                                //         currentProperty.profitability = profitabilityObj

                                //         //sizes
                                //         let sizesObj = new Object() as any
                                //         sizesObj.noOfBuildings = Number(data[i].scale_no_of_buildings)
                                //         sizesObj.upperLevels = Number(data[i].scale_upper_levels)
                                //         sizesObj.basementLevels = Number(data[i].scale_basement_levels)

                                //         sizesObj.gfaSqm = Number(data[i].scale_gfa_sqm)
                                //         sizesObj.gfaPy = Number(data[i].scale_gfa_py)
                                //         sizesObj.nfaSqm = Number(data[i].scale_nfa_sqm)
                                //         sizesObj.nfaPy = Number(data[i].scale_nfa_py)
                                //         sizesObj.siteAreaSqm = Number(data[i].scale_site_area_sqm)
                                //         sizesObj.siteAreaPy = Number(data[i].scale_site_area_py)
                                //         sizesObj.grossLeasableAreaSqm = Number(data[i].scale_gross_leasable_area_sqm)
                                //         sizesObj.grossLeasableAreaPy = Number(data[i].scale_gross_leasable_area_py)
                                //         sizesObj.netLeasableAreaSqm = Number(data[i].scale_net_leasable_area_sqm)
                                //         sizesObj.netLeasableAreaPy = Number(data[i].scale_net_leasable_area_py)
                                //         sizesObj.floorAreaRatioExisting = Number(data[i].scale_floor_area_ratio_existing)
                                //         sizesObj.floorAreaRatioPermitted = Number(data[i].scale_floor_area_ratio_permitted)
                                //         sizesObj.buildingCoverageRatioExisting = Number(data[i].scale_building_coverage_ratio_existing)
                                //         sizesObj.buildingCoverageRatioPermitted = Number(data[i].scale_building_coverage_ratio_permitted)
                                //         sizesObj.floorPlateSqm = Number(data[i].scale_floor_plate_sqm)
                                //         sizesObj.floorPlatePy = Number(data[i].scale_floor_plate_py)

                                //         currentProperty.sizes = sizesObj

                                //         //historyList
                                //         currentProperty.historyList = data[i].history

                                //         //floor
                                //         currentProperty.floorList = data[i].floor

                                //         //floorPlanImages
                                //         let floorPlanImagesObj = new Object() as any
                                //         let logitudinalObj = new Object() as any
                                //         let crossObj = new Object() as any
                                //         let eachFloorObj = new Object() as any
                                //         let uppersObj = new Object() as any
                                //         let basementsObj = new Object() as any

                                //         logitudinalObj = data[i].floorPlanImages.filter((el:any) => el.type ==="LOGITUDINALSECTION")
                                //         crossObj = data[i].floorPlanImages.filter((el:any) => el.type ==="CROSSSECTION")
                                //         uppersObj = data[i].floorPlanImages.filter((el:any) => el.type ==="UPPERSECTION")
                                //         basementsObj = data[i].floorPlanImages.filter((el:any) => el.type ==="BASEMENTSECTION")
                                //         eachFloorObj.uppers = uppersObj
                                //         eachFloorObj.basements = basementsObj

                                //         floorPlanImagesObj.logitudinal = logitudinalObj
                                //         floorPlanImagesObj.cross = crossObj
                                //         floorPlanImagesObj.eachFloor = eachFloorObj

                                        

                                //         currentProperty.floorPlanPhotoList = floorPlanImagesObj

                                //         //imagesList
                                //         currentProperty.imageList = data[i].images

                                //         //transaction_info
                                //         currentProperty.transactionInfo = data[i].transaction_info
                                        
                                //         //lease_info
                                //         currentProperty.leaseInfo = data[i].lease_info
                                        
                                //         let transactionItems = data[i].transaction_info.transactionsList.sort(
                                //                 function (a: any, b: any) {
                                //                         return (
                                //                                 b.transactionIdx -
                                //                                 a.transactionIdx
                                //                         )
                                //                 }
                                //         )

                                //         let leasesAskingItems = data[i].lease_info.leasesAskingList.sort(
                                //                 function (a: any, b: any) {
                                //                         return (
                                //                                 b.leaseIdx -
                                //                                 a.leaseIdx
                                //                         )
                                //                 }
                                //         )

                                //         let leasesActualItems = data[i].lease_info.leasesActualList.sort(
                                //                 function (a: any, b: any) {
                                //                         return (
                                //                                 b.leaseIdx -
                                //                                 a.leaseIdx
                                //                         )
                                //                 }
                                //         )

                                //         let leasesItems = data[i].lease_info.leasesList.sort(
                                //                 function (a: any, b: any) {
                                //                         return (
                                //                                 b.leaseIdx -
                                //                                 a.leaseIdx
                                //                         )
                                //                 }
                                //         )
                                //         currentProperty.transactionInfo.transactionList =  transactionItems
                                //         currentProperty.leaseInfo.leasesAskingList = leasesAskingItems
                                //         currentProperty.leaseInfo.leasesActualList = leasesActualItems
                                //         currentProperty.leaseInfo.leasesList = leasesItems
     
                                //         assets.push(currentProperty)
                                //         propertyIds.push(properties.propertyId)
                                // }

                                // 정렬
                                // assetsSorted = assets.sort(function (
                                //         a: any,
                                //         b: any
                                // ) {
                                //         return b.propertyId - a.propertyId
                                // })

                                // *********************************************************************************************
                                // 정렬한 자산 정보 저장
                                // *********************************************************************************************
                                // console.log('자산 정보 저장')
                                // this.initialAllAssets = assetsSorted

                                // this.filteredAssets = assetsSorted

                                // *********************************************************************************************
                                // 자산 id 저장
                                // *********************************************************************************************
                                //this.initialAssetIds = propertyIds
                                */

                                return true
                        } catch (error) {
                                console.log(error)

                                return error
                        }
                }
                },

                setSubSectors(data: any) {
                        if(data){
                        try {
                                
                                let subSectorType = [] as string[]

                                for (let i = 0; i < data.length; i++) {
                                        if (
                                                data[i].general.subsector != null &&
                                                data[i].general.subsector.name
                                                        .toLowerCase()
                                                        .trim().length > 1 &&
                                                !subSectorType.includes(
                                                        data[i].general.subsector.name
                                                                ?.toLowerCase()
                                                                .trim() as string
                                                )
                                        ) {
                                                subSectorType.push(
                                                        data[i].general.subsector.name
                                                                .toLowerCase()
                                                                .trim() as string
                                                )
                                        }
                                }

                                return true
                        } catch (error) {
                                console.log(error)

                                return error
                        }
                }
                },

                setAssetNav(id: string) {
                        try {
                                this.currentAssetId = id

                                const currentIdx =
                                        this.initialAssetIds.indexOf(id)

                                if (this.initialAssetIds[currentIdx - 1]) {
                                        this.previousAssetId =
                                                this.initialAssetIds[
                                                        currentIdx - 1
                                                ]
                                }

                                if (this.initialAssetIds[currentIdx + 1]) {
                                        this.nextAssetId =
                                                this.initialAssetIds[
                                                        currentIdx + 1
                                                ]
                                }

                                return true
                        } catch (error) {
                                console.log(error)

                                return error
                        }
                },

                filterMapInfos(ids: string[]) {
                        
                        let filteredMapData = new Object() as MapDataType
                        filteredMapData.type = "FeatureCollection"

                        let allMapData = this.allMapInfos as MapDataType
                        let allMapFeatures = allMapData.features as MapDataFeaturesType[]
                       
                        let filteredMapFeatures = new Array as MapDataFeaturesType[]
                        for(let i=0; i < allMapFeatures.length; i++) {
                                let item = allMapFeatures[i]
                                if( ids.includes(item.properties.propertyId as string) ) {
                                        filteredMapFeatures.push(item)
                                }
                        }
                        filteredMapData.features = filteredMapFeatures
                        
                        this.filteredMapInfos = filteredMapData
                       
                },

                setFilterAssets() {
                        console.log('setFilterAssets')
                        const filter = useFilterStore()
                        const map = useMapStore()
                        let assets = this.initialAllAssets

                        let tempTextAssets = [] as CbreAsset[]
                        let tempTransactionAssets = [] as CbreAsset[]
                        let tempSectorAssets = [] as CbreAsset[]
                        let tempSubSectorAssets = [] as CbreAsset[]
                        let tempMoreFilterAssets = [] as CbreAsset[]

                        
                        // 1. text filter
                        if (filter.searchKeyword.length > 0) {
                                tempTextAssets = assets.filter(
                                        (el) =>
                                                el.propertyName
                                                        ?.toLowerCase()
                                                        .includes(
                                                                filter.searchKeyword
                                                        ) ||
                                                el.location.addressFull
                                                        ?.toLowerCase()
                                                        .includes(
                                                                filter.searchKeyword
                                                        ) ||
                                                el.location.addressFullJibun
                                                        ?.toLowerCase()
                                                        .includes(
                                                                filter.searchKeyword
                                                        ) ||
                                                el.location.addressProvince
                                                        ?.toLowerCase()
                                                        .includes(
                                                                filter.searchKeyword
                                                        )||
                                                el.location.addressCity
                                                        ?.toLowerCase()
                                                        .includes(
                                                                filter.searchKeyword
                                                        )
                                )
                        } else {
                                tempTextAssets = assets
                        }
/*
                        // 2. transactionType
                        //console.log(filter.filterTransactionType)
                        if (
                                filter.filterTransactionType.toLowerCase() ===
                                'lease'
                        ) {
                                tempTransactionAssets = tempTextAssets.filter(
                                        (el) => el.lease_info.total > 0
                                )
                        } else if (
                                filter.filterTransactionType.toLowerCase() ===
                                'sale'
                        ) {
                                tempTransactionAssets = tempTextAssets.filter(
                                        (el) => el.transaction_info.total > 0
                                )
                        } else if (
                                filter.filterTransactionType.toLowerCase() ===
                                'sale/lease'
                        ) {
                                tempTransactionAssets = tempTextAssets.filter(
                                        (el) =>
                                                el.transaction_info.total > 0 &&
                                                el.lease_info.total > 0
                                )
                        } else {
                                tempTransactionAssets = tempTextAssets
                        }

                        // 3. sectorType
                        //console.log(filter.filterSectorTypes)
                        if (filter.filterSectorTypes.length > 0) {
                                for (
                                        let i = 0;
                                        i < filter.filterSectorTypes.length;
                                        i++
                                ) {
                                        let sector = filter.filterSectorTypes[
                                                i
                                        ] as any
                                        //console.log(sector.name.toLowerCase())
                                        let temp = [] as CbreAsset[]
                                        temp = tempTransactionAssets.filter(
                                                (el) =>
                                                        el.sector.toLowerCase() ===
                                                        sector.name.toLowerCase()
                                        )
                                        tempSectorAssets.push(...temp)
                                }
                        } else {
                                tempSectorAssets = tempTransactionAssets
                        }

                        // 4. subSectorType
                        //console.log(filter.filterSectorTypes)
                        if (filter.filterSubSectorTypes.length > 0) {
                                for (
                                        let i = 0;
                                        i < filter.filterSubSectorTypes.length;
                                        i++
                                ) {
                                        let sector = filter
                                                .filterSubSectorTypes[i] as any
                                        //console.log(sector.name.toLowerCase())
                                        let temp = [] as CbreAsset[]
                                        temp = tempSectorAssets.filter(
                                                (el) =>
                                                        el.sector.toLowerCase() ===
                                                        sector.name.toLowerCase()
                                        )
                                        tempSubSectorAssets.push(...temp)
                                }
                        } else {
                                tempSubSectorAssets = tempSectorAssets
                        }

                        // 5. More Filters

                        // 5.1 size

                        let tempGfa
                        if (filter.moreFilters.gfaType === true) {
                                tempGfa = tempSubSectorAssets.filter(
                                        (el) =>
                                                el.gfaSqm >=
                                                filter.moreFilters.gfa
                                )
                        } else {
                                tempGfa = tempSubSectorAssets.filter(
                                        (el) =>
                                                el.gfaPy >=
                                                filter.moreFilters.gfa
                                )
                        }

                        let tempNfa
                        if (filter.moreFilters.nfaType === true) {
                                tempNfa = tempGfa.filter(
                                        (el) =>
                                                el.nfaSqm >=
                                                filter.moreFilters.nfa
                                )
                        } else {
                                tempNfa = tempGfa.filter(
                                        (el) =>
                                                el.nfaPy >=
                                                filter.moreFilters.nfa
                                )
                        }

                        let tempSiteArea
                        if (filter.moreFilters.siteAreaType === true) {
                                tempSiteArea = tempNfa.filter(
                                        (el) =>
                                                el.siteAreaSqm >=
                                                filter.moreFilters.siteArea
                                )
                        } else {
                                tempSiteArea = tempNfa.filter(
                                        (el) =>
                                                el.siteAreaPy >=
                                                filter.moreFilters.siteArea
                                )
                        }

                        // 5.2 period
                        let tempBuilt
                        if (filter.moreFilters.built != 0) {
                                //@ts-ignore
                                tempBuilt = tempSiteArea.filter(
                                        (el) =>
                                                el.yearBuilt >=
                                                        filter.moreFilters
                                                                .built ||
                                                el.yearBuilt === 0
                                )
                        } else {
                                tempBuilt = tempSiteArea
                        }
                        let tempReno
                        if (filter.moreFilters.reno != 0) {
                                //@ts-ignore
                                tempReno = tempBuilt.filter(
                                        (el) =>
                                                el.yearRenovated >=
                                                        filter.moreFilters
                                                                .reno ||
                                                el.yearRenovated === 0
                                )
                        } else {
                                tempReno = tempBuilt
                        }

                        let tempSales
                        if (filter.moreFilters.sales != 0) {
                                tempSales = tempReno.filter((el) => {
                                        if (el.transaction_info.total > 0) {
                                                let transactions =
                                                        el.transaction_info
                                                                .transactions
                                                for (
                                                        let i = 0;
                                                        i < transactions.length;
                                                        i++
                                                ) {
                                                        //console.log(parseInt(transactions[i].transactionYear))
                                                        //@ts-ignore
                                                        if (
                                                                parseInt(
                                                                        transactions[
                                                                                i
                                                                        ]
                                                                                .transactionYear
                                                                ) >=
                                                                filter
                                                                        .moreFilters
                                                                        .sales
                                                        )
                                                                return el
                                                }
                                        }
                                })
                        } else {
                                tempSales = tempReno
                        }

                        let tempLeases
                        if (filter.moreFilters.leases != 0) {
                                tempLeases = tempSales.filter((el) => {
                                        if (el.lease_info.total > 0) {
                                                let leases =
                                                        el.lease_info.leases
                                                for (
                                                        let i = 0;
                                                        i < leases.length;
                                                        i++
                                                ) {
                                                        let leasedate =
                                                                new Date(
                                                                        leases[
                                                                                i
                                                                        ].actualLeaseStartDate
                                                                )
                                                        //console.log(leasedate.getFullYear())
                                                        //@ts-ignore
                                                        if (
                                                                leasedate.getFullYear() >=
                                                                filter
                                                                        .moreFilters
                                                                        .leases
                                                        )
                                                                return el
                                                }
                                        }
                                })
                        } else {
                                tempLeases = tempSales
                        }

                        // 5.3 facility
                        let tempBuildings
                        tempBuildings = tempLeases.filter(
                                (el:any) =>
                                        el.noOfBuildings >=
                                        filter.moreFilters.buildings
                        )

                        let tempBasement
                        tempBasement = tempBuildings.filter(
                                (el:any) =>
                                        el.basementLevels >=
                                        filter.moreFilters.basement
                        )

                        let tempUpperFloor
                        tempUpperFloor = tempBasement.filter(
                                (el:any) =>
                                        el.upperFloors >=
                                        filter.moreFilters.upperFloor
                        )

                        let tempElevator
                        tempElevator = tempUpperFloor.filter(
                                (el:any) =>
                                        el.elevators >=
                                        filter.moreFilters.elevator
                        )

                        let tempParking
                        tempParking = tempElevator.filter(
                                (el) => el.cps >= filter.moreFilters.parking
                        )

                        // 5.4 finance

                        let tempIod
                        if (filter.moreFilters.iod != 0) {
                                tempIod = tempParking.filter((el) => {
                                        if (el.lease_info.total > 0) {
                                                let leases =
                                                        el.lease_info.leases
                                                for (
                                                        let i = 0;
                                                        i < leases.length;
                                                        i++
                                                ) {
                                                        let iod =
                                                                leases[i]
                                                                        .actualIod
                                                        //console.log(leasedate.getFullYear())
                                                        //@ts-ignore
                                                        if (
                                                                iod >=
                                                                filter
                                                                        .moreFilters
                                                                        .iod
                                                        )
                                                                return el
                                                }
                                        }
                                })
                        } else {
                                tempIod = tempParking
                        }

                        let tempGdm
                        if (filter.moreFilters.iod != 0) {
                                tempGdm = tempIod.filter((el) => {
                                        if (el.lease_info.total > 0) {
                                                let leases =
                                                        el.lease_info.leases
                                                for (
                                                        let i = 0;
                                                        i < leases.length;
                                                        i++
                                                ) {
                                                        let gdm =
                                                                leases[i]
                                                                        .actualGdm
                                                        //@ts-ignore
                                                        if (
                                                                gdm >=
                                                                filter
                                                                        .moreFilters
                                                                        .gdm
                                                        )
                                                                return el
                                                }
                                        }
                                })
                        } else {
                                tempGdm = tempIod
                        }

                        let tempNoc
                        if (filter.moreFilters.noc != 0) {
                                tempNoc = tempGdm.filter((el) => {
                                        if (el.lease_info.total > 0) {
                                                let leases =
                                                        el.lease_info.leases
                                                for (
                                                        let i = 0;
                                                        i < leases.length;
                                                        i++
                                                ) {
                                                        let noc =
                                                                leases[i]
                                                                        .actualNoc
                                                        //@ts-ignore
                                                        if (
                                                                noc >=
                                                                filter
                                                                        .moreFilters
                                                                        .noc
                                                        )
                                                                return el
                                                }
                                        }
                                })
                        } else {
                                tempNoc = tempGdm
                        }

                        let tempEffRatio
                        tempEffRatio = tempNoc.filter(
                                (el) =>
                                        parseFloat(el.effRatio) >=
                                        filter.moreFilters.effRatio
                        )

                        tempMoreFilterAssets.push(...tempEffRatio)

                        this.filteredAssets = tempMoreFilterAssets

                        
                        */

                        this.filteredAssets = tempTextAssets

                        console.log(this.filteredAssets)

                        //set map pins
                        this.filteredAssetsIds = [] as string[]
                        this.filteredAssets.forEach((el:any) => this.filteredAssetsIds.push(el.propertyId))
                        
                        console.log(this.filteredAssetsIds)
                        
                        this.filterMapInfos(this.filteredAssetsIds)

                        map.filtered = Date.now().toString()
                        
                },

                filterAdminList(searchKeyword: string) {
                        if (this.adminList.length > 0) {
                                // 검색어는 소문자로 변환하여 대소문자 구분 없이 검색되도록 하는 것이 좋습니다.
                                const search = searchKeyword.toLowerCase(); 

                                const tempTextAssets = this.adminList.filter(
                                (el) =>
                                        el.propertyName.toLowerCase().includes(search) ||

                                        // 💡 수정된 부분: addressFull이 null이 아닐 때만 includes()를 호출합니다.
                                        (el.addressFull && el.addressFull.toLowerCase().includes(search)) || 

                                        el.sector.toLowerCase().includes(search) ||
                                        (el.subSector && el.subSector.toLowerCase().includes(search)) || // subSector도 안전하게 체크합니다.
                                        el.grade.toLowerCase().includes(search)
                                )

                                this.filteredAdminList = tempTextAssets
                        } else {
                                this.filteredAdminList = []
                        }
                }
        },
})
