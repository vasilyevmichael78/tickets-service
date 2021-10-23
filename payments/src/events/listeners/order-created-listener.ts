import { Listener, OrderCreatedEvent, Subjects } from '@vmpack/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    queueGroupName = queueGroupName
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated

    async onMessage(
        data: OrderCreatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version,
        })
        await order.save()
        msg.ack()
    }
}
