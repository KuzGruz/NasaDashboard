import { Request, Response } from 'express'
import model from '../../models/planets.model'

async function getAllPlanet(req: Request, res: Response): Promise<any> {
    return res.status(200).json(await model.getModel())
}

export default {
    getAllPlanet
}
