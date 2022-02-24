import { Express, Router } from 'express'
import planetRoute from './planets/planets.router'
import launchesRoute from './launches/launches.router'
import path from 'path'

const routes = Router()

routes.use('/planets', planetRoute)
routes.use('/launches', launchesRoute)

export default function(app: Express) {
    app.use('/api/v1', routes)
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
    })
}
