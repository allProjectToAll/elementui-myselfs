import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      count: 999,
      menu:{
        leftMenuOpen:false,//menu页面ul是否展开
        elSideBarSync:false, //menu组件外index页面的盒子是否展开
      },
      token:sessionStorage.getItem("token")||0,
      url: process.env.NODE_ENV === 'development' ? 'http://192.168.125.231:8884' : 'https://erpapi.azex.io',
      languageList:[],
      languageObj:{},
      languageCodeObj:{},
      lang: ["","English", "简体中文", "日本語", "한국어","русский"]
    },
    getters: {
        // getCount: state => {
        //     return state.count;
        // },
        // getLeftMenuOpen: state=>{
        //   return state.count;
        // }
      languageList: state => state.languageList
    },
    mutations: {
      increment (state) {
        state.count++
      },
      leftMenuChange(state) {//控制菜单左右
        if(state.menu.leftMenuOpen == true){
          state.menu.leftMenuOpen = false;
          state.menu.elSideBarSync = false;
        }else{
          state.menu.leftMenuOpen = true;
          state.menu.elSideBarSync = true;
        }
        console.log(state.menu.leftMenuOpen+"左菜单是否展开");
      },
      setToken(state,res){ //设置token 传递参数
        state.token = res.token;
      },
      setLanguageList(state,data){
        state.languageList = data;
        state.languageObj = convertLangToObj(data);
        state.languageCodeObj = convertLangToCodeObj(data);
      }

    },
    actions:{
      async getLangList({commit},that){
        await  that.postAjax('/Lang/GetOptions', {}, (res) => {
          commit('setLanguageList', res.body.value);
        })
        return store.state.languageList;
      },
    }
})

function convertLangToObj(list){
  let obj = {};
  list.forEach((lang) => {
    obj[`${lang.value}`] = lang;
  })
  return obj;
}

function convertLangToCodeObj(list){
  let obj = {};
  list.forEach((lang) => {
    obj[`${lang.code}`] = lang;
  })
  return obj;
}


export default store;
