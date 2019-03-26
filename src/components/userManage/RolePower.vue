<template>
    <div id="listContain" class="app-container">
        <h2>{{$t('message.RoleAssignment')}}</h2><span class="commentary">&nbsp;&nbsp;{{$t('message.Remarks')}}</span>
        <div class="clear"></div>
        <div class="box">
            <div class="allTypeBox">
                <el-button type="primary" @click="addModel">{{$t('message.Save')}}</el-button>
                <el-button type="primary" @click="turnBack">{{$t('message.TurnBack')}}</el-button>
                <el-button icon="el-icon-refresh" type="primary" @click="getArrayList"></el-button>
            </div>
            <el-table  class="moduleControlBox" default-expand-all :data="list" v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table border :data="scope.row.children" :show-header=false fit >
                            <el-table-column :label="$t('message.Module')" prop="name" width="200"></el-table-column>
                            <el-table-column align="left" :label="$t('message.Visit')" width="50">
                                <template slot-scope="scope">
                                    <el-checkbox
                                     @change="updateChecked(scope.row)"
                                     v-model="checked"
                                    :label='scope.row.moduleKey+"_0"'
                                    :key='scope.row.moduleKey+"_0"'>&nbsp;
                                    </el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.ModulePermissions')">
                                <template slot-scope="scope">
                                    <el-checkbox
                                    @change="updateChecked(scope.row,item)"
                                    v-model="checked"
                                    :label='scope.row.moduleKey+"_"+item.code'
                                    :key='scope.row.moduleKey+"_"+item.code'
                                    v-for="item in scope.row.limits">
                                        {{item.name}}
                                    </el-checkbox>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.Module')" prop="name" width="200"></el-table-column>
                <el-table-column align="left" :label="$t('message.Visit')" width="50">
                    <template slot-scope="scope">
                        <el-checkbox
                       @change="updateChecked(scope.row)"
                        v-model="checked"
                        :label='scope.row.moduleKey+"_0"'
                        :key='scope.row.moduleKey+"_0"'>&nbsp;
                        </el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.ModulePermissions')">
                    <template slot-scope="scope">
                        <el-checkbox
                       @change="updateChecked(scope.row,item)"
                        v-model="checked"
                        :label='scope.row.moduleKey+"_"+item.code'
                        :key='scope.row.moduleKey+"_"+item.code'
                        v-for="item in scope.row.limits">
                            {{item.name}}
                        </el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      listLoading: true,
      list: [],
      checked: [],
      treeModuleKeyDic: []
    };
  },
  created: function() {
    this.getArrayList();
  },
  methods: {
    updateChecked(row, item) {
      let code = item ? item.code : "0";
      let key = row.moduleKey + "_" + code;
      let moduleKey = row.moduleKey;
      let key4visit = row.moduleKey + "_0";
      let checking = false;
      let $this = this;
      if (_.contains($this.checked, key)) {
        checking = true;
      }

      if (checking) {
        // 选中了一个，若没有选中 访问 则自动选中
        if (!_.contains($this.checked, key4visit)) {
          $this.checked.push(key4visit);
        }

        // 若存在父级节点，父级节点的访问权限没有被选中，则选中它
        let parent = $this.treeModuleKeyDic[moduleKey].parent;
        if (parent) {
          let parentKey4visit = parent.moduleKey + "_0";
          if (!_.contains($this.checked, parentKey4visit)) {
            $this.checked.push(parentKey4visit);
          }
        }
      } else {
        if (key == key4visit) {
          // 取消了访问权限，则取消本模块所有权限
          $this.checked = _.filter($this.checked, function(key) {
            return key.indexOf(row.moduleKey) < 0;
          });

          // 取消子集模块所有权限
          let children = $this.treeModuleKeyDic[moduleKey].children;

          //  子模块的所有权限
          let allchildrenLimits = _.chain(children)
            .map(function(item) {
              let limits = _.map(item.limits, function(l) {
                return item.moduleKey + "_" + l.code;
              });
              limits.push(item.moduleKey + "_0");
              return limits;
            })
            .flatten()
            .value();

          // 取差集，排查子模块的权限
          $this.checked = _.difference($this.checked, allchildrenLimits);
        }
      }
      console.log(key);
      console.log($this.checked);
    },
    getArrayList() {
      let that = this;
      $.when(
        this.postAjax("/Role/GetModuleLimits", {
          roleId: this.$route.query.id
        }),
        this.postAjax("/Limit/GetModuleAndLimitsList")
      ).done(function(roleLimitsResp, allLimitsResp) {
        //角色的权限
        let roleLimits = roleLimitsResp.body.value;
        // 所有模块
        let allLimits = allLimitsResp.body.value;

        let tree = _.map(allLimits, function(x) {
          x.children = [];
          _.each(x.limits, function(limit) {
            limit.checked = false;
          });
          return x;
        });
        let treeDic = {};
        _.each(allLimits, function(x) {
          treeDic[x.id] = x;
        });
        _.each(tree, function(x) {
          if (x.parentId != 0 && treeDic[x.parentId]) {
            treeDic[x.parentId].children.push(x);
            x.parent = treeDic[x.parentId];
          }
        });
        let list = _.filter(tree, function(x) {
          return x.parentId == 0;
        });
        // 保存顶级的树节点
        that.list = list;

        var treeModuleKeyDic = {};
        _.each(allLimits, function(x) {
          treeModuleKeyDic[x.moduleKey] = x;
        });
        // 保存所有树节点，使用Id进行索引
        that.treeModuleKeyDic = treeModuleKeyDic;

        let moduleKeyDic = {};
        _.each(allLimits, function(x) {
          moduleKeyDic[x.moduleKey] = x;
        });
        _.each(_.keys(roleLimits), function(roleLimitKey) {
          let m = moduleKeyDic[roleLimitKey];
          if (m) {
            let limits = roleLimits[roleLimitKey];
            _.each(limits, function(l) {
              var checkbox = _.findWhere(m.limits, function(limit) {
                return limit.code == l;
              });
              if (checkbox) {
                checkbox.checked = true;
              }
            });
          }
        });

        var checked = _.chain(roleLimits)
          .pairs()
          .map(function(mlimit) {
            return _.map(mlimit[1], function(code) {
              return mlimit[0] + "_" + code;
            });
          })
          .flatten()
          .value();
        that.checked = checked;

        that.listLoading = false;
        that.openErr(that.$t("message.SuccessToGetList"),2);
      });
    },
    addModel() {
      let that = this;
      let list = this.list;
      let roleId = this.$route.query.id;
      let allChildren = _.flatten(_.pluck(list, "children"));
      let treeNodes = _.union(allChildren, list);

      let moduleLimitsList = _.map(this.checked, function(item) {
        var s = item.split("_");
        return {
          moduleKey: s[0],
          code: s[1]
        };
      });

      let groupByResult = _.groupBy(moduleLimitsList, "moduleKey");

      let moduleLimits = _.map(_.keys(groupByResult), function(key) {
        return {
          moduleKey: key,
          limits: _.pluck(groupByResult[key], "code")
        };
      });

      var data = {
        roleId: roleId,
        moduleLimits: moduleLimits
      };
      this.postAjax("/Role/SetModuleLimit", data).done(function() {
        that.openErr(that.$t("message.ServiceSuccess"),2);
      });
    },
    turnBack() {
      this.$router.push({
        path: "/roleManage"
      });
    },
    checkedAllFn(res) {
      console.log(res);
    },
    setlectCheck(res) {}
  }
};
</script>
<style scoped>
.moduleControlBox {
  width: 100%;
  margin-top: 10px;
}

.el-table {
  margin-bottom: 30px;
}

.el-table__expanded-cell[class*="cell"] {
  padding: 0 !important;
}

.el-dialog {
  width: 300px !important;
}
</style>

