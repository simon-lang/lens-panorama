export class FacetValue {
    key: string = ''
    label: string = '' // patents are displayName and sometimes missing. articles are "key"
    value: number = 0 // patents are count. articles are doc_count

    constructor(init?: Partial<FacetValue>) {
        if (init) {
            Object.assign(this, init)
        }
    }
}

export class Facet {
    type: 'scholar' | 'patent'
    key: string = ''
    label: string = ''
    value?: number
    values: FacetValue[] = []
    sumOtherDocCount?: number

    constructor(init?: Partial<Facet>) {
        if (init) {
            Object.assign(this, init)
        }
    }
}
