import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'
import { Order } from '../../../models/order'
import { ExpirationCompleteEvent, OrderStatus } from '@vmpack/common'
import { Message } from 'node-nats-streaming'

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save()
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'sdfsfsf',
        expiresAt: new Date(),
        ticket,
    })

    await order.save()

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return { listener, order, ticket, data, msg }
}
it('should update the order status to canceled ', async function () {
    const { data, order, ticket, listener, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled)
})

it('should emit an OrderCanceled event ', async function () {
    const { data, order, listener, msg } = await setup()

    await listener.onMessage(data, msg)
    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )
    expect(eventData.id).toEqual(order.id)
})
it('should ack the message', async function () {
    const { data, order, ticket, listener, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})
