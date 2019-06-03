
import Vue from 'vue'
import store from './store';
import App from './App';
import router from './router';
//element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//多语言
import i18n from './i18n/i18n';

//公共样式
import '../static/css/index.css'
//自定义函数
import errTitle from '../static/js/index.js'
Vue.use(errTitle);

import VueQuillEditor from 'vue-quill-editor'

Vue.use(VueQuillEditor, /* { default global options } */)

import api from '@/libs/api'
Vue.prototype.api = api;

//生成二维码
// import QRCode from 'qrcode'

import jsonJs from '@/libs/json'
Vue.prototype.jsonJs = jsonJs;


//滚动轴
import EasyScroll from "easyscroll";
//echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

Vue.use(EasyScroll);
// Vue.use(VueResource);
Vue.use(ElementUI);
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  }else{
    if(sessionStorage.getItem("isLogin")=="true"){
      console.log("sessionStorage.getItem(isLogin)==true");
      next();
    }else{
      next({ path: '/login' });
    }
  }

})
//得到年月日
Vue.filter('dateTime', function(value) {
  if(!value) {
    return '';
  }
  let d = new Date(value*1000);
  let year = d.getFullYear();
  let month = '0'+(d.getMonth() + 1);
  let day = '0'+d.getDate();
  let hour = '0'+d.getHours()+'';
  let minutes = '0'+d.getMinutes()+'';
  let seconds = '0'+d.getSeconds()+'';
  return  year+ '/' + month.substr(-2,2) + '/' + day.substr(-2,2) + ' ' + hour.substr(-2,2) + ':'
    + minutes.substr(-2,2) + ':' + seconds.substr(-2,2);
});
// 科学计数法正常显示
Vue.filter('scientific',function(value = ''){
  let str = value.toString();
  let eIndex = str.indexOf('e');
  if(eIndex<0){
    return value;
  }
  let dotIndex = str.indexOf('.');
  let powNum = str.slice(eIndex+2)-6;
  let arr = (value*Math.pow(10,powNum)).toString().split('');
  // console.log(arr.splice(dotIndex+1,0,'0'.repeat(powNum)));
  return arr.join('');
});

Vue.filter('hostImgPath',(value)=>{
  return `${Vue.prototype.postAjaxBaseUrl}${value}`;
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  i18n,
  router,
  components: { App },
  template: '<App/>'
})
