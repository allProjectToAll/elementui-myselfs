<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.SMSConfiguration") }}</h2>
        <span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        <div class="box">
             <div class="allTypeBox">
                <el-input :placeholder="$t('message.CountyCodeAndName')" clearable v-model="search.CountryCode"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getList"></el-button>
            </div>
            <div class="allTypeBox">
               <el-button type="primary" v-if="IsInArray(btnArray,1)"  @click="addListFn">{{ $t("message.Added") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,2)"  @click="reviceListFn">{{ $t("message.Revise") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,3)"  @click="deletListFn">{{ $t("message.Delet") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,4)"  @click="Actived">{{ $t("message.Actived") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,5)"  @click="Disabled">{{ $t("message.Disabled") }}</el-button>
                <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>
           
            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table ref="rowClick" @row-click="rowClick"  stripe @selection-change="handleSelectionChange" :data="list" 
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column>
                   
                    <el-table-column align="left" :label="$t('message.CountyCode')">
                        <template slot-scope="scope">
                            <span>{{scope.row.countryCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.CountyName')">
                        <template slot-scope="scope">
                            <span>{{scope.row.countryName}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column align="left" :label="$t('message.SMSProvider')">
                        <template slot-scope="scope">
                            <span>{{scope.row.supplier}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.IsItAvailable')">
                        <template slot-scope="scope">
                            {{scope.row.isUsable == true ? $t('message.Y'):$t('message.N')}}
                        </template>
                    </el-table-column>
                   
                </el-table>
            <!-- 分页 -->
                <div v-show="false">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                        :current-page="pagenation.currPage"  :page-sizes="[8,10,15, 20]" :page-size="pagenation.pageSize" 
                        layout="total, sizes, prev, pager, next, jumper"  :total="pagenation.total">
                    </el-pagination>
                </div>
            </div>
        </div>

    <!-- 添加角色 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialog.addDialogSync" width="600px" :close-on-click-modal="isfalse" @close="cancel('addRuleForm')">
            <el-form ref="addRuleForm" class="small-space" :rules="dialogFormRules" :model="dialogForm.addFieldForm" label-position="left" label-width="90px">
                <el-form-item :label="$t('message.CountyCode')" prop="countryCode">
                    <el-input v-model="dialogForm.addFieldForm.countryCode" :disabled="countryCodeAsync"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.CountyName')" prop="countryName">
                    <el-input v-model="dialogForm.addFieldForm.countryName" class="text"></el-input>
                </el-form-item>
                <el-form-item  :label="$t('message.SMSProvider')" prop="supplier">
                    <el-input v-model="dialogForm.addFieldForm.supplier" class="text"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.IsItAvailable')">
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
        return {
            isfalse:false,
            menuicon: 'getMenu',
            countryCodeAsync:false,
            dialogTitle: this.$t("message.Added"),
            btnArray:[],
            list:null,
            addSync:false,
            multipleSelection:[],//选中的表格数组
            listLoading:true,
            fullscreenLoading:false,
            search:{
                CountryCode:"",
            },
            pagenation:{
                total:null,//总条目数
                currPage: 1,//当前页
                pageSize: 8,//一页显示个数
                title: '',
                type: null,//类型
            },
            dialog:{ //控制每个弹出框显示隐藏的
                addDialogSync:false,
            },
            dialogForm:{//控制每个弹出框字段的
                addFieldForm: {
                    countryCode: "",
                    countryName: "",
                    supplier:"",
                    isUsable:true,
                }
            },
            dialogFormRules:{
                countryCode: [
                    { required: true, message: this.$t("message.CountyCodeNotEmpty"), trigger: 'blur' },
                ],
                countryName:[
                    { required: true, message: this.$t("message.CountyNameNotEmpty"), trigger: 'blur' },
                ]
            }
        }
    },
    created: function(){ 
        this.getList();
        this.getBtn();
    },
    computed:{
        
    },
    methods:{
        cancel(formName){
            this.dialog.addDialogSync = false;
            if (this.$refs[formName]!==undefined) {
                this.$refs[formName].resetFields();
            }
        },
        getList(){
            var that = this;
            let par = {
              "pageIndex":this.pagenation.currPage,//10
              "pageSize":this.pagenation.pageSize,//(1-1)*10
              "queryText":this.search.CountryCode
            };
             this.postAjax("/SmsConfig/GetPageList",par,function(res){
                that.list = res.body.value.items ;
                that.listLoading = false;
                that.openErr(that.$t("message.SuccessToGetList"),2);
            },function(res){
                console.log("路径错误");
            })
        },
        getBtn(){
            let that = this;
             this.postAjax("/SmsConfig/Limits",null,function(res){
                console.log(res.body.value);
                that.btnArray = res.body.value;
            },function(res){
                console.log("路径错误");
                that.openErr(that.$t("message.ErrorToGetBtnLimit"),1);
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
        addListFn(){
            this.addSync = true;
            this.countryCodeAsync=false;
            this.dialogTitle = this.$t("message.Added");
            this.dialogForm.addFieldForm={
                    countryCode: "",
                    countryName: "",
                    supplier:"",
                    isUsable:true,
                }
            this.dialog.addDialogSync = true;
        },
        addSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    
                    this.postAjax("/SmsConfig/Add",that.dialogForm.addFieldForm,function(res){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.AddSuccess"),2);
                        that.getList();
                        that.dialog.addDialogSync = false;

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
        reviceListFn(){
            
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.onlyChoiseOneRevise"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseTheResive"),1);
            }else{
                this.countryCodeAsync = true;
                this.addSync = false;
                this.dialogTitle = this.$t("message.Revise");

                this.dialogForm.addFieldForm={
                    countryCode: this.multipleSelection[0].countryCode,
                    countryName: this.multipleSelection[0].countryName,
                    supplier:this.multipleSelection[0].supplier,
                    isUsable:this.multipleSelection[0].isUsable,
                }
                this.dialog.addDialogSync = true;
                
            }
        },
        reviseSubmitForm(formName){
           let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    this.postAjax("/SmsConfig/Update",that.dialogForm.addFieldForm,function(res){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.ServiceSuccess"),2);
                        that.getList();
                        that.dialog.addDialogSync = false;

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
        deletListFn(){
            let that = this;
            if(this.multipleSelection.length==0){
                 this.openErr(this.$t("message.ChoiseTheDelet"),2);
            }else{
                 this.$confirm(that.$t("message.SureToDelet"), that.$t("message.Title"), {
                    confirmButtonText: that.$t("message.MakeSure"),
                    cancelButtonText:  that.$t("message.Cancel"),
                    type: 'warning'
                }).then(() => {
                    that.fullscreenLoading = true;
                    var data =this.multipleSelection;
                    var reques = [];
                    for (var i = data.length - 1; i >= 0; i--) {
                        reques.push(
                            that.postAjax("/SmsConfig/Delete",{"countryCode":that.multipleSelection[i].countryCode},function(res){},function(res){})
                        );
                    }
                    $.when.apply(this,reques).done(function(){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.DeleteSuccess"),2);
                        that.getList();
                    }).error(function(){
                        that.fullscreenLoading = false;
                    })
                }).catch(() => {});
            }
        },
        Actived(){
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].isUsable==true){
                    this.openErr(this.$t("message.HasActived"),1);
                }else{
                    let that = this;
                    this.$confirm(that.$t("message.SureToDelet"), that.$t("message.Title"), {
                        confirmButtonText: that.$t("message.MakeSure"),
                        cancelButtonText:  that.$t("message.Cancel"),
                        type: 'warning'
                    }).then(() => {
                        
                        this.postAjax("/SmsConfig/Open",{"countryCode":that.multipleSelection[0].countryCode},function(res){
                            that.openErr(that.$t("message.ServiceSuccess"),2);
                            that.getList();
                        },function(res){
                            console.log("路径错误");
                            that.fullscreenLoading = false;
                        })
                    }).catch(() => {});
                }
            }
        },
        Disabled(){
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].isUsable==false){
                    this.openErr(this.$t("message.HasUnActived"),1);
                }else{
                    let that = this;
                    this.$confirm(that.$t("message.SureToDelet"), that.$t("message.Title"), {
                        confirmButtonText: that.$t("message.MakeSure"),
                        cancelButtonText:  that.$t("message.Cancel"),
                        type: 'warning'
                    }).then(() => {     
                        this.postAjax("/SmsConfig/Close",{"countryCode":that.multipleSelection[0].countryCode},function(res){
                            that.openErr(that.$t("message.ServiceSuccess"),2);
                            that.getList();
                        },function(res){
                            console.log("路径错误");
                            that.fullscreenLoading = false;
                        })
                    }).catch(() => {});
                }
            }
        }
    }
}
</script>
<style scoped>
.el-input {
    width: 200px;
}
</style>
