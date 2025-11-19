// ~/utils/assetMapper.ts

import { Prisma, TemperatureType, LevelType, FloorUseType, RoomUseType, HistoryType as PrismaHistoryType } from '@prisma/client';
import type {
        GeneralType, SizesType, FloorType, FloorPartialType, WarehouseType, AccessibilityType,
        ElevatorsType, ParkingType, MaterialsType, FacilityType, ProfitabilityType, HistoryType,
        LocationType, SectorType, SubSectorType, HistoryTypeEnum,
        LevelTypeEnum, FloorUseTypeEnum, RoomUseTypeEnum // Enum 타입 임포트 추가
} from '~/types/asset.type';


// =======================================================
// 1. Prisma Model Payload Types
// =======================================================

// 핵심 자산 정보 모델
export type PrismaSector = Prisma.SectorGetPayload<any>;
export type PrismaSubsector = Prisma.SubSectorGetPayload<any> | null;
export type PrismaWarehouse = Prisma.WarehouseGetPayload<any>; // List of warehouse records
export type PrismaLocation = Prisma.LocationGetPayload<any> | null;
export type PrismaAccessibility = Prisma.AccessibilityGetPayload<any> | null;
export type PrismaScale = Prisma.ScaleGetPayload<any>;
export type PrismaProfitability = Prisma.ProfitabilityGetPayload<any> | null;
export type PrismaFacility = Prisma.FacilityGetPayload<any> | null;
export type PrismaHistory = Prisma.HistoryGetPayload<any>; // List of history records
export type PrismaWarehouseCreateInput = Prisma.WarehouseCreateManyInput; // Warehouse는 createMany를 위해 별도 정의

// Floor 모델과 그 Partial 관계 모델
export type PrismaFloorPartial = Prisma.FloorPartialGetPayload<any>;
export type PrismaFloorWithPartials = Prisma.FloorGetPayload<{
        include: {
                floorPartial: true;
        };
}>;


// =======================================================
// 2. Core Asset Mapping Functions (DB -> Client)
// =======================================================

/**
 * 🏭 GeneralType (Sector, SubSector, Warehouse) 매핑
 */
export function mapGeneralToClient(
        sector: PrismaSector,
        subsector: PrismaSubsector,
        warehouseList: PrismaWarehouse[]
): GeneralType {
        const mappedSector: SectorType = { id: sector.id, name: sector.name };
        const mappedSubSector: SubSectorType | null = subsector ? {
                id: subsector.id,
                sectorId: subsector.sector_id,
                name: subsector.name,
        } : null;

        // Warehouse Type (ROOM, LOW, CONSTANT)에 따라 비율을 매핑합니다.
        const warehouseClientData: WarehouseType = { room: null, low: null, constant: null };
        if (Array.isArray(warehouseList)) {
                for (const w of warehouseList) {
                        if (w.temperature_type === TemperatureType.ROOM) {
                                warehouseClientData.room = w.ratio ?? null;
                        } else if (w.temperature_type === TemperatureType.LOW) {
                                warehouseClientData.low = w.ratio ?? null;
                        } else if (w.temperature_type === TemperatureType.CONSTANT) {
                                warehouseClientData.constant = w.ratio ?? null;
                        }
                }
        }

        return {
                sector: mappedSector,
                subSector: mappedSubSector,
                warehouse: warehouseClientData,
        } as GeneralType;
}

/**
 * 📜 History 모델 리스트를 클라이언트 HistoryType 리스트로 매핑합니다.
 */
export function mapHistoryListToClient(historyList: PrismaHistory[]): HistoryType[] {
        return historyList.map(h => ({
                propertyId: h.property_id,
                // 💡 [수정] HistoryType Enum으로 안전하게 이중 캐스팅
                type: h.type as unknown as HistoryTypeEnum,
                year: h.year,
        })) as HistoryType[];
}


/**
 * 📍 Location 모델을 클라이언트 LocationType으로 매핑합니다.
 */
