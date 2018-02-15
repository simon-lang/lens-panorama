export class FacetValue {
    label: string = '' // patents are displayName and sometimes missing. articles are "key"
    value: number = 0 // patents are count. articles are doc_count
}

export class Facet {
    key: string = ''
    label: string = ''
    values: FacetValue[]
    sumOtherDocCount?: number
}
