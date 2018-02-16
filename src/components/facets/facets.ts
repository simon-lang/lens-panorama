import { Component, Prop, Vue } from 'vue-property-decorator'

import { Facet } from '../../models'

import './facets.scss'

@Component({
    template: require('./facets.html'),
    name: 'facets',
    components: {}
})
export class FacetsComponent extends Vue {
    @Prop() facets: any
}
