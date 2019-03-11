<template>
<div class="developer-projects">
  <div
    class="fetching_fail"
    v-if="currentStatus !== requestStatus.SUCCESS"
    v-loading="currentStatus === requestStatus.FETCHING"
  >
    <div class="fetching_fail_not_found" v-if="currentStatus === requestStatus.NOTFOUND">
      找不到了呢╮（╯＿╰）╭,<el-button @click.stop="fetchDeveloperProject" type="text">创建</el-button>个项目吧
    </div>
    <div v-else-if="currentStatus === requestStatus.REQUEST_ERROR">
      请求失败了_(:з)∠)_,<el-button @click.stop="fetchDeveloperProject" type="text">再试试</el-button>吧
    </div>
  </div>
  <div class="projects-warp">
    <div class="project-container">
      <el-card class="project-card"
        shadow="hover"
        v-for="project in projects" :key="project.pid" :body-style="{ padding: '0px' }">
        <div @click.stop="browseProject(project.pid)" class="card-container"><i v-if="false" @click.stop="modifyProject(project.pid)" class="el-icon-setting"></i>
          <div class="card-text">{{project.projectName}}</div>
        </div>
      </el-card>
    </div>
  </div>
</div>
</template>
<script>
import { ajax, just404 } from '../../api/fetch'
export default {
  name: 'project-panel',
  props: {
    url: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      requestStatus: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      currentStatus: null,
      projects: null
    }
  },
  watch: {
  },
  methods: {
    fetchDeveloperProject () {
      if (this.url === null) {
        return
      }
      this.currentStatus = this.requestStatus.FETCHING
      let request = {
        method: 'GET',
        url: this.url
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
    }
  },
  created () {
    this.fetchDeveloperProject()
  },
  beforeRouteUpdate (to, from, next) {
    next()
  }
}
</script>
<style lang="scss" type="text/css" scoped>
.developer-projects{
  height: 100%;
  // height: 92%;/*写给不支持calc()的浏览器*/
  // height:-moz-calc(100% - 60px);
  // height:-webkit-calc(100% - 60px);
  // height: calc(100% - 60px);
}
.projects-warp{
  padding-top: 100px;
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
