import { Component, Prop, Vue } from 'vue-property-decorator'

import { ArticleFieldsList, PatentFieldsList } from '../../enums'
const AllFields = ArticleFieldsList.concat(PatentFieldsList)

import _includes from 'lodash/includes'

import './query.scss'

@Component({
    template: require('./query.html'),
    name: 'query',
    components: { }
})
export class QueryComponent extends Vue {
    @Prop() query: any
    @Prop() depth: number

    validField (name) {
        return _includes(AllFields, name)
    }
    formatTerm (s) {
        const hasWhitespace = s.indexOf(' ') >= 0
        return hasWhitespace ? `"${s}"` : s
    }
}
