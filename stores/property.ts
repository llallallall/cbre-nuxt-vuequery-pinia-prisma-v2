// /store/property.ts

import { defineStore } from 'pinia';
import type { PropertyType, AdminListType, TransactionTypeEnum } from '~/types/property.type';
import { useStatusStore } from './status';

// ----------------------------------------------------------------------
// 1. 필터 및 상태 타입 정의
// ----------------------------------------------------------------------

/**
 * @description 상세 필터링 조건 타입 (Old Filter Store의 moreFilters 구조 반영)
 */
interface MoreFiltersType {
        // 면적 관련 (Scale)
        gfa: number;
        gfaType: boolean; // true: Sqm, false: Py
        nfa: number;
        nfaType: boolean;
        siteArea: number;
        siteAreaType: boolean;

        // 시기 관련 (History / Transaction)
        built: number; // 완공년도
        reno: number; // 리모델링년도
        sales: number; // 매매 발생 년도
        leases: number; // 임대 발생 년도

        // 시설/규모 관련 (Scale / Facility)
        buildings: number; // 동수
        basement: number; // 지하 층수
        upperFloor: number; // 지상 층수
        elevator: number; // 엘리베이터 수
        parking: number; // 주차 대수

        // 재무 관련 (Profitability / Lease Detail)
        iod: number;
        gdm: number;
        noc: number;
        effRatio: number;
}

/**
 * @description Property Store의 전체 상태(State) 정의
 */
interface PropertyState {
        // 1. 현재 작업 중인 자산 상세 정보
        currentProperty: PropertyType | null;
        currentPropertyId: string;

        // 2. 자산 목록 (전체 원본 데이터)
        initialAllAssets: PropertyType[];
        initialAssetIds: string[];
        initialDataLoaded: boolean;

        // 3. 필터링된 자산 목록 (지도 및 메인 리스트용)
        filteredAssets: PropertyType[];
        filteredAssetsIds: string[];

        // 4. Admin List 상태 (테이블 뷰용 경량 데이터)
        adminList: AdminListType[];
        filteredAdminList: AdminListType[];
        adminListLoaded: boolean;

        // 5. 필터링 조건 상태
        searchKeyword: string;
        filterTransactionType: string; // 'sale', 'lease', 'sale/lease', ''
        filterSectorTypes: string[]; // Sector Name List
        filterSubSectorTypes: string[]; // SubSector Name List
        moreFilters: MoreFiltersType;
}

// ----------------------------------------------------------------------
// 2. 초기 상태 정의
// ----------------------------------------------------------------------

const getInitialState = (): PropertyState => ({
        currentProperty: null,
        currentPropertyId: '',

        initialAllAssets: [],
        initialAssetIds: [],
        initialDataLoaded: false,

        filteredAssets: [],
        filteredAssetsIds: [],

        adminList: [],
        filteredAdminList: [],
        adminListLoaded: false,

        searchKeyword: '',
        filterTransactionType: '',
        filterSectorTypes: [],
        filterSubSectorTypes: [],

        moreFilters: {
                gfa: 0, gfaType: true,
                nfa: 0, nfaType: true,
                siteArea: 0, siteAreaType: true,
                built: 0, reno: 0,
                sales: 0, leases: 0,
                buildings: 0, basement: 0, upperFloor: 0,
                elevator: 0, parking: 0,
                iod: 0, gdm: 0, noc: 0, effRatio: 0,
        },
});

// ----------------------------------------------------------------------
// 3. Pinia Store 정의
// ----------------------------------------------------------------------

