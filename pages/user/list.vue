<template>
        <div class="wrapper px-10 py-10">
                <div class="w-full bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none ] ">

                        <div class="relative 
                        px-[2.5em] pt-[7.5em] pb-[2.5em] 
                        backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                        border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] 
                        flex flex-col gap-5">

                                <div class="absolute top-0 left-[50%] -translate-x-[50%] 
                                        px-[1.5em] py-[1.0em] md:py-[0.5em] 
                                        text-center text-cbre_primary_3 text-[1.5em] 
                                        rounded-[0_0_20px_20px] 
                                        bg-[rgba(230,234,234,1)]
                                        before:content-[''] before:absolute before:top-0 before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:bg-transparent  before:shadow-[15px_0_0_0_rgba(230,234,234,1)]
                                        after:content-[''] after:absolute after:top-0 after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:bg-transparent  after:shadow-[-15px_0_0_0_rgba(230,234,234,1)]
                                        ">
                                        List of Users ({{ userStore.allUsers.length }})
                                </div>
                                <div class="flex gap-5 justify-start items-center font-calibre text-white text-lg mb-2">
                                        <span>search field:</span>
                                        <select v-model="searchField" class="bg-transparent text-white">
                                                <option value="name" class="text-black" selected>Name</option>
                                                <option value="email" class="text-black">Email</option>
                                        </select>

                                        <span>search value: </span>
                                        <input type="text" v-model="searchValue"
                                                class="bg-transparent border-slate-300 border-0 border-b-2  outline-none px-2 py-0">
                                </div>

                                <Table :columns="columns" :data="filteredItems" :rows-per-page="rowsPerPage"
                                        :current-page="currentPage" :total-pages="totalPages"
                                        @page-change="handlePageChange" @update:rowsPerPage="handleRowsPerPageChange">
                                        <template #operation="{ item }">
                                                <div class="operation-wrapper">
                                                        <img :title="`Delete User : ${item.id}`"
                                                                src="/images/delete.png" class="operation-icon"
                                                                @click="deleteUser(item.id)" />
                                                        <img :title="`Modify User : ${item.id}`" src="/images/edit.png"
                                                                class="operation-icon" @click="editItem(item.id)" />
                                                </div>
                                        </template>
                                </Table>

                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Table from '~/components/common/Table.vue';
import "@vueform/slider/themes/default.css";
import { useUserStore } from '~/stores/user';

definePageMeta({
        middleware: "auth",
        layout: 'admin-layout',
});

const { showToast } = useToast();
const userStore = useUserStore();
const router = useRouter();

const columns = [
        { header: "Name", key: "name", sortable: true },
        { header: "Email", key: "email", sortable: true },
        { header: "Role", key: "role", sortable: true },
        { header: "Company", key: "profile.company", sortable: true },
        { header: "Branch", key: "profile.branch", sortable: true },
        { header: "Department", key: "profile.department" },
        { header: "Title", key: "profile.title" },
        { header: "Operation", key: "operation", slotName: "operation" },
];

const searchField = ref("name");
const searchValue = ref("");

// Pagination state
const currentPage = ref(1);
const rowsPerPage = ref(10);

const filteredItems = computed(() => {
        let items = userStore.allUsers;

        if (searchValue.value) {
                items = items.filter((item: any) => {
                        const field = searchField.value;
                        const val = getNestedValue(item, field);
                        return val && String(val).toLowerCase().includes(searchValue.value.toLowerCase());
                });
        }

        const start = (currentPage.value - 1) * rowsPerPage.value;
        const end = start + rowsPerPage.value;
        return items.slice(start, end);
});

const totalPages = computed(() => {
        let items = userStore.allUsers;
        if (searchValue.value) {
                items = items.filter((item: any) => {
                        const field = searchField.value;
                        const val = getNestedValue(item, field);
                        return val && String(val).toLowerCase().includes(searchValue.value.toLowerCase());
                });
        }
        return Math.ceil(items.length / rowsPerPage.value);
});


const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const handlePageChange = (page: number) => {
        currentPage.value = page;
};

const handleRowsPerPageChange = (val: number) => {
        rowsPerPage.value = val;
        currentPage.value = 1; // Reset to first page
};


const deleteUser = async (id: string) => {
        // Implement delete logic
        console.log("Delete user", id);
};

const editItem = (propertyId: string) => {
        router.push({ path: "/property/modify/" + propertyId })
};

</script>

<style scoped>
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
</style>
