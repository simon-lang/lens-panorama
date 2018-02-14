import { Component, Vue } from 'vue-property-decorator'
import { ClientComponent } from '../client';
import { Navbar } from '../navbar'

import './app.scss'

@Component({
    template: require('./app.html'),
    components: {
        'Client': ClientComponent,
        Navbar,
    }
})
export class AppComponent extends Vue {

}
