<template>
  <div class="api_contant" v-loading="currentStatus == requestStatus.FETCHING">
    <div class="fetching_fail" v-if="currentStatus !== requestStatus.SUCCESS">
      点击左侧选择新的API<el-button v-if="currentAid !== null" type="text" @click.stop="fetchApiInfo()">,或者刷新</el-button>试试
    </div>
    <div v-else class="doc-api">
      <div class="doc-api-header">
        <span>{{testRequest.method}}</span>
        {{testRequest.apiName}}
        <div style="float: right;">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button size="small" type="danger" icon="el-icon-delete" circle @click.stop="delVisible = true" plain></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改存放位置" placement="top">
            <el-button size="small" type="primary" icon="el-icon-rank" circle @click.stop="modifyVisible = true" plain></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button size="small" type="info" icon="el-icon-refresh" circle @click.stop="fetchApiInfo()" plain></el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="doc-api-title">
        API的描述信息
      </div>
      <p class="doc-api-text">
        {{testRequest.bewrite === '' ? '无' : testRequest.bewrite}}
      </p>
      <div class="doc-api-title">
        请求的URL
      </div>
      <p class="doc-api-text">
        {{testRequest.url}}
      </p>
      <div class="doc-api-title">
        请求的方式
      </div>
      <p class="doc-api-text">
        {{testRequest.method}}
      </p>
      <div class="doc-api-title">
        请求头
      </div>
      <div class="doc-api-table">
        <el-table :data="testRequest.headers" stripe>
          <el-table-column align="center" prop="key" label="键"></el-table-column>
          <el-table-column align="center" prop="value" label="值"></el-table-column>
          <el-table-column align="center" prop="description" label="描述"></el-table-column>
        </el-table>
      </div>
      <div class="doc-api-title">
        请求的查询参数
      </div>
      <div class="doc-api-table">
        <el-table :data="testRequest.parameters" stripe>
          <el-table-column align="center" prop="key" label="键"></el-table-column>
          <el-table-column align="center" prop="value" label="值"></el-table-column>
          <el-table-column align="center" prop="description" label="描述"></el-table-column>
        </el-table>
      </div>
      <div class="doc-api-title">
        请求体 ({{testRequest.body.currentChoice.label.toLowerCase()}}){{testRequest.body.currentChoice.value}}
      </div>
      <div class="doc-api-table">
        <p v-if="testRequest.body.currentChoice.label === 'raw'" class="doc-api-text">
          {{testRequest.body.rawData}}
        </p>
        <el-table v-else-if="testRequest.body.currentChoice.label === 'formData'" :data="testRequest.body.formData" stripe>
          <el-table-column align="center" prop="key" label="键"></el-table-column>
          <el-table-column align="center" prop="value" label="值"></el-table-column>
          <el-table-column align="center" prop="type" label="类型"></el-table-column>
          <el-table-column align="center" prop="description" label="描述"></el-table-column>
        </el-table>
      </div>
    </div>
    <api-location-change
      v-if="modifyVisible"
      v-model="modifyVisible"
      v-on:flash:folders="$router.go(0)"
      v-bind:focus="{ aid: currentAid, pid: currentPid} "
    >
    </api-location-change>
    <el-dialog
      center
      width="210px"
      title="确定删除？"
      :visible.sync="delVisible">
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button
          type="danger"
          @click="delApi">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ajax, wantNothing, just404 } from '../../api/fetch'
import API from '../../entitys/API'
import ApiLocationChange from './ApiLocationChange'
export default {
  name: 'api-page',
  components: {ApiLocationChange},
  data () {
    return {
      requestStatus: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      currentStatus: null,
      modifyVisible: false,
      delVisible: false,
      testRequest: API.newEmptyAPI(),
      currentAid: null,
      currentPid: null
    }
  },
  watch: {
    currentAid: function (newV, oldV) {
      this.fetchApiInfo()
    }
  },
  methods: {
    delApi () {
      let request = {
        method: 'DELETE',
        url: 'projects/' + this.currentPid + '/apis/' + this.currentAid
      }
      ajax(request).then(resp => {
        this.delVisible = false
        this.$message('[]~(￣▽￣)~*删除成功')
        this.$router.go(0)
      }).catch(error => {
        wantNothing(error)
      })
    },
    fetchApiInfo () {
      this.currentStatus = this.requestStatus.FETCHING
      let request = {
        method: 'GET',
        url: 'projects/' + this.currentPid + '/apis/' + this.currentAid
      }
      const h = this.$createElement
      ajax(request).then(resp => {
        this.currentStatus = this.requestStatus.SUCCESS
        this.testRequest = API.convertToAPI(resp.data.data)
      }).catch(error => {
        just404(error).then(resp => {
          this.currentStatus = this.requestStatus.NOTFOUND
          this.$notify({
            title: '获取相应的API信息',
            message: h('i', { style: 'color: #f56c6c' }, '〒▽〒找不到相应的API信息了')
          })
        }).catch(() => {
          this.$notify({
            title: '获取相应的API信息',
            message: h('i', { style: 'color: #f56c6c' }, '请求失败了〒▽〒,页面上的信息可能已经失效')
          })
          this.currentStatus = this.requestStatus.REQUEST_ERROR
        })
        this.testRequest = API.newEmptyAPI()
      })
    },
    checkRouteValue (key) {
      console.log('key' + key)
      if (key === null || key === undefined || isNaN(key)) {
        this.$message.warning('访问的地址错误(●ˇ∀ˇ●),自动回到之前的页面啦')
        this.$router.go(-1)
      }
      return parseInt(key)
    }
  },
  created () {
    this.currentPid = this.checkRouteValue(this.$route.params.pid)
    this.currentAid = this.checkRouteValue(this.$route.params.aid)
  },
  activated () {
    console.log('dddd')
  },
  beforeRouteUpdate (to, from, next) {
    // const opid = this.checkRouteValue(from.params.pid)
    this.currentPid = this.checkRouteValue(to.params.pid)
    this.currentAid = this.checkRouteValue(to.params.aid)
    console.log(this.currentAid)
    // next(this.currentPid === opid ? true : '/projects/' + this.currentPid)
    next()
  },
  beforeRouteEnter (to, from, next) {
    console.log('cccc')
    next()
  }
}
</script>
<style lang="scss" type="text/css" scoped>
.doc-api {
  font-weight: 400;
  .doc-api-header{
    font-size: 20px;
    font-weight: 900;
    border-bottom: 1px solid #dcdfe6;
    padding: 13px 0px 20px 0px;
  }
  .doc-api-title{
    font-size: 18px;
    margin: 15px 0px;
  }
  .doc-api-text{
    font-size: 13px;
    margin: 5px 0px;
    background-color: #e4e4e4;
    border-radius: 4px;
    padding: 10px;
    text-indent: 25px;
    letter-spacing: 0.5px;
  }
  .doc-api-table{
    border-radius: 4px;
  }
}
.api_contant{
  height: 100%;
}
.fetching_fail {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
