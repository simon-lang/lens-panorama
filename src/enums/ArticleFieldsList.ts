import { BadgeColours } from './BadgeColours'

export const ArticleFieldsMap = {
    'source.asjc_subject': {
        filter: true,
        label: 'Subject',
        views: ['cloud', 'bar'],
    },
    'source.country': {
        filter: false,
        label: 'Publisher Country',
        views: ['map', 'cloud'],
    },
    'source.title': {
        filter: true,
        label: 'Journal',
        views: ['bar'],
    },
    'citation_id_type': {
        filter: true,
        label: 'Citation Type',
        views: ['pie'],
    },
    'mesh_term.mesh_heading': {
        filter: true,
        label: 'MeSH Heading',
        views: ['cloud', 'bar'],
    },
    'chemical.name': {
        filter: true,
        label: 'Chemical',
        views: ['bar', 'cloud'],
    },
    'keyword': {
        filter: true,
        label: 'Keyword',
        views: ['cloud', 'bar'],
        icon: 'key',
        tooltip: 'Has Keywords',
    },
    'author.full_name': {
        filter: true,
        label: 'Author',
        views: ['bar'],
    },
    'source.type': {
        filter: true,
        label: 'Source Type',
        views: ['bar', 'pie'],
    },
    'reference.id': {
        filter: true,
        label: 'Referenced by',
    },
    'author.affiliation.keyword': {
        filter: true,
        label: 'Affiliation',
    },
    'funding.organisation.keyword': {
        filter: true,
        label: 'Funding',
        views: ['cloud', 'bar'],
    },
    'clinical_trial.trial_id': {
        filter: true,
        label: 'Clinical Trial',
    },
    'sum_referenced_by_patent_count': {
        label: 'Referenced by Patent Count',
    },
    'title': {
        label: 'Title',
    },
    'dates': {
        label: 'Year Published',
    },
    'referenced_by_patent': {
        label: 'Cited by patent',
        icon: 'link',
        prefix: 'is_',
        colour: BadgeColours.purple,
        tooltip: 'Cited by Patent',
    },
    'reference_count': {
        label: 'Reference count',
    },
    'crossref_reference_count': {
        label: 'CrossRef reference count',
    },
    'abstract': {
        icon: 'file-text-o',
        colour: BadgeColours.blue,
        label: 'Abstract',
        tooltip: 'Has Abstract',
    },
    'chemical': {
        icon: 'briefcase',
        colour: BadgeColours.green,
        label: 'Chemical',
        tooltip: 'Has Chemical Info',
    },
    'funding': {
        icon: 'usd',
        colour: BadgeColours.lime,
        label: 'Funding',
        tooltip: 'Has Funding Info',
    },
    'clinical_trial': {
        icon: 'heartbeat',
        colour: BadgeColours.yellow,
        label: 'Clinical Trial',
        tooltip: 'Has Clinical Trial',
    },
    'mesh_term': {
        icon: 'list',
        colour: BadgeColours.orange,
        label: 'MeSH Terms',
        tooltip: 'Has MeSH Terms',
    },
    'affiliation': {
        icon: 'address-card-o',
        colour: BadgeColours.pink,
        label: 'Affiliation',
        tooltip: 'Author Affliation',
    },
    'citation_id': {
        label: 'citation_id',
    },
    'volume': {
        label: 'volume',
    },
    'issue': {
        label: 'issue',
    },
    'start_page': {
        label: 'start_page',
    },
    'end_page': {
        label: 'end_page',
    },
    'year_published': {
        label: 'year_published',
    },
    'date_published': {
        label: 'date_published',
    },
    'author.last_name': {
        label: 'author.last_name',
    },
    'author.first_name': {
        label: 'author.first_name',
    },
    'author.affiliation': {
        label: 'author.affiliation',
    },
    'mesh_term.mesh_ui': {
        label: 'mesh_term.mesh_ui',
    },
    'chemical.substance_name': {
        label: 'chemical.substance_name',
    },
    'chemical.registry_number': {
        label: 'chemical.registry_number',
    },
    'chemical.mesh_ui': {
        label: 'chemical.mesh_ui',
    },
    'funding.country': {
        label: 'funding.country',
    },
    'funding.funding_name': {
        label: 'funding.funding_name',
    },
    'funding.funding_id': {
        label: 'funding.funding_id',
    },
    'funding.organisation': {
        label: 'funding.organisation',
    },
    'clinical_trial.registry': {
        label: 'clinical_trial.registry',
    },
    'referenced_by_patent.lens_id': {
        label: 'referenced_by_patent.lens_id',
    },
    'referenced_by_patent_count': {
        label: 'referenced_by_patent_count',
    },
    'source.publisher': {
        label: 'source.publisher',
    },
    'source.issn': {
        label: 'source.issn',
    },
}

export const ArticleFields = Object.keys(ArticleFieldsMap).map(key => ({
    key,
    ...ArticleFieldsMap[key],
}))

export const ArticleFieldsList = ArticleFields.map(d => d.key)

const InternalFieldsList = [
    'citation_id_type',
    'author.initials',
    'author.normalised_name',
    'author.collective_name',
    'mesh_term.qualifier_ui',
    'mesh_term.qualifier_name',
    'funding.organisation_id',
    'funding.organisation.keyword',
    'reference.text',
    'crossref_reference_count',
    'crossref_referenced_by_count',
    'referenced_by_patent.lens_id_num',
    'referenced_by_patent_hash',
    'source.type',
    'source.ssid',
    'source.nlmid',
    'source.asjc_code',
    'is_referenced_by_patent',
    'has_funding',
    'has_chemical',
    'has_affiliation',
    'has_mesh_term',
    'has_abstract',
    'has_keyword',
    'has_clinical_trial',
    'has_conflicting_metadata',
]
