import { createApp } from 'vue'
import App from './App.vue'

import { router } from './router'
import { createPinia } from 'pinia'
import naive from 'naive-ui'

createApp(App).use(router).use(createPinia()).use(naive).mount('#app')
