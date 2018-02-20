import Vue from 'vue'
import { makeHot, reload } from './util/hot-reload'
import { createRouter } from './router'

import BootstrapVue from 'bootstrap-vue'
import VueScrollTo from 'vue-scrollto'
import VueGoodTable from 'vue-good-table'
import Scrollspy from 'vue2-scrollspy'

Vue.use(VueGoodTable)
Vue.use(BootstrapVue)
Vue.use(VueScrollTo)
Vue.use(Scrollspy)

import './sass/main.scss'

new Vue({
    el: '#app-main',
    router: createRouter(),
    components: { }
})
