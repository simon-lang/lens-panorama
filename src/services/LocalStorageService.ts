const version = 1 // require('../../version.txt').trim()

export default class LocalStorageService {
    prefix = ''
    store = {}
    constructor(prefix, useVersion) {
        if (useVersion) {
            prefix = version + ':' + prefix
        }
        this.prefix = prefix
    }

    withPrefix(key) {
        if (this.prefix) {
            key = this.prefix + '.' + key
        }
        return key
    }

    get(k) {
        k = this.withPrefix(k)
        try {
            return JSON.parse(window.localStorage.getItem(k))
        } catch (e) {
            return this.store[k]
        }
    }

    set(k, v) {
        k = this.withPrefix(k)
        try {
            return window.localStorage.setItem(k, JSON.stringify(v))
        } catch (e) {
            this.store[k] = v
        }
    }

    remove(k) {
        k = this.withPrefix(k)
        try {
            return window.localStorage.removeItem(k)
        } catch (e) {
            delete this.store[k]
        }
    }
}
