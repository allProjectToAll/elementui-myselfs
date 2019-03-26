<template>
  <div id="listContain"  class="app-container">
    <h2>{{$t('message.CashManagement')}}</h2>
    <div class="clear"></div>
    <div class="box" style="padding-top:20px;">
      <div class="allTypeBox">
        <el-form :inline="true" class="demo-form-inline" label-width="80px">
          <el-form-item>
            <el-input v-model="InputString" :placeholder="$t('message.InputNameOrPhoneOrEmail')"  style="width:260px;"></el-input>
          </el-form-item>
          <el-form-item style="margin-top:-10px;">
            <el-button type="primary" @click="getList">{{$t('message.Search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-select v-model="SelectCurrency" filterable :placeholder="$t('message.AllCurrencies')">
              <el-option :key=index v-for="(item,index) in currencies" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="status" :placeholder="$t('message.AllStatus')" @change="getList">
              <el-option value="1" :label="$t('message.GetDownTo')"></el-option>
              <el-option value="2" :label="$t('message.Pending')"></el-option>
              <el-option value="3" :label="$t('message.CurrencyMonitorIsProcessing')"></el-option>
              <el-option value="4" :label="$t('message.ReviewPass')"></el-option>
              <el-option value="5" :label="$t('message.CreateErr')"></el-option>
              <el-option value="6" :label="$t('message.DealFailed')"></el-option>
              <el-option value="7" :label="$t('message.RefuseReview')"></el-option>
              <el-option value="8" :label="$t('message.UserRevocation')"></el-option>
              <el-option value="9" :label="$t('message.UnknowStatus')"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div  class="allTypeBox">
        <!-- 表格 v-loading.body="listLoading"-->
        <el-table ref="multipleTable" class="mytable"  stripe v-loading.body="listLoading" :data="list" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
          <!-- <el-table-column v-model="multipleSelection" type="selection" width="50">
          </el-table-column> -->
          <el-table-column align="left" :label="$t('message.submissionTime')" width="">
            <template slot-scope="scope">
              <span>{{scope.row.createdAt}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" :label="$t('message.AuditTime')" width="">
            <template slot-scope="scope">
              <span v-if="scope.row.status == (4 || 7)">{{scope.row.doneAt}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>

          <el-table-column align="left" :label="$t('message.UserName')" width="">
            <template slot-scope="scope">
              <span>{{scope.row.nickName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" :label="$t('message.UserPhoneNum')" width="">
            <template slot-scope="scope">
              <span>{{scope.row.phoneNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" :label="$t('message.UserEmail')" width="">
            <template slot-scope="scope">
              <span>{{scope.row.email}}</span>
            </template>
          </el-table-column>

          <el-table-column align="left" :label="$t('message.Currency')" width="">
            <template slot-scope="scope">
              <span>{{scope.row.currency}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" :label="$t('message.Statu')" width="">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">{{$t('message.GetDownTo')}}</span>
              <span v-if="scope.row.status == 2" style="color: #4E97F0">{{$t('message.Pending')}}</span>
              <span v-if="scope.row.status == 3">{{$t('message.CurrencyMonitorIsProcessing')}}</span>
              <span v-if="scope.row.status == 4">{{$t('message.ReviewPass')}}</span>
              <span v-if="scope.row.status == 5">{{$t('message.CreateErr')}}</span>
              <span v-if="scope.row.status == 6">{{$t('message.DealFailed')}}</span>
              <span v-if="scope.row.status == 7">{{$t('message.WithdrawalCancel')}}</span>
              <span v-if="scope.row.status == 8">{{$t('message.UnknowStatus')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" :label="$t('message.handle')" width="" v-if="status == 2">
            <template slot-scope="scope">
              <el-button @click="open(scope.row)">{{$t('message.audit')}}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="left" :label="$t('message.handle')" width="" v-if="status == 8">
            <template slot-scope="scope">
              <el-button @click="ForcedRetry(scope.row.id)">{{$t('message.retry')}}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="left" :label="$t('message.Reviewer')" width="" v-if="status == (0||1||3||4||5||6||7)">
            <template slot-scope="scope">
              <span>{{scope.row.managerName}}</span>
            </template>
          </el-table-column>
        </el-table>

        <!--弹窗-->
        <el-dialog :title="$t('message.ReviewMessage')" :visible.sync="DialogShow" width="370px" center class="my-dialog">
          <div style="width: 235px;text-align: left">{{$t('message.MonetaryValue')}}<span>{{volume}} {{currency}}</span></div>
          <div style="width: 235px;text-align: left;margin-top: 16px">{{$t('message.HandlingFee')}}<span>{{fee}} {{feeCurrency}}</span></div>
          <div style="width: 235px;text-align: left;margin-top: 62px">{{currency}}{{$t('message.AmountWallet')}}<span>{{WalletCurrency}} {{currency}}</span></div>
          <div style="width: 235px;text-align: left;margin-top: 16px">{{currency}}{{$t('message.SystemAmount')}}<span>{{SystemCurrency}} {{currency}}</span></div>
          <div v-if="HaveRisk" style="color: #CC3431;width: 235px;margin-top: 23px">{{$t('message.HaveRisk')}}</div>
          <div v-if="!HaveRisk" style="color: #078C1C;width: 235px;margin-top: 23px">{{$t('message.SafePass')}}</div>
          <div slot="footer" class="dialog-footer" >
            <el-button :element-loading-text="$t('message.Inprocessing')"
                       v-loading.fullscreen.lock="fullscreenLoading" v-if="async1"
                       @click="pass()" style="width: 128px;margin-right: 20px" >{{$t('message.Pass')}}</el-button>
            <el-button :element-loading-text="$t('message.Inprocessing')"
                       v-loading.fullscreen.lock="fullscreenLoading" v-if="async2"
                       @click="refuse()" style="width: 128px" >{{$t('message.Refuse')}}</el-button>
          </div>

        </el-dialog>

        <el-dialog :title="$t('message.PassShenqing')" :close="DanPassClose" :visible.sync="KuangShow" width="370px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">

          <div class="gaicha"></div>
          <div class="con" style="margin: 40px 0 0 40px;font-size:14px;color: #555">
            <img class="iconImg" src="../../../static/icon/az-icon-information-.png">
            {{$t('message.IsPass')}}
          </div>
          <div class="footer-btn">
            <el-button @click="DanPassClose" style="margin-right: 20px;" >{{$t('message.Cancel')}}</el-button>
            <el-button @click="DangerousPass" >{{$t('message.MakeSure')}}</el-button>
          </div>
        </el-dialog>
        <!-- 分页 -->
        <div v-show="!listLoading">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="currPage"  :page-sizes="[8,10,15, 20]" :page-size="pageSize"
                         :total="totalItems"
                         layout="total, sizes, prev, pager, next, jumper" >
          </el-pagination>
        </div>
      </div>
    </div>

    <!--<button :disabled="item.async==1?false:true"></button>-->



  </div>
</template>

<script>
    export default {
        data(){
          return{
            InputString:"",
            SelectCurrency:"",
            totalItems:0,
            list:[],// table的数组
            currencies:[],
            status: "2",
            listLoading:true,
            currPage:1,//当前页
            pageSize:10,//一页多少条数据
            totalPage:"",
            btnArray:[],
            async1:false,
            async2:false,
            DialogShow:false,
            fullscreenLoading:false,
            currency: "",//弹框
            volume:"",
            fee:"",//手续费
            feeCurrency:"", //手续费币种
            SystemCurrency:"", // 系统币
            WalletCurrency:"", // 钱包币
            HaveRisk: false,// 有无风险
            id:"",
            KuangShow:false,

          }
        },
      created(){
        this.getList();
        this.getBtn();
        this.getCath();
      },
      methods:{
        open(row){
          var that = this;
          this.currency = row.currency;
          this.fee = row.fee;
          this.feeCurrency = row.feeCurrency;
          this.volume = row.volume;
          this.id = row.id;
          console.log(row);
          this.postAjax("/Report/GetSystemCoinAmount", {currency:this.currency},function (res) {
            that.SystemCurrency = res.body.value.amount;
          },function (err) {
            console.log(err);
          });
          this.postAjax("/Report/GetWalletCoinAmount", {currency:this.currency},function (res) {
            that.WalletCurrency = res.body.value.amount;
          },function (err) {
            console.log(err);
          });
          setTimeout(()=>{
            if((this.WalletCurrency - this.SystemCurrency) / this.WalletCurrency >= 0.01){
              this.HaveRisk = false;
              console.log(111);
            }else {
              this.HaveRisk = true;
            }
          },150);
          var timer = setInterval(()=>{
            if(!this.DialogShow){
              clearInterval(timer);
              return;
            }
            this.postAjax("/Report/GetSystemCoinAmount", {currency:this.currency},function (res) {
              that.SystemCurrency = res.body.value.amount;
            },function (err) {
              console.log(err);
            });
            this.postAjax("/Report/GetWalletCoinAmount", {currency:this.currency},function (res) {
              that.WalletCurrency = res.body.value.amount;
            },function (err) {
              console.log(err);
            });
            setTimeout(()=>{
              if((this.WalletCurrency - this.SystemCurrency) / this.WalletCurrency >= 0.01){
                this.HaveRisk = false;
                console.log(111);
              }else {
                this.HaveRisk = true;
              }
            },150);

          },3000);


          this.DialogShow = true;
        },
        getList(){
          var that = this;
          that.listLoading = true;
          let par = {
            "pageIndex": this.currPage,//10
            "pageSize": this.pageSize,//(1-1)*10
            "currency": this.SelectCurrency,
            "coinWithdrawlStatus":this.status,
            "queryText":this.InputString,
          };
          this.postAjax("/Withdrawl/GetPageList", par, function (res) {
            that.totalItems = res.body.value.totalItems;
            for(let i = 0;i < res.body.value.items.length;i++){
              res.body.value.items[i].createdAt = that.creatDay(res.body.value.items[i].createdAt);
              res.body.value.items[i].doneAt = that.creatDay(res.body.value.items[i].doneAt);
            }
            that.list = res.body.value.items;
            that.listLoading = false;
            that.openErr(that.$t("message.SuccessToGetList"), 2);

          }, function (res) {
            console.log("路径错误");
          })
        },
        getCath(){
          let that = this;
          this.postAjax("/Currency/GetIdList",null,function(res){
              that.currencies = res.body.value;
          },function(res){
            console.log("路径错误");
          })
        },
        DanPassClose(){
          this.KuangShow = false;
          this.DialogShow = true
        },
        getBtn(){
          let that = this;
          this.postAjax("/Withdrawl/Limits",null,function(res){
            that.async1 =that.IsInArray(res.body.value,"1");
            that.async2 =that.IsInArray(res.body.value,"2");
          },function(res){
            console.log("路径错误");
            that.openErr(that.$t("message.ErrorToGetBtnLimit"), 1);
          })
        },
        DangerousPass(){
          var that = this;
          this.postAjax("/Withdrawl/Accept",{id:that.id},function(res){
            that.openErr(that.$t("message.OperationSuccessful"), 2);
            that.KuangShow = false;
            setTimeout(()=>{
              that.getList();
            },300)
          },function(res){
            console.log(res);
          })
        },
        pass(){
          let that = this;
          if(this.HaveRisk){
            this.KuangShow = true;
            this.DialogShow = false;
            return
          }
          this.postAjax("/Withdrawl/Accept",{id:that.id},function(res){
            that.openErr(that.$t("message.OperationSuccessful"), 2);
            that.DialogShow = false;
            setTimeout(()=>{
              that.getList();
            },300)
          },function(res){
            console.log(res);
          })
        },
        refuse(index){
          let that = this;
          this.postAjax("/Withdrawl/Reject",{id:that.id},function(res){
            that.openErr(that.$t("message.OperationSuccessful"), 2);
            that.DialogShow = false;
            setTimeout(()=>{
              that.getList();
            },300)
          },function(res){
            console.log(res);
          })
        },
        handleSizeChange(val){ //操作分页
          this.pageSize = val;//每页条数
          this.getList(); //重新请求一次
        },
        handleCurrentChange(val) {
          this.currPage = val; //当前页码
          this.getList();
        },
        //强制重试
        ForcedRetry(id){
          let that = this;
          this.postAjax('/Withdrawl/ForceRetry',{id:id},function (res) {
            setTimeout(()=>{
              that.getList();
            },300)
          },function (err) {
            console.log(err);
          })
        }
      }
    }
</script>
<style>
  .mytable .el-table th>.cell{
    color: rgba(153,153,153,1);
  }
</style>

<style scoped>
.mytable{
  /*font-size: 12px;*/
  font-family: PingFangSC-Regular;
  color:rgba(51,51,51,1);
}
  /*.mytable span{*/
  .dialog-footer{
    text-align: center;
  }
  .my-dialog{
    /*position: relative;*/
  }
  .my-dialog div{
    margin: 0 auto;
  }
.my-dialog div span{
  float: right;
}
.iconImg{
  width: 30px;
  position: absolute;
  left: -45px;
}
.con{
  position: relative;
  line-height: 30px;
}
.footer-btn{
  margin-top: 54px;
  text-align: center;
}
.footer-btn button{
  width: 128px;
}
.gaicha{

}
  /*}*/
</style>
