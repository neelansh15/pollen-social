import { createApp } from 'vue'
import App from './App.vue'

import { router } from './router'
import { createPinia } from 'pinia'

import "virtual:windi.css";
import "./assets/style.css"
import "vue-connect-wallet/dist/style.css"

createApp(App).use(router).use(createPinia()).mount('#app')
