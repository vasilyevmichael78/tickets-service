import { Publisher, Subjects, OrderCreatedEvent } from '@vmpack/common'
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated
}
