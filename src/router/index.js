import Vue from 'vue'
import Router from 'vue-router'
import AccountPage from '@/components/AccountPage'
import MainPage from '@/components/MainPage'
import UserPage from '@/components/UserPage'
import DocumentPage from '@/components/DocumentPage'
import ApiPage from '@/components/DocumentPanel/ApiPage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'account-page',
      component: AccountPage
    },
    {
      path: '/index',
      name: 'index-page',
      component: MainPage
    },
    {
      path: '/user-page',
      name: 'user-page',
      component: UserPage
    },
    {
      path: '/projects/:pid',
      name: 'document-page',
      component: DocumentPage,
      children: [
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: '/aid/:aid',
          component: ApiPage
        }
      ]
    }
  ]
})
