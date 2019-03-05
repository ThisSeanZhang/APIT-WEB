import Vue from 'vue'
import CommonError from './CommonError'

// 系统错误捕获
const errorHandler = (error, vm) => {
  console.error('抛出全局异常')
  console.error(vm)
  console.error(error)
  if (error instanceof CommonError) {
    console.log(error)
  }
}

Vue.config.errorHandler = errorHandler
Vue.prototype.$throw = (error) => errorHandler(error, this)
