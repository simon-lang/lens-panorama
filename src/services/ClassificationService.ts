import IPCSymbolParser from './IPCSymbolParser'
import LocalStorageService from './LocalStorageService'

import { BASE_PLATCLASS_API_URL } from '../constants'

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
        this.API_BASE_URL = opts.url // || window.UI_CONFIG.patclassApiBaseUrl
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
        const url = this.API_BASE_URL + '/' + type + '/' + endpoint
        return fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    }

    suggest(type, prefix) {
        let cached = this._checkCache('suggest', type, prefix)
        if (cached) {
            // const d = new $.Deferred()
            // return d.resolve(cached)
        }
        return this._invoke(type, 'suggest', {
            'prefix': prefix,
            'num': 10,
        }).then((response) => {
            this._updateCache('suggest', type, prefix, response)
            return response
        })
    }

    search(type, term, prefix, symbol) {
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

    ancestorsAndSelf(type, symbol) {
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
            return items
        })
    }

    bulkAncestorsAndSelf(type, symbols) {
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
