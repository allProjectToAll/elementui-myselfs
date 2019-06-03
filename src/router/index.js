import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Indexs from '@/components/common/Index'
//用户管理
// import ManagerList from '@/components/userManage/ManagerList'
// import ModuleManage from '@/components/userManage/ModuleManage'
// import UserList from '@/components/userManage/UserList'
// import RoleManage from '@/components/userManage/RoleManage'
// import ModulePower from '@/components/userManage/ModulePower'
// import RolePower from '@/components/userManage/RolePower'




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
        {path: '/',name:'默认首页',component: Test},
        //用户管理
        // {path: '/managerList',name:'管理员列表',component: ManagerList},
        //test
        {path: '/echarts',name:'图标',component: Echarts},
        {path: '/test',name:'测试模块',component: Test},
      ]
    },

  ]
})

