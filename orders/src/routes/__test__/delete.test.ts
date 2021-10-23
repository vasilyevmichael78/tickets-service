import { buildTicket } from './index.test'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { OrderStatus } from '@vmpack/common'
import { natsWrapper } from '../../nats-wrapper'

it('should mark an order as canceled', async function () {
    const ticket = await buildTicket()
    await ticket.save()
    const user = await global.signup()
    const { body: order } = await request(app)
        .post('/api/orders/')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled)
})
it('should emit an order canceled event', async function () {
    const ticket = await buildTicket()
    await ticket.save()
    const user = await global.signup()
    const { body: order } = await request(app)
        .post('/api/orders/')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)
    const updatedOrder = await Order.findById(order.id)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
