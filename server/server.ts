import http from 'http'
import dotenv from 'dotenv'
dotenv.config()
import app from './app'
import planetsModel from './models/planets.model'
import launchesModel from './models/launches.model'
import { connectDatabase } from './services/mongo'

const PORT = process.env.PORT || 5000
const server = http.createServer(app)

async function start() {
    await connectDatabase()
    await planetsModel.preloadModel()
    await launchesModel.loadLaunches()
    server.listen(PORT, () => console.log(`Server run on port ${PORT}`))
}

start().then()
