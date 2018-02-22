export const citedArticlesCountQuery = searchId => ({
    patent_search_id: searchId,
    scholarly_search: {
        size: 0,
    },
    view: 'SCHOLAR',
})
