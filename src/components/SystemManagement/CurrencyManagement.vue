<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.CurrencyManagement") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        <div class="box">
            <div class="allTypeBox">
                <el-button type="primary" v-if="IsInArray(btnArray,1)"  @click="addListFn">{{ $t("message.Added") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,2)"  @click="ReviseListFn">{{ $t("message.Revise") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,3)"  @click="LockcashFn">{{ $t("message.Lockcash") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,4)"  @click="UnLockcashFn">{{ $t("message.UnLockcash") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,7)"  @click="LockRechargeFn">{{ $t("message.LockRecharge") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,8)"  @click="UnLockRFn">{{ $t("message.UnLockRecharge") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,9)"  @click="CloseCurrencyFn">{{ $t("message.CloseCurrency") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,10)"  @click="OpenCurrencyFn">{{ $t("message.OpenCurrency") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,5)"  @click="BalanceReminderThresholdFn">{{ $t("message.BalanceReminderThreshold") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,6)"  @click="RemindingThresholdFn">{{ $t("message.RemindingThreshold") }}</el-button>
              <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>
            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                 <el-table ref="rowClick" @row-click="rowClick"  stripe @selection-change="handleSelectionChange" :data="list"
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column>

                  <el-table-column align="left" :label="$t('message.CurrencyId')" border width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                   <el-table-column align="left" :label="$t('message.RemindingThreshold')" width="">
                     <template slot-scope="scope">
                       <span>{{scope.row.depositNotifyline|scientific}}</span>
                     </template>
                   </el-table-column>
                   <el-table-column align="left" :label="$t('message.Withdraw')" width="">
                     <template slot-scope="scope">
                       <span>{{scope.row.withdrawlFixedfee|scientific}}</span>
                     </template>
                   </el-table-column>
                   <el-table-column align="left" label="提现审核线" width="">
                   <template slot-scope="scope">
                     <span>{{scope.row.withdrawlVerifyLine|scientific}}</span>
                   </template>
                 </el-table-column>
                   <el-table-column align="left" :label="$t('message.BalanceReminderThreshold')" width="">
                   <template slot-scope="scope">
                     <span>{{scope.row.balanceNotifyline|scientific}}</span>
                   </template>
                 </el-table-column>
                   <el-table-column align="left" :label="$t('message.Difficulty')" width="">
                     <template slot-scope="scope">
                       <span>{{scope.row.difficulty|scientific}}</span>
                     </template>
                   </el-table-column>

                   <el-table-column align="left" :label="$t('message.Height')" width="">
                     <template slot-scope="scope">
                       <span>{{scope.row.height|scientific}}</span>
                     </template>
                   </el-table-column>
                   <el-table-column align="left" :label="$t('message.ExplorerUrl')" width="">
                    <template slot-scope="scope">
                       <span>{{scope.row.explorerUrl}}</span>
                    </template>
                  </el-table-column>
                   <el-table-column align="left" :label="$t('message.isPingtaiCoin')" width="">
                     <template slot-scope="scope">
                       <span v-if="scope.row.isPlatform">{{$t('message.Y')}}</span>
                       <span v-if="!scope.row.isPlatform">{{$t('message.N')}}</span>
                     </template>

                   </el-table-column>
                   <el-table-column align="left"  :label="$t('message.handle')" width="130px">
                     <template slot-scope="scope">
                     <el-button size="small" type="primary" :disabled="scope.row.isPlatform" @click="SetFlat(scope.row)">{{$t('message.SetFlat')}}</el-button>
                     </template>
                   </el-table-column>
                     <el-table-column align="left"  :label="$t('message.CurrencyStatu')">
                       <template slot-scope="scope">
                          {{Binaryoperation(scope.row.status)}}
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
        <el-dialog :title="dialogTitle" :visible.sync="dialog.addDialogSync" class="myForm" width="100%" :before-close="resetForm" @close="Cancel('addRuleForm')">
            <el-form ref="addRuleForm" :model="dialogForm.addFieldForm" :rules="dialogFormRules" label-position="left" style="width: 900px" class="form-center">
              <div class="form-left">
                <el-form-item :label="$t('message.CurrencyId')" prop="id" label-width="165px" style="display: inline-block;">
                  <el-input v-model="dialogForm.addFieldForm.id" :disabled="IsAbled" label-width="200px" @change="fuzhi"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.RemindingThreshold')" prop="depositNotifyline" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.depositNotifyline"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.WithdrawlFixedfee')" prop="withdrawlFixedfee" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.withdrawlFixedfee"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.WithdrawlPrecision')" prop="withdrawlPrecision" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.withdrawlPrecision"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.ShowPrecision')" prop="showPrecision" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.showPrecision"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.addressFee')" prop="addressFee" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.addressFee"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.SafeTime')" prop="safeTime" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.safeTime"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.MortgageDiscount')" prop="mgDiscount" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.mgDiscount"><template slot="append">%</template></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.AssetId')" label-width="165px" v-show="isShow" style="display: inline-block;">
                  <el-input v-model="dialogForm.addFieldForm.assetId"></el-input>
                </el-form-item>
                <el-form-item  :label="$t('message.IsBasicCoin')" label-width="165px" v-show="isShow">
                  <el-checkbox v-model="dialogForm.addFieldForm.isBasicCoin"></el-checkbox>
                </el-form-item>
                <el-form-item  :label="$t('message.hasMemo')" label-width="165px" v-show="isShow">
                  <el-checkbox v-model="dialogForm.addFieldForm.hasMemo"></el-checkbox>
                </el-form-item>
              </div>
              <div class="form-right">
                <el-form-item :label="$t('message.BalanceReminderThreshold')" prop="balanceNotifyline" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.balanceNotifyline"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.DeductionDiscount')" prop="deductionDiscount" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.deductionDiscount"><template slot="append">%</template></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.WithdrawlOnceMin')" prop="withdrawlOnceMin" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.withdrawlOnceMin"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.WithdrawlVerifyLine')" prop="withdrawlVerifyLine" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.withdrawlVerifyLine"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.WithdrawlCurrency')" prop="withdrawlCurrency" label-width="165px" v-show="isShow">
                  <el-select v-model="dialogForm.addFieldForm.withdrawlCurrency" :placeholder="$t('message.PleaseChoise')" style="width: 200px">
                    <el-option :key=index v-for="(item,index) in CathSelect" :label="item.item" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>




                <el-form-item :label="$t('message.addressFeeCurrency')" prop="addressFeeCurrency" label-width="165px" v-show="isShow">
                  <el-select v-model="dialogForm.addFieldForm.addressFeeCurrency" :placeholder="$t('message.PleaseChoise')" style="width: 200px">
                    <el-option :key=index v-for="(item,index) in CathSelect" :label="item.item" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.ConfirmTime')" prop="confirmTime" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.confirmTime"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.ExplorerUrl')" prop="explorerUrl" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.explorerUrl"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.TotalCirculation')" prop="totalCirculation" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.totalCirculation"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.TradePointsRate')" prop="tradePointsRate" label-width="165px" v-show="isShow">
                  <el-input v-model="dialogForm.addFieldForm.tradePointsRate"><template slot="append">%</template></el-input>
                </el-form-item>
                <el-form-item  :label="$t('message.CanUsedMg')" label-width="165px" v-show="isShow">
                  <el-checkbox v-model="dialogForm.addFieldForm.canUsedMg"></el-checkbox>
                </el-form-item>
                <el-form-item :label="$t('message.Amount')" prop="amount" label-width="165px" v-show="isInform">
                  <el-input v-model="dialogForm.addFieldForm.amount"></el-input>
                </el-form-item>
              </div>
              <div class="dialog-footer" id="FooterButton" :style="{width: changeWidth}">
                <el-button @click="Cancel('addRuleForm')">{{ $t("message.Cancel") }}</el-button>
                <el-button v-if="addSync === 1" type="primary" @click="addSubmitForm('addRuleForm')" :element-loading-text="$t('message.Inprocessing')" v-loading.fullscreen.lock="fullscreenLoading">{{ $t("message.MakeSure") }}</el-button>
                <el-button v-if="addSync === 2" type="primary" @click="reviseSubmitForm('addRuleForm')" :element-loading-text="$t('message.Inprocessing')" v-loading.fullscreen.lock="fullscreenLoading">{{ $t("message.MakeSure") }}</el-button>
                <el-button v-if="addSync === 3" type="primary" @click="LockSubmitForm('addRuleForm')" :element-loading-text="$t('message.Inprocessing')"
                           v-loading.fullscreen.lock="fullscreenLoading">{{ $t("message.MakeSure") }}</el-button>
                <el-button v-if="addSync === 4" type="primary" @click="UnLockSubmitForm('addRuleForm')" :element-loading-text="$t('message.Inprocessing')"
                           v-loading.fullscreen.lock="fullscreenLoading">{{ $t("message.MakeSure") }}</el-button>
                <el-button v-if="addSync === 5" type="primary" @click="LockRechargeSubmitForm('addRuleForm')" :element-loading-text="$t('message.Inprocessing')"
                           v-loading.fullscreen.lock="fullscreenLoading">{{ $t("message.MakeSure") }}</el-button>
                <el-button v-if="addSync === 6" type="primary" @click="UnLockRechargeSubmitForm('addRuleForm')" :element-loading-text="$t('message.Inprocessing')"
                           v-loading.fullscreen.lock="fullscreenLoading">{{ $t("message.MakeSure") }}</el-button>
                <el-button v-if="addSync === 7" type="primary" @click="CloseCurrencySubmitForm('addRuleForm')" :element-loading-text="$t('message.Inprocessing')"
                           v-loading.fullscreen.lock="fullscreenLoading">{{ $t("message.MakeSure") }}</el-button>
                <el-button v-if="addSync === 8" type="primary" @click="OpenCurrencySubmitForm('addRuleForm')" :element-loading-text="$t('message.Inprocessing')"
                           v-loading.fullscreen.lock="fullscreenLoading">{{ $t("message.MakeSure") }}</el-button>
                <el-button v-if="addSync === 9" type="primary" @click="BalanceReminderThresholdSubmitForm('addRuleForm')" :element-loading-text="$t('message.Inprocessing')"
                           v-loading.fullscreen.lock="fullscreenLoading">{{ $t("message.MakeSure") }}</el-button>
                <el-button v-if="addSync === 10" type="primary" @click="RemindingThresholdSubmitForm('addRuleForm')" :element-loading-text="$t('message.Inprocessing')"
                           v-loading.fullscreen.lock="fullscreenLoading">{{ $t("message.MakeSure") }}</el-button>
              </div>
          </el-form>
        </el-dialog>

    </div>
