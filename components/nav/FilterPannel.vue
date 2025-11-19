<template>
        <div class="flex flex-col w-full h-full z-20">
                <div class="w-full flex flex-col justify-start items-start pl-6">
                        <p class="text-4xl 4xs:text-6xl font-financier pt-2 mb-0">Filter</p>
                        <p class="text-2xl 4xs:text-4xl font-financier pt-1 mb-5">Assets</p>
                        <p class="hidden 4xs:flex text-base font-financier text-primary">You can search for an asset by its
                                name, administrative
                                district, or city.</p>

                </div>
                <ul class="w-full grid grid-cols-1 px-6  mt-10">
                        <li class="w-full flex justify-end mt-10">
                                <div class="flex justify-center items-center relative p-0 gap-0 ml-2 hover:cursor-pointer"
                                        @click="emit('isClosed', true)">
                                        <div class="relative flex-1 flex justify-center items-center h-[28px]
                                                border-2 rounded-xl 
                                                py-1 px-2 
                                                border-primary bg-[#e6eaea]
                                                hover:border-[#767676] hover:bg-white ">

                                                <Icon name="mdi:close" size="20" />
                                                <span
                                                        class="font-calibreLight hover:font-calibre text-lg -translate-y-[1px] pr-1">Close</span>
                                        </div>


                                </div>
                        </li>
                </ul>
        </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['isClosed'])
</script>

<style scoped></style>