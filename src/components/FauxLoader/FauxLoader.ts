import { Component, Prop, Vue } from 'vue-property-decorator'

import './FauxLoader.scss'

@Component({
    template: require('./FauxLoader.html'),
    name: 'FauxLoader',
    components: {}
})
export class FauxLoader extends Vue {
    text: string = 'Surveying landscape'

    silly = [
        'Surveying landscape',
        'Considering possibilities',
        'Changing perspective',
        'Capturing panoramic',
    ]

    verbose = [
        'Searching Patents',
        'Searching Scholarly works',
        'Joining cited Scholarly works',
        'Joining citing Patents',
        'Analysing facets',
        'Rendering report',
    ]

    source?: string[]

    suggestIndex = 0

    interval

    mounted() {
        this.source = this.verbose
        this.interval = setInterval(this.updateText, 2500)
    }

    updateText() {
        this.suggestIndex++
        if (this.suggestIndex >= this.source.length) {
            // this.suggestIndex = 0
            clearInterval(this.interval)
            return
        }
        this.text = this.source[this.suggestIndex] + '...'
    }

    beforeDestroy() {
        clearInterval(this.interval)
    }
}
