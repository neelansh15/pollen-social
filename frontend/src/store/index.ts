import { defineStore } from 'pinia'
import { readProvider } from '../constants'

export const useStore = defineStore('Store', {
    state: () => ({
        address: '' as string,
        transactions: [] as string[]
    }),
    actions: {
        async addTransaction(hash: string) {
            this.transactions.push(hash)
            await readProvider.waitForTransaction(hash, 1)
            this.removeTransaction(hash)
        },
        removeTransaction(hash: string) {
            this.transactions.filter(txnHash => txnHash != hash)
        }
    }
})
