import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedEvent, OrderStatus } from '@vmpack/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { OrderCreatedListener } from '../order-created-listener'

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'hfhgfhf',
        userId: 'jghgjhgjhnv',
        status: OrderStatus.Created,
        ticket: { id: '617065ac6fb3a443d36aced7', price: 10 },
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }
    return { msg, data, listener }
}
it('should replicate the order info', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const order = await Order.findById(data.id)

    expect(order!.price).toEqual(data.ticket.price)
})
it('should ack the message', async function () {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})
