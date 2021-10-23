import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName: string = "payments-service";
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data: ", data);
    msg.ack();
  }
}
