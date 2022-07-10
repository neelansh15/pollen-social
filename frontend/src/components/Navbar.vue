<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { ConnectWalletButton, useMetaMaskWallet } from 'vue-connect-wallet'
import { useStore } from '../store'

const store = useStore()
const { address } = storeToRefs(store)

const wallet = useMetaMaskWallet()

async function connect() {
    const accounts = await wallet.connect()
    if (typeof accounts === 'string') return

    store.$patch({
        address: accounts[0]
    })
}

async function init() {
    const accounts = await wallet.getAccounts()
    if (typeof accounts === 'string') return
    if (accounts.length > 0) connect()
    else if (address.value) store.$patch({ address: '' })
}

onMounted(init)
wallet.onAccountsChanged(init)
wallet.onChainChanged(init)

</script>

<template>
    <nav class="navbar bg-base-300">
        <div class="flex-1">
            <router-link to="/" class="btn btn-ghost normal-case text-xl">Pollen Social</router-link>
        </div>
        <div class="flex-none">
            <ul class="menu menu-horizontal p-0">
                <li>
                    <router-link to="/new">New Post</router-link>
                </li>
                <li>
                    <router-link to="/">Profile</router-link>
                </li>
                <li>
                    <ConnectWalletButton :address="address || ''" :dark="true">
                        <template #connectWalletButton>
                            <button class="text-[1rem]" @click="connect">Connect Wallet</button>
                        </template>
                    </ConnectWalletButton>
                </li>
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