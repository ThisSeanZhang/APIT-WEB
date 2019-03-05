<template>
  <div class="projects-warp">
    <div class="project-container">
      <el-card class="project-card"
        shadow="hover"
        v-for="project in projects" :key="project.pid" :body-style="{ padding: '0px' }">
        <div @click.stop="browseProject(project.pid)" class="card-container"><i @click.stop="modifyProject(project.pid)" class="el-icon-setting"></i>
          <div class="card-text">{{project.projectName}}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'project-panel',
}
</script>