export function mapLocationToClient(location: PrismaLocation): LocationType {
        return {
                addressFull: location?.address_full ?? null,
                addressFullJibun: location?.address_full_jibun ?? null,
                addressProvince: location?.address_province ?? null,
                addressCity: location?.address_city ?? null,
                latitude: location?.latitude ?? null,
                longitude: location?.longitude ?? null,
        } as LocationType;
}

/**
 * 🛣️ Accessibility 모델을 클라이언트 AccessibilityType으로 매핑합니다.
 */
export function mapAccessibilityToClient(accessibility: PrismaAccessibility): AccessibilityType {
        return {
                distanceToIc: accessibility?.distance_to_ic ?? null,
                timeTakenToCityHall: accessibility?.time_taken_to_city_hall ?? null,
                timeTakenToSubway: accessibility?.time_taken_to_subway ?? null,
                nearbyFacilities: accessibility?.nearby_facilities ?? null,
                nearbyAttractions: accessibility?.nearby_attractions ?? null,
                nearbyPlaces: accessibility?.nearby_places ?? null,
        } as AccessibilityType;
}


/**
 * 📏 DB Scale 모델을 클라이언트 SizesType으로 매핑합니다.
 */
export function mapScaleToSizes(scale: PrismaScale | null): SizesType {
        if (!scale) {
                return {
                        siteAreaSqm: null,
                        siteAreaPy: null,
                        gfaSqm: null,
                        gfaPy: null,
                        nfaSqm: null,
                        nfaPy: null,
                        buildingCoverageRatioExisting: null,
                        floorAreaRatioExisting: null,
                        buildingCoverageRatioPermitted: null,
                        floorAreaRatioPermitted: null,
                        noOfBuildings: 0,
                        upperLevels: 0,
                        basementLevels: 0,
                        grossLeasableAreaSqm: null,
                        grossLeasableAreaPy: null,
                        netLeasableAreaSqm: null,
                        netLeasableAreaPy: null,
                        floorPlateSqm: null,
                        floorPlatePy: null,
                } as SizesType;
        }

        // DB 필드(snake_case)를 Client 필드(camelCase)로 매핑합니다.
        return {
                siteAreaSqm: scale.site_area_sqm ?? null,
                siteAreaPy: scale.site_area_py ?? null,
                gfaSqm: scale.gfa_sqm ?? null,
                gfaPy: scale.gfa_py ?? null,
                nfaSqm: scale.nfa_sqm ?? null,
                nfaPy: scale.nfa_py ?? null,
                buildingCoverageRatioExisting: scale.building_coverage_ratio_existing ?? null,
                floorAreaRatioExisting: scale.floor_area_ratio_existing ?? null,
                buildingCoverageRatioPermitted: scale.building_coverage_ratio_permitted ?? null,
                floorAreaRatioPermitted: scale.floor_area_ratio_permitted ?? null,
                noOfBuildings: scale.no_of_buildings ?? null,
                upperLevels: scale.upper_levels ?? null,
                basementLevels: scale.basement_levels ?? null,
                grossLeasableAreaSqm: scale.gross_leasable_area_sqm ?? null,
                grossLeasableAreaPy: scale.gross_leasable_area_py ?? null,
                netLeasableAreaSqm: scale.net_leasable_area_sqm ?? null,
                netLeasableAreaPy: scale.net_leasable_area_py ?? null,
                floorPlateSqm: scale.floor_plate_sqm ?? null,
                floorPlatePy: scale.floor_plate_py ?? null,
        } as SizesType;
}


/**
 * 💰 Profitability 모델을 클라이언트 ProfitabilityType으로 매핑합니다.
 */
export function mapProfitabilityToClient(profitability: PrismaProfitability): ProfitabilityType {
        return {
                grade: profitability?.grade ?? null,
                effRatio: profitability?.effective_ratio ?? null,
                // ProfitabilityType에 필요한 기타 필드 매핑...
        } as ProfitabilityType;
}

/**
 * 🏗️ Facility 모델을 클라이언트 FacilityType으로 매핑합니다.
 */
