import { connect, connection, disconnect } from 'mongoose'

const MONGO_URL = process.env.MONGO_URL as string

connection.once('open', () => console.log('MongoDB connection ready'))
connection.on('error', error => console.log('MongoDB connection fail: ', error))

export async function connectDatabase() {
    await connect(MONGO_URL)
}

export async function disconnectDatabase() {
    await disconnect()
}
