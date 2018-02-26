import { Component, Prop, Vue } from 'vue-property-decorator'
import Icon from 'vue-awesome'

import { Facet } from '../../models'
import { SimpleBarChartComponent } from '../';
import { ChartColours } from '../../enums';

import './facets.scss'

@Component({
    template: require('./facets.html'),
    name: 'facets',
    components: {
        icon: Icon,
        barchart: SimpleBarChartComponent
    }
})
export class FacetsComponent extends Vue {
    @Prop() title: string
    @Prop() facets: Facet[]

    setView(facet, view) {
        facet.view = view
    }

    barStyle(item, facet, i) {
        const max = facet.getMaxValue()
        const percent = Math.floor(item.value / max * 100)
        const width = percent + '%'
        return {
            width,
            'background-color': ChartColours[i % ChartColours.length],
        }
    }

    clickItem() {
        console.log(arguments)
    }
}
