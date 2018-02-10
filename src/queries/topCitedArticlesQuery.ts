export const topCitedArticlesQuery = term => ({
    'scholarly_search': {
        'from': 0, 'size': '10', '_source': {
            'excludes': ['referenced_by_patent_hash', 'referenced_by_patent', 'reference']
        }, 'query': {
            'bool': {
                'must': [{
                    'query_string': {
                        'query': term, 'fields': ['title', 'abstract', 'default'], 'default_operator': 'and'
                    }
                }], 'must_not': [], 'filter': []
            }
        }, 'sort': [{
            'referenced_by_patent_count': {
                'order': 'desc'
            }
        }]
    },
    view: 'SCHOLAR',
})
