export default class TreeNode {
  constructor (node) {
    this.nid = node.nid
    this.label = node.label
    this.leaf = node.leaf
    this.type = node.type
    this.contain = node.contain
    this.parentId = node.parentId
    this.ownerId = node.ownerId
    this.belongProject = node.belongProject
    this.children = node.children ? node.children : []
    console.log(this)
  }

  static nullNode (nid) {
    return new TreeNode({
      nid: nid,
      label: 'ccc',
      leaf: false,
      type: '',
      contain: '',
      parentId: '',
      ownerId: '1',
      belongProject: '1',
      children: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }]
    })
  }
}
