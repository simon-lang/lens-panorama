import {Affiliation} from './Affiliation'

const aliases = {
    'first_name': 'firstName',
    'last_name': 'lastName',
    'affiliation': 'affiliations',
}

export class Author {
    initials: string = ''
    firstName: string = ''
    lastName: string = ''
    normalisedName: string = ''
    displayName: string = ''
    affiliations: Affiliation[] = []
    constructor(init?: Partial<Author>) {
        if (init) {
            Object.keys(init).forEach(k => {
                const alias: string = aliases[k] || k
                if (this.hasOwnProperty(alias)) {
                    this[alias] = init[k]
                }
            })
        }
        this.displayName = `${this.firstName || this.initials} ${this.lastName}`
    }
}
