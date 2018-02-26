import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    count: 1337
}

const store = new Vuex.Store({
    state,
    mutations: {
        increment(state) {
            state.count++
        }
    }
})

export default store
