import { Component, Prop, Vue } from 'vue-property-decorator'

import './docs.scss'

import { Navbar } from '../navbar'

@Component({
    template: require('./docs.html'),
    name: 'docs',
    components: { Navbar }
})
export class DocsComponent extends Vue {
    content: string = require('../../../README.md')
    sticky: boolean = true
}
