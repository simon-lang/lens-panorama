// https://github.com/USPTO/PatentPublicData/blob/master/PatentDocument/src/main/java/gov/uspto/patent/model/classification/CpcClassification.java
// https://github.com/USPTO/PatentPublicData/blob/master/PatentDocument/src/main/java/gov/uspto/patent/model/classification/IpcClassification.java

export class Classification {
    symbol: string | any
    description: string
    classTitle: string
    id: number
    level: number
    notesAndWarnings: string

    constructor(init?: Partial<Classification>) {
        Object.assign(this, init)

        if (init.symbol && init.symbol.formatted) {
            this.symbol = init.symbol.formatted
        }
    }
}
