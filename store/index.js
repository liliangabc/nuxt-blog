/**
 * 状态管理模块
 */

export const state = () => {
  return {
    user: {}
  }
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let { user } = req.session
    if (user) {
      commit('SET_USER', user)
    }
  }
}