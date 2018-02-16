import ArticleService from './ArticleService'
const service: ArticleService = new ArticleService()

// import sampleResponse from '../../data/search-api/aggregations.json'
const sampleResponse = require('../../data/search-api/aggregations.json')

describe('ArticleService', () => {
    it('createFacetsFromScholarlyAggs', () => {
        const { aggregations } = sampleResponse.query_result
        const facets = service.createFacetsFromScholarlyAggs(aggregations)

        const facet = facets[0]
        expect(facet.key).toEqual('funding.organisation.keyword')
        expect(facet.type).toEqual('scholar')
        expect(facet.values[0].key).toEqual('NHLBI NIH HHS')
        expect(facet.values[0].value).toEqual(196)
    })
})
