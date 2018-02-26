const message = k => k

export const PatentFields = [
    {
        key: 'lens_id',
        label: message('patent-field-lens_id'),
        group: 'general',
        example: '186-488-232-022-055'
    },
    {
        key: 'pub_key',
        label: message('patent-field-pub_key'),
        group: 'general',
        example: 'US_2013_0227762_A1'
    },
    {
        key: 'kind',
        label: message('patent-field-kind'),
        group: 'general',
        example: 'A1'
    },
    {
        key: 'pub_num',
        label: message('patent-field-pub_num'),
        group: 'general',
        example: '2013/0227762'
    },
    {
        key: 'pub_year',
        label: message('patent-field-pub_year'),
        group: 'general',
        example: '2018'
    },
    {
        key: 'title',
        label: message('patent-field-title'),
        group: 'general',
        example: '"Fidget Spinner"'
    },
    {
        key: 'abstract',
        label: message('patent-field-abstract'),
        group: 'general',
        example: '"Super Conductor"'
    },
    {
        key: 'applicant',
        label: message('patent-field-applicant'),
        group: 'general',
        example: '"Smith David"'
    },
    {
        key: 'inventor',
        label: message('patent-field-inventor'),
        group: 'general',
        example: 'Sally'
    },
    {
        key: 'owner',
        label: message('patent-field-owner'),
        group: 'general',
        example: '"Sony Ltd"'
    },
    {
        key: 'full_text',
        label: message('patent-field-full_text'),
        group: 'general',
        example: 'robot'
    },
    {
        key: 'claims',
        label: message('patent-field-claims'),
        group: 'general',
        example: 'semiconductor'
    },
    {
        key: 'classification_ipcr',
        label: message('patent-field-classification_ipcr'),
        group: 'classification',
        example: 'H01L21/768'
    },
    {
        key: 'classification_nat',
        label: message('patent-field-classification_nat'),
        group: 'classification',
        example: '221/220 (US classifications)'
    },
    {
        key: 'classification_cpc',
        label: message('patent-field-classification_cpc'),
        group: 'classification',
        example: 'H01L2924/00'
    },
    {
        key: 'citing_pub_key',
        label: message('patent-field-citing_pub_key'),
        group: 'citations',
        example: 'US_7128866_B1 - docs citing US_7128866_B1'
    },
    {
        key: 'citing_pub_key_count',
        label: message('patent-field-citing_pub_key_count'),
        group: 'citations',
        example: '10'
    },
    {
        key: 'citing_orcid_works',
        label: message('patent-field-citing_orcid_works'),
        group: 'citations',
        example: message('patentField.orcid.id.example')
    },
    {
        key: 'non_patent_citations',
        label: message('patent-field-non_patent_citations'),
        group: 'citations',
        example: '(journal medicine)'
    },
    {
        key: 'citation_id',
        label: message('patent-field-citation_id'),
        group: 'citations',
        example: '10.1038/NATURE03090'
    },
    {
        key: 'author',
        label: message('patent-field-author'),
        group: 'citations',
        example: '"Yamazaki S"~1'
    },
    {
        key: 'family_of_pub_key',
        label: message('patent-field-family_of_pub_key'),
        group: 'family',
        example: 'US_6408520_B1'
    },
    {
        key: 'family_jurisdiction',
        label: message('patent-field-family_jurisdiction'),
        group: 'family',
        example: '(US OR EP)'
    },
    {
        key: 'family_size',
        label: message('patent-field-family_size'),
        group: 'family',
        example: '[4 TO 6]'
    },
    {
        key: 'simple_family_of_pub_key',
        label: message('patent-field-simple_family_of_pub_key'),
        group: 'family',
        example: 'US_6408520_B1'
    },
    {
        key: 'simple_family_jurisdiction',
        label: message('patent-field-simple_family_jurisdiction'),
        group: 'family',
        example: 'US'
    },
    {
        key: 'simple_family_size',
        label: message('patent-field-simple_family_size'),
        group: 'family',
        example: '3'
    },
    {
        key: 'sequence_count',
        label: message('patent-field-sequence_count'),
        group: 'sequence',
        example: '[2 TO 3]'
    },
    {
        key: 'sequence_length',
        label: message('patent-field-sequence_length'),
        group: 'sequence',
        example: '[1 TO 100]'
    },
    {
        key: 'sequence_type',
        label: message('patent-field-sequence_type'),
        group: 'sequence',
        example: 'N - nucleotide, P - peptide'
    },
]

