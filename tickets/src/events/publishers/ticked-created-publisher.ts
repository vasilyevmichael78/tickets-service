import { Publisher, Subjects, TicketCreatedEvent } from '@vmpack/common'

export class TickedCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
}
