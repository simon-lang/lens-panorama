import { Component, Vue } from 'vue-property-decorator'
import Icon from 'vue-awesome'

import { looksLikeScholarlyId, looksLikeClassificationSymbol, extractFields } from '../../helpers'
import { topCitedArticlesQuery, articleFacetsQuery, citedArticlesCountQuery } from '../../queries'

import _includes from 'lodash/includes'
import _uniq from 'lodash/uniq'
import _values from 'lodash/values'
import _get from 'lodash/get'
import _intersection from 'lodash/intersection'

import parser from 'lucene-query-parser'

import { Article, Patent, Facet, Classification } from '../../models'
import { SearchResponse } from '../../interfaces'

import { ArticleService, PatentService, ClassificationService } from '../../services'
const articleService = new ArticleService()
const patentService = new PatentService()
const classificationService = new ClassificationService({})

import { ArticleFieldsList, PatentFieldsList } from '../../enums'
const AllFields = _uniq(ArticleFieldsList.concat(PatentFieldsList)).sort()

import { QueryComponent, FacetsComponent, SimpleBarChartComponent } from '../'

import suggestions from './suggestions'

import './client.scss'

const match = (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) >= 0

const stripHtml = html => {
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
}

const DEFAULT_PLACEHOLDER = 'Explore the world of patents, science, technology and innovation...'

interface GoodTableColumn {
    field: string
    label: string
}

interface ParserError {
    message: string
    location?: any
}

@Component({
    template: require('./client.html'),
    components: {
        'icon': Icon,
        'query': QueryComponent,
        'facets': FacetsComponent,
        'simple-bar-chart': SimpleBarChartComponent,
    }
})
export class ClientComponent extends Vue {
    loading: any = {}

    columns: GoodTableColumn[] = [
        { field: 'displayKey', label: 'Display Key' },
        { field: 'title', label: 'Title' },
        { field: 'jurisdiction', label: 'Jurisdiction' },
        { field: 'kindCode', label: 'Kind Code' },
        { field: 'hasFullText', label: 'Full Text' },
    ]

    articleColumns: GoodTableColumn[] = [
        { field: 'id', label: 'ID' },
        { field: 'title', label: 'Title' },
    ]

    dataSourceOptions: string[] = [
        'Patents',
        'Scholarly Works',
        'Institutions',
        'Biological Sequences',
        'Classifications',
        'Collections',
    ]
    selectedDataSources: string[] = [...this.dataSourceOptions]

    placeholder: string = DEFAULT_PLACEHOLDER

    invalidFields: any[] = []
    suggestFields: any[] = []
    suggestTerms: any[] = []
    selectedFieldIndex: number = 0

    suggestions: any[] = suggestions

    suggestIndex: number = 0

    showClassificationContext: boolean = false
    error?: ParserError = null
    looksLike: any = {}
    classificationSymbols: string[] = []
    idType: string = ''
    q: string = ''
    query: object = {}

    show: any = {
        applicantLogoGrid: true,
        formattedQuery: false,
        queryParserResult: false,
        table: false,
    }

    totals: any = {}

    patents: Patent[] = []
    citingPatents: Patent[] = []
    articles: Article[] = []
    citedArticles: Article[] = []
    classifications: Classification[] = []

    patentFacets: Facet[] = []
    hasPatentFacets = false
    patentStats: any = {}

    scholarFacets: Facet[] = []
    hasScholarFacets = false

    interval
    autoRunSearch: boolean = true

    loadingAll: boolean = false
    loadedAll: boolean = false

    mounted() {
        this.interval = setInterval(this.updatePlaceholder, 3000)
        this.q = this.$route.query.q || ''
        if (this.q.length && this.autoRunSearch) {
            this.parseQuery()
            this.submit()
        }
    }

    beforeDestroy() {
        clearInterval(this.interval)
    }

    updatePlaceholder() {
        this.placeholder = this.suggestions[this.suggestIndex++]
    }

    suggest(v) {
        this.q = v
        this.parseQuery()
        this.submit()
    }

    selectField(field) {
        let terms = this.q.split(' ')
        terms.pop()
        terms.push(field + ': ')
        this.q = terms.join(' ')
        this.suggestFields = []
        this.selectedFieldIndex = 0
        this.parseQuery()
    }

