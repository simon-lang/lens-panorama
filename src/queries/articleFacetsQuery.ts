export const articleFacetsQuery = term => ({
    'scholarly_search': {
        'size': 0,
        'query': {
            'bool': {
                'must': [{
                    'query_string': {
                        'query': term,
                        'fields': ['title', 'abstract', 'default'],
                        'default_operator': 'and'
                    }
                }]
            }
        },
        aggs: {
            'author.full_name': { 'terms': { 'field': 'author.normalised_name.keyword' } },
            'source.title': { 'terms': { 'field': 'source.title.keyword' } },
            'source.type': { 'terms': { 'field': 'source.type' } },
            'source.country': { 'terms': { 'field': 'source.country', size: 100 } },
            'source.asjc_subject': { 'terms': { 'field': 'source.asjc_subject.keyword' } },
            'mesh_term.mesh_heading': { 'terms': { 'field': 'mesh_term.mesh_heading' } },
            'chemical.name': { 'terms': { 'field': 'chemical.substance_name.keyword' } },
            'citation_id_type': { 'terms': { 'field': 'citation_id_type' } },
            'sum_referenced_by_patent_count': { 'sum': { 'field': 'referenced_by_patent_count' } },
            'keyword': { 'terms': { 'field': 'keyword' } },
            'funding.organisation.keyword': { 'terms': { 'field': 'funding.organisation.keyword' } },
            'dates': {
                'date_histogram': {
                    'field': 'date_published',
                    'interval': 'year',
                    'min_doc_count': 1,
                    'format': 'yyyy'
                }
            }
        }
    },
    view: 'SCHOLAR',
})