export function mapFacilityToClient(apiFacility: PrismaFacility): FacilityType {
        if (!apiFacility) {

                const defaultElevators: ElevatorsType = { total: 0, passenger: 0, service: 0, shuttle: 0 };
                const defaultParking: ParkingType = {
                        cpsExisting: 0,
                        cpsRequired: 0,
                        freeCpsSqm: null,
                        freeCpsPy: null,
                        paidParkingFee: null,
                };
                const defaultMaterials: MaterialsType = {
                        roofMaterial: null,
                        facade: null,
                        mechanicalElectrical: null,
                        lighting: null,
                        fireFighting: null,
                };

                return {
                        elevators: defaultElevators,
                        parking: defaultParking,
                        materials: defaultMaterials,
                        // FacilityType에 있는 기타 모든 필드를 여기에 null로 초기화 해야 합니다.
                        // 예: airConditioning: null, heating: null, ...
                } as FacilityType;

        } else {

                // 1. Elevators Type 매핑
                const elevators: ElevatorsType = {
                        total: apiFacility.elevators_total ?? null,
                        passenger: apiFacility.elevators_passenger ?? null,
                        service: apiFacility.elevators_service ?? null,
                        shuttle: apiFacility.elevators_freight ?? null,
                };

                // 2. Parking Type 매핑
                const parking: ParkingType = {
                        cpsExisting: apiFacility.cps_existing ?? null,
                        cpsRequired: apiFacility.cps_required ?? null,
                        freeCpsSqm: apiFacility.free_cps_sqm ?? null,
                        freeCpsPy: apiFacility.free_cps_py ?? null,
                        paidParkingFee: apiFacility.paid_parking_fee ?? null,
                };

                // 3. Materials Type 매핑
                const materials: MaterialsType = {
                        roofMaterial: apiFacility.roof_material ?? null,
                        facade: apiFacility.facade ?? null,
                        mechanicalElectrical: apiFacility.mechanical_electrical ?? null,
                        lighting: apiFacility.lighting ?? null,
                        fireFighting: apiFacility.fire_fighting ?? null,
                };

                // 4. FacilityType 최종 구성
                return {
                        elevators: elevators,
                        parking: parking,
                        materials: materials,

                } as FacilityType;


        }


}


/**
 * 🏢 DB Floor 모델 리스트를 클라이언트 FloorType 리스트로 매핑합니다.
 */
export function mapFloorListToClient(floors: PrismaFloorWithPartials[]): FloorType[] {
        return floors.map(f => ({
                floorId: f.id,
                propertyId: f.property_id,
                // 💡 [수정] Enum 이중 캐스팅
                type: f.type as unknown as LevelTypeEnum ?? null, // LevelTypeEnum
                floor: f.floor,
                ceilingHeight: f.ceiling_height ?? null,
                ceilingHeightUnit: f.ceiling_height_unit ?? null,
                floorLoad: f.floor_load ?? null,
                floorLoadUnit: f.floor_load_unit ?? null,
                truckBerths: f.truck_berths ?? null,
                // 💡 [수정] Enum 이중 캐스팅
                use: f.use as unknown as FloorUseTypeEnum ?? null, // FloorUseTypeEnum
                totalAreaSqm: f.total_area_sqm ?? null,
                totalAreaPy: f.total_area_py ?? null,
                grossLeasableAreaSqm: f.gross_leasable_area_sqm ?? null,
                grossLeasableAreaPy: f.gross_leasable_area_py ?? null,
                netLeasableAreaSqm: f.net_leasable_area_sqm ?? null,
                netLeasableAreaPy: f.net_leasable_area_py ?? null,

                // FloorPartial (임차 정보) 매핑
                floorPartial: f.floorPartial.map(fp => ({
                        id: fp.id,
                        floorId: f.id,
                        unitNumber: fp.unit_number ?? null,
                        tenant: fp.tenant ?? null,
                        leaseAreaSqm: fp.lease_area_sqm ?? null,
                        leaseAreaPy: fp.lease_area_py ?? null,
                        tenantEquipment: fp.tenant_equipment,
                        // 💡 [수정] Enum 이중 캐스팅
                        tenantUse: fp.tenant_use as unknown as RoomUseTypeEnum ?? null, // RoomUseTypeEnum
                        leaseStartDate: fp.lease_start_date ?? null,
                        leaseEndDate: fp.lease_end_date ?? null,
                        depositKrw: fp.deposit_krw ?? null,
                        monthlyRentPerPy: fp.monthly_rent_per_py ?? null,
                        monthlyRent: fp.monthly_rent ?? null,
                        monthlyManagementPerPy: fp.monthly_management_per_py ?? null,
                        monthlyManagementFee: fp.monthly_management_fee ?? null,
                        increaseConditionsForDeposit: fp.increase_conditions_for_deposit ?? null,
                        increaseConditionsForRent: fp.increase_conditions_for_rent ?? null,
                        increaseConditionsForManagementFee: fp.increase_conditions_for_management_fee ?? null,
                        rentFree: fp.rent_free ?? null,
                        fitOut: fp.fit_out ?? null,
                }) as FloorPartialType),

        }) as FloorType);
}


