import request from 'supertest'
import { app } from '../../app'

import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'

it('should return 404 if the provided id does not exist', async function () {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', await global.signup())
        .send({
            title: 'qwerty',
            price: 20,
        })
        .expect(404)
})
it('should return a 401 if the user is not authenticated', async function () {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)

        .send({
            title: 'qwerty',
            price: 20,
        })
        .expect(401)
})
it('should return a 401 if the user does not own the ticket', async function () {
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', await global.signup())
        .send({ title: 'qwerty', price: 20 })
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', await global.signup())
        .send({
            title: 'fuckyoumiki',
            price: 45,
        })
        .expect(401)
})
it('should return a 400 if the user provides an invalid title or price ', async function () {
    const cookie = await global.signup()
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'qwerty', price: 20 })
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 34,
        })
        .expect(400)
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'jhgjhgjgj',
            price: -34,
        })
        .expect(400)
})
it('should update the ticket provided valid inputs', async function () {
    const cookie = await global.signup()
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'qwerty', price: 20 })
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 78,
        })

    const ticketResponse = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .send()
    expect(ticketResponse.body.title).toEqual('new title')
    expect(ticketResponse.body.price).toEqual(78)
})
it('should publish an event', async function () {
    const cookie = await global.signup()
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'qwerty', price: 20 })
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 78,
        })
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
it('should reject updates if the ticket is reserved', async function () {
    const cookie = await global.signup()
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'qwerty', price: 20 })

        const ticket = await Ticket.findById(res.body.id)
        ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()})
        await ticket!.save()
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 78,
        }).expect(400)
})
