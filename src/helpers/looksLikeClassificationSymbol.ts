export const looksLikeClassificationSymbol = term => {
    const r = /\d/
    return term.length > 1 && 'ABCDEFGHY'.includes(term[0].toUpperCase()) && r.test(term[1])
}
