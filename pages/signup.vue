<template>
        <main>
                <div class="header min-w-[40vh]">
                        <div class="logo"></div>
                </div>
                <div class="login-form-title font-calibre text-white text-center min-w-[40vh]">
                        <div class="text-4xl ">CBRE Korea</div>
                        <div class="text-xl">Asset Management System</div>
                </div>

                <div class="login-form-wrapper shadow-xl min-w-[40vh]">
                        <div class="login-form-bg"></div>
                        <div class="login-form">

                                <form @submit.prevent="handleSignup"
                                        class="flex-1 shadow-lg bg-ct-dark-200 rounded-2xl px-8 py-6 space-y-4 flex flex-col justify-center">
                                        <div class="title font-spaceMono px-0 text-2xl font-bold mb-4">Sign Up</div>

                                        <div class="flex flex-col">
                                                <label class="text-sm font-medium text-gray-300 mb-1">Name</label>
                                                <input v-model="form.name" type="text" placeholder="Your Name"
                                                        class="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-400 text-white focus:outline-none focus:border-white placeholder-gray-400" />
                                        </div>

                                        <div class="flex flex-col">
                                                <label class="text-sm font-medium text-gray-300 mb-1">Email</label>
                                                <input v-model="form.email" type="email" placeholder="Your Email"
                                                        class="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-400 text-white focus:outline-none focus:border-white placeholder-gray-400" />
                                        </div>

                                        <div class="flex flex-col">
                                                <label class="text-sm font-medium text-gray-300 mb-1">Password</label>
                                                <input v-model="form.password" type="password"
                                                        placeholder="Create Password"
                                                        class="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-400 text-white focus:outline-none focus:border-white placeholder-gray-400" />
                                        </div>

                                        <div class="flex flex-col">
                                                <label class="text-sm font-medium text-gray-300 mb-1">Confirm
                                                        Password</label>
                                                <input v-model="form.confirmed" type="password"
                                                        placeholder="Confirm Password"
                                                        class="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-400 text-white focus:outline-none focus:border-white placeholder-gray-400" />
                                        </div>

                                        <div v-if="errorMessage" class="text-red-400 text-sm text-center mt-2">
                                                {{ errorMessage }}
                                        </div>

                                        <button class="button font-bold" type="submit"
                                                :disabled="!isFormValid || isLoading"
                                                :class="isFormValid && !isLoading ? 'bg-cbre_primary_2 text-white hover:bg-cbre_primary_1' : 'bg-cbre_primary_1/60 text-cbre_primary_5/50 cursor-not-allowed'">
                                                <span v-if="isLoading">Processing...</span>
                                                <span v-else>Request Account</span>
                                        </button>

                                        <div class="register text-center mt-4">
                                                <span class="text-gray-300">Have an account? </span>
                                                <a href="/login"
                                                        class="hover:underline cursor-pointer text-white font-bold">Log
                                                        in</a>
                                        </div>

                                </form>

                        </div>
                </div>
        </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
        layout: 'auth-layout',
        middleware: 'auth',
        auth: {
                unauthenticatedOnly: true,
                navigateAuthenticatedTo: '/',
        },
});

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');

const form = reactive({
        name: '',
        email: '',
        password: '',
        confirmed: ''
});

// 이메일 형식 검사
const isValidEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
};

// 폼 유효성 검사
const isFormValid = computed(() => {
        return (
                form.name.trim().length > 0 &&
                isValidEmail(form.email) &&
                form.password.length >= 4 && // 최소 길이 예시
                form.password === form.confirmed
        );
});

// 이메일 중복 체크 API
const checkEmailExists = async (email: string) => {
        try {
                const result = await $fetch<boolean>(`/api/auth/checkemail?email=${email}`);
                return result; // true면 중복
        } catch (e) {
                return false;
        }
};

const handleSignup = async () => {
        if (!isFormValid.value) {
                if (form.password !== form.confirmed) errorMessage.value = "Passwords do not match.";
                else if (!isValidEmail(form.email)) errorMessage.value = "Invalid email format.";
                return;
        }

        isLoading.value = true;
        errorMessage.value = '';

        try {
                // 1. 이메일 중복 체크
                const isTaken = await checkEmailExists(form.email);
                if (isTaken) {
                        errorMessage.value = "Email is already taken.";
                        isLoading.value = false;
                        return;
                }

                // 2. 회원가입 요청
                await $fetch("/api/auth/register", {
                        method: "POST",
                        body: {
                                name: form.name,
                                email: form.email,
                                password: form.password
                        }
                });

                // 성공 시 로그인 페이지로 이동
                router.push({ name: "login" });

        } catch (error: any) {
                console.error("Signup error:", error);
                errorMessage.value = error.data?.message || "Failed to create account.";
        } finally {
                isLoading.value = false;
        }
}
</script>

<style scoped>
/* 기존 스타일 유지 + 일부 조정 */
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

.login-form-wrapper {
        position: relative;
        width: 100%;
        height: 60vh;
        /* 폼이 길어졌으므로 높이 조정 */
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
        padding: 20px 40px;
        display: flex;
        flex-direction: column;
}

.login-form .button {
        width: 100%;
        height: 45px;
        outline: none;
        border-radius: 8px;
        margin: 20px 0;
        font-size: 16px;
        transition: background-color 0.3s;
}
</style>