<template>
  <el-row type="flex" :gutter="20" justify="space-around" style="margin-top: 10px;">
    <el-col :span="4">
    </el-col>
    <el-col :span="15">
    </el-col>
    <el-col :span="4"><info-panel v-bind:message="'点击展示/修改用户信息'" v-on:click:name="openUserInfoPanel" ></info-panel></el-col>
  </el-row>
</template>
<script>
import InfoPanel from './InfoPanel'
export default {
  name: 'user-panel-header',
  components: {InfoPanel},
  data () {
    return {
    }
  },
  methods: {
    openUserInfoPanel (target) {
      console.log('点击需要展示用户信息界面')
    }
  }
}
</script>
<style type="text/css">
.el-row {
  margin-left: 0px!important;
  margin-right: 0px!important;
}
</style>
