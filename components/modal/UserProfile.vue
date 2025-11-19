<template>
        <VueFinalModal v-model="isUserProfileModalOpen"
                content-class="w-full h-full flex items-center justify-center p-4"
                overlay-class="bg-black/60 backdrop-blur-sm" content-transition="vfm-fade"
                overlay-transition="vfm-fade">

                <div
                        class="relative w-full max-w-4xl h-full max-h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden">

                        <button class="absolute top-4 right-4 p-2 z-50 text-gray-500 hover:text-gray-900 transition bg-white/70 rounded-full"
                                @click="handleClose" aria-label="Close user profile modal">
                                <Icon name="ion:close-sharp" class="w-6 h-6" />
                        </button>

                        <div class="flex h-full">

                                <div class="w-1/3 min-w-[300px] p-8 bg-gray-50 border-r flex flex-col items-center">

                                        <img :src="avatarUrl" alt="User Avatar"
                                                class="w-32 h-32 rounded-full object-cover border-4 border-accent shadow-md mb-4" />

                                        <h2 class="text-2xl font-semibold text-dark mb-1">{{ userStore.user?.name ||
                                                'User Name' }}</h2>
                                        <p class="text-sm text-darkgray mb-6">{{ userStore.user?.email ||
                                                'user@cbre.com' }}</p>

                                        <div class="w-full text-left space-y-3">
                                                <div class="flex items-center text-sm">
                                                        <Icon name="ion:business" class="w-5 h-5 mr-3 text-accent" />
                                                        <span class="font-medium text-darkgray">Company:</span>
                                                        <span class="ml-2 text-dark">{{ profile?.company || 'N/A'
                                                        }}</span>
                                                </div>
                                                <div class="flex items-center text-sm">
                                                        <Icon name="ion:briefcase" class="w-5 h-5 mr-3 text-accent" />
                                                        <span class="font-medium text-darkgray">Department:</span>
                                                        <span class="ml-2 text-dark">{{ profile?.department || 'N/A'
                                                        }}</span>
                                                </div>
                                                <div class="flex items-center text-sm">
                                                        <Icon name="ion:ribbon" class="w-5 h-5 mr-3 text-accent" />
                                                        <span class="font-medium text-darkgray">Title:</span>
                                                        <span class="ml-2 text-dark">{{ profile?.title || 'N/A'
                                                        }}</span>
                                                </div>
                                        </div>

                                        <button @click="handleClose"
                                                class="mt-auto w-full py-2 bg-dark text-white rounded-lg hover:bg-opacity-80 transition">
                                                Logout
                                        </button>
                                </div>

                                <div class="w-2/3 p-8 overflow-y-auto">
                                        <h2 class="text-2xl font-bold text-dark mb-6 border-b pb-2">Edit Profile</h2>

                                        <form @submit.prevent="handleSave" class="space-y-6">
                                                <div class="grid grid-cols-2 gap-4">
                                                        <label class="block">
                                                                <span class="text-darkgray font-medium">Name
                                                                        (Read-only)</span>
                                                                <input :value="userStore.user?.name" type="text"
                                                                        disabled
                                                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 text-gray-500" />
                                                        </label>
                                                        <label class="block">
                                                                <span class="text-darkgray font-medium">Email
                                                                        (Read-only)</span>
                                                                <input :value="userStore.user?.email" type="email"
                                                                        disabled
                                                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 text-gray-500" />
                                                        </label>
                                                </div>

                                                <label class="block">
                                                        <span class="text-darkgray font-medium">Company</span>
                                                        <input v-model="formProfile.company" type="text"
                                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50 p-2" />
                                                </label>

                                                <label class="block">
                                                        <span class="text-darkgray font-medium">Department</span>
                                                        <input v-model="formProfile.department" type="text"
                                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50 p-2" />
                                                </label>

                                                <label class="block">
                                                        <span class="text-darkgray font-medium">Title</span>
                                                        <input v-model="formProfile.title" type="text"
                                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50 p-2" />
                                                </label>

                                                <div class="flex items-center">
                                                        <input v-model="formProfile.useProfileImage" id="useImage"
                                                                type="checkbox"
                                                                class="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent" />
                                                        <label for="useImage"
                                                                class="ml-2 block text-sm text-darkgray font-medium">
                                                                Use custom profile image (image upload logic needed)
                                                        </label>
                                                </div>

                                                <div class="flex justify-end pt-4 border-t">
                                                        <button type="submit"
                                                                class="px-6 py-2 bg-accent text-dark font-semibold rounded-lg shadow-md hover:bg-opacity-80 transition">
                                                                Save Changes
                                                        </button>
                                                </div>
                                        </form>

                                </div>
                        </div>
                </div>
        </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { useUiStore } from '~/stores/ui'; // UI 상태 제어
import { useUserStore } from '~/stores/user'; // 사용자 데이터
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type { ProfileType } from '~/types/user.type'; // ProfileType 임포트 가정

// ----------------------------------------------------
// 1. Store 상태 구독 및 모달 제어
// ----------------------------------------------------
const uiStore = useUiStore();
const userStore = useUserStore();

// UI Store에서 모달 가시성 상태를 가져옵니다.
const { isUserProfileModalOpen } = storeToRefs(uiStore);

// User Store에서 현재 사용자 프로필 데이터를 가져옵니다.
const { profile, userId, userImage } = storeToRefs(userStore);

// 2. 닫기 핸들러
const handleClose = () => {
        // UI Store 액션을 호출하여 모달을 닫습니다.
        uiStore.toggleUserProfileModal(false);
};

// ----------------------------------------------------
// 2. 프로필 수정 기능 (예시)
// ----------------------------------------------------

// 프로필 데이터 사본을 만들어 폼에 바인딩
const formProfile = ref<ProfileType>({ ...profile.value });

// 폼 저장 핸들러 (실제 API 호출 로직은 userStore 액션에 정의되어야 합니다.)
const handleSave = () => {
        // [TODO]: useStatusStore를 사용하여 로딩/에러 처리
        // userStore.updateProfile(formProfile.value) 액션 호출을 가정합니다.
        console.log('Profile saved:', formProfile.value);
        // 저장 후 모달 닫기
        handleClose();
}

// ----------------------------------------------------
// 3. 커스텀 스타일 (Original CSS를 Tailwind로 변환하여 유지)
// ----------------------------------------------------

const defaultAvatar = '/images/avatar/avatar-placeholder.png'; // 기본 아바타 경로 가정
const avatarUrl = computed(() => {
        // 프로필 이미지를 사용하도록 설정되었으면 해당 URL을, 아니면 기본 아바타를 사용
        if (userImage.value && profile.value?.useProfileImage) {
                return userImage.value;
        }
        return defaultAvatar;
});

</script>

<style scoped>
/* 커스텀 CSS는 Tailwind 클래스로 대체되었으므로 최소화합니다. */
/* 필요한 경우 특정 디자인 오버라이드를 위해 사용될 수 있습니다. */
</style>