import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

import jwt from 'jsonwebtoken'

declare global {
    var signup: (id?: string) => Promise<string[]>
}
jest.mock('../nats-wrapper')
process.env.STRIPE_KEY = 'sk_test_51JnNULLShGYRWAt3BU73Mj3AxEiilWjmW9FqFzE5mE4o8cW0eo6U2dVx4QiMyAqUYsDGGBOCY0cotfSVIZeRMLMb007haFN8Ws'
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
global.signup = async (id?:string) => {
    //build jwt payload {id, email}
     
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
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
