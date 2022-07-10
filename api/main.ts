
import Fastify from 'fastify'
import pinataSDK from '@pinata/sdk'
import { PINATA_API_KEY, PINATA_API_SECRET } from './keys'
import { BASE_GATEWAY } from './constants'
// import { IAddOptions } from './schemas'

// NodeJS
import { Readable } from 'stream'

const fastify = Fastify()
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

fastify.post('/add', async (req, reply) => {

    const image = await (req.body as any).image
    if (!image) reply.send({ error: "No image file" })
    if (!(req.body as any).name.value || !(req.body as any).description.value) reply.send({ error: "Missing name or description fields" })

    const readableStream = Readable.from(await image.toBuffer())
    // @ts-ignore
    readableStream.path = image.filename

    try {
        const imageResult = await pinata.pinFileToIPFS(readableStream)
        const imageURL = BASE_GATEWAY + imageResult.IpfsHash
        const data = {
            name: (req.body as any).name.value,
            description: (req.body as any).description.value,
            image: imageURL
        }
        const result = await pinata.pinJSONToIPFS(data)
        const nftURL = BASE_GATEWAY + result.IpfsHash

        reply.send({ ...result, nftURL })
    }
    catch (e) {
        console.error(e)
        reply.send({
            error: e
        })
    }


})

// Use the /add route with predefined image, description and trait of timestamp or date
fastify.post('/profile/mint', async (req, reply) => { })


// Run the server
const start = async () => {
    try {
        await fastify.listen({ port: 8000 })
        console.log("Listening on http://localhost:8000")
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
