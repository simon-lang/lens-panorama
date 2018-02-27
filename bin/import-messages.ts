const locales = ['en', 'es', 'zh']
const keys = [
    'chart.title.applicant',
    'chart.title.author',
    'chart.title.classification_cpc',
    'chart.title.classification_ipcr',
    'chart.title.classification_nat',
    'chart.title.doi',
    'chart.title.embed',
    'chart.title.embed.dimensions',
    'chart.title.embed.height',
    'chart.title.embed.snippet',
    'chart.title.embed.title',
    'chart.title.embed.width',
    'chart.title.inventor',
    'chart.title.jurisdiction',
    'chart.title.owner',
    'chart.title.pmid',
    'chart.title.pub_year',
    'chart.title.sequence_organism_taxid',
    'chart.title.top_pc',
    'chart.title.type',
    'common.action.cancel',
    'common.action.collapseAll',
    'common.action.delete',
    'common.action.expandAll',
    'common.action.import',
    'common.action.ok',
    'common.action.save',
    'common.action.saved',
    'common.action.search',
    'common.action.selectAll',
    'common.alert.deletion',
    'common.and.its',
    'common.collection',
    'common.dateCreated',
    'common.deleting.your',
    'common.editName',
    'common.editTitleAndDescription',
    'common.items',
    'common.learn.more',
    'common.loading',
    'common.no',
    'common.note',
    'common.numberItems',
    'common.soon',
    'common.Updated',
    'common.updated.successfully',
    'common.yes',
    'results.graphical',
    'results.graphical.notice',
    'results.save.query',
    'results.tabTitleCollections',
    'results.tabTitlePatents',
    'results.tabTitleScholarly',
    'results.view.summary',
    'results.workspace.signup',
    'scholar.badge.label.abstract',
    'scholar.badge.label.affiliation',
    'scholar.badge.label.chemical',
    'scholar.badge.label.clinical_trial',
    'scholar.badge.label.funding',
    'scholar.badge.label.keyword',
    'scholar.badge.label.mesh_term',
    'scholar.badge.label.metadata',
    'scholar.badge.label.referenced_by_patent',
    'scholar.badge.tooltip.abstract',
    'scholar.badge.tooltip.affiliation',
    'scholar.badge.tooltip.chemical',
    'scholar.badge.tooltip.clinical_trial',
    'scholar.badge.tooltip.funding',
    'scholar.badge.tooltip.keyword',
    'scholar.badge.tooltip.mesh_term',
    'scholar.badge.tooltip.metadata',
    'scholar.badge.tooltip.referenced_by_patent',
    'scholar.common.abstract',
    'scholar.common.affiliated.dossier',
    'scholar.common.affiliation',
    'scholar.common.article_summary',
    'scholar.common.chemicals',
    'scholar.common.citations',
    'scholar.common.clinical_info',
    'scholar.common.explore_more_articles',
    'scholar.common.funding_info',
    'scholar.common.issue',
    'scholar.common.journal_article',
    'scholar.common.keyword',
    'scholar.common.keywords',
    'scholar.common.mesh_terms',
    'scholar.common.notes',
    'scholar.common.page',
    'scholar.common.publication_type',
    'scholar.common.published',
    'scholar.common.publisher',
    'scholar.common.view_full_text',
    'scholar.common.volume',
    'scholar.field.author.affiliation.keyword',
    'scholar.field.author.full_name',
    'scholar.field.chemical.name',
    'scholar.field.citation_id_type',
    'scholar.field.clinical_trial.trial_id',
    'scholar.field.crossref_reference_count',
    'scholar.field.dates',
    'scholar.field.funding.organisation.keyword',
    'scholar.field.keyword',
    'scholar.field.mesh_term.mesh_heading',
    'scholar.field.reference_count',
    'scholar.field.reference.id',
    'scholar.field.referenced_by_patent',
    'scholar.field.source.asjc_subject',
    'scholar.field.source.country',
    'scholar.field.source.title',
    'scholar.field.source.type',
    'scholar.field.title',
]

const fs = require('fs')

const messages = require('../data/messages.json')

let map = {}

locales.forEach(locale => {
    map[locale] = {
    }
    keys.forEach(key => {
        console.log(`${locale}: ${key}`)
        map[locale][key] = messages[locale].messages[key]
    })
})

const json = JSON.stringify(map, null, 2)
fs.writeFileSync('./data/messages-condensed.json', json)
