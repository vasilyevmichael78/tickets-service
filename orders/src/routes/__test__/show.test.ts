import { buildTicket } from './index.test'
import request from 'supertest'
import { app } from '../../app'

it('should  fetch the order', async function () {
    const ticket = await buildTicket()
    const user = await global.signup()
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)
    expect(fetchedOrder.id).toEqual(order.id)
})
it('should  return an error if user tries to fetch another users order', async function () {
    const ticket = await buildTicket()
    const user = await global.signup()
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', await global.signup())
        .send()
        .expect(401)
})
