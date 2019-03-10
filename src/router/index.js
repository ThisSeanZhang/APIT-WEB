import Vue from 'vue'
import Router from 'vue-router'
import AccountPage from '@/components/AccountPage'
import MainPage from '@/components/MainPage'
// import UserPage from '@/components/UserPage'
import DocumentPage from '@/components/DocumentPage'
import ApiPage from '@/components/DocumentPanel/ApiPage'
import AdminPage from '@/components/AdminPage'
import UserProjectPage from '@/components/ProjectPanel/UserProjectPage'
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
      path: '/developers/:did',
      name: 'user-project-page',
      component: UserProjectPage
    },
    {
      path: '/projects/:pid',
      name: 'document-page',
      component: DocumentPage,
      children: [
        {
          path: 'apis/:aid',
          name: 'api-page',
          component: ApiPage
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin-page',
      component: AdminPage
    }
  ]
})
