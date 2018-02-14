import { Component, Vue } from 'vue-property-decorator'
import Icon from 'vue-awesome'

// import VueTypeahead from 'vue-typeahead'
// import D3Network from 'vue-d3-network'
// import 'vue-d3-network/dist/vue-d3-network.css'

import { looksLikeScholarlyId, looksLikeClassificationSymbol, extractFields } from '../../helpers'
import { topCitedArticlesQuery, articleFacetsQuery } from '../../queries'

import _includes from 'lodash/includes'
import _uniq from 'lodash/uniq'

import parser from 'lucene-query-parser'

import { Article, Patent } from '../../models'

import { ArticleService, PatentService } from '../../services'
const articleService = new ArticleService()
const patentService = new PatentService()

import { ArticleFieldsList, PatentFieldsList } from '../../enums'
const AllFields = _uniq(ArticleFieldsList.concat(PatentFieldsList)).sort()

import { QueryComponent } from '../query'

import suggestions from './suggestions'

import './client.scss'

const DEFAULT_PLACEHOLDER = 'Explore the world of patents, science, technology and innovation...'

interface GoodTableColumn {
    field: string
    label: string
}

@Component({
    template: require('./client.html'),
    components: {
        // VueTypeahead,
        Icon,
        'query': QueryComponent,
    }
})
export class ClientComponent extends Vue {
    // extends = VueTypeahead
    // src = AllFields

    loading: any = {}

    columns: GoodTableColumn[] = [
        {field: 'lensId', label: 'LensId'},
        {field: 'hasFullText', label: 'HasFullText'},
        {field: 'publicationDate', label: 'Publication Date'},
        {field: 'title', label: 'Title'},
        {field: 'kindCode', label: 'Kind Code'},
        {field: 'displayKey', label: 'Display Key'},
        {field: 'seqExists', label: 'Sequence Exists'},
        {field: 'jurisdiction', label: 'Jurisdiction'},
    ]

    placeholder: string = DEFAULT_PLACEHOLDER

    invalidFields: any[] = []
    suggestFields: any[] = []
    selectedFieldIndex: number = 0

    suggestions: any[] = suggestions
    suggestIndex: number = 0

    looksLike: any = {}
    idType: string = ''
    error: string = ''
    q: string = ''
    query: object = {}

    patents: Patent[] = []
    articles: Article[] = []

    patentFacets: any = {}
    hasPatentFacets = false

    scholarFacets: any = {}
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
        this.suggestions = []
        this.selectedFieldIndex = 0
    }

    clear() {
        this.q = ''
        this.parseQuery()
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

            if (this.q.slice(-5) === ' and ') {
                this.q = this.q.slice(0, -5) + ' AND '
            }
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
        this.articles = []
        articleService.list(query).then(([articles, res]) => {
            this.articles = articles
            this.loading.articles = false
        }).catch(err => {
            console.warn(err)
            this.loading.articles = false
        })
    }

    searchScholarFacets() {
        this.loading.articleFacets = true
        this.hasScholarFacets = false
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
        this.patents = []
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
        this.hasPatentFacets = false
        this.patents = []
        patentService.facets(this.q).then(facets => {
            this.patentFacets = facets
            this.hasPatentFacets = true
            this.loading.patentFacets = false
        }).catch(err => {
            console.warn(err)
            this.loading.patentFacets = false
        })
    }

    searchClassifications() {}

    searchInstitutions() {}
}
