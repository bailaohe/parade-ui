import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  executing: {},
}

const getters = {
  getExecuting: (state) => (id) => {
    return state.executing[id]
  }
}

const mutations = {
  updateExecuting (state, id, up) {
    if (id in state.executing) {
        state.executing[id] = {...state.executing[id], ...up}
    } else {
        Vue.set(state.executing, id, up)
    }
  }
}

export default new Vuex.Store({
  state,
  mutations
})
