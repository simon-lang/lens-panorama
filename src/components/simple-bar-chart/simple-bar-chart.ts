import { Component, Prop, Vue } from 'vue-property-decorator'

import './simple-bar-chart.scss'

interface BarItem {
    label: string
    value: number
}

@Component({
    template: require('./simple-bar-chart.html'),
    name: 'barchart',
    components: {}
})
export class SimpleBarChartComponent extends Vue {
    @Prop() values: BarItem[]

    barStyle() {
        return {
            backgroundColor: 'pink'
        }
    }

    clickItem() {
        console.log(arguments)
    }
}
