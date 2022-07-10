<script lang="ts" setup>
import PostCard from '../components/PostCard.vue';
</script>

<template>
    <div class="p-5 bg-base-300">
        <h1 class="mt-12 font-bold text-4xl font-mont">Dashboard</h1>
    </div>

    <div class="mt-5 p-5">
        <!-- <h1 class="text-2xl font-mont font-semibold">Posts</h1> -->
        <div class="grid grid-cols-5 gap-5 mt-3">
            <PostCard v-for="n in 10" :key="n" />
        </div>
    </div>
</template>