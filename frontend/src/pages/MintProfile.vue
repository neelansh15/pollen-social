<script lang="ts" setup>
import axios from 'axios'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { BASE_API } from '../constants';
import { useStore } from '../store';
import { getProfileNFTAddress } from '../utils'
import { isAddress } from 'ethers/lib/utils'
import { computed } from '@vue/reactivity';

const store = useStore()
const { address } = storeToRefs(store)

const name = ref('')

const loading = ref(false)
const disabled = computed(() => !address.value || loading.value)

const error = ref('')
const notice = ref('')

const { addTransaction } = store

async function submit() {
    if (!address.value || !isAddress(address.value)) return
    error.value = ""
    loading.value = true

    const profileNFTAddress = await getProfileNFTAddress(address.value)
    if (profileNFTAddress) {
        error.value = `You have already minted a profile NFT at ${profileNFTAddress}`
        loading.value = false
        return
    }
    try {
        const { data, status } = await axios.post(BASE_API + '/profile/mint', {
            name: name.value,
            address: address.value
        })
        if (status === 200) {
            addTransaction(data.hash)
            notice.value = `Transaction hash ${data.hash}`
        }
        else {
            error.value = data.error
        }
    }
    catch (e) {
        error.value = e as string
    }
    finally {
        loading.value = false
    }
}

</script>

<template>
    <div class="p-5 bg-base-300">
        <h1 class="mt-12 font-bold text-4xl font-mont">Mint Profile</h1>
    </div>

    <div class="mt-5 p-5 mx-auto sm:w-1/3">
        <form @submit.prevent="submit">
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Name</span>
                </label>
                <input type="text" placeholder="Name" maxlength="100" id="name" name="name" class="input input-bordered"
                    v-model="name" />
            </div>


            <div class="form-control mt-5">
                <input type="submit" value="Mint" class="btn btn-primary" :disabled="disabled" />
            </div>
            <p class="mt-3 text-sm">Minting a profile is gasless!</p>

            <div class="mt-5">
                {{ error }}
            </div>
            <div class="mt-5">
                {{ notice }}
            </div>

        </form>
    </div>

</template>
