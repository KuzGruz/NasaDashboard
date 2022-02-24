import request from 'supertest'
import app from '../../app'
import { connectDatabase, disconnectDatabase } from '../../services/mongo'

const prefix = '/api/v1'

describe('Launches API', () => {
    beforeAll(async() => {
        await connectDatabase()
    })

    afterAll(async() => {
        await disconnectDatabase()
    })

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async() => {
            await request(app)
                .get(`${prefix}/launches`)
                .expect('Content-Type', /json/i)
                .expect(200)
        })
    })

    describe('Test POST /launches', () => {
        const reqBody = {
            mission: 'USS',
            rocket: 'NCC_1',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2029'
        }

        const reqBodyWithoutDate = {
            mission: 'USS',
            rocket: 'NCC_1',
            target: 'Kepler-62 f'
        }

        const reqBodyWithoutInvalidDate = {
            mission: 'USS',
            rocket: 'NCC_1',
            target: 'Kepler-62 f',
            launchDate: 'noop'
        }

        test('It should respond with 200 success', async() => {
            const response = await request(app)
                .post(`${prefix}/launches`)
                .send(reqBody)
                .expect('Content-Type', /json/i)
                .expect(201)

            const reqDate = new Date(reqBody.launchDate).valueOf()
            const resDate = new Date(response.body.launchDate).valueOf()

            expect(resDate).toBe(reqDate)

            expect(response.body).toMatchObject(reqBodyWithoutDate)
        })

        test('It should catch missing required properties', async() => {
            const response = await request(app)
                .post(`${prefix}/launches`)
                .send(reqBodyWithoutDate)
                .expect('Content-Type', /json/i)
                .expect(400)

            expect(response.body).toStrictEqual({
                status: 400,
                message: 'Invalid launch body!'
            })
        })

        test('It should catch invalid date', async() => {
            const response = await request(app)
                .post(`${prefix}/launches`)
                .send(reqBodyWithoutInvalidDate)
                .expect('Content-Type', /json/i)
                .expect(400)

            expect(response.body).toStrictEqual({
                status: 400,
                message: 'Invalid launch date!'
            })
        })
    })
})
