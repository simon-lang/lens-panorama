import ArticleService from './ArticleService'
const service: ArticleService = new ArticleService()

const sampleResponse = require('../../data/search-api/aggregations.json')

// describe('ArticleService', () => {
//     it('createFacetsFromScholarlyAggs', () => {
//         const { aggregations } = sampleResponse.query_result
//         const facets = service.createFacetsFromScholarlyAggs(aggregations)

//         const facet = facets[0]
//         expect(facet.key).toEqual('funding.organisation.keyword')
//         expect(facet.type).toEqual('scholar')
//         expect(facet.values[0].key).toEqual('NHLBI NIH HHS')
//         expect(facet.values[0].value).toEqual(196)

//         const singleValueFacet = facets[1]
//         expect(singleValueFacet.key).toEqual('sum_referenced_by_patent_count')
//         expect(singleValueFacet.value).toEqual(317)
//     })
// })
