import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Index'
import Timing from '@/pages/Timing'
import DevList from '@/pages/DevList'

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

    {
      path: '/timing',
      name:'Timing',
      component: Timing
    },
    {
      path: '/devlist',
      name:'DevList',
      component:DevList
    }
  ]
})
