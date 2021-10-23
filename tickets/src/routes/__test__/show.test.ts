import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
jest.mock('../../nats-wrapper')
it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app).get(`/api/tickets/${id}`).send().expect(404)
})
it('returns the ticket if it is found', async () => {
    const title = 'kjdhksf'
    const price = 24

    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', await global.signup())
        .send({
            title,
            price,
        })
        .expect(201)
    const ticketResponse = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .send()
        .expect(200)
    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
})
