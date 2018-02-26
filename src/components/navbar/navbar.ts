import { Component, Vue } from 'vue-property-decorator'
import bNavbar from 'bootstrap-vue/es/components/navbar/navbar';

import './navbar.scss'

@Component({
    template: require('./navbar.html'),
    components: {
        'b-navbar': bNavbar
    }
})
export class Navbar extends Vue {
    reportReady: boolean = false
}
