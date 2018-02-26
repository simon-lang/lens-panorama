import Vue from 'vue'
import { makeHot, reload } from './util/hot-reload'
import { createRouter } from './router'
import messages from './messages'

import BootstrapVue from 'bootstrap-vue'
import VueGoodTable from 'vue-good-table'
import VueI18n from 'vue-i18n'
import Icon from 'vue-awesome'

// Vue.use(Icon)
Vue.use(BootstrapVue)
Vue.use(VueGoodTable)
Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: 'es',
    messages,
})

import './sass/main.scss'

new Vue({
    el: '#app-main',
    router: createRouter(),
    components: {
        icon: Icon
    },
    i18n,
})
