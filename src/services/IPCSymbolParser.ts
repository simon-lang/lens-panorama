// `C12N15/82` => `C12N0015820000`

// - first 4 chars as-is => `C12N`
// - next number before slash gets left-padded to 4 figures `15` => `0015`
// - remove slash
// - number after slash gets right-padded to 6 figures `82` => `820000`

export default (symbol) => {
    if (symbol.length === 14) {
        return inverse(symbol)
    }
    if (symbol.length <= 4) {
        return symbol
    }
    let x, y
    [x, y] = symbol.split('/')
    let a = x.substr(0, 4)
    let b = String('0000' + x.substr(4)).slice(-4) // pad left
    let c = ''
    if (y) {
        c = y + Array(6 - y.length + 1).join('0') // pad right
    }
    return a + b + c
}

const inverse = (symbol) => {
    let a = symbol.substr(0, 4)
    let b = parseFloat(symbol.substr(4, 4))
    let c = symbol.substr(8)
    while (c.substr(-1) === '0' && c.length > 2) {
        c = c.substr(0, c.length - 1)
    }
    return a + b + '/' + c
}