// =======================================================
// 3. Core Asset Mapping Functions (Client -> DB)
// =======================================================

/**
 * 💡 [헬퍼] 클라이언트 SectorType을 DB 페이로드로 매핑합니다.
 */
export const mapClientSectorToPrisma = (clientSector: SectorType): Partial<PrismaSector> => ({
        name: clientSector.name,
});

/**
 * 💡 [헬퍼] 클라이언트 SubSectorType을 DB 페이로드로 매핑합니다.
 */
export const mapClientSubSectorToPrisma = (clientSubSector: SubSectorType | null): Partial<PrismaSubsector> | null => {
        if (!clientSubSector) return null;
        return {
                // sector_id는 부모 관계 처리 로직에서 관리됨
                name: clientSubSector.name,
        };
};

/**
 * 💡 [헬퍼] 클라이언트 WarehouseType을 DB 저장용 리스트로 매핑합니다.
 * @param propertyId - 연결할 property_id
 */
export const mapClientWarehouseListToPrisma = (warehouseClient: WarehouseType, propertyId: string): PrismaWarehouseCreateInput[] => {
        const list: PrismaWarehouseCreateInput[] = [];

        if (warehouseClient.room !== null) {
                list.push({
                        property_id: propertyId,
                        temperature_type: TemperatureType.ROOM, // Prisma Enum
                        ratio: warehouseClient.room,
                });
        }
        if (warehouseClient.low !== null) {
                list.push({
                        property_id: propertyId,
                        temperature_type: TemperatureType.LOW, // Prisma Enum
                        ratio: warehouseClient.low,
                });
        }
        if (warehouseClient.constant !== null) {
                list.push({
                        property_id: propertyId,
                        temperature_type: TemperatureType.CONSTANT, // Prisma Enum
                        ratio: warehouseClient.constant,
                });
        }

        return list;
};

/**
 * 📜 클라이언트 HistoryType 리스트를 DB 저장용 리스트로 매핑합니다.
 */
export function mapClientHistoryListToPrisma(clientList: HistoryType[]): Prisma.HistoryUncheckedCreateInput[] {
        return clientList.map(h => ({
                property_id: h.propertyId,
                // HistoryTypeEnum을 unknown을 거쳐 PrismaHistoryType으로 캐스팅 (이전 수정 유지)
                type: h.type as unknown as PrismaHistoryType,
                year: h.year,
        }));
}

/**
 * 📍 클라이언트 LocationType을 DB 페이로드로 매핑합니다.
 */
export function mapClientLocationToPrisma(clientLocation: LocationType): Partial<PrismaLocation> {
        return {
                address_full: clientLocation.addressFull ?? null,
                address_full_jibun: clientLocation.addressFullJibun ?? null,
                address_province: clientLocation.addressProvince ?? null,
                address_city: clientLocation.addressCity ?? null,
                latitude: clientLocation.latitude ?? null,
                longitude: clientLocation.longitude ?? null,
        };
}

