// https://github.com/cambialens/t3as-pat-clas/tree/patcite/pat-clas-service

import IPCSymbolParser from './IPCSymbolParser'
import LocalStorageService from './LocalStorageService'

import { BASE_PLATCLASS_API_URL } from '../constants'
import { Classification } from '../models';

type ClassificationType = 'CPC' | 'IPC' | 'US'

export class ClassificationService {

    API_BASE_URL: string = BASE_PLATCLASS_API_URL
    blankCache: any = {
        children: {},
        search: {},
        suggest: {},
    }
    cache: boolean = false
    storage: LocalStorageService

    constructor(opts) {
        opts = opts || {}
        this.API_BASE_URL = opts.url || BASE_PLATCLASS_API_URL
        if (opts.cache === true) {
            if (!(opts.storage instanceof LocalStorageService)) {
                throw new Error('To enable cache you must supply an instance of LocalStorageService')
            }
            this.storage = opts.storage
            this.cache = this.storage.get('cache') || this.blankCache
        }
    }

    _checkCache(bucket, type, key) {
        if (this.cache && this.cache[bucket][type]) {
            if (this.cache[bucket][type][key]) {
                return this.cache[bucket][type][key]
            }
        }
        return null
    }

    _updateCache(bucket, type, key, value) {
        if (this.cache) {
            if (!this.cache[bucket][type]) {
                this.cache[bucket][type] = {}
            }
            this.cache[bucket][type][key] = value
            this.storage.set('cache', this.cache)
        }
    }

    _invoke(type, endpoint, data, method = 'GET') {
        const query = Object.keys(data)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
            .join('&')
        const url = this.API_BASE_URL + '/' + type + '/' + endpoint + (method === 'GET' ? '?' + query : '')
        let opts: any = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
        }
        if (method === 'POST') {
            opts.body = data
        }
        return fetch(url, opts).then(d => d.json())
    }

    suggest(type: ClassificationType, prefix: string): Promise<string[]> {
        let cached = this._checkCache('suggest', type, prefix)
        if (cached) {
            // const d = new $.Deferred()
            // return d.resolve(cached)
        }
        return this._invoke(type, 'suggest', {
            'prefix': prefix,
            'num': 10,
        }).then((response) => {
            const suggestions = response.exact.concat(response.fuzzy)
            this._updateCache('suggest', type, prefix, suggestions)
            return suggestions
        })
    }

    search(type, term, prefix = null, symbol = null) {
        if (!term) {
            return
        }
        let data = {
            'q': term,
            'stem': true,
            prefix: null, // ?
            symbol: null, // ?
        }
        if (prefix) data.prefix = prefix
        if (symbol) data.symbol = symbol

        return this._invoke(type, 'search', data)
    }

    ancestorsAndSelf(type, symbol): Promise<Classification[]> {
        if (type === 'IPC') {
            symbol = IPCSymbolParser(symbol)
        }
        let cached = this._checkCache('search', type, symbol)
        if (cached) {
            return cached
        }
        return this._invoke(type, 'ancestorsAndSelf', {
            'format': 'text',
            'symbol': symbol,
        }).then((items) => {
            this._updateCache('search', type, symbol, items)
            return items.map(item => new Classification(item))
        })
    }

    bulkAncestorsAndSelf(type, symbols: string[] = []) {
        symbols = symbols.map(d => d.toUpperCase())
        let data = JSON.stringify({
            'format': 'text',
            'symbols': symbols,
        })
        return this._invoke(type, 'bulkAncestorsAndSelf', data, 'POST')
    }

    getChildren(type, id) {
        let cached = this._checkCache('children', type, id)
        if (cached) {
            return cached
        }
        let data = {
            'format': 'text',
            parentId: null, // ?
        }
        if (id) {
            data.parentId = id
        } else if (type === 'USPC') {
            // USPC root returns 9MB data. temp workaround
            // var d = new $.Deferred()
            // return d.resolve([])
        }
        return this._invoke(type, 'children', data).then((items) => {
            this._updateCache('children', type, id, items)
            return items
        })
    }

    clearCache() {
        this.storage.set('cache', this.blankCache)
    }

}
