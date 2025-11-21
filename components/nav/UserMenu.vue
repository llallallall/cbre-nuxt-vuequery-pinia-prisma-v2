<template>
        <div
                class="inline-flex items-center px-4 h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">

                <Menu as="div" class="relative inline-block text-left">
                        <div class="flex flex-col cursor-pointer">
                                <MenuButton class="inline-flex w-full justify-center items-center focus:outline-none">
                                        <div
                                                class="w-[30px] h-[30px] rounded-full bg-gray-200 relative overflow-hidden object-cover border border-gray-300">
                                                <img :src="userStore.getUserImage" class="w-full h-full object-cover"
                                                        alt="User Avatar" />
                                        </div>
                                        <Icon name="ph:caret-up-down" size="14" class="text-gray-400 ml-1" />
                                </MenuButton>
                                <span class="font-calibre text-xs text-center mt-1 max-w-[80px] truncate">
                                        {{ userStore.userName || 'User' }}
                                </span>
                        </div>

                        <transition enter-active-class="transition duration-100 ease-out"
                                enter-from-class="transform scale-95 opacity-0"
                                enter-to-class="transform scale-100 opacity-100"
                                leave-active-class="transition duration-75 ease-in"
                                leave-from-class="transform scale-100 opacity-100"
                                leave-to-class="transform scale-95 opacity-0">

                                <MenuItems
                                        class="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                        <div class="px-1 py-1">
                                                <MenuItem v-slot="{ active }">
                                                <button :class="[
                                                        active ? 'bg-primary text-white' : 'text-gray-900',
                                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]" @click="openUserProfile">
                                                        <IconAccount class="w-[20px] h-[20px] mr-2" />
                                                        Account
                                                </button>
                                                </MenuItem>
                                                <MenuItem v-slot="{ active }">
                                                <button :class="[
                                                        active ? 'bg-primary text-white' : 'text-gray-900',
                                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]">
                                                        <IconSetting class="w-[20px] h-[20px] mr-2" />
                                                        Settings
                                                </button>
                                                </MenuItem>
                                        </div>

                                        <div class="px-1 py-1">
                                                <MenuItem v-slot="{ active }">
                                                <a href="/admin" target="_blank" :class="[
                                                        active ? 'bg-primary text-white' : 'text-gray-900',
                                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]">
                                                        <IconAdmin class="w-[20px] h-[20px] mr-2" />
                                                        Admin
                                                </a>
                                                </MenuItem>
                                        </div>

                                        <div class="px-1 py-1">
                                                <MenuItem v-slot="{ active }">
                                                <button @click="handleLogOut" :class="[
                                                        active ? 'bg-red-500 text-white' : 'text-gray-900',
                                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]">
                                                        <IconSignout class="w-[20px] h-[20px] mr-2" />
                                                        Sign out
                                                </button>
                                                </MenuItem>
                                        </div>
                                </MenuItems>
                        </transition>
                </Menu>

                <ModalUserProfile v-model="uiStore.isUserProfileModalOpen"
                        @close="uiStore.toggleUserProfileModal(false)" />

        </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { useUserStore } from '~/stores/user';
import { useUiStore } from '~/stores/ui';
import { useAuth } from '#imports';
import ModalUserProfile from '@/components/modal/UserProfileModal.vue';

const userStore = useUserStore();
const uiStore = useUiStore();
const { signOut } = useAuth();

onMounted(async () => {
        await userStore.getUser();
});

const openUserProfile = () => {
        uiStore.toggleUserProfileModal(true);
};

const handleLogOut = async () => {
        userStore.$reset();
        await signOut({
                callbackUrl: '/login',
                redirect: true,
        });
};
</script>