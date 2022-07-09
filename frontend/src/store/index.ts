import { defineStore } from 'pinia'

export const useStore = defineStore('Store', {
    state: {
        account: '' as string
    }
})
