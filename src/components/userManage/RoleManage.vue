<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.RoleManagement") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        <div class="box">
            <div class="allTypeBox">
                <el-button type="primary"  v-if="IsInArray(btnArray,1)"  @click="addListFn">{{ $t("message.AddRole") }}</el-button>
                <!-- <el-button type="primary"  v-if="IsInArray(btnArray,3)"  @click="deletListFn">{{ $t("message.DeletRole") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,2)"  @click="reviseListFn">{{ $t("message.ReviseRole") }}</el-button> -->
                <!-- <el-button type="primary"  v-if="IsInArray(btnArray,4)" @click="allotListFn">{{ $t("message.AssigningRole") }}</el-button> -->
                <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>
           
            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table ref="rowClick" @row-click="rowClick" stripe @selection-change="handleSelectionChange" :data="list" 
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit >
                    <el-table-column align="left" v-model="multipleSelection" type="selection" width="50">
                    </el-table-column>
                   
                    <el-table-column align="left" label="Id" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Name')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column align="left"  :label="$t('message.IsItAvailable')">
                       <template slot-scope="scope">
                            {{scope.row.isUsable == true ? $t("message.Y"):$t("message.N")}}
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.handle')" width="150">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary"  v-if="IsInArray(btnArray,2)"  @click="reviseListFn(scope.row)">{{ $t("message.Revise") }}</el-button>
                            <el-button size="small" type="danger"  v-if="IsInArray(btnArray,3)"  @click="deletListFn(scope.row)">{{ $t("message.Delet") }}</el-button>
                            <el-button size="small" v-if="IsInArray(btnArray,4)"  @click="allotListFn(scope.row)">{{ $t("message.AssigningRole") }}</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            <!-- 分页 -->
                <div v-show="!listLoading">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                        :current-page="pagenation.currPage"  :page-sizes="[8,10,15, 20]" :page-size="pagenation.pageSize" 
                        layout="total, sizes, prev, pager, next, jumper"  :total="pagenation.total">
                    </el-pagination>
                </div>
            </div>
        </div>

    <!-- 添加角色 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialog.addDialogSync" width="500px" :close-on-click-modal="isfalse" @close="cancel('addRuleForm')">
            <el-form ref="addRuleForm" class="small-space" :rules="dialogFormRules" :model="dialogForm.addFieldForm" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
                <el-form-item :label="$t('message.Name')" prop="name">
                    <el-input v-model="dialogForm.addFieldForm.name" :placeholder="$t('message.PleaseEnterName')"></el-input>
                </el-form-item>
                <el-form-item  :label="$t('message.IsItAvailable')" prop="isUsable">
                     <el-checkbox v-model="dialogForm.addFieldForm.isUsable"></el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('addRuleForm')">{{ $t("message.Cancel") }}</el-button>
                <el-button v-if="addSync" type="primary" 
                :element-loading-text="$t('message.Inprocessing')" 
                v-loading.fullscreen.lock="fullscreenLoading"
                 @click="addSubmitForm('addRuleForm')">{{ $t("message.Add") }}</el-button>
                <el-button v-else type="primary" 
                :element-loading-text="$t('message.Inprocessing')" 
                v-loading.fullscreen.lock="fullscreenLoading"
                 @click="reviseSubmitForm('addRuleForm')">{{ $t("message.Revise") }}</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("message.PleaseEnterPassword")));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };

    return {
      isfalse: false,
      menuicon: "getMenu",
      deleteArray: [],
      dialogTitle: this.$t("message.AddRole"),
      list: null,
      addSync: false,
      btnArray: [],
      multipleSelection: [], //选中的表格数组
      listLoading: true,
      fullscreenLoading: false,
      pagenation: {
        total: null, //总条目数
        currPage: 1, //当前页
        pageSize: 8, //一页显示个数
        title: "",
        type: null //类型
      },
      dialog: {
        //控制每个弹出框显示隐藏的
        addDialogSync: false
      },
      dialogForm: {
        //控制每个弹出框字段的
        addFieldForm: {
          id: 0,
          isUsable: true,
          name: ""
        }
      },
      dialogFormRules: {
        name: [
          {
            required: true,
            message: this.$t("message.PleaseEnterName"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created: function() {
    this.getList();
    this.getBtn();
  },
  computed: {},
  methods: {
    cancel(formName) {
      this.dialog.addDialogSync = false;
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    getList() {
      var that = this;
      let par = {
        pageIndex: this.pagenation.currPage, //10
        pageSize: this.pagenation.pageSize //(1-1)*10
      };
      this.postAjax(
        "/Role/GetPageList",
        par,
        function(res) {
          that.list = res.body.value.items;
          that.pagenation.total = res.body.value.totalItems;
          that.listLoading = false;
          that.openErr(that.$t("message.SuccessToGetList"), 2);
        },
        function(res) {
          console.log("路径错误");
        }
      );
    },
    getBtn() {
      let that = this;
      this.postAjax(
        "/Role/Limits",
        null,
        function(res) {
          console.log(res.body.value);
          that.btnArray = res.body.value;
        },
        function(res) {
          console.log("路径错误");
          that.openErr(that.$t("message.ErrorToGetBtnLimit"), 1);
        }
      );
    },
    rowClick(row) {
      let index = this.multipleSelection.indexOf(row);
      if (index < 0) {
        this.multipleSelection = [];
        this.multipleSelection.push(row);
        this.$refs.rowClick.toggleRowSelection(row, true);
      } else {
        this.multipleSelection.splice(index, 1);
        this.$refs.rowClick.toggleRowSelection(row, false);
      }
    },
    handleSelectionChange(val) {
      //当选择项发生变化时会触发该事件
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    handleSizeChange(val) {
      //操作分页
      this.pagenation.pageSize = val; //每页条数
      this.getList(); //重新请求一次
    },
    handleCurrentChange(val) {
      this.pagenation.currPage = val; //当前页码
      this.getList();
    },
    addListFn() {
      this.addSync = true;
      this.dialogTitle = this.$t("message.AddRole");
      this.dialogForm.addFieldForm = {
        id: 0,
        isUsable: true,
        name: ""
      };
      this.dialog.addDialogSync = true;
    },
    deletListFn(item) {
        let that = this;
        this.$confirm(that.$t("message.SureToDelet"),that.$t("message.Title"),{
            confirmButtonText: that.$t("message.MakeSure"),
            cancelButtonText: that.$t("message.Cancel"),
            type: "warning"
        }).then(() => {
            that.fullscreenLoading = true;
            that.postAjax("/Role/Delete",{ id: item.id },(res)=>{
                that.fullscreenLoading = false;
                that.openErr(that.$t("message.DeleteSuccess"), 2);
                that.getList();
            },(res)=>{
                that.fullscreenLoading = false;
            })

        }).catch(() => {});
    },
    reviseListFn(item) {
        this.addSync = false;
        this.dialogTitle = this.$t("message.ReviseRole");
    
        this.dialog.addDialogSync = true;
        this.dialogForm.addFieldForm = {
          id: item.id,
          isUsable: item.isUsable,
          name: item.name
        };
    },
    allotListFn(item) {
      //分配角色权限
      this.$router.push({
          path: "/rolePower",
          query: { id: item.id }
        });
    },
    addSubmitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          //正则验证成功
          that.fullscreenLoading = true;
          this.postAjax(
            "/Role/Add",
            this.dialogForm.addFieldForm,
            function(res) {
              that.fullscreenLoading = false;
              that.openErr(that.$t("message.AddSuccess"), 2);
              that.getList();
              that.dialog.addDialogSync = false;
            },
            function(res) {
              console.log("路径错误");
              that.fullscreenLoading = false;
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reviseSubmitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          //正则验证成功
          that.fullscreenLoading = true;
          this.postAjax("/Role/Update",this.dialogForm.addFieldForm,function(res) {
              that.fullscreenLoading = false;
              that.openErr(that.$t("message.ServiceSuccess"), 2);
              that.dialog.addDialogSync = false;
              that.getList();
            },
            function(res) {
              console.log("路径错误");
              that.fullscreenLoading = false;
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.el-input {
  width: 200px;
}
</style>
