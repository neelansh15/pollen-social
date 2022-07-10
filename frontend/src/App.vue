<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div data-theme="luxury" class="bg-dark-900 text-white min-h-screen">
    <Navbar />
    <router-view />
  </div>
</template>

<style>
</style>
