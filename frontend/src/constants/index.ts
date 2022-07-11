import { ethers } from "ethers"

export const PROFILE_HUB = "0x6129f9B059c06ac68D87f3d33A14Fd73aedd5e2f"
export const BASE_API = "http://localhost:8000"

const ALCHEMY_RINKEBY_API_KEY = "hRZxy9psSSQ5X93BN9QKwEwFMk4QxPKn"
export const readProvider = new ethers.providers.AlchemyProvider(4, ALCHEMY_RINKEBY_API_KEY)
