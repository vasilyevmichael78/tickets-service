import { Ticket } from '../../models/ticket'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import mongoose from 'mongoose'

export const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 345,
    })
    await ticket.save()
    return ticket
}

it('should fetch orders for a particular user', async function () {
    const ticket1 = await buildTicket()
    const ticket2 = await buildTicket()
    const ticket3 = await buildTicket()

    const user1 = await global.signup()
    const user2 = await global.signup()

    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
            ticketId: ticket1.id,
        })
        .expect(201)

    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({
            ticketId: ticket2.id,
        })
        .expect(201)
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({
            ticketId: ticket3.id,
        })
        .expect(201)

    const res = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200)

    expect(res.body.length).toEqual(2)
    expect(res.body[0].id).toEqual(orderOne.id)
    expect(res.body[1].id).toEqual(orderTwo.id)
    expect(res.body[0].ticket.id).toEqual(ticket2.id)
    expect(res.body[1].ticket.id).toEqual(ticket3.id)
})
it('should ', async function () {})
it('should ', async function () {})
