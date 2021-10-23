import { PaymentCreatedEvent, Publisher, Subjects } from '@vmpack/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
        

