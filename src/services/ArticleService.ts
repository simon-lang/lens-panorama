import { BASE_SCHOLARLY_API_URL } from '../constants'
import { Article } from '../models'

import { SearchResponse } from '../interfaces'

// Implemented on laptop but not pushed
class Facet {
    constructor(d: any) { }
}

export class ArticleService {
    query(query: object) {
        return fetch(`${BASE_SCHOLARLY_API_URL}/multi/search?request_cache=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query),
        }).then(d => d.json())
    }
    list(query: object): Promise<any[]> {
        return this.query(query).then((res: SearchResponse) => {
            const articles = res.query_result.hits.hits.map(d => new Article(d._source))
            return [articles, res]
        })
    }
    facets(query: object): Promise<Facet[]> {
        return this.query(query).then((res: SearchResponse) => {
            const { aggregations } = res.query_result
            let facets: Facet[] = []
            Object.keys(aggregations).forEach(key => {
                const agg = aggregations[key]
                const values = agg.buckets.map(d => ({
                    label: key, // todo: who is responsible for labels?
                    count: d.doc_count,
                }))
                const facet: Facet = new Facet({
                    type: 'scholar',
                    key,
                    values,
                    sumOtherDocCount: agg.sum_other_doc_count,
                })
                facets.push()
            })
            return facets
        })
    }
}

export default ArticleService
