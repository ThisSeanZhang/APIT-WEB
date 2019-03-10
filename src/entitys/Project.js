import { ajax } from '../api/fetch'
export default class Project {
  constructor (project) {
    this.pid = project.pid
    this.projectName = project.projectName
    this.projectOwner = project.projectOwner
    this.overt = project.overt
    this.whoJoins = project.whoJoins
    this.ownerName = project.ownerName
    this.status = project.status
    console.log(this)
  }

  static convertToProject (str) {
    return new Project(JSON.parse(str))
  }

  static newEmptyProject (str) {
    return new Project({
      pid: null,
      projectName: null,
      projectOwner: null,
      overt: null,
      ownerName: null,
      whoJoins: null,
      status: null
    })
  }

  static adminFetch (filter) {
    return ajax({
      method: 'GET',
      url: '/admin/projects',
      data: filter
    })
  }
}
