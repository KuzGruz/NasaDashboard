import { createReadStream } from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import { IPlanet } from '../../types/types'
import planets from './planets.mongo'
import { CustomError } from '../middleware/errorMiddleware'

const targetFile = path.join('data', 'kepler_data.csv')

function isHabitablePlanet(planet: IPlanet) {
    return planet.koi_disposition === 'CONFIRMED' &&
        Number(planet.koi_insol) > 0.36 && Number(planet.koi_insol) < 1.11 && Number(planet.koi_prad) < 1.6
}

function getModel() {
    return planets.find()
}

async function savePlanet(planet: IPlanet) {
    try {
        await planets.updateOne({ kepler_name: planet.kepler_name }, planet, { upsert: true })
    } catch (e) {
        throw CustomError.ServerError('Planet update error!')
    }
}

function preloadModel() {
    return new Promise((resolve, reject) => {
        createReadStream(targetFile)
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async(data: IPlanet) => {
                if (isHabitablePlanet(data)) {
                    await savePlanet(data)
                }
            })
            .on('error', (error) => {
                reject(error)
            })
            .on('end', async() => {
                resolve(await getModel())
            })
    })
}

export default {
    getModel,
    preloadModel
}