/**
 * 🛣️ 클라이언트 AccessibilityType을 DB 페이로드로 매핑합니다.
 */
export function mapClientAccessibilityToPrisma(clientAccessibility: AccessibilityType): Partial<PrismaAccessibility> {
        return {
                distance_to_ic: clientAccessibility.distanceToIc ?? null,
                time_taken_to_city_hall: clientAccessibility.timeTakenToCityHall ?? null,
                time_taken_to_subway: clientAccessibility.timeTakenToSubway ?? null,
                nearby_facilities: clientAccessibility.nearbyFacilities ?? null,
                nearby_attractions: clientAccessibility.nearbyAttractions ?? null,
                nearby_places: clientAccessibility.nearbyPlaces ?? null,
        };
}

/**
 * 📏 클라이언트 SizesType을 DB Scale 모델 페이로드로 매핑합니다.
 */
export function mapClientSizesToScale(clientSizes: SizesType): Partial<PrismaScale> {
        return {
                site_area_sqm: clientSizes.siteAreaSqm ?? null,
                site_area_py: clientSizes.siteAreaPy ?? null,
                gfa_sqm: clientSizes.gfaSqm ?? null,
                gfa_py: clientSizes.gfaPy ?? null,
                nfa_sqm: clientSizes.nfaSqm ?? null,
                nfa_py: clientSizes.nfaPy ?? null,
                building_coverage_ratio_existing: clientSizes.buildingCoverageRatioExisting ?? null,
                floor_area_ratio_existing: clientSizes.floorAreaRatioExisting ?? null,
                building_coverage_ratio_permitted: clientSizes.buildingCoverageRatioPermitted ?? null,
                floor_area_ratio_permitted: clientSizes.floorAreaRatioPermitted ?? null,
                no_of_buildings: clientSizes.noOfBuildings ?? 0,
                upper_levels: clientSizes.upperLevels ?? 0,
                basement_levels: clientSizes.basementLevels ?? 0,
                gross_leasable_area_sqm: clientSizes.grossLeasableAreaSqm ?? null,
                gross_leasable_area_py: clientSizes.grossLeasableAreaPy ?? null,
                net_leasable_area_sqm: clientSizes.netLeasableAreaSqm ?? null,
                net_leasable_area_py: clientSizes.netLeasableAreaPy ?? null,
                floor_plate_sqm: clientSizes.floorPlateSqm ?? null,
                floor_plate_py: clientSizes.floorPlatePy ?? null,
        };
}

/**
 * 💰 클라이언트 ProfitabilityType을 DB 페이로드로 매핑합니다.
 */
export function mapClientProfitabilityToPrisma(clientProfitability: ProfitabilityType): Partial<PrismaProfitability> {
        return {
                grade: clientProfitability.grade ?? null,
                effective_ratio: clientProfitability.effRatio ?? null,
        };
}

/**
 * 🏗️ 클라이언트 FacilityType을 DB 페이로드로 매핑합니다.
 */
export function mapClientFacilityToPrisma(clientFacility: FacilityType): Partial<PrismaFacility> {
        return {
                // Elevators
                elevators_total: clientFacility.elevators.total ?? 0,
                elevators_passenger: clientFacility.elevators.passenger ?? 0,
                elevators_service: clientFacility.elevators.service ?? 0,
                elevators_freight: clientFacility.elevators.shuttle ?? 0,

                // Parking
                cps_existing: clientFacility.parking.cpsExisting ?? 0,
                cps_required: clientFacility.parking.cpsRequired ?? 0,
                free_cps_sqm: clientFacility.parking.freeCpsSqm ?? null,
                free_cps_py: clientFacility.parking.freeCpsPy ?? null,
                paid_parking_fee: clientFacility.parking.paidParkingFee ?? null,

                // Materials
                roof_material: clientFacility.materials.roofMaterial ?? null,
                facade: clientFacility.materials.facade ?? null,
                mechanical_electrical: clientFacility.materials.mechanicalElectrical ?? null,
                lighting: clientFacility.materials.lighting ?? null,
                fire_fighting: clientFacility.materials.fireFighting ?? null,
        };
}


