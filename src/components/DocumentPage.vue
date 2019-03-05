<template>
  <el-container>
    <el-header>Header</el-header>
    <el-aside>
      <document-side v-bind:pid="currentProjectId" v-bind:show_modify="false"></document-side>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import {ajax} from '../api/fetch'
import DocumentSide from './DocumentPanel/DocumentSide'
import Project from '../entitys/Project'
export default {
  name: 'document-page',
  components: {DocumentSide},
  data () {
    return {
      currentTable: null,
      templateIndex: 0,
      dialogTableVisible: false,
      panelChangeBar: { current: 'dev', allType: [{label: 'dev', value: '开发面板'}, {label: 'doc', value: '文档面板'}] },
      currentApiId: null,
      currentProjectId: null
    }
  },
  computed: {},
  methods: {
    pushToTable (table) {
      console.log('Document-PANEL', table.aid)
      this.currentApiId = table.aid
      this.currentProjectId = table.belongProject
    },
    fetchProject (pid) {
      let request = {
        method: 'GET',
        url: 'projects/' + pid
      }
      ajax(request).then(resp => {
        this.currentProject = new Project(resp.data.data)
        console.log(this.currentProject)
      }).catch(error => {
        this.whenErrorMessage(error)
      })
    },
    whenErrorMessage (error) {
      if (error.response) {
        this.$message.warning(error.response.data.message + '(●ˇ∀ˇ●)')
      } else if (error.request) {
        this.$message.error('发送失败请检查网络连接╮（╯＿╰）╭')
      } else {
        this.$message('欸，好像出错了_(:з)∠)_，再试一次吧')
      }
    }
  },
  created () {
    const pid = this.$route.params.pid
    if (pid) {
      this.currentProjectId = parseInt(pid)
    } else {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" type="text/css" scoped>
  .el-aside {
    /* background-color: #D3DCE6; */
    color: #333;
    height: 100%;
    width: auto !important;
  }
  .el-main {
    padding-top: 0px!important;
  }
  .el-container {
    height: 100%;
  }
  .el-footer{
    height: 21px !important;
  }
  .loginPanel{
    border-radius: 5px!important;
    .loginPanel-body{
      height: 305px;
    }
  }
</style>
