import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { OrderStatus } from '@vmpack/common'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payment'

it('returns a 404 error when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', await global.signup())
        .send({
            token: 'jhfjfjf',
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404)
})
it('returns a 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created,
    })
    await order.save()
    await request(app)
        .post('/api/payments')
        .set('Cookie', await global.signup())
        .send({
            token: 'jhfjfjf',
            orderId: order.id,
        })
        .expect(401)
})
it('returns a 400 error when purchasing a canceled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Canceled,
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', await global.signup(userId))
        .send({
            orderId: order.id,
            token: 'jhfjfjf',
        })
        .expect(400)
})
it('returns a 204 with valid inputs ', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const price = Math.floor(Math.random() * 100_000)
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created,
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', await global.signup(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id,
        })
        .expect(201)

    const stripeCharges = await stripe.charges.list({ limit: 50 })
    const stripeCharge = stripeCharges.data.find((charge) => {
        return charge.amount === price * 100
    })
    expect(stripeCharge).toBeDefined()

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id,
    })
    expect(payment).not.toBeNull()
    // const chargeOptions = (stripe.charges.create as jest.Mock) .mock.calls[0][0]
    // expect(chargeOptions.source).toEqual('tok_visa')
    // expect(chargeOptions.amount).toEqual(20 * 100)
    // expect(chargeOptions.currency).toEqual('usd')
})
