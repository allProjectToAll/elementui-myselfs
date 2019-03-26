<template>
    <div class="boss">
      <h2>充值管理</h2>
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
              <el-select v-model="status" :placeholder="$t('message.AllStatus')" @change="getList">
                <el-option value="1" :label="$t('message.AbnormalBill')"></el-option>
                <el-option value="2" :label="$t('message.Pending')"></el-option>
                <el-option value="3" :label="$t('message.Successed')"></el-option>
                <el-option value="4" :label="$t('message.ReachSafe')"></el-option>
                <el-option value="5" :label="$t('message.RechargeAbnormal')"></el-option>
                <el-option value="6" :label="$t('message.PledgeRedeem')"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="OneTime"
                type="datetimerange"
                :clearable="false"
                :editable="false"
                @change="DateChange"
                :default-value="new Date()"
                start-placeholder="开始日期"
                value-format="timestamp"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <el-button v-if="IsInArray(btnArray,1)" type="primary" @click="SureRecharge">{{$t('message.SureRecharge')}}</el-button>
          <el-button v-if="IsInArray(btnArray,2)" type="primary" @click="RePealRecharge">{{$t('message.RepealRecharge')}}</el-button>
          <el-button v-if="IsInArray(btnArray,3)" type="primary" @click="NoMatingRecharge">{{$t('message.NoMatching')}}</el-button>
          <el-button v-if="IsInArray(btnArray,4)" type="primary" @click="WasteMismatchRecharge">{{$t('message.WasteMismatch')}}</el-button>
        </div>

        <div  class="allTypeBox">
          <!-- 表格 v-loading.body="listLoading"-->
          <el-table ref="multipleTable" class="mytable" @row-click="rowClick"  stripe v-loading.body="listLoading" :data="list" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
            <el-table-column v-model="multipleSelection" type="selection" width="50">
            </el-table-column>
            <el-table-column align="left" :label="$t('message.RechargeTime')" width="">
              <template slot-scope="scope">
                <span>{{creatDay1(scope.row.createAt)}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('message.ReceivingTime')" width="">
              <template slot-scope="scope">
                <span>{{creatDay1(scope.row.confirmAt)}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('message.UserAccount')" width="">
              <template slot-scope="scope">
                <p>{{scope.row.email}}</p>
                <p>(+{{scope.row.phoneCode}}){{scope.row.phoneNumber}}</p>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('message.UserName')" width="">
              <template slot-scope="scope">
                <span>{{scope.row.userId}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('message.Currency')" width="">
              <template slot-scope="scope">
                <span>{{scope.row.currency}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('message.RechargeNum')" width="">
              <template slot-scope="scope">
                <span>{{scope.row.volume}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('message.SureTime')" width="">
              <template slot-scope="scope">
                <span>{{scope.row.confirmation}}/{{scope.row.confirmTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('message.Statu')" width="">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 1">{{$t('message.AbnormalBill')}}</span>
                <span v-if="scope.row.status == 2" style="color: #4E97F0">{{$t('message.Pending')}}</span>
                <span v-if="scope.row.status == 3">{{$t('message.Successed')}}</span>
                <span v-if="scope.row.status == 4">{{$t('message.ReachSafe')}}</span>
                <span v-if="scope.row.status == 5">{{$t('message.RechargeAbnormal')}}</span>
                <span v-if="scope.row.status == 6">{{$t('message.PledgeRedeem')}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" :label="$t('message.handle')" width="">
              <template slot-scope="scope">
                <!--<router-link tag="a" :to="scope.row.explorerUrl" target="_blank">{{$t('message.CheckTheDetail')}}</router-link>-->
                <a :href="scope.row.explorerUrl">{{$t('message.CheckTheDetail')}}</a>
              </template>
            </el-table-column>
          </el-table>
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
      <el-dialog :title="OpenTitle" :visible.sync="dialogFormVisible" width="500px">
        <el-form :model="SForm">
          <el-form-item label="ID" prop="id">
            <el-input v-model="SForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户Id"  prop="userId" v-if="userIdShow">
            <el-input v-model="SForm.userId"></el-input>
          </el-form-item>
          <el-form-item label="原因" prop="reason" v-if="ReasonShow">
              <el-input v-model="SForm.reason" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{$t('message.Cancel')}}</el-button>
          <el-button type="primary" @click="SureSubmit">{{$t('message.MakeSure')}}</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
  import axios from 'axios';
    export default {
      data(){
        return{
          InputString:'',
          list:[],// table的数组
          currencies:[],
          status: "2",
          listLoading:true,
          currPage:1,//当前页
          pageSize:10,//一页多少条数据
          totalItems: 0,
          totalPage:"",
          OneTime:[new Date().setHours(0, 0, 0, 0),new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1000)],
          postBaseUrl:'',
          CurrencyInfos:[],
          btnArray:[],
          multipleSelection:[],
          OpenTitle:'',
          SForm:{
            id:'',
            userId:'',
            reason:''
          },
          ReasonShow:false,
          dialogFormVisible:false,
          userIdShow:false,
        }
      },
      mounted(){
        this.getBtn();
      },
      created(){
        this.postBaseUrl = process.env.NODE_ENV ==='development' ?
          'http://192.168.125.231:8882' :
          'https://api.azex.io';
        this.getAddress();
      },
      methods:{
        creatDay1(day) {
          let date = new Date(day * 1000);
          let d = date.getFullYear() + "/" +
            ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "/" +
            (date.getDate() > 9 ? date.getDate() : ("0" + date.getDate())) + " " +
            (date.getHours() > 9 ? date.getHours() : ("0" + date.getHours())) + ":" +
            (date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes())) + ":" +
            (date.getSeconds() > 9 ? date.getSeconds() : ("0" + date.getSeconds()));
          return d;
        },

        getBtn(){
          let that = this;
          this.postAjax("/Deposit/Limits",null,function(res){
            that.btnArray = res.body.value;
          },function(res){
            console.log("路径错误");
            that.openErr(that.$t("message.ErrorToGetBtnLimit"), 1);
          })
        },
        getAddress(){
            axios.post(this.postBaseUrl + '/Currency/GetCurrencyAddressInfos').then((res)=>{
              this.CurrencyInfos = res.data.value;
              this.getConfirmatonInfos();
          })
            .catch((err)=>{

            })
        },
        getConfirmatonInfos(){
          axios.post(this.postBaseUrl + '/Currency/GetCurrencyConfirmatonInfos').then((res)=>{
            for(let i = 0;i<this.CurrencyInfos.length;i++){
              for (let j =0;j < res.data.value.length;j++){
                if(this.CurrencyInfos[i].id == res.data.value[j].id){
                  this.CurrencyInfos[i].confirmTime = res.data.value[j].confirmTime;
                  this.CurrencyInfos[i].safeTime = res.data.value[j].safeTime;
                }
              }
            }
            this.getList();
          })
            .catch((err)=>{

            })
        },
        getList(){
          var that = this;
          let par = {
            "pageIndex": this.currPage,//10
            "pageSize": this.pageSize,//(1-1)*10
            'beginTime': this.OneTime[0] / 1000,
            'endTime': this.OneTime[1] / 1000,
            "coinWithdrawlStatus":this.status,
            "queryText":this.InputString,
          };
          this.postAjax("/Deposit/GetPageList", par, function (res) {
            console.log(res,'list');
            for(let i =0;i<that.CurrencyInfos.length;i++){
              for (let j = 0;j < res.data.value.items.length;j++){
                if(res.data.value.items[j].currency == that.CurrencyInfos[i].id){
                  res.data.value.items[j].confirmTime = that.CurrencyInfos[i].confirmTime;
                  res.data.value.items[j].safeTime = that.CurrencyInfos[i].safeTime;
                  res.data.value.items[j].explorerUrl = that.CurrencyInfos[i].explorerUrl.replace('{txno}', res.data.value.items[j].txNo);
                }
              }
            }
            setTimeout(()=>{
              that.totalItems = res.body.value.totalItems;
              that.list = res.body.value.items;
              that.listLoading = false;
              that.openErr(that.$t("message.SuccessToGetList"), 2);
              console.log(that.list,'最后的list');
            },500);
          }, function (res) {
            console.log("路径错误");

          })
        },
        rowClick(row){
          let index = this.multipleSelection.indexOf(row);
          if (index<0) {
            this.multipleSelection = [];
            this.multipleSelection.push(row);
            this.$refs.multipleTable.toggleRowSelection(row,true);
          }else{
            this.multipleSelection.splice(index,1);
            this.$refs.multipleTable.toggleRowSelection(row,false);
          }
        },
        handleSizeChange(val){ //操作分页
          this.pageSize = val;//每页条数
          this.getList(); //重新请求一次
        },
        handleCurrentChange(val) {
          this.currPage = val; //当前页码
          this.getList();
        },
        DateChange(){
          this.getList();
        },
        SureRecharge(){
          if(this.multipleSelection.length>1){
            this.openErr( this.$t("message.onlyChoiseOneRevise"));
          }else if(this.multipleSelection.length == 0){
            this.openErr(this.$t("message.ChoiseTheResive"));
          }else{
            this.OpenTitle = this.$t("message.SureRecharge");
              this.dialogFormVisible = true;
            this.ReasonShow = false;
            this.userIdShow = false;
            this.SForm.id = this.multipleSelection[0].id;
          }
        },
        RePealRecharge(){
          if(this.multipleSelection.length>1){
            this.openErr( this.$t("message.onlyChoiseOneRevise"));
          }else if(this.multipleSelection.length == 0){
            this.openErr(this.$t("message.ChoiseTheResive"));
          }else{
            this.OpenTitle = this.$t("message.RepealRecharge");
            this.dialogFormVisible = true;
            this.userIdShow = false;
            this.ReasonShow = true;
            this.SForm.id = this.multipleSelection[0].id;
          }
        },
        NoMatingRecharge(){
          if(this.multipleSelection.length>1){
            this.openErr( this.$t("message.onlyChoiseOneRevise"));
          }else if(this.multipleSelection.length == 0){
            this.openErr(this.$t("message.ChoiseTheResive"));
          }else{
            this.OpenTitle = this.$t("message.NoMatching");
            this.dialogFormVisible = true;
            this.userIdShow = true;
            this.ReasonShow = false;
            this.SForm.id = this.multipleSelection[0].id;
          }
        },
        WasteMismatchRecharge(){
          if(this.multipleSelection.length>1){
            this.openErr( this.$t("message.onlyChoiseOneRevise"));
          }else if(this.multipleSelection.length == 0){
            this.openErr(this.$t("message.ChoiseTheResive"));
          }else{
            this.OpenTitle = this.$t("message.WasteMismatch");
            this.dialogFormVisible = true;
            this.userIdShow = false;
            this.ReasonShow = true;
            this.SForm.id = this.multipleSelection[0].id;
          }
        },
        SureSubmit(){
          if(this.OpenTitle === this.$t("message.SureRecharge")){
            this.postAjax('/Deposit/Confirm',this.SForm,(res)=>{
              this.dialogFormVisible = false;
              this.getList();
              this.openErr(this.$t("message.OperationSuccessful"), 2);
            },(err)=>{

            })
          }else if(this.OpenTitle === this.$t("message.RepealRecharge")){
            this.postAjax('/Deposit/Repeal',this.SForm,(res)=>{
              this.dialogFormVisible = false;
              this.getList();
              this.openErr(this.$t("message.OperationSuccessful"), 2);
            },(err)=>{

            })
          }else if(this.OpenTitle === this.$t("message.NoMatching")){
            this.postAjax('/Deposit/SpecialConfirm',this.SForm,(res)=>{
              this.dialogFormVisible = false;
              this.getList();
              this.openErr(this.$t("message.OperationSuccessful"), 2);
            },(err)=>{

            })
          }else if (this.OpenTitle === this.$t("message.WasteMismatch")) {
            this.postAjax('/Deposit/SpecialRepeal',this.SForm,(res)=>{
              this.dialogFormVisible = false;
              this.getList();
              this.openErr(this.$t("message.OperationSuccessful"), 2);
            },(err)=>{

            })
          }
        },
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
