// =======================================================
// 1. Enums 및 공통 상수 타입
// =======================================================

/** 거래 유형 (DB: SaleType) */
export type SaleTypeEnum = 'ENBLOC' | 'PARTIAL';

/** 임대 거래 유형 (DB: LeaseType) */
export type LeaseTypeEnum = 'ASKING' | 'ACTUAL';

/** 렌트 프리 조건 유형 (DB: RentFreeType) */
export type RentFreeTypeEnum = 'PerYear' | 'PerTerm';

/** 자산 History 기록 유형 (DB: HistoryType) */
export enum HistoryTypeEnum {
        COMPLETION = 'COMPLETION',
        RENOVATION = 'RENOVATION',
}

/** 층별 섹션 유형 (플로어 플랜 파일 분류에 사용) */
export enum FloorFlanTypeEnum {
        LOGITUDINALSECTION, // 종단면
        CROSSSECTION, // 횡단면
        UPPERSECTION,
        BASEMENTSECTION,
}

// =======================================================
// 2. 자산 기본 정보 및 상세 타입 (Client Read View - camelCase)
// =======================================================

/** 자산 관리자 목록 조회 시 사용되는 요약 타입 */
export type AdminListType = {
        no: number // 자산번호(임의부여)
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

/** 자산의 전체 정보 */
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


/** 자산의 일반 정보 */
export type GeneralType = {
        sector: SectorType
        subSector: SubSectorType | null
        warehouse: WarehouseType
}

/** 자산 섹터 (용도) 정보 */
export type SectorType = {
        id: string
        name: string
}
export type SubSectorType = {
        id: string
        sectorId: string
        name: string
}

/** 창고 관련 상세 정보 */
export type WarehouseType = {
        room: number | null
        low: number | null
        constant: number | null
}

/** 자산의 입지 및 위치 정보 */
export type LocationType = {
        addressFull: string | null,
        addressFullJibun: string | null,
        addressProvince: string | null,
        addressCity: string | null,
        latitude: number | null,
        longitude: number | null
}

/** 자산의 접근성 정보 */
export type AccessibilityType = {
        distanceToIc: string | null
        timeTakenToCityHall: string | null
        timeTakenToSubway: string | null
        nearbyFacilities: string | null
        nearbyAttractions: string | null
        nearbyPlaces: string | null
}

/** 자산의 수익성 및 등급 정보 */
export type ProfitabilityType = {
        grade: string
        effRatio: number | null
}

/** 자산의 규모 및 면적 정보 */
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

/** 시설물 정보 (엘리베이터, 주차, 자재) */
export type FacilityType = {
        elevators: ElevatorsType
        parking: ParkingType
        materials: MaterialsType
}

/** 엘리베이터 상세 정보 */
export type ElevatorsType = {
        total: number
        passenger: number
        service: number
        shuttle: number
}
/** 주차 상세 정보 */
export type ParkingType = {
        cpsExisting: number
        cpsRequired: number
        freeCpsSqm: number | null
        freeCpsPy: number | null
        paidParkingFee: number | null
}
/** 자재 및 설비 상세 정보 */
export type MaterialsType = {
        roofMaterial: string | null
        facade: string | null
        mechanicalElectrical: number | null
        lighting: string | null
        fireFighting: string | null
}

/** 히스토리 기록 */
export type HistoryType = {
        propertyId: string
        type: HistoryTypeEnum
        year: string
}

// =======================================================
// 3. 층별 상세 정보 (Floor & Partial)
// =======================================================

/** 층별 정보 (Floor 모델 기반, DB에서 조회 시) */
export type FloorType = {
        floorId: string
        propertyId: string | null
        type: string | null // LevelTypeEnum
        floor: number | null
        ceilingHeight: number | null
        ceilingHeightUnit: string | null
        floorLoad: number | null
        floorLoadUnit: string | null
        truckBerths: number | null
        use: string | null
        totalAreaSqm: number | null
        totalAreaPy: number | null
        grossLeasableAreaSqm?: number | null;
        grossLeasableAreaPy?: number | null;
        netLeasableAreaSqm?: number | null;
        netLeasableAreaPy?: number | null;

        // FloorPartial 테이블과의 1:N 관계 데이터
        floorPartial: FloorPartialType[];
}

/** 층별 유닛 임대 상세 정보 (FloorPartial 모델 기반, DB에서 조회 시) */
export type FloorPartialType = {
        id: string;
        floorId: string; // 부모 Floor의 ID
        unitNumber: string | null;
        tenant: string | null;
        leaseAreaSqm: number | null;
        leaseAreaPy: number | null;
        tenantEquipment: boolean;
        tenantUse: string | null; // RoomUseType
        leaseStartDate: Date | null; // 💡 DB에서 조회 시 Date 객체
        leaseEndDate: Date | null; // 💡 DB에서 조회 시 Date 객체
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

// =======================================================
// 4. 파일 및 사진 타입
// =======================================================

/** 자산 사진 기본 타입 */
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

/** 일반 첨부 파일 타입 (브로슈어 등) */
export type FileType = {
        propertyId: string | null
        fileUuid: string | null
        fileName: string | null
        fileKey: string | null
        fileUrl: string | null
        fileContentType: string | null
}

/** 플로어 플랜 사진 메타데이터 */
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

/** 층별 플로어 플랜 분류 */
export type EachFloorPhotoType = {
        uppers: FloorPlanPhotoType[]
        basements: FloorPlanPhotoType[]
}

/** 플로어 플랜 리스트 (단면/층별 분류) */
export type FloorPlanPhotoListType = {
        logitudinal: FloorPlanPhotoType[]
        cross: FloorPlanPhotoType[]
        eachFloor: EachFloorPhotoType
}


// =======================================================
// 5. Transaction 및 Payload Types (Client View & API Payload)
// =======================================================

/** API 요청 페이로드의 공통 Transaction 필드 */
export type TransactionBasePayload = {
        year: string;
        quarter: string;
        executionDate: string | null; // 클라이언트 폼은 string으로 관리
}

/** Sale 모델의 상세 정보 (camelCase, DB에서 조회 시) */
export type SaleDetailType = {
        saleId: string;
        transactionId: string | null;
        saleType: SaleTypeEnum | null;
        gfaSqm: number | null;
        nfaSqm: number | null;
        priceKrw: number | null;
        pricePerGfa: number | null;
        pricePerNfa: number | null;
        estCapRate: number | null;
        estDiscountRate: number | null;
        buyer: string | null;
        seller: string | null;
        remarks: string | null;
}

/** Lease 모델의 상세 정보 (camelCase, DB에서 조회 시) */
export type LeaseDetailType = {
        leaseId: string;
        transactionId: string | null;
        leaseType: LeaseTypeEnum | null; // LeaseType Enum
        floor: string | null;
        unit: string | null;

        leaseStartDate: string | null;
        leaseEndDate: string | null;

        gfaSqm: number | null;
        gfaPy: number | null;
        nfaSqm: number | null;
        nfaPy: number | null;
        effRatio: number | null;
        monthlyRent: number | null;
        monthlyCamf: number | null;
        deposit: number | null;
        rentMonthlyPy: number | null;
        camfMonthlyPy: number | null;
        depositPy: number | null;
        iod: number | null;
        gdm: number | null;
        noc: number | null;
        leaseTermYear: number | null;
        rentFreeType: RentFreeTypeEnum | null;
        rentFreeMonth: number | null;
        effectiveNoc: number | null;
        fitOut: number | null;
        tiAmountKrw: number | null;
        tiAmountNfaPy: number | null;
        totalFreeRentPeriodMonth: number | null;
        totalOccupyingPeriodYear: number | null;
        totalFreeRentOccupyingYear: number | null;
        monthlyCashSupportGfa: number | null;
        allInEffectiveRentMonthlyPy: number | null;
        allInNoc: number | null;
}

/**
 * 📝 Lease 생성/수정 요청 시 서버로 전송되는 최종 페이로드 타입
 * (LeaseDetailType의 무결성을 지키기 위해 별도 정의)
 * 이전에 논의된 최종 구조를 반영함.
 */
export type LeaseCreatePayload = TransactionBasePayload & Omit<LeaseDetailType, 'transactionId' | 'leaseType' | 'rentFreeType'> & {
        /** PUT 요청 시 사용되는 Transaction ID (POST 시에는 없음) */
        transactionId?: string;

        /** leaseType은 생성/수정 시 필수적으로 명시해야 함 */
        leaseType: LeaseTypeEnum;

        /** RentFreeType도 Enum 타입으로 재정의 */
        rentFreeType: RentFreeTypeEnum | null;
};


/** Property 조회 시 반환되는 Transaction 리스트의 각 요소 */
export type TransactionInfoType = {
        id: string; // Transaction ID
        propertyId: string;
        type: 'SALE' | 'LEASE'; // TransactionType Enum
        year: string;
        quarter: string | null;
        executionDate: string | null; // DB Date가 매퍼를 통해 string으로 변환됨

        saleDetail: SaleDetailType | null;
        leaseDetail: LeaseDetailType | null;
}

/** 매매 트랜잭션 요약 정보 */
export type SaleInfoType = {
        totalSales: number | null;
        totalEnblocSales: number | null;
        totalPartialSales: number | null;
        salesList: SaleDetailType[]; // 개별 매매 리스트 포함
}

/** 임대 트랜잭션 요약 정보 */
export type LeaseInfoType = {
        totalLeasesAsking: number | null;
        totalLeasesActual: number | null;
        leasesAskingList: LeaseDetailType[]
        leasesActualList: LeaseDetailType[]
}

// =======================================================
// 6. API/DB 모델 타입 (snake_case)
//    (서버 통신을 위한 DB 스키마 형태)
// =======================================================

/** Lease 모델의 DB 구조 (snake_case, API 응답 시 사용) */
export interface ApiLeaseDetail {
        id: string;
        transaction_id: string | null;
        lease_type: LeaseTypeEnum | null;
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
        rent_free_type: RentFreeTypeEnum | null;
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

/** Sale 모델의 DB 구조 (snake_case, API 응답 시 사용) */
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

/** API Floor Partial 페이로드 타입 (서버에서 사용, snake_case) */
export interface FloorPartialPayload {
        id?: string;
        floor_id?: string; // 부모 Floor의 ID
        unit_number?: string | null;
        tenant?: string | null;
        lease_area_sqm?: number | null;
        lease_area_py?: number | null;
        tenant_equipment?: boolean;
        tenant_use?: string | null; // RoomUseTypeEnum
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

/** API Floor 페이로드 타입 (서버에서 사용, snake_case) */
export interface FloorPayload {
        id?: string;
        property_id?: string;
        type?: string | null; // LevelTypeEnum
        floor?: number | null;

        ceiling_height?: number | null;
        ceiling_height_unit?: string | null;
        floor_load?: number | null;
        floor_load_unit?: string | null;
        truck_berths?: number | null;
        use?: string | null; // FloorUseTypeEnum
        total_area_sqm?: number | null;
        total_area_py?: number | null;
        gross_leasable_area_sqm?: number | null;
        gross_leasable_area_py?: number | null;
        net_leasable_area_sqm?: number | null;
        net_leasable_area_py?: number | null;
}


// =======================================================
// 7. 잠재적 미사용 타입 (레거시 또는 미사용 구조 추정)
// =======================================================

/** [미사용 추정] DB 또는 레거시 API 응답에서 사용되었을 수 있는 이미지 파일 메타데이터 */
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

/** [미사용 추정] 복잡한 중첩 구조를 가진 임대 트랜잭션 요약 */
export type Leases = {
        actualCnt: number
        askingCnt: number
        leases: LeaseObj[]
        leasesActual: LeaseActualObj[]
        leasesAsking: LeaseAskingObj[]
        total: number
}

/** [미사용 추정] 단일 임대 객체 (복잡한 필드명, LeaseDetailType으로 대체 가능성 높음) */
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
        askingMonthlyRent: number
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
        // ... 필드 정의가 누락된 부분이 있으나 원본 파일에 존재함
}

/** [미사용 추정] 실제 임대 객체 (LeaseObj의 Actual 필드만 포함하는 것으로 추정) */
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

/** [미사용 추정] 요구 임대 객체 (LeaseObj의 Asking 필드만 포함하는 것으로 추정) */
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

// =======================================================
// 8. 기타 Enum 정의 (다른 파일에서 사용될 수 있으므로 유지)
// =======================================================

/** [기타 Enum] 층별 타입 */
export enum LevelTypeEnum {
        UPPER = 'UPPER',
        BASEMENT = 'BASEMENT',
}

/** [기타 Enum] 층 사용 타입 */
export enum FloorUseTypeEnum {
        ROOM = 'ROOM',
        OFFICE = 'OFFICE',
        LOW = 'LOW',
        CONSTANT = 'CONSTANT',
}

/** [기타 Enum] 방 사용 타입 */
export enum RoomUseTypeEnum {
        DRY = 'DRY',
        COLD = 'COLD',
        OFFICE = 'OFFICE',
        OTHERS = 'OTHERS',
}