</template>
<script>
  // import * as $ from 'jquery';

export default {
    data() {
             var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error( this.$t("message.PleaseEnterPassword")));
                } else {
                    if (this.ruleForm2.checkPass !== '') {
                        this.$refs.ruleForm2.validateField('checkPass');
                    }
                    callback();
                }
            };
        return {
            menuicon: 'getMenu',
            dialogTitle: this.$t("message.AddRole"),
            isShow: true,
            list:null,
            btnArray:[],
            fullscreenLoading:false,
            IsAbled: true,
            changeWidth: "",
            isInform:false,
            addSync:1,
            multipleSelection:[],//选中的表格数组
            listLoading:true,
            pagenation:{
                total:null,//总条目数
                currPage: 1,//当前页
                pageSize: 8,//一页显示个数
                type: null,//类型
            },
            dialog:{ //控制每个弹出框显示隐藏的
                addDialogSync:false,
            },
            dialogForm:{//控制每个弹出框字段的
                addFieldForm: {
                    id: "",
                    isBasicCoin: true,
                    assetId:"",
                    totalCirculation:	"",
                    balanceNotifyline:	"",
                    depositNotifyline:	"",
                    withdrawlFixedfee:	"",
                    withdrawlOnceMin:	"",
                    hasMemo:true,
                    withdrawlVerifyLine:	"",
                    withdrawlPrecision: "",
                    withdrawlCurrency:	"",
                    showPrecision:"",
                    confirmTime: "",
                    safeTime:"",
                    explorerUrl: "",
                    canUsedMg: true,
                    mgDiscount:"",
                    deductionDiscount:"",
                    tradePointsRate:"",
                    addressFee:"",
                    addressFeeCurrency:"",
                }
            },
          CathSelect:[],
            dialogFormRules:{
              id: [
                {required:true, message: this.$t("message.EnterTrueId"), trigger:'blur'},
              ],
              totalCirculation:[
                {required:true, message: this.$t("message.EnterTruetotalCirculation"), trigger:'blur'},
              ],
              depositNotifyline:[
                {required:true, message:this.$t("message.EnterTrueDepositNotifyline"), trigger:'blur'},
                ],
              withdrawlFixedfee:[
                {required:true, message: this.$t("message.EnterTrueWithdrawlFixedfee"),trigger:'blur'}
              ],
              withdrawlVerifyLine:[
                {required: true, message: this.$t("message.EnterTrueWithdrawlVerifyLine"),trigger: 'blur'}
              ],
              withdrawlPrecision:[
                {required:true,message: this.$t("message.EnterTrueWithdrawlPrecision"), trigger: 'blur'}
              ],
              showPrecision:[
                {required:true, message: this.$t("message.EnterTrueShowPrecision"), trigger: 'blur'}
              ],
              safeTime:[
                {required:true,message: this.$t("message.EnterTrueSafeTime"), trigger:'blur'}
              ],
              mgDiscount:[
                {required: true, message: this.$t("message.EnterTrueMgDiscount"), trigger: 'blur'}
              ],
              balanceNotifyline:[
                {required:true, message: this.$t("message.EnterTrueBalanceNotifyline"),trigger: 'blur'}
              ],

              withdrawlOnceMin:[
                {required:true, message: this.$t("message.EnterTrueWithdrawlOnceMin"),trigger: 'blur'}
              ],
              withdrawlCurrency:[
                {required:true, message: this.$t("message.PleaseChooseCurrency"),trigger: 'change'}
              ],
              deductionDiscount:[
                {required:true, message: this.$t("message.EnterTrueDeductionDiscount"),trigger: 'blur'}
              ],
              tradePointsRate:[
                {required:true, message: this.$t("message.EnterTrueTradePointsRate"),trigger: 'blur'}
              ],
              confirmTime:[
                {required:true, message: this.$t("message.EnterTrueConfirmTime"), trigger: 'blur'}
              ],
              amount:[
                {required:false, message:this.$t("message.EnterTrueAmount"),trigger:'blur'}
              ],
              explorerUrl:[
                {required: true, message: this.$t("message.EnterTrueExplorerUrl"), trigger: 'blur'}
              ],
              addressFeeCurrency:[
                {required: true, message: this.$t("message.EnteraddressFeeCurrency"), trigger: 'blur'}
              ],

            }
        }
    },

    created: function(){
        this.getList();
        this.getBtn();
      this.getCath();
    },
  mounted(){
    this.dialogForm.addFieldForm.withdrawlCurrency = "";
  },
    computed:{

    },
    methods:{
      fuzhi(){
        this.CathSelect[0].value = this.dialogForm.addFieldForm.id;
      },
      getCath(){
        let that = this;
        this.postAjax("/Currency/GetIdList",null,function(res){
                    for (let i = 0;i < res.body.value.length;i++){
            that.CathSelect.push({"item": res.body.value[i],"value":res.body.value[i]});
          }
          that.CathSelect.unshift({
            item: that.$t('message.NowCurrency'),
            value:"3"
          });
          console.log(that.CathSelect);
        },function(res){
          console.log("路径错误");
        })
      },
      rowClick(row){
        let index = this.multipleSelection.indexOf(row);
        if (index<0) {
          this.multipleSelection = [];
          this.multipleSelection.push(row);
          this.$refs.rowClick.toggleRowSelection(row,true);
        }else{
          this.multipleSelection.splice(index,1);
          this.$refs.rowClick.toggleRowSelection(row,false);
        }
      },
      getBtn(){
        let that = this;
        this.postAjax("/Currency/Limits",null,function(res){
          that.btnArray = res.body.value;
        },function(res){
          console.log("路径错误");
          that.openErr(that.$t("message.ErrorToGetBtnLimit"), 1);
        })
      },
      Binaryoperation(status){
        let mess="";
        if((status & 8) != 0){
          mess += this.$t('message.Close');
        }else {
          mess += this.$t('message.Opened');
        }
        if((status & 2) != 0){
          mess += this.$t('message.dMustNot')
        }
        if((status & 4) != 0){
          mess += this.$t('message.dMustNotRecharge');
        }
        if(status == 0){
          mess = this.$t('message.Unknown');
        }
        return mess;
      },
      SetFlat(row){
        this.postAjax('/Currency/SetPlatformCurrency',{
          id:row.id
        },(res)=>{
          setTimeout(()=>{
            this.getList();
          },300)
        },(err)=>{

        })
      },
        getList(){
            var that = this;
            let par = {
              "pageIndex": this.pagenation.currPage,//10
              "pageSize": this.pagenation.pageSize,//(1-1)*10
              "queryText": ""
            };
            this.postAjax("/Currency/GetList", par, function (res) {
              console.log(res);
              that.list = res.body.value.items;
              that.pagenation.total = res.body.value.totalItems;
              that.listLoading = false;
              that.openErr(that.$t("message.SuccessToGetList"), 2);
            }, function (res) {
              console.log("路径错误");

            })
        },
        handleSelectionChange(val) { //当选择项发生变化时会触发该事件
            this.multipleSelection = val;
            console.log( this.multipleSelection);
        },
        handleSizeChange(val){ //操作分页
            this.pagenation.pageSize = val;//每页条数
            this.getList(); //重新请求一次
        },
        handleCurrentChange(val) {
            this.pagenation.currPage = val; //当前页码
            this.getList();
        },
      Cancel(formName){
        this.isInform = false;
        this.dialog.addDialogSync = false;
        if (this.$refs[formName]!==undefined) {
          this.$refs[formName].resetFields();
        }
        this.resetForm();
      },
      resetForm(){
        for (let k in this.dialogForm.addFieldForm){
          this.dialogForm.addFieldForm[k] = "";
        }
        this.dialogForm.addFieldForm.isBasicCoin = true;
        this.dialogForm.addFieldForm.canUsedMg = true;
        this.dialogForm.addFieldForm.hasMemo = true;
        this.dialog.addDialogSync = false;
        // done();
        // window.location.reload();
      },
      reviseWidth(){
        let myForm = document.getElementsByClassName('myForm')[0];
        // myForm.style.textAlign = 'right';
        // document.getElementsByClassName('dialog-footer')[0].style.width = '500px';
        // console.log(myForm.children[0]);
        // // console.log($("body").height())

        if(this.addSync == 1|| this.addSync == 2 || this.addSync == 9 || this.addSync == 10){
          myForm.style.width = '100%';
          myForm.children[0].style.width = '1000px';
          myForm.style.margin = 'auto';
          myForm.style.overflow = 'auto';
          myForm.style.height = '100%';
          this.changeWidth = '900px'
        } else {
          myForm.style.width = '500px';
          myForm.children[0].style.width = '500px';
          myForm.style.margin = 'auto';
          myForm.style.overflow = 'hidden';
          this.changeWidth = '410px';
        }
      },
      scientificToNumber(num) {//解决科学记数法的问题
        var str = num.toString();
        var reg = /^(\d+)(e)([\-]?\d+)$/;
        var arr, len,
          zero = '';
        if (!reg.test(str)) {
          return num;
        } else {
          /*6e-7 需要手动转换*/
          arr = reg.exec(str);
          len = Math.abs(arr[3]) - 1;
          for (var i = 0; i < len; i++) {
            zero += '0';
          }

          return '0.' + zero + arr[1];
        }
      },
        addListFn(){
            this.addSync = 1;
            this.reviseWidth();
            this.IsAbled = false;
            this.isShow = true;
            this.isInform = false;
            this.dialogTitle = this.$t("message.AddCurrency");
            this.dialog.addDialogSync = true;
            this.dialogForm.addFieldForm = {
              id: "",
              isBasicCoin: true,
              assetId:"",
              totalCirculation:	"",
              balanceNotifyline:	"",
              depositNotifyline:	"",
              withdrawlFixedfee:	"",
              withdrawlOnceMin:	"",
              hasMemo:true,
              withdrawlVerifyLine:	"",
              withdrawlPrecision: "",
              withdrawlCurrency:	"",
              showPrecision:"",
              confirmTime: "",
              safeTime:"",
              explorerUrl: "",
              canUsedMg: true,
              mgDiscount:"",
              deductionDiscount:"",
              tradePointsRate:"",
              addressFee:"",
              addressFeeCurrency:"",
          }
        },
      ReviseListFn(){
          this.addSync = 2;
        this.reviseWidth();
        this.IsAbled = true;
        this.isShow = true;
        this.isInform = false;
          if(this.multipleSelection.length>1){
            this.openErr( this.$t("message.onlyChoiseOneRevise"));
          }else if(this.multipleSelection.length == 0){
            this.openErr(this.$t("message.ChoiseTheResive"));
          }else{
            this.dialogTitle = this.$t("message.RevisePermission");
            this.dialog.addDialogSync = true;
            this.dialogForm.addFieldForm={
              id:this.multipleSelection[0].id + "",
              isBasicCoin: this.multipleSelection[0].isBasicCoin,
              assetId:this.multipleSelection[0].assetId + "",
              totalCirculation:	this.scientificToNumber(this.multipleSelection[0].totalCirculation),
              balanceNotifyline:	this.scientificToNumber(this.multipleSelection[0].balanceNotifyline),
              depositNotifyline:	this.scientificToNumber(this.multipleSelection[0].depositNotifyline),
              withdrawlFixedfee:	this.scientificToNumber(this.multipleSelection[0].withdrawlFixedfee),
              withdrawlOnceMin:	this.scientificToNumber(this.multipleSelection[0].withdrawlOnceMin),
              withdrawlVerifyLine:	this.scientificToNumber(this.multipleSelection[0].withdrawlVerifyLine),
              withdrawlPrecision: this.scientificToNumber(this.multipleSelection[0].withdrawlPrecision),
              withdrawlCurrency:	this.multipleSelection[0].withdrawlCurrency?this.multipleSelection[0].withdrawlCurrency + "":"",
              showPrecision: this.scientificToNumber(this.multipleSelection[0].showPrecision),
              confirmTime: this.scientificToNumber(this.multipleSelection[0].confirmTime),
              safeTime: this.scientificToNumber(this.multipleSelection[0].safeTime),
              explorerUrl: this.multipleSelection[0].explorerUrl + "",
              canUsedMg: this.multipleSelection[0].canUsedMg,
              mgDiscount:this.scientificToNumber(this.multipleSelection[0].mgDiscount * 100),
              hasMemo:this.multipleSelection[0].hasMemo,
              deductionDiscount:this.scientificToNumber(this.multipleSelection[0].deductionDiscount * 100),
              peerCount: this.scientificToNumber(this.multipleSelection[0].peerCount),
              tradePointsRate:this.scientificToNumber(this.multipleSelection[0].tradePointsRate * 100),
              addressFee:this.scientificToNumber(this.multipleSelection[0].addressFee * 100),
              addressFeeCurrency:this.multipleSelection[0].addressFeeCurrency
            }
            this.CathSelect[0].value = this.dialogForm.addFieldForm.id;
            console.log(this.dialogForm.addFieldForm.withdrawlCurrency);
            console.log(this.dialogForm.addFieldForm.addressFeeCurrency,this.CathSelect);
          }
      },
      LockcashFn(){
        this.addSync = 3;
        this.reviseWidth();
        this.IsAbled = true;
        this.isShow = false;
        this.isInform = false;
        if(this.multipleSelection.length>1){
          this.openErr( this.$t("message.onlyChoiseOneRevise"));
        }else if(this.multipleSelection.length==0){
          this.openErr(this.$t("message.ChoiseOneControl"));
        }else {
          if((this.multipleSelection[0].status & 2) !=0){
              this.openErr("该币种已锁定提现");
          }else{
            this.dialogTitle = "确定锁定吗？";
            this.dialog.addDialogSync = true;
            this.dialogForm.addFieldForm = {
              id: this.multipleSelection[0].id,
            };
            this.dialogFormRules = {
              id: [
                {required:true, message: this.$t("message.EnterTrueId"), trigger:'blur'},
              ],
              totalCirculation:[
                {required:false, message: this.$t("message.EnterTruetotalCirculation"), trigger:'blur'},
              ],
              depositNotifyline:[
                {required:false, message:this.$t("message.EnterTrueDepositNotifyline"), trigger:'blur'},
              ],
              withdrawlFixedfee:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlFixedfee"),trigger:'blur'}
              ],
              withdrawlVerifyLine:[
                {required: false, message: this.$t("message.EnterTrueWithdrawlVerifyLine"),trigger: 'blur'}
              ],
              withdrawlPrecision:[
                {required:false,message: this.$t("message.EnterTrueWithdrawlPrecision"), trigger: 'blur'}
              ],
              showPrecision:[
                {required:false, message: this.$t("message.EnterTrueShowPrecision"), trigger: 'blur'}
              ],
              safeTime:[
                {required:false,message: this.$t("message.EnterTrueSafeTime"), trigger:'blur'}
              ],
              coldBalance:[
                {required:false,message: this.$t("message.EnterTrueColdBalance"), trigger: 'blur'}
              ],
              mgDiscount:[
                {required: false, message: this.$t("message.EnterTrueMgDiscount"), trigger: 'blur'}
              ],
              balanceNotifyline:[
                {required:false, message: this.$t("message.EnterTrueBalanceNotifyline"),trigger: 'blur'}
              ],
              withdrawlOnceMin:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlOnceMin"),trigger: 'blur'}
              ],
              withdrawlCurrency:[
                {required:false, message: this.$t("message.PleaseChoise"),trigger: 'change'}
              ],
              deductionDiscount:[
                {required:false, message: this.$t("message.EnterTrueDeductionDiscount"),trigger: 'blur'}
              ],
              tradePointsRate:[
                {required:false, message: this.$t("message.EnterTrueTradePointsRate"),trigger: 'blur'}
              ],
              confirmTime:[
                {required:false, message: this.$t("message.EnterTrueConfirmTime"), trigger: 'blur'}
              ],
              amount:[
                {required:false, message:this.$t("message.EnterTrueAmount"),trigger:'blur'}
              ],
              hotBalance:[
                {required:false, message:this.$t("message.EnterTrueHotBalance"), trigger:'blur'}
              ],
              explorerUrl:[
                {required: false, message: this.$t("message.EnterTrueExplorerUrl"), trigger: 'blur'}
              ]

            }
          }
        }
      },
      UnLockcashFn(){

        this.addSync = 4;
        this.reviseWidth();
        this.IsAbled = true;
        this.isShow = false;
        this.isInform = false;
        this.dialogTitle = "确定要解锁吗？";
        if(this.multipleSelection.length>1){
          this.openErr( this.$t("message.onlyChoiseOneRevise"));
        }else if(this.multipleSelection.length==0){
          this.openErr(this.$t("message.ChoiseOneControl"));
        }else {
          if((this.multipleSelection[0].status & 2) == 0){
              this.openErr("该币种已解锁提现");
          }else{
            this.dialog.addDialogSync = true;
            this.dialogForm.addFieldForm = {
              id: this.multipleSelection[0].id,
            };
            this.dialogFormRules = {
              id: [
                {required:true, message: this.$t("message.EnterTrueId"), trigger:'blur'},
              ],

              totalCirculation:[
                {required:false, message: this.$t("message.EnterTruetotalCirculation"), trigger:'blur'},
              ],
              depositNotifyline:[
                {required:false, message:this.$t("message.EnterTrueDepositNotifyline"), trigger:'blur'},
              ],
              withdrawlFixedfee:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlFixedfee"),trigger:'blur'}
              ],
              withdrawlVerifyLine:[
                {required: false, message: this.$t("message.EnterTrueWithdrawlVerifyLine"),trigger: 'blur'}
              ],
              withdrawlPrecision:[
                {required:false,message: this.$t("message.EnterTrueWithdrawlPrecision"), trigger: 'blur'}
              ],
              showPrecision:[
                {required:false, message: this.$t("message.EnterTrueShowPrecision"), trigger: 'blur'}
              ],
              safeTime:[
                {required:false,message: this.$t("message.EnterTrueSafeTime"), trigger:'blur'}
              ],
              coldBalance:[
                {required:false,message: this.$t("message.EnterTrueColdBalance"), trigger: 'blur'}
              ],
              mgDiscount:[
                {required: false, message: this.$t("message.EnterTrueMgDiscount"), trigger: 'blur'}
              ],
              balanceNotifyline:[
                {required:false, message: this.$t("message.EnterTrueBalanceNotifyline"),trigger: 'blur'}
              ],

              withdrawlOnceMin:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlOnceMin"),trigger: 'blur'}
              ],
              withdrawlCurrency:[
                {required:false, message: this.$t("message.PleaseChoise"),trigger: 'change'}
              ],
              deductionDiscount:[
                {required:false, message: this.$t("message.EnterTrueDeductionDiscount"),trigger: 'blur'}
              ],
              tradePointsRate:[
                {required:false, message: this.$t("message.EnterTrueTradePointsRate"),trigger: 'blur'}
              ],
              confirmTime:[
                {required:false, message: this.$t("message.EnterTrueConfirmTime"), trigger: 'blur'}
              ],
              amount:[
                {required:false, message:this.$t("message.EnterTrueAmount"),trigger:'blur'}
              ],
              hotBalance:[
                {required:false, message:this.$t("message.EnterTrueHotBalance"), trigger:'blur'}
              ],
              explorerUrl:[
                {required: false, message: this.$t("message.EnterTrueExplorerUrl"), trigger: 'blur'}
              ]

            }
          }
        }
      },
      LockRechargeFn(){
        this.addSync = 5;
        this.reviseWidth();
        this.IsAbled = true;
        this.isShow = false;
        this.isInform = false;
        this.dialogTitle = "确定要锁定充值吗？";
        if(this.multipleSelection.length>1){
          this.openErr( this.$t("message.onlyChoiseOneRevise"));
        }else if(this.multipleSelection.length==0){
          this.openErr(this.$t("message.ChoiseOneControl"));
        }else {
          if((this.multipleSelection[0].status & 4) != 0){
              this.openErr("该币种已锁定充值");
          }else{
            this.dialog.addDialogSync = true;
            this.dialogForm.addFieldForm = {
              id: this.multipleSelection[0].id,
            };
            this.dialogFormRules = {
              id: [
                {required:true, message: this.$t("message.EnterTrueId"), trigger:'blur'},
              ],
              totalCirculation:[
                {required:false, message: this.$t("message.EnterTruetotalCirculation"), trigger:'blur'},
              ],
              depositNotifyline:[
                {required:false, message:this.$t("message.EnterTrueDepositNotifyline"), trigger:'blur'},
              ],
              withdrawlFixedfee:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlFixedfee"),trigger:'blur'}
              ],
              withdrawlVerifyLine:[
                {required: false, message: this.$t("message.EnterTrueWithdrawlVerifyLine"),trigger: 'blur'}
              ],
              withdrawlPrecision:[
                {required:false,message: this.$t("message.EnterTrueWithdrawlPrecision"), trigger: 'blur'}
              ],
              showPrecision:[
                {required:false, message: this.$t("message.EnterTrueShowPrecision"), trigger: 'blur'}
              ],
              safeTime:[
                {required:false,message: this.$t("message.EnterTrueSafeTime"), trigger:'blur'}
              ],
              mgDiscount:[
                {required: false, message: this.$t("message.EnterTrueMgDiscount"), trigger: 'blur'}
              ],
              balanceNotifyline:[
                {required:false, message: this.$t("message.EnterTrueBalanceNotifyline"),trigger: 'blur'}
              ],

              withdrawlOnceMin:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlOnceMin"),trigger: 'blur'}
              ],
              withdrawlCurrency:[
                {required:false, message: this.$t("message.PleaseChoise"),trigger: 'change'}
              ],
              deductionDiscount:[
                {required:false, message: this.$t("message.EnterTrueDeductionDiscount"),trigger: 'blur'}
              ],
              tradePointsRate:[
                {required:false, message: this.$t("message.EnterTrueTradePointsRate"),trigger: 'blur'}
              ],
              confirmTime:[
                {required:false, message: this.$t("message.EnterTrueConfirmTime"), trigger: 'blur'}
              ],
              amount:[
                {required:false, message:this.$t("message.EnterTrueAmount"),trigger:'blur'}
              ],
              explorerUrl:[
                {required: false, message: this.$t("message.EnterTrueExplorerUrl"), trigger: 'blur'}
              ]

            }
          }
        }

      },
      UnLockRFn(){
        this.addSync = 6;
        this.reviseWidth();
        this.IsAbled = true;
        this.isShow = false;
        this.isInform = false;
        this.dialogTitle = "确定要解锁充值吗？";
        if(this.multipleSelection.length>1){
          this.openErr( this.$t("message.onlyChoiseOneRevise"));
        }else if(this.multipleSelection.length==0){
          this.openErr(this.$t("message.ChoiseOneControl"));
        }else {
          if((this.multipleSelection[0].status & 4) == 0){
              this.openErr("该币种解锁充值");
          }else{
            this.dialog.addDialogSync = true;
            this.dialogForm.addFieldForm = {
              id: this.multipleSelection[0].id,
            };
            this.dialogFormRules = {
              id: [
                {required:true, message: this.$t("message.EnterTrueId"), trigger:'blur'},
              ],
              totalCirculation:[
                {required:false, message: this.$t("message.EnterTruetotalCirculation"), trigger:'blur'},
              ],
              depositNotifyline:[
                {required:false, message:this.$t("message.EnterTrueDepositNotifyline"), trigger:'blur'},
              ],
              withdrawlFixedfee:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlFixedfee"),trigger:'blur'}
              ],
              withdrawlVerifyLine:[
                {required: false, message: this.$t("message.EnterTrueWithdrawlVerifyLine"),trigger: 'blur'}
              ],
              withdrawlPrecision:[
                {required:false,message: this.$t("message.EnterTrueWithdrawlPrecision"), trigger: 'blur'}
              ],
              showPrecision:[
                {required:false, message: this.$t("message.EnterTrueShowPrecision"), trigger: 'blur'}
              ],
              safeTime:[
                {required:false,message: this.$t("message.EnterTrueSafeTime"), trigger:'blur'}
              ],
              coldBalance:[
                {required:false,message: this.$t("message.EnterTrueColdBalance"), trigger: 'blur'}
              ],
              mgDiscount:[
                {required: false, message: this.$t("message.EnterTrueMgDiscount"), trigger: 'blur'}
              ],
              balanceNotifyline:[
                {required:false, message: this.$t("message.EnterTrueBalanceNotifyline"),trigger: 'blur'}
              ],

              withdrawlOnceMin:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlOnceMin"),trigger: 'blur'}
              ],
              withdrawlCurrency:[
                {required:false, message: this.$t("message.PleaseChoise"),trigger: 'change'}
              ],
              deductionDiscount:[
                {required:false, message: this.$t("message.EnterTrueDeductionDiscount"),trigger: 'blur'}
              ],
              tradePointsRate:[
                {required:false, message: this.$t("message.EnterTrueTradePointsRate"),trigger: 'blur'}
              ],
              confirmTime:[
                {required:false, message: this.$t("message.EnterTrueConfirmTime"), trigger: 'blur'}
              ],
              amount:[
                {required:false, message:this.$t("message.EnterTrueAmount"),trigger:'blur'}
              ],

              explorerUrl:[
                {required: false, message: this.$t("message.EnterTrueExplorerUrl"), trigger: 'blur'}
              ]

            }
          }
        }

      },
      CloseCurrencyFn(){

        this.addSync = 7;
        this.reviseWidth();
        this.IsAbled = true;
        this.isShow = false;
        this.isInform = false;
        this.dialogTitle = "确定要关闭币种吗？";
        if(this.multipleSelection.length>1){
          this.openErr( this.$t("message.onlyChoiseOneRevise"));
        }else if(this.multipleSelection.length==0){
          this.openErr(this.$t("message.ChoiseOneControl"));
        }else {
          if((this.multipleSelection[0].status & 8) != 0){
              this.openErr("该币种已关闭");
          }else{
            this.dialog.addDialogSync = true;
            this.dialogForm.addFieldForm = {
              id: this.multipleSelection[0].id,
            };
            this.dialogFormRules = {
              id: [
                {required:true, message: this.$t("message.EnterTrueId"), trigger:'blur'},
              ],
              totalCirculation:[
                {required:false, message: this.$t("message.EnterTruetotalCirculation"), trigger:'blur'},
              ],
              depositNotifyline:[
                {required:false, message:this.$t("message.EnterTrueDepositNotifyline"), trigger:'blur'},
              ],
              withdrawlFixedfee:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlFixedfee"),trigger:'blur'}
              ],
              withdrawlVerifyLine:[
                {required: false, message: this.$t("message.EnterTrueWithdrawlVerifyLine"),trigger: 'blur'}
              ],
              withdrawlPrecision:[
                {required:false,message: this.$t("message.EnterTrueWithdrawlPrecision"), trigger: 'blur'}
              ],
              showPrecision:[
                {required:false, message: this.$t("message.EnterTrueShowPrecision"), trigger: 'blur'}
              ],
              safeTime:[
                {required:false,message: this.$t("message.EnterTrueSafeTime"), trigger:'blur'}
              ],
              mgDiscount:[
                {required: false, message: this.$t("message.EnterTrueMgDiscount"), trigger: 'blur'}
              ],
              balanceNotifyline:[
                {required:false, message: this.$t("message.EnterTrueBalanceNotifyline"),trigger: 'blur'}
              ],

              withdrawlOnceMin:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlOnceMin"),trigger: 'blur'}
              ],
              withdrawlCurrency:[
                {required:false, message: this.$t("message.PleaseChoise"),trigger: 'change'}
              ],
              deductionDiscount:[
                {required:false, message: this.$t("message.EnterTrueDeductionDiscount"),trigger: 'blur'}
              ],
              tradePointsRate:[
                {required:false, message: this.$t("message.EnterTrueTradePointsRate"),trigger: 'blur'}
              ],
              confirmTime:[
                {required:false, message: this.$t("message.EnterTrueConfirmTime"), trigger: 'blur'}
              ],
              amount:[
                {required:false, message:this.$t("message.EnterTrueAmount"),trigger:'blur'}
              ],

              explorerUrl:[
                {required: false, message: this.$t("message.EnterTrueExplorerUrl"), trigger: 'blur'}
              ]

            }
          }
        }

      },
      OpenCurrencyFn(){

        this.addSync = 8;
        this.reviseWidth();

        if(this.multipleSelection.length>1){
          this.openErr( this.$t("message.onlyChoiseOneRevise"));
        }else if(this.multipleSelection.length==0){
          this.openErr(this.$t("message.ChoiseOneControl"));
        }else {
          if((this.multipleSelection[0].status & 8) == 0){
              this.openErr("该币种已开放");
          }else{
            this.IsAbled = true;
            this.isShow = false;
            this.isInform = false;
            this.dialogTitle = "确定要打开币种吗？";
            this.dialog.addDialogSync = true;
            this.dialogForm.addFieldForm = {
              id: this.multipleSelection[0].id,
            };
            this.dialogFormRules = {
              id: [
                {required:true, message: this.$t("message.EnterTrueId"), trigger:'blur'},
              ],

              totalCirculation:[
                {required:false, message: this.$t("message.EnterTruetotalCirculation"), trigger:'blur'},
              ],
              depositNotifyline:[
                {required:false, message:this.$t("message.EnterTrueDepositNotifyline"), trigger:'blur'},
              ],
              withdrawlFixedfee:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlFixedfee"),trigger:'blur'}
              ],
              withdrawlVerifyLine:[
                {required: false, message: this.$t("message.EnterTrueWithdrawlVerifyLine"),trigger: 'blur'}
              ],
              withdrawlPrecision:[
                {required:false,message: this.$t("message.EnterTrueWithdrawlPrecision"), trigger: 'blur'}
              ],
              showPrecision:[
                {required:false, message: this.$t("message.EnterTrueShowPrecision"), trigger: 'blur'}
              ],
              safeTime:[
                {required:false,message: this.$t("message.EnterTrueSafeTime"), trigger:'blur'}
              ],

              mgDiscount:[
                {required: false, message: this.$t("message.EnterTrueMgDiscount"), trigger: 'blur'}
              ],
              balanceNotifyline:[
                {required:false, message: this.$t("message.EnterTrueBalanceNotifyline"),trigger: 'blur'}
              ],
              withdrawlOnceMin:[
                {required:false, message: this.$t("message.EnterTrueWithdrawlOnceMin"),trigger: 'blur'}
              ],
              withdrawlCurrency:[
                {required:false, message: this.$t("message.PleaseChoise"),trigger: 'change'}
              ],
              deductionDiscount:[
                {required:false, message: this.$t("message.EnterTrueDeductionDiscount"),trigger: 'blur'}
              ],
              tradePointsRate:[
                {required:false, message: this.$t("message.EnterTrueTradePointsRate"),trigger: 'blur'}
              ],
              confirmTime:[
                {required:false, message: this.$t("message.EnterTrueConfirmTime"), trigger: 'blur'}
              ],
              amount:[
                {required:false, message:this.$t("message.EnterTrueAmount"),trigger:'blur'}
              ],
              explorerUrl:[
                {required: false, message: this.$t("message.EnterTrueExplorerUrl"), trigger: 'blur'}
              ]

            }
          }
        }

      },
      BalanceReminderThresholdFn(){

        this.addSync = 9;
        this.reviseWidth();
        this.IsAbled = true;
        this.isShow = false;
        this.isInform = true;
        this.dialogTitle = "修改余额通知金额？";
        if(this.multipleSelection.length>1){
          this.openErr( this.$t("message.onlyChoiseOneRevise"));
        }else if(this.multipleSelection.length==0){
          this.openErr(this.$t("message.ChoiseOneControl"));
        }else {
          this.dialog.addDialogSync = true;
          this.dialogForm.addFieldForm = {
            id: this.multipleSelection[0].id,
            amount:this.multipleSelection[0].balanceNotifyline + ""
          };
          this.dialogFormRules = {
            id: [
              {required:true, message: this.$t("message.EnterTrueId"), trigger:'blur'},
            ],

            totalCirculation:[
              {required:false, message: this.$t("message.EnterTruetotalCirculation"), trigger:'blur'},
            ],
            depositNotifyline:[
              {required:false, message:this.$t("message.EnterTrueDepositNotifyline"), trigger:'blur'},
            ],
            withdrawlFixedfee:[
              {required:false, message: this.$t("message.EnterTrueWithdrawlFixedfee"),trigger:'blur'}
            ],
            withdrawlVerifyLine:[
              {required: false, message: this.$t("message.EnterTrueWithdrawlVerifyLine"),trigger: 'blur'}
            ],
            withdrawlPrecision:[
              {required:false,message: this.$t("message.EnterTrueWithdrawlPrecision"), trigger: 'blur'}
            ],
            showPrecision:[
              {required:false, message: this.$t("message.EnterTrueShowPrecision"), trigger: 'blur'}
            ],
            safeTime:[
              {required:false,message: this.$t("message.EnterTrueSafeTime"), trigger:'blur'}
            ],
            mgDiscount:[
              {required: false, message: this.$t("message.EnterTrueMgDiscount"), trigger: 'blur'}
            ],
            difficulty:[
              {required: false, message: this.$t("message.EnterTrueDifficulty"), trigger: 'blur'}
            ],
            balanceNotifyline:[
              {required:false, message: this.$t("message.EnterTrueBalanceNotifyline"),trigger: 'blur'}
            ],

            withdrawlOnceMin:[
              {required:false, message: this.$t("message.EnterTrueWithdrawlOnceMin"),trigger: 'blur'}
            ],
            withdrawlCurrency:[
              {required:false, message: this.$t("message.PleaseChoise"),trigger: 'change'}
            ],
            deductionDiscount:[
              {required:false, message: this.$t("message.EnterTrueDeductionDiscount"),trigger: 'blur'}
            ],
            tradePointsRate:[
              {required:false, message: this.$t("message.EnterTrueTradePointsRate"),trigger: 'blur'}
            ],
            height: [
              { required: false, message: this.$t("message.EnterTrueHeight"), trigger: 'blur' },
            ],
            confirmTime:[
              {required:false, message: this.$t("message.EnterTrueConfirmTime"), trigger: 'blur'}
            ],
            amount:[
              {required:true, message:this.$t("message.EnterTrueAmount"),trigger:'blur'}
            ],

            explorerUrl:[
              {required: false, message: this.$t("message.EnterTrueExplorerUrl"), trigger: 'blur'}
            ]

          }
        }

      },
      RemindingThresholdFn(){

        this.addSync = 10;
        this.reviseWidth();
        this.IsAbled = true;
        this.isShow = false;
        this.isInform = true;
        this.dialogTitle = "修改充值通知金额？";
        if(this.multipleSelection.length>1){
          this.openErr( this.$t("message.onlyChoiseOneRevise"));
        }else if(this.multipleSelection.length==0){
          this.openErr(this.$t("message.ChoiseOneControl"));
        }else {
          this.dialog.addDialogSync = true;
          this.dialogForm.addFieldForm = {
            id: this.multipleSelection[0].id,
            amount:this.multipleSelection[0].depositNotifyline + ""
          };
          this.dialogFormRules = {
            id: [
              {required:true, message: this.$t("message.EnterTrueId"), trigger:'blur'},
            ],

            totalCirculation:[
              {required:false, message: this.$t("message.EnterTruetotalCirculation"), trigger:'blur'},
            ],
            depositNotifyline:[
              {required:false, message:this.$t("message.EnterTrueDepositNotifyline"), trigger:'blur'},
            ],
            withdrawlFixedfee:[
              {required:false, message: this.$t("message.EnterTrueWithdrawlFixedfee"),trigger:'blur'}
            ],
            withdrawlVerifyLine:[
              {required: false, message: this.$t("message.EnterTrueWithdrawlVerifyLine"),trigger: 'blur'}
            ],
            withdrawlPrecision:[
              {required:false,message: this.$t("message.EnterTrueWithdrawlPrecision"), trigger: 'blur'}
            ],
            showPrecision:[
              {required:false, message: this.$t("message.EnterTrueShowPrecision"), trigger: 'blur'}
            ],
            safeTime:[
              {required:false,message: this.$t("message.EnterTrueSafeTime"), trigger:'blur'}
            ],
            mgDiscount:[
              {required: false, message: this.$t("message.EnterTrueMgDiscount"), trigger: 'blur'}
            ],
            balanceNotifyline:[
              {required:false, message: this.$t("message.EnterTrueBalanceNotifyline"),trigger: 'blur'}
            ],

            withdrawlOnceMin:[
              {required:false, message: this.$t("message.EnterTrueWithdrawlOnceMin"),trigger: 'blur'}
            ],
            withdrawlCurrency:[
              {required:false, message: this.$t("message.PleaseChoise"),trigger: 'change'}
            ],
            deductionDiscount:[
              {required:false, message: this.$t("message.EnterTrueDeductionDiscount"),trigger: 'blur'}
            ],
            tradePointsRate:[
              {required:false, message: this.$t("message.EnterTrueTradePointsRate"),trigger: 'blur'}
            ],
            confirmTime:[
              {required:false, message: this.$t("message.EnterTrueConfirmTime"), trigger: 'blur'}
            ],
            amount:[
              {required:true, message:this.$t("message.EnterTrueAmount"),trigger:'blur'}
            ],

            explorerUrl:[
              {required: false, message: this.$t("message.EnterTrueExplorerUrl"), trigger: 'blur'}
            ]

          }
        }

      },
        addSubmitForm(formName){
            let that=this;
          this.dialogFormRules = {
            id: [
              {required:true, message: this.$t("message.EnterTrueId"), trigger:'blur'},
            ],
            totalCirculation:[
              {required:true, message: this.$t("message.EnterTruetotalCirculation"), trigger:'blur'},
            ],
            depositNotifyline:[
              {required:true, message:this.$t("message.EnterTrueDepositNotifyline"), trigger:'blur'},
            ],
            withdrawlFixedfee:[
              {required:true, message: this.$t("message.EnterTrueWithdrawlFixedfee"),trigger:'blur'}
            ],
            withdrawlVerifyLine:[
              {required: true, message: this.$t("message.EnterTrueWithdrawlVerifyLine"),trigger: 'blur'}
            ],
            withdrawlPrecision:[
              {required:true,message: this.$t("message.EnterTrueWithdrawlPrecision"), trigger: 'blur'}
            ],
            showPrecision:[
              {required:true, message: this.$t("message.EnterTrueShowPrecision"), trigger: 'blur'}
            ],
            safeTime:[
              {required:true,message: this.$t("message.EnterTrueSafeTime"), trigger:'blur'}
            ],
            mgDiscount:[
              {required: true, message: this.$t("message.EnterTrueMgDiscount"), trigger: 'blur'}
            ],
            difficulty:[
              {required: true, message: this.$t("message.EnterTrueDifficulty"), trigger: 'blur'}
            ],
            balanceNotifyline:[
              {required:true, message: this.$t("message.EnterTrueBalanceNotifyline"),trigger: 'blur'}
            ],
            withdrawlOnceMin:[
              {required:true, message: this.$t("message.EnterTrueWithdrawlOnceMin"),trigger: 'blur'}
            ],
            withdrawlCurrency:[
              {required:true, message: this.$t("message.PleaseChoise"),trigger: 'change'}
            ],
            deductionDiscount:[
              {required:true, message: this.$t("message.EnterTrueDeductionDiscount"),trigger: 'blur'}
            ],
            tradePointsRate:[
              {required:true, message: this.$t("message.EnterTrueTradePointsRate"),trigger: 'blur'}
            ],
            height: [
              { required: true, message: this.$t("message.EnterTrueHeight"), trigger: 'blur' },
            ],
            confirmTime:[
              {required:true, message: this.$t("message.EnterTrueConfirmTime"), trigger: 'blur'}
            ],
            amount:[
              {required:false, message:this.$t("message.EnterTrueAmount"),trigger:'blur'}
            ],
            explorerUrl:[
              {required: true, message: this.$t("message.EnterTrueExplorerUrl"), trigger: 'blur'}
            ],
            addressFeeCurrency:[
              {required: true, message: this.$t("message.EnteraddressFeeCurrency"), trigger: 'blur'}
            ],
          }
            this.$refs[formName].validate((valid) => {
                  if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    this.dialogForm.addFieldForm.mgDiscount = this.dialogForm.addFieldForm.mgDiscount / 100;
                    this.dialogForm.addFieldForm.deductionDiscount = this.dialogForm.addFieldForm.deductionDiscount / 100;
                    this.dialogForm.addFieldForm.tradePointsRate = this.dialogForm.addFieldForm.tradePointsRate / 100;
                    this.postAjax("/Currency/Add",this.dialogForm.addFieldForm,function(res){
                        that.openErr(that.$t("message.AddSuccess"));
                        that.dialog.addDialogSync = false;
                      that.fullscreenLoading = false;
                      that.getList();
                    },function(res){
                      that.dialogForm.addFieldForm.mgDiscount = that.dialogForm.addFieldForm.mgDiscount * 100;
                      that.dialogForm.addFieldForm.deductionDiscount = that.dialogForm.addFieldForm.deductionDiscount * 100;
                      that.dialogForm.addFieldForm.tradePointsRate = that.dialogForm.addFieldForm.tradePointsRate * 100;
                        console.log("路径错误");
                      that.fullscreenLoading = false;
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
      reviseSubmitForm(formName){
        let that = this;
        this.dialogFormRules = {
          id: [
            {required:true, message: this.$t("message.EnterTrueId"), trigger:'blur'},
          ],
          totalCirculation:[
            {required:true, message: this.$t("message.EnterTruetotalCirculation"), trigger:'blur'},
          ],
          depositNotifyline:[
            {required:true, message:this.$t("message.EnterTrueDepositNotifyline"), trigger:'blur'},
          ],
          withdrawlFixedfee:[
            {required:true, message: this.$t("message.EnterTrueWithdrawlFixedfee"),trigger:'blur'}
          ],
          withdrawlVerifyLine:[
            {required: true, message: this.$t("message.EnterTrueWithdrawlVerifyLine"),trigger: 'blur'}
          ],
          withdrawlPrecision:[
            {required:true,message: this.$t("message.EnterTrueWithdrawlPrecision"), trigger: 'blur'}
          ],
          showPrecision:[
            {required:true, message: this.$t("message.EnterTrueShowPrecision"), trigger: 'blur'}
          ],
          safeTime:[
            {required:true,message: this.$t("message.EnterTrueSafeTime"), trigger:'blur'}
          ],
          mgDiscount:[
            {required: true, message: this.$t("message.EnterTrueMgDiscount"), trigger: 'blur'}
          ],
          balanceNotifyline:[
            {required:true, message: this.$t("message.EnterTrueBalanceNotifyline"),trigger: 'blur'}
          ],
          withdrawlOnceMin:[
            {required:true, message: this.$t("message.EnterTrueWithdrawlOnceMin"),trigger: 'blur'}
          ],
          withdrawlCurrency:[
            {required:true, message: this.$t("message.PleaseChoise"),trigger: 'change'}
          ],
          deductionDiscount:[
            {required:true, message: this.$t("message.EnterTrueDeductionDiscount"),trigger: 'blur'}
          ],
          tradePointsRate:[
            {required:true, message: this.$t("message.EnterTrueTradePointsRate"),trigger: 'blur'}
          ],
          confirmTime:[
            {required:true, message: this.$t("message.EnterTrueConfirmTime"), trigger: 'blur'}
          ],
          amount:[
            {required:false, message:this.$t("message.EnterTrueAmount"),trigger:'blur'}
          ],
          explorerUrl:[
            {required: true, message: this.$t("message.EnterTrueExplorerUrl"), trigger: 'blur'}
          ],
           addressFeeCurrency:[
              {required: true, message: this.$t("message.EnteraddressFeeCurrency"), trigger: 'blur'}
            ],

        }
        this.$refs[formName].validate((valid) => {
          if (valid) {//正则验证成功
            that.fullscreenLoading = true;
            this.dialogForm.addFieldForm.mgDiscount = this.dialogForm.addFieldForm.mgDiscount / 100;
            this.dialogForm.addFieldForm.deductionDiscount = this.dialogForm.addFieldForm.deductionDiscount / 100;
            this.dialogForm.addFieldForm.tradePointsRate = this.dialogForm.addFieldForm.tradePointsRate / 100;
            this.postAjax("/Currency/Update",this.dialogForm.addFieldForm,function(res){
              that.openErr(that.$t("message.ServiceSuccess"), 2);
              that.dialog.addDialogSync = false;
              that.fullscreenLoading = false;
              that.getList();
            },function(res){
              that.dialogForm.addFieldForm.mgDiscount = that.dialogForm.addFieldForm.mgDiscount * 100;
              that.dialogForm.addFieldForm.deductionDiscount = that.dialogForm.addFieldForm.deductionDiscount * 100;
              that.dialogForm.addFieldForm.tradePointsRate = that.dialogForm.addFieldForm.tradePointsRate * 100;
              console.log("路径错误");
              that.fullscreenLoading = false;
            }).then(function () {
              that.$refs[formName].resetFields();
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      LockSubmitForm(formName){
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {//正则验证成功
            that.fullscreenLoading = true;
            this.postAjax("/Currency/LockWithdrawl",this.dialogForm.addFieldForm,function(res){
              that.openErr(that.$t("message.ServiceSuccess"), 2);
              that.dialog.addDialogSync = false;
              that.fullscreenLoading = false;
              setTimeout(()=>{
                that.getList();
              },100);
            },function(res){
              console.log("路径错误");
              that.fullscreenLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      UnLockSubmitForm(formName){
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {//正则验证成功
            that.fullscreenLoading = true;
            this.postAjax("/Currency/UnlockWithdrawl",this.dialogForm.addFieldForm,function(res){
              that.openErr(that.$t("message.ServiceSuccess"), 2);
              that.dialog.addDialogSync = false;
              that.fullscreenLoading = false;
              that.getList();
            },function(res){
              console.log("路径错误");
              that.fullscreenLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      LockRechargeSubmitForm(formName){
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {//正则验证成功
            that.fullscreenLoading = true;
            this.postAjax("/Currency/LockDeposit",this.dialogForm.addFieldForm,function(res){
              that.openErr(that.$t("message.ServiceSuccess"), 2);
              that.dialog.addDialogSync = false;
              that.fullscreenLoading = false;
              that.getList();
            },function(res){
              console.log("路径错误");
              that.fullscreenLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      UnLockRechargeSubmitForm(formName){
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {//正则验证成功
            that.fullscreenLoading = true;
            this.postAjax("/Currency/UnlockDeposit",this.dialogForm.addFieldForm,function(res){
              that.openErr(that.$t("message.ServiceSuccess"), 2);
              that.fullscreenLoading = false;
              that.dialog.addDialogSync = false;
              that.getList();
            },function(res){
              console.log("路径错误");
              that.fullscreenLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      CloseCurrencySubmitForm(formName){
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {//正则验证成功
            that.fullscreenLoading = true;
            this.postAjax("/Currency/Close",this.dialogForm.addFieldForm,function(res){
              that.openErr(that.$t("message.ServiceSuccess"),2);
              that.fullscreenLoading = false;
              that.dialog.addDialogSync = false;
              that.getList();
            },function(res){
              console.log("路径错误");
              that.fullscreenLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      OpenCurrencySubmitForm(formName){
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {//正则验证成功
            that.fullscreenLoading = true;
            this.postAjax("/Currency/Open",this.dialogForm.addFieldForm,function(res){
              that.openErr(that.$t("message.ServiceSuccess"),2);
              that.fullscreenLoading = false;
              that.dialog.addDialogSync = false;
              that.getList();
            },function(res){
              console.log("路径错误");
              that.fullscreenLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 余额提醒门槛
      BalanceReminderThresholdSubmitForm(formName){
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {//正则验证成功
            that.fullscreenLoading = true;
            this.postAjax("/Currency/UpdateBalanceNotifyLine",this.dialogForm.addFieldForm,function(res){
              that.openErr(that.$t("message.ServiceSuccess"),2);
              that.fullscreenLoading = false;
              that.dialog.addDialogSync = false;
              that.getList();
            },function(res){
              console.log("路径错误");
              that.fullscreenLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        this.isInforBbalance = false;
      },
      RemindingThresholdSubmitForm(formName){
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {//正则验证成功
            that.fullscreenLoading = true;
            this.postAjax("/Currency/UpdateDepositNotifyLine",this.dialogForm.addFieldForm,function(res){
              that.openErr(that.$t("message.ServiceSuccess"), 2);
              that.fullscreenLoading = false;
              that.dialog.addDialogSync = false;
              that.getList();
            },function(res){
              console.log("路径错误");
              that.fullscreenLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        this.isInforRecharge = false;
      },

    }
}
</script>
<style scoped>
.el-input {
    width: 200px;
}
.el-form{
  width: 1000px;
}
.el-dialog .el-form{
  width: 900px;
}
.form-center{
  text-align: center;
}

  .form-left{
    width:45%;
    display: inline-block;
    vertical-align: top;
    /*padding-left:1rem;*/
    /*padding-right:1rem;*/
    /*padding-top:1rem;*/
    text-align: left;
  }
  .form-right{
    width:50%;
    display: inline-block;
    text-align: left;
    vertical-align: top;
    /*padding-left:1rem;*/
    /*padding-right:1rem;*/
    /*padding-top:1rem;*/
  }
  .dialog-footer{
    text-align: right;
    margin-right: 95px;
  }
</style>
