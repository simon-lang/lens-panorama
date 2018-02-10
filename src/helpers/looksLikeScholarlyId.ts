import _isNaN from 'lodash/isNaN'

export const looksLikeScholarlyId = value => {
    const numberValue = parseFloat(value)
    const isDoi = value.slice(0, 3) === '10.'
    const isPMC = value.slice(0, 3) === 'pmc'
    const isPmid = !_isNaN(numberValue) && Math.floor(numberValue) === numberValue
    const isId = isDoi || isPMC || isPmid
    const type = isDoi ? 'DOI' : isPMC ? 'PMCID' : 'PMID'
    return { isDoi, isPMC, isPmid, isId, type }
}
