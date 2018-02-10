export class Base {
    aliases: any = {}
    constructor(init: Partial<Base>, aliases) {
        if (init) {
            Object.keys(init).forEach(k => {
                const alias: string = aliases[k] || k
                if (this.hasOwnProperty(alias)) {
                    this[alias] = init[k]
                }
            })
        }
    }
}
