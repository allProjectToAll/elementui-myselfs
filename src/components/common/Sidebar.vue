<template>
<EasyScrollbar :barOption="scrollBar">
    <div id="wrapper" :style="{height: windowHeight + 'px' }">
        <el-menu :default-active="onRoutes" unique-opened class="el-menu-vertical-demo"
         background-color="#324157" text-color="#bfcbd9" @open="handleOpen" @close="handleClose" :collapse="storeLeftMenu" hide-timeout >
            <!-- <el-submenu :key="index" :index="item.moduleKey" v-for="(item, index) in BtnArr">
                <template slot="title">
                    <i :class="item.icon?item.icon:'el-icon-location'"></i>
                    <span>{{item.name}}</span>
                </template>
                <el-menu-item-group :key="indexS" v-for="(itemS, indexS) in item.children">
                    <el-menu-item :index="returnRouter(itemS.moduleUrl)"  @click="$router.push(itemS.moduleUrl)">{{itemS.name}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu> -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>

            
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">导航四</span>
            </el-menu-item>

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
  padding-left: 50px !important;
}
.el-submenu .el-menu-item {
  height: 35px;
  line-height: 35px;
  font-size: 14px;
}
</style>
