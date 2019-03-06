<template>
  <el-row type="flex" :gutter="20" justify="space-around" style="margin-top: 10px;">
    <el-col :span="4">
      <div class="doc-back">
        <el-button @click.stop="goTo('/index')" type="info" plain icon="el-icon-d-arrow-left" >主页</el-button>
        <el-button @click.stop="goTo('/user-page')" type="info" plain icon="el-icon-arrow-left">个人中心</el-button>
        <!-- <i @click.stop="goTo('/index')" class="el-icon-d-arrow-left"></i>
        <i @click.stop="goTo('/user-page')" class="el-icon-arrow-left"></i> -->
      </div>
    </el-col>
    <el-col :span="15">
      <div class="doc-title">{{title}}</div>
    </el-col>
    <el-col :span="4"><info-panel v-bind:message="'点击展示/修改用户信息'" v-on:click:name="openUserInfoPanel" ></info-panel></el-col>
  </el-row>
</template>
<script>
import InfoPanel from '../UserPanel/InfoPanel'
import Project from '../../entitys/Project'
export default {
  name: 'document-panel-header',
  components: {InfoPanel},
  props: {
    project: {
      type: Project
    }
  },
  data () {
    return {
    }
  },
  computed: {
    title: function () {
      return this.project ? this.project.projectName : ''
    }
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
