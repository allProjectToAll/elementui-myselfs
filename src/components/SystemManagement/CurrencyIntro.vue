<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.currencyIntro") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        
        <div class="box">
            <div class="allTypeBox" style="margin-top:30px;">
                <el-form :inline="true" class="demo-form-inline" label-width="80px">
                    <el-form-item :label="$t('message.Currency')">
                        <el-select v-model="Cath">
                            <el-option :label="$t('message.PleaseChoise')" value=""></el-option>
                            <el-option :key=index v-for="(item,index) in CathSelect" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('message.Languages')">
                        <el-select v-model="Lang">
                            <el-option :label="$t('message.PleaseChoise')" value=""></el-option>
                            <el-option :key=index v-for="(item,index) in langSelect" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item style="margin-top:-10px;">
                        <el-button type="primary" icon="el-icon-search" @click="getList"></el-button>
                    </el-form-item>
                    
                </el-form>
            </div>
            <div class="allTypeBox">
                <el-button type="primary"  v-if="IsInArray(btnArray,1)"  @click="addFn">{{ $t("message.Added") }}</el-button>
                

               <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>

            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"   @selection-change="handleSelectionChange"-->
                <el-table ref="rowClick" @row-click="rowClick"   stripe :data="list" 
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <!-- <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column> -->
                    <el-table-column align="left" :label="$t('message.Languages')" width="">
                        <template slot-scope="scope">
                            <span>{{$store.state.lang[scope.row.lang]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Name')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Currency')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.currency}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.briefDetail')" width="" height="80">
                        <template slot-scope="scope">
                            <span v-html="scope.row.intro"></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.releaseTime')" width="">
                        <template slot-scope="scope">
                            <span>{{creatDay(scope.row.releaseTime)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.total')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.total}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.turnover')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.turnover}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.costAsUsd')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.cost}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.official')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.official}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.whitePaper')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.whitePaper}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.explorerUrl')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.explorerUrl}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="left" :label="$t('message.TelegramLink')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.groupLink}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.handle')" width="150">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary"  v-if="IsInArray(btnArray,2)"  @click="editFn(scope.row)">{{ $t("message.Revise") }}</el-button>
                            <el-button size="small" type="danger"  v-if="IsInArray(btnArray,3)"  @click="deletFn(scope.row)">{{ $t("message.Delet") }}</el-button>
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

        <!-- 添加-->
        <el-dialog :title="dialogTitle" :visible.sync="dialog.addDialogSync" width="900px">
            <el-form ref="addRuleForm" class="small-space" :rules="dialogFormRules" :model="dialogForm.addFieldForm" label-position="left" label-width="90px">
                <table style="width:100%;">
                    <tr>
                        <td>
                            <el-form-item :label="$t('message.Languages')" prop="lang">
                                <el-select v-model="dialogForm.addFieldForm.lang" :disabled="disableds">
                                    <el-option :label="$t('message.PleaseChoise')" value=""></el-option>
                                    <el-option :key=index v-for="(item,index) in langSelect" :label="item.text" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item :label="$t('message.Name')" prop="name">
                                <el-input v-model="dialogForm.addFieldForm.name"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <el-form-item :label="$t('message.briefDetail')" prop="intro" style="height:250px;">
                                <quill-editor ref="myTextEditor" v-model="dialogForm.addFieldForm.intro" :config="editorOption" style="height:150px;"></quill-editor>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-form-item :label="$t('message.Currency')" prop="currency">
                                <el-select v-model="dialogForm.addFieldForm.currency" :disabled="disableds">
                                    <el-option :label="$t('message.PleaseChoise')" value=""></el-option>
                                    <el-option :key=index v-for="(item,index) in CathSelect" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item :label="$t('message.releaseTime')" prop="releaseTime">
                                 <el-date-picker v-model="dialogForm.addFieldForm.releaseTime" type="datetime" ></el-date-picker>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-form-item :label="$t('message.total')" prop="total">
                                <el-input v-model="dialogForm.addFieldForm.total"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item :label="$t('message.turnover')" prop="turnover">
                                <el-input v-model="dialogForm.addFieldForm.turnover"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-form-item :label="$t('message.costAsUsd')" prop="cost">
                                <el-input v-model="dialogForm.addFieldForm.cost"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item :label="$t('message.official')" prop="official">
                                <el-input v-model="dialogForm.addFieldForm.official"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-form-item :label="$t('message.whitePaper')" prop="whitePaper">
                                <el-input v-model="dialogForm.addFieldForm.whitePaper"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item :label="$t('message.explorerUrl')" prop="explorerUrl">
                                <el-input v-model="dialogForm.addFieldForm.explorerUrl"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-form-item :label="$t('message.TelegramLink')" prop="groupLink">
                                <el-input v-model="dialogForm.addFieldForm.groupLink"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                </table>
            </el-form>
            <div slot="footer" class="dialog-footer"><!-- dialog.addDialogSync = false -->
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
    return {
      disableds:false,
      editorOption:{},
      dialogTitle:"",
      bigImgSrc: "",
      isExamAsyn: false,
      langSelect:[],
      addSync:false,
      Lang:"",
      Cath:"",
      CathSelect:[],
      list: null,
      multipleSelection: [], //选中的表格数组
      listLoading: true,
      fullscreenLoading: false,
      btnArray: [],
      pagenation: {
        total: null, //总条目数
        currPage: 1, //当前页
        pageSize: 8, //一页显示个数
        title: "",
        type: null //类型
      },
      dialog: {
        addDialogSync: false
      },
      dialogForm:{
          addFieldForm:{
              lang:"",
              name:"",//
              currency:"",//
              intro:"",//
              releaseTime:"",
              total:"",//
              turnover:"",//
              cost:"",
              official:"",
              whitePaper:"",
              explorerUrl:"",
              groupLink:"",
          }
      },
      dialogFormRules:{
            lang: [
                { required: true, message: this.$t("message.ChioseLang"), trigger: 'blur' },
            ],
            name: [
                { required: true, message: this.$t("message.PleaseEnterName"), trigger: 'blur' },
            ],
            currency: [
                { required: true, message: this.$t("message.PleaseChooseCurrency"), trigger: 'blur' },
            ],
            intro: [
                { required: true, message: this.$t("message.pleaseEnterintro"), trigger: 'blur' },
            ],
            total: [
                { required: true, message: this.$t("message.pleaseEntertotal"), trigger: 'blur' },
            ],
            turnover: [
                { required: true, message: this.$t("message.pleaseEnterturnover"), trigger: 'blur' },
            ],
            releaseTime:[
                { required: true, message: this.$t("message.pleaseEnterreleaseTime"), trigger: 'blur' },
            ],
            cost:[
                { required: true, message: this.$t("message.PleasecostAsUsd"), trigger: 'blur' },
            ],
        }
    };
  },
  created: function() {
    this.getList();
    this.getBtn();
    this.getCath();
    this.getLanguage();
  },
  computed: {},
  methods: {
    getList() {
      var that = this;
      let par = {
        pageIndex: this.pagenation.currPage, //10
        pageSize: this.pagenation.pageSize, //(1-1)*10
        "lang": this.Lang?this.Lang:0,
        "currency": this.Cath,
      };
      this.postAjax("/CurrencyIntro/GetPageList",par,function(res) {
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
      this.postAjax("/CurrencyIntro/Limits",null,function(res) {
          that.btnArray = res.body.value;
        },function(res) {
          console.log("路径错误");
          that.openErr(that.$t("message.ErrorToGetBtnLimit"), 1);
        }
      );
    },
    getLanguage(){
        var that = this;
        let par = {
            "includeDefault": false
        };
            this.postAjax("/Lang/GetOptions",par,function(res){
            that.langSelect = res.body.value;
        },function(res){
            console.log("路径错误");
        })
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
      console.log(val);
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
    getCath() {//获取币种
      let that = this;
      this.postAjax("/Currency/GetIdList",null,function(res) {
          that.CathSelect = res.body.value;
        },function(res) {
          console.log("路径错误");
        }
      );
    },
    cancel(formName){
        this.dialog.addDialogSync = false;
        if (this.$refs[formName]!==undefined) {
            this.$refs[formName].resetFields();
        }
    },
    addFn(){
        this.disableds = false;
        this.addSync = true;
        this.dialog.addDialogSync = true;
        this.dialogTitle = this.$t("message.Added");
        this.dialogForm.addFieldForm ={
              lang:"",
              name:"",//
              currency:"",//
              intro:"",//
              releaseTime:"",
              total:"",//
              turnover:"",//
              cost:"",
              official:"",
              whitePaper:"",
              explorerUrl:"",
              groupLink:"",
          }
    },
    editFn(item){ 
        this.disableds = true;
        console.log(item);
        let param = Object.assign(this.dialogForm.addFieldForm,item,{"releaseTime":item.releaseTime*1000});
        this.addSync = false;
        this.dialog.addDialogSync = true;
        this.dialogTitle = this.$t("message.Revise");
    },
    deletFn(item){
        console.log(item);
         this.$confirm(this.$t("message.SureToDelet"), this.$t("message.Title"), {
            confirmButtonText: this.$t("message.MakeSure"),
            cancelButtonText:  this.$t("message.Cancel"),
            type: 'warning'
        }).then(() => {
            this.postAjax("/CurrencyIntro/Delete",{"id":item.id},(res)=>{
                this.openErr(this.$t("message.DeleteSuccess"),2);
                this.getList();
            },(res)=>{
                this.openErr(this.$t("message.DeletError"),2);
            })
            
            
        }).catch(() => {});
    },
    addSubmitForm(formName){
        this.$refs[formName].validate((valid) => {
            for(let i=0;i<this.list.length;i++){
                if(this.dialogForm.addFieldForm.currency==this.list[i].currency && this.dialogForm.addFieldForm.lang==this.list[i].lang){
                    this.openErr(this.$t("message.canAddOneCurrencyLang"),1);
                    return ;
                }
            }

            if (valid) {//正则验证成功
                this.fullscreenLoading = true;
                let a = this.dialogForm.addFieldForm.releaseTime;
                let time = new Date(this.dialogForm.addFieldForm.releaseTime).getTime() /1000;
                let par = Object.assign(this.dialogForm.addFieldForm,{"releaseTime":time});
                this.dialogForm.addFieldForm.releaseTime = a;

                this.postAjax("/CurrencyIntro/Add",par,(res)=>{
                    this.fullscreenLoading = false;
                    this.openErr(this.$t("message.AddSuccess"),2);
                    this.getList();
                    this.dialog.addDialogSync = false;
                },(res)=>{
                    console.log("路径错误");
                    this.fullscreenLoading = false;
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    reviseSubmitForm(formName){
        this.$refs[formName].validate((valid) => {
            if (valid) {//正则验证成功
                this.fullscreenLoading = true;
                let a = this.dialogForm.addFieldForm.releaseTime;
                let time = new Date(this.dialogForm.addFieldForm.releaseTime).getTime() /1000;
                let par = Object.assign(this.dialogForm.addFieldForm,{"releaseTime":time});
                this.dialogForm.addFieldForm.releaseTime = a;
                
                this.postAjax("/CurrencyIntro/Update",par,(res)=>{
                    this.fullscreenLoading = false;
                    this.openErr(this.$t("message.ServiceSuccess"),2);
                    this.getList();
                    this.dialog.addDialogSync = false;
                },(res)=>{
                    console.log("路径错误");
                    this.fullscreenLoading = false;
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    }
  }
};
</script>
<style scoped>
.el-dialog .el-form{
    width:750px;
}
.el-input {
    width: 220px;
}
/* .el-form--label-left .el-form-item__label{
    text-align: left;
} */
table tr td{
    padding-left:30px;
}

</style>
<style>
.el-table .cell{
    max-height:160px!important;
    /* text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden; */
}
</style>