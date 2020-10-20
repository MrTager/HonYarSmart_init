import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/main',
    },
    {
      path: '/main',
      name:'Main',
      component: Main,
    },
  ]
})
