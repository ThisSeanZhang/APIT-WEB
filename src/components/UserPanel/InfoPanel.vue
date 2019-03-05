<template>
  <div>
    <div class="info-panel" v-if="signed" >
      <el-tooltip class="item" effect="dark" :content="message" placement="top">
        <div class="name-info" style="cursor: pointer;" @click.stop="clickName">ccc{{developerName}}</div>
      </el-tooltip>
      <el-button @click="logOut" type="info" >
        退出<i class="el-icon-d-arrow-right"></i>
      </el-button>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('UserInfo')
export default {
  name: 'info-panel',
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions(['delUserInfo']),
    logOut () {
      this.delUserInfo()
      this.$router.push('/')
    },
    clickName () {
      this.$emit('click:name')
    }
  },
  computed: {
    ...mapState(['signed', 'developerName'])
  }
}
</script>
<style lang="scss" type="text/css" scoped>
.info-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  .name-info {
    margin: 0px 10px;
  }
}
</style>
