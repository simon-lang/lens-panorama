export const SearchSuggestions = [
    'title:carbon', // Search all articles with title "carbon"
    'citation_id: 3327686', // view an article by scholarly identifier (doi / pmid)
    'pub_key: US_5599670_A',
    'source.title: Nature AND funding.organisation.keyword: "Wellcome Trust"',
    'malaria AND vaccine AND funding.organisation.keyword: "Wellcome Trust"',
    'author:"Richard Jefferson" OR abstract:glucuronidase AND title:GUS',
    '"malaria vaccine" AND year_published:[1970 TO 1980]',
    'title:(leishmani* AND diagnos*) || abstract:(leishmani* AND diagnos*)',
    '"invalid field" AND ownar: "Microsoft Inc"',
    '"scholar" AND source.title: Nature',
    '"conflicting fields" AND source.title: Nature AND pub_key: 123',
    'classification_cpc: ("A61K38/00" "C07K14/415" "A01H5/10")',
    'abstract:(a OR b) && title:(c OR d)',
    'Saccharomyces',
    'malaria',

    // Translate / map from plain english descriptions like below to boolean queries above
    // The above should be mapped to
    // 'Most recent articles in Nature Journal',
    // 'Most patent citations for MeSH Term: "Glucuronidase"',
    // 'Query "malaria vaccine" with open access / fulltext',
    // 'Chemical "Sildenafil Citrate" with funding data, but no clinical trial data',
    // 'Subject Oncology with no funding data',
    // 'All Japanese publications between 1900 and 1930',
    // All knowledge artefacts published within the last month
    // 'Author "Lipman DJ"',
    // 'Citation ID 3327686',
]
