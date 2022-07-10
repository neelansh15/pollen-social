
import Fastify from 'fastify'
import pinataSDK from '@pinata/sdk'
import { PINATA_API_KEY, PINATA_API_SECRET } from './keys'
import { BASE_GATEWAY } from './constants'
// import { IAddOptions } from './schemas'

// NodeJS
import fs from 'fs'
import { pipeline, Readable } from 'stream'
import util from 'util'

const pump = util.promisify(pipeline)


const fastify = Fastify()
fastify.register(require('@fastify/multipart'))

const pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET)

fastify.get('/', async (req, reply) => {
    const result = await pinata.testAuthentication()
    reply.send({
        helu: 'there',
        ...result
    })
})

fastify.post('/add', async (req, reply) => {

    console.log(req.body)

    const image = await req.file()
    console.log({ readable: image.file.readable })
    if (!image) reply.send({ error: "No image file" })

    const readableStream = Readable.from(await image.toBuffer())
    // @ts-ignore
    readableStream.path = image.filename

    try {
        const imageResult = await pinata.pinFileToIPFS(readableStream)
        reply.send({
            ...imageResult
        })
    }
    catch (e) {
        console.error(e)
        reply.send({
            error: e
        })
    }
    // const imageURL = ""
    // const data = {
    //     name: req.body.name,
    //     description: req.body.description,
    //     image: imageURL
    // }
    // const result = await pinata.pinJSONToIPFS(data)
    // const nftURL = BASE_GATEWAY + result.IpfsHash

    // reply.send({ ...result, nftURL })

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
