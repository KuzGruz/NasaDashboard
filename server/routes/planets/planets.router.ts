import { Router } from 'express'
import controller from './planet.controller'

const router = Router()

router.get('/', controller.getAllPlanet)

export default router
