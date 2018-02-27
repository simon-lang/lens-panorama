import _values from 'lodash/values'

export const SearchSuggestionsMap = {
    'Search both patents and scholarly simultaneously with keyword search: "malaria"': 'malaria',
    'Search by common patent and scholarly fields': 'author:"Richard Jefferson" OR abstract:glucuronidase AND title:GUS',
    'View an article by scholarly identifier (doi / pmid)': 'citation_id: 3327686',
    'View a patent by publication key': 'pub_key: US_5599670_A',
    'Search by Journal or Funding info': 'source.title: Nature AND funding.organisation.keyword: "Wellcome Trust"',
    'Search by date range': '"malaria vaccine" AND year_published:[1970 TO 1980]',
    'Search Classifications and see verbose descriptions': 'classification_cpc: ("A61K38/00" "C07K14/415" "A01H5/10")',
    'Example: Wildcards': 'title:(leishmani* AND diagnos*) || abstract:(leishmani* AND diagnos*)',
    'Example: Field checking': 'ownar: "Microsoft Inc"',
    'Example: conflicting boolean fields': 'source.title: Nature AND pub_key: 123',
    // Cited / Citing join demonstration
    // 'Most recent articles in Nature Journal',
    // 'Most patent citations for MeSH Term: "Glucuronidase"',
    // 'Query "malaria vaccine" with open access / fulltext',
    // 'Chemical "Sildenafil Citrate" with funding data, but no clinical trial data',
    // 'Subject Oncology with no funding data',
    // 'All Japanese publications between 1900 and 1930',
    // All knowledge artefacts published within the last month
    // 'Author "Lipman DJ"',
    // 'Citation ID 3327686',
}

export const SearchSuggestions = _values(SearchSuggestionsMap)
