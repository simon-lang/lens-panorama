import { Component, Prop, Vue } from 'vue-property-decorator'

import { Facet } from '../../models'

import './facets.scss'
import { SimpleBarChartComponent } from '../';

@Component({
    template: require('./facets.html'),
    name: 'facets',
    components: {
        'simple-bar-chart': SimpleBarChartComponent
    }
})
export class FacetsComponent extends Vue {
    @Prop() title: string
    @Prop() facets: Facet[]
}
