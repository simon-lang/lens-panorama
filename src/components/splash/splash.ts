import { Component, Vue } from 'vue-property-decorator'

import './splash.scss'

@Component({
    template: require('./splash.html'),
    components: { }
})
export class SplashComponent extends Vue {
    docs: string = require('../../../README.md')
    showDocs: boolean = false

    learnMore() {
        this.showDocs = true
    }
}
