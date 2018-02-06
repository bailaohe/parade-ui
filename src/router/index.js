import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Index from '@/views/Index'
import Flow from '@/views/Flow'
import Exec from '@/views/Exec'
import FlowDetail from '@/views/FlowDetail'
import JobLog from '@/views/JobLog'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'Login' },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: '/index',
      component: Index,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'flow',
          name: 'Flow',
          component: Flow,
        },
        {
          path: 'exec',
          name: 'Exec',
          component: Exec,
        },
        {
          path: 'exec/:execId',
          name: 'ExecDetail',
          component: FlowDetail,
          props: true,
        },
        {
          path: 'exec/:execId/:task',
          name: 'JobLog',
          component: JobLog,
          props: true,
        }
      ]
    }
  ]
})
