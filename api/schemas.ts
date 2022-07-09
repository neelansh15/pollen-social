import { RouteShorthandOptions } from "fastify";

/**
 * @type {import('fastify').RouteShorthandOptions}
 * @const
 */
export const IAddOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                image: { type: 'object' },
            }
        }
    }
}
