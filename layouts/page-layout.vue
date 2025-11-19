<template>
        <div id="PageLayout" class="bg-gray-100 h-screen">
                <div id="TopMenu" class="fixed top-0 w-full h-[80px] 
                flex justify-between items-stretch 
                px-2 sm:px-4 md:px-6 lg:px-10 
                transition-all duration-500
                bg-white text-darkgreen border-gray-200 border-b z-20
                ">
                        <div id="LeftMenu" class="flex items-center w-full h-full z-20">
                                <div class=" min-w-[110px] flex items-center justify-center cursor-pointer"
                                        @click="navigateTo('/')">

                                        <IconCBRELogo width="80px" height="25px" class="text-inherit" />
                                        <sub class="text-[14px] font-calibreBold translate-y-1 ml-1">Map</sub>
                                </div>
                                <div class="ml-[10px] h-[30px] pt-[8px] font-calibre ">
                                        <span class="hidden md:flex whitespace-nowrap">Asset Management System</span>
                                        <span class="flex md:hidden whitespace-nowrap">AMS</span>
                                </div>

                        </div>
                        <div id="right-menu" class="flex z-20 h-full">

                                <div @click="navigateTo('/')"
                                        class="group flex items-center px-4 h-full hover:bg-gray-100 cursor-pointer transition-colors">
                                        <Icon name="ion:home-outline" class="w-5 h-5 group-hover:text-darkgreen" />
                                        <span
                                                class="hidden md:block ml-2 text-sm font-calibreMedium text-gray-700 group-hover:text-darkgreen">
                                                Home
                                        </span>
                                </div>


                                <div @click="goPrevious()"
                                        class="group flex items-center justify-center h-full px-2 md:px-4 cursor-pointer transition-colors hover:bg-gray-100"
                                        :class="!previousAssetId ? 'opacity-50 cursor-not-allowed' : ''"
                                        :title="previousAssetId ? 'Previous Asset' : 'No Previous Asset'">
                                        <div
                                                class="flex items-center text-sm font-calibreMedium text-gray-700 group-hover:text-darkgreen whitespace-nowrap">
                                                <Icon name="ion:chevron-back-outline" class="w-5 h-5" />
                                                <span class="hidden md:block">Previous</span>
                                        </div>
                                </div>

                                <div @click="goNext()"
                                        class="group flex items-center justify-center h-full px-2 md:px-4 cursor-pointer transition-colors hover:bg-gray-100"
                                        :class="!nextAssetId ? 'opacity-50 cursor-not-allowed' : ''"
                                        :title="nextAssetId ? 'Next Asset' : 'No Next Asset'">
                                        <div
                                                class="flex items-center text-sm font-calibreMedium text-gray-700 group-hover:text-darkgreen whitespace-nowrap">
                                                <span class="hidden md:block">Next</span>
                                                <Icon name="ion:chevron-forward-outline" class="w-5 h-5" />
                                        </div>
                                </div>

                                <div class="h-full w-[1px] bg-gray-200 mx-2 my-auto"></div>

                                <div v-if="isAuthenticated" class="flex items-center h-full space-x-3">

                                        <div class="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                                                @click="openUserProfileModal"
                                                :title="`Logged in as ${sessionUser?.name || 'User'}`">
                                                <img :src="userImage || '/images/avatar/avatar-placeholder.png'"
                                                        alt="User Avatar" class="w-full h-full object-cover" />
                                        </div>

                                        <button @click="handleLogout"
                                                class="px-3 py-1 text-sm font-medium text-white bg-darkgreen rounded-md hover:bg-opacity-80 transition">
                                                Logout
                                        </button>
                                </div>

                                <div v-else class="flex items-center h-full">
                                        <button @click="navigateTo('/login')"
                                                class="px-3 py-1 text-sm font-medium text-white bg-darkgreen rounded-md hover:bg-opacity-80 transition">
                                                Login
                                        </button>
                                </div>

                        </div>

                </div>
                <main class="relative pt-[80px]">
                        <slot />
                </main>
        </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuth } from '#imports'; // useAuth 임포트

// 💡 Store imports: dataStore -> usePropertyStore 로 변경, UI, User Store 추가
import { usePropertyStore } from '~/stores/property';
import { useUserStore } from '~/stores/user';
import { useUiStore } from '~/stores/ui';

const route = useRoute()
useHead({
        title: `${route.meta.title}` || 'App Name',
        meta: [
                { property: 'title', content: `App Name - ${route.meta.title || 'Home'}` },
                { property: 'og:title', content: `App Name - ${route.meta.title || 'Home'}` },
        ]
})

const router = useRouter();
const propertyStore = usePropertyStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const auth = useAuth(); // 인증 정보

const { previousAssetId, nextAssetId } = storeToRefs(propertyStore);

// 💡 로그인 상태 및 사용자 정보 계산
const isAuthenticated = computed(() => auth.status.value === 'authenticated');
const sessionUser = computed(() => auth.data.value?.user);
const userImage = computed(() => userStore.userImage); // User Store에서 이미지 URL 사용

const goPrevious = () => {
        // setAssetNav이 true를 반환하면 이동
        if (propertyStore.setAssetNav(previousAssetId.value)) router.push({ path: "/asset/" + previousAssetId.value });
}

const goNext = () => {
        // setAssetNav이 true를 반환하면 이동
        if (propertyStore.setAssetNav(nextAssetId.value)) router.push({ path: "/asset/" + nextAssetId.value });
}

/**
 * @description 사용자 프로필 모달을 엽니다.
 */
const openUserProfileModal = () => {
        // 💡 uiStore 액션 호출
        uiStore.toggleUserProfileModal(true);
};

/**
 * @description 로그아웃 처리를 수행하고 로그인 페이지로 리디렉션합니다.
 */
const handleLogout = async () => {
        // 💡 Nuxt Auth를 사용하여 로그아웃 처리
        await auth.signOut();
        navigateTo('/login');
};
</script>
