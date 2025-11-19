<template>
        <div class="wrapper px-10 py-10">
               
                <div class="w-full bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none ] " >

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
                                        List of Users ({{  userStore.allUsers.length }})
                                </div>
                <div class="flex gap-5 justify-start items-center font-calibre text-white text-lg mb-2">
                        <span>search field:</span>
                        <select v-model="searchField" class="bg-transparent text-white">
                                <option value="propertyName" class="text-black" selected>Name</option>
                                <option value="addressFull" class="text-black">Address</option>
                        </select>
                        
                        <span>search value: </span>
                        <input type="text" v-model="searchValue" class="bg-transparent border-slate-300 border-0 border-b-2  outline-none px-2 py-0">
                </div>
                
                
                
                
                <Vue3EasyDataTable
                        v-model:items-selected="itemsSelected"
                        show-index
                        :headers="headers"
                        :items="items"
                        :filter-options="filterOptions"
                        :search-field="searchField"
                        :search-value="searchValue"
                        buttons-pagination
                        alternating
                        
                        class="w-[95%] rounded-[15px] overflow-hidden"

                >
                <template #header-name="header">
                        <div class="filter-column">
                                <img src="/images/eglass-filter.png" class="filter-icon" @click.stop="showNameFilter=!showNameFilter" >
                                {{ header.text }}
                                <div class="filter-menu" v-if="showNameFilter">
                                <input v-model="nameCriteria"/>
                                </div>
                        </div>
                </template>
                
                <!-- <template #item-profile.usePhoto="{ profile }">
                        <div class="name-wrapper">
                                <span>{{ profile.usePhoto ? 'Photo' : 'Avatar' }}</span>
                        </div>
                </template> -->

                <!-- <template #item-profile.photo="{ profile }">
                        <div class="name-wrapper">
                                <img class="image" :src="profile.photo" alt="" />
                        </div>
                </template> -->

                <!-- <template #item-image="{ image }">
                        <div class="name-wrapper">
                                <img class="image" :src="image" alt="" />
                        </div>
                </template>

                <template #item-avatar="{ avatar }">
                        <div class="name-wrapper">
                                <img class="image" :src="avatar" alt="" />
                        </div>
                </template> -->

                <template #item-operation="item">
                        <div class="operation-wrapper">
             
                                <img :title="`Delete User : ${item.id}`"
                                src="/images/delete.png"
                                class="operation-icon"
                                @click="deleteUser(item.id)"
                                />
                                <img :title="`Modify User : ${item.id}`"
                                src="/images/edit.png"
                                class="operation-icon"
                                @click="editItem(item.id)"
                                />
                        </div>
                </template>

                </Vue3EasyDataTable>

                <!-- <div class="w-full h-[500px]">
                {{ userStore.allUsers[0] }}
                </div> -->
                </div>
                </div>
        </div>
</template>

<script setup lang="ts">
definePageMeta({
        middleware: "auth",
        layout: 'admin-layout',
});
// import the library
import * as toast from 'mosha-vue-toastify';
const { createToast } = toast;

import "@vueform/slider/themes/default.css";
// reload - get api data
import { useUserStore } from '~/stores/user';
const userStore = useUserStore()
userStore.getAllUsers()

import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import type { Header, Item, ClickRowArgument, FilterOption  } from "vue3-easy-data-table";

const headers: Header[] = [
  { text: "Name", value: "name", sortable: true},
  { text: "Email", value: "email", sortable: true},
  { text: "Role", value: "role" , sortable: true},

  { text: "Company", value: "profile.company", sortable: true},
  { text: "Branch", value: "profile.branch", sortable: true},
  { text: "Department", value: "profile.department"},
  { text: "Title", value: "profile.title"},
  
//   { text: "Avatar", value: "image" },
//   { text: "Photo", value: "profile.photo" },
//   { text: "View", value: "profile.usePhoto" },

  { text: "Operation", value: "operation" },

];

const items = ref<Item[]>(userStore.allUsers)
const itemsSelected = ref<Item[]>([]);
const rowClicked = ref()
const showRow = (item: ClickRowArgument) => {
        rowClicked.value.innerHTML = JSON.stringify(item);
};

const showNameFilter = ref(false);

const nameCriteria = ref('');

const filterOptions = computed((): FilterOption[] => {
  const filterOptionsArray: FilterOption[] = [];


  filterOptionsArray.push({
    field: 'name',
    criteria: nameCriteria.value,
    comparison: (value, criteria): boolean => (value != null && criteria != null &&
      typeof value === 'string' && value.includes(`${criteria}`)),
  });


  return filterOptionsArray;
});

const searchField = ref("name");
const searchValue = ref();

const isEditing = ref(false);
    const editingItem = reactive({
      height: "",
      weight: "",
      id: 0,
    });

const deleteUser = async (id: string) => {
        
        // delete files from s3
        // const s3Result = await useFetch('/api/data/s3FilesById', {
        //         method : 'DELETE',
        //         query : {
        //                 propertyId : propertyId
        //         }
        // })


        // if(s3Result.status.value === "success" ) {
        //         // console.log('delete files from s3')
        //         // console.log(s3Result.data.value)

        //          // delete data from db
        //         const deleteResult = await useFetch('/api/data/items', {
        //                 method : 'DELETE',
        //                 query : {
        //                         propertyId : propertyId
        //                 }
        //         })

        //         if(deleteResult.status.value === "success" ) {
        //                 // console.log('delete data from db')
        //                 // console.log(deleteResult.data.value)

        //                 // 4) TOAST                                        
        //               createToast({
        //                               title: 'Property deleted successful.',
        //                               //@ts-ignore
        //                               description: propertyId
        //                               }, {
        //                                       type: 'info', // 'info', 'danger', 'warning', 'success', 'default'
        //                                       timeout: 2000,
        //                                       showCloseButton: true,
        //                                       position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
        //                                       transition: 'bounce',
        //                                       hideProgressBar: false,
        //                                       swipeClose: true,
        //                 })

        //                 items.value = items.value.filter((el :any) => el.propertyId !== propertyId)
        //         }


        // }
        
        
       


        
};
const router = useRouter()
const editItem = (propertyId: Item) => {
        // isEditing.value = true;
        // const { height, weight, id } = val;
        // editingItem.height = height;
        // editingItem.weight = weight;
        // editingItem.id = id;
        router.push({ path: "/asset/modify/"+propertyId })

};

//const submitEdit = () => {
        // isEditing.value = false;
        // const item = items.value.find((item:any) => item.id === editingItem.id);
        // item.height = editingItem.height;
        // item.weight = editingItem.weight;
//};
</script>

<style scoped>
.wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        z-index:100;
}

.filter-column {
  display: flex;
  align-items: center;
  justify-items: center;
  position: relative;
}
.filter-icon {
  cursor: pointer;
  display: inline-block;
  width: 15px !important;
  height: 15px !important;
  margin-right: 4px;
}

.filter-menu {
  padding: 15px 30px;
  z-index: 1;
  position: absolute;
  top: 30px;
  width: 200px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
}

.sector-selector {
  width: 100%;
}

.name-wrapper {
  padding: 5px;
  display: flex;
  align-items: center;
  justify-items: center;
}
.image {
  margin-right: 10px;
  display: inline-block;
  width: 40px;
  height: 40px;
  /* border-radius: 50%; */
  object-fit: cover;
  box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 10%);
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