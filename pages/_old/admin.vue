<template>
    <div class="wrapper py-4 px-4">

        <div class="w-full bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none ]">

            <div
                class="relative  px-[2.5em] pt-[2.5em] pb-[2.5em] backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] flex flex-col gap-5">

                <div
                    class="absolute top-0 left-[50%] -translate-x-[50%] px-[1.5em] py-[1.0em] md:py-[0.5em] text-center text-cbre_primary_3 text-[1.5em] rounded-[0_0_20px_20px] bg-[rgba(230,234,234,1)] before:content-[''] before:absolute before:top-0 before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:bg-transparent  before:shadow-[15px_0_0_0_rgba(230,234,234,1)] after:content-[''] after:absolute after:top-0 after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:bg-transparent after:shadow-[-15px_0_0_0_rgba(230,234,234,1)]">
                    <span class=" text-2xl sm:text-xl md:text-2xl lg:text-3xl font-financierMedium">Total Asset List
                        ({{ totalItemsCount }})</span>
                </div>

                <div class="flex justify-between items-center mb-4 text-sm">
                    <div class="flex items-center gap-4">
                        <label for="rows-per-page" class="text-white whitespace-nowrap">Rows per Page:</label>
                        <select id="rows-per-page" v-model.number="rowsPerPage"
                            class="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cbre_primary_3">
                            <option v-for="option in [5, 10, 20, 50, 100]" :key="option" :value="option">{{ option }}
                            </option>
                        </select>

                        <input type="text" v-model="searchKeyword" placeholder="Search by Name"
                            class="py-1 pl-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cbre_primary_3 w-64" />
                    </div>

                    <button @click="deleteSelected" :disabled="!checkedAssetIds.length"
                        class="px-4 py-2 text-white font-medium rounded-md transition duration-150"
                        :class="checkedAssetIds.length > 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'">
                        Delete Selected ({{ checkedAssetIds.length }})
                    </button>
                </div>


                <div class="max-h-[70vh] overflow-y-auto">
                    <div v-if="appStore.isLoading" class="flex justify-center items-center h-48">
                        <p class="text-cbre_primary_3 text-xl">Loading Data...</p>
                    </div>
                    <table v-else class="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden ">
                        <thead class="bg-cbre_primary_1 text-white">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    <input type="checkbox" :checked="isAllSelected" @change="toggleAllSelection"
                                        class="w-4 h-4 text-cbre_primary_3 bg-gray-100 border-gray-300 rounded focus:ring-cbre_primary_3" />
                                </th>
                                <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                    Actions
                                </th>
                                <th v-for="header in headers" :key="header.key" @click="sortBy(header.key)"
                                    class="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider group whitespace-nowrap ">
                                    {{ header.title }}
                                    <span v-if="sortKey === header.key" class="ml-1">
                                        <svg v-if="sortOrder === 'asc'" class="w-3 h-3 inline-block" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M5 10l5-5 5 5H5z" />
                                        </svg>
                                        <svg v-else class="w-3 h-3 inline-block" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M5 10l5 5 5-5H5z" />
                                        </svg>
                                    </span>
                                    <span v-else class="ml-1 text-gray-400 group-hover:text-white">
                                        <svg class="w-3 h-3 inline-block" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 10l3-3 3 3H7zm0 2l3 3 3-3H7z" />
                                        </svg>
                                    </span>
                                </th>

                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(item, index) in paginatedItems" :key="item.propertyId"
                                :class="{ 'bg-gray-50': index % 2 === 1, 'hover:bg-gray-100': true }">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <input type="checkbox" :checked="checkedAssetIds.includes(item.propertyId)"
                                        @change="toggleCheck(item.propertyId)"
                                        class="w-4 h-4 text-cbre_primary_3 bg-gray-100 border-gray-300 rounded focus:ring-cbre_primary_3" />
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                    <!-- <button @click="editAsset(item.propertyId)"
                                        class="text-cbre_primary_3 hover:text-cbre_primary_2 mr-3 font-semibold">Edit</button>
                                        <button @click="deleteAsset(item.propertyId)"
                                        class="text-red-500 hover:text-red-700 font-semibold">Delete</button> -->
                                    <div class="operation-wrapper">

                                        <img :title="`Delete Property`" src="/images/delete.png"
                                            class="operation-icon text-red-500 hover:text-red-700 font-semibold"
                                            @click="deleteAsset(item.propertyId)" />
                                        <img :title="`Modify Property`" src="/images/edit.png"
                                            class="operation-icon ml-4" @click="editAsset(item.propertyId)" />
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ item.no }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex items-center gap-2">
                                        <img :src="item.mainImageUrl || '/images/placeholder.jpg'" alt="자산 이미지"
                                            class="w-10 h-10 object-cover rounded-md" />
                                        <a :href="`/asset/${item.propertyId}`" target="_blank"
                                            class="text-cbre_primary_3 hover:text-cbre_primary_2 hover:underline transition-colors duration-150">
                                            {{ item.propertyName }}
                                        </a>
                                    </div>
                                </td>



                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.grade }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.sector }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.subSector || '-'
                                    }}</td>

                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.addressProvince }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.addressCity }}
                                </td>

                                <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.addressFull }}</td> -->
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.latitude || '-' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.longitude || '-'
                                    }}</td>

                            </tr>
                            <tr v-if="!paginatedItems.length">
                                <td :colspan="headers.length + 2" class="px-6 py-8 text-center text-gray-500">
                                    No assets found.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex justify-between items-center mt-4">
                    <span class="text-sm text-gray-600">
                        Displaying {{ displayRangeStart }} - {{ displayRangeEnd }} of {{ totalItemsCount }} Assets
                    </span>
                    <div class="flex gap-2">
                        <button @click="prevPage" :disabled="currentPage === 1"
                            class="px-3 py-1 border rounded-md transition duration-150"
                            :class="currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'">
                            Prev
                        </button>
                        <button v-for="page in totalPages" :key="page" @click="currentPage = page"
                            class="px-3 py-1 border rounded-md font-medium transition duration-150"
                            :class="page === currentPage ? 'bg-cbre_primary_3 text-white' : 'bg-white hover:bg-gray-100'">
                            {{ page }}
                        </button>
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="px-3 py-1 border rounded-md transition duration-150"
                            :class="currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'">
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

