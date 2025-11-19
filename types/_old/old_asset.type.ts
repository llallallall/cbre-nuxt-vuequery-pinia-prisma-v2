export type AdminListType = {
        no: number //자산번호(임의부여)
        propertyId: string
        propertyName: string
        mainImageUrl: string | null
        grade: string
        sector: string
        subSector: string | null
        addressFull: string | null
        addressProvince: string | null
        addressCity: string | null
        latitude: number | null
        longitude: number | null
}


export type GeneralType = {
        sector: SectorType
        subSector: SubSectorType | null

        warehouse: WarehouseType
}

export type SectorType = {
        id: string
        name: string
}
export type SubSectorType = {
        id: string
        sectorId: string
        name: string
}

export type WarehouseType = {
        room: number | null
        low: number | null
        constant: number | null
}


export type AccessibilityType = {
        distanceToIc: string | null
        timeTakenToCityHall: string | null
        timeTakenToSubway: string | null
        nearbyFacilities: string | null
        nearbyAttractions: string | null
        nearbyPlaces: string | null
}

export type ElevatorsType = {
        total: number
        passenger: number
        service: number
        shuttle: number
}
export type ParkingType = {
        cpsExisting: number
        cpsRequired: number
        freeCpsSqm: number | null
        freeCpsPy: number | null
        paidParkingFee: number | null
}

export type MaterialsType = {
        roofMaterial: string | null
        facade: string | null
        mechanicalElectrical: number | null
        lighting: string | null
        fireFighting: string | null
}

export type FacilityType = {
        elevators: ElevatorsType
        parking: ParkingType
        materials: MaterialsType
}

export type LocationType = {
        // 데이터가 없거나, 아직 검색되지 않았을 때 null일 수 있습니다.
        addressFull: string | null,
        addressFullJibun: string | null,
        addressProvince: string | null,
        addressCity: string | null,

        // latitude, longitude는 null을 허용
        latitude: number | null,
        longitude: number | null
}

export type ProfitabilityType = {
        grade: string
        effRatio: number | null
}

export type SizesType = {
        noOfBuildings: number
        upperLevels: number
        basementLevels: number

        gfaSqm: number | null
        gfaPy: number | null
        nfaSqm: number | null
        nfaPy: number | null
        siteAreaSqm: number | null
        siteAreaPy: number | null
        grossLeasableAreaSqm: number | null
        grossLeasableAreaPy: number | null
        netLeasableAreaSqm: number | null
        netLeasableAreaPy: number | null
        floorAreaRatioExisting: number | null
        floorAreaRatioPermitted: number | null
        buildingCoverageRatioExisting: number | null
        buildingCoverageRatioPermitted: number | null
        floorPlateSqm: number | null
        floorPlatePy: number | null
}

export enum HistoryTypeEnum {
        COMPLETION = 'COMPLETION',
        RENOVATION = 'RENOVATION',
}

export type HistoryType = {
        propertyId: string
        type: HistoryTypeEnum
        year: string
}

export type FloorType = {
        floorId: string
        propertyId: string | null
        type: string | null
        floor: number | null
        ceilingHeight: number | null
        ceilingHeightUnit: string | null
        floorLoad: number | null
        floorLoadUnit: string | null
        truckBerths: number | null
        use: string | null
        totalAreaSqm: number | null
        totalAreaPy: number | null

        // 누락된 리스 가능 면적 필드들 추가
        grossLeasableAreaSqm?: number | null;
        grossLeasableAreaPy?: number | null;
        netLeasableAreaSqm?: number | null;
        netLeasableAreaPy?: number | null;

        // FloorPartial 테이블과의 1:N 관계 데이터
        floorPartial: FloorPartialType[];
}

export type FloorPartialType = {
        id: string;
        floorId: string; // 부모 Floor의 ID
        unitNumber: string | null;
        tenant: string | null;
        leaseAreaSqm: number | null;
        leaseAreaPy: number | null;
        tenantEquipment: boolean;
        tenantUse: string | null; // RoomUseType
        leaseStartDate: Date | null;
        leaseEndDate: Date | null;
        depositKrw: number | null;
        monthlyRentPerPy: number | null;
        monthlyRent: number | null;
        monthlyManagementPerPy: number | null;
        monthlyManagementFee: number | null;
        increaseConditionsForDeposit: string | null;
        increaseConditionsForRent: string | null;
        increaseConditionsForManagementFee: string | null;
        rentFree: string | null;
        fitOut: string | null;
        //     created_at: Date;
        //     updated_at: Date;
}


