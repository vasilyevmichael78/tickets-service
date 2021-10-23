import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

import jwt from 'jsonwebtoken'

declare global {
    var signup: () => Promise<string[]>
}
jest.mock('../nats-wrapper')
let mongo: MongoMemoryServer
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf'
    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()
    await mongoose.connect(mongoUri)
})
beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})
afterAll(async () => {
    // jest.clearAllMocks()
    await mongo.stop()
    await mongoose.connection.close()
})
global.signup = async () => {
    //build jwt payload {id, email}
    const id = new mongoose.Types.ObjectId().toHexString()
    const payload = {
        id,
        email: 'test@test.com',
    }
    //create jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!)
    // build session object {jwt:MY_JWT}
    const session = { jwt: token }

    // turn that session into json
    const sessionJson = JSON.stringify(session)

    //take json and encode it as base64
    const base64 = Buffer.from(sessionJson).toString('base64')
    //return string thats the cookie with the encoded data
    return [`express:sess=${base64}`]
}
