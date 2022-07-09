
import { PINATA_API_KEY, PINATA_API_SECRET } from './keys'
import fetch from 'node-fetch'
import Fastify from 'fastify'
import { BASE_URL } from './constants'
const fastify = Fastify()

fastify.get('/', async (req, reply) => {
    // Test Pinata Authentication
    const result = await fetch(BASE_URL + '/data/testAuthentication', {
        headers: {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_API_SECRET,
        }
    })
    const data = await result.json()
    reply.send({
        helu: 'there',
        ...data
    })
})

// Run the server
const start = async () => {
    try {
        await fastify.listen({ port: 3000 })
        console.log("Listening on http://localhost:3000")
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
