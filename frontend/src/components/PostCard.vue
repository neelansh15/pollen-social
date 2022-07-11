<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const props = defineProps(['post'])

const metadata = ref({
    title: '',
    description: '',
    image: ''
})

onMounted(() => {
    metadata.value = JSON.parse(props.post.metadata)
    console.log(metadata.value.image)
})

</script>

<template>
    <div class="card bg-base-300">
        <!-- <figure><img src="https://placeimg.com/400/225/arch" alt="Random Image" /></figure> -->
        <figure><img :src="metadata.image" :alt="metadata.title" /></figure>
        <div class="card-body">
            <h1 class="card-title">{{ metadata.title }}</h1>
            <p>{{ metadata.description }}</p>
        </div>
    </div>
</template>
