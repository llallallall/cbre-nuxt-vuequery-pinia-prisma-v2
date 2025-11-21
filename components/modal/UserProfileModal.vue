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

                        <div class="flex h-full flex-col md:flex-row">

                                <div
                                        class="w-full md:w-1/3 min-w-[300px] p-8 bg-gray-50 border-r flex flex-col items-center">

                                        <img :src="userStore.getUserImage" alt="User Avatar"
                                                class="w-32 h-32 rounded-full object-cover border-4 border-cbre_primary_1 shadow-md mb-4" />

                                        <h2 class="text-2xl font-semibold text-dark mb-1">{{ userStore.userName ||
                                                'UserName' }}</h2>
                                        <div class="w-full text-left space-y-3 mt-6">
                                                <div class="flex items-center text-sm">
                                                        <Icon name="ion:business"
                                                                class="w-5 h-5 mr-3 text-cbre_primary_1" />
                                                        <span class="font-medium text-darkgray">Company:</span>
                                                        <span class="ml-2 text-dark">{{ profile?.company || 'N/A'
                                                                }}</span>
                                                </div>
                                                <div class="flex items-center text-sm">
                                                        <Icon name="ion:briefcase"
                                                                class="w-5 h-5 mr-3 text-cbre_primary_1" />
                                                        <span class="font-medium text-darkgray">Department:</span>
                                                        <span class="ml-2 text-dark">{{ profile?.department || 'N/A'
                                                                }}</span>
                                                </div>
                                                <div class="flex items-center text-sm">
                                                        <Icon name="ion:ribbon"
                                                                class="w-5 h-5 mr-3 text-cbre_primary_1" />
                                                        <span class="font-medium text-darkgray">Title:</span>
                                                        <span class="ml-2 text-dark">{{ profile?.title || 'N/A'
                                                                }}</span>
                                                </div>
                                        </div>

                                        <button @click="handleLogout"
                                                class="mt-auto w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition mt-8">
                                                Logout
                                        </button>
                                </div>

                                <div class="w-full md:w-2/3 p-8 overflow-y-auto">
                                        <h2 class="text-2xl font-bold text-dark mb-6 border-b pb-2">Edit Profile</h2>

                                        <form @submit.prevent="handleSave" class="space-y-6">

                                                <div>
                                                        <label
                                                                class="block text-sm font-medium text-gray-700">Name</label>
                                                        <input :value="userStore.userName" type="text" disabled
                                                                class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 text-gray-500 cursor-not-allowed shadow-sm" />
                                                </div>

                                                <div>
                                                        <label
                                                                class="block text-sm font-medium text-gray-700">Company</label>
                                                        <input v-model="formProfile.company" type="text"
                                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cbre_primary_1 focus:ring focus:ring-cbre_primary_1 focus:ring-opacity-50 p-2" />
                                                </div>

                                                <div>
                                                        <label
                                                                class="block text-sm font-medium text-gray-700">Department</label>
                                                        <input v-model="formProfile.department" type="text"
                                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cbre_primary_1 focus:ring focus:ring-cbre_primary_1 focus:ring-opacity-50 p-2" />
                                                </div>

                                                <div>
                                                        <label
                                                                class="block text-sm font-medium text-gray-700">Title</label>
                                                        <input v-model="formProfile.title" type="text"
                                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cbre_primary_1 focus:ring focus:ring-cbre_primary_1 focus:ring-opacity-50 p-2" />
                                                </div>

                                                <div class="flex items-center">
                                                        <input v-model="formProfile.useProfileImage" id="useImage"
                                                                type="checkbox"
                                                                class="h-4 w-4 text-cbre_primary_1 border-gray-300 rounded focus:ring-cbre_primary_1" />
                                                        <label for="useImage" class="ml-2 block text-sm text-gray-700">
                                                                Use custom profile image
                                                        </label>
                                                </div>

                                                <div v-if="formProfile.useProfileImage"
                                                        class="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
                                                        <p class="text-sm text-gray-500">Image upload feature coming
                                                                soon.</p>
                                                </div>

                                                <div class="flex justify-end pt-4 border-t">
                                                        <button type="submit" :disabled="isLoading"
                                                                class="px-6 py-2 bg-cbre_primary_1 text-white font-semibold rounded-lg shadow-md hover:bg-cbre_primary_2 transition disabled:opacity-50 flex items-center">
                                                                <svg v-if="isLoading"
                                                                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                                        xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                        viewBox="0 0 24 24">
                                                                        <circle class="opacity-25" cx="12" cy="12"
                                                                                r="10" stroke="currentColor"
                                                                                stroke-width="4"></circle>
                                                                        <path class="opacity-75" fill="currentColor"
                                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                                        </path>
                                                                </svg>
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
import { ref, reactive, computed } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import { storeToRefs } from 'pinia';
import { useUiStore } from '~/stores/ui';
import { useUserStore } from '~/stores/user';
import { useStatusStore } from '~/stores/status';
import { useAuth } from '#imports';
import { createToast } from 'mosha-vue-toastify';
import type { ProfileType } from '~/types/user.type';

// Stores
const uiStore = useUiStore();
const userStore = useUserStore();
const statusStore = useStatusStore();
const { signOut } = useAuth();

// State
const { isUserProfileModalOpen } = storeToRefs(uiStore);
const { profile } = storeToRefs(userStore);
const { isGlobalLoading } = storeToRefs(statusStore);
const isLoading = computed(() => isGlobalLoading.value);

// Form State (Clone initial profile data)
// ProfileType의 모든 필드를 초기화
const formProfile = reactive<ProfileType>({
        id: null,
        userId: null,
        imageUrl: null,
        company: null,
        branch: null,
        department: null,
        title: null,
        useProfileImage: false,
        ...JSON.parse(JSON.stringify(profile.value || {}))
});

// Handlers
const handleClose = () => {
        uiStore.toggleUserProfileModal(false);
};

const handleLogout = async () => {
        uiStore.toggleUserProfileModal(false);
        userStore.$reset();
        await signOut({ callbackUrl: '/login', redirect: true });
};

const handleSave = async () => {
        statusStore.setGlobalLoading(true);

        try {
                // API 호출: Profile 업데이트
                const updatedProfile = await $fetch<ProfileType>('/api/user/profile', {
                        method: 'PUT',
                        body: {
                                userId: userStore.userId, // 필수
                                company: formProfile.company,
                                department: formProfile.department,
                                title: formProfile.title,
                                useProfileImage: formProfile.useProfileImage,
                                // imageUrl: ... (이미지 업로드 로직 추가 시)
                        }
                });

                // Store 업데이트
                userStore.updateProfile(updatedProfile);

                createToast({ title: 'Profile updated successfully.' }, { type: 'success' });
                handleClose();

        } catch (error) {
                console.error(error);
                createToast({ title: 'Failed to update profile.' }, { type: 'danger' });
        } finally {
                statusStore.setGlobalLoading(false);
        }
};
</script>

<style scoped>
/* Tailwind CSS 사용 */
</style>