const AnalysisViews = {
    'pub_year': {
        facet: 'pub_year',
        types: ['line'],
        title: message('chart.title.pub_year'),
        filterName: 'dates'
    },
    'jurisdiction': {
        facet: 'jurisdiction',
        types: ['pie', 'cloud', 'map'],
        title: message('chart.title.jurisdiction'),
        filterName: 'j',
    },
    'owner': {
        facet: 'owner',
        types: ['logo-grid', 'bar', 'cloud'],
        title: message('chart.title.owner'),
        filterName: 'owner',
        hasExtra: true,
    },
    'applicant': {
        facet: 'applicant',
        types: ['logo-grid', 'bar', 'cloud'],
        title: message('chart.title.applicant'),
        filterName: 'applicant',
        hasExtra: true,
    },
    'type': {
        facet: 'type',
        title: message('chart.title.type'),
        types: ['pie', 'bar'],
        filterName: 'types',
    },
    'inventor': {
        facet: 'inventor',
        types: ['bar', 'cloud'],
        title: message('chart.title.inventor'),
        filterName: 'inventor',
        hasExtra: true,
    },
    'author': {
        facet: 'author',
        types: ['bar', 'cloud'],
        title: message('chart.title.author'),
        filterName: 'author',
        hasExtra: true,
    },
    'doi': {
        facet: 'doi',
        types: ['bar'],
        title: message('chart.title.doi'),
        filterName: 'doi',
    },
    'pmid': {
        facet: 'pmid',
        types: ['bar'],
        title: message('chart.title.pmid'),
        filterName: 'pmid',
    },
    'lens_npl_citation_id': {
        facet: 'lens_npl_citation_id',
        types: ['bar'],
        title: 'Cited Articles',
        filterName: 'npl',
    },
    'classification_cpc': {
        facet: 'classification_cpc',
        types: ['bar'],
        title: message('chart.title.classification_cpc'),
        filterName: 'classCpc',
    },
    'classification_ipcr': {
        facet: 'classification_ipcr',
        types: ['bar'],
        title: message('chart.title.classification_ipcr'),
        filterName: 'classIpcr',
    },
    'classification_nat': {
        facet: 'classification_nat',
        types: ['bar'],
        title: message('chart.title.classification_nat'),
        filterName: 'classNat',
    },
    'sequence_organism_taxid': {
        facet: 'sequence_organism_taxid',
        types: ['bar', 'pie'],
        title: message('chart.title.sequence_organism_taxid'),
        filterName: 'so',
    },
    'top_pc': {
        facet: 'top_pc',
        types: ['bar'],
        title: message('chart.title.top_pc'),
        patentLink: true,
        external: true
    }
}


export const PatentFieldsList = PatentFields.map(d => d.key)

// { label: 'jurisdiction', group: 'general', example: 'US' },
// { label: 'pub_date', group: 'general', example: '20170905 - yyyymmdd' },
// { label: 'filing_date', group: 'general', example: '20000519' },
// { label: 'earliest_priority_date', group: 'general', example: '20000519' },
// { label: 'has_full_text', group: 'general', example: 'true' },
// { label: 'sequence_organism_taxid', group: 'sequence', example: '9606 - containing human sequences, search by NCBI taxonomy identifier' },
// { label: 'sequence_document_location', group: 'sequence', example: 'CLAIM - contains sequences references in the claims(supported for WO, US, EP jurisdictions)' },
// { label: 'sequence_data_source', group: 'sequence', example: 'USPTO_PSIPS - sequence listings obtained from USPTO bulk sequence listings (possible values include: USPTO_PSIPS, USPTO_FULLTEXT_GB, USPTO_FULLTEXT_RB, GBPAT_EBI, GBPAT_DDBJ, GBPAT_NCBI, EMBLPAT_EBI, DDBJPAT, WIPO_SEQL, DE_MEGA, EP_MEGA, CIPO_BSL)' },