export type FloorPlanPhotoType = {
        propertyId: string | null
        type: FloorFlanTypeEnum
        floor: number | null
        fileUuid: string | null
        fileName: string | null
        fileKey: string | null
        fileUrl: string | null
        fileContentType: string | null
        isNew?: boolean
        tempFile?: File | null
}

export type EachFloorPhotoType = {
        uppers: FloorPlanPhotoType[]
        basements: FloorPlanPhotoType[]
}

export type FloorPlanPhotoListType = {
        logitudinal: FloorPlanPhotoType[]
        cross: FloorPlanPhotoType[]
        eachFloor: EachFloorPhotoType
}

export enum FloorFlanTypeEnum {
        LOGITUDINALSECTION,
        CROSSSECTION,
        UPPERSECTION,
        BASEMENTSECTION,
}

export type AssetPhotoType = {
        id?: string | null
        propertyId?: string | null
        main: boolean | null
        fileUuid: string | null
        fileName: string | null
        fileKey: string | null
        fileUrl: string | null
        fileContentType: string | null
}

export type FileType = {
        propertyId: string | null
        fileUuid: string | null
        fileName: string | null
        fileKey: string | null
        fileUrl: string | null
        fileContentType: string | null
}

// 1. Transaction 상세 정보를 위한 타입 (DB 필드를 camelCase로 변환)
// 이 타입이 Property의 transactionsList의 각 요소가 됩니다.
export type TransactionInfoType = {
        id: string; // Transaction ID
        propertyId: string;
        type: 'SALE' | 'LEASE'; // TransactionType Enum
        year: string;
        quarter: string | null;
        executionDate: string | null;

        // 이 거래가 SALE이면 여기에 값이 있고, LEASE이면 null/undefined
        saleDetail: SaleDetailType | null;

        // 이 거래가 LEASE이면 여기에 값이 있고, SALE이면 null/undefined
        leaseDetail: LeaseDetailType | null;
}

export type SaleInfoType = {
        totalSales: number | null;
        totalEnblocSales: number | null;
        totalPartialSales: number | null;
        salesList: SaleDetailType[]; // 💡 개별 매매 리스트 포함
}

export type LeaseInfoType = {
        totalLeasesAsking: number | null;
        totalLeasesActual: number | null;
        leasesAskingList: LeaseDetailType[]
        leasesActualList: LeaseDetailType[]
}


export type SaleTypeEnum = 'ENBLOC' | 'PARTIAL';

// Sale 모델의 상세 정보
export type SaleDetailType = {
        saleId: string;
        transactionId: string | null;
        saleType: SaleTypeEnum | null; // SaleType Enum
        gfaSqm: number | null; // gfa_sqm (Float?)
        nfaSqm: number | null; // nfa_sqm (Float?)
        priceKrw: number | null; // price_krw (Int?)
        pricePerGfa: number | null; // price_per_gfa (Int?)
        pricePerNfa: number | null; // price_per_nfa (Int?)
        estCapRate: number | null; // est_cap_rate (Float?)
        estDiscountRate: number | null; // est_discount_rate (Float?)
        buyer: string | null; // buyer (String?)
        seller: string | null; // seller (String?)
        remarks: string | null; // remarks (String?)

}

// ************************
// 1. Lease 관련 Enums
// ************************

export type LeaseTypeEnum = 'ASKING' | 'ACTUAL';
export type RentFreeTypeEnum = 'PerYear' | 'PerTerm';

