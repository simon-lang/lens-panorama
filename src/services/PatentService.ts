import { BASE_URL } from '../constants'
import { Patent } from '../models/Patent'

// const fetch = require('isomorphic-fetch')

export class PatentService {
    search(q: string): Promise<Patent[]> {
        // const encodedQ: string = window.encodeURIComponent(q)
        return fetch(`${BASE_URL}/search?q=${q}&json=1`).then((d) => d.json()).then((d) => {
            return d.result.hits.map((patent) => new Patent(patent))
        })
    }
    facets(q: string): Promise<Patent[]> {
        // const encodedQ: string = window.encodeURIComponent(q)
        return fetch(`${BASE_URL}/facetData?q=${q}`).then((d) => d.json()).then((d) => {
            return d.result.hits.map((patent) => new Patent(patent))
        })
    }
}

export default PatentService
