const path = require('path')
const express = require('express')
const fetch = require('node-fetch')

const app = express()

const _get = require('lodash/get')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const cors = require('./cors')
app.use(cors)

const DATA_DIR = path.resolve(__dirname, '../../data')

const scholarSearchResponse = require(DATA_DIR + '/search-api/articles.json')
const scholarAggsResponse = require(DATA_DIR + '/search-api/aggregations.json')
const patentSearchResponse = require(DATA_DIR + '/patents/glucuronidase.json')
const facetsResponse = require(DATA_DIR + '/facets/Rice-University.json')
const scholarlyStoreResponse = require(DATA_DIR + '/store/27869821.json')
const ancestorsAndSelf = require(DATA_DIR + '/classifications/ancestorsAndSelf.json')

app.post('/lens/api/multi/search', (req, res) => {
    const aggs = _get(req, 'body.scholarly_search.aggs')
    if (aggs) {
        res.send(scholarAggsResponse)
    } else {
        res.send(scholarSearchResponse)
    }
})

app.post('/lens/api/scholarly/store', (req, res) => {
    res.send(scholarlyStoreResponse)
})

app.get('/lens/search', (req, res) => {
    res.send(patentSearchResponse)
})

app.get('/lens/search/facetData', (req, res) => {
    res.send(facetsResponse)
})

app.get('/patclass/:type/ancestorsAndSelf', (req, res) => {
    res.send(ancestorsAndSelf)
})

app.listen(9083)
console.log('Listening at http://localhost:9083')
