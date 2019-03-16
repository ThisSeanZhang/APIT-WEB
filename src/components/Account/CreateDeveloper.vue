<template>
<el-dialog
  title="添加开发者"
  :visible.sync="dialogVisible"
  width="500px"
  >
  <div v-loading="currentStatus === requestStatus.FETCHING">
    <el-form ref="register_form" :model="developer" :rules="rules">
      <el-form-item prop="developerName">
        <el-input v-model="developer.developerName" @focus="clearLogError" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="developer.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="是否为管理员" prop="admin">
        <el-switch v-model="developer.admin"></el-switch>
      </el-form-item>
      <el-form-item prop="developerPass">
        <el-input v-model="developer.developerPass" placeholder="密码" type="password"></el-input>
      </el-form-item>
      <el-form-item prop="confirmPass">
        <el-input v-model="developer.confirmPass" placeholder="确认密码" type="password"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button
      :disabled="currentStatus === requestStatus.FETCHING"
      type="primary"
      @click="commitFolder">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
import {ajax, just404, wantNothing} from '../../api/fetch'
export default {
  name: 'create-developer',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var developerNameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入昵称'))
      } else if (this.developerNameExist) {
        callback(new Error('昵称已存在'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.developer.confirmPass !== '') {
          this.$refs.register_form.validateField('confirmPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.developer.developerPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      developer: {
        developerName: '',
        email: '',
        admin: '',
        confirmPass: '',
        developerPass: ''
      },
      developerNameExist: false,
      requestStatus: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      currentStatus: null,
      delDialogVisible: false,
      rules: {
        developerName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', pattern: /^[a-zA-Z_\-!@#0-9=]{4,16}$/, trigger: 'blur' },
          {validator: developerNameValidator}
        ],
        developerPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { message: '长度在6到16个字符,只允许出现_-=!@#以及数字和字母', pattern: /^[a-zA-Z_\-!@#0-9=]{6,16}$/, trigger: 'blur' },
          {validator: validatePass, trigger: 'blur'}
        ],
        confirmPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { message: '长度在6到16个字符,只允许出现_-=!@#以及数字和字母', pattern: /^[a-zA-Z_\-!@#0-9]{6,16}$/, trigger: 'blur' },
          {validator: validatePass2, trigger: 'blur'}
        ],
        email: [
          { type: 'email', required: true, message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    developerRegister () {
      this.$refs.register_form.validate(isAllPass => {
        if (isAllPass) {
          this.currentStatus === this.requestStatus.FETCHING
          let request = {method: 'GET', url: 'developers/developer-name/' + this.registerForm.developerName}
          ajax(request).then(resp => {
            this.developerNameExist = true
            this.$refs.register_form.validateField('developerName')
            this.$message('当前用户名已存在(●ˇ∀ˇ●)')
            this.currentStatus = this.requestStatus.REQUEST_ERROR
          }).catch(error => {
            just404(error).then(resp => {
              this.sendRegisterInfo()
            }).catch(() => {
              this.currentStatus = this.requestStatus.REQUEST_ERROR
            })
          })
        }
      })
    },
    clearLogError () {
      this.developerNameExist = false
      this.$refs.register_form.validateField('developerName')
    },
    sendRegisterInfo () {
      let request = {method: 'POST', url: 'developers', data: this.registerForm}
      ajax(request).then(resp => {
        this.currentStatus === this.requestStatus.SUCCESS
        this.$message({type: 'success', message: '注册成功[]~(￣▽￣)~*'})
        this.$emit('falsh:developers')
      }).catch(error => {
        wantNothing(error)
      })
    }
  }
}
</script>

<style type="text/css" lang="scss"  scoped>
</style>