// ************************
// 2. Lease 상세 데이터 타입 (프론트엔드에서 사용, camelCase)
// ************************
export type LeaseDetailType = {
        leaseId: string;
        transactionId: string | null;
        leaseType: 'ASKING' | 'ACTUAL' | null; // LeaseType Enum
        floor: string | null; // floor (String?)
        unit: string | null; // unit (String?)
        gfaSqm: number | null; // gfa_sqm (Float?)
        gfaPy: number | null; // gfa_py (Float?)
        nfaSqm: number | null; // nfa_sqm (Float?)
        nfaPy: number | null; // nfa_py (Float?)
        effRatio: number | null; // eff_ratio (Float?)
        monthlyRent: number | null; // monthly_rent (Int?)
        monthlyCamf: number | null; // monthly_camf (Int?)
        deposit: number | null; // deposit (Int?)
        rentMonthlyPy: number | null; // rent_monthly_py (Int?)
        camfMonthlyPy: number | null; // camf_monthly_py (Int?)
        depositPy: number | null; // deposit_py (Int?)
        iod: number | null; // iod (Float?)
        gdm: number | null; // gdm (Float?)
        noc: number | null; // noc (Float?)

        leaseTermYear: number | null; // lease_term_year (Int?)
        leaseStartDate: string | null; // lease_start_date (DateTime?)
        leaseEndDate: string | null; // lease_end_date (DateTime?)

        rentFreeType: 'PerYear' | 'PerTerm' | null; // RentFreeType Enum
        rentFreeMonth: number | null; // rent_free_month (Int?)
        effectiveNoc: number | null; // effective_noc (Float?)
        fitOut: number | null; // fit_out (Int?)
        tiAmountKrw: number | null; // ti_amount_krw (Float?)
        tiAmountNfaPy: number | null; // ti_amount_nfa_py (Float?)
        totalFreeRentPeriodMonth: number | null; // total_free_rent_period_month (Int?)
        totalOccupyingPeriodYear: number | null; // total_occupying_period_year (Float?)
        totalFreeRentOccupyingYear: number | null; // total_free_rent_occupying_year (Float?)
        monthlyCashSupportGfa: number | null; // monthly_cash_support_gfa (Float?)
        allInEffectiveRentMonthlyPy: number | null; // all_in_effective_rent_monthly_py (Float?)
        allInNoc: number | null; // all_in_noc (Float?)
}


// -------------------------------------------------------------

/**
 * 1. Transaction 테이블의 공통 필수 필드 (API Payload의 기본 구성 요소)
 * - Property ID와 type(LEASE)은 URL/로직에서 처리되므로, Payload에서는 제외합니다.
 */
export type TransactionBasePayload = {
        year: string;
        // API 통신을 위해 Date 또는 string (YYYY-MM-DD 등) 타입을 허용합니다.
        executionDate: Date | string;
        quarter: string;
};


// -------------------------------------------------------------

/**
 * 2. Sale 레코드 생성/수정 시 API에 전송하는 최종 Payload 타입
 * (TransactionBasePayload + SaleDetailType의 모든 필드 합침)
 * * - Omit<SaleDetailType, ...>를 사용하여 기존 상세 정보를 재활용합니다.
 */
export type SaleCreatePayload = TransactionBasePayload & Omit<SaleDetailType, 'transactionId' | 'saleType'> & {
        // PUT 요청 시 사용되는 Transaction ID를 선택적 필드로 추가합니다. (POST 시에는 없음)
        transactionId?: string;
        saleId?: string;
        // saleType은 생성/수정 시 필수적으로 명시해야 하므로 Non-null 타입으로 재정의합니다.
        saleType: SaleTypeEnum;
        // remarks 필드를 string으로 강제합니다. (v-model 호환)
        remarks: string;
};
// -------------------------------------------------------------

/**
 * 3. Lease 레코드 생성/수정 시 API에 전송하는 최종 Payload 타입
 * (TransactionBasePayload + LeaseDetailType의 모든 필드 합침)
 * * - Omit<LeaseDetailType, ...>를 사용하여 기존 타입의 필드를 재사용합니다.
 * - DB 필드가 모두 camelCase로 변환되어 있다고 가정합니다.
 */
export type LeaseCreatePayload = TransactionBasePayload & Omit<LeaseDetailType, 'transactionId' | 'leaseType' | 'rentFreeType'> & {
        // PUT 요청 시 사용되는 Transaction ID를 선택적 필드로 추가합니다. (POST 시에는 없음)
        transactionId?: string;

        // leaseType은 생성/수정 시 필수적으로 명시해야 하므로 Non-null 타입으로 재정의합니다.
        leaseType: LeaseTypeEnum;

        // RentFreeType도 Enum 타입으로 재정의합니다.
        rentFreeType: RentFreeTypeEnum | null;
};


// Lease 모델의 DB 구조 (snake_case, 날짜는 string)
export interface ApiLeaseDetail {
        id: string;
        transaction_id: string | null;