export const usePropertyStore = defineStore('property', {
        state: getInitialState,

        getters: {
                /**
                 * @description ID로 자산 찾기
                 */
                getAssetById: (state) => (id: string) => {
                        return state.initialAllAssets.find((el) => el.id === id);
                },

                /**
                 * @description 지도 마커 생성을 위한 데이터 반환 (Old Data Store의 filteredMapInfos 대체)
                 */
                getFilteredMapData: (state) => {
                        return state.filteredAssets.map(asset => ({
                                id: asset.id,
                                name: asset.name,
                                latitude: asset.location?.latitude ?? 0,
                                longitude: asset.location?.longitude ?? 0,
                                sector: asset.sector?.name,
                                subSector: asset.subsector?.name,
                                mainImageUrl: asset.propertyImageFile?.find(img => img.main)?.fileUrl ?? null
                        })).filter(p => p.latitude !== 0 && p.longitude !== 0);
                },

                // 네비게이션용 ID (이전/다음)
                previousAssetId: (state) => {
                        const idx = state.filteredAssetsIds.indexOf(state.currentPropertyId);
                        return idx > 0 ? state.filteredAssetsIds[idx - 1] : '';
                },
                nextAssetId: (state) => {
                        const idx = state.filteredAssetsIds.indexOf(state.currentPropertyId);
                        return (idx !== -1 && idx < state.filteredAssetsIds.length - 1) ? state.filteredAssetsIds[idx + 1] : '';
                }
        },

        actions: {
                // ------------------------------------------------------------------
                // A. 데이터 로드 액션 (Data Fetching)
                // ------------------------------------------------------------------

                /**
                 * @description 초기 데이터 로드 (모든 자산 정보)
                 * Old Store의 getAllAssets + setInitialAllAssets 로직 통합
                 */
                async fetchInitialData() {
                        const statusStore = useStatusStore();

                        // 이미 데이터가 있으면 로드하지 않음 (새로고침 필요 시 별도 처리)
                        if (this.initialDataLoaded && this.initialAllAssets.length > 0) return;

                        statusStore.setGlobalLoading(true, 'fetchInitialData');

                        try {
                                // API 호출 (경로는 프로젝트 API 구조에 맞게 수정 필요)
                                const allAssets = await $fetch<PropertyType[]>('/api/property/list/all');

                                this.initialAllAssets = allAssets;
                                this.initialAssetIds = allAssets.map(a => a.id);

                                // Admin List도 초기 데이터 기반으로 생성 (필요 시)
                                this.generateAdminListFromInitial();

                                // 초기 필터 적용
                                this.applyFilter();

                                this.initialDataLoaded = true;

                        } catch (e: any) {
                                // 💡 Error Message: English
                                statusStore.setGlobalError('Failed to load initial property data.', 'fetchInitialData');
                                console.error('fetchInitialData Error:', e); // 한글 주석: 에러 로그
                        } finally {
                                statusStore.setGlobalLoading(false);
                        }
                },

                /**
                 * @description Admin 페이지용 경량 리스트 로드
                 */
                async fetchAdminList() {
                        if (this.adminListLoaded) return;

                        const statusStore = useStatusStore();
                        statusStore.setGlobalLoading(true, 'fetchAdminList');

                        try {
                                const adminData = await $fetch<AdminListType[]>('/api/property/list/admin');

                                // 프론트엔드용 순번 부여
                                this.adminList = adminData.map((item, idx) => ({
                                        ...item,
                                        no: idx + 1
                                }));
                                this.filteredAdminList = this.adminList;
                                this.adminListLoaded = true;

                        } catch (e: any) {
                                // 💡 Error Message: English
                                statusStore.setGlobalError('Failed to load admin list.', 'fetchAdminList');
                                console.error(e);
                        } finally {
                                statusStore.setGlobalLoading(false);
                        }
                },

                /**
                 * @description 특정 자산 상세 정보 로드
                 */
                async fetchPropertyDetail(propertyId: string) {
                        this.currentPropertyId = propertyId;
                        const statusStore = useStatusStore();
                        statusStore.setGlobalLoading(true, 'fetchPropertyDetail');

                        try {
                                const detail = await $fetch<PropertyType>(`/api/property/${propertyId}`);
                                this.currentProperty = detail;
                        } catch (e: any) {
                                // 💡 Error Message: English
                                statusStore.setGlobalError('Failed to load property details.', 'fetchPropertyDetail');
                                console.error(e);
                                this.currentProperty = null;
                        } finally {
                                statusStore.setGlobalLoading(false);
                        }
                },

                // ------------------------------------------------------------------
                // B. 필터링 액션 (Filtering Logic) - Old Data Store 로직 이식
                // ------------------------------------------------------------------

                /**
                 * @description 필터 조건 업데이트
                 */
                updateFilter<K extends keyof PropertyState>(key: K, value: PropertyState[K]) {
                        // @ts-ignore
                        this[key] = value;
                        // 필터 조건이 바뀌면 즉시 필터링 수행
                        this.applyFilter();
                },

                /**
                 * @description 필터링 수행 (applyFilter)
                 * Old Data Store의 `setFilterAssets` 로직을 현재 Type 구조에 맞게 재구현
                 */
                applyFilter() {
                        if (this.initialAllAssets.length === 0) return;

                        let assets = [...this.initialAllAssets];
                        const filters = this.moreFilters;

                        // 1. 텍스트 검색 (이름, 주소)
                        if (this.searchKeyword.trim()) {
                                const keyword = this.searchKeyword.toLowerCase().trim();
                                assets = assets.filter(p =>
                                        p.name.toLowerCase().includes(keyword) ||
                                        p.location?.addressFull?.toLowerCase().includes(keyword) ||
                                        p.location?.addressProvince?.toLowerCase().includes(keyword) ||
                                        p.location?.addressCity?.toLowerCase().includes(keyword)
                                );
                        }

                        // 2. Transaction Type (Sale / Lease)
                        // property.transaction 배열을 확인하여 해당 타입의 거래가 존재하는지 확인
                        if (this.filterTransactionType) {
                                const type = this.filterTransactionType.toLowerCase();
                                assets = assets.filter(p => {
                                        const hasSale = p.transaction.some(t => t.type === 'SALE');
                                        const hasLease = p.transaction.some(t => t.type === 'LEASE');

                                        if (type === 'sale') return hasSale;
                                        if (type === 'lease') return hasLease;
                                        if (type === 'sale/lease') return hasSale && hasLease;
                                        return true;
                                });
                        }

                        // 3. Sector Type
                        if (this.filterSectorTypes.length > 0) {
                                assets = assets.filter(p =>
                                        p.sector && this.filterSectorTypes.some(t => t.toLowerCase() === p.sector!.name.toLowerCase())
                                );
                        }

                        // 4. SubSector Type
                        if (this.filterSubSectorTypes.length > 0) {
                                assets = assets.filter(p =>
                                        p.subsector && this.filterSubSectorTypes.some(t => t.toLowerCase() === p.subsector!.name.toLowerCase())
                                );
                        }

                        // 5. More Filters (상세 필터)

                        // 5.1 Scale (면적)
                        if (filters.gfa > 0) {
                                const key = filters.gfaType ? 'gfaSqm' : 'gfaPy';
                                assets = assets.filter(p => (p.scale?.[key] ?? 0) >= filters.gfa);
                        }
                        if (filters.nfa > 0) {
                                const key = filters.nfaType ? 'nfaSqm' : 'nfaPy';
                                assets = assets.filter(p => (p.scale?.[key] ?? 0) >= filters.nfa);
                        }
                        if (filters.siteArea > 0) {
                                const key = filters.siteAreaType ? 'siteAreaSqm' : 'siteAreaPy';
                                assets = assets.filter(p => (p.scale?.[key] ?? 0) >= filters.siteArea);
                        }

                        // 5.2 History (시기)
                        // 'COMPLETION' 이력 중 year 비교
                        if (filters.built > 0) {
                                assets = assets.filter(p => {
                                        const completion = p.history.find(h => h.type === 'COMPLETION');
                                        return completion ? parseInt(completion.year) >= filters.built : false;
                                });
                        }
                        // 'RENOVATION' 이력 중 year 비교
                        if (filters.reno > 0) {
                                assets = assets.filter(p => {
                                        const renovation = p.history.find(h => h.type === 'RENOVATION');
                                        return renovation ? parseInt(renovation.year) >= filters.reno : false;
                                });
                        }
                        // Transaction 연도 비교
                        if (filters.sales > 0) {
                                assets = assets.filter(p =>
                                        p.transaction.some(t => t.type === 'SALE' && parseInt(t.year) >= filters.sales)
                                );
                        }
                        if (filters.leases > 0) {
                                assets = assets.filter(p =>
                                        p.transaction.some(t => t.type === 'LEASE' && parseInt(t.year) >= filters.leases)
                                );
                        }

                        // 5.3 Scale & Facility (구조/시설)
                        if (filters.buildings > 0) {
                                assets = assets.filter(p => (p.scale?.noOfBuildings ?? 0) >= filters.buildings);
                        }
                        if (filters.basement > 0) {
                                assets = assets.filter(p => (p.scale?.basementLevels ?? 0) >= filters.basement);
                        }
                        if (filters.upperFloor > 0) {
                                assets = assets.filter(p => (p.scale?.upperLevels ?? 0) >= filters.upperFloor);
                        }
                        if (filters.elevator > 0) {
                                assets = assets.filter(p => (p.facility?.elevatorsTotal ?? 0) >= filters.elevator);
                        }
                        if (filters.parking > 0) {
                                assets = assets.filter(p => (p.facility?.cpsExisting ?? 0) >= filters.parking);
                        }

                        // 5.4 Profitability & Lease Details (재무)
                        if (filters.effRatio > 0) {
                                assets = assets.filter(p => (p.profitability?.effectiveRatio ?? 0) >= filters.effRatio);
                        }

                        // NOC, IOD, GDM은 Transaction -> Lease 안에 있음.
                        // 하나라도 조건을 만족하는 Lease가 있으면 통과
                        if (filters.noc > 0) {
                                assets = assets.filter(p =>
                                        p.transaction.some(t => t.lease && (t.lease.noc ?? 0) >= filters.noc)
                                );
                        }
                        if (filters.iod > 0) {
                                assets = assets.filter(p =>
                                        p.transaction.some(t => t.lease && (t.lease.iod ?? 0) >= filters.iod)
                                );
                        }
                        if (filters.gdm > 0) {
                                assets = assets.filter(p =>
                                        p.transaction.some(t => t.lease && (t.lease.gdm ?? 0) >= filters.gdm)
                                );
                        }

                        // 결과 반영
                        this.filteredAssets = assets;
                        this.filteredAssetsIds = assets.map(a => a.id);
                },

                /**
                 * @description Admin List 내부 필터링 (검색어 기준)
                 */
                filterAdminList(searchKeyword: string) {
                        if (!this.adminList.length) return;

                        const keyword = searchKeyword.toLowerCase().trim();
                        if (!keyword) {
                                this.filteredAdminList = this.adminList;
                                return;
                        }

                        this.filteredAdminList = this.adminList.filter(item =>
                                item.propertyName.toLowerCase().includes(keyword) ||
                                item.addressFull?.toLowerCase().includes(keyword) ||
                                item.sector?.toLowerCase().includes(keyword) ||
                                item.subSector?.toLowerCase().includes(keyword) ||
                                item.grade?.toLowerCase().includes(keyword)
                        );
                },

                // ------------------------------------------------------------------
                // C. 데이터 수정 액션 (CRUD)
                // ------------------------------------------------------------------

                /**
                 * @description 특정 자산의 섹션 정보 업데이트 (Partial Update)
                 */
                async updatePropertySection<K extends keyof PropertyType>(sectionName: K, data: PropertyType[K]) {
                        if (!this.currentPropertyId) return;

                        const statusStore = useStatusStore();
                        statusStore.setGlobalLoading(true, `update_${String(sectionName)}`);

                        try {
                                // 예: /api/property/[id]/location, /api/property/[id]/scale 등
                                const updatedData = await $fetch<PropertyType>(`/api/property/${this.currentPropertyId}/${String(sectionName)}`, {
                                        method: 'PUT', // 또는 PATCH
                                        body: data
                                });

                                // 상태 갱신
                                if (this.currentProperty) {
                                        // @ts-ignore
                                        this.currentProperty[sectionName] = updatedData[sectionName];
                                }

                                // 전체 리스트의 해당 항목도 갱신
                                const index = this.initialAllAssets.findIndex(p => p.id === this.currentPropertyId);
                                if (index !== -1) {
                                        this.initialAllAssets[index] = { ...this.initialAllAssets[index], ...updatedData };
                                        this.applyFilter(); // 리스트 뷰 갱신
                                }

                        } catch (e: any) {
                                // 💡 Error Message: English
                                statusStore.setGlobalError(`Failed to update ${String(sectionName)}.`, `update_${String(sectionName)}`);
                                throw e;
                        } finally {
                                statusStore.setGlobalLoading(false);
                        }
                },

                /**
                 * @description 자산 삭제
                 */
                deleteProperty(propertyId: string) {
                        const statusStore = useStatusStore();

                        statusStore.openConfirmModal(`정말로 자산(ID: ${propertyId})을 삭제하시겠습니까?`, async (confirmed) => {
                                if (!confirmed) return;

                                statusStore.setGlobalLoading(true, 'deleteProperty');
                                try {
                                        await $fetch(`/api/property/${propertyId}`, {
                                                method: 'DELETE' as any
                                        });

                                        // 상태에서 제거
                                        this.initialAllAssets = this.initialAllAssets.filter(p => p.id !== propertyId);
                                        this.adminList = this.adminList.filter(p => p.propertyId !== propertyId);

                                        this.applyFilter(); // 필터 재적용
                                        this.filterAdminList(''); // Admin 리스트 재적용

                                        if (this.currentPropertyId === propertyId) {
                                                this.currentProperty = null;
                                                this.currentPropertyId = '';
                                        }

                                } catch (e: any) {
                                        // 💡 Error Message: English
                                        statusStore.setGlobalError('Failed to delete property.', 'deleteProperty');
                                } finally {
                                        statusStore.setGlobalLoading(false);
                                }
                        });
                },

                /**
                 * @description 선택된 여러 자산(Asset/Property)을 일괄 삭제합니다.
                 * @param propertyIds - 삭제할 자산 ID들의 배열
                 */
                async executeDeleteMultipleProperties(propertyIds: string[]) {
                        // 1. 상태 Store 임포트
                        const statusStore = useStatusStore();
                        statusStore.setGlobalLoading(true, 'executeDeleteMultipleProperties');

                        // 최종 성공 여부 플래그
                        let isSuccess = true;

                        try {
                                // [TODO]: 복수 자산 삭제를 위한 전용 API 엔드포인트 호출
                                // (예: DELETE /api/property/bulk?ids=id1,id2,id3)
                                // 실제 API 구현에 따라 로직을 변경해야 합니다.

                                const response = await $fetch('/api/property/bulk', {
                                        method: 'DELETE',
                                        body: { propertyIds },
                                });

                                // 2. API 성공 시: 상태(Pinia State)에서 삭제된 자산 제거
                                this.initialAllAssets = this.initialAllAssets.filter(
                                        p => !propertyIds.includes(p.id)
                                );
                                this.adminList = this.adminList.filter(
                                        p => !propertyIds.includes(p.propertyId)
                                );

                                // 3. 필터링된 리스트 갱신
                                this.applyFilter();

                                // 4. 삭제된 자산이 현재 상세 조회 중인 자산인 경우 초기화
                                if (this.currentPropertyId && propertyIds.includes(this.currentPropertyId)) {
                                        this.currentProperty = null;
                                        this.currentPropertyId = '';
                                }

                                // 5. 토스트 메시지 표시 (useToast가 import 되었다고 가정)
                                // useToast().showToast(`${propertyIds.length}개의 자산이 성공적으로 삭제되었습니다.`, 'success');

                        } catch (e) {
                                // 에러 처리
                                isSuccess = false;
                                statusStore.setGlobalError('선택된 자산 중 일부 또는 전체 삭제에 실패했습니다.', 'executeDeleteMultipleProperties');
                                console.error('Bulk Delete failed:', e);
                        } finally {
                                statusStore.setGlobalLoading(false);
                        }

                        return isSuccess;
                },

                // ------------------------------------------------------------------
                // D. 유틸리티 (Internal)
                // ------------------------------------------------------------------

                /**
                 * @description 전체 자산 목록에서 AdminListType 생성 (내부용)
                 */
                generateAdminListFromInitial() {
                        if (!this.initialAllAssets.length) return;

                        this.adminList = this.initialAllAssets.map((asset, idx) => ({
                                no: idx + 1,
                                propertyId: asset.id,
                                propertyName: asset.name,
                                mainImageUrl: asset.propertyImageFile?.find(i => i.main)?.fileUrl ?? null,
                                grade: asset.profitability?.grade ?? null,
                                sector: asset.sector?.name ?? 'N/A',
                                subSector: asset.subsector?.name ?? null,
                                addressFull: asset.location?.addressFull ?? null,
                                addressProvince: asset.location?.addressProvince ?? null,
                                addressCity: asset.location?.addressCity ?? null,
                                latitude: asset.location?.latitude ?? null,
                                longitude: asset.location?.longitude ?? null,
                                createdAt: asset.createdAt,
                                updatedAt: asset.updatedAt
                        }));

                        this.filteredAdminList = this.adminList;
                        this.adminListLoaded = true;
                },

                /**
                 * @description 자산 네비게이션 (이전/다음 자산 이동)
                 */
                setAssetNav(id: string) {
                        this.currentPropertyId = id;
                        // getters인 previousAssetId, nextAssetId는 자동으로 계산됨
                        return true;
                }
        }
});