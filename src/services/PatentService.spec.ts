import PatentService from './PatentService'
const service: PatentService = new PatentService()

const sampleResponse = require('../../data/facets/Rice-University.json')

describe('PatentService', () => {
    it('createFacetsFromRawData', () => {
        const facets = service.createFacetsFromRawData(sampleResponse.facets)

        const facet = facets[0]
        expect(facet.key).toEqual('owner')
        expect(facet.type).toEqual('patent')
        expect(facet.values[0].key).toEqual('INTERNATIONAL BUSINESS MACHINES CORPORATION')
        expect(facet.values[0].label).toEqual('International Business Machines Corporation')
        expect(facet.values[0].value).toEqual(206)
    })
})
