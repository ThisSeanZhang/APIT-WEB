const state = {
  projects: [],
  treeNodes: []
}

const mutations = {
  FLASH_THE_PROJECTS (state, info) {
    state.projects = info
  },
  FLASH_THE_NODES (state, info) {
    state.treeNodes = info
  }
}

const actions = {
  setProjects ({ commit }, projects) {
    if (projects && projects instanceof Array) {
      commit('FLASH_THE_PROJECTS', projects)
    }
  },
  setTreeNodes ({ commit }, nodes) {
    if (nodes && nodes instanceof Array) {
      commit('FLASH_THE_NODES', nodes)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