/**
 * 🏠 클라이언트 FloorPartialType (임차 정보)를 DB 페이로드로 매핑합니다.
 * 이 함수는 Floor의 Nested Write에 사용될 수 있습니다.
 */
export function mapClientFloorPartialToPrisma(clientPartial: FloorPartialType): Prisma.FloorPartialUncheckedCreateInput {
        return {
                floor_id: clientPartial.floorId,
                unit_number: clientPartial.unitNumber ?? null,
                tenant: clientPartial.tenant ?? null,
                lease_area_sqm: clientPartial.leaseAreaSqm ?? null,
                lease_area_py: clientPartial.leaseAreaPy ?? null,
                tenant_equipment: clientPartial.tenantEquipment,
                // 💡 [수정] RoomUseTypeEnum을 unknown을 거쳐 RoomUseType으로 캐스팅
                tenant_use: clientPartial.tenantUse as unknown as RoomUseType ?? null,
                lease_start_date: clientPartial.leaseStartDate ?? null,
                lease_end_date: clientPartial.leaseEndDate ?? null,
                deposit_krw: clientPartial.depositKrw ?? null,
                monthly_rent_per_py: clientPartial.monthlyRentPerPy ?? null,
                monthly_rent: clientPartial.monthlyRent ?? null,
                monthly_management_per_py: clientPartial.monthlyManagementPerPy ?? null,
                monthly_management_fee: clientPartial.monthlyManagementFee ?? null,
                increase_conditions_for_deposit: clientPartial.increaseConditionsForDeposit ?? null,
                increase_conditions_for_rent: clientPartial.increaseConditionsForRent ?? null,
                increase_conditions_for_management_fee: clientPartial.increaseConditionsForManagementFee ?? null,
                rent_free: clientPartial.rentFree ?? null,
                fit_out: clientPartial.fitOut ?? null,
        };
}

/**
 * 🏢 클라이언트 FloorType을 DB 페이로드로 매핑합니다.
 */
export function mapClientFloorToPrisma(clientFloor: FloorType): Partial<PrismaFloorWithPartials> {
        return {
                property_id: clientFloor.propertyId!,
                // 💡 [수정] LevelTypeEnum을 unknown을 거쳐 LevelType으로 캐스팅
                type: clientFloor.type as unknown as LevelType ?? null,
                floor: clientFloor.floor,
                ceiling_height: clientFloor.ceilingHeight ?? null,
                ceiling_height_unit: clientFloor.ceilingHeightUnit ?? null,
                floor_load: clientFloor.floorLoad ?? null,
                floor_load_unit: clientFloor.floorLoadUnit ?? null,
                truck_berths: clientFloor.truckBerths ?? null,
                // 💡 [수정] FloorUseTypeEnum을 unknown을 거쳐 FloorUseType으로 캐스팅
                use: clientFloor.use as unknown as FloorUseType ?? null,
                total_area_sqm: clientFloor.totalAreaSqm ?? null,
                total_area_py: clientFloor.totalAreaPy ?? null,
                gross_leasable_area_sqm: clientFloor.grossLeasableAreaSqm ?? null,
                gross_leasable_area_py: clientFloor.grossLeasableAreaPy ?? null,
                net_leasable_area_sqm: clientFloor.netLeasableAreaSqm ?? null,
                net_leasable_area_py: clientFloor.netLeasableAreaPy ?? null,

                // FloorPartial은 별도의 관계 매핑 로직에서 처리되거나,
                // Prisma의 Nested Write 구조에 맞춰야 하므로 여기서는 필드 매핑만 집중합니다.
        };
}

/**
 * 🏢 클라이언트 FloorType 리스트를 DB Floor 페이로드 리스트로 매핑합니다.
 */
export function mapClientFloorListToPrisma(clientFloors: FloorType[]): Partial<PrismaFloorWithPartials>[] {
        return clientFloors.map(mapClientFloorToPrisma);
}