import { ExpirationCompleteEvent, Publisher, Subjects } from '@vmpack/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
