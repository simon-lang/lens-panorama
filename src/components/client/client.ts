import { Component, Vue } from 'vue-property-decorator'
import Icon from 'vue-awesome'

import { looksLikeScholarlyId, looksLikeClassificationSymbol, extractFields } from '../../helpers'
import { topCitedArticlesQuery, articleFacetsQuery } from '../../queries'

import _includes from 'lodash/includes'
import _uniq from 'lodash/uniq'
import _values from 'lodash/values'
import _get from 'lodash/get'

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

    showSuggestions = false
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
        formattedQuery: false,
        queryParserResult: false,
        table: true,
        applicantLogoGrid: false,
    }

    patents: Patent[] = []
    articles: Article[] = []
    classifications: Classification[] = []

    patentFacets: Facet[] = []
    hasPatentFacets = false
    patentStats: any = {}

    scholarFacets: Facet[] = []
    hasScholarFacets = false

    totalArticles = 0

    interval: any
    autoRunSearch: true

    loadingAll: boolean = false
    loadedAll: boolean = false

    mounted() {
        this.interval = setInterval(this.updatePlaceholder, 3000)

        this.q = this.$route.query.q || ''
        // not working
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
    }

    selectField(field) {
        let terms = this.q.split(' ')
        terms.pop()
        terms.push(field + ': ')
        this.q = terms.join(' ')
        this.suggestFields = []
        this.selectedFieldIndex = 0
    }

    selectTerm(term) {
        let terms = this.q.split(' ') // space wont work
        terms.pop()
        terms.push(`"${term}"`)
        // terms.push(`(${term})`)
        this.q = terms.join(' ')
        this.suggestTerms = []
        this.selectedFieldIndex = 0
    }

    clear() {
        this.q = ''
        this.$router.push({ query: { q: this.q } })
        this.parseQuery()
    }

    clearResults() {
        // this.loadedAll = false // test this out
        // this.loadingAll = false // test this out
        this.articles = []
        this.totalArticles = 0
        this.hasScholarFacets = false
        this.patents = []
        this.hasPatentFacets = false
        this.classifications = []
        this.show.suggestions = false
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
            this.submit()
            return
        }
        this.parseQuery()
    }

    parseQuery(event: any = null) {
        if (!this.q) {
            this.clearResults()
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
                    this.patentFacets.forEach(facet => {
                        if (facet.key === field) {
                            this.suggestTerms = facet.values.map(d => d.label).filter(label => {
                                return label.toLowerCase().indexOf(lastTerm.toLowerCase()) >= 0
                            })
                        }
                    })
                    // TODO: scholar facets too
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

            fields.forEach((field: string) => {
                if (!this.looksLike.scholarQuery && _includes(ArticleFieldsList, field) && !_includes(PatentFieldsList, field)) {
                    this.looksLike.scholarQuery = true
                }
                if (!this.looksLike.patentQuery && _includes(PatentFieldsList, field) && !_includes(ArticleFieldsList, field)) {
                    this.looksLike.patentQuery = true
                }
            })

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
        // this.show.suggestions = true
        this.$router.push({ query: { q: this.q } })

        console.log('todo: add to history')
        // let history = localStorage.getItem('history') || []
        // history.unshift(this.q)
        // localStorage.setItem('history', history)

        this.clearResults()

        const keywordQuery = this.q && !this.looksLike.scholarQuery && !this.looksLike.patentQuery
        // if (this.looksLike.scholarQuery || keywordQuery) {
        //     this.searchScholar()
        //     this.searchScholarFacets()
        // }
        // if (this.looksLike.patentQuery || keywordQuery) {
        //     this.searchPatents()
        //     this.searchPatentFacets()
        // }
        this.loadingAll = true
        setTimeout(() => {
            const requests = [
                this.searchScholar(),
                this.searchScholarFacets(),
                this.searchPatents(),
                this.searchPatentFacets(),
            ]
            Promise.all(requests).then(responses => {
                // this.loadingAll = false
                this.loadedAll = true
            })
        }, 400)
        if (this.classificationSymbols.length) {
            this.lookupClassifications()
        }
    }

    anyLoading() {
        return this.loading.patents || this.loading.articles || this.loading.patentFacets || this.loading.articleFacets
    }

    allLoaded() {
        return this.hasPatentFacets && this.hasScholarFacets && this.patents.length && this.articles.length
    }

    searchScholar() {
        this.loading.articles = true
        const query = topCitedArticlesQuery(this.q)
        articleService.search(query).then(([articles, res]) => {
            const response: SearchResponse = res
            // response.queries.SCHOLAR.joined
            this.totalArticles = response.query_result.hits.total
            this.articles = articles
            this.loading.articles = false
            // perform citing patents join search
        }).catch(err => {
            console.warn(err)
            this.loading.articles = false
        })
    }

    searchScholarFacets() {
        this.loading.articleFacets = true
        const facetsQuery = articleFacetsQuery(this.q)
        articleService.facets(facetsQuery).then(facets => {
            this.scholarFacets = facets // .filter(facet => facet.key !== 'dates')
            this.loading.articleFacets = false
            this.hasScholarFacets = true
        }).catch(err => {
            console.warn(err)
            this.loading.articleFacets = false
        })
    }

    searchPatents() {
        this.loading.patents = true
        patentService.search(this.q)
            .then(d => {
                this.loading.patents = false
                const { patents, response } = d
                // console.log(response)
                this.patents = patents
                const { size, numFamilies } = response.result
                const { searchId, capped, joinResultSize } = response.joinedQueryStats.PATENT
                console.log({ patentSearchId: searchId })
                this.patentStats = { size, numFamilies, searchId, capped, joinResultSize }
                // perform cited articles join search
            })
            .catch(err => {
                console.warn(err)
                this.loading.patents = false
            })
    }

    searchPatentFacets() {
        this.loading.patentFacets = true
        patentService.facets(this.q).then(facets => {
            this.patentFacets = facets
            let map = {}
            facets.forEach(d => {
                map[d.key] = d
            })
            this.hasPatentFacets = true
            this.loading.patentFacets = false
        }).catch(err => {
            console.warn(err)
            this.loading.patentFacets = false
        })
    }

    searchCollections() { }

    searchClassifications() {
        classificationService.search('CPC', this.q).then(classifications => {
            console.log({ classifications })
            // this.classifications = _values(classifications)
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

}
