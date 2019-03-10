<template>
<el-container>
  <el-header>
    <wa-header
      v-bind:inputTitle="'管理页面'"
      v-bind:btn="'admin'">
    </wa-header>
  </el-header>
  <el-main>
    <div v-if="signed">
      <template>
        <el-tabs v-model="activeName" stretch>
          <el-tab-pane label="项目管理" name="projects">
            <project-panel v-if="activeName === 'projects'"></project-panel>
          </el-tab-pane>
          <el-tab-pane label="开发者管理" name="developers">
            <developer-panel v-if="activeName === 'developers'" ></developer-panel>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </el-main>
</el-container>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import ProjectPanel from './AdminPanel/ProjectPanel'
import DeveloperPanel from './AdminPanel/DeveloperPanel'
import WaHeader from './Header'
const { mapState } = createNamespacedHelpers('UserInfo')
export default {
  name: 'admin-page',
  components: {ProjectPanel, WaHeader, DeveloperPanel},
  data () {
    return {
      activeName: 'projects'
    }
  },
  computed: {
    ...mapState(['signed'])
  }
}
</script>
<style lang="scss" type="text/css" scoped>
</style>
