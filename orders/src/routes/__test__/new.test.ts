import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'

it('should return an error if the ticket does not exist', async function () {
    const ticketId = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .post('/api/orders')
        .set('Cookie', await global.signup())
        .send({
            ticketId,
        })
        .expect(404)
})
it('should return an error if the ticket is already reserved', async function () {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    })

    await ticket.save()
    const order = Order.build({
        ticket,
        userId: 'jhgjhgjgjhghjg',
        status: OrderStatus.AwaitingPayment,
        expiresAt: new Date(),
    })
    await order.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', await global.signup())
        .send({ ticketId: ticket.id })
        .expect(400)
})

it('should reserve a ticket', async function () {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concerto',
        price: 201,
    })
    await ticket.save()
    await request(app)
        .post('/api/orders')
        .set('Cookie', await global.signup())
        .send({ ticketId: ticket.id })
        .expect(201)
})
it('emits an order created event', async function () {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concerto',
        price: 2010,
    })
    await ticket.save()
    await request(app)
        .post('/api/orders')
        .set('Cookie', await global.signup())
        .send({ ticketId: ticket.id })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
