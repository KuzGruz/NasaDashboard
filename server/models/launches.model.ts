import { ILaunch, Order, Pagination } from '../../types/types'
import launches from './launches.mongo'
import planets from './planets.mongo'
import { CustomError } from '../middleware/errorMiddleware'
import axios from 'axios'

const spaceXApi = 'https://api.spacexdata.com/v4'

// Delete _id and __v
function getLaunches(pagination: Pagination, order: Order = { flightNumber: 1 }) {
    return launches
        .find({}, { _id: 0, __v: 0 })
        .sort(order)
        .skip(pagination.offset)
        .limit(pagination.limit)
}

async function createLaunch(launch: ILaunch) {
    const planet = await planets.findOne({ kepler_name: launch.target })
    if (!planet) {
        throw CustomError.ServerError('Invalid launch target!')
    }
    const number = await getLatestFlightNumber()
    const launchBody = {
        ...launch,
        flightNumber: number,
        customers: ['NASA'],
        upcoming: true,
        success: true
    }
    await saveLaunch(launchBody)
    return launchBody
}

function abortLaunch(flightNumber: number) {
    return launches.updateOne({ flightNumber }, {
        upcoming: false,
        success: false
    })
}

async function existLaunch(flightNumber: number): Promise<any> {
    return findLaunch({ flightNumber })
}

async function saveLaunch(launch: ILaunch) {
    await launches.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, { upsert: true })
}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        rocket: 'Falcon 1',
        flightNumber: 1,
        mission: 'FalconSat'
    })
    if (firstLaunch) {
        return
    }
    await populateLaunches()
}

async function populateLaunches() {
    const { data } = await axios.post(`${spaceXApi}/launches/query`, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    })

    return data.docs.map(async(doc: any) => {
        const launch: ILaunch = {
            flightNumber: doc.flight_number,
            mission: doc.name,
            rocket: doc.rocket.name,
            launchDate: doc.date_local,
            upcoming: doc.upcoming,
            success: doc.success,
            customers: doc.payloads.flatMap((payload: any) => payload.customers)
        }
        await saveLaunch(launch)
        return launch
    })
}

function findLaunch(filter: Partial<ILaunch>) {
    return launches.findOne(filter)
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber')
    return latestLaunch?.flightNumber || 0
}

export default {
    getModel: getLaunches,
    create: createLaunch,
    abort: abortLaunch,
    isExist: existLaunch,
    loadLaunches: loadLaunchesData
}
