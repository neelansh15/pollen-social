<script lang="ts" setup>
import { ethers } from 'ethers';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useStore } from '../store';
import { getProfileNFTAddress } from '../utils';
import ProfileNFTABI from '../abis/ProfileNFT.json'
import axios from 'axios';
import { BASE_API } from '../constants';
import { useMetaMaskWallet } from 'vue-connect-wallet';

const store = useStore()
const { addTransaction } = store
const { address } = storeToRefs(store)

const name = ref('')
const description = ref('')

const loading = ref(false)
const disabled = computed(() => !address.value || loading.value)

const error = ref('')
const notice = ref('')

const profileNFTAddress = ref('')

onMounted(init)
const wallet = useMetaMaskWallet()
wallet.onAccountsChanged(init)

async function init() {
    profileNFTAddress.value = await getProfileNFTAddress(address.value) ?? ''
}

async function submit(form: any) {
    error.value = ""
    notice.value = ""
    try {
        loading.value = true
        const profileNFTAddress = await getProfileNFTAddress(address.value)
        if (!profileNFTAddress) {
            loading.value = false
            error.value = "No profile NFT found"
            return
        }

        // Generate NFT Metadata
        const formData = new FormData(form.target)
        if (!formData.get('image')) {
            error.value = "No image selected for upload"
            return
        }

        const { data, status } = await axios.post(BASE_API + '/createPost', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        notice.value = `IPFS URL: ${data.url}`

        // Mint the NFT
        if (status === 200) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const profileNFT = new ethers.Contract(profileNFTAddress, ProfileNFTABI as any, provider.getSigner())
            const result = await profileNFT.mint(data.url)
            addTransaction(result.hash)
            notice.value += ` | Transaction Hash: ${result.hash}`
        }
        else {
            error.value = "Error: " + data.error
        }
    }
    catch (e: any) {
        error.value = e
    }
    finally {
        loading.value = false
    }
}

</script>

<template>
    <div class="p-5 bg-base-300">
        <h1 class="mt-12 font-bold text-4xl font-mont">New Post</h1>
        <h3 class="mt-0.5 text-sm">{{ profileNFTAddress }}</h3>
    </div>

    <div class="mt-5 p-5 mx-auto sm:w-1/4">
        <form @submit.prevent="submit">
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Select an Image</span>
                </label>
                <input type="file" class="input" accept="image/*" id="image" name="image" />
            </div>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Title</span>
                </label>
                <input type="text" placeholder="Title" maxlength="100" id="name" name="name" v-model="name"
                    class="input input-bordered" />
            </div>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Description</span>
                </label>
                <textarea type="text" placeholder="Description" maxlength="100" id="description" name="description"
                    v-model="description" class="textarea textarea-bordered resize-none" />
            </div>

            <div class="form-control mt-5">
                <input type="submit" value="Post" class="btn btn-primary" :disabled="disabled" />
            </div>

            <div class="mt-5">
                {{ error }}
            </div>
            <div class="mt-5">
                {{ notice }}
            </div>

        </form>
    </div>

</template>