        lease_type: 'ASKING' | 'ACTUAL' | null;
        floor: string | null;
        unit: string | null;

        lease_start_date: string | null;
        lease_end_date: string | null;

        gfa_sqm: number | null;
        gfa_py: number | null;
        nfa_sqm: number | null;
        nfa_py: number | null;
        eff_ratio: number | null;
        monthly_rent: number | null;
        monthly_camf: number | null;
        deposit: number | null;
        rent_monthly_py: number | null;
        camf_monthly_py: number | null;
        deposit_py: number | null;
        iod: number | null;
        gdm: number | null;
        noc: number | null;

        lease_term_year: number | null;
        rent_free_type: 'PerYear' | 'PerTerm' | null;
        rent_free_month: number | null;
        effective_noc: number | null;
        fit_out: number | null;
        ti_amount_krw: number | null;
        ti_amount_nfa_py: number | null;
        total_free_rent_period_month: number | null;
        total_occupying_period_year: number | null;
        total_free_rent_occupying_year: number | null;
        monthly_cash_support_gfa: number | null;
        all_in_effective_rent_monthly_py: number | null;
        all_in_noc: number | null;
}

// Sale 모델의 DB 구조 (schema.prisma 기반) 💡 신규 추가
export interface ApiSaleDetail {
        id: string;
        transaction_id: string | null;
        sale_type: SaleTypeEnum | null;
        gfa_sqm: number | null;
        nfa_sqm: number | null;
        price_krw: number | null;
        price_per_gfa: number | null;
        price_per_nfa: number | null;
        est_cap_rate: number | null;
        est_discount_rate: number | null;
        buyer: string | null;
        seller: string | null;
        remarks: string | null;
}



export type CbreAsset = {

        propertyId: string
        propertyName: string

        general: GeneralType
        accessibility: AccessibilityType
        facility: FacilityType
        location: LocationType
        profitability: ProfitabilityType
        sizes: SizesType
        historyList: HistoryType[]
        floorList: FloorType[]
        floorPlanPhotoList: FloorPlanPhotoListType
        photoList: AssetPhotoType[]
        brochureList: FileType[]

        transactionInfo: {
                totalTransactions: number | null
                transactionsList: TransactionInfoType[]
        }

        saleInfo?: SaleInfoType // 💡 Sale Info 블록 추가

        leaseInfo?: LeaseInfoType
}

export type MapDataPropertyType = {
        propertyId: string | null
        sector: string | null
        subSector: string | null
        propertyName: string | null
        mainImageUrl: string | null
        province: string | null
        city: string | null
        grade: string | null
        effRatio: number | null
}

export type MapDataGeometryType = {
        type: string
        coordinates: number[]

}

export type MapDataFeaturesType = {
        type: string
        geometry: MapDataGeometryType
        properties: MapDataPropertyType
}

export type MapDataType = {
        type: string
        features: MapDataFeaturesType[]
}

interface FloorPlanPhotoProps {
        // property_id : string
        type: string
        type_index: number,
        fileUuid: string | null
        fileType: string | null
        fileName: string | null
        fileKey: string | null
        fileUrl: string | null
        thumbFileName: string | null
        thumbFileUrl: string | null
        compressedFileName: string | null
        compressedFileUrl: string | null
}



export interface UploadResult {
        fileKey: string;
        fileUrl: string;
}



export type FloorObj = {
        floorType: string
        num: number
        ceilingHeight: number
        ceilingHeightUnit: string
        floorLoad: number
        floorLoadUnit: string
        truckBerths: number
        use: string
        totalAreaSqm: number
        totalAreaPy: number

}

export type ImageFile = {
        date: string
        fileId: number
        fileName: string
        fileSize: number
        fileUuid: string
        groupUuid: string
        image: string
        thumb: string
        type: string
}

export type Leases = {
        actualCnt: number
        askingCnt: number
        leases: LeaseObj[]
        leasesActual: LeaseActualObj[]
        leasesAsking: LeaseAskingObj[]
        total: number
}

