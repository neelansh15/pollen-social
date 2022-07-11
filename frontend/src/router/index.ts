import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../pages/Home.vue'),
    },
    {
        path: '/new',
        component: () => import('../pages/NewPost.vue'),
    },
    {
        path: '/mint',
        component: () => import('../pages/MintProfile.vue'),
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})
