import { defineStore } from 'pinia';
import type { CbreAsset, FloorType, FloorPlanPhotoListType, SaleDetailType, LeaseDetailType, TransactionInfoType } from '~/types/asset.type';


export interface TransactionInfoWrapper {
  totalTransactions: number | null;
  transactionsList: TransactionInfoType[];
}

// CbreAsset의 필드 구조를 따르도록 래퍼 타입을 명시적으로 정의 (leaseInfo)
export interface LeaseInfoWrapper {
  totalLeasesAsking: number | null;
  totalLeasesActual: number | null;
  leasesAskingList: LeaseDetailType[];
  leasesActualList: LeaseDetailType[];
}

// ✨ CbreAsset 타입의 일부가 될 수 있는 타입을 정의합니다.
// Partial<T>는 T의 모든 속성을 선택적(optional)으로 만듭니다.
// 이렇게 하면 초기 상태에서 모든 값을 제공하지 않아도 됩니다.
type PropertyState = Partial<CbreAsset> & {
  lastPropertyId: string;
  currentPropertyId: string;

  // ⭐ 이전 오류 해결 및 명시적 타입 정의: Sale 및 Lease Detail 목록
  saleDetailList: SaleDetailType[] | null;
  leaseDetailList: LeaseDetailType[] | null;

  // ⭐ CbreAsset에 정의되지 않은 경우를 대비하여 명시적으로 추가
  transactionInfo: TransactionInfoWrapper | null;
  leaseInfo: LeaseInfoWrapper | null;

};

// 이 함수가 반환하는 객체는 PropertyState 타입과 일치해야 합니다.
const getInitialState = (): PropertyState => ({
  // 스토어 전용 상태
  lastPropertyId: '',
  currentPropertyId: '',

  // ⭐ Sale 및 Lease Detail 목록 초기값 설정
  saleDetailList: null,
  leaseDetailList: null,

  // ⭐ 요청에 따라 transactionInfo와 leaseInfo 구조로 초기화
  transactionInfo: {
    totalTransactions: null,
    transactionsList: [],
  },

  leaseInfo: {
    totalLeasesAsking: null,
    totalLeasesActual: null,
    leasesAskingList: [],
    leasesActualList: [],
  },

  // CbreAsset에서 가져온 상태들 (빈 값 또는 기본값으로 초기화)
  propertyId: '',
  propertyName: '',
  mainImageUrl: '',

  general: {
    sector: { id: '', name: '' },
    subSector: null,
    warehouse: { room: null, low: null, constant: null },
  },

  historyList: [], // ✨ 빈 배열로 초기화

  profitability: {
    grade: '',
    effRatio: null,
  },

  location: {
    addressFull: '',
    addressFullJibun: '',
    addressProvince: '',
    addressCity: '',
    latitude: 0,
    longitude: 0,
  },

  accessibility: {
    distanceToIc: null,
    timeTakenToCityHall: null,
    timeTakenToSubway: null,
    nearbyFacilities: null,
    nearbyAttractions: null,
    nearbyPlaces: null,
  },

  sizes: {
    noOfBuildings: null,
    upperLevels: null,
    basementLevels: null,
    gfaSqm: null,
    gfaPy: null,
    nfaSqm: null,
    nfaPy: null,
    siteAreaSqm: null,
    siteAreaPy: null,
    grossLeasableAreaSqm: null,
    grossLeasableAreaPy: null,
    netLeasableAreaSqm: null,
    netLeasableAreaPy: null,
    floorAreaRatioExisting: null,
    floorAreaRatioPermitted: null,
    buildingCoverageRatioExisting: null,
    buildingCoverageRatioPermitted: null,
    floorPlateSqm: null,
    floorPlatePy: null,
  },

  facility: {
    elevators: { total: null, passenger: null, service: null, shuttle: null },
    parking: { cpsExisting: null, cpsRequired: null, freeCpsSqm: null, freeCpsPy: null, paidParkingFee: null },
    materials: { roofMaterial: null, facade: null, mechanicalElectrical: null, lighting: null, fireFighting: null },
  },

  floorList: [], // ✨ 빈 배열로 초기화

  photoList: [], // ✨ 빈 배열로 초기화

  brochureList: [], // ✨ 빈 배열로 초기화

  floorPlanPhotoList: {
    logitudinal: [],
    cross: [],
    eachFloor: {
      uppers: [],
      basements: [],
    },
  },


});