definePageMeta({
    middleware: "auth",
    layout: 'admin-layout',
});

import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDataStore } from '~/stores/data';
import { usePropertyStore } from '~/stores/property';

import { useAppStore } from '~/stores/app';
import { AdminListType } from '~/types/asset.type';
import * as toast from 'mosha-vue-toastify';
import type { ToastType } from 'mosha-vue-toastify';
import { useModal } from 'vue-final-modal';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import { useModifyPanelStore } from '~/stores/modifyPanel';

const { createToast } = toast;
const router = useRouter();
const dataStore = useDataStore();
const appStore = useAppStore();
const panelStore = useModifyPanelStore()
const propertyStore = usePropertyStore()


panelStore.closePanel()

// --- 1. 상태 및 데이터 초기화 ---
interface Header {
    title: string;
    key: keyof AdminListType; // ✨ key의 타입을 string 대신 keyof AdminListType으로 지정
}

const headers: Header[] = [
    { title: 'No.', key: 'no' },
    { title: 'Name', key: 'propertyName' },
    { title: 'Grade', key: 'grade' },
    { title: 'Sector', key: 'sector' },
    { title: 'Sub Sector', key: 'subSector' },
    { title: 'Province', key: 'addressProvince' },
    { title: 'City', key: 'addressCity' },
    // { title: 'Address', key: 'addressFull' },
    { title: 'Latitude', key: 'latitude' },
    { title: 'Longitude', key: 'longitude' },
];

const searchKeyword = ref('');
// ✨ 정렬 변수명을 'sortKey'와 'sortOrder'로 통일합니다.
const sortKey = ref<keyof AdminListType>('no'); // 기본 정렬 키
const sortOrder = ref<'asc' | 'desc'>('desc');   // 기본 정렬 방향
const currentPage = ref(1);
const rowsPerPage = ref(10);
const checkedAssetIds = computed({
    get: () => dataStore.checkedAssetIds,
    set: (val: string[]) => {
        dataStore.checkedAssetIds = val;
    }
});

// --- 2. Computed Properties (데이터 처리 파이프라인) ---
// 💡 [필터링 -> 정렬 -> 페이지네이션] 순서로 computed를 체이닝하여 구성합니다.

// 1. 검색된 아이템 목록 (필터링)
const filteredItems = computed<AdminListType[]>(() => {
    // 💡 dataStore의 원본 목록을 사용합니다. store에 필터링된 상태를 둘 필요가 없습니다.
    const list = dataStore.adminList;
    if (!searchKeyword.value) {
        return list;
    }
    const keyword = searchKeyword.value.toLowerCase();
    return list.filter(item =>
        item.propertyName.toLowerCase().includes(keyword) ||
        item.addressFull?.toLowerCase().includes(keyword)
    );
});

