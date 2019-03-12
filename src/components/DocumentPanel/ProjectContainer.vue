<template>
  <div>
    <div>
      <el-tree
      lazy
      node-key="nid"
      :data="data"
      :indent = "10"
      :load="loadFolders"
      :props="defaultProps"
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
</template>
<script>
import {ajax} from '../../api/fetch'
import DeletePopover from './DeletePopover'
import FolderInfoPanel from './FolderInfoPanel'
export default {
  name: 'wa-project',
  props: ['project', 'show_modify'],
  components: {DeletePopover, FolderInfoPanel},
  data () {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      requestUrl: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      filterText: ''
    }
  },
  methods: {
    handleNodeClick (data) {
      if (data.leaf) {
        let request = {
          method: 'GET',
          url: 'projects/' + this.project.pid + '/apis/' + data.contain
        }
        ajax(request).then(resp => {
          // TODO 获取成功后的相应操作
          // console.log(resp.data)
          this.$emit('get:api', resp.data)
        }).catch(error => {
          this.whenErrorMessage(error, () => {
            this.$message.warning('没有东西欸(●ˇ∀ˇ●)')
          })
        })
      }
      // console.log(data)
    },
    loadFolders (node, resolve) {
      // console.log(node)
      // console.log(this.project)
      if (node.level === 0) {
        let request = {
          method: 'GET',
          url: 'projects/' + this.project.pid + '/content/first-layer',
          data: {
            ownerId: this.project.projectOwner
          }}
        this.getFolders(node, resolve, request)
      } else {
        let request = {
          method: 'GET',
          url: 'projects/' + this.project.pid + '/folders/' + node.data.contain + '/content',
          data: {
            belongProject: this.project.pid,
            ownerId: this.project.projectOwner
          }}
        this.getFolders(node, resolve, request)
      }
      // console.log(this.data)
    },
    getFolders (node, container, request) {
      // let request = {method: 'GET', url: 'http://localhost:8080/floders'}
      ajax(request).then(resp => {
        // console.log(resp)
        // TODO 登入成功后的相应操作
        container(resp.data.data)
      }).catch(error => {
        this.whenErrorMessage(error, () => {
          this.$message.warning('没有东西欸(●ˇ∀ˇ●)')
        })
        node.loading = false
      })
    },
    whenErrorMessage (error, dowhat) {
      if (error.response) {
        if (error.response.status === 404) {
          dowhat()
        }
      } else if (error.request) {
        this.$message.error('发送失败请检查网络连接╮（╯＿╰）╭')
      } else {
        this.$message('欸，好像出错了_(:з)∠)_，再试一次吧')
      }
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
    }
  },
  created () {
  }
}
</script>
<style  type="text/css" lang="scss"  scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
