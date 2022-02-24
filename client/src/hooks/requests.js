const API_URL = 'http://localhost:5000/api/v1'

async function httpGetPlanets() {
    const response = await fetch(`${API_URL}/planets`, { method: 'GET' })
    return await response.json()
}

async function httpGetLaunches() {
    const response = await fetch(`${API_URL}/launches`, { method: 'GET' })
    const launches = await response.json()
    return launches.sort((a, b) => a.flightNumber - b.flightNumber)
}

async function httpSubmitLaunch(launch) {
    return await fetch(`${API_URL}/launches`, {
        method: 'POST',
        body: JSON.stringify(launch),
        headers: { 'Content-Type': 'application/json' }
    })
}

async function httpAbortLaunch(id) {
    return await fetch(`${API_URL}/launches/${id}`, { method: 'DELETE' })
}

export {
    httpGetPlanets,
    httpGetLaunches,
    httpSubmitLaunch,
    httpAbortLaunch
}