// 2. 정렬된 아이템 목록 (정렬)
const sortedItems = computed<AdminListType[]>(() => {
    // filteredItems 결과를 정렬합니다.
    const items = [...filteredItems.value];

    items.sort((a, b) => {
        const aVal = a[sortKey.value];
        const bVal = b[sortKey.value];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortOrder.value === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
    });
    return items;
});

// 3. 페이지네이션된 아이템 목록 (페이지네이션) - ✨ 이 computed가 최종적으로 화면에 표시될 데이터입니다.
const paginatedItems = computed<AdminListType[]>(() => {
    // sortedItems 결과를 페이지에 맞게 자릅니다.
    const start = (currentPage.value - 1) * rowsPerPage.value;
    const end = start + rowsPerPage.value;
    return sortedItems.value.slice(start, end);
});


// 4. 페이지네이션 UI를 위한 계산
const totalItemsCount = computed(() => filteredItems.value.length); // ✨ 필터링된 아이템 기준으로 총 개수 계산
const totalPages = computed(() => {
    if (totalItemsCount.value === 0) return 1;
    return Math.ceil(totalItemsCount.value / rowsPerPage.value);
});

// 💡 UI 표시 텍스트를 위한 더 간단하고 표준적인 computed
const displayRangeStart = computed(() => {
    if (totalItemsCount.value === 0) return 0;
    return (currentPage.value - 1) * rowsPerPage.value + 1;
});
const displayRangeEnd = computed(() => {
    return Math.min(currentPage.value * rowsPerPage.value, totalItemsCount.value);
});

// 5. 전체 선택 여부
const isAllSelected = computed(() => {
    return paginatedItems.value.length > 0 && paginatedItems.value.every(item => checkedAssetIds.value.includes(item.propertyId));
});


// --- 3. Actions (데이터 로드 및 테이블 기능) ---

onMounted(async () => {
    if (!dataStore.adminListLoaded) {
        appStore.setLoading(true);
        try {
            await dataStore.getAdminList();
            // 💡 onMounted에서는 데이터 로드만 책임집니다. 필터링은 computed가 알아서 합니다.
        } catch (error) {
            console.error('Error fetching initial Admin List:', error);
        } finally {
            appStore.setLoading(false);
        }
    }
});

// ✨ 정렬 함수: 변수명을 통일합니다.
const sortBy = (column: keyof AdminListType) => {
    if (sortKey.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = column;
        sortOrder.value = 'asc';
    }
};

// ... (toggleCheck, toggleAllSelection, deleteSelected, editAsset, deleteAsset 등 다른 함수들은 그대로 유지) ...
// (아래는 나머지 함수 코드입니다. 변경 사항이 없습니다.)

// 3. 개별 체크/체크 해제
const toggleCheck = (id: string) => {
    const index = checkedAssetIds.value.indexOf(id);
    if (index > -1) {
        checkedAssetIds.value.splice(index, 1);
    } else {
        checkedAssetIds.value.push(id);
    }
};

// 전체 선택 토글
const toggleAllSelection = (e: Event) => {
    const isChecked = (e.target as HTMLInputElement).checked;
    if (isChecked) {
        paginatedItems.value.forEach(item => {
            if (!checkedAssetIds.value.includes(item.propertyId)) {
                checkedAssetIds.value.push(item.propertyId);
            }
        });
    } else {
        paginatedItems.value.forEach(item => {
            const index = checkedAssetIds.value.indexOf(item.propertyId);
            if (index > -1) {
                checkedAssetIds.value.splice(index, 1);
            }
        });
    }
};


// 확인 모달 인스턴스를 동적으로 생성하는 함수
const openConfirmModal = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const { open, close } = useModal({
            component: ConfirmModal,
            attrs: {
                title: 'Delete Asset(s)',
                message: message,
                confirmText: 'Delete',
                // 모달 컴포넌트에서 'confirm' 이벤트 발생 시
                onConfirm() {
                    close();
                    resolve(true); // Promise를 true로 resolve (확인)
                },
                // 모달 컴포넌트에서 'cancel' 이벤트 또는 외부 클릭/ESC 발생 시
                onCancel() {
                    close();
                    resolve(false); // Promise를 false로 resolve (취소)
                },
            },
        });
        open();
    });
};


