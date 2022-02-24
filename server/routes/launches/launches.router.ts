import { Router } from 'express'
import controller from './launches.controller'

const router = Router()

router.get('/', controller.getAllLaunches)
router.post('/', controller.createLaunch)
router.delete('/:id', controller.deleteLaunch)

export default router
