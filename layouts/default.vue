<template>
        <div id="DefaultLayout" class="bg-gray-100 h-screen">
                <NavTopBar />
                <main class="relative ">
                        <slot />
                </main>
        </div>
</template>

<script setup lang="ts">
import NavTopBar from '~/components/nav/TopBar.vue';
</script>

<style scoped></style>