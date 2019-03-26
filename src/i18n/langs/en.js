import enLocale from 'element-ui/lib/locale/lang/en'
import bannerManage from './bannerManage/en'
import common from './common/en'
import hotCurrency from './hotCurrency/en'
import nodeManage from "./nodeManage/en";
import projectManage from "./projectManage/en";
import currencyIconManage from "./currencyIconManage/en";

import redpacket from './redpacket/en'

const en = {
  message: {
    'user': 'username',
    //头部
    'ResetPassword': 'ResetPassword',
    'SwitchLanguage': 'SwitchLanguage',
    'ExitLogon': 'ExitLogon',
    'Chinese': 'Chinese',
    'Englishs': 'English',
    'AbnormalBill':'',
    'deleteConfirmText':'你确定删除0吗',
    'searchPlc':'请输入关键词',
    'add':'新增',
    'delete':'删除',
    'update':'修改',
  },
  ...enLocale,
  ...bannerManage,
  ...common,
  ...hotCurrency,
  ...currencyIconManage,
  ...projectManage,
  ...nodeManage,
  ...redpacket
}

export default en;
