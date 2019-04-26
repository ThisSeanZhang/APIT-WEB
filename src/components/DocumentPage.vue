<template>
<el-container>
  <el-header>
    <wa-header
      v-bind:inputTitle="headerTitle"
      v-bind:btn="'project'"
      v-on:login:success="fetchProject">
    </wa-header>
  </el-header>
  <el-container
  class="api_container"
    v-loading="currentStatus === requestStatus.FETCHING"
    v-if="currentStatus !== requestStatus.SUCCESS"
    >
    <div class="fetching_fail">
      <div class="fetching_fail_not_found" v-if="currentStatus === requestStatus.NOTFOUND">
        找不到了呢╮（╯＿╰）╭,点击右上角的主页或者个人中心，再选择个项目看看吧
      </div>
      <div v-else-if="currentStatus === requestStatus.REQUEST_ERROR">
        请求失败了_(:з)∠)_,<el-button @click.stop="fetchProject" type="text">再试试</el-button>吧
      </div>
    </div>
  </el-container>
  <el-container v-else class="api_container">
    <el-aside>
      <document-side
        v-bind:pid="currentProject.pid"
        v-bind:whoJoins="currentProject.whoJoins"
        v-bind:show_modify="true"></document-side>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
import {ajax} from '../api/fetch'
import DocumentSide from './DocumentPanel/DocumentSide'
import WaHeader from './Header'
import Project from '../entitys/Project'
export default {
  name: 'document-page',
  components: {DocumentSide, WaHeader},
  data () {
    return {
      requestStatus: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      currentStatus: null,
      currentPid: null,
      currentProject: null
    }
  },
  watch: {
    currentPid: function (nv, ov) {
      this.fetchProject()
    }
  },
  computed: {
    headerTitle: function () {
      return this.currentProject === null ? '' : this.currentProject.projectName
    }
  },
  methods: {
    fetchProject () {
      this.currentStatus = this.requestStatus.FETCHING
      let request = {
        method: 'GET',
        url: 'projects/' + this.currentPid
      }
      ajax(request).then(resp => {
        this.currentProject = new Project(resp.data.data)
        // console.log(this.currentProject)
        this.currentStatus = this.requestStatus.SUCCESS
      }).catch(error => {
        this.whenErrorMessage(error)
        this.currentProject = Project.newEmptyProject()
      })
    },
    whenErrorMessage (error) {
      if (error.response) {
        if (error.response.status === 404) {
          this.currentStatus = this.requestStatus.NOTFOUND
        } else {
          this.currentStatus = this.requestStatus.REQUEST_ERROR
        }
        this.$message.warning(error.response.data.message + '(●ˇ∀ˇ●)')
      } else if (error.request) {
        this.$message.error('发送失败请检查网络连接╮（╯＿╰）╭')
        this.currentStatus = this.requestStatus.REQUEST_ERROR
      } else {
        this.$message('欸，好像出错了_(:з)∠)_，再试一次吧')
        this.currentStatus = this.requestStatus.REQUEST_ERROR
      }
    },
    setCurrentPid (pid) {
      // this.currentStatus = this.requestStatus.FETCHING
      if (pid && !isNaN(pid)) {
        // if (parseInt(pid) === this.currentPid) this.currentStatus = this.requestStatus.SUCCESS
        this.currentPid = parseInt(pid)
        console.log(this.currentPid)
      } else {
        // this.$router.replace('/index')
        this.$message.warning('访问的地址错误(●ˇ∀ˇ●),自动回到之前的页面啦')
        this.$router.go(-1)
      }
    }
  },
  created () {
    this.setCurrentPid(this.$route.params.pid)
  },
  beforeRouteUpdate (to, from, next) {
    this.setCurrentPid(to.params.pid)
    // console.log(to, from, next)
    next()
  }
}
</script>
<style lang="scss" type="text/css" scoped>
.fetching_fail_not_found{
  color: #f56c6c;
  font-size: 20px;
}
.fetching_fail {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-header{
  text-align: center;
  border-bottom: 1px solid #dcdfe6;
}
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
.api_container {
  height: 92%;/*写给不支持calc()的浏览器*/
  height:-moz-calc(100% - 60px);
  height:-webkit-calc(100% - 60px);
  height: calc(100% - 60px);
}
</style>
