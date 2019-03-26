import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Indexs from '@/components/common/Index'
//用户管理
import ManagerList from '@/components/userManage/ManagerList'
import ModuleManage from '@/components/userManage/ModuleManage'
import UserList from '@/components/userManage/UserList'
import RoleManage from '@/components/userManage/RoleManage'
import ModulePower from '@/components/userManage/ModulePower'
import RolePower from '@/components/userManage/RolePower'

//运维管理
// import DailyOperation from '@/components/operationManage/DailyOperation'
// import SystemBookList from '@/components/operationManage/SystemBookList'
import AccountList from '@/components/operationManage/AccountList'
// import MarketDepth from '@/components/operationManage/MarketDepth'
// import VolumeReport from '@/components/operationManage/VolumeReport'
// import GetRecord from '@/components/operationManage/GetRecord'
// import ExtraMoney from '@/components/operationManage/ExtraMoney'
// import CertificationLevelManagement from '@/components/operationManage/CertificationLevelManagement'
import CertificationManagement from '@/components/operationManage/CertificationManagement'
// import CurrencyState from '@/components/operationManage/CurrencyState'
// import CoinVote from '@/components/operationManage/CoinVote'
// import ICOManage from '@/components/operationManage/ICOManage'
// import ActivityManagement from '@/components/operationManage/ActivityManagement'
import BannerManage from '@/components/operationManage/BannerManage'
import HotMarketManage from '@/components/operationManage/HotCurrencyConfig'

import ProjectManage from '@/components/operationManage/projectManage/ProjectList'
import ProjectEdit from '@/components/operationManage/projectManage/ProjectEdit'
import VoteManage from '@/components/operationManage/projectManage/CurrencyVoteList'
import VoteEdit from '@/components/operationManage/projectManage/CurrencyVoteEdit'
import StarNodeManage from '@/components/operationManage/nodeManage/NodeList'
import StarNodeEdit from '@/components/operationManage/nodeManage/NodeEdit'

import DividedEnvelope from '@/components/operationManage/DividedEnvelope'


//充值管理 rechargeManagement MyChargeCode
// import ChargeCodeManagement from '@/components/rechargeManagement/ChargeCodeManagement'
// import MyChargeCode from '@/components/rechargeManagement/MyChargeCode'
// import RMBRecharge from '@/components/rechargeManagement/RMBRecharge'
// import VirtualCurrencyRecharge from '@/components/rechargeManagement/VirtualCurrencyRecharge'
// import RMBRecharge2 from '@/components/rechargeManagement/RMBRecharge2'
// import BTSUnualRecharge from '@/components/rechargeManagement/BTSUnualRecharge'

//提现管理 getCashManage
// import CashCnyTask from '@/components/getCashManage/CashCnyTask'
// import CashCnyListLoading from '@/components/getCashManage/CashCnyListLoading'
// import CashCnyTask2 from '@/components/getCashManage/CashCnyTask2'
// import CashCoinListLoading from '@/components/getCashManage/CashCoinListLoading'
// import CashCoins from '@/components/getCashManage/CashCoins'
import CashManagement from '@/components/userManage/CashManagement'
import RechargeRecord from '@/components/userManage/RechargeRecord'
import ReportManagement from '@/components/userManage/ReportManagement.vue'
import MiningManagement from '@/components/userManage/MiningManagement.vue'


//消息管理 SMSSend SMSManagement
import EmailList from '@/components/newsManagement/EmailList'
import TriggerList from '@/components/newsManagement/TriggerList'
// import SMSSend from '@/components/newsManagement/SMSSend'
import TemplateManagement from '@/components/newsManagement/TemplateManagement'
import SMSManagement from '@/components/newsManagement/SMSManagement'
import smsList from '@/components/newsManagement/smsList'


//系统管理
import MarketMaintenance from '@/components/systemManagement/MarketMaintenance'
import CurrencyManagement from '@/components/systemManagement/CurrencyManagement'
import LanguageManagement from '@/components/systemManagement/LanguageManagement'
// import CashAccount from '@/components/systemManagement/CashAccount'
// import CMSManage from '@/components/systemManagement/CMSManage'
// import VIPDrade from '@/components/systemManagement/VIPDrade'
// import LedgerManager from '@/components/systemManagement/LedgerManager'
import LoginLog from '@/components/systemManagement/LoginLog'
import CurrencyIntro from '@/components/systemManagement/CurrencyIntro'

import CurrencyIconManage from '@/components/systemManagement/CurrencyIconManage'

//红包管理




