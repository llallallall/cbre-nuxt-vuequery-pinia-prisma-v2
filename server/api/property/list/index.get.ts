import prisma from '@/prisma/cbredb'
import { 
    CbreAsset, GeneralType, WarehouseType, AccessibilityType, FacilityType, LocationType, ProfitabilityType, SizesType, 
    SectorType, SubSectorType, FloorType, HistoryType, AssetPhotoType, FloorPlanPhotoListType, EachFloorPhotoType, 
    FloorPlanPhotoType, FileType, ElevatorsType, ParkingType, MaterialsType 
} from '~/types/asset.type' 
// 모든 필요한 타입을 명시적으로 임포트합니다.

export default defineEventHandler(async (event) => {

    // 1. 메인 데이터 쿼리: Raw 쿼리 대신 Prisma의 Include를 사용하여 1:1 관계를 안전하게 처리합니다.
    const allPropertiesData = await prisma.property.findMany({
        orderBy: {
            created_at: 'desc'
        },
        // 1:1 관계 모델을 Include 합니다.
        include: {
            sector: { select: { id: true, name: true } },
            subsector: { select: { id: true, sector_id: true, name: true } },
            location: true, // Location 모델 전체를 가져옴
            scale: true,    // Scale 모델 전체를 가져옴
            facility: true, // Facility 모델 전체를 가져옴
            accessibility: true, // Accessibility 모델 전체를 가져옴
            profitability: true, // Profitability 모델 전체를 가져옴
            warehouse: { // 1:N 관계 (온도 타입별 비율)
                select: {
                    temperature_type: true,
                    ratio: true,
                }
            },
        }
    });

    // 2. 나머지 1:N 관계 데이터를 별도로 가져옵니다 (기존 방식 유지)
    // 이 쿼리들은 이미 안전하므로 유지하되, Floor는 floorPartial을 포함하도록 명시합니다.
    const allFloors = await prisma.floor.findMany({ include: { floorPartial: true } });
    const allHistories = await prisma.history.findMany({ select: { property_id: true, year: true, type: true } });
    const allImages = await prisma.propertyImageFile.findMany({ select: { property_id: true, main: true, file_url: true, file_uuid: true, file_name: true, file_key: true, file_content_type: true } });
    const allFloorPlanImages = await prisma.floorPlanFile.findMany({ select: { property_id: true, type: true, floor: true, file_uuid: true, file_name: true, file_key: true, file_url: true, file_content_type: true } });
    const allBrochureFiles = await prisma.propertyBrochureFile.findMany({ select: { property_id: true, file_uuid: true, file_name: true, file_key: true, file_url: true, file_content_type: true } });

    let result = [] as CbreAsset[]

    // 3. 데이터 매핑 (1:1 관계는 Direct Access로 변경)
    for (const property of allPropertiesData) {
        // 1:1 관계는 null일 수 있으므로 안전하게 접근합니다.
        const location = property.location;
        const scale = property.scale;
        const facility = property.facility;
        const accessibility = property.accessibility;
        const profitability = property.profitability;
        
        let propertyObj = {} as CbreAsset;

        // 메인 정보
        propertyObj.propertyId = property.id;
        propertyObj.propertyName = property.name;
        
        // 메인 이미지 URL (별도로 가져온 allImages에서 필터링)
        const mainImage = allImages.find(img => img.property_id === property.id && img.main === true);
        propertyObj.mainImageUrl = mainImage?.file_url || ''; // CbreAsset 요구사항에 따라 빈 문자열 처리

        // general
        let generalObj: GeneralType = {} as GeneralType;
        generalObj.sector = property.sector as SectorType || { id: '', name: '' };

        let subSectorObj: SubSectorType | null = null; // 타입을 명시적으로 지정

        if (property.subsector) {
            // 🌟 핵심 수정: 스네이크 케이스 필드(sector_id)를 카멜 케이스(sectorId)로 변환하여 할당합니다.
            subSectorObj = {
                id: property.subsector.id,
                // 👇 DB 컬럼명(sector_id)을 타입 필드명(sectorId)에 매핑
                sectorId: property.subsector.sector_id, 
                name: property.subsector.name,
            }; // 이제 별도의 'as SubSectorType' 캐스팅 없이도 타입이 안전하게 추론됩니다.
        }

        generalObj.subSector = subSectorObj;
        
        // Warehouse (Array to Object 변환)
        let warehouseObj: WarehouseType = { room: null, low: null, constant: null };
        property.warehouse.forEach(w => {
            if (w.temperature_type === 'ROOM') warehouseObj.room = w.ratio;
            else if (w.temperature_type === 'LOW') warehouseObj.low = w.ratio;
            else if (w.temperature_type === 'CONSTANT') warehouseObj.constant = w.ratio;
        });
        generalObj.warehouse = warehouseObj;
        propertyObj.general = generalObj;

        // accessibility (1:1 관계 Direct Mapping)
        let accessibilityObj: AccessibilityType = {} as AccessibilityType;
        accessibilityObj.distanceToIc = accessibility?.distance_to_ic || null;
        accessibilityObj.timeTakenToCityHall = accessibility?.time_taken_to_city_hall || null;
        accessibilityObj.timeTakenToSubway = accessibility?.time_taken_to_subway || null;
        accessibilityObj.nearbyFacilities = accessibility?.nearby_facilities || null;
        accessibilityObj.nearbyAttractions = accessibility?.nearby_attractions || null;
        accessibilityObj.nearbyPlaces = accessibility?.nearby_places || null;
        propertyObj.accessibility = accessibilityObj;
        
        // facility (1:1 관계 Direct Mapping)
        let facilityObj: FacilityType = {} as FacilityType;
        
        let elevatorsObj: ElevatorsType = {} as ElevatorsType;
        elevatorsObj.total = facility?.elevators_total || null;
        elevatorsObj.passenger = facility?.elevators_passenger || null;
        elevatorsObj.service = facility?.elevators_service || null;
        elevatorsObj.shuttle = facility?.elevators_freight || null;
        facilityObj.elevators = elevatorsObj;

        let parkingObj: ParkingType = {} as ParkingType;
        parkingObj.cpsExisting = facility?.cps_existing || null;
        parkingObj.cpsRequired = facility?.cps_required || null;
        parkingObj.freeCpsSqm = facility?.free_cps_sqm || null;
        parkingObj.freeCpsPy = facility?.free_cps_py || null;
        parkingObj.paidParkingFee = facility?.paid_parking_fee || null;
        facilityObj.parking = parkingObj;

        let materialsObj: MaterialsType = {} as MaterialsType;
        materialsObj.roofMaterial = facility?.roof_material || null;
        materialsObj.facade = facility?.facade || null;
        materialsObj.mechanicalElectrical = facility?.mechanical_electrical || null;
        materialsObj.lighting = facility?.lighting || null;
        materialsObj.fireFighting = facility?.fire_fighting || null;
        facilityObj.materials = materialsObj;
        
        propertyObj.facility = facilityObj;

        // location (1:1 관계 Direct Mapping)
        let locationObj: LocationType = {} as LocationType;
        locationObj.addressFull = location?.address_full || '';
        locationObj.addressFullJibun = location?.address_full_jibun || '';
        locationObj.addressProvince = location?.address_province || '';
        locationObj.addressCity = location?.address_city || '';
        locationObj.latitude = location?.latitude || null;
        locationObj.longitude = location?.longitude || null;
        propertyObj.location = locationObj;

        // profitability (1:1 관계 Direct Mapping)
        let profitabilityObj: ProfitabilityType = {} as ProfitabilityType;
        profitabilityObj.grade = profitability?.grade || '';
        profitabilityObj.effRatio = profitability?.effective_ratio || null;
        propertyObj.profitability = profitabilityObj;

        // sizes (Scale 1:1 관계 Direct Mapping)
        let sizesObj: SizesType = {} as SizesType;
        sizesObj.noOfBuildings = scale?.no_of_buildings || null;
        sizesObj.upperLevels = scale?.upper_levels || null;
        sizesObj.basementLevels = scale?.basement_levels || null;

        sizesObj.gfaSqm = scale?.gfa_sqm || null;
        sizesObj.gfaPy = scale?.gfa_py || null;
        sizesObj.nfaSqm = scale?.nfa_sqm || null;
        sizesObj.nfaPy = scale?.nfa_py || null;
        sizesObj.siteAreaSqm = scale?.site_area_sqm || null;
        sizesObj.siteAreaPy = scale?.site_area_py || null;
        sizesObj.grossLeasableAreaSqm = scale?.gross_leasable_area_sqm || null;
        sizesObj.grossLeasableAreaPy = scale?.gross_leasable_area_py || null;
        sizesObj.netLeasableAreaSqm = scale?.net_leasable_area_sqm || null;
        sizesObj.netLeasableAreaPy = scale?.net_leasable_area_py || null;
        sizesObj.floorAreaRatioExisting = scale?.floor_area_ratio_existing || null;
        sizesObj.floorAreaRatioPermitted = scale?.floor_area_ratio_permitted || null;
        sizesObj.buildingCoverageRatioExisting = scale?.building_coverage_ratio_existing || null;
        sizesObj.buildingCoverageRatioPermitted = scale?.building_coverage_ratio_permitted || null;
        sizesObj.floorPlateSqm = scale?.floor_plate_sqm || null;
        sizesObj.floorPlatePy = scale?.floor_plate_py || null;
        propertyObj.sizes = sizesObj;

        // historyList
        propertyObj.historyList = allHistories
            .filter((el: any) => el.property_id === property.id)
            .map((item: any) => ({ propertyId: item.property_id, type: item.type, year: item.year }) as HistoryType);

        // floorList (Floor.id를 floorId에 매핑)
        propertyObj.floorList = allFloors
            .filter((el: any) => el.property_id === property.id)
            .map((item: any) => ({
                floorId: item.id, // 🌟 Floor.id를 FloorType.floorId에 매핑합니다.
                propertyId: item.property_id,
                type: item.type,
                floor: item.floor,
                ceilingHeight: item.ceiling_height,
                ceilingHeightUnit: item.ceiling_height_unit,
                floorLoad: item.floor_load,
                floorLoadUnit: item.floor_load_unit,
                truckBerths: item.truck_berths,
                use: item.use,
                totalAreaSqm: item.total_area_sqm,
                totalAreaPy: item.total_area_py,
                grossLeasableAreaSqm: item.gross_leasable_area_sqm,
                grossLeasableAreaPy: item.gross_leasable_area_py,
                netLeasableAreaSqm: item.net_leasable_area_sqm,
                netLeasableAreaPy: item.net_leasable_area_py,
                floorPartial: item.floorPartial,
            }) as FloorType);

        // photoList, brochureList, floorPlanPhotoList는 기존 로직을 타입만 정리하여 그대로 유지합니다.
        // ... (나머지 1:N 관계 매핑 로직) ...
        
        // floorPlanPhotoList
        const floorPlanPhotoObj = allFloorPlanImages.filter((el: any) => el.property_id === property.id);
        let floorPlanPhotoListObj: FloorPlanPhotoListType = { logitudinal: [], cross: [], eachFloor: { uppers: [], basements: [] } };
        
        for (const item of floorPlanPhotoObj) {
            const floorPlanObj: FloorPlanPhotoType = {
                propertyId: item.property_id,
                type: item.type,
                floor: item.floor,
                fileUuid: item.file_uuid,
                fileName: item.file_name,
                fileKey: item.file_key,
                fileUrl: item.file_url,
                fileContentType: item.file_content_type,
            };

            if (item.type === 'LOGITUDINALSECTION') {
                floorPlanPhotoListObj.logitudinal.push(floorPlanObj);
            } else if (item.type === 'CROSSSECTION') {
                floorPlanPhotoListObj.cross.push(floorPlanObj);
            } else if (item.type === 'UPPERSECTION') {
                floorPlanPhotoListObj.eachFloor.uppers.push(floorPlanObj);
            } else if (item.type === 'BASEMENTSECTION') {
                floorPlanPhotoListObj.eachFloor.basements.push(floorPlanObj);
            }
        }
        propertyObj.floorPlanPhotoList = floorPlanPhotoListObj;

        // photoList
        propertyObj.photoList = allImages
            .filter((el: any) => el.property_id === property.id)
            .map((item: any) => ({
                propertyId: item.property_id,
                main: item.main,
                fileUuid: item.file_uuid,
                fileName: item.file_name,
                fileKey: item.file_key,
                fileUrl: item.file_url,
                fileContentType: item.file_content_type,
            }) as AssetPhotoType);
        
        // brochureList
        propertyObj.brochureList = allBrochureFiles
            .filter((el: any) => el.property_id === property.id)
            .map((item: any) => ({
                propertyId: item.property_id,
                fileUuid: item.file_uuid,
                fileName: item.file_name,
                fileKey: item.file_key,
                fileUrl: item.file_url,
                fileContentType: item.file_content_type,
            }) as FileType);


        // transactionInfo / leaseInfo (기존 빈 객체 할당 유지)
        propertyObj.transactionInfo = { totalTransactions: 0, transactionsList: [] };
        propertyObj.leaseInfo = { 
            totalLeasesAsking: 0, 
            totalLeasesActual: 0, 
            leasesAskingList: [], 
            leasesActualList: [], 
            leasesList: [] 
        };
        
        result.push(propertyObj);
    }

    return result
      
})