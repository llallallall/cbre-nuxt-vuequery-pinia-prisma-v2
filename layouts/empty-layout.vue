<template>
        <div class="bg-darkgreen w-screen h-screen overflow-hidden min-w-[360px]">
                <div class="container_wrapper ">
                        <div class="flex w-full h-[65%] relative overflow-hidden ">
                                <div class="bg-darkgreen/60 absolute w-full h-full z-10"></div>
                                <div class="bg-image-01"></div>
                                <div class="bg-image-02"></div>
                        </div>
                        <div class="bg-footer"></div>
                </div>

                <div class="relative  w-screen h-screen z-20">
                        <slot />
                </div>
        </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.container_wrapper {
        position: absolute;
        width: 100% !important;
        height: 100%;
        display: flex;
        flex-direction: column;
        z-index: 1;
}


.bg-image-01 {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url('/assets/images/background/global-mid-year-outlook.jpg');
        background-size: cover;

}

.bg-image-02 {
        position: relative;
        width: 100%;
        background-image: url('/assets/images/background/zero_ph2_dataviz_homepage_2736x1824px_1110.jpg');
        background-size: cover;

}
</style>