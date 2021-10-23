import {
    Listener,
    OrderCanceledEvent,
    OrderStatus,
    Subjects,
} from '@vmpack/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
    async onMessage(
        data: OrderCanceledEvent['data'],
        msg: Message
    ): Promise<void> {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1,
        })
        if (!order) {
            throw new Error('Order not found')
        }
        order.set({ status: OrderStatus.Canceled })
        await order.save()
        msg.ack()
    }

    queueGroupName: string = queueGroupName
    readonly subject: Subjects.OrderCanceled = Subjects.OrderCanceled
}
