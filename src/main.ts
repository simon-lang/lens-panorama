import Vue from 'vue'
import { makeHot, reload } from './util/hot-reload'
import { createRouter } from './router'

import BootstrapVue from 'bootstrap-vue'
import VueScrollTo from 'vue-scrollto'
import VueGoodTable from 'vue-good-table'

Vue.use(VueGoodTable)
Vue.use(BootstrapVue)
Vue.use(VueScrollTo)

import './sass/main.scss'

new Vue({
    el: '#app-main',
    router: createRouter(),
    components: { }
})
