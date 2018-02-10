export interface IClassification {
    symbol: string
    description: string
}

export class ClassificationCPC implements IClassification {
    symbol: string
    description: string
}
export class ClassificationIPC implements IClassification {
    symbol: string
    rawSymbol: string
    description: string
}
export class ClassificationUS implements IClassification {
    symbol: string
    description: string
}
