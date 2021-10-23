import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'

declare global {
    var signup: () => Promise<string[]>
}

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
    await mongo.stop()
    await mongoose.connection.close()
})
global.signup = async () => {
    const email = 'test@test.com'
    const password = 'password'
    const res = await request(app)
        .post('/api/users/signup')
        .send({ email, password })
        .expect(201)
    return res.get('Set-Cookie')
}
