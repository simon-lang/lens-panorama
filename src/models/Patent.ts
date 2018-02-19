import { Classification } from './Classification'

class Jurisdiction {
    code: string
    flag: string
    name: string
}

class Owner {
    name: string
}

class Applicant {
    name: string
}

class Inventor {
    name: string
}

export class Patent {
    abstract: string = '' // not returned from service
    claims: string = '' // not returned from service

    lensId: number = null // { value: 9949448164002 },
    hasFullText: boolean = false
    familySize: number
    simpleFamilySize: number
    citedByCount: number
    publicationKey: string
    publicationDate: Date = null // 1308182400000,
    filingKey: string
    language: string // 'en'
    filingDate: Date // 1291852800000,
    title: string = ''
    kindCode: string = '' // 'A1',
    score: number // 0.8331177830696106,
    docType: string // 'Patent Application',
    displayKey: string = '' // 'WO 2011/072127 A1',
    seqExists: boolean = false
    seqCount: number
    jurisdiction: string = '' // Jurisdiction // 'WO',
    owners: Owner[] // [],
    applicants: Applicant[] // ['UNIV NORTH CAROLINA', ...],
    inventors: Inventor[]
    fulltextCollection: string // 'Application',
    cpcClassifications: Classification[]
    ipcrClassifications: Classification[]
    natClassifications: Classification[]
    titleFallbackToDisplayKey: string
    displayKeyAndTitle: string

    constructor(init?: Partial<Patent>) {
        Object.assign(this, init)
    }
}