export const usePropertyStore = defineStore('property', {
  // ✨ state는 초기 상태 함수를 직접 참조합니다.
  state: getInitialState,

  getters: {
    // 예시: 전체 자산 데이터를 CbreAsset 형태로 조합하는 getter
    // 폼 제출 시 이 getter를 사용하면 편리합니다.
    assetData(state): CbreAsset {
      // state의 모든 속성을 CbreAsset 타입으로 캐스팅하여 반환
      // 실제로는 누락된 필수 값이 있는지 확인하는 로직이 추가되면 더 좋습니다.
      return state as CbreAsset;
    }
  },

  actions: {

    /**
   * @description 특정 propertyId로 자산 상세 정보를 서버에서 불러와 스토어 상태를 갱신합니다.
   * @param propertyId - 불러올 자산의 고유 ID
   */
    async getProperty(propertyId: string): Promise<boolean> {
      this.currentPropertyId = propertyId; // 현재 ID를 업데이트합니다.

      // 로딩 상태 관리를 위해 App Store 사용 (가정)
      const appStore = useAppStore();
      appStore.setLoading(true); // 로딩 시작

      try {
        // 💡 Nuxt 서버 API (예: /api/property/[id])를 호출합니다.
        const response = await $fetch<Partial<CbreAsset>>(`/api/data/${propertyId}`, {
          method: 'GET',
        });

        if (!response || !response.propertyId) {
          console.error('에러: 자산 데이터를 불러오지 못했습니다. propertyId가 없습니다.');
          return false;
        }

        // 서버에서 받은 데이터로 스토어 상태 갱신
        this.setProperty(response);
        //console.log('Pinia: 자산 정보 불러오기 및 스토어 업데이트 완료', propertyId); // 자산 데이터 로드 성공

        return true;
      } catch (e) {
        console.error('에러: 자산 정보를 불러오는 중 오류 발생:', e); // 자산 정보 로딩 중 오류 발생
        // 오류가 발생해도 상태를 초기화할 필요는 없지만, UI에 오류를 표시할 수 있습니다.
        return false;
      } finally {
        appStore.setLoading(false); // 로딩 종료
      }
    },

    // ✨ asset의 일부만 업데이트할 수 있도록 Partial<CbreAsset> 타입을 사용합니다.
    setProperty(asset: Partial<CbreAsset>) {
      // Object.assign을 사용하여 기존 상태 위에 새로운 데이터를 덮어씁니다.
      // 이렇게 하면 asset 객체에 없는 속성은 기존 값을 유지합니다.
      Object.assign(this, asset);
    },

    // ✨ 2. Property 객체의 일부만 업데이트하는 액션 (Partial Update)
    setPropertyPartial(propertyPartial: Partial<CbreAsset>) {
      // FacilityForm.vue, ParkingForm.vue 등에서 사용
      // Object.assign을 사용하여 기존 상태를 유지하면서 새로운 속성만 덮어씁니다.
      Object.assign(this, propertyPartial);
      //console.log('자산 정보 일부가 병합 업데이트되었습니다.');
    },

    // ✨ 리셋 액션은 이제 getInitialState를 호출하여 상태를 완벽하게 초기화합니다.
    resetProperty() {
      Object.assign(this, getInitialState());
    },

    // 예시: 특정 필드만 업데이트하는 액션
    updatePropertyName(name: string) {
      this.propertyName = name;
    },

    updateFloorList(updatedFloors: FloorType[]) {
      // 1. 기존 floorList를 Map으로 만들어 빠른 접근을 가능하게 합니다.
      const existingMap = new Map((this.floorList || []).map(f => [f.floorId, f]));

      // 2. 새로운 배열을 생성합니다.
      const newFloorList: FloorType[] = [];

      updatedFloors.forEach(newFloor => {
        const existingFloor = existingMap.get(newFloor.floorId);

        if (existingFloor) {
          // 🚨 기존 Object.assign(existingFloor, newFloor) 방식 대신:
          // ✅ 개선: 스프레드 문법을 사용하여 완전히 새로운 FloorType 객체 생성
          const mergedFloor: FloorType = {
            ...existingFloor, // 기존 속성 복사 (새 데이터에 없는 속성 유지)
            ...newFloor,      // 새 데이터로 덮어쓰기 (floorPartial 포함)
          };

          newFloorList.push(mergedFloor); // 새로운 객체 참조를 배열에 추가
          existingMap.delete(newFloor.floorId);
        } else {
          // 새롭게 추가된 Floor 객체
          newFloorList.push(newFloor);
        }
      });

      // 3. Pinia의 상태를 새로운 배열로 교체
      this.floorList = newFloorList as any;

      //console.log('Updated floorList in store:', this.floorList);
    },

    /**
     * @description Floor Plan Photo 목록을 API 응답 데이터로 갱신합니다.
     * @param updatedList 서버에서 성공적으로 저장 후 반환된 FloorPlanPhotoListType 객체
     */
    updateFloorPlanPhotoList(updatedList: FloorPlanPhotoListType) {
      // floorPlanPhotos 상태를 새로운 데이터로 대체합니다.
      this.floorPlanPhotoList = updatedList;
    },


    // ⭐ 새로 추가된 action: removeTransaction
    removeTransaction(transactionId: string) {
      // property.ts의 Pinia state는 Partial<CbreAsset>을 확장합니다.
      // transactionInfo가 존재하고 transactionsList가 배열일 때만 실행합니다.
      if (this.transactionInfo?.transactionsList) {

        // 1. 해당 ID를 가진 트랜잭션을 목록에서 제거
        this.transactionInfo.transactionsList = this.transactionInfo.transactionsList.filter(
          t => t.id !== transactionId
        );

        // 2. 총 트랜잭션 개수 (totalTransactions)도 업데이트합니다.
        if (this.transactionInfo.totalTransactions && this.transactionInfo.totalTransactions > 0) {
          this.transactionInfo.totalTransactions -= 1;
        }
      }
    },

    // 이전에 SaleDetailModal에서 사용된 removeSaleDetail이 있었다면 Lease용도 추가
    removeSaleDetail(transactionId: string) {
      if (this.saleDetailList) {
        this.saleDetailList = this.saleDetailList.filter(
          s => s.transactionId !== transactionId
        );
      }
    },

    // Lease에서도 삭제를 수행하므로 LeaseDetailList에서 제거하는 action도 추가해야 합니다.
    removeLeaseDetail(transactionId: string) {
      if (this.leaseDetailList) {
        this.leaseDetailList = this.leaseDetailList.filter(
          l => l.transactionId !== transactionId
        );
      }
    }




  },
});

