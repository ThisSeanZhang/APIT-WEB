<template>
  <div class="aside">
    <div v-loading="obtionStatus === requestStatus.FETCHING" class="contant">
      <div class="contant_is_empty" v-if="obtionStatus !== requestStatus.SUCCESS">
        <div v-if="obtionStatus === requestStatus.NOTFOUND">
          空空的诶(●ˇ∀ˇ●)<el-button @click.stop="modifyFolder(null)" type="text">创建</el-button>一个文件夹?
        </div>
        <div v-else-if="obtionStatus === requestStatus.REQUEST_ERROR">
          请求失败了_(:з)∠)_,<el-button @click.stop="reflash" type="text">再试试</el-button>吧
        </div>
      </div>
      <div v-else>
        <el-button
          class="folder-add-btn"
          size="mini"
          icon="el-icon-plus"
          type="success"
          @click.stop="modifyFolder(null)"
          plain>添加文件夹</el-button>
      </div>
      <div>
        <el-tree
          v-if="showTree"
          :class="treeClass"
          lazy
          node-key="nid"
          :indent = "5"
          :load="loadFolders"
          :props="nodeProps"
          ref="project_tree"
          @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span class="folder-btn" v-if="signed">
                <el-button @click.stop="modifyFolder({pid: data.belongProject, fid: data.contain})" type="text" size="mini" slot="reference">修改</el-button>
                <!-- <el-button class="delete-text" type="text"  size="mini" slot="reference">删除</el-button> -->
              </span>
            </span>
          </el-tree>
      </div>
    </div>
    <div class="dividing_line"></div>
    <folder-info-panel
      v-if="modifyVisible"
      v-model="modifyVisible"
      v-on:flash:folders="reflash"
      v-bind:focus="focus"
      >
    </folder-info-panel>
  </div>
</template>
<script>
import { ajax, just404 } from '../../api/fetch'
import FolderInfoPanel from './FolderInfoPanel'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('UserInfo')
export default {
  name: 'document-side',
  components: {FolderInfoPanel},
  props: {
    pid: {
      type: Number
    }
  },
  data () {
    return {
      nodeProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      requestStatus: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      obtionStatus: null,
      showTree: true,
      focus: {
        pid: null,
        fid: null
      },
      modifyVisible: false
    }
  },
  methods: {
    modifyFolder (focus) {
      this.modifyVisible = true
      this.focus = focus
    },
    handleNodeClick (data) {
      if (data.leaf) {
        this.$router.push('/projects/' + this.pid + '/apis/' + data.contain)
      }
      // if (data.leaf) {
      //   let request = {
      //     method: 'GET',
      //     url: 'projects/' + this.pid + '/apis/' + data.contain
      //   }
      //   ajax(request).then(resp => {
      //     // TODO 获取成功后的相应操作
      //     // console.log(resp.data)
      //     this.$emit('get:api', resp.data)
      //   }).catch(error => {
      //     this.whenErrorMessage(error, () => {
      //       this.$message.warning('没有东西欸(●ˇ∀ˇ●)')
      //     })
      //   })
      // }
    },
    loadFolders (node, resolve) {
      // console.log(node)
      // console.log(this.project)
      if (node.level === 0) {
        this.fetchFirstLayer(node, resolve)
      } else {
        let request = {
          method: 'GET',
          url: 'projects/' + this.pid + '/folders/' + node.data.contain + '/content'
        }
        this.getFolders(node, resolve, request)
      }
      // console.log(this.data)
    },
    getFolders (node, container, request) {
      ajax(request).then(resp => {
        container(resp.data.data)
      }).catch(error => {
        just404(error)
          .then(resp => {
            this.$message.warning('没有东西欸(●ˇ∀ˇ●)')
            node.loading = false
          })
          .catch(() => {
            node.loading = false
          })
      })
    },
    remove (node, data) {
      const list = data.nid.split('-')
      const target = { label: list[0], id: list[1] }
      let request = {
        method: 'DELETE',
        url: 'projects/' + this.project.pid + '/' + target.label + 's/' + data.contain
      }
      ajax(request).then(resp => {
        // console.log(resp)
        // TODO 登入成功后的相应操作
        // container(resp.data.data)
        this.removeNode(node, data, target)
      }).catch(error => {
        console.log(error)
        this.$message('删除失败了_(:з)∠)_，再试一次吧')
      })
    },
    removeNode (node, data, target) {
      console.log('aid = ' + target.id)
      if (target.label === 'api') {
        this.$emit('del:api', target.id)
      } else if (target.label === 'folder') {
        this.$emit('del:folder', target.id)
        console.log('folder id', target.id)
      }
      console.log(node, data)
      const parent = node.parent
      const children = parent.childNodes
      const index = children.findIndex(d => d.key === data.nid)
      children.splice(index, 1)
    },
    reflash () {
      this.showTree = false
      setTimeout(() => {
        this.showTree = true
      }, 1)
    },
    fetchFirstLayer (node, container) {
      this.obtionStatus = this.requestStatus.FETCHING
      let request = { method: 'GET', url: 'projects/' + this.pid + '/content/first-layer' }
      ajax(request).then(resp => {
        container(resp.data.data)
        this.obtionStatus = this.requestStatus.SUCCESS
      }).catch(error => {
        just404(error)
          .then(resp => {
            console.log(error.request)
            this.$message.warning('没有东西欸(●ˇ∀ˇ●)')
            this.obtionStatus = this.requestStatus.NOTFOUND
          })
          .catch(() => {
            this.obtionStatus = this.requestStatus.REQUEST_ERROR
          })
      })
    }
  },
  computed: {
    treeClass: function () {
      return this.obtionStatus !== this.requestStatus.SUCCESS ? 'hidden' : ''
    },
    ...mapState(['developerId', 'signed'])
  },
  created () {
    // this.obtionStatus = this.requestStatus.FETCHING
    // this.modifyFolder({pid: 1, fid: 11})
    // this.fetchProjectByPid(this.pid)
    // this.$refs.aside.oncontextmenu = function (e) {
    //   return false
    // }
  }
}
</script>
<style  type="text/css" lang="scss"  >
.hidden{
  display: none;
}
.aside{
  width: 300px;
  height: 100%;
  display: flex;
  overflow: hidden;
  padding: 0px 0px 0px 8px;
  .dividing_line{
    height: 100%;
    border-right: 1px solid #dcdfe6;
    flex-direction: column;
  }
  .contant{
    width: 100%;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: auto;
  }
  .contant_is_empty{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .folder-btn{
    display: none;
    button {
      margin: 0px;
    }
  }
}
.custom-tree-node:hover .folder-btn {
  display: inline;
}
.delete-text{
  color: #f56c6c;
}
.delete-text:hover{
  color: #f56c6c85;
}
.folder-add-btn {
  margin-top: 2px;
  width: 100%;
}
// .folder-add-btn {
//   height: 30px;
//   display: flex;
//   justify-content: center;
//   padding: 7px 0px;
//   border: 1px solid #dcdfe6;
//   color: #909399;
//   background: #f4f4f5;
// }
// .folder-add-btn:hover {
//   color: #f4f4f5;
//   background: #606266;
// }
// height: 92%;/*写给不支持calc()的浏览器*/
  // height:-moz-calc(100% - 60px);
  // height:-webkit-calc(100% - 60px);
  // height: calc(100% - 60px);
</style>
