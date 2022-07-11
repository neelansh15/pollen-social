<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import PostCard from '../components/PostCard.vue';
import { BASE_API } from '../constants';

onMounted(init)

const loading = ref(false)
const posts = ref([] as any[])

async function init() {
    try {
        loading.value = true

        const { data, status } = await axios.get(BASE_API + '/posts')
        if (status === 200) {
            posts.value = data
        }
        else {
            console.error(data)
        }
    }
    catch (e) {
        console.error(e)
    }
    finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="p-5 bg-base-300">
        <h1 class="mt-12 font-bold text-4xl font-mont">Dashboard</h1>
    </div>

    <div class="mt-5 p-5">
        <!-- <h1 class="text-2xl font-mont font-semibold">Posts</h1> -->
        <div class="grid grid-cols-5 gap-5 mt-3" v-if="!loading">
            <PostCard v-for="post in posts" :key="post.tokenAddress + post.tokenId" :post="post" />
        </div>
        <div v-else>
            Loading posts...
        </div>
    </div>
</template>