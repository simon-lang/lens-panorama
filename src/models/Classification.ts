export interface IClassification {
    symbol: string
    description: string
}

export class Classification implements IClassification {
    symbol: string
    description: string
    classTitle: string
    id: number
    level: number
    notesAndWarnings: string

    constructor(init?: Partial<Classification>) {
        Object.assign(this, init)
    }
}

// Probably don't bother with these. Just Classification with prop type

export class ClassificationIPC implements IClassification {
    symbol: string
    rawSymbol: string
    description: string
}
export class ClassificationUS implements IClassification {
    symbol: string
    description: string
}
