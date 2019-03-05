<template>
  <el-container>
    <el-main>
      <account-main v-on:login:success="loginSuccess" ></account-main>
    </el-main>
  </el-container>
</template>
<script>
import AccountMain from './Account/AccountMain'
export default {
  name: 'account-page',
  components: {AccountMain},
  methods: {
    loginSuccess () {
      this.$router.push('/user-page')
    }
  }
}
</script>
<style lang="scss" type="text/css" scoped>
  .el-header {
    /* background-color: #B3C0D1; */
    padding: 0px;
    color: #333;
    /* height: 36px; */
    border-bottom: 1px solid #dcdfe6;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    height: 100%;
    width: auto !important;
  }
  .el-main {
    background-color: #ffffff;
    color: #333;
    // line-height: 160px;
    // align-items: center;
    // display: flex;
    position: relative;
    overflow: hidden;
  }
  .el-container {
    height: 100%;
  }
  .el-footer{
    height: 21px !important;
    padding: 0px !important;
  }
</style>
