<template>
<el-container>
  <el-header>
    <wa-header
      v-bind:btn="'developer'"
      v-on:login:success="fetchDeveloperProject">
    </wa-header>
  </el-header>
  <el-main>
    <div
      class="fetching_fail"
      v-if="currentStatus !== requestStatus.SUCCESS"
      v-loading="currentStatus === requestStatus.FETCHING"
    >
      <div class="fetching_fail_not_found" v-if="currentStatus === requestStatus.NOTFOUND">
        找不到了呢╮（╯＿╰）╭,
        <el-button v-if="developerId === currentDid" @click.stop="modifyProject(null)" type="text">创建一个</el-button>
        <el-button v-else @click.stop="$router.push('/index')" type="text">去主页看看</el-button>
        吧
      </div>
      <div v-else-if="currentStatus === requestStatus.REQUEST_ERROR">
        请求失败了_(:з)∠)_,<el-button @click.stop="fetchDeveloperProject" type="text">再试试</el-button>吧
      </div>
    </div>
    <div class="projects-warp" v-else>
      <div class="project-container">
        <el-card class="project-card"
          v-if="developerId === currentDid"
          shadow="hover" :body-style="{ padding: '0px' }">
          <div @click.stop="modifyProject(null)" class="card-container">
            <div class="add-project-i">
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </el-card>
        <el-card class="project-card"
          shadow="hover"
          v-for="project in projects" :key="project.pid" :body-style="{ padding: '0px' }">
          <div @click.stop="browseProject(project.pid)" class="card-container">
            <!-- <i v-if="developerId === project.projectOwner || admin" @click.stop="modifyProject(project.pid)" class="el-icon-setting"></i> -->
            <i v-if="signed" @click.stop="modifyProject(project.pid)" class="el-icon-setting"></i>
            <div class="card-text">{{project.projectName}}</div>
          </div>
        </el-card>
      </div>
    </div>
  </el-main>
  <modify-project
    v-if="modifyVisible"
    v-bind:pid="focusPid"
    v-model="modifyVisible"
    v-on:flash:projects="fetchDeveloperProject">
  </modify-project>
</el-container>
</template>
<script>
import { ajax, just404 } from '../../api/fetch'
import ModifyProject from './ModifyProject'
import WaHeader from '../Header'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('UserInfo')
export default {
  name: 'user-project-page',
  components: {WaHeader, ModifyProject},
  data () {
    return {
      requestStatus: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      currentStatus: null,
      currentDid: null,
      projects: null,
      modifyVisible: false,
      focusPid: null
    }
  },
  computed: {
    ...mapState(['developerId', 'admin', 'signed']),
    isOvert: function () {
      return this.admin || this.developerId === this.currentDid ? '' : '/overt'
    }
  },
  watch: {
    currentDid: function (nv, ov) {
      this.fetchDeveloperProject()
    }
  },
  methods: {
    fetchDeveloperProject () {
      this.currentStatus = this.requestStatus.FETCHING
      console.log('is Overt ', this.admin, this.developerId, this.currentDid, this.isOvert)
      let request = {
        method: 'GET',
        url: 'developers/' + this.currentDid + '/projects' + this.isOvert
      }
      ajax(request).then(resp => {
        console.log(resp.data.data)
        this.projects = resp.data.data
        this.currentStatus = this.requestStatus.SUCCESS
      }).catch(error => {
        just404(error)
          .then(resp => {
            this.currentStatus = this.requestStatus.NOTFOUND
          })
          .catch(error => {
            console.log(error)
            this.currentStatus = this.requestStatus.REQUEST_ERROR
          })
      })
    },
    browseProject (pid) {
      console.log('打开项目详情面板' + pid)
      this.$router.push('/projects/' + pid)
    },
    modifyProject (pid) {
      this.focusPid = pid
      this.modifyVisible = true
    },
    setCurrentDid (did) {
      if (did && !isNaN(did)) {
        // if (parseInt(did) === this.currentPid) this.currentStatus = this.requestStatus.SUCCESS
        this.currentDid = parseInt(did)
        console.log(this.currentDid)
      } else {
        // this.$router.replace('/index')
        this.$message.warning('访问的地址错误(●ˇ∀ˇ●),自动回到之前的页面啦')
        // this.$router.go(-1)
      }
    }
  },
  created () {
    this.setCurrentDid(this.$route.params.did)
    // this.fetchDeveloperProject()
  },
  beforeRouteUpdate (to, from, next) {
    this.setCurrentDid(to.params.did)
    // console.log(to, from, next)
    next()
  }
}
</script>
<style lang="scss" type="text/css" scoped>
.el-container {
  height: 100%;
}
.el-header{
  text-align: center;
  border-bottom: 1px solid #dcdfe6;
}
.el-main {
  color: #333;
  height: 100%;
  padding: 0px;
  height: 92%;/*写给不支持calc()的浏览器*/
  height:-moz-calc(100% - 60px);
  height:-webkit-calc(100% - 60px);
  height: calc(100% - 60px);
}
.projects-warp{
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.project-container {
  width: 600px;
  display: inline-flex;
  flex-wrap: wrap;
  .project-card{
    // width: 32.3%;
    // min-width: 350px;
    width: 190px;
    height: 117px;
    margin: 5px;
    cursor: pointer;
  }
}
.card-container {
  height: 117px;
  padding: 10px 14px 14px 14px;
  i{
    display: none;
    float: right;
  }
  i:hover{
    display: block;
    float: right;
    color: #66b1ff;
  }
  .card-text {
    // height: 100%;
    margin-top: 20px;
    text-align: center;
  }
  .add-project-i{
    height: 100%;
    display:  flex;
    justify-content:  center;
    align-items: center;
    i {
      display: inline-block;
      font-size: 30px;
      font-weight: 900;
      color: #909399;
    }
  }
  .add-project-i:hover{
      i {
        color: #303133;
      }
    }
}
.card-container:hover i {
  display: inline-block;
}
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
</style>
