// /store/property.ts

import { defineStore } from 'pinia';
import type { PropertyType, AdminListType, TransactionTypeEnum, FloorType, FloorPlanFileType } from '~/types/property.type';
import { useStatusStore } from './status';
// 💡 [추가] 변환 유틸리티 임포트
import { transformPropertyResponse } from '~/utils/transformer';

// ----------------------------------------------------------------------
// 1. 필터 및 상태 타입 정의
// ----------------------------------------------------------------------

/**
 * @description 상세 필터링 조건 타입
 */
interface MoreFiltersType {
        // 면적 관련
        gfa: number; gfaType: boolean;
        nfa: number; nfaType: boolean;
        siteArea: number; siteAreaType: boolean;

        // 시기 관련
        built: number; reno: number; sales: number; leases: number;

        // 시설/규모 관련
        buildings: number; basement: number; upperFloor: number; elevator: number; parking: number;

        // 재무 관련
        iod: number; gdm: number; noc: number; effRatio: number;
}

/**
 * @description Property Store의 전체 상태(State) 정의
 */
interface PropertyState {
        currentProperty: PropertyType | null;
        currentPropertyId: string;

        initialAllAssets: PropertyType[];
        initialAssetIds: string[];
        initialDataLoaded: boolean;

        filteredAssets: PropertyType[];
        filteredAssetsIds: string[];

        adminList: AdminListType[];
        filteredAdminList: AdminListType[];
        adminListLoaded: boolean;

        searchKeyword: string;
        filterTransactionType: string;
        filterSectorTypes: string[];
        filterSubSectorTypes: string[];
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
                getAssetById: (state) => (id: string) => {
                        return state.initialAllAssets.find((el) => el.id === id);
                },

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

                previousAssetId: (state) => {
                        const idx = state.filteredAssetsIds.indexOf(state.currentPropertyId);
                        return idx > 0 ? state.filteredAssetsIds[idx - 1] : '';
                },
                nextAssetId: (state) => {
                        const idx = state.filteredAssetsIds.indexOf(state.currentPropertyId);
                        return (idx !== -1 && idx < state.filteredAssetsIds.length - 1) ? state.filteredAssetsIds[idx + 1] : '';
                },

                // 호환성을 위한 getter (기존 코드 호환)
                assetData: (state) => state.currentProperty || ({} as PropertyType),
                propertyId: (state) => state.currentPropertyId,

                // 메인 이미지 URL을 동적으로 반환
                mainImageUrl: (state): string => {
                        const photos = state.currentProperty?.propertyImageFile || [];
                        // 1. main이 true인 사진 찾기
                        const main = photos.find(img => img.main);
                        // 2. 없으면 첫 번째 사진, 그것도 없으면 placeholder
                        return main?.fileUrl || photos[0]?.fileUrl || '/images/placeholder.jpg';
                },

                // 개별 섹션 접근을 위한 Getter (Template 편의성)
                location: (state) => state.currentProperty?.location,
                facility: (state) => state.currentProperty?.facility,
                accessibility: (state) => state.currentProperty?.accessibility,
                profitability: (state) => state.currentProperty?.profitability,
                scale: (state) => state.currentProperty?.scale,
                sizes: (state) => state.currentProperty?.scale, // Alias
                general: (state) => state.currentProperty,
                propertyName: (state) => state.currentProperty?.name,

                // 리스트 Getters
                historyList: (state) => state.currentProperty?.history || [],
                floorList: (state) => state.currentProperty?.floor || [],
                photoList: (state) => state.currentProperty?.propertyImageFile || [],
                brochureList: (state) => state.currentProperty?.propertyBrochureFile || [],
                floorPlanPhotoList: (state) => state.currentProperty?.floorPlanFile || [],

                // Transaction 정보
                transactionInfo: (state) => ({
                        totalTransactions: state.currentProperty?.transaction?.length || 0,
                        transactionsList: state.currentProperty?.transaction || []
                }),

