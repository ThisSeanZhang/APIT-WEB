<template>
<div>
  <div
    class="fetching_fail"
    v-if="currentStatus !== requestStatus.SUCCESS"
    v-loading="currentStatus === requestStatus.FETCHING"
  >
    <div class="fetching_fail_not_found" v-if="currentStatus === requestStatus.NOTFOUND">
      找不到了呢╮（╯＿╰）╭,<el-button @click.stop="fetchProject" type="text">创建</el-button>个项目吧
    </div>
    <div v-else-if="currentStatus === requestStatus.REQUEST_ERROR">
      请求失败了_(:з)∠)_,<el-button @click.stop="fetchProject" type="text">再试试</el-button>吧
    </div>
  </div>
  <div v-else>
    <el-table
      ref="multipleTable"
      :data="projects"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="pid" label="项目ID" >
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" >
      </el-table-column>
      <el-table-column  prop="ownerName" label="属于" >
      </el-table-column>
      <el-table-column label="是否公开" >
        <template slot-scope="scope">
          <el-tag
            :type=" scope.row.overt ? 'primary' : 'success'"
            disable-transitions>{{scope.row.overt === true ? '公开' : '私有'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editProject(scope.row.pid)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="$router.push('/projects/' + scope.row.pid)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filter.page + 1"
        :page-sizes="[10, 20, 30]"
        :page-size="filter.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filter.total">
      </el-pagination>
    </div>
  </div>
  <modify-project
    v-if="modifyVisible"
    v-bind:pid="focusPid"
    v-model="modifyVisible"
    v-on:flash:projects="fetchProject">
  </modify-project>
</div>
</template>
<script>
import { just404 } from '../../api/fetch'
import Project from '../../entitys/Project'
import ModifyProject from '../ProjectPanel/ModifyProject'
export default {
  name: 'project-panel',
  components: {ModifyProject},
  data () {
    return {
      requestStatus: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      currentStatus: null,
      projects: null,
      currentSelect: null,
      modifyVisible: false,
      focusPid: null,
      filter: {
        page: 0,
        size: 10,
        total: 0
      }
    }
  },
  methods: {
    editProject (pid) {
      this.focusPid = pid
      this.modifyVisible = true
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.filter.size = val
      this.filter.page = 0
      this.fetchProject()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.filter.page = val - 1
      this.fetchProject()
    },
    handleSelectionChange (val) {
      this.currentSelect = val
    },
    fetchProject () {
      this.currentStatus = this.requestStatus.FETCHING
      Project.adminFetch(this.filter)
        .then(resp => {
          this.filter.page = resp.data.data.number
          this.filter.size = resp.data.data.size
          this.filter.total = resp.data.data.totalElements
          this.projects = resp.data.data.content.map(p => new Project(p))
          this.currentStatus = this.requestStatus.SUCCESS
        })
        .catch(error => {
          just404(error)
            .then(resp => {
              this.currentStatus = this.requestStatus.NOTFOUND
            })
            .catch(() => {
              this.currentStatus = this.requestStatus.REQUEST_ERROR
            })
        })
    }
  },
  created () {
    this.fetchProject()
  }
}
</script>
<style lang="scss" type="text/css" scoped>
.fetching_fail_not_found{
  color: #f56c6c;
  font-size: 20px;
}
.fetching_fail {
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
