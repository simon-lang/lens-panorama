export type QueryType = 'SCHOLAR' | 'PATENT'

export interface QueryDetails {
    capped: boolean
    joinOptimisedResultSize: number
    joinResultSize: number
    joined: boolean
    searchId: string
    searchType: QueryType
    unjoinedResultSize: number
}

export interface QueryDetailsMap {
    PATENT?: QueryDetails
    SCHOLAR?: QueryDetails
}

export interface SearchResponse {
    query_result: QueryResult
    joiner_limit: number
    queries: QueryDetailsMap
}

export interface QueryResult {
    aggregations: any
    hits: Hits
    timed_out: boolean
    took: number
}

export interface Hits {
    hits: any[]
    total: number,
}
