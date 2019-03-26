<template>
<EasyScrollbar :barOption="scrollBar">
    <div id="wrapper" :style="{height: windowHeight + 'px' }">
        <el-menu :default-active="onRoutes" unique-opened class="el-menu-vertical-demo" background-color="#324157" text-color="#bfcbd9"
            @open="handleOpen" @close="handleClose" :collapse="storeLeftMenu" hide-timeout >
            <el-submenu :key="index" :index="item.moduleKey" v-for="(item, index) in BtnArr">
                <template slot="title">
                    <i :class="item.icon?item.icon:'el-icon-location'"></i>
                    <span>{{item.name}}</span>
                </template>
                <el-menu-item-group :key="indexS" v-for="(itemS, indexS) in item.children">
                    <el-menu-item :index="returnRouter(itemS.moduleUrl)"  @click="$router.push(itemS.moduleUrl)">{{itemS.name}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>

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
      this.postAjax(
        "/Main/GetModules",
        null,
        function(res) {
          // console.log(res.body.value,666);
          that.list = res.body.value;
          that.getArrayList();
        },
        function(res) {
          console.log("路径错误");
        }
      );
    },
    getArrayList() {
      let tree = [];
      for (var i = this.list.length - 1; i >= 0; i--) {
        var item = this.list[i];
        tree.push({
          id: item.id,
          icon: item.icon,
          isUsable: item.isUsable,
          moduleKey: item.moduleKey,
          moduleUrl: item.moduleUrl,
          name: item.name,
          sortIndex: item.sortIndex,
          parentId: item.parentId,
          children: []
        });
      }

      var treeDic = {};
      for (var i = tree.length - 1; i >= 0; i--) {
        var treeNode = tree[i];
        treeDic[treeNode.id] = treeNode;
      }
      for (var i = tree.length - 1; i >= 0; i--) {
        var treeNode = tree[i];
        if (treeNode.parentId != 0 && treeDic[treeNode.parentId]) {
          treeDic[treeNode.parentId].children.push(treeNode);
        }
      }

      let ListArrays = [];
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].parentId == 0) {
          ListArrays.push(tree[i]);
        }
      }
      ListArrays = ListArrays.sort(this.compare("sortIndex"));
      for (var i = 0; i < ListArrays.length; i++) {
        if (ListArrays[i].children) {
          ListArrays[i].children = ListArrays[i].children.sort(
            this.compare("sortIndex")
          );
        } else {
          console.log("没有子集");
        }
      }
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
