import { Component, Vue } from 'vue-property-decorator'
import bNavbar from 'bootstrap-vue/es/components/navbar/navbar';
import { State, Getter, Mutation } from 'vuex-class'

import './navbar.scss'

@Component({
    template: require('./navbar.html'),
    components: {
        'b-navbar': bNavbar
    }
})
export class Navbar extends Vue {
    @State patents
    @State articles
    @State loadedAll
}
