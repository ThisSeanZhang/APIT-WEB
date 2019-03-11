<template>
<el-container>
  <el-header>
    <wa-header
      v-bind:inputTitle="'欢迎浏览APIT'"
      v-bind:btn="'index'"
      v-on:login:success="loginSuccess">
    </wa-header>
  </el-header>
  <el-main>
    <project-panel
      v-bind:url="'/projects/isOvert'"
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

    }
  }
}
</script>
<style>

</style>
