<template>
<el-container>
  <el-header>
    <wa-header
      v-bind:inputTitle="'公开的项目'"
      v-bind:btn="'index'"
      v-on:login:success="loginSuccess">
    </wa-header>
  </el-header>
  <el-main>
    <project-panel
      v-bind:url="'/projects/isOvert'"
      ref="project_penal"
    ></project-panel>
  </el-main>
</el-container>
</template>
<script>
import WaHeader from './Header'
import ProjectPanel from './ProjectPanel'
export default {
  name: 'main-page',
  components: {ProjectPanel, WaHeader},
  methods: {
    loginSuccess () {
      this.$refs.project_penal.fetchDeveloperProject()
    }
  }
}
</script>
<style lang="scss" type="text/css" scoped>
.el-container{
  height: 100%;
}
.el-main{
  height: 100%;
}
</style>
