<template>
    <div class="wrapper py-4 px-4 ">

        <div class="w-full bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none ">

            <div
                class="relative px-[2.5em] pt-[2.5em] pb-[2.5em] backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] flex flex-col gap-5 ">

                <div
                    class="absolute font-financierMedium top-0 left-[50%] -translate-x-[50%] px-[1.5em] py-[0.2em] md:py-[0.2em] text-center text-cbre_primary_3 text-[2em] rounded-[0_0_20px_20px] bg-[rgba(230,234,234,1)] before:content-[''] before:absolute before:top-0 before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:bg-transparent  before:shadow-[15px_0_0_0_rgba(230,234,234,1)] after:content-[''] after:absolute after:top-0 after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:bg-transparent  after:shadow-[-15px_0_0_0_rgba(230,234,234,1)]">
                    Asset Management
                </div>

                <div v-if="!isOpenPreview" id="ControlPanel" class="flex justify-between items-center mt-5 md:mt-1 ">
                    <div class="flex items-center gap-3">
                        <SearchBar v-model:keyword="searchKeyword" @search="currentPage = 1" />
                        <button
                            class="flex items-center justify-center p-2 rounded-full text-white bg-cbre_primary_1 hover:bg-cbre_primary_2 hover:text-darkgreen transition duration-300"
                            :class="{ 'opacity-60': isListLoading }" :disabled="isListLoading" @click="refreshList">
                            <Icon name="tabler:refresh" size="20" />
                        </button>
                    </div>
                    <button
                        class="px-4 py-2 bg-cbre_primary_2 text-cbre_primary_3 font-calibreSemiBold rounded-md shadow-md hover:opacity-90 transition duration-300"
                        @click="createProperty">
                        + Add New Property
                    </button>
                </div>
                <!-- 💡 Return to List Button (Shown when Modify Panel is Open) -->
                <div v-else class="flex justify-end items-center mt-5 md:mt-1 mb-4">
                    <button
                        class="px-4 py-2 border border-cbre_primary_1 text-cbre_primary_1 font-calibreSemiBold rounded-md bg-white/60 hover:bg-cbre_primary_1 hover:text-white transition duration-300"
                        @click="handleReturnToList">
                        Return to List
                    </button>
                </div>

                <!-- 💡 List View (Hidden when Modify Panel is Open) -->
                <div v-if="!isOpenPreview" class="relative min-h-[500px]
                    px-[0.5em] py-[0.5em] 
                    backdrop-blur-[25px] 
                    shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                    border-2 
                    border-[rgba(255,255,255,0.4)] 
                    rounded-[15px] 
                    flex flex-col 
                    gap-10
                    transition-all duration-600 ease-in-out">
                    <div v-if="!propertyStore.adminListLoaded || isListLoading"
                        class="inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-lg">
                        <Icon name="svg-spinners:ring-resize" size="48" class="text-cbre_primary_1" />
                        <span class="ml-3 text-lg font-calibreMedium text-cbre_primary_1">Loading Asset
                            List...</span>
                    </div>

                    <CommonTable :columns="tableColumns" :data="paginatedList" :checkable="true"
                        :checked-ids="checkedAssetIds" row-key="propertyId" :current-page="currentPage"
                        :total-pages="totalPages" v-model:rows-per-page="rowsPerPage" @toggle-check="toggleCheck"
                        @toggle-all-check="toggleAllCheck" @page-change="handlePageChange" @sort-change="handleSort">
                        <template #sector="{ item }">
                            {{ item.sector }}
                            <span v-if="item.subSector" class="text-xs text-gray-400">({{ item.subSector }})</span>
                        </template>
                        <template #coordinate="{ item }">
                            <div class="flex items-center justify-center gap-1">
                                <span v-if="isValidCoordinate(item.latitude, item.longitude)" class="text-green-600">
                                    <Icon name="mdi:check-circle" size="18" />
                                </span>
                                <span v-else class="text-red-500">
                                    <Icon name="mdi:close-circle" size="18" />
                                </span>
                            </div>
                        </template>
                        <template #action="{ item }">
                            <div class="flex items-center gap-2">
                                <div class="cursor-pointer text-blue-400 hover:text-blue-600"
                                    @click="modifyProperty(item.propertyId)">
                                    <Icon name="tabler:edit" size="20" />
                                </div>
                                <div class="cursor-pointer text-red-400 hover:text-red-600"
                                    @click="deleteProperty(item.propertyId)">
                                    <Icon name="tabler:trash" size="20" />
                                </div>
                            </div>
                        </template>
                    </CommonTable>
                </div>

                <!-- 💡 Preview Container (Shown when Modify Panel is Open) -->
                <div v-else>
                    <PropertyPreviewsContainer />
                    <PropertyModifyPanel />
                </div>

                <div v-if="!isOpenPreview" class="flex justify-between items-center flex-wrap gap-3">
                    <div class="flex items-center gap-2">
                        <button v-if="checkedAssetIds.length > 0"
                            class="px-4 py-2 bg-red-600 text-white font-calibreSemiBold rounded-md shadow-md hover:bg-red-700 transition duration-300"
                            @click="deleteCheckedAssets">
                            Delete Selected ({{ checkedAssetIds.length }})
                        </button>
                    </div>
                </div>

            </div>
        </div>


    </div>