export type LeaseObj = {
        actualAllInEffectiveRentMthPy: number
        actualAllInNoc: number
        actualCamfMthPy: number
        actualDeposit: number
        actualDepositPy: number
        actualEffRatio: number
        actualEffectiveNoc: number
        actualFitOut: number
        actualFloor: string
        actualGdm: number
        actualGfaPy: number
        actualGfaSqm: number
        actualIod: number
        actualLeaseStartDate: string
        actualLeaseTermYear: number
        actualMonthlyCAMF: number
        actualMonthlyCashSupportGfa: number
        actualMonthlyRent: number
        actualNfaPy: number
        actualNfaSqm: number
        actualNoc: number
        actualRentFreeMth: number
        actualRentFreeType: string
        actualRentMthPy: number
        actualTIAmountKrw: number
        actualTIAmountNfaPy: number
        actualTotalFreeRentOccupyingYear: number
        actualTotalFreeRentPeriodMth: number
        actualTotalOccupyingPeriodYear: number
        actualUnit: string
        askingAllInEffectiveRentMthPy: number
        askingAllInNoc: number
        askingCamfMthPy: number
        askingDeposit: number
        askingDepositPy: number
        askingEffRatio: number
        askingFitOut: number
        askingFloor: string
        askingGdm: number
        askingGfaPy: number
        askingGfaSqm: number
        askingIod: number
        askingLeaseTermYear: number
        askingMonthlyCAMF: number
        askingMonthlyCashSupportGfa: number
        askingMonthlyRent: number
        askingMoveInDate: string
        askingNfaPy: number
        askingNfaSqm: number
        askingNoc: number
        askingRentFreeMth: number
        askingRentFreeType: string
        askingRentMthPy: number
        askingTIAmountKrw: number
        askingTIAmountNfaPy: number
        askingTotalFreeRentOccupyingYear: number
        askingTotalFreeRentPeriodMth: number
        askingTotalOccupyingPeriodYear: number
        askingUnit: string
        leaseIdx: number
}

export type LeaseAskingObj = {
        askingAllInEffectiveRentMthPy: number
        askingAllInNoc: number
        askingCamfMthPy: number
        askingDeposit: number
        askingDepositPy: number
        askingEffRatio: number
        askingFitOut: number
        askingFloor: string
        askingGdm: number
        askingGfaPy: number
        askingGfaSqm: number
        askingIod: number
        askingLeaseTermYear: number
        askingMonthlyCAMF: number
        askingMonthlyCashSupportGfa: number
        askingMonthlyRent: number
        askingMoveInDate: string
        askingNfaPy: number
        askingNfaSqm: number
        askingNoc: number
        askingRentFreeMth: number
        askingRentFreeType: string
        askingRentMthPy: number
        askingTIAmountKrw: number
        askingTIAmountNfaPy: number
        askingTotalFreeRentOccupyingYear: number
        askingTotalFreeRentPeriodMth: number
        askingTotalOccupyingPeriodYear: number
        askingUnit: string
        leaseIdx: number
}

export type LeaseActualObj = {
        actualAllInEffectiveRentMthPy: number
        actualAllInNoc: number
        actualCamfMthPy: number
        actualDeposit: number
        actualDepositPy: number
        actualEffRatio: number
        actualEffectiveNoc: number
        actualFitOut: number
        actualFloor: string
        actualGdm: number
        actualGfaPy: number
        actualGfaSqm: number
        actualIod: number
        actualLeaseStartDate: string
        actualLeaseTermYear: number
        actualMonthlyCAMF: number
        actualMonthlyCashSupportGfa: number
        actualMonthlyRent: number
        actualNfaPy: number
        actualNfaSqm: number
        actualNoc: number
        actualRentFreeMth: number
        actualRentFreeType: string
        actualRentMthPy: number
        actualTIAmountKrw: number
        actualTIAmountNfaPy: number
        actualTotalFreeRentOccupyingYear: number
        actualTotalFreeRentPeriodMth: number
        actualTotalOccupyingPeriodYear: number
        actualUnit: string
        leaseIdx: number
}

export type Sales = {
        total: number
        transactions: SaleObj[]
}

export type SaleObj = {
        buyer: string
        estCapRate: number
        estDiscountRate: number
        gfaSqm: number
        nfaSqm: number
        priceKrw: number
        pricePerGfa: number
        pricePerNfa: number
        remarks: any
        seller: string
        transactionIdx: number
        transactionQuarter: string
        transactionType: string
        transactionYear: string
}

// =======================================================
// Floor & FloorPartial Types (Used by Floor.vue and API)
// =======================================================
// 1. Prisma Enum 정의 (프론트엔드 사용용)
export enum LevelTypeEnum {
        UPPER = 'UPPER',
        BASEMENT = 'BASEMENT',
}

