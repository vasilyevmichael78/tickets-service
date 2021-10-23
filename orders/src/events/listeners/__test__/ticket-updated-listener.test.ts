import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import mongoose, { version } from 'mongoose'
import { TicketUpdatedEvent } from "@vmpack/common"
import {Message} from "node-nats-streaming"
const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 100,
    })
     await ticket.save()
const data: TicketUpdatedEvent['data']  =( {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 56,
    userId: '123'
} ) 

//create a fake msg object
//@ts-ignore
const msg: Message = {ack: jest.fn()}

return {msg, data,ticket, listener}
}

it('should find, update and save a ticket', async (): Promise<void> => {
const {msg, data, listener, ticket}  = await setup()

await listener.onMessage(data, msg)

const updatedTicket = await Ticket.findById(ticket.id)

expect(updatedTicket!.title).toEqual(data.title)
expect(updatedTicket!.price).toEqual(data.price)
 
})

it('should not call ack if the event has a skipped version', async ()=> {
    const {msg, data, listener, ticket}  = await setup()
    data.version = 10
try {await listener.onMessage(data, msg)
} catch (err) {

}
expect(msg.ack).not.toHaveBeenCalled()
    


})
it('should act the message', async (): Promise<void> => {
    const {msg, data, listener, ticket}  = await setup()

await listener.onMessage(data, msg)

expect(msg.ack).toHaveBeenCalled()
})