    selectTerm(term) {
        let terms = this.q.split(' ') // space wont work
        terms.pop()
        terms.push(`"${term}"`)
        // terms.push(`(${term})`)
        this.q = terms.join(' ')
        this.suggestTerms = []
        this.selectedFieldIndex = 0
        this.parseQuery()
    }

    clear() {
        this.q = ''
        this.$router.push({ query: { q: this.q } })
        this.parseQuery()
    }

    clearResults() {
        this.loadedAll = false // test this out
        this.loadingAll = false // test this out
        this.articles = []
        this.hasScholarFacets = false
        this.patents = []
        this.hasPatentFacets = false
        this.classifications = []
        this.show.suggestions = false
        this.totals = {}
    }

    keyup(event: KeyboardEvent) {
        clearInterval(this.interval)
        this.placeholder = DEFAULT_PLACEHOLDER

        if (event.keyCode === 38) {
            this.selectedFieldIndex = Math.max(-1, this.selectedFieldIndex - 1)
            return
        }
        if (event.keyCode === 40) {
            const length = this.suggestFields.length + this.suggestTerms.length
            this.selectedFieldIndex = Math.min(length, this.selectedFieldIndex + 1)
            return
        }
        if (event.keyCode === 13) {
            const field = this.suggestFields[this.selectedFieldIndex]
            if (field) {
                this.selectField(field)
                return
            }
            const term = this.suggestTerms[this.selectedFieldIndex + this.suggestFields.length]
            if (term) {
                this.selectTerm(term)
                return
            }
            this.submit()
            return
        }
        this.parseQuery()
    }

    parseQuery(event: any = null) {
        if (!this.q) {
            this.clearResults()
            this.$router.push({ query: { q: this.q } })
        }
        try {
            this.error = null
            this.looksLike = {}
            this.suggestFields = []

            // if (this.q.slice(-1) === '"') {
            //     const count = (this.q.match(/"/g) || []).length
            //     if (count % 2) {
            //         this.q = this.q + '"'
            //         // ctrl.setSelectionRange(pos, pos) // will need vue directive
            //     }
            // }

            // Field/Term autosuggest
            const lastField = this.q.split(' ').slice(-2).shift() // or split on `:`
            const lastTerm = this.q.split(' ').pop()
            if (lastField && lastField.trim().slice(-1) === ':') {
                const field = lastField.trim().slice(0, -1)
                if (_includes(AllFields, field)) {
                    const allFacets = [
                        ...this.patentFacets,
                        ...this.scholarFacets,
                    ]
                    allFacets.forEach(facet => {
                        if (facet.key === field) {
                            this.suggestTerms = facet.values.map(d => d.label).filter(label => {
                                return match(label, lastTerm)
                            })
                        }
                    })
                }
                // Remote autosuggest
                // classificationService.suggest('CPC', lastTerm).then(suggestions => {
                //     const truncated = suggestions.map(stripHtml).slice(0, 5)
                //     this.suggestTerms = truncated
                // })
            }

            // Prediate uppercase
            const keywords = ['and', 'or', 'not', 'to']
            keywords.forEach(keyword => {
                const trigger = ` ${keyword} `
                const index = -1 * trigger.length
                if (this.q.slice(index) === trigger) {
                    this.q = this.q.slice(0, index) + trigger.toUpperCase()
                }
            })

            if (this.q.slice(-4) === ' or ') {
                this.q = this.q.slice(0, -4) + ' OR '
            }

            const { isId, type } = looksLikeScholarlyId(this.q)
            this.looksLike.scholarlyId = isId
            if (isId) {
                this.idType = type
            }
            this.query = parser.parse(this.q)

            this.show.formattedQuery = _get(this.query, 'right') || (_get(this.query, 'left.field') && _get(this.query, 'left.field') !== '<implicit>')

            const fields = extractFields(this.query)
            this.invalidFields = _uniq(fields.filter(field => !_includes(AllFields, field)))

            this.classificationSymbols = this.q.match(/[A-HY][\d][\dA-Z/]*\w/gi) || []

            const term = this.q.split(' ').pop().toLowerCase()
            if (term.length > 1) {
                this.suggestFields = AllFields.filter(field => field.toLowerCase().indexOf(term) >= 0)
            }

            this.looksLike.scholarQuery = this.q.length > 3 && _intersection(fields, ArticleFieldsList).length === fields.length
            this.looksLike.patentQuery = this.q.length > 3 && _intersection(fields, PatentFieldsList).length === fields.length

        } catch (err) {
            // console.warn(err)
            this.error = err
        }
    }

