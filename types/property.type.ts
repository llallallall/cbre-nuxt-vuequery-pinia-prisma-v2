/**
 * 파일명: property.type.ts
 * 설명: DB 모델 (model Property)을 기반으로 정의된 TypeScript 타입 정의 파일입니다.
 * 모든 필드는 Prisma Client 표준인 camelCase를 따르며, 백엔드와의 자동 매핑을 지원합니다.
 *
 * 목적: 코드의 일관성과 유지보수성 극대화 (Asset -> Property 명칭 통일)
 */

// ----------------------------------------------------------------------
// --- 1. ENUM 타입 정의 ---
// ----------------------------------------------------------------------

// 사용자 권한 ENUM
export type RoleEnum = 'USER' | 'ADMIN' | 'DEVELOPER';

// 창고 온도 유형 ENUM
export type TemperatureTypeEnum = 'ROOM' | 'LOW' | 'CONSTANT';

// 이력 유형 ENUM
export type HistoryTypeEnum = 'COMPLETION' | 'RENOVATION';

// 층 유형 ENUM (LevelType)
export type LevelTypeEnum = 'UPPER' | 'BASEMENT';

// 층 사용 용도 ENUM (FloorUseType)
export type FloorUseTypeEnum = 'ROOM' | 'OFFICE' | 'LOW' | 'CONSTANT';

// 호실 사용 용도 ENUM (RoomUseType)
export type RoomUseTypeEnum = 'DRY' | 'COLD' | 'OFFICE' | 'OTHERS';

// 평면도 유형 ENUM (FloorFlanType)
export type FloorFlanTypeEnum = 'LOGITUDINALSECTION' | 'CROSSSECTION' | 'UPPERSECTION' | 'BASEMENTSECTION';

// 거래 유형 ENUM (TransactionType)
export type TransactionTypeEnum = 'SALE' | 'LEASE';

// 매매 유형 ENUM (SaleType)
export type SaleTypeEnum = 'ENBLOC' | 'PARTIAL';

// 임대 유형 ENUM (LeaseType)
export type LeaseTypeEnum = 'ASKING' | 'ACTUAL';

// 렌트프리 유형 ENUM (RentFreeType)
export type RentFreeTypeEnum = 'PerYear' | 'PerTerm';

// ----------------------------------------------------------------------
// --- 2. 기본 엔티티 타입 정의 (Detailed Types) ---
// ----------------------------------------------------------------------

// 섹터 (Sector)
export interface SectorType {
        id: string;
        name: string;
}

// 서브섹터 (SubSector)
export interface SubSectorType {
        id: string;
        sectorId: string;
        name: string;
}

// 물류 창고 온도 유형별 정보 (Warehouse)
export interface WarehouseType {
        id: string;
        propertyId: string;
        temperatureType: TemperatureTypeEnum;
        ratio: number | null;
        createdAt: Date;
        updatedAt: Date;
}

// 위치 정보 (Location)
export interface LocationType {
        id: string;
        propertyId: string;
        addressFull: string | null;
        addressFullJibun: string | null;
        addressProvince: string | null;
        addressCity: string | null;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
}

// 규모 정보 (Scale)
export interface ScaleType {
        id: string;
        propertyId: string;
        noOfBuildings: number;
        upperLevels: number;
        basementLevels: number;
        gfaSqm: number | null;
        gfaPy: number | null;
        nfaSqm: number | null;
        nfaPy: number | null;
        siteAreaSqm: number | null;
        siteAreaPy: number | null;
        grossLeasableAreaSqm: number | null;
        grossLeasableAreaPy: number | null;
        netLeasableAreaSqm: number | null;
        netLeasableAreaPy: number | null;
        floorAreaRatioExisting: number | null;
        floorAreaRatioPermitted: number | null;
        buildingCoverageRatioExisting: number | null;
        buildingCoverageRatioPermitted: number | null;
        floorPlateSqm: number | null;
        floorPlatePy: number | null;
        createdAt: Date;
        updatedAt: Date;
}

// 시설 정보 (Facility)
export interface FacilityType {
        id: string;
        propertyId: string;
        elevatorsTotal: number;
        elevatorsPassenger: number;
        elevatorsService: number;
        elevatorsFreight: number;
        cpsExisting: number;
        cpsRequired: number;
        freeCpsSqm: number | null;
        freeCpsPy: number | null;
        paidParkingFee: number | null;
        roofMaterial: string | null;
        facade: string | null;
        mechanicalElectrical: number | null;
        lighting: string | null;
        fireFighting: string | null;
        createdAt: Date;
        updatedAt: Date;
}

// 접근성 정보 (Accessibility)
export interface AccessibilityType {
        id: string;
        propertyId: string;
        distanceToIc: string | null;
        timeTakenToCityHall: string | null;
        timeTakenToSubway: string | null;
        nearbyFacilities: string | null;
        nearbyAttractions: string | null;
        nearbyPlaces: string | null;
        createdAt: Date;
        updatedAt: Date;
}

