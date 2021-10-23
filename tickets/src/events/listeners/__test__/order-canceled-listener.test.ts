import { OrderCanceledEvent } from "@vmpack/common"
import  mongoose  from "mongoose"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCanceledListener } from "../order-canceled-listener"
import {Message} from 'node-nats-streaming'

const setup = async () => {
    const listener = new OrderCanceledListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: "concert",
        price: 100,
        userId:'12345678',
        
    })
    //@ts-ignore
    ticket.set({orderId :new mongoose.Types.ObjectId().toHexString()})
    await ticket.save()
    const data: OrderCanceledEvent['data'] = {
        id: ticket.orderId as string,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }
    return {msg, data, ticket, listener}

}

it('updates the ticket, publishes an event and acks the message', async () =>{
    const {msg, data, listener, ticket} = await setup()
    await listener.onMessage(data,msg)

    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).not.toBeDefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
