const version = require('../../version.txt').trim()

export default class LocalStorageService {
    prefix: string = ''
    store: any = {}
    constructor(prefix: string, useVersion: boolean = false) {
        if (useVersion) {
            prefix = version + ':' + prefix
        }
        this.prefix = prefix
    }

    withPrefix(k: string) {
        if (this.prefix) {
            k = this.prefix + '.' + k
        }
        return k
    }

    get(k: string) {
        k = this.withPrefix(k)
        try {
            return JSON.parse(window.localStorage.getItem(k))
        } catch (e) {
            return this.store[k]
        }
    }

    set(k: string, v: any) {
        k = this.withPrefix(k)
        try {
            return window.localStorage.setItem(k, JSON.stringify(v))
        } catch (e) {
            this.store[k] = v
        }
    }

    remove(k: string) {
        k = this.withPrefix(k)
        try {
            return window.localStorage.removeItem(k)
        } catch (e) {
            delete this.store[k]
        }
    }
}
