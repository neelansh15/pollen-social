import { ethers } from 'ethers'
import { PROFILE_HUB, readProvider } from '../constants'
import ProfileHubABI from '../abis/ProfileHub.json'
import { isAddress } from 'ethers/lib/utils'

export async function getProfileNFTAddress(address: string) {
    const profileHub = new ethers.Contract(PROFILE_HUB, ProfileHubABI as any, readProvider)
    const profileNFTAddress = await profileHub.owns(address)
    return (isAddress(profileNFTAddress) && profileNFTAddress !== ethers.constants.AddressZero) ? profileNFTAddress : null
}
