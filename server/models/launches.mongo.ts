import { Schema, model } from 'mongoose'
import { ILaunch } from '../../types/types'
import { Models } from './models.mongo'

const launchesSchema = new Schema<ILaunch>({
    flightNumber: {
        type: Number,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    target: {
        type: String
    },
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    },
    customers: [String]
})

export default model(Models.Launch, launchesSchema)
