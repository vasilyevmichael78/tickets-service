import { Publisher, Subjects, OrderCanceledEvent } from '@vmpack/common'
export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
    readonly subject: Subjects.OrderCanceled = Subjects.OrderCanceled
}
