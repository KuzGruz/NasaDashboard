import { model, Schema } from 'mongoose'
import { IPlanet } from '../../types/types'
import { Models } from './models.mongo'

const planetsSchema = new Schema<IPlanet>({
    kepler_name: {
        type: String,
        required: true
    }
})

export default model(Models.Planets, planetsSchema)
