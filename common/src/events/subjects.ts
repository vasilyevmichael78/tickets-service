export enum Subjects {
  TicketCreated = "ticket:created",
  TicketUpdated = "ticket:updated",

  OrderCreated = "order:created",
  OrderCanceled = "order:canceled",

  ExpirationComplete = "expiration:complete",

  PaymentCreated = "payment:created",
}
const printSubject = (subject: Subjects) => {};
