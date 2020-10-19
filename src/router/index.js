import Vue from 'vue'
import Router from 'vue-router'


import Main from '@/pages/Index'
import News from '@/pages/News'
import Weather from '@/pages/Weather'
import Setting from '@/pages/Setting'
import Background from '@/pages/Background'

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
      path:'/news',
      name:'News',
      component:News
    },
    {
      path:'/Weather',
      name:'Weather',
      component:Weather
    },
    {
      path:'/setting',
      name:'Setting',
      component:Setting
    },
    {
      path:'/background',
      name:'Background',
      component:Background
    }
  ]
})
