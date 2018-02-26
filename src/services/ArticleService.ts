import { BASE_SCHOLARLY_API_URL } from '../constants'
import { Article, Facet, FacetValue } from '../models'

import { ArticleSearchResponse, MultiSearchResponse } from '../interfaces'
import { ArticleFieldsMap } from '../enums';

export class ArticleService {
    query(query: object, endpoint: string = 'multi/search?request_cache=true'): Promise<MultiSearchResponse> {
        return fetch(`${BASE_SCHOLARLY_API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query),
        }).then(d => d.json())
    }
    search(query: object): Promise<ArticleSearchResponse> {
        return this.query(query).then((response: MultiSearchResponse) => {
            const articles = response.query_result.hits.hits.map(d => new Article(d._source, d))
            return { articles, response }
        })
    }
    facets(query: object): Promise<Facet[]> {
        return this.query(query).then((response: MultiSearchResponse) => {
            const { aggregations } = response.query_result
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
            const field = ArticleFieldsMap[key]
            // Check for "single value" facet
            if (!agg.buckets) {
                const facet = new Facet({
                    type: 'scholar',
                    key,
                    label: field ? field.label : key,
                    value: agg.value,
                })
                console.log(facet.label)
                facets.push(facet)
                return
            }
            // Regular multi value facet
            const values = agg.buckets.map(d => new FacetValue({
                key: d.key_as_string,
                label: d.key_as_string || d.key,
                value: d.doc_count,
            })).sort((a, b) => a.value < b.value)
            const facet: Facet = new Facet({
                type: 'scholar',
                key,
                label: field ? field.label : key,
                values,
                sumOtherDocCount: agg.sum_other_doc_count,
            })
            facets.push(facet)
        })
        return facets
    }

}

export default ArticleService
