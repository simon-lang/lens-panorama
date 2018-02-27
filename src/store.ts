import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    count: 1337,
    patents: [],
    articles: [],
    loadedAll: false
}

const mutations = {
    increment(state) {
        state.count++
    },
    setPatents(state, patents) {
        state.patents = patents
    },
    setArticles(state, articles) {
        state.articles = articles
    },
    loadedAll(state) {
        state.loadedAll = true
    },
    reset() {
        state.loadedAll = false
        state.articles = []
        state.patents = []
    }
}

const store = new Vuex.Store({
    state,
    mutations,
})

export default store
