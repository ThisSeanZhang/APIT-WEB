const state = {
  projects: []
}

const mutations = {
  FLASH_THE_INFO (state, info) {
    state.projects = info
  }
}

const actions = {
  setProjects ({ commit }, projects) {
    if (projects && projects instanceof Array) {
      commit('FLASH_THE_INFO', projects)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
