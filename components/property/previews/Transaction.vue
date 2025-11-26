<template>
        <div>
                <!-- Sale Transactions -->
                <Sale />

                <!-- Lease Transactions -->
                <Lease />
        </div>
</template>

<script setup lang="ts">
import Sale from './Sale.vue';
import Lease from './Lease.vue';
</script>