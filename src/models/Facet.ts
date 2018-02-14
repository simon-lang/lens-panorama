const example = {
    'owner': {
        'INTERNATIONAL BUSINESS MACHINES CORPORATION': {
            'displayName': 'International Business Machines Corporation',
                'count': 206
        }
    },
    'sequence_organism_taxid': {
        '1488': {
            'displayName': 'Clostridium acetobutylicum',
                'count': 72
        }
    }
}

export class FacetValue {
    label: string = ''
    value: number = 0
}

export class Facet {
    key: string = ''
    values: FacetValue[]
}