    submit() {
        if (this.invalidFields.length) {
            this.error = {
                message: 'Invalid Fields: ' + this.invalidFields.join(', '),
            }
            return
        }
        this.$router.push({ query: { q: this.q } })

        console.log('todo: add to history')
        // let history = localStorage.getItem('history') || []
        // history.unshift(this.q)
        // localStorage.setItem('history', history)

        this.clearResults()

        const keywordQuery = this.q && !this.looksLike.scholarQuery && !this.looksLike.patentQuery
        this.loadingAll = true
        setTimeout(() => {
            let requests = []
            if (this.looksLike.scholarQuery || keywordQuery) {
                requests.push(this.searchScholar())
                requests.push(this.searchScholarFacets())
            }
            if (this.looksLike.patentQuery || keywordQuery) {
                requests.push(this.searchPatents())
                requests.push(this.searchPatentFacets())
            }
            // todo: this shouldn't branch like this
            if (this.classificationSymbols.length) {
                requests.push(this.lookupClassifications())
            } else {
                requests.push(this.searchClassifications())
            }
            Promise.all(requests).then(responses => {
                setTimeout(() => {
                    this.loadedAll = true
                }, 400)
            })
        }, 400)
    }

    searchScholar() {
        this.loading.articles = true
        const query = topCitedArticlesQuery(this.q)
        return articleService.search(query).then(([articles, res]) => {
            const response: SearchResponse = res
            // response.queries.SCHOLAR.joined
            this.totals.articles = response.query_result.hits.total
            this.articles = articles
            this.loading.articles = false
            const {searchId} = response.queries.SCHOLAR
            this.fetchCitingPatents(searchId)
        }).catch(err => {
            console.warn(err)
            this.loading.articles = false
        })
    }

    searchScholarFacets() {
        this.loading.scholarFacets = true
        const facetsQuery = articleFacetsQuery(this.q)
        return articleService.facets(facetsQuery).then(facets => {
            this.scholarFacets = facets.filter(facet => facet.values.length && facet.key !== 'dates')
            this.loading.scholarFacets = false
            this.hasScholarFacets = this.scholarFacets.length > 0
        }).catch(err => {
            console.warn(err)
            this.loading.scholarFacets = false
        })
    }

    searchPatents() {
        this.loading.patents = true
        return patentService.search(this.q).then(d => {
                this.loading.patents = false
                const { patents, response } = d
                this.patents = patents
                const { size, numFamilies } = response.result
                const { searchId, capped, joinResultSize } = response.joinedQueryStats.PATENT
                this.patentStats = { size, numFamilies, searchId, capped, joinResultSize }
                this.totals.patents = size
                this.fetchCitedArticles(searchId)
            }).catch(err => {
                console.warn(err)
                this.loading.patents = false
            })
    }

    searchPatentFacets() {
        this.loading.patentFacets = true
        return patentService.facets(this.q).then(facets => {
            this.patentFacets = facets
            this.hasPatentFacets = facets.length > 0
            this.loading.patentFacets = false
        }).catch(err => {
            console.warn(err)
            this.loading.patentFacets = false
        })
    }

    fetchCitedArticles(searchId: string) {
        // console.log('fetchCitedArticles', searchId)
        const query = citedArticlesCountQuery(searchId)
        return articleService.search(query).then(([articles, res]) => {
            const response: SearchResponse = res
            this.totals.citedArticles = response.query_result.hits.total
        })
    }

    fetchCitingPatents(searchId: string) {
        // console.log('fetchCitingPatents', searchId)
        return patentService.search('', searchId).then(({ patents, response }) => {
            this.citingPatents = patents
            this.totals.citingPatents = response.result.size
        })
    }

    searchCollections() { }

    searchClassifications() {
        classificationService.search('CPC', this.q).then(classifications => {
            this.classifications = _values(classifications).map(d => [d]) // hack
        })
    }

    lookupClassifications() {
        classificationService.bulkAncestorsAndSelf('CPC', this.classificationSymbols).then(classifications => {
            this.classifications = _values(classifications)
        })
    }

    searchInstitutions() { }

    toggleClassificationContext() {
        this.showClassificationContext = !this.showClassificationContext
    }

    toggleShow(k) {
        this.show[k] = !this.show[k]
    }
}
