<template>
        <div class="inline-flex items-center px-4 h-full hover:bg-gray-200/20 hover:underline hover:decoration-primary/50">

                <Menu as="div" class="relative inline-block text-left">
                        <div class="flex flex-col ">
                                <MenuButton class="inline-flex w-full justify-center items-center">
                                                <div
                                                        class="w-[30px] h-[30px] rounded-full bg-gray-200 relative overflow-hidden object-cover">
                                                        <img :src="userImage" />
                                                </div>
                                                
                                        <Icon name="ph:caret-up-down" size="14" class="text-gray-400" />
                                </MenuButton>
                                <span class="font-calibre text-xs">{{ currentUser.user.name }}</span>
                        </div>
                        

                        <transition enter-active-class="transition duration-100 ease-out"
                                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                                leave-active-class="transition duration-75 ease-in"
                                leave-from-class="transform scale-100 opacity-100"
                                leave-to-class="transform scale-95 opacity-0">
                                <MenuItems
                                        class="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div class="px-1 py-1">
                                                <MenuItem v-slot="{ active }">
                                                <button :class="[
                                                        active ? 'bg-primary text-white' : 'text-gray-900',
                                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]
                                                        " @click="()=>{open()}">
                                                        <IconAccount class="w-[24px] h-[24px] mr-1" />
                                                        Account 
                                                </button>
                                                </MenuItem>
                                                <MenuItem v-slot="{ active }">
                                                <button :class="[
                                                        active ? 'bg-primary text-white' : 'text-gray-900',
                                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]
                                                        ">
                                                        <IconSetting class="w-[24px] h-[24px] mr-1" />
                                                        Setting
                                                </button>
                                                </MenuItem>
                                                <MenuItem v-slot="{ active }">
                                                <button :class="[
                                                        active ? 'bg-primary text-white' : 'text-gray-900',
                                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]
                                                        ">
                                                        <IconMore class="w-[24px] h-[24px] mr-1" />
                                                        More
                                                </button>
                                                </MenuItem>
                                        </div>
                                        <div class="px-1 py-1">
                                                <MenuItem v-slot="{ active }">
                                                <button :class="[
                                                        active ? 'bg-primary text-white' : 'text-gray-900',
                                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]
                                                        ">
                                                        <IconAdmin class="w-[24px] h-[24px] mr-1" />

                                                        <NuxtLink to="/admin" target="_blank">Admin</NuxtLink>
                                                </button>
                                                </MenuItem>

                                        </div>

                                        <div class="px-1 py-1">
                                                <MenuItem v-slot="{ active }">
                                                <button @click="handleLogOut()" :class="[
                                                        active ? 'bg-primary text-white' : 'text-gray-900',
                                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]
                                                        ">
                                                        <IconSignout class="w-[24px] h-[24px] mr-1" />

                                                        Sign out
                                                </button>
                                                </MenuItem>
                                        </div>
                                </MenuItems>
                        </transition>
                </Menu>

        </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useModal } from 'vue-final-modal'
import ModalUserProfile from '@/components/modal/UserProfile.vue'

const { getSession } = useAuth()
const currentUser = await getSession() as any

// console.log('UserMenu :: session')
// console.log(currentUser)

import { useUserStore } from '~/stores/user';
const { isLogin, userImage, userId, profile } = storeToRefs(useUserStore());

// // const profileResult = await $fetch("/api/auth/userProfile", {
// //                                 method: "GET",
// //                                 params: {'id': currentUser.user.id},
// //                         }) as any

// onMounted(async ()=>{
//         //로그인 여부
//         if(currentUser?.user && currentUser.user?.id) {

//                isLogin.value = true

//                userId.value = currentUser.user.id as string
//                profile.value.avatar  = currentUser.user.image as string

//                profile.value.id = currentUser.user.id as string
//                profile.value.name = currentUser.user.name as string
//                profile.value.email = currentUser.user.email as string
//                profile.value.avatar = currentUser.user.image as string

//         //        console.log(currentUser.user.id)

//         //        console.log(profileResult)
//         //        console.log(profileResult.data)
//         //        console.log(profileResult.value)
//         //        console.log(profileResult.data.value)

               
              
//         } else {
//                 userImage.value = '/images/avatar/avatar-placeholder.png'
//         }


// })
const { open, close } = useModal({
    component: ModalUserProfile,
    attrs: {
      onClose() {
        close()
      },
      clickToClose: true,
      escToClose: true,
    } as any,
    
  })

const { status, signOut, data: authData } = useAuth()

const handleLogOut = async () => {
        await signOut({
                callbackUrl: '/login',
                redirect: true,
                external: false
        }).then(() => {
                console.log("User successfully logged out")
        }
        )
} 
</script>

<style scoped></style>