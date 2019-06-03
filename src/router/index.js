import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Indexs from '@/components/Index'

import demo from '@/components/demo'

import Echarts from '@/components/test/Echarts'
import Test from '@/components/test/Test'
import Err from '@/components/error/Error'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '*', redirect: '/404', hidden: true },
    { path: '/404', component: Err },
    { path: '/login',name:'login', component: Login},
    { path: '/', component: Login },
    { path: '/test',name:'test', component: Test },
    {
      path: '/index',
      // name:'导航',
      component: Indexs,
      children:[
        {path: '/',name:'默认首页',component: demo},
        //用户管理
        {path: '/demo',name:'demo',component: demo},
        //test
        {path: '/echarts',name:'图标',component: Echarts},
        {path: '/err',name:'err',component: Err},
        {path: '/test',name:'测试模块',component: Test},
      ]
    },

  ]
})

