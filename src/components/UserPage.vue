<template>
<el-container>
  <el-header>
    <user-panel-header></user-panel-header>
  </el-header>
  <el-main>
    <div class="projects-warp">
      <div class="project-container">
        <el-card class="project-card"
          shadow="hover"
          v-for="project in projects" :key="project.pid" :body-style="{ padding: '0px' }">
          <div @click.stop="browseProject(project.pid)" class="card-container"><i @click.stop="modifyProject(project.pid)" class="el-icon-setting"></i>
            <div class="card-text">{{project.projectName}}</div>
          </div>
        </el-card>
      </div>
    </div>
  </el-main>
</el-container>
</template>
<script>
import {ajax} from '../api/fetch'
import { Loading } from 'element-ui'
import UserPanelHeader from './UserPanel/UserPanelHeader'
import { mapState, mapActions } from 'vuex'
// import { mapState } from 'vuex'
export default {
  name: 'user-page',
  components: {UserPanelHeader},
  methods: {
    ...mapActions('EntitysContainer', ['setProjects']),
    fetchDeveloperProject () {
      let loding = Loading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.6)'
      })
      let request = {
        method: 'GET',
        url: 'developers/' + this.developerId + '/projects'
      }
      ajax(request).then(resp => {
        console.log(resp.data.data)
        this.setProjects(resp.data.data)
        loding.close()
      }).catch(error => {
        this.whenErrorMessage(error, this.sendRegisterInfo, true)
        loding.close()
      })
    },
    browseProject (pid) {
      console.log('打开项目详情面板' + pid)
      this.$router.push('/projects/' + pid)
    },
    modifyProject (pid) {
      console.log('修改项目的具体信息' + pid)
    },
    whenErrorMessage (error, dowhat, isSlience = false) {
      if (error.response) {
        if (error.response.status === 404) {
          dowhat()
        }
        if (!isSlience) {
          this.$message('欸，好像出错了_(:з)∠)_，再试一次吧')
        }
      } else if (error.request) {
        this.$message.error('发送失败请检查网络连接╮（╯＿╰）╭')
      } else {
        this.$message('欸，好像出错了_(:з)∠)_，再试一次吧')
      }
    }
  },
  computed: {
    ...mapState('UserInfo', ['signed', 'developerId']),
    ...mapState('EntitysContainer', ['projects'])
  },
  created () {
    console.log(this.signed)
    this.fetchDeveloperProject()
    // if (this.signed === null || this.signed === undefined || this.signed === false) {
    //   this.$router.push('/')
    // }
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
    display: none;
    float: right;
    color: #66b1ff;
  }
  .card-text {
    // height: 100%;
    margin-top: 20px;
    text-align: center;
  }
}
.card-container:hover i {
  display: inline-block;
}
</style>