</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import type { AdminListType } from '~/types/property.type';

// ----------------------------------------------------------------------
// 1. Store 및 Composable 가져오기
// ----------------------------------------------------------------------
import { usePropertyStore } from '~/stores/property';
import { useUiStore } from '~/stores/ui';
import { useStatusStore } from '~/stores/status';
import { useToast } from '~/composables/useToast';
import { useConfirmModal } from '~/composables/useConfirmModal';
import SearchBar from '~/components/common/SearchBar.vue';

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const statusStore = useStatusStore();

const { showToast } = useToast();
const { show: showConfirmModal } = useConfirmModal();


// ----------------------------------------------------------------------
// 2. 반응형 상태 정의 및 Store Refs
// ----------------------------------------------------------------------

const { isOpenPreview, isOpenModifyPanel, isGrownPreview } = storeToRefs(uiStore);
const { isGlobalLoading } = storeToRefs(statusStore);
const { adminList: fullAdminList } = storeToRefs(propertyStore);

// 로컬 상태
const searchKeyword = ref<string>('');
const checkedAssetIds = ref<string[]>([]);
const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(10);
const currentSort = ref<{ key: string, order: 'asc' | 'desc' | null }>({ key: '', order: null });

const isListLoading = computed(() => isGlobalLoading.value && statusStore.lastAction === 'fetchAdminList');

const tableColumns = [
    { header: 'No', key: 'no', sortable: true },
    {
        header: 'Property Name',
        key: 'propertyName',
        sortable: true,
        link: (item: any) => `/property/${item.propertyId}`,
        target: '_blank'
    },
    { header: 'Location', key: 'addressCity', sortable: true },
    { header: 'Sector', key: 'sector', slotName: 'sector', sortable: true },
    { header: 'Grade', key: 'grade', sortable: true },
    { header: 'Coordinate', key: 'coordinate', slotName: 'coordinate' },
    { header: 'Action', key: 'action', slotName: 'action' },
];

const formatDate = (date: string | Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
};

const isValidCoordinate = (lat: number | null | undefined, lng: number | null | undefined) => {
    if (!lat || !lng) return false;
    // Korea approximate bounds
    const validLat = lat >= 33 && lat <= 43;
    const validLng = lng >= 124 && lng <= 132;
    return validLat && validLng;
};


// ----------------------------------------------------------------------
// 3. Computed Properties (필터링 및 페이징 로직)
// ----------------------------------------------------------------------

/**
 * @description 전체 목록에 고유 순번(No)을 부여합니다.
 */
