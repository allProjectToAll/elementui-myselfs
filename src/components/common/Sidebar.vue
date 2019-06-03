<template>
<EasyScrollbar :barOption="scrollBar">
    <div id="wrapper" :style="{height: windowHeight + 'px' }">
        <el-menu :default-active="onRoutes" unique-opened class="el-menu-vertical-demo"
         background-color="#324157" text-color="#bfcbd9" @open="handleOpen" @close="handleClose" :collapse="storeLeftMenu" hide-timeout >
            
          <template v-for="(item1, key) in jsonJs.Menu">
            <el-menu-item :index="returnRouter(item1.path)"  v-if="!item1.childMenu.length"  @click="$router.push(item1.path)">
              <i :class="item1.icon"></i>
              <span slot="title">{{item1.title}}</span>
            </el-menu-item>

            <el-submenu :index="returnRouter(item1.path)"  v-else>
                  <template slot="title">
                    <i :class="item1.icon"></i>
                    <span slot="title">{{item1.title}}</span>
                  </template>

                  <template v-for="(item2, index2) in item1.childMenu">
                    <el-menu-item :index="returnRouter(item2.path)"  v-if="! item2.childMenu.length" >
                      <i :class="item2.icon"></i>
                      <span slot="title">{{item2.title}}</span>
                    </el-menu-item>

                    <el-submenu :index="returnRouter(item2.path)" v-else>
                      <!-- <template slot="title"> -->
                        
                        <span slot="title"><i :class="item2.icon" class="threeIcon"></i>{{item2.title}}</span>
                        <el-menu-item :index="returnRouter(item3.path)" v-for="(item3,index3) in item2.childMenu" :key="index3" >
                          <i :class="item3.icon"></i>
                          <span slot="title">{{item3.title}}</span>
                        </el-menu-item>
                      <!-- </template> -->
                    </el-submenu>
                  </template>
            </el-submenu>
          </template>
       

        </el-menu>
    </div>
</EasyScrollbar>
</template>
<script>
export default {
  data() {
    return {
      // language:this.loadTxt(loginList),
      name: "",
      windowHeight: 0,
      list: [],
      BtnArr: [],
      scrollBar: {
        barWidth: 0
      }
    };
  },
  created: function() {
    console.log(this.jsonJs,"jsonJsjsonJsjsonJsjsonJsjsonJs")
    let that = this;
    //resize控制菜单的高度，从而出现滚动条
    this.windowHeight = $("body").height();
    window.onresize = () => {
      return (() => {
        this.windowHeight = $("body").height();
      })();
    };
    this.getList();
  },
  computed: {
    storeLeftMenu: function() {
      //获取store内的值赋值给当前menu展开
      return this.$store.state.menu.leftMenuOpen;
    },
    onRoutes: function() {
      //$route.path
      return this.$route.path.replace("/", "");
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    returnRouter(router) {
      return router ? router.replace("/", "") : null;
    },
    getList() {
      let that = this;
      // this.postAjax("/Main/GetModules",null,function(res) {
      //     that.list = res.body.value;
      //     that.getArrayList();
      //   },
      //   function(res) {
      //     console.log("路径错误");
      //   }
      // );
    },
    getArrayList() {
      

      this.listLoading = false;
      this.BtnArr = ListArrays;
    },
    compare(property) {
      return function(a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value1 - value2;
      };
    },
    toUrl(url) {
      this.$router.go(url);
    }
  }
};
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.sideBar-contain {
  height: 100%;
  overflow: auto;
}
ul li ul li.el-menu-item {
  /* padding-left: 50px !important; */
}
.el-submenu .el-menu-item {
  /* height: 35px;
  line-height: 35px;
  font-size: 14px; */
}
.threeIcon{
  margin-top:-2px;
}
</style>
