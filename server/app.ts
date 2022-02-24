import express, { Express } from 'express'
import path from 'path'
import cors from 'cors'
import morgan from 'morgan'
import initRoutes from './routes'
import errorMiddleware from './middleware/errorMiddleware'

const app: Express = express()

app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

initRoutes(app)

app.use(errorMiddleware)

export default app