// 수익성 정보 (Profitability)
export interface ProfitabilityType {
        id: string;
        propertyId: string;
        grade: string | null;
        effectiveRatio: number | null;
        createdAt: Date;
        updatedAt: Date;
}

// 자산 변경 이력 (History)
export interface HistoryType {
        id: string;
        propertyId: string;
        year: string;
        type: HistoryTypeEnum;
        createdAt: Date;
        updatedAt: Date;
}

// 임차 호실 상세 정보 (Floor Partial)
export interface FloorPartialType {
        id: string;
        floorId: string;
        unitNumber: string | null;
        tenant: string | null;
        leaseAreaSqm: number | null;
        leaseAreaPy: number | null;
        tenantEquipment: boolean;
        tenantUse: RoomUseTypeEnum | null;
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
        createdAt: Date;
        updatedAt: Date;
}

// 층 정보 (Floor - 1:N 관계의 부모)
export interface FloorType {
        id: string;
        propertyId: string;
        type: LevelTypeEnum | null;
        floor: number | null;
        ceilingHeight: number | null;
        ceilingHeightUnit: string | null;
        floorLoad: number | null;
        floorLoadUnit: string | null;
        truckBerths: number | null;
        use: FloorUseTypeEnum | null;
        totalAreaSqm: number | null;
        totalAreaPy: number | null;
        grossLeasableAreaSqm: number | null;
        grossLeasableAreaPy: number | null;
        netLeasableAreaSqm: number | null;
        netLeasableAreaPy: number | null;
        createdAt: Date;
        updatedAt: Date;

        // 1:N 관계: 호실 리스트
        floorPartial: FloorPartialType[];
}

// 파일 정보 (이미지, 브로슈어, 평면도)
export interface PropertyImageFileType {
        id: string;
        propertyId: string;
        main: boolean;
        fileUuid: string | null;
        fileName: string | null;
        fileKey: string | null;
        fileUrl: string | null;
        fileContentType: string | null;
        createdAt: Date;
        updatedAt: Date;
}
export interface PropertyBrochureFileType {
        id: string;
        propertyId: string;
        fileUuid: string | null;
        fileName: string | null;
        fileKey: string | null;
        fileUrl: string | null;
        fileContentType: string | null;
        createdAt: Date;
        updatedAt: Date;
}
export interface FloorPlanFileType {
        id: string;
        propertyId: string;
        type: FloorFlanTypeEnum;
        floor: number | null;
        fileUuid: string | null;
        fileName: string | null;
        fileKey: string | null;
        fileUrl: string | null;
        fileContentType: string | null;
        createdAt: Date;
        updatedAt: Date;
}

// 매매 상세 정보 (Sale)
export interface SaleType {
        id: string;
        transactionId: string | null;
        saleType: SaleTypeEnum;
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
        createdAt: Date;
        updatedAt: Date;
}

// 임대 상세 정보 (Lease)
export interface LeaseType {
        id: string;
        transactionId: string | null;
        leaseType: LeaseTypeEnum | null;
        floor: string | null;
        unit: string | null;
        tenant: string | null;
        leaseStartDate: Date | null;
        leaseEndDate: Date | null;
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
        createdAt: Date;
        updatedAt: Date;
}

// 거래 기본 정보 (Transaction - Sale/Lease 관계의 부모)
export interface TransactionType {
        id: string;
        propertyId: string;
        type: TransactionTypeEnum;
        year: string;
        quarter: string;
        executionDate: Date;
        createdAt: Date;
        updatedAt: Date;

        // 1:1 관계
        sale: SaleType | null;
        lease: LeaseType | null;
}

// ----------------------------------------------------------------------
// --- 3. 핵심 부동산 타입 정의 (PropertyType: Root) ---
// ----------------------------------------------------------------------

/**
 * @description 단일 부동산 물건(Property)에 대한 모든 정보를 담는 Root 타입.
 * Prisma Client의 `include` 옵션으로 모든 관계를 포함하여 조회했을 때의 구조를 반영합니다.
 */
export interface PropertyType {
        // Property 필드
        id: string;
        name: string;
        sectorId: string;
        subsectorId: string | null;
        createdAt: Date;
        updatedAt: Date;

        // 1:1 관계 (단일 객체)
        sector: SectorType | null;
        subsector: SubSectorType | null;
        location: LocationType | null;
        scale: ScaleType | null;
        facility: FacilityType | null;
        accessibility: AccessibilityType | null;
        profitability: ProfitabilityType | null;

        // 1:N 관계 (배열)
        warehouse: WarehouseType[];
        history: HistoryType[];
        propertyImageFile: PropertyImageFileType[];
        propertyBrochureFile: PropertyBrochureFileType[];
        floor: FloorType[];
        floorPlanFile: FloorPlanFileType[];
        transaction: TransactionType[];
}


