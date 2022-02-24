import { NextFunction, Request, Response } from 'express'
import model from '../../models/launches.model'
import { CustomError } from '../../middleware/errorMiddleware'
import { getPagination } from '../../services/query'
import { QueryPagination } from '../../../types/types'

async function getAllLaunches(req: Request<unknown, unknown, unknown, QueryPagination>, res: Response): Promise<any> {
    const pagination = getPagination(req.query)
    return res.status(200).json(await model.getModel(pagination))
}

async function createLaunch(req: Request, res: Response, next: NextFunction): Promise<any> {
    const launch = req.body
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return next(CustomError.BadRequest('Invalid launch body!'))
    }
    const launchDate = new Date(req.body.launchDate)
    if (!launchDate || isNaN(launchDate.valueOf())) {
        return next(CustomError.BadRequest('Invalid launch date!'))
    }
    const createdLaunch = await model.create({ ...launch, launchDate })
    return res.status(201).json(createdLaunch)
}

async function deleteLaunch(req: Request, res: Response, next: NextFunction): Promise<any> {
    const id = req.params.id
    if (!id) {
        return next(CustomError.BadRequest('Invalid launch id!'))
    }
    const isExist = await model.isExist(+id)
    if (!isExist) {
        return next(CustomError.NotFound('Launch not found!'))
    }
    const aborted = await model.abort(+id)
    if (!aborted) {
        return next(CustomError.NotFound('Launch not aborted!'))
    }
    return res.status(200).json(aborted)
}

export default {
    getAllLaunches,
    createLaunch,
    deleteLaunch
}
