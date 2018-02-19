import { Author, Affiliation, Chemical, MeshTerm } from './'

interface IArticleID {
    key: any
}

class PMID implements IArticleID {
    key: number
    constructor(key: number) {
        this.key = key
    }
}
class PMCID implements IArticleID {
    key: string
}
class DOI implements IArticleID {
    key: string
}

class IDFactory {
    create(key: any) {
        return new PMID(key)
    }
}
const IdFactory = new IDFactory()

interface IJournal {
    // type: string
    title: string
    publisher: string
}

interface IArticle {
    // id: IArticleID
    title: string
    abstract: string
    journal: IJournal
    authors: Author[]
}

const aliases = {
    'keyword': 'keywords',
    'source': 'journal',
    'author': 'authors',
    'mesh_terms': 'meshTerms',
    'mesh_term': 'meshTerms',
    'chemical': 'chemicals',
    'funding': 'fundings',
    'clinical_trial': 'clinical_trials',
    'crossref_referenced_by_count': 'num_forward_citations',
}

export class Article implements IArticle {
    // id: IArticleID
    id: string = ''
    ids: any[] = []
    title: string = ''
    abstract: string = ''
    journal: IJournal
    authors: Author[] = []
    affiliations: Set<Affiliation> = new Set()
    meshTerms: MeshTerm[] = []
    chemicals: Chemical[] = []
    constructor(init?: Partial<Article>, meta: any = {}) {
        if (init) {
            Object.keys(init).forEach(k => {
                const alias: string = aliases[k] || k
                if (this.hasOwnProperty(alias)) {
                    init[alias] = init[k] // copy property over for use below
                    this[alias] = init[k]
                }
            })

            if (init.authors) {
                this.authors = []
                init.authors.forEach(d => {
                    const author = new Author(d)
                    this.authors.push(author)
                })
            }
        }

        if (!this.id && this.ids && this.ids.length) {
            let ids = this.ids.filter(id => id.type === 'pmid')
            this.id = ids[0] ? ids[0].value : this.ids[0].value
        }

        this.authors.forEach(author => {
            author.affiliations.forEach(affiliation => {
                this.affiliations.add(affiliation)
            })
        })

        if (meta.id) {
            this.id = meta.id
        }
    }
}