// ----------------------------------------------------------------------
// --- 4. API 전송용 Payload 타입 정의 (Transformed to camelCase) ---
// ----------------------------------------------------------------------

/**
 * @description API로 데이터를 전송(저장/수정)할 때 사용되는 Payload 타입입니다.
 * DB 컬럼명(snake_case)이 아닌 Prisma Client 필드명(camelCase)을 따릅니다.
 * 이 타입을 사용하면 백엔드에서 별도의 매핑 로직이 불필요합니다.
 */

// 임차 호실 상세 정보 페이로드 (FloorPartial)
export interface FloorPartialPayload {
        id?: string; // 새 호실인 경우 undefined, 수정인 경우 string
        floorId: string; // 필수 외래 키
        unitNumber?: string | null;
        tenant?: string | null;
        leaseAreaSqm?: number | null;
        leaseAreaPy?: number | null;
        tenantEquipment?: boolean;
        tenantUse?: RoomUseTypeEnum | null;
        leaseStartDate?: Date | null;
        leaseEndDate?: Date | null;
        depositKrw?: number | null;
        monthlyRentPerPy?: number | null;
        monthlyRent?: number | null;
        monthlyManagementPerPy?: number | null;
        monthlyManagementFee?: number | null;
        increaseConditionsForDeposit?: string | null;
        increaseConditionsForRent?: string | null;
        increaseConditionsForManagementFee?: string | null;
        rentFree?: string | null;
        fitOut?: string | null;
}

// 층 정보 페이로드 (Floor)
export interface FloorPayload {
        id?: string;
        propertyId: string; // 필수 외래 키
        type?: LevelTypeEnum | null;
        floor?: number | null;

        ceilingHeight?: number | null;
        ceilingHeightUnit?: string | null;
        floorLoad?: number | null;
        floorLoadUnit?: string | null;
        truckBerths?: number | null;
        use?: FloorUseTypeEnum | null;
        totalAreaSqm?: number | null;
        totalAreaPy?: number | null;
        grossLeasableAreaSqm?: number | null;
        grossLeasableAreaPy?: number | null;
        netLeasableAreaSqm?: number | null;
        netLeasableAreaPy?: number | null;

        // FloorPartial이 Floor와 함께 전송될 수 있는 구조를 위해 포함
        floorPartial?: FloorPartialPayload[];
}


/**
 * @description Lease 생성/수정 시 클라이언트에서 보내는 데이터 구조 (camelCase)
 */
export interface LeaseCreatePayload {
        // Transaction 기본 정보
        year: string;
        quarter: string;
        executionDate: string | Date; // 날짜 문자열

        // Lease 상세 정보 (LeaseType에서 id, dates 등을 제외하거나 재정의)
        leaseType: LeaseTypeEnum; // 'ASKING' | 'ACTUAL'
        floor: string | null;
        unit: string | null;
        tenant: string | null;

        leaseStartDate: string | Date | null;
        leaseEndDate: string | Date | null;

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
        rentFreeType: RentFreeTypeEnum | null; // 'PerYear' | 'PerTerm'
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
 * @description Sale 생성/수정 시 클라이언트에서 보내는 데이터 구조 (camelCase)
 */
export interface SaleCreatePayload {
        // Transaction 기본 정보
        year: string;
        quarter: string;
        executionDate: string | Date;

        // Sale 상세 정보
        saleType: SaleTypeEnum; // 'ENBLOC' | 'PARTIAL'
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

// ----------------------------------------------------------------------
// --- 5. Admin 목록 표시용 타입 (Property Store에서 사용)
// ----------------------------------------------------------------------

/**
 * @description 관리자 화면의 리스트 테이블에 표시될 자산의 최소 정보 구조
 */
export type AdminListType = {
        // 💡 참고: 'no'는 DB에 없는 임의 부여 번호이므로, 프론트엔드에서 처리하거나,
        // 만약 DB에 자산 관리 번호(Asset Code)가 있다면 해당 필드를 사용하는 것을 권장합니다.
        no: number; // 자산번호 (임의 부여, 프론트엔드 목록 순번)

        // 핵심 식별자
        propertyId: string; // Asset/Property의 고유 ID (DB primary key)
        propertyName: string; // 자산 이름
        mainImageUrl: string | null; // 리스트/카드 썸네일 이미지 URL

        // 자산 등급 및 분류
        grade: string | null; // 자산 등급 (예: A, B, C)
        sector: string; // 섹터 이름
        subSector: string | null; // 서브 섹터 이름

        // 위치 정보
        addressFull: string | null; // 전체 주소
        addressProvince: string | null; // 주/도
        addressCity: string | null; // 시/군/구
        latitude: number | null;
        longitude: number | null;

        // 추가: 관리 편의성을 위해 DB의 created/updated 시점 추가 (선택 사항)
        createdAt: Date;
        updatedAt: Date;
}