import Echarts from '@/components/test/Echarts'
import Test from '@/components/test/Test'
import Err from '@/components/error/Error'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '*', redirect: '/404', hidden: true },
    { path: '/404', component: Err },
    { path: '/login',name:'登录', component: Login},
    { path: '/', component: Login },
    { path: '/test', component: Test },
    {
      path: '/index',
      // name:'导航',
      component: Indexs,
      children:[
        {path: '/',name:'默认首页',component: ManagerList},
        //用户管理
        {path: '/managerList',name:'管理员列表',component: ManagerList},
        {path: '/moduleManage',name:'模块管理',component: ModuleManage},
        {path: '/userList',name:'用户列表',component: UserList},
        {path: '/roleManage',name:'角色管理',component: RoleManage},
        {path: '/modulePower',name:'模块权限管理',component: ModulePower},
        {path: '/rolePower',name:'角色权限管理',component: RolePower},
        //运维管理
        // {path: '/dailyOperation',name:'日运营概况',component: DailyOperation},
        // {path: '/systemBookList',name:'系统账本列表',component: SystemBookList},
        {path: '/accountList',name:'账户列表',component: AccountList},
        // {path: '/marketDepth',name:'市场深度',component: MarketDepth},
        // {path: '/volumeReport',name:'成交量报表',component: VolumeReport},
        // {path: '/getRecord',name:'成交记录',component: GetRecord},
        // {path: '/extraMoney',name:'额外收支',component: ExtraMoney},
        // {path: '/certificationLevelManagement',name:'认证等级管理',component: CertificationLevelManagement},
        {path: '/certificationManagement',name:'认证申请列表',component: CertificationManagement},
        //红包管理
        {path:'/dividedEnvelope',name:'红包管理',component:DividedEnvelope},
        // {path: '/currencyState',name:'币种状态',component: CurrencyState},
        // {path: '/coinVote',name:'新币投票',component: CoinVote},
        // {path: '/ICOManage',name:'ICO管理',component: ICOManage},
        // {path: '/activityManagement',name:'活动管理',component: ActivityManagement},

        //充值管理
        // {path: '/chargeCodeManagement',name:'充值码管理(管)',component: ChargeCodeManagement},
        // {path: '/myChargeCode',name:'我的充值码列表',component: MyChargeCode},
        // {path: '/RMBRecharge',name:'人名币充值管理',component: RMBRecharge},
        // {path: '/virtualCurrencyRecharge',name:'虚拟币充值管理',component: VirtualCurrencyRecharge},
        // {path: '/RMBRecharge2',name:'人名币充值管理(管)',component: RMBRecharge2},
        // {path: '/BTSUnualRecharge',name:'BTS异常充值管理',component: BTSUnualRecharge},

        //提现管理 getCashManage
        // {path: '/cashCnyTask',name:'人名币提现领取',component: CashCnyTask},
        // {path: '/cashCnyListLoading',name:'待处理的人名币',component: CashCnyListLoading},
        // {path: '/cashCnyTask2',name:'人名币体提现表(管)',component: CashCnyTask2},
        // {path: '/cashCoinListLoading',name:'待处理的虚拟币提现',component: CashCoinListLoading},
        // {path: '/cashCoins',name:'虚拟币体现列表',component: CashCoins},

        //消息管理
        {path: '/triggerList',name:'触发器列表',component: TriggerList},
        {path: '/emailList',name:'邮件发送设置',component: EmailList},
        // {path: '/SMSSend',name:'短信发送设置',component: SMSSend},
        {path: '/templateManagement',name:'触发器模板',component: TemplateManagement},
        { path: '/SMSManagement', name: '短信设置', component: SMSManagement },
        { path: '/smsList', name: '短信发送管理', component: smsList }, 

        //系统管理   CashAccount
        {path: '/marketMaintenance',name:'市场维护页面',component: MarketMaintenance},
        {path: '/currencyManagement',name:'币种页面',component: CurrencyManagement},
        {path: '/languageManagement',name:'多语言管理',component: LanguageManagement},
        {path: '/currencyImage',name:'币种图标管理',component: CurrencyIconManage},
        {path: '/coinProject',name:'coinProjectManage',component: ProjectManage},
        {path: '/coinProjectEdit/:id',name:'coinProjectEdit',component: ProjectEdit},
        {path: '/vote',name:'voteManage',component: VoteManage},
        {path: '/voteEdit/:id',name:'voteEdit',component: VoteEdit},
        {path: '/starNode',name:'starNodeManage',component: StarNodeManage},
        {path: '/starNodeEdit/:id',name:'starNodeEdit',component: StarNodeEdit},

        // {path: '/cashAccount',name:'资金账户管理',component: CashAccount},
        // {path: '/CMSManage',name:'CMS管理',component: CMSManage},
        // {path: '/VIPDrade',name:'VIP等级设置',component: VIPDrade},
        // {path: '/ledgerManager',name:'总账簿管理',component: LedgerManager},
        {path: '/loginLog',name:'登录日志',component: LoginLog},
        {path: '/withdrawl', name: "提币管理", component: CashManagement},
        {path: '/banner', name: "banner", component: BannerManage},
        {path: '/hotMarket', name: "hotMarket", component: HotMarketManage},
        {path: '/currencyIntro', name: "币种资料", component:CurrencyIntro},
        {path: '/deposit', name: "充值管理", component: RechargeRecord},
        {path:'/report',name:'报表', component:ReportManagement},
        {path:'/mining',name:'mining', component:MiningManagement},
        //test
        {path: '/echarts',name:'图标',component: Echarts},
        {path: '/test',name:'测试模块',component: Test},
      ]
    },

  ]
})

