export default class Project {
  constructor (project) {
    this.pid = project.pid
    this.projectName = project.projectName
    this.projectOwner = project.projectOwner
    this.overt = project.overt
    this.whoJoins = project.whoJoins
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
      whoJoins: null,
      status: null
    })
  }
}
