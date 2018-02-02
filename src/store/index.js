import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  executing: {},
}

const getters = {
  getExecuting: (state) => (id) => {
    return (id in state.executing) ? state.executing[id] : {}
  }
}

const mutations = {
  updateExecuting (state, payload) {
    let id = payload.id
    let up = payload.data
    if (id in state.executing) {
        state.executing[id] = {...state.executing[id], ...up}
    } else {
        Vue.set(state.executing, id, up)
    }
  },
  resetExecuting(state, id) {
    if (id in state.executing) {
      state.executing[id] = {}
    }
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
