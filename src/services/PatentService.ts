import { BASE_URL } from '../constants'
import { Patent, Facet, FacetValue } from '../models'
import { PatentSearchResponse } from '../interfaces';

import orderBy from 'lodash/orderBy'
import { PatentFieldsMap } from '../enums';

export class PatentService {
    query(endpoint) {
        return fetch(`${BASE_URL}/${endpoint}`).then(d => d.json())
    }
    search(q: string, scholarlySearchId?: string): Promise<PatentSearchResponse> {
        const encodedQ = encodeURIComponent(q)
        let url = `search?q=${encodedQ}&json=1&n=100`
        // TODO: separate method call for this
        if (scholarlySearchId) {
            url += '&scholarlySearchId=' + scholarlySearchId
        }
        return this.query(url).then(response => {
            const { hits } = response.result
            const patents = hits.map(patent => new Patent(patent))
            return {
                response,
                patents,
            }
        })
    }
    facets(q: string): Promise<Facet[]> {
        return this.query(`search/facetData?q=${q}`).then(facets => {
            return this.createFacetsFromRawData(facets)
        })
    }
    createFacetsFromRawData(raw) {
        let facets: Facet[] = []
        Object.keys(raw).forEach(key => {
            let data = raw[key]
            const field = PatentFieldsMap[key]
            let facetValues: FacetValue[] = Object.keys(data).map(v => new FacetValue({
                key: v,
                label: data[v].displayName,
                value: data[v].count,
            }))
            let facet = new Facet({
                type: 'patent',
                key,
                label: field ? field.label : '',
                values: orderBy(facetValues, 'value').reverse()
            })
            facets.push(facet)
        })
        return facets
    }
}

export default PatentService