const indexedAdminList = computed(() => {
    return fullAdminList.value.map((item, index) => ({
        ...item,
        no: index + 1
    }));
});

/**
 * @description 검색 키워드를 기반으로 리스트를 필터링합니다.
 */
const searchableList = computed(() => {
    let list = [...indexedAdminList.value];
    const keyword = searchKeyword.value.toLowerCase().trim();

    if (keyword) {
        list = list.filter((asset: any) =>
            asset.propertyName.toLowerCase().includes(keyword) ||
            asset.addressFull?.toLowerCase().includes(keyword) ||
            asset.propertyId.toLowerCase().includes(keyword)
        );
    }

    if (currentSort.value.key && currentSort.value.order) {
        list.sort((a: any, b: any) => {
            let valA = a[currentSort.value.key];
            let valB = b[currentSort.value.key];

            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA < valB) return currentSort.value.order === 'asc' ? -1 : 1;
            if (valA > valB) return currentSort.value.order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return list;
});

/**
 * @description 검색 및 필터링된 목록을 기반으로 총 페이지 수를 계산합니다.
 */
const totalPages = computed(() => {
    return Math.ceil(searchableList.value.length / rowsPerPage.value);
});

/**
 * @description 현재 페이지에 표시될 자산 목록을 계산합니다.
 */
const paginatedList = computed<AdminListType[]>(() => {
    const start = (currentPage.value - 1) * rowsPerPage.value;
    const end = start + rowsPerPage.value;

    return searchableList.value.slice(start, end);
});


// ----------------------------------------------------------------------
// 4. Methods (액션)
// ----------------------------------------------------------------------

/**
 * @description 자산 목록을 새로고침합니다.
 */
const refreshList = async () => {
    await propertyStore.fetchAdminList();
    showToast('Asset List Refreshed', 'success');
    currentPage.value = 1;
};

/**
 * @description 새 자산 생성 패널을 엽니다.
 */
const createProperty = () => {
    // 1. 수정할 ID에 null 전달 (생성 모드)
    uiStore.openModifyForm(null, 'general'); // 💡 수정 필요 없음
};

/**
 * @description 자산 수정 패널을 엽니다.
 * @param propertyId - 수정할 자산의 ID
 */
const modifyProperty = (propertyId: string) => {
    propertyStore.fetchPropertyDetail(propertyId);
    uiStore.openModifyForm(propertyId, null);
};

/**
 * @description 리스트로 돌아가기 핸들러 (확인 모달 포함)
 */
const handleReturnToList = async () => {
    const confirmed = await showConfirmModal({
        message: 'Are you sure you want to return to the list? Unsaved changes may be lost.',
        title: 'Return to List',
        confirmText: 'Return',
    });

    if (confirmed) {
        uiStore.closeModifyForm();
    }
};

const deleteProperty = async (propertyId: string) => {
    const confirmed = await showConfirmModal({
        message: '정말로 이 자산을 삭제하시겠습니까? (복구 불가능)',
        title: '자산 삭제 확인',
        confirmText: '삭제',
    });

    if (confirmed) {
        try {
            await propertyStore.deleteProperty(propertyId); // Assuming this action exists
            showToast('자산이 삭제되었습니다.', 'success');
            // Refresh list handled by store or manually
            await propertyStore.fetchAdminList();
        } catch (e) {
            console.error('자산 삭제 실패:', e);
            showToast('자산 삭제 중 오류가 발생했습니다.', 'danger');
        }
    }
};

// --- 체크박스 관련 로직 (변경 없음) ---

const toggleCheck = (propertyId: string) => {
    const index = checkedAssetIds.value.indexOf(propertyId);
    if (index > -1) {
        checkedAssetIds.value.splice(index, 1);
    } else {
        checkedAssetIds.value.push(propertyId);
    }
};

const toggleAllCheck = (isChecked: boolean) => {
    if (isChecked) {
        paginatedList.value.forEach(asset => {
            if (!checkedAssetIds.value.includes(asset.propertyId)) {
                checkedAssetIds.value.push(asset.propertyId);
            }
        });
    } else {
        paginatedList.value.forEach(asset => {
            const index = checkedAssetIds.value.indexOf(asset.propertyId);
            if (index > -1) {
                checkedAssetIds.value.splice(index, 1);
            }
        });
    }
};

/**
 * @description 선택된 자산들을 일괄 삭제합니다. (Confirm Modal 사용)
 */
const deleteCheckedAssets = async () => {
    if (checkedAssetIds.value.length === 0) {
        showToast('삭제할 자산을 선택해주세요.', 'warning');
        return;
    }

    // Promise 기반 Confirm Modal 호출
    const confirmed = await showConfirmModal({
        message: `선택된 ${checkedAssetIds.value.length}개의 자산을 정말로 삭제하시겠습니까? (복구 불가능)`,
        title: '다중 자산 삭제 확인',
        confirmText: '모두 삭제',
    });

    if (confirmed) {
        try {
            // 💡 다중 삭제 로직을 Store Action으로 위임 (property.ts 수정 필요)
            const success = await propertyStore.executeDeleteMultipleProperties(checkedAssetIds.value);

            if (success) {
                showToast(`${checkedAssetIds.value.length}개의 자산 삭제가 완료되었습니다.`, 'success');
                // 체크 상태 초기화
                checkedAssetIds.value = [];
                // 목록 재로딩은 Store 내부에서 처리했다고 가정
            } else {
                // Store에서 에러 토스트를 이미 띄웠겠지만, 폴백 메시지
                showToast('일부 또는 전체 자산 삭제에 실패했습니다.', 'danger');
            }

        } catch (e) {
            console.error('다중 자산 삭제 실패:', e);
            showToast('다중 자산 삭제 중 알 수 없는 오류가 발생했습니다.', 'danger');
        }
        // 💡 finally 블록에서 setGlobalLoading(false)를 Store에서 처리하도록 위임했습니다.
    }
};

// --- 페이징 함수 ---
const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const handleSort = (sort: { key: string, order: 'asc' | 'desc' | null }) => {
    currentSort.value = sort;
};


// ----------------------------------------------------------------------
// 5. Watchers 및 초기화 (변경 없음)
// ----------------------------------------------------------------------

watch([searchKeyword, rowsPerPage], () => {
    currentPage.value = 1;
    checkedAssetIds.value = [];
});

onMounted(() => {
    if (!propertyStore.adminListLoaded) {
        propertyStore.fetchAdminList();
    }
});

definePageMeta({
    layout: 'admin-layout',
    middleware: ['auth'],
});
</script>


<style scoped>
.wrapper {
    min-height: calc(100vh - 80px);
    /* AdminLayout의 TopMenu 높이를 제외한 최소 높이 */
    padding-top: 20px;
    padding-bottom: 20px;
}

.titleAnimation {
    animation: titleAnimation 10s infinite;
}

@-webkit-keyframes titleAnimation {
    0% {
        opacity: 0;
        -ms-transform: translateY(-300%);
    }

    8% {
        opacity: 1;
        -ms-transform: translateY(0%);
    }

    17% {
        opacity: 1;
        -ms-transform: translateY(0%);
    }

    19% {
        opacity: 0;
        -ms-transform: translateY(100%);
    }

    25% {
        opacity: 0
    }

    100% {
        opacity: 0
    }
}

@keyframes titleAnimation {
    0% {
        opacity: 0;
        transform: translateY(-300%);
    }

    8% {
        opacity: 1;
        transform: translateY(0%);
    }

    17% {
        opacity: 1;
        transform: translateY(0%);
    }

    19% {
        opacity: 0;
        transform: translateY(100%);
    }

    25% {
        opacity: 0
    }

    100% {
        opacity: 0
    }
}
</style>
