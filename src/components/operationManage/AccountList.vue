<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.AccountManagement") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        <div class="box">
            <div class="allTypeBox">
                <el-form :inline="true" class="demo-form-inline" label-width="80px">
                    <el-form-item :label="$t('message.Currency')">
                        <el-select v-model="Cath">
                            <el-option :label="$t('message.PleaseChoise')" value=""></el-option>
                            <el-option :key=index v-for="(item,index) in CathSelect" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item>
                       <el-input v-model="email" :placeholder="$t('message.SearchForEmail')" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                       <el-input v-model="phoneNumbder" :placeholder="$t('message.SearchForPhone')" clearable></el-input>
                    </el-form-item>
                    <el-form-item style="margin-top:-10px;">
                        <el-button type="primary" icon="el-icon-search" @click="getList"></el-button>
                    </el-form-item>
                    <el-form-item style="margin-top:-10px;">
                        <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
                    </el-form-item>
                    
                    
                </el-form>
            </div>
            <!-- <div class="allTypeBox"> -->
               <!-- <el-button type="primary" v-if="IsInArray(btnArray,1)" :element-loading-text="$t('message.Inprocessing')" 
                        v-loading.fullscreen.lock="fullscreenLoading" @click="LockingFn">{{ $t("message.Locking") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,2)" :element-loading-text="$t('message.Inprocessing')" 
                      v-loading.fullscreen.lock="fullscreenLoading" @click="UnlockFn">{{ $t("message.Unlock") }}</el-button> -->
                <!-- <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button> -->
            <!-- </div> -->
           
            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table  ref="rowClick"  stripe :data="list" 
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <!-- <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column> -->
                    <el-table-column align="left" :label="$t('message.Currency')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.currency}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.email')" width="200">
                        <template slot-scope="scope">
                            <span>{{scope.row.email}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.realName')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.realName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.ToSendAmount')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.mortgagedAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.phone')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.phoneNumber}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Statu')" width="80">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status==1">
                                  {{ $t("message.Actived") }}
                            </template>
                            <template v-else-if="scope.row.status==2">
                                  {{ $t("message.Locking") }}
                            </template>
                            <template v-else-if="scope.row.status==3">
                                  {{ $t("message.NoLock") }}
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column align="left" :label="$t('message.MortgagedAmount')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.mortgagedAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.LockedAmount')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.lockedAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.TotalAmount')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.totalAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.handle')" width="150">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" :loading="fullscreenLoading" v-if="IsInArray(btnArray,1)"  @click="LockingFn(scope.row)">{{ $t("message.Locking") }}</el-button>
                            <el-button size="small" type="danger" :loading="fullscreenLoading2" v-if="IsInArray(btnArray,2)"  @click="UnlockFn(scope.row)">{{ $t("message.Unlock") }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            <!-- 分页 -->
                <div v-show="pageLoding">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                        :current-page="pagenation.currPage"  :page-sizes="[8,10,15, 20]" :page-size="pagenation.pageSize" 
                        layout="total, sizes, prev, pager, next, jumper"  :total="pagenation.total">
                    </el-pagination>
                </div>
            </div>
        </div>

    

    </div>
</template>
<script>
export default {
  data() {
    return {
      Cath: "",
      email: "",
      phoneNumbder: "",
      CathSelect: [],
      btnArray: [],
      list: null,
      multipleSelection: [], //选中的表格数组
      listLoading: false,
      fullscreenLoading: false,
      fullscreenLoading2: false,
      pageLoding: false,
      pagenation: {
        total: null, //总条目数
        currPage: 1, //当前页
        pageSize: 8, //一页显示个数
        title: "",
        type: null //类型
      }
    };
  },
  created: function() {
    this.getCath();
    this.getBtn();
    this.getList();
  },
  computed: {},
  methods: {
    getList() {
      if (
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
          this.email
        ) == false &&
        this.email.toString().trim()
      ) {
        this.openErr(this.$t("message.enterSureEmail"), 1);
      } else {
        var that = this;
        let par = {
          pageIndex: this.pagenation.currPage, //10
          pageSize: this.pagenation.pageSize, //(1-1)*10
          currencyId: this.Cath,
          email: this.email.toString().trim() ? this.email : null,
          phoneNumbder: this.phoneNumbder
        };
        this.postAjax(
          "/Account/GetPageList",
          par,
          function(res) {
            that.list = res.body.value.items;
            that.pagenation.total = res.body.value.totalItems;
            that.pageLoding = true;
            that.listLoading = false;
            that.openErr(that.$t("message.SuccessToGetList"), 2);
          },
          function(res) {
            console.log("路径错误");
          }
        );
      }
    },
    getBtn() {
      let that = this;
      this.postAjax(
        "/Account/Limits",
        null,
        function(res) {
          console.log(res.body.value);
          that.btnArray = res.body.value;
        },
        function(res) {
          console.log("路径错误");
          that.openErr(that.$t("message.ErrorToGetBtnLimit"), 2);
        }
      );
    },
    getCath() {
      let that = this;
      this.postAjax(
        "/Currency/GetIdList",
        null,
        function(res) {
          that.CathSelect = res.body.value;
        },
        function(res) {
          console.log("路径错误");
        }
      );
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
    LockingFn(item) {
        console.log(item)
      if (item.status == 2) {
          this.openErr(this.$t("message.HasLocked"), 1);
        } else {
          this.$confirm(this.$t("message.LockItUp"), this.$t("message.Title"), {
            confirmButtonText: this.$t("message.MakeSure"),
            cancelButtonText: this.$t("message.Cancel"),
            type: "warning"
          }).then(() => {
              this.fullscreenLoading = true;
              let par = {
                id: item.id
              };
              this.postAjax("/Account/Lock",par,(res)=>{
                  this.fullscreenLoading = false;
                  this.getList();
                  this.openErr(this.$t("message.LockUpSuccess"), 2);
                },(res)=>{
                  this.fullscreenLoading = false;
                }
              );
            }).catch(() => {});
        }
    },
    UnlockFn(item) {
        if (item.status != 2) {
          this.openErr(this.$t("message.HasUnLocked"), 1);
        } else {
          this.$confirm(this.$t("message.SureToUnlocking"),this.$t("message.Title"),{
              confirmButtonText: this.$t("message.MakeSure"),
              cancelButtonText: this.$t("message.Cancel"),
              type: "warning"
            }).then(() => {
              let par = {
                id: item.id
              };
              this.fullscreenLoading2 = true;
              this.postAjax("/Account/Unlock",par,(res)=>{
                  this.fullscreenLoading2 = false;
                  this.getList();
                  this.openErr(this.$t("message.UnlockSuccess"), 2);
                },(res)=>{
                  this.fullscreenLoading2 = false;
                }
              );
            }).catch(() => {});
        }
    }
  }
};
</script>
<style scoped>
.el-input {
  width: 200px;
}
</style>
