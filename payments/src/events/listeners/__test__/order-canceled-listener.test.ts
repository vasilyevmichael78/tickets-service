import { OrderCanceledListener } from '../order-canceled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCanceledEvent, OrderStatus } from '@vmpack/common'
import { Order } from '../../../models/order'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
    const listener = new OrderCanceledListener(natsWrapper.client)
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        price: 10,
        userId: 'jhgjhgjglkhhgd',
    })
    await order.save()
    const data: OrderCanceledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'hgfjxjgtd',
        },
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }
    return { data, listener, msg, order }
}
it('should update the status of the order', async function () {
    const { data, msg, listener, order } = await setup()
    await listener.onMessage(data, msg)
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled)
})
it('should ack the message', async function () {
    const { data, msg, listener } = await setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})
