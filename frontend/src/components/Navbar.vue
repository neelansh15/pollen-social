<script lang="ts" setup>
</script>

<template>
    <nav class="navbar bg-base-300">
        <div class="flex-1">
            <router-link to="/" class="btn btn-ghost normal-case text-xl">Pollen Social</router-link>
        </div>
        <div class="flex-none">
            <ul class="menu menu-horizontal p-0">
                <li><a>New Post</a></li>
                <li><a>Profile</a></li>
                <!-- <li tabindex="0">
                    <a>
                        Parent
                        <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24">
                            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                        </svg>
                    </a>
                    <ul class="p-2 bg-base-100">
                        <li><a>Submenu 1</a></li>
                        <li><a>Submenu 2</a></li>
                    </ul>
                </li> -->
            </ul>
        </div>
    </nav>
</template>