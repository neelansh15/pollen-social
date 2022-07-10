import { defineStore } from 'pinia'

export const useStore = defineStore('Store', {
    state: () => ({
        address: '' as string
    })
})
