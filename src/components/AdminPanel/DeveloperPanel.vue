<template>
<div>
  <div
    class="fetching_fail"
    v-if="currentStatus !== requestStatus.SUCCESS"
    v-loading="currentStatus === requestStatus.FETCHING"
  >
    <div class="fetching_fail_not_found" v-if="currentStatus === requestStatus.NOTFOUND">
      找不到了呢╮（╯＿╰）╭,<el-button @click.stop="fetchDevelopers" type="text">创建</el-button>个项目吧
    </div>
    <div v-else-if="currentStatus === requestStatus.REQUEST_ERROR">
      请求失败了_(:з)∠)_,<el-button @click.stop="fetchDevelopers" type="text">再试试</el-button>吧
    </div>
  </div>
  <div v-else>
    <el-table
      ref="multipleTable"
      :data="developers"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="developerId" label="ID" >
      </el-table-column>
      <el-table-column prop="developerName" label="开发者名" >
      </el-table-column>
      <el-table-column  prop="email" label="邮箱" >
      </el-table-column>
      <el-table-column label="是否是管理员" >
        <template slot-scope="scope">
          <el-tag
            :type=" scope.row.admin ? 'success' : 'primary'"
            disable-transitions>{{scope.row.admin === true ? '是' : '否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="modifyDeveloper(scope.row.developerId)">编辑</el-button>
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
  <modify-developer
    v-if="openCreate"
    v-model="openCreate"
    v-bind:focus="focusDid"
    v-on:flash:developers = "fetchDevelopers"></modify-developer>
</div>
</template>
<script>
import { just404 } from '../../api/fetch'
import Developer from '../../entitys/Developer'
import ModifyDeveloper from '../Account/ModifyDeveloper'
export default {
  name: 'developer-panel',
  components: {ModifyDeveloper},
  data () {
    return {
      requestStatus: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      currentStatus: null,
      developers: null,
      focusDid: null,
      openCreate: false,
      currentSelect: null,
      filter: {
        page: 0,
        size: 10,
        total: 0
      }
    }
  },
  methods: {
    modifyDeveloper (did) {
      this.focusDid = did
      console.log(did)
      this.openCreate = true
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.filter.size = val
      this.filter.page = 0
      this.fetchDevelopers()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.filter.page = val - 1
      this.fetchDevelopers()
    },
    handleSelectionChange (val) {
      this.currentSelect = val
    },
    fetchDevelopers () {
      this.currentStatus = this.requestStatus.FETCHING
      Developer.adminFetch(this.filter)
        .then(resp => {
          this.filter.page = resp.data.data.number
          this.filter.size = resp.data.data.size
          this.filter.total = resp.data.data.totalElements
          this.developers = resp.data.data.content.map(p => new Developer(p))
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
    this.fetchDevelopers()
  },
  activated () {
    console.log('developer Panel')
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
