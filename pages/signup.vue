
<template>
        <main>
                <div class="header min-w-[40vh]">
                        <div class="logo">
                                <!-- <IconCBRELogo width="80px" height="25px" class="text-white" /> -->
                        </div>
                        <!-- <div class="language">
                                <img src="/images/icons/world-globe-line-icon.svg" class="globe" />
                                <select v-model="selectedLanguage" class="select font-notoSans font-light text-sm focus:ring-0 focus:border-white">
        <option v-for="option in options" :value="option.value" class="option">
          {{ option.text }}
        </option>
      </select>
                        </div> -->
                </div>
                <div class="login-form-title font-calibre text-white text-center min-w-[40vh]">
                        <div class="text-4xl ">CBRE Korea
                        </div>
                        <div class="text-xl">Asset Management System
                        </div>
                </div>
                <div class="login-form-wrapper shadow-xl min-w-[40vh]">
                        <div class="login-form-bg"></div>
                        <div class="login-form">

                                <VeeForm :validation-schema="schema" :initial-values="initialValues"
                                        v-slot="{ meta: formMeta, errors: formErrors }" @submit="handleSubmit"
                                        class="flex-1 shadow-lg bg-ct-dark-200 rounded-2xl px-8 py-4 space-y-0">
                                        <div class="title font-spaceMono px-0">Sign Up</div>

                                        <VeeTextInput type="text" name="name" label="Name" placeholder="Name"
                                                leftIcon="fa-user" />

                                        <VeeTextInput type="email" name="email" label="Email" placeholder="Email"
                                                leftIcon="fa-envelope" />
                                        <VeeTextInput type="password" name="password" label="Password" placeholder="Password"
                                                leftIcon="fa-lock" />
                                        <VeeTextInput type="password" name="confirmed" label="Confirmed Password"
                                                placeholder="Confirm Password" leftIcon="fa-lock" />
                                        <button class="button" type="submit" :disabled="!formMeta.valid || isLoading"
                                                :class="formMeta.valid || isLoading ? 'bg-cbre_primary_2 text-white' : 'bg-cbre_primary_1/60 text-cbre_primary_5/50'">Request
                                                Account</button>
                                        <div class="register">
                                                <span class="text-gray-300">Have a account? </span><a href="/signup"
                                                        class="hover:underline cursor-pointer">Log in</a>
                                        </div>


                                </VeeForm>

                        </div>
                </div>
        </main>
</template>

<script setup lang="ts">
definePageMeta({
        layout: 'auth-layout',
        middleware: 'auth',
        auth: {
                unauthenticatedOnly: true,
                navigateAuthenticatedTo: '/',
        },
});



import { configure } from "vee-validate"
import { object, string, ref as yupRef } from "yup";
import { toTypedSchema } from '@vee-validate/yup';
configure({
        validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
        validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
        validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
        validateOnModelUpdate: false, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})

const initialValues = { email: "", password: "", confirmed: "" }
const schema = toTypedSchema(
        object(
                {
                        name: string().required().min(1),
                        email: string().required().email().test("email-is-taken", "Email is already taken", async (value) => !(await existingEmail(value))),
                        password: string().required().min(1).label("Your Password"),
                        confirmed: string().required().label("Your Confirmation Password").oneOf([yupRef("password")], "Passwords do not match"), //Cross-Field Validation
                }
        ));

const isLoading = ref(false)

const existingEmail = async (value: string) => {
        const result = await $fetch("/api/auth/checkemail?email=" + value)
        return result ? true : false;
}

const handleSubmit = async (values: any, actions: any) => {
        isLoading.value = true
        try {
                await useFetch("/api/auth/register", {
                        method: "POST",
                        body: values
                });
                useRouter().push({ name: "login" })
        } catch (error: any) {
                console.log(error)

        } finally {
                isLoading.value = false
                actions.resetForm();
        }

}


</script>


<style scoped>
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

.select {
        background-color: transparent;
        border-width: 2px;
        border-color: rgba(255, 255, 255, 0.4);
        border-radius: 5px;
        padding: 2px 20px 2px 25px;
        color: rgba(255, 255, 255, 0.6);
        /* font-style: normal;
        font-weight: normal; */
        width: 130px;
        height: 30px;
        text-align: center;

}

.option {
        background-color: transparent;
        color: white;
}

.login-form-wrapper {
        position: relative;
        width: 100%;
        height: 45vh;
        /* background-color: white; */

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
        padding: 30px 40px;
        display: flex;
        flex-direction: column;
}

.login-form .title {
        font-weight: 800;
        padding-left: 0px;
        margin-bottom: 1.5vh;
}


.login-form .button {
        width: 100%;
        height: 40px;
        outline: none;
        border-radius: 8px;
        margin: 20px 0;
        font-size: 16px;

}

.login-form .button:focus {
        outline: none;
}

.login-form span {
        font-size: 12px;
        font-weight: 200;

}

.login-form a {
        font-size: 12px;
        font-weight: 400;
}

.login-form .eula {
        margin-top: 10px;
        font-size: 10px;
}
</style>