export enum FloorUseTypeEnum {
        ROOM = 'ROOM',
        OFFICE = 'OFFICE',
        LOW = 'LOW',
        CONSTANT = 'CONSTANT',
}

export enum RoomUseTypeEnum {
        DRY = 'DRY',
        COLD = 'COLD',
        OFFICE = 'OFFICE',
        OTHERS = 'OTHERS',
}

// 2. FloorPartial 폼 타입 (Floor.vue에서 사용)
// 기존 FloorPartialType을 기반으로 하면서 UI/로직 필드 추가 (ex: Display 필드)
export interface FloorPartialForm {
        id?: string; // DB ID (업데이트용)
        // floorId: string; // 불필요 (FloorForm 안에 있으므로)
        unitNumber: string | null;
        tenant: string | null;
        leaseAreaSqm: number | null;
        leaseAreaPy: number | null;
        tenantEquipment: boolean;
        tenantUse: RoomUseTypeEnum | null; // Enum 적용

        // DB 저장용 값 (Date 객체 또는 Date String)
        leaseStartDate: Date | string | null;
        leaseEndDate: Date | string | null;

        // UI 표시용 값 (formatDateInput에서 사용)
        leaseStartDateDisplay: string | null;
        leaseEndDateDisplay: string | null;

        depositKrw: number | null;
        monthlyRentPerPy: number | null;
        monthlyRent: number | null;
        monthlyManagementPerPy: number | null;
        monthlyManagementFee: number | null;
        increaseConditionsForDeposit: string | null;
        increaseConditionsForRent: string | null;
        increaseConditionsForManagementFee: string | null;
        rentFree: string | null;
        fitOut: string | null;
}

// 3. Floor 폼 타입 (Floor.vue에서 사용)
export interface FloorForm {
        id?: string; // DB ID (업데이트용)
        floorId: string; // Vue 내부 임시 ID
        isNew: boolean;

        type: LevelTypeEnum; // Enum 적용
        floor: number;

        ceilingHeight: number | null;
        ceilingHeightUnit: string | null;
        floorLoad: number | null;
        floorLoadUnit: string | null;
        truckBerths: number | null;
        use: FloorUseTypeEnum | null; // Enum 적용

        totalAreaSqm: number | null;
        totalAreaPy: number | null;
        grossLeasableAreaSqm: number | null;
        grossLeasableAreaPy: number | null;
        netLeasableAreaSqm: number | null;
        netLeasableAreaPy: number | null;

        floorPartial: FloorPartialForm[];
}

// 4. API FloorPartial 페이로드 타입 (floor.put.ts에서 사용, snake_case)
// DB에 직접 전달되는 구조
export interface FloorPartialPayload {
        id?: string;
        unit_number?: string | null;
        tenant?: string | null;
        lease_area_sqm?: number | null;
        lease_area_py?: number | null;
        tenant_equipment?: boolean;
        tenant_use?: RoomUseTypeEnum | null;
        lease_start_date?: Date | null; // Date 객체로 전송
        lease_end_date?: Date | null; // Date 객체로 전송
        deposit_krw?: number | null;
        monthly_rent_per_py?: number | null;
        monthly_rent?: number | null;
        monthly_management_per_py?: number | null;
        monthly_management_fee?: number | null;
        increase_conditions_for_deposit?: string | null;
        increase_conditions_for_rent?: string | null;
        increase_conditions_for_management_fee?: string | null;
        rent_free?: string | null;
        fit_out?: string | null;
}

// 5. API Floor 페이로드 타입 (floor.put.ts에서 사용, snake_case)
export interface FloorPayload {
        id?: string;
        property_id?: string;
        type?: LevelTypeEnum | null;
        floor?: number | null;

        ceiling_height?: number | null;
        ceiling_height_unit?: string | null;
        floor_load?: number | null;
        floor_load_unit?: string | null;
        truck_berths?: number | null;
        use?: FloorUseTypeEnum | null;
        total_area_sqm?: number | null;
        total_area_py?: number | null;
        gross_leasable_area_sqm?: number | null;
        gross_leasable_area_py?: number | null;
        net_leasable_area_sqm?: number | null;
        net_leasable_area_py?: number | null;

        floorPartial: FloorPartialPayload[];
}