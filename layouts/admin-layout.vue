<template>
        <div id="AdminLayout" class="bg-white w-screen h-screen overflow-hidden">

                <div id="TopMenu" class="fixed top-0 w-full h-[80px] 
                flex justify-between items-stretch 
                px-2 sm:px-4 md:px-6 lg:px-10 
                transition-all duration-500
                bg-white text-darkgreen border-gray-200 border-b z-20
                ">

                        <div id="LeftMenu" class="flex items-center w-full h-full z-20">
                                <div class=" min-w-[110px] flex items-center justify-center cursor-pointer"
                                        @click="navigateTo('/admin')">
                                        <IconCBRELogo width="80px" height="25px" class="text-inherit" />
                                        <sub class="text-[14px] font-calibreBold translate-y-1 ml-1">Map</sub>
                                </div>
                                <div class="ml-[10px] h-[30px] pt-[8px] font-calibre ">
                                        <span class="hidden md:flex whitespace-nowrap">Asset Management System</span>
                                        <span class="flex md:hidden whitespace-nowrap">AMS</span>
                                </div>
                        </div>

                        <div id="right-menu" class="flex z-20 h-full">

                                <div v-for="(item, index) in filteredNavItems" :key="index"
                                        class="h-full flex items-center text-sm font-calibre px-2 md:px-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                        @click="navigateTo(item.link)">
                                        <span>{{ item.label }}</span>
                                </div>

                                <div v-if="userRole === 'ADMIN' || userRole === 'DEVELOPER'"
                                        class="h-full flex items-center justify-center cursor-pointer ml-3 px-2 transition-all duration-300"
                                        :class="{ 'bg-darkgreen text-white': isMenuOverlay }"
                                        @click="toggleAdminSideMenu">
                                        <Icon name="ion:menu-sharp" class="w-6 h-6" />
                                </div>

                                <div class="h-full w-[1px] bg-gray-200 mx-2 my-auto"></div>

                                <div v-if="isAuthenticated" class="flex items-center h-full space-x-3">

                                        <div class="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                                                @click="openUserProfileModal"
                                                :title="`Logged in as ${sessionUser?.name || 'User'}`">
                                                <img :src="userStore.userImage || '/images/avatar/avatar-placeholder.png'"
                                                        alt="User Avatar" class="w-full h-full object-cover" />
                                        </div>

                                        <button @click="handleLogout"
                                                class="px-3 py-1 text-sm font-medium text-white bg-darkgreen rounded-md hover:bg-opacity-80 transition">
                                                Logout
                                        </button>
                                </div>

                                <div v-else class="flex items-center h-full">
                                        <button @click="handleLogin"
                                                class="px-3 py-1 text-sm font-medium text-white bg-darkgreen rounded-md hover:bg-opacity-80 transition">
                                                Login
                                        </button>
                                </div>

                        </div>
                </div>

                <div id="Content" class="h-full pt-[80px]">
                        <slot />
                </div>

                <AdminPanel />

        </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuth } from '#imports';
import { useUserStore } from '~/stores/user';
import { useUiStore } from '~/stores/ui';
import type { RoleEnum } from '~/types/property.type'; // RoleEnum 임포트 경로 가정

// ----------------------------------------------------
// 1. Store 및 Composables 초기화
// ----------------------------------------------------
const auth = useAuth();
const userStore = useUserStore();
const uiStore = useUiStore();

// 반응성을 유지하며 Store 상태 가져오기
const { isMenuOverlay } = storeToRefs(uiStore);

// 인증 상태 및 사용자 정보 계산
const authStatus = computed(() => auth.status.value);
const isAuthenticated = computed(() => authStatus.value === 'authenticated');
const sessionUser = computed(() => auth.data.value?.user);
const userRole = computed(() => sessionUser.value?.role as RoleEnum || 'USER'); // 세션에서 role 가져오기

// ----------------------------------------------------
// 2. Navigation Items (권한 기반)
// ----------------------------------------------------
interface NavItem {
        label: string;
        link: string;
        roles: RoleEnum[];
}

const navItems: NavItem[] = [
        { label: 'Main Page', link: '/', roles: ['USER', 'ADMIN', 'DEVELOPER'] }, // 일반 사용자도 접근 가능
        { label: 'Admin List', link: '/admin/list', roles: ['ADMIN', 'DEVELOPER'] },
        { label: 'User Management', link: '/admin/users', roles: ['ADMIN', 'DEVELOPER'] },
        { label: 'System Settings', link: '/admin/settings', roles: ['DEVELOPER'] },
];

const filteredNavItems = computed(() => {
        return navItems.filter(item => item.roles.includes(userRole.value));
});

// ----------------------------------------------------
// 3. 이벤트 핸들러
// ----------------------------------------------------

/**
 * @description Admin Side Menu를 토글합니다.
 */
const toggleAdminSideMenu = () => {
        // ui.ts의 toggleSideMenu 액션을 사용하여 'admin' 메뉴를 제어
        uiStore.toggleOverlay('menu');
}
/**
 * @description 사용자 프로필 모달을 엽니다. (UserProfile.vue와 연동)
 */
const openUserProfileModal = () => {
        uiStore.toggleUserProfileModal(true);
};

/**
 * @description 로그아웃 처리를 수행하고 로그인 페이지로 리디렉션합니다.
 */
const handleLogout = async () => {
        // Nuxt Auth의 signOut()을 사용하여 세션 종료
        await auth.signOut();
        navigateTo('/login');
};

/**
 * @description 로그인 페이지로 이동합니다.
 */
const handleLogin = () => {
        navigateTo('/login');
};
</script>


<style scoped>
/* 원본 CSS 애니메이션 유지 */

/* 애니메이션은 CSS 변환 기반의 Tailwind CSS 클래스를 사용하는 것이 Nuxt에서 성능에 더 좋습니다.
 * 하지만 원본 코드의 복잡한 @keyframes를 최대한 유지합니다.
 */

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

/* Show at least something when animations not supported */
.no-cssanimations .cb-slideshow li span {
        opacity: 1;
}

/* Fallback for no support for CSS Background Size */
.no-backgroundsize .cb-slideshow li.title span.imgInfo {
        opacity: 1;
}
</style>