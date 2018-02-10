// const datasets = require('../modules/Datasets')
const datasets = {}

const LocalStorageService = require('/main/modules/LocalStorageService')
const storage = new LocalStorageService()

const url = path => '/public/' + path

import _values from 'lodash/values'

const incitesUrl = (path, datasetKey) => {
    const dataset = datasets[datasetKey] || _values(datasets)[0]
    return url(dataset + '/' + path)
}

let _institutions = {}
let _fields = {}
let _summary = {}
let _applicants = null
let _global = {}
let _facets = {}
let _extraFacets = {}

const $http = () => null
const $q = {
    resolve: () => { },
    reject: () => { },
}

export default class InstitutionService {
    // console.log('InstitutionService init')
    clearStorage() {
        storage.removeItem('institutions')
    }
    get(slug, datasetKey) {
        const dataset = datasets[datasetKey] || _values(datasets)[0]
        const institutionsCacheKey = 'institutions-' + dataset

        return fetch(incitesUrl('institutions/' + slug + '.json', datasetKey)).then(r => r.json())
    }
    summary(datasetKey) {
        if (_summary[datasetKey]) {
            return _summary[datasetKey]
        }
        _summary[datasetKey] = fetch(incitesUrl('summary.json', datasetKey)).then(r => r.json())
        return _summary[datasetKey]
    }
    global(datasetKey) {
        if (_global[datasetKey]) {
            return _global[datasetKey]
        }
        _global[datasetKey] = fetch(incitesUrl('global.json', datasetKey)).then(r => r.json())
        return _global[datasetKey]
    }
    facets(slug) {
        if (_facets[slug]) {
            return _facets[slug]
        }
        _facets[slug] = fetch(url('facetData/' + slug + '.json')).then(r => r.json())
        return _facets[slug]
    }
    extraFacets(slug, facet) {
        if (!_extraFacets[slug]) {
            _extraFacets[slug] = {}
        }
        if (_extraFacets[slug][facet]) {
            return _extraFacets[slug][facet]
        }
        _extraFacets[slug][facet] = fetch(url('facetData/extra/' + facet + '/' + slug + '.json')).then(r => r.json())
        return _extraFacets[slug][facet]
    }
}
