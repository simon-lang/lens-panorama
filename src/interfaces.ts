import { Article, Patent } from './models'

// Common

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

// Scholarly

export interface Hits {
    hits: any[]
    total: number,
}

export interface QueryResult {
    aggregations: any
    hits: Hits
    timed_out: boolean
    took: number
}

export interface MultiSearchResponse {
    query_result: QueryResult
    joiner_limit: number
    queries: QueryDetailsMap
}

export interface ArticleSearchResponse {
    articles: Article[]
    response: MultiSearchResponse
}

// Patent

export interface LegacyPatentSearchResult {
    hits: any[]
    elapsedTime: number
    numFamilies: number
    size: number
}

export interface LegacyPatentSearchResponse {
    joinedQueryStats: QueryDetailsMap
    filters: any
    query: any
    result: LegacyPatentSearchResult
}

export interface PatentSearchResponse {
    patents: Patent[]
    response: LegacyPatentSearchResponse
}
