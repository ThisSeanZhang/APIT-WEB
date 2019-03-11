<template>
  <el-row type="flex" :gutter="20" justify="space-around" style="margin-top: 10px;">
    <el-col :span="7">
      <div class="doc-back">
        <!-- <el-button @click.stop="goTo('/user-page')" type="info" plain icon="el-icon-arrow-left">个人中心</el-button> -->
        <!-- <i @click.stop="goTo('/index')" class="el-icon-d-arrow-left"></i>
        <i @click.stop="goTo('/user-page')" class="el-icon-arrow-left"></i> -->
        <el-button-group>
          <el-button v-if="showButton.index" type="info" size="small" @click.stop="goTo('/index')"  plain >主页</el-button>
          <el-button v-if="showButton.develop && signed" type="info" size="small" @click.stop="goTo('/developers/' + developerId)" plain icon="el-icon-d-arrow-left">个人</el-button>
          <!-- <el-button type="info" size="small" plain icon="el-icon-arrow-left">团队</el-button> -->
          <el-button v-if="admin && signed && btn !== 'admin' " type="info" size="small" @click.stop="goTo('/admin')" plain>管理员</el-button>
        </el-button-group>
      </div>
    </el-col>
    <el-col :span="9">
      <div class="doc-title">{{inputTitle}}</div>
    </el-col>
    <el-col :span="7">
      <info-panel
        v-bind:message="'点击展示/修改用户信息'"
        v-on:click:name="openUserInfoPanel"
        v-on:login:success="$emit('login:success')">
      </info-panel>
    </el-col>
  </el-row>
</template>
<script>
import InfoPanel from './InfoPanel'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('UserInfo')
export default {
  name: 'document-panel-header',
  components: {InfoPanel},
  props: {
    inputTitle: {
      type: String,
      default: ''
    },
    btn: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    showButton: function () {
      var setting = {
        'default': {index: true, develop: false},
        'index': {index: false, develop: true},
        'developer': {index: true, develop: false},
        'project': {index: true, develop: true},
        'admin': {index: true, develop: true}
      }
      return setting[this.btn]
    },
    ...mapState(['admin', 'developerId', 'signed'])
  },
  methods: {
    openUserInfoPanel (target) {
      console.log('点击需要展示用户信息界面')
    },
    goTo (page) {
      this.$router.push(page)
    }
  }
}
</script>
<style type="text/css" lang="scss" scoped>
.el-row {
  margin-left: 0px!important;
  margin-right: 0px!important;
}
.doc-title{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 25px;
}
.doc-back{
  font-size: 30px;
  font-weight: 700;
  display: flex;
  align-items: center;
  height: 100%;
  i {
    cursor: pointer;
  }
}
</style>
