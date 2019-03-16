<template>
<el-dialog
  title="修改开发者"
  :visible.sync="dialogVisible"
  width="500px"
  >
  <div v-loading="currentStatus === requestStatus.FETCHING">
    <el-form ref="register_form" :model="developer" :rules="rules">
      <el-form-item prop="developerName">
        <el-input v-model="developer.developerName" :disabled="true" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="developer.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="管理员" prop="admin">
        <el-switch
          v-model="developer.admin"
          active-text="是"
          inactive-text="否"></el-switch>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="developer.status"
          active-text="正常"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="-1"
          @change = "changevalue"></el-switch>
      </el-form-item>
      <el-form-item prop="developerPass">
        <el-input v-model="developer.developerPass" placeholder="密码" type="password"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button
      type="danger"
      :disabled="currentStatus === requestStatus.FETCHING"
      @click="delDialogVisible = true"
      icon="el-icon-delete" style="float: left;"></el-button>
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button
      :disabled="currentStatus === requestStatus.FETCHING"
      type="primary"
      @click="commitDeveloper">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
import {ajax, just404} from '../../api/fetch'
// import { createNamespacedHelpers } from 'vuex'
// const { mapState } = createNamespacedHelpers('UserInfo')
export default {
  name: 'modify-developer',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Number,
      default: null
    }
  },
  computed: {
    dialogVisible: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      }
    },
    requestDeveloper: function () {
      return {
        status: this.developer.status,
        admin: this.developer.admin,
        developerPass: this.developer.developerPass,
        email: this.developer.email
      }
    }
  },
  data () {
    // var validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback()
    //   } else {
    //     if (this.developer.confirmPass !== '') {
    //     }
    //     callback()
    //   }
    // }
    return {
      developer: {
        developerName: '',
        email: '',
        admin: '',
        confirmPass: '',
        developerPass: '',
        status: ''
      },
      developerNameExist: false,
      requestStatus: {SUCCESS: 1, NOTFOUND: 2, REQUEST_ERROR: 3, FETCHING: 4},
      currentStatus: null,
      delDialogVisible: false,
      rules: {
        developerPass: [
          // { required: true, message: '请输入密码', trigger: 'blur' },
          { message: '长度在6到16个字符,只允许出现_-=!@#以及数字和字母', pattern: /^[a-zA-Z_\-!@#0-9=]{6,16}$|^$/, trigger: 'blur' }
          // {validator: validatePass, trigger: 'blur'}
        ],
        email: [
          { type: 'email', required: true, message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    changevalue () {
      console.log(this.developer)
    },
    commitDeveloper () {
      this.$refs.register_form.validate(isAllPass => {
        if (isAllPass) {
          const request = {
            method: 'PUT',
            url: '/admin/developers/' + this.focus,
            data: this.requestDeveloper
          }
          console.log(request)
          ajax(request).then(resp => {
            this.currentStatus = this.requestStatus.SUCCESS
            this.dialogVisible = false
            this.$emit('flash:developers')
          }).catch(error => {
            just404(error).then(resp => {
              this.currentStatus = this.requestStatus.NOTFOUND
            }).catch(() => {
              this.currentStatus = this.requestStatus.REQUEST_ERROR
            })
          })
        }
      })
    },
    fetchDeveloper () {
      this.currentStatus = this.requestStatus.FETCHING
      const request = {
        methods: 'GET',
        url: '/admin/developers/' + this.focus
      }
      ajax(request).then(resp => {
        this.developer = resp.data.data
        this.developer.developerPass = ''
        this.currentStatus = this.requestStatus.SUCCESS
      }).catch(error => {
        just404(error).then(resp => {
          this.$message('没有找到你想要的用户(●ˇ∀ˇ●)')
          this.dialogVisible = false
          this.currentStatus = this.requestStatus.NOTFOUND
        }).catch(() => {
          this.dialogVisible = false
          this.currentStatus = this.requestStatus.NOTFOUND
        })
      })
    }
  },
  created () {
    if (this.focus !== null) {
      this.fetchDeveloper()
    } else {
      this.dialogVisible = false
      this.$message('欸，好像出错了_(:з)∠)_，再试一次吧')
    }
  }
}
</script>

<style type="text/css" lang="scss"  scoped>
</style>
