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
                                        <span class="hidden md:flex whitespace-nowrap">Property Management System</span>
                                        <span class="flex md:hidden whitespace-nowrap">PMS</span>
                                </div>
                        </div>

                        <div id="right-menu" class="flex z-20 h-full">

                                <div v-for="(item, index) in filteredNavItems" :key="index"
                                        class="group flex items-center px-2 md:px-4 h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50 cursor-pointer"
                                        @click="navigateTo(item.link)">
                                        <div
                                                class="flex justify-center items-center gap-1 font-calibre text-sm font-bold">
                                                <Icon :name="item.icon" size="20"
                                                        class="text-gray-400 group-hover:text-primary" />
                                                <div class="hidden md:flex whitespace-nowrap">{{ item.label }}</div>
                                        </div>
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

                <ul class="cb-slideshow">
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                </ul>

                <div id="Content"
                        class="absolute top-[80px] left-0 w-full h-[calc(100%-80px)] z-10 overflow-y-auto bg-transparent">
                        <slot />
                </div>



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
        icon: string;
}

const navItems: NavItem[] = [
        {
                label: 'Property List',
                link: '/admin',
                icon: 'solar:pen-new-square-outline',
                roles: ['USER', 'ADMIN', 'DEVELOPER']
        },
        {
                label: 'New Property',
                link: '/property/register',
                icon: 'solar:home-add-angle-outline',
                roles: ['ADMIN', 'DEVELOPER']
        },
        {
                label: 'Users',
                link: '/user/list',
                icon: 'solar:user-outline',
                roles: ['ADMIN', 'DEVELOPER']
        },
        {
                label: 'Upload File',
                link: '/property/upload',
                icon: 'solar:upload-outline',
                roles: ['ADMIN', 'DEVELOPER']
        },
        {
                label: 'Download File',
                link: '/api/property/bulk',
                icon: 'solar:download-outline',
                roles: ['ADMIN', 'DEVELOPER']
        }
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

.cb-slideshow,
.cb-slideshow:after {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        z-index: 0;
}

.cb-slideshow:after {
        content: '';
        background: transparent url('/assets/images/background/admin/pattern.png') repeat top left;
        backdrop-filter: brightness(40%) opacity(80%);
}

.cb-slideshow li span {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        background-size: cover;
        background-position: 50% 50%;
        background-repeat: none;
        opacity: 0;
        z-index: 0;
        -webkit-backface-visibility: hidden;
        -webkit-animation: imageAnimation 120s linear infinite 0s;
        -moz-animation: imageAnimation 120s linear infinite 0s;
        -o-animation: imageAnimation 120s linear infinite 0s;
        -ms-animation: imageAnimation 120s linear infinite 0s;
        animation: imageAnimation 120s linear infinite 0s;
}

.cb-slideshow li:nth-child(1) span {
        background-image: url('/assets/images/background/admin/2023-asia-pacific-real-estate-market-outlook-mid-year-review_2736x1824.webp')
}

.cb-slideshow li:nth-child(2) span {
        background-image: url('/assets/images/background/admin/cbre-korea-office-hero-2760x828.webp');
        -webkit-animation-delay: 20s;
        -moz-animation-delay: 20s;
        -o-animation-delay: 20s;
        -ms-animation-delay: 20s;
        animation-delay: 20s;
}

.cb-slideshow li:nth-child(3) span {
        background-image: url('/assets/images/background/admin/investor-relations-module-1664x936.webp');
        -webkit-animation-delay: 40s;
        -moz-animation-delay: 40s;
        -o-animation-delay: 40s;
        -ms-animation-delay: 40s;
        animation-delay: 40s;
}

.cb-slideshow li:nth-child(4) span {
        background-image: url('/assets/images/background/admin/korea-report-live-work-shop-2023-2736x1824.webp');
        -webkit-animation-delay: 60s;
        -moz-animation-delay: 60s;
        -o-animation-delay: 60s;
        -ms-animation-delay: 60s;
        animation-delay: 60s;
}

.cb-slideshow li:nth-child(5) span {
        background-image: url('/assets/images/background/admin/understanding-korea-real-estate-liquidity-flows-and-cap-rates-2736x1824.webp');
        -webkit-animation-delay: 80s;
        -moz-animation-delay: 80s;
        -o-animation-delay: 80s;
        -ms-animation-delay: 80s;
        animation-delay: 80s;
}

.cb-slideshow li:nth-child(6) span {
        background-image: url('/assets/images/background/admin/why-apac-offices-are-different-and-now-is-the-time-to-invest-2736x1824.webp');
        -webkit-animation-delay: 100s;
        -moz-animation-delay: 100s;
        -o-animation-delay: 100s;
        -ms-animation-delay: 100s;
        animation-delay: 100s;
}


@-webkit-keyframes imageAnimation {
        0% {
                opacity: 0;
                -webkit-animation-timing-function: ease-in;
        }

        8% {
                opacity: 1;
                -webkit-transform: scale(1.05);
                -webkit-animation-timing-function: ease-out;
        }

        17% {
                opacity: 1;
                -webkit-transform: scale(1.1);
        }

        22% {
                opacity: 0;
                -webkit-transform: scale(1.1) translateY(-20%);
        }

        25% {
                opacity: 0;
                -webkit-transform: scale(1.1) translateY(-100%);
        }

        100% {
                opacity: 0
        }
}

@-moz-keyframes imageAnimation {
        0% {
                opacity: 0;
                -moz-animation-timing-function: ease-in;
        }

        8% {
                opacity: 1;
                -moz-transform: scale(1.05);
                -moz-animation-timing-function: ease-out;
        }

        17% {
                opacity: 1;
                -moz-transform: scale(1.1);
        }

        22% {
                opacity: 0;
                -webkit-transform: scale(1.1) translateY(-20%);
        }

        25% {
                opacity: 0;
                -moz-transform: scale(1.1) translateY(-100%);
        }

        100% {
                opacity: 0
        }
}

@-o-keyframes imageAnimation {
        0% {
                opacity: 0;
                -o-animation-timing-function: ease-in;
        }

        8% {
                opacity: 1;
                -o-transform: scale(1.05);
                -o-animation-timing-function: ease-out;
        }

        17% {
                opacity: 1;
                -o-transform: scale(1.1);
        }

        22% {
                opacity: 0;
                -webkit-transform: scale(1.1) translateY(-20%);
        }

        25% {
                opacity: 0;
                -o-transform: scale(1.1) translateY(-100%);
        }

        100% {
                opacity: 0
        }
}

@-ms-keyframes imageAnimation {
        0% {
                opacity: 0;
                -ms-animation-timing-function: ease-in;
        }

        8% {
                opacity: 1;
                -ms-transform: scale(1.05);
                -ms-animation-timing-function: ease-out;
        }

        17% {
                opacity: 1;
                -ms-transform: scale(1.1);
        }

        22% {
                opacity: 0;
                -webkit-transform: scale(1.1) translateY(-20%);
        }

        25% {
                opacity: 0;
                -ms-transform: scale(1.1) translateY(-100%);
        }

        100% {
                opacity: 0
        }
}

@keyframes imageAnimation {
        0% {
                opacity: 0;
                animation-timing-function: ease-in;
        }

        8% {
                opacity: 1;
                transform: scale(1.05);
                animation-timing-function: ease-out;
        }

        17% {
                opacity: 1;
                transform: scale(1.1);
        }

        22% {
                opacity: 0;
                -webkit-transform: scale(1.1) translateY(-20%);
        }

        25% {
                opacity: 0;
                -transform: scale(1.1) translateY(-100%);
        }

        100% {
                opacity: 0
        }
}

@media screen and (max-width: 1140px) {
        .cb-slideshow li div h3 {
                font-size: 100px
        }
}

@media screen and (max-width: 600px) {
        .cb-slideshow li div h3 {
                font-size: 50px
        }
}
</style>
