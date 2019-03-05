<template>
  <div class="aside">
    <div v-loading="obtionStatus === requestStatus.FETCHING" class="projects">
      <div class="projects_is_empty" v-if="projectIsEmpty">
        <div v-if="obtionStatus === requestStatus.NOTFOUND">
          空空的诶(●ˇ∀ˇ●),<el-button @click.stop="fetchProjectByPid(pid)" type="text">创建</el-button>一个吧
        </div>
        <div v-else-if="obtionStatus === requestStatus.REQUEST_ERROR">
          请求失败了_(:з)∠)_,<el-button @click.stop="fetchProjectByPid(pid)" type="text">再试试</el-button>吧
        </div>
      </div>
      <project-container
        ref="project_container"
        v-else
        v-bind:project="currentProject"
        v-bind:show_modify="show_modify">
      </project-container>
    </div>
    <div class="dividing_line"></div>
  </div>
</template>
<script>
import Project from '../../entitys/Project'
import ProjectContainer from './ProjectContainer'
import {ajax} from '../../api/fetch'

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
      currentProject: null,
      requestStatus: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      obtionStatus: null
    }
  },
  methods: {
    fetchProjectByPid (pid) {
      let request = {method: 'GET', url: 'projects/' + pid}
      this.obtionStatus = this.requestStatus.FETCHING
      ajax(request).then(resp => {
        this.currentProject = new Project(resp.data.data)
        this.obtionStatus = this.requestStatus.SUCCESS
      }).catch(error => {
        this.whenErrorMessage(error, () => {
          this.$message.warning('(●ˇ∀ˇ●)找不到这个项目的信息呢')
          this.obtionStatus = this.requestStatus.NOTFOUND
        })
      })
    },
    whenErrorMessage (error, dowhat) {
      if (error.response) {
        if (error.response.status === 404) {
          dowhat()
        }
      } else if (error.request) {
        this.$message.error('发送失败请检查网络连接╮（╯＿╰）╭')
        this.obtionStatus = this.requestStatus.REQUEST_ERROR
      } else {
        this.$message('欸，好像出错了_(:з)∠)_，再试一次吧')
        this.obtionStatus = this.requestStatus.REQUEST_ERROR
      }
    },
    pushAPIinfoToTables (param) {
      console.log('得到的api参数', param)
    },
    reflash () {
      this.projects = []
      this.findAllProjectByDeveloperId()
    }
  },
  computed: {
    projectIsEmpty: function () {
      return this.currentProject === null || this.currentProject === undefined
    },
    ...mapState(['developerId'])
  },
  created () {
    this.obtionStatus = this.requestStatus.FETCHING
    this.fetchProjectByPid(this.pid)
  }
}
</script>
<style  type="text/css" lang="scss"  >
.aside{
  width: 300px;
  height: 100%;
  display: flex;
  overflow: hidden;
  padding: 0px 0px 0px 8px;
  .dividing_line{
    height: 100%;
    // width: 0px;
    border-right: 1px solid #dcdfe6;
    flex-direction: column;
  }
  .projects{
    width: 100%;
    flex-direction: column;
    overflow-y: scroll;
  }
  .projects_is_empty{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// .wa_project{
//   padding-top: 42px;
//   height: 42px;
//   position: relative;
//   overflow: hidden;
//   // background-color: hotpink;
//   // border-bottom: 1px solid #333;
//   border-bottom: 1px solid #dcdfe6;
//   .test{
//     position: absolute;
//     top: 0px;
//     padding: 15px;
//     i{
//       position: inherit;
//     }
//   }
//   .edit{
//     position: absolute;
//     top: 0px;
//     padding: 13px;
//     right: 0px;
//   }
//   .project_title{
//     position: absolute;
//     top: 0px;
//     padding: 10px 0px 10px 40px;
//   }
//   .project_header{
//     cursor: pointer;
//   }
// }
</style>
