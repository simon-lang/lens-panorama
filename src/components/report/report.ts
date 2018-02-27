import { Component, Prop, Vue } from 'vue-property-decorator'

import './report.scss'

@Component({
    template: require('./report.html'),
    name: 'report',
    components: {}
})
export class ReportComponent extends Vue {
}