                leaseInfo: (state) => {
                        const leaseTransactions = state.currentProperty?.transaction?.filter(t => t.type === 'LEASE') || [];
                        const actual = leaseTransactions.filter(t => t.lease?.leaseType === 'ACTUAL');
                        const asking = leaseTransactions.filter(t => t.lease?.leaseType === 'ASKING');

                        return {
                                totalLeasesActual: actual.length,
                                totalLeasesAsking: asking.length,
                                leasesActualList: actual.map(t => t.lease),
                                leasesAskingList: asking.map(t => t.lease)
                        };
                }
        },

        actions: {
                // ------------------------------------------------------------------
                // A. 데이터 로드 액션
                // ------------------------------------------------------------------

                async fetchInitialData() {
                        const statusStore = useStatusStore();
                        if (this.initialDataLoaded && this.initialAllAssets.length > 0) return;
                        statusStore.setGlobalLoading(true, 'fetchInitialData');

                        try {
                                const allAssets = await $fetch<PropertyType[]>('/api/property/list');
                                // 💡 리스트의 각 항목에 대해 날짜 변환 적용
                                const transformedAssets = allAssets.map(asset => transformPropertyResponse(asset));

                                this.initialAllAssets = transformedAssets;
                                this.initialAssetIds = transformedAssets.map(a => a.id);

                                this.generateAdminListFromInitial();
                                this.applyFilter();
                                this.initialDataLoaded = true;

                        } catch (e: any) {
                                statusStore.setGlobalError('Failed to load initial property data.', 'fetchInitialData');
                                console.error('fetchInitialData Error:', e);
                        } finally {
                                statusStore.setGlobalLoading(false);
                        }
                },

                async fetchAdminList() {
                        if (this.adminListLoaded) return;
                        const statusStore = useStatusStore();
                        statusStore.setGlobalLoading(true, 'fetchAdminList');

                        try {
                                const adminData = await $fetch<AdminListType[]>('/api/property/list/admin');

                                this.adminList = adminData.map((item, idx) => ({
                                        ...item,
                                        createdAt: new Date(item.createdAt),
                                        updatedAt: new Date(item.updatedAt),
                                        no: idx + 1
                                }));
                                this.filteredAdminList = this.adminList;
                                this.adminListLoaded = true;

                        } catch (e: any) {
                                statusStore.setGlobalError('Failed to load admin list.', 'fetchAdminList');
                                console.error(e);
                        } finally {
                                statusStore.setGlobalLoading(false);
                        }
                },

                async fetchPropertyDetail(propertyId: string) {
                        this.currentPropertyId = propertyId;
                        const statusStore = useStatusStore();
                        statusStore.setGlobalLoading(true, 'fetchPropertyDetail');

                        try {
                                const response = await $fetch<PropertyType>(`/api/property/${propertyId}`);
                                // 💡 단일 자산 상세 정보 변환
                                this.currentProperty = transformPropertyResponse(response);
                                return true;
                        } catch (e: any) {
                                statusStore.setGlobalError('Failed to load property details.', 'fetchPropertyDetail');
                                console.error(e);
                                this.currentProperty = null;
                                return false;
                        } finally {
                                statusStore.setGlobalLoading(false);
                        }
                },

                // 💡 [호환성] getProperty (구버전 이름 유지)
                async getProperty(propertyId: string) {
                        return await this.fetchPropertyDetail(propertyId);
                },

                // ------------------------------------------------------------------
                // B. 상태 업데이트 (Local State Update)
                // ------------------------------------------------------------------

                /**
                 * @description 현재 자산 상태를 수동으로 업데이트합니다.
                 */
                setProperty(asset: Partial<PropertyType>) {
                        if (this.currentProperty) {
                                Object.assign(this.currentProperty, asset);

                                // 전체 목록에도 반영
                                const index = this.initialAllAssets.findIndex(p => p.id === this.currentPropertyId);
                                if (index !== -1) {
                                        this.initialAllAssets[index] = { ...this.initialAllAssets[index], ...asset } as PropertyType;
                                }
                        }
                },

                setPropertyPartial(asset: Partial<PropertyType>) {
                        this.setProperty(asset);
                },

                updateFloorList(updatedFloors: FloorType[]) {
                        if (this.currentProperty) {
                                // API 응답이 Raw JSON일 수 있으므로 변환기 통과
                                const transformedFloors = updatedFloors.map(f => {
                                        // 임시 객체로 감싸서 transformPropertyResponse 활용
                                        const temp = { floor: [f] };
                                        transformPropertyResponse(temp);
                                        return temp.floor[0];
                                });

                                this.currentProperty.floor = transformedFloors;

                                const index = this.initialAllAssets.findIndex(p => p.id === this.currentPropertyId);
                                if (index !== -1) {
                                        this.initialAllAssets[index].floor = transformedFloors;
                                }
                        }
                },

                resetProperty() {
                        this.currentProperty = null;
                        this.currentPropertyId = '';
                },

                // ------------------------------------------------------------------
                // C. 필터링 액션
                // ------------------------------------------------------------------

                updateFilter<K extends keyof PropertyState>(key: K, value: PropertyState[K]) {
                        // @ts-ignore
                        this[key] = value;
                        this.applyFilter();
                },

                applyFilter() {
                        if (this.initialAllAssets.length === 0) return;

                        let assets = [...this.initialAllAssets];
                        const filters = this.moreFilters;

                        // 1. Text Search
                        if (this.searchKeyword.trim()) {
                                const keyword = this.searchKeyword.toLowerCase().trim();
                                assets = assets.filter(p =>
                                        p.name.toLowerCase().includes(keyword) ||
                                        p.location?.addressFull?.toLowerCase().includes(keyword) ||
                                        p.location?.addressProvince?.toLowerCase().includes(keyword) ||
                                        p.location?.addressCity?.toLowerCase().includes(keyword)
                                );
                        }

                        // 2. Transaction Type
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

                        // 3. Sectors
                        if (this.filterSectorTypes.length > 0) {
                                assets = assets.filter(p =>
                                        p.sector && this.filterSectorTypes.some(t => t.toLowerCase() === p.sector!.name.toLowerCase())
                                );
                        }

                        if (this.filterSubSectorTypes.length > 0) {
                                assets = assets.filter(p =>
                                        p.subsector && this.filterSubSectorTypes.some(t => t.toLowerCase() === p.subsector!.name.toLowerCase())
                                );
                        }

                        // 4. More Filters
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

                        if (filters.built > 0) {
                                assets = assets.filter(p => {
                                        const completion = p.history.find(h => h.type === 'COMPLETION');
                                        return completion ? parseInt(completion.year) >= filters.built : false;
                                });
                        }
                        if (filters.reno > 0) {
                                assets = assets.filter(p => {
                                        const renovation = p.history.find(h => h.type === 'RENOVATION');
                                        return renovation ? parseInt(renovation.year) >= filters.reno : false;
                                });
                        }

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

                        // Facility
                        if (filters.buildings > 0) assets = assets.filter(p => (p.scale?.noOfBuildings ?? 0) >= filters.buildings);
                        if (filters.basement > 0) assets = assets.filter(p => (p.scale?.basementLevels ?? 0) >= filters.basement);
                        if (filters.upperFloor > 0) assets = assets.filter(p => (p.scale?.upperLevels ?? 0) >= filters.upperFloor);
                        if (filters.elevator > 0) assets = assets.filter(p => (p.facility?.elevatorsTotal ?? 0) >= filters.elevator);
                        if (filters.parking > 0) assets = assets.filter(p => (p.facility?.cpsExisting ?? 0) >= filters.parking);

                        // Finance
                        if (filters.effRatio > 0) assets = assets.filter(p => (p.profitability?.effectiveRatio ?? 0) >= filters.effRatio);
                        if (filters.noc > 0) assets = assets.filter(p => p.transaction.some(t => t.lease && (t.lease.noc ?? 0) >= filters.noc));
                        if (filters.iod > 0) assets = assets.filter(p => p.transaction.some(t => t.lease && (t.lease.iod ?? 0) >= filters.iod));
                        if (filters.gdm > 0) assets = assets.filter(p => p.transaction.some(t => t.lease && (t.lease.gdm ?? 0) >= filters.gdm));

                        this.filteredAssets = assets;
                        this.filteredAssetsIds = assets.map(a => a.id);
                },

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
                // D. 데이터 수정 액션 (CRUD)
                // ------------------------------------------------------------------

                async updatePropertySection<K extends keyof PropertyType>(sectionName: K, data: PropertyType[K]) {
                        if (!this.currentPropertyId) return;

                        const statusStore = useStatusStore();
                        statusStore.setGlobalLoading(true, `update_${String(sectionName)} `);

                        try {
                                const updatedData = await $fetch<PropertyType>(`/api/property/admin/${this.currentPropertyId}/${String(sectionName)}`, {
                                        method: 'PUT',
                                        body: data
                                });

                                // 💡 [수정] 부분 업데이트 응답도 변환
                                const transformedData = transformPropertyResponse(updatedData);

                                if (this.currentProperty) {
                                        // @ts-ignore
                                        this.currentProperty[sectionName] = transformedData;
                                }

                        } catch (e: any) {
                                statusStore.setGlobalError(`Failed to update ${String(sectionName)}.`, `update_${String(sectionName)}`);
                                throw e;
                        } finally {
                                statusStore.setGlobalLoading(false);
                        }
                },

                deleteProperty(propertyId: string) {
                        const statusStore = useStatusStore();

                        statusStore.openConfirmModal(`Are you sure you want to delete property (ID: ${propertyId})?`, async (confirmed) => {
                                if (!confirmed) return;

                                statusStore.setGlobalLoading(true, 'deleteProperty');
                                try {
                                        await $fetch(`/api/property/${propertyId}`, {
                                                method: 'DELETE' as any
                                        });

                                        this.initialAllAssets = this.initialAllAssets.filter(p => p.id !== propertyId);
                                        this.adminList = this.adminList.filter(p => p.propertyId !== propertyId);

                                        this.applyFilter();
                                        this.filterAdminList('');

                                        if (this.currentPropertyId === propertyId) {
                                                this.currentProperty = null;
                                                this.currentPropertyId = '';
                                        }

                                } catch (e: any) {
                                        statusStore.setGlobalError('Failed to delete property.', 'deleteProperty');
                                } finally {
                                        statusStore.setGlobalLoading(false);
                                }
                        });
                },

                async executeDeleteMultipleProperties(propertyIds: string[]) {
                        const statusStore = useStatusStore();
                        statusStore.setGlobalLoading(true, 'executeDeleteMultipleProperties');
                        let isSuccess = true;

                        try {
                                await $fetch('/api/property/bulk', {
                                        method: 'DELETE',
                                        body: { propertyIds },
                                });

                                this.initialAllAssets = this.initialAllAssets.filter(
                                        p => !propertyIds.includes(p.id)
                                );
                                this.adminList = this.adminList.filter(
                                        p => !propertyIds.includes(p.propertyId)
                                );

                                this.applyFilter();

                                if (this.currentPropertyId && propertyIds.includes(this.currentPropertyId)) {
                                        this.currentProperty = null;
                                        this.currentPropertyId = '';
                                }

                        } catch (e) {
                                isSuccess = false;
                                statusStore.setGlobalError('Failed to delete multiple properties.', 'executeDeleteMultipleProperties');
                                console.error('Bulk Delete failed:', e);
                        } finally {
                                statusStore.setGlobalLoading(false);
                        }

                        return isSuccess;
                },

                // ------------------------------------------------------------------
                // E. 유틸리티 (Internal)
                // ------------------------------------------------------------------

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

                setAssetNav(id: string) {
                        this.currentPropertyId = id;
                        return true;
                },

                removeTransaction(transactionId: string) {
                        if (this.currentProperty?.transaction) {
                                this.currentProperty.transaction = this.currentProperty.transaction.filter(t => t.id !== transactionId);
                        }
                }
        }
});