// 4. 일괄 삭제 (deleteSelected)
const deleteSelected = async () => {

    // 1. 체크된 자산 ID 목록을 가져옴
    const idsToDelete = dataStore.checkedAssetIds;
    if (!idsToDelete.length) return; // 삭제할 자산이 없으면 종료

    // 확인 메시지
    const isConfirmed = await openConfirmModal(`Do you want to bulk delete the ${idsToDelete.length} selected assets`);

    if (!isConfirmed) {
        //if (!confirm(`Do you want to bulk delete the ${idsToDelete.length} selected assets`)) {
        return;
    }

    appStore.setLoading(true);

    // 삭제 결과 추적을 위한 카운터
    let deletedCount = 0;
    let s3FailedCount = 0;
    let dbFailedCount = 0;

    try {

        // checkedAssetIds.value의 각 ID에 대해 순차적으로 삭제 작업을 수행
        for (const propertyId of idsToDelete) {
            console.log(`[Batch Delete] Processing ID: ${propertyId}`);

            // 1. S3 파일 삭제 API 호출 (이미지 먼저 삭제)
            const s3Result = await useFetch('/api/data/s3FilesById', {
                method: 'DELETE',
                query: {
                    propertyId: propertyId
                }
            });

            if (s3Result.status.value !== "success") {
                s3FailedCount++;
                console.error(`S3 삭제 실패 (ID: ${propertyId}, DB 삭제 중단):`, s3Result.error.value);
                // S3 삭제 실패는 DB 삭제로 넘어가지 않고 다음 ID로 이동
                continue;
            }

            // 2. 데이터베이스 데이터 삭제 API 호출 (S3 성공 후에만 실행)
            const deleteResult = await useFetch('/api/data/items', {
                method: 'DELETE',
                query: {
                    propertyId: propertyId
                }
            });

            if (deleteResult.status.value === "success") {
                deletedCount++;
            } else {
                dbFailedCount++;
                console.error(`DB 삭제 실패 (ID: ${propertyId}, ⚠️ S3는 성공! 데이터 불일치 가능성):`, deleteResult.error.value);
                // 💡 개별 경고 토스트 추가
                createToast({
                    title: `Database Record Failed. (ID: ${propertyId})`,
                    description: 'Image file was deleted, but DB record remains. Manual check required.',
                }, {
                    type: 'danger',
                    timeout: 4000,
                    position: 'bottom-right', // 최종 요약 토스트와 겹치지 않도록 위치 변경 고려
                });
                // DB 삭제 실패는 기록하고 다음 ID로 이동 (데이터 불일치 발생)
            }
        }

        // --- 3. 최종 요약 및 목록 갱신 ---

        if (deletedCount > 0) {
            // 성공 건수가 1건 이상일 때만 목록 갱신 및 상태 초기화
            dataStore.adminListLoaded = false;
            await dataStore.getAdminList();

            dataStore.checkedAssetIds = [];
            currentPage.value = 1;

            // 성공/실패 여부에 따른 최종 토스트 메시지 구성
            const summaryTitle = `Bulk Deletion Complete: ${deletedCount} Successful`;
            let summaryDescription = `${deletedCount} out of ${idsToDelete.length} assets were deleted.`;
            let summaryType: ToastType = 'success';

            if (s3FailedCount > 0 || dbFailedCount > 0) {
                summaryDescription += ` (File Errors: ${s3FailedCount}, DB Errors: ${dbFailedCount})`;
                summaryType = 'warning'; // 부분 성공/실패이므로 warning으로 알림
            }

            createToast({
                title: summaryTitle,
                description: summaryDescription,
            }, {
                type: summaryType,
                timeout: 5000,
                showCloseButton: true,
                position: 'top-right',
                transition: 'bounce',
                swipeClose: true,
            });

        } else if (s3FailedCount > 0 || dbFailedCount > 0) {
            // 성공 건수가 0이지만, 실패 건수가 있는 경우 (모두 실패)
            createToast({
                title: 'Bulk Deletion Failed',
                description: `All ${idsToDelete.length} assets failed to delete. (File Errors: ${s3FailedCount}, DB Errors: ${dbFailedCount}). Please check the console.`,
            }, {
                type: 'danger',
                timeout: 7000,
                showCloseButton: true,
                position: 'top-right',
                transition: 'bounce',
                swipeClose: true,
            });
        }

    } catch (error) {
        console.error('Fatal error occurred during bulk deletion:', error); // 네트워크 오류 등
        createToast({
            title: `An unrecoverable error occurred during batch deletion.`,
            description: 'Please check the console.',
        }, {
            type: 'danger',
            timeout: 3000,
            showCloseButton: true,
            position: 'top-right',
            transition: 'bounce',
            swipeClose: true,
        })
    } finally {
        appStore.setLoading(false); // 로딩 종료
    }

};

// 5. 개별 수정 (editAsset)
const editAsset = async (propertyId: string) => {
    const frontKey = Math.random().toString(36).substring(2, 7);
    const rearKey = Math.random().toString(36).substring(2, 7);
    router.push({ path: `/asset/modify/${frontKey}${propertyId}${rearKey}` });
};

