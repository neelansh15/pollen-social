
import Fastify from 'fastify'
import Moralis from "moralis/node"
import pinataSDK from '@pinata/sdk'
import { ALCHEMY_RINKEBY_API_KEY, appId, masterKey, PINATA_API_KEY, PINATA_API_SECRET, PRIVATE_KEY, serverUrl } from './keys'
import { BASE_GATEWAY, PROFILE_HUB } from './constants'
import { BigNumber, ethers } from 'ethers'
import { snakeCase } from 'lodash'
import ProfileHubABI from './abis/ProfileHub.json'

// NodeJS
import { Readable } from 'stream'

const provider = new ethers.providers.AlchemyProvider(4, ALCHEMY_RINKEBY_API_KEY)
const account = new ethers.Wallet(PRIVATE_KEY, provider)

const fastify = Fastify()
fastify.register(require('@fastify/cors'))
fastify.register(require('@fastify/multipart'), {
    attachFieldsToBody: true
})


const pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET)

fastify.get('/', async (req, reply) => {
    const result = await pinata.testAuthentication()
    reply.send({
        helu: 'there',
        ...result
    })
})

fastify.post('/createPost', async (req, reply) => {
    const image = await (req.body as any).image
    if (!image) reply.send({ error: "No image file" })
    if (!(req.body as any).name.value || !(req.body as any).description.value) reply.send({ error: "Missing name or description fields" })

    const readableStream = Readable.from(await image.toBuffer())

    // IMPORTANT: This is the only fix for Pinata to work. It needs a 'path' property in the Readable Stream
    // @ts-ignore
    readableStream.path = image.filename

    try {
        const imageResult = await pinata.pinFileToIPFS(readableStream)
        const imageURL = BASE_GATEWAY + imageResult.IpfsHash
        const data = {
            name: (req.body as any).name.value,
            description: (req.body as any).description.value,
            image: imageURL,
            external_url: "https://github.com/neelansh15",
            attributes: [
                {
                    trait_type: "Likes",
                    value: 0
                },
                {
                    display_type: "date",
                    trait_type: "Posted on",
                    value: +new Date / 1000
                }
            ]
        }
        const result = await pinata.pinJSONToIPFS(data)
        const nftURL = BASE_GATEWAY + result.IpfsHash

        reply.send({ ...result, url: nftURL })
    }
    catch (e) {
        console.error(e)
        reply.send({
            error: e
        })
    }
})

// Currently anybody can mint. Later can implement whitelist or blacklist on this api endpoint. Problem right now is, it's costing gas. Also, need a mutex in future
fastify.post('/profile/mint', async (req, reply) => {
    const address = (req.body as any).address
    if (!(req.body as any).name || !address || !ethers.utils.isAddress(address)) reply.send({ error: "Incorrect Inputs" })

    const data = {
        name: snakeCase((req.body as any).name) + '.pol',
        description: `${(req.body as any).name} is a distinguised member of the Pollen Social Network`,
        image: "https://openseauserdata.com/files/460e08be69d02def202df2aa38d71744.jpg",
        external_url: "https://github.com/neelansh15",
        attributes: [
            {
                display_type: "date",
                trait_type: "Minted on",
                value: +new Date / 1000
            }
        ]
    }
    try {
        const pinataResult = await pinata.pinJSONToIPFS(data)
        const nftURL = BASE_GATEWAY + pinataResult.IpfsHash

        const profileHub = new ethers.Contract(PROFILE_HUB, ProfileHubABI as any, account)
        const txnResult = await profileHub.mint(address, nftURL)
        reply.send(txnResult)
    }
    catch (e) {
        reply.send({
            error: e
        })
    }
})

fastify.get('/posts', async (req, reply) => {
    try {
        await Moralis.start({ serverUrl, appId, masterKey });

        // Get ongoing tokenId from ProfileHub
        const profileHub = new ethers.Contract(PROFILE_HUB, ProfileHubABI as any, account)
        let tokenId = ((await profileHub.tokenId() as BigNumber).toNumber())

        // Limit to first 9 people's posts for now
        if (tokenId > 9) tokenId = 9

        const nfts: any[] = []

        for (let i = 1; i <= tokenId; i++) {
            const collectionAddress = await profileHub.tokenCollection(i)
            console.log(i, collectionAddress)
            const currentNFTs = await Moralis.Web3API.token.getAllTokenIds({
                chain: 'rinkeby',
                address: collectionAddress,
                limit: 5
            })
            if (currentNFTs) {
                // @ts-ignore
                nfts.push(...currentNFTs.result)
            }
        }

        reply.send(nfts)
    }
    catch (e: any) {
        reply.send({ error: e })
    }
})

// Run the server
const start = async () => {
    try {
        const PORT = process.env.PORT || 8000
        await fastify.listen({ port: PORT })
        console.log(`Listening on http://localhost:${PORT}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
