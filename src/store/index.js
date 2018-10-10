import Vue from 'vue'
import Vuex from 'vuex'
import { signInApi } from '@/modules/auth'

Vue.use(Vuex)

const state = {
  authUser: null,
  alert: {
    title: '',
    type: '',   // Either error, info or warning
    show: false
  }
}

const getters = {
  authUser (state) { return state.authUser },
  alert (state) { return state.alert }
}

const mutations = {
  setAuthUser (state, payload) {
    state.authUser = payload
  },

  closeAlert (state) {
    state.alert = {
      title: '',
      type: '',
      show: false
    }
  },

  showAlert (state, payload) {
    state.alert = payload
    state.alert.show = true
  }
}

const actions = {
  signIn ({ commit }, payload) {
    signInApi(payload).then(res => {
      const { token, user } = res
      const authUser = { token, user }
      commit('setAuthUser', authUser)
    }).catch(error => {
      commit('showAlert', {
        title: error.message,
        type: 'error',
        show: true
      })
    })
  }
}

const store = {
  state,
  getters,
  mutations,
  actions
}

export default new Vuex.Store(store)
