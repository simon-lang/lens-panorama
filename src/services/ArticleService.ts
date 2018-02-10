import { BASE_SCHOLARLY_API_URL } from '../constants'
import { Article } from '../models/Article'

import { SearchResponse } from '../interfaces'

const buildMap = o => Object.keys(o).reduce((m, k) => m.set(k, o[k]), new Map())

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
    facets(query: object): Promise<Article[]> {
        return this.query(query).then((res: SearchResponse) => {
            return res.query_result.aggregations
        })
    }
}

export default ArticleService
