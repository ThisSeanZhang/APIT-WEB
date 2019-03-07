<template>
  <div class="aside">
    <div v-loading="obtionStatus === requestStatus.FETCHING" class="contant">
      <div class="contant_is_empty" v-if="obtionStatus !== requestStatus.SUCCESS">
        <div v-if="obtionStatus === requestStatus.NOTFOUND">
          空空的诶(●ˇ∀ˇ●)<el-button @click.stop="reflash" type="text">刷新一下</el-button>?
        </div>
        <div v-else-if="obtionStatus === requestStatus.REQUEST_ERROR">
          请求失败了_(:з)∠)_,<el-button @click.stop="reflash" type="text">再试试</el-button>吧
        </div>
      </div>
      <div>
        <el-tree
          v-if="showTree"
          :class="treeClass"
          lazy
          node-key="nid"
          :indent = "10"
          :load="loadFolders"
          :props="nodeProps"
          ref="project_tree"
          @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if="show_modify">
                <folder-info-panel v-on:update:list="$emit('update:list')" v-bind:nid="data.nid" v-bind:pid="data.belongProject" v-if="!node.isLeaf" ></folder-info-panel>
                <delete-popover v-on:confirm:del="() => remove(node, data)" ></delete-popover>
              </span>
            </span>
          </el-tree>
      </div>
    </div>
    <div class="dividing_line"></div>
  </div>
</template>
<script>
import ProjectContainer from './ProjectContainer'
import { ajax, just404 } from '../../api/fetch'

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('UserInfo')

export default {
  name: 'document-side',
  props: {
    show_modify: {
      type: Boolean,
      default: false
    },
    pid: {
      type: Number
    }
  },
  components: {ProjectContainer},
  data () {
    return {
      nodeProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      requestStatus: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      obtionStatus: null,
      showTree: true
    }
  },
  methods: {
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
        this.obtionStatus = this.requestStatus.SUCCESS
        container(resp.data.data)
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
    ...mapState(['developerId'])
  },
  created () {
    this.obtionStatus = this.requestStatus.FETCHING
    // this.fetchProjectByPid(this.pid)
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
</style>
