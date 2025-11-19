<template>
    <div class="wrapper py-4 px-4">

        <div class="w-full bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none]">

            <div
                class="relative px-[2.5em] pt-[2.5em] pb-[2.5em] backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] flex flex-col gap-5">

                <div
                    class="absolute top-0 left-[50%] -translate-x-[50%] px-[1.5em] py-[1.0em] md:py-[0.5em] text-center text-cbre_primary_3 text-[1.5em] rounded-[0_0_20px_20px] bg-[rgba(230,234,234,1)] before:content-[''] before:absolute before:top-0 before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:bg-transparent  before:shadow-[15px_0_0_0_rgba(230,234,234,1)] after:content-[''] after:absolute after:top-0 after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:bg-transparent  after:shadow-[-15px_0_0_0_rgba(230,234,234,1)]">
                    Asset Management
                </div>

                <div id="ControlPanel" class="flex justify-between items-center mt-5 md:mt-1">
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
                        @click="openCreatePanel">
                        + New Asset
                    </button>
                </div>

                <div class="relative min-h-[500px]">
                    <div v-if="!propertyStore.adminListLoaded || isListLoading"
                        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-lg">
                        <Icon name="svg-spinners:ring-resize" size="48" class="text-cbre_primary_1" />
                        <span class="ml-3 text-lg font-calibreMedium text-cbre_primary_1">Loading Asset List...</span>
                    </div>

                    <AdminTableList :list="paginatedList" :checked-asset-ids="checkedAssetIds"
                        :rows-per-page="rowsPerPage" @toggle-check="toggleCheck" @toggle-all-check="toggleAllCheck"
                        @open-modify-panel="openModifyPanel" />
                </div>


                <div class="flex justify-between items-center flex-wrap gap-3">

                    <div class="flex items-center gap-2">
                        <button v-if="checkedAssetIds.length > 0"
                            class="px-4 py-2 bg-red-600 text-white font-calibreSemiBold rounded-md shadow-md hover:bg-red-700 transition duration-300"
                            @click="deleteCheckedAssets">
                            Delete Selected ({{ checkedAssetIds.length }})
                        </button>
                    </div>

                    <div class="flex items-center gap-4">
                        <select v-model.number="rowsPerPage"
                            class="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-cbre_primary_1 focus:border-cbre_primary_1">
                            <option :value="10">10 per page</option>
                            <option :value="20">20 per page</option>
                            <option :value="50">50 per page</option>
                        </select>
                        <Pagination :current-page="currentPage" :total-pages="totalPages" @prev="prevPage"
                            @next="nextPage" @go-to="goToPage" />
                    </div>
                </div>

            </div>
        </div>
    </div>

    <ClientOnly>
        <AdminModifyPanel v-if="isModifyPanelOpen" />
    </ClientOnly>

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

const propertyStore = usePropertyStore();
const uiStore = useUiStore();
const statusStore = useStatusStore();

const { showToast } = useToast();
const { show: showConfirmModal } = useConfirmModal();


// ----------------------------------------------------------------------
// 2. 반응형 상태 정의 및 Store Refs
// ----------------------------------------------------------------------

const { isModifyPanelOpen } = storeToRefs(uiStore);
const { isGlobalLoading } = storeToRefs(statusStore);
const { adminList: fullAdminList } = storeToRefs(propertyStore);

// 로컬 상태
const searchKeyword = ref<string>('');
const checkedAssetIds = ref<string[]>([]);
const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(20);

const isListLoading = computed(() => isGlobalLoading.value && statusStore.lastAction === 'fetchAdminList');


// ----------------------------------------------------------------------
// 3. Computed Properties (필터링 및 페이징 로직)
// ----------------------------------------------------------------------

/**
 * @description 검색 키워드를 기반으로 리스트를 필터링합니다.
 */
const searchableList = computed(() => {
    const keyword = searchKeyword.value.toLowerCase().trim();
    if (!keyword) {
        return fullAdminList.value;
    }
    return fullAdminList.value.filter((asset: AdminListType) =>
        asset.propertyName.toLowerCase().includes(keyword) ||
        asset.addressFull?.toLowerCase().includes(keyword) ||
        asset.propertyId.toLowerCase().includes(keyword)
    );
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

    // Computed List를 slice하기 전에, 'no' (순번) 필드를 다시 부여합니다.
    return searchableList.value.slice(start, end).map((item, index) => ({
        ...item,
        no: start + index + 1, // 테이블 순번 갱신
    }));
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
const openCreatePanel = () => {
    // 1. 수정할 ID에 null 전달 (생성 모드)
    uiStore.openModifyPanel(null, 'general'); // 💡 수정 필요 없음
};

/**
 * @description 자산 수정 패널을 엽니다.
 * @param propertyId - 수정할 자산의 ID
 */
const openModifyPanel = (propertyId: string) => {
    // 1. 수정할 ID 전달 (수정 모드)
    // 💡 propertyStore.setCurrentPropertyId(propertyId) 삭제됨
    uiStore.openModifyPanel(propertyId, 'general');
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

// --- 페이징 함수 (변경 없음) ---
const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};
const goToPage = (page: number) => {
    currentPage.value = page;
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