// 5. 개별 삭제 (deleteAsset)
const deleteAsset = async (propertyId: string) => {
    // 확인 메시지 유지
    if (confirm(`Do you really want to delete asset ${propertyId}?`)) {

        appStore.setLoading(true); // 로딩 시작
        console.log("개별 삭제 요청 ID:", propertyId);

        // 💡 최종 성공 여부를 추적하여 목록 갱신을 제어하는 플래그
        let isFinalSuccess = false;

        try {

            // 💡 1. S3 파일 삭제 API 호출
            const s3Result = await useFetch('/api/data/s3FilesById', {
                method: 'DELETE',
                query: {
                    propertyId: propertyId
                }
            })

            // S3 파일 삭제 결과 확인 (실패 시 즉시 종료)
            if (s3Result.status.value !== "success") {
                createToast({
                    title: `Failed to delete Image files. (Asset ID: ${propertyId})`,
                    description: 'Database deletion has been interrupted. Please check the console.',
                }, {
                    type: 'warning',
                    timeout: 4000,
                    showCloseButton: true,
                    position: 'top-right',
                    transition: 'bounce',
                    hideProgressBar: false,
                    swipeClose: true,
                });
                return; // ⚠️ S3 실패 시 여기서 함수 종료
            }

            // 💡 2. 데이터베이스 데이터 삭제 API 호출
            const deleteResult = await useFetch('/api/data/items', {
                method: 'DELETE',
                query: {
                    propertyId: propertyId
                }
            })

            // 데이터베이스 삭제 결과 확인
            if (deleteResult.status.value === "success") {
                isFinalSuccess = true;

                // 3. 최종 성공 토스트 출력
                createToast({
                    title: 'Property deleted successful.',
                    description: `Property Id : ${propertyId}`
                }, {
                    type: 'info',
                    timeout: 2000,
                    showCloseButton: true,
                    position: 'top-right',
                    transition: 'bounce',
                    hideProgressBar: false,
                    swipeClose: true,
                })
            } else {
                // ⚠️ DB 삭제 실패 시 (S3는 성공) - 데이터 불일치 경고
                createToast({
                    title: `Failed to delete database record. (Asset ID: ${propertyId})`,
                    description: 'The image files were deleted, but the database record remains. Manual intervention is required.',
                }, {
                    type: 'danger', // 데이터 일관성 문제이므로 'danger' 사용
                    timeout: 5000,
                    showCloseButton: true,
                    position: 'top-right',
                    transition: 'bounce',
                    hideProgressBar: false,
                    swipeClose: true,
                });
                // isFinalSuccess가 false이므로 아래 목록 갱신을 건너뜁니다.
            }

        } catch (error) {
            console.error('개별 삭제 중 치명적인 오류 발생:', error); // 네트워크 오류 등
            createToast({
                title: `An unrecoverable error occurred during the deletion of asset ${propertyId}.`,
                description: 'Please check the console.'
            }, {
                type: 'danger',
                timeout: 3000,
                showCloseButton: true,
                position: 'top-right',
                transition: 'bounce',
                hideProgressBar: false,
                swipeClose: true,
            })
        } finally {

            if (isFinalSuccess) {
                // 💡 S3 삭제와 DB 삭제가 모두 성공했을 때만 목록 재로딩 및 UI 업데이트 (핵심 수정)
                dataStore.adminListLoaded = false;
                await dataStore.getAdminList();

                // 삭제 후, checkedAssetIds에서 제거
                const index = checkedAssetIds.value.indexOf(propertyId);
                if (index > -1) checkedAssetIds.value.splice(index, 1);

                currentPage.value = 1; // 삭제 후 첫 페이지로 이동
            }

            appStore.setLoading(false); // 로딩 종료 (성공 또는 실패 여부와 무관하게)
        }
    }
};


// 7. 페이징 함수
const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};


// --- 4. Watchers ---

// ✨ 검색어, 페이지당 행 수가 변경되면 현재 페이지를 1로 리셋합니다.
// Vue의 반응성 덕분에 필터링은 computed 속성에서 자동으로 처리되므로,
// watch에서는 페이지 번호 초기화만 담당하면 됩니다.
watch([searchKeyword, rowsPerPage], () => {
    currentPage.value = 1;
});
</script>

<style scoped>
/* 기존 스타일 유지 */
.wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    z-index: 100;
}

.operation-wrapper {
    display: flex;
    align-items: center;
    justify-items: center;
}

.operation-wrapper .operation-icon {
    width: 20px;
    cursor: pointer;
}

/* 필요한 스타일 추가 */
</style>