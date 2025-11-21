<template>
        <main>
                <div class="header min-w-[360px]">
                        <div class="logo">
                        </div>
                        <div class="language">
                                <img src="/images/icons/world-globe-line-icon.svg" class="globe" />
                        </div>
                </div>

                <div class="login-form-title font-calibre text-white text-center min-w-[40vh]">
                        <div class="text-4xl ">CBRE Korea</div>
                        <div class="text-xl">Asset Management System</div>
                </div>

                <div class="login-form-wrapper shadow-xl min-w-[40vh] w-full">
                        <div class="login-form-bg"></div>
                        <div class="login-form p-8 ">

                                <form @submit.prevent="handleLogin" class="flex-1 overflow-hidden space-y-4">
                                        <div class="title font-spaceMono px-0">Log In</div>

                                        <div class="flex flex-col">
                                                <label class="text-sm font-medium text-gray-300 mb-1">Email</label>
                                                <input v-model="email" type="email" placeholder="Enter your email"
                                                        class="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-400 text-white focus:outline-none focus:border-white placeholder-gray-400"
                                                        required />
                                        </div>

                                        <div class="flex flex-col">
                                                <label class="text-sm font-medium text-gray-300 mb-1">Password</label>
                                                <input v-model="password" type="password"
                                                        placeholder="Enter your password"
                                                        class="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-400 text-white focus:outline-none focus:border-white placeholder-gray-400"
                                                        required />
                                        </div>

                                        <div v-if="errorMessage" class="text-red-400 text-sm text-center">
                                                {{ errorMessage }}
                                        </div>

                                        <button class="button font-bold" type="submit" :disabled="!isValid || isLoading"
                                                :class="isValid && !isLoading ? 'bg-cbre_primary_2 text-white hover:bg-cbre_primary_1' : 'bg-cbre_primary_1/60 text-cbre_primary_5/50 cursor-not-allowed'">
                                                <span v-if="isLoading">Logging in...</span>
                                                <span v-else>Log In</span>
                                        </button>

                                        <div class="register text-center mt-4">
                                                <span class="text-gray-300">New to System? </span>
                                                <a href="/signup"
                                                        class="hover:underline cursor-pointer text-white font-bold">Request
                                                        Access</a>
                                        </div>

                                        <div class="eula font-calibre break-all text-gray-300 text-xs mt-6 opacity-70">
                                                EULA – You acknowledge and agree to use this system for your sole and
                                                exclusive benefit only while you are employed in CBRE Korea. You do not
                                                own or have any ownership to any of the data in the system and the data
                                                may not be assigned and /or transferred.
                                        </div>
                                </form>

                        </div>
                </div>
        </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuth } from '#imports';

definePageMeta({
        layout: 'auth-layout',
        middleware: 'auth',
        auth: {
                unauthenticatedOnly: true,
                navigateAuthenticatedTo: '/',
        },
});

const { signIn } = useAuth();
const router = useRouter();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// 간단한 유효성 검사
const isValid = computed(() => {
        return email.value.trim().length > 0 && password.value.trim().length > 0;
});

const handleLogin = async () => {
        if (!isValid.value) return;

        isLoading.value = true;
        errorMessage.value = '';

        try {
                const res = await signIn('credentials', {
                        email: email.value,
                        password: password.value,
                        redirect: false, // 리다이렉트 수동 처리
                });

                if (res?.error) {
                        errorMessage.value = 'Invalid email or password. Please try again.';
                } else {
                        router.push({ name: "index" });
                }
        } catch (error: any) {
                console.error('Login error:', error);
                errorMessage.value = 'An unexpected error occurred.';
        } finally {
                isLoading.value = false;
        }
}
</script>

<style scoped>
/* 기존 스타일 유지 */
.header {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100px;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
}

.logo {
        position: relative;
        padding-top: 30px;
        padding-left: 40px;
}

.language {
        position: relative;
        padding-top: 30px;
        padding-right: 40px;
}

.globe {
        position: absolute;
        width: 16px;
        height: 16px;
        margin-top: 7px;
        margin-left: 11px;
        color: white;
}

.login-form-wrapper {
        position: relative;
        width: 40vh;
        height: 55vh;
        /* 높이 조정 */
}

.login-form-title {
        padding: 1vh 0;
        backdrop-filter: blur(10px);
        font-weight: 600;
}

.login-form-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        z-index: 50;
}

.login-form {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 60;
        color: white;
        display: flex;
        flex-direction: column;
}

.login-form .title {
        font-weight: 800;
        padding-left: 0px;
        margin-bottom: 1.5vh;
        font-size: 1.5rem;
}

.login-form .button {
        width: 100%;
        height: 45px;
        outline: none;
        border-radius: 8px;
        margin-top: 20px;
        font-size: 16px;
        transition: background-color 0.3s;
}
</style>