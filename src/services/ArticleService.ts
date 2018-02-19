import { BASE_SCHOLARLY_API_URL } from '../constants'
import { Article, Facet, FacetValue } from '../models'

import { SearchResponse } from '../interfaces'


export class ArticleService {
    query(query: object, endpoint: string = 'multi/search?request_cache=true') {
        return fetch(`${BASE_SCHOLARLY_API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query),
        }).then(d => d.json())
    }
    search(query: object): Promise<any[]> {
        return this.query(query).then((res: SearchResponse) => {
            const articles = res.query_result.hits.hits.map(d => new Article(d._source, d))
            return [articles, res]
        })
    }
    facets(query: object): Promise<Facet[]> {
        return this.query(query).then((res: SearchResponse) => {
            const { aggregations } = res.query_result
            return this.createFacetsFromScholarlyAggs(aggregations)
        })
    }
    get(ids: number | number[]) {
        let query: any = {}
        if (ids instanceof Array) {
            query.ids = ids
        } else {
            query.ids = [ids]
        }
        return this.query(query, 'scholarly/store')
    }
    createFacetsFromScholarlyAggs(aggregations) {
        let facets: Facet[] = []
        Object.keys(aggregations).forEach(key => {
            const agg = aggregations[key]
            if (!agg.buckets) {
                facets.push(new Facet({
                    type: 'scholar',
                    key,
                    value: agg.value,
                }))
                return
            }
            const values = agg.buckets.map(d => new FacetValue({
                key: d.key_as_string,
                label: d.key_as_string || d.key,
                value: d.doc_count,
            }))
            const facet: Facet = new Facet({
                type: 'scholar',
                key,
                values,
                sumOtherDocCount: agg.sum_other_doc_count,
            })
            facets.push(facet)
        })
        return facets
    }

}

export default ArticleService
