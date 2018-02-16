import { Component, Vue } from 'vue-property-decorator'
import Icon from 'vue-awesome'

import { looksLikeScholarlyId, looksLikeClassificationSymbol, extractFields } from '../../helpers'
import { topCitedArticlesQuery, articleFacetsQuery } from '../../queries'

import _includes from 'lodash/includes'
import _uniq from 'lodash/uniq'

import parser from 'lucene-query-parser'

import { Article, Patent, Facet } from '../../models'

import { ArticleService, PatentService } from '../../services'
const articleService = new ArticleService()
const patentService = new PatentService()

import { ArticleFieldsList, PatentFieldsList } from '../../enums'
const AllFields = _uniq(ArticleFieldsList.concat(PatentFieldsList)).sort()

import { QueryComponent, FacetsComponent, SimpleBarChartComponent } from '../'

import suggestions from './suggestions'

import './client.scss'

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

    placeholder: string = DEFAULT_PLACEHOLDER

    invalidFields: any[] = []
    suggestFields: any[] = []
    selectedFieldIndex: number = 0

    suggestions: any[] = suggestions
    suggestIndex: number = 0

    error?: ParserError = null
    looksLike: any = {}
    idType: string = ''
    q: string = ''
    query: object = {}

    show: object = {
        queryParserResult: false,
        table: true,
    }

    patents: Patent[] = []
    articles: Article[] = []

    patentFacets: Facet[] = []
    hasPatentFacets = false

    scholarFacets: Facet[] = []
    hasScholarFacets = false

    interval: any

    mounted() {
        this.interval = setInterval(this.updatePlaceholder, 3000)
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

    clear() {
        this.q = ''
        this.parseQuery()
    }

    clearResults() {
        this.articles = []
        this.hasScholarFacets = false
        this.patents = []
        this.hasPatentFacets = false
    }

    keyup(event: KeyboardEvent) {
        clearInterval(this.interval)
        this.placeholder = DEFAULT_PLACEHOLDER

        if (event.keyCode === 38) {
            this.selectedFieldIndex = Math.max(-1, this.selectedFieldIndex - 1)
            return
        }
        if (event.keyCode === 40) {
            this.selectedFieldIndex = Math.min(this.suggestFields.length, this.selectedFieldIndex + 1)
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
            this.looksLike.classification = looksLikeClassificationSymbol(this.q)
            this.query = parser.parse(this.q)

            const fields = extractFields(this.query)
            this.invalidFields = _uniq(fields.filter(field => !_includes(AllFields, field)))

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

        this.clearResults()

        const keywordQuery = this.q && !this.looksLike.scholarQuery && !this.looksLike.patentQuery
        if (this.looksLike.scholarQuery || keywordQuery) {
            this.searchScholar()
            this.searchScholarFacets()
        }
        if (this.looksLike.patentQuery || keywordQuery) {
            this.searchPatents()
            this.searchPatentFacets()
        }
    }

    searchScholar() {
        this.loading.articles = true
        const query = topCitedArticlesQuery(this.q)
        articleService.search(query).then(([articles, res]) => {
            this.articles = articles
            this.loading.articles = false
        }).catch(err => {
            console.warn(err)
            this.loading.articles = false
        })
    }

    searchScholarFacets() {
        this.loading.articleFacets = true
        const facetsQuery = articleFacetsQuery(this.q)
        articleService.facets(facetsQuery).then(facets => {
            this.scholarFacets = facets
            this.loading.articleFacets = false
            this.hasScholarFacets = true
        }).catch(err => {
            console.warn(err)
            this.loading.articleFacets = false
        })
    }

    searchPatents() {
        this.loading.patents = true
        patentService.search(this.q).then(patents => {
            this.patents = patents
            this.loading.patents = false
        }).catch(err => {
            console.warn(err)
            this.loading.patents = false
        })
    }

    searchPatentFacets() {
        this.loading.patentFacets = true
        patentService.facets(this.q).then(facets => {
            this.patentFacets = facets
            this.hasPatentFacets = true
            this.loading.patentFacets = false
        }).catch(err => {
            console.warn(err)
            this.loading.patentFacets = false
        })
    }

    searchCollections() { }

    searchClassifications() { }

    searchInstitutions() { }
}
