import request from 'supertest'
import { app } from '../../app'

const createTicket = async () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', await global.signup())
        .send({ title: 'jgjgjglkjglnmnbmgfgfhkf', price: 20 })
        .expect(201)
}
it('should fetch a list of tickets', async function () {
    createTicket()
    createTicket()
    createTicket()
    const res = await request(app).get('/api/tickets').send().expect(200)

    expect(res.body.length).toEqual(3)
})
