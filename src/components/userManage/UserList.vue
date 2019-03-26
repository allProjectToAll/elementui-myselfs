<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.UserList") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        <div class="box">
            <div class="allTypeBox">
               <el-input :placeholder="$t('message.EnterCarNumberSearch')" clearable v-model="search.idNo"></el-input>
               <el-input :placeholder="$t('message.EnterEmailSearch')" clearable v-model="search.email"></el-input>
              <el-input :placeholder="$t('message.SearchForPhone')" clearable v-model="search.phoneNumber"></el-input>

              <!-- <el-input :placeholder="$t('message.EnterRealNameSearch')" clearable v-model="search.realName"></el-input> -->
               <el-button type="primary" icon="el-icon-search"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                @click="searchFn"></el-button>
            </div>
            <div class="allTypeBox">
                <el-button type="primary" v-if="IsInArray(btnArray,1)" @click="lockedFn">{{ $t("message.Locking") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,2)" @click="Deblocking">{{ $t("message.Deblocking") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,3)" @click="ForcedUnlocking">{{ $t("message.ForcedUnlocking") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,4)" @click="ReleaseGoogleFn">{{ $t("message.ReleaseGoogleAuthentication") }}</el-button>
                <!-- <el-button type="primary" @click="RemoveMobileBinding">{{ $t("message.RemoveMobileBinding") }}</el-button> -->
                <el-button type="primary" v-if="IsInArray(btnArray,5)" @click="SettingExtensionLevel">{{ $t("message.SettingExtensionLevel") }}</el-button>
                <el-button type="primary" @click="CheckTheDetail">{{ $t("message.CheckTheDetail") }}</el-button>
                <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>

            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table ref="rowClick" @row-click="rowClick"  stripe @selection-change="handleSelectionChange" :data="list"
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column>

                    <el-table-column align="left" label="Id" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.User')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.firstName}}&nbsp;{{scope.row.lastName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.NickName')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.nickName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.email')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.email}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.phone')" width="">
                        <template slot-scope="scope">
                            <span>(+{{scope.row.phoneCode}}){{scope.row.phoneNumber}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.CountryCode')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.countryCode}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="left" :label="$t('message.CarNumber')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.idNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.RealNameType')" width="">
                        <template slot-scope="scope">
                            <span v-if="scope.row.certType==0"> {{ $t("message.NoAuthentication") }}</span>
                            <span v-if="scope.row.certType==1"> {{ $t("message.CertificateCertification") }}</span>
                            <span v-if="scope.row.certType==3"> {{ $t("message.PrimaryCertificationBank") }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.RealNameLeavel')" width="">
                        <template slot-scope="scope">
                            <span v-if="scope.row.certLevel==0"> {{ $t("message.NoAuthentication") }}</span>
                            <span v-if="scope.row.certLevel==1"> {{ $t("message.PrimaryCertification") }}</span>
                            <span v-if="scope.row.certLevel==2"> {{ $t("message.HeightCertification") }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.LockOrUnlock')" width="">
                         <template slot-scope="scope">
                            <template v-if="scope.row.status==0">
                                {{ $t("message.Unknown") }}
                            </template>
                            <template v-else-if="scope.row.status==1">
                                {{ $t("message.NoActive") }}
                            </template>
                            <template v-else-if="scope.row.status==2">
                                {{ $t("message.Active") }}
                            </template>
                            <template v-else-if="scope.row.status==4">
                                {{ $t("message.Locked") }}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.LockCategory')" width="">
                        <template slot-scope="scope">
                            <template v-if="scope.row.lockType==0">
                                {{ $t("message.NoLock") }}
                            </template>
                            <template v-else-if="scope.row.lockType==1">
                                {{ $t("message.AdminLock") }}
                            </template>
                            <template v-else-if="scope.row.lockType==2">
                                {{ $t("message.LockUser") }}
                            </template>
                            <template v-else-if="scope.row.lockType==4">
                                {{ $t("message.DoubleLockAttack") }}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.CreatTime')" width="">
                        <template slot-scope="scope">
                            <span>{{ creatDay(scope.row.createTime)}}</span>
                            <!-- <span>{{}}</span> -->
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
        <el-dialog :title="dialogTitle" :visible.sync="dialog.addDialogSync" width="500px"
        :close-on-click-modal="isfalse" @close="cancel('addRuleForm')">
            <el-form ref="addRuleForm" class="small-space" :rules="dialogFormRules" :model="dialogForm.addFieldForm" label-position="left" label-width="70px">
                <el-form-item :label="$t('message.User')" prop="User">
                    <el-input v-model="dialogForm.addFieldForm.User" disabled></el-input>
                </el-form-item>
                <el-form-item  :label="$t('message.Remarks')" prop="remark">
                     <el-input v-model="dialogForm.addFieldForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('addRuleForm')">{{ $t("message.Cancel") }}</el-button>
                <el-button
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 v-if="addSync==1" type="primary" @click="LockedSubmitForm('addRuleForm')">{{ $t("message.MakeSure") }}</el-button>
                <el-button
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 v-else-if="addSync==2" type="primary" @click="DeblockingSubmitForm('addRuleForm')">{{ $t("message.MakeSure") }}</el-button>
                <el-button
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 v-else-if="addSync==3" type="primary" @click="ForcedUnlockingSubmitForm('addRuleForm')">{{ $t("message.MakeSure") }}</el-button>
                <el-button
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 v-else-if="addSync==4" type="primary" @click="ReleaseGoogleubmitForm('addRuleForm')">{{ $t("message.MakeSure") }}</el-button>
                <el-button
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 v-else-if="addSync==5" type="primary" @click="SettingExtenubmitForm('addRuleForm')">{{ $t("message.MakeSure") }}</el-button>
            </div>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog :title="$t('message.CheckTheDetail')  " :visible.sync="dialog.CheckTheDetail" width="800px">
            <table class="tableDialog"  cellpadding="0" cellspacing="0" >
                <tr>
                    <td>{{ $t("message.UserId2") }}：</td>
                    <td>{{dialogForm.detail.id}}</td>
                    <td>{{ $t("message.CarNumber") }}：</td>
                    <td>{{dialogForm.detail.idNo}}</td>
                </tr>
                <tr>
                    <td>{{ $t("message.NickName") }}：</td>
                    <td>{{dialogForm.detail.nickName}}</td>
                    <td>{{ $t("message.email") }}：</td>
                    <td>{{dialogForm.detail.email}}</td>
                </tr>
                <tr>
                    <td>{{ $t("message.LockCategory") }}：</td>
                    <td>
                        <template v-if="dialogForm.detail.lockType==0">
                            {{ $t("message.NoLock") }}
                        </template>
                        <template v-else-if="dialogForm.detail.lockType==1">
                            {{ $t("message.AdminLock") }}
                        </template>
                        <template v-else-if="dialogForm.detail.lockType==2">
                            {{ $t("message.LockUser") }}
                        </template>
                        <template v-else-if="dialogForm.detail.lockType==4">
                            {{ $t("message.DoubleLockAttack") }}
                        </template>
                    </td>
                    <td>{{ $t("message.User") }}：</td>
                    <td>{{dialogForm.detail.firstName}}{{dialogForm.detail.lastName}}</td>
                </tr>
                <tr>
                    <td>{{ $t("message.LoginIp") }}：</td>
                    <td>{{dialogForm.detail.loginIP}}</td>
                    <td>{{ $t("message.Languages") }}：</td>
                    <td>{{dialogForm.detail.lang?filterLangular(dialogForm.detail.lang):""}}</td>
                </tr>
                <tr>
                    <td>{{ $t("message.PhoneCode") }}：</td>
                    <td>{{dialogForm.detail.phoneCode}}</td>
                    <td>{{ $t("message.phone") }}：</td>
                    <td>{{dialogForm.detail.phoneNumber}}</td>
                </tr>
                <tr>
                    <td>{{ $t("message.PointsThe") }}：</td>
                    <td>{{dialogForm.detail.points}}</td>
                    <td>{{ $t("message.PromoteLevel") }}：</td>
                    <td>{{dialogForm.detail.promoteLevel}}</td>
                </tr>
                <tr>
                    <td>{{ $t("message.Promoter") }}：</td>
                    <td>{{dialogForm.detail.promoter}}</td>
                    <td>{{ $t("message.PromoterEndTime") }}：</td>
                    <td>{{dialogForm.detail.promoterEndTime}}</td>
                </tr>
                <tr>
                    <td>{{ $t("message.LoginArea") }}：</td>
                    <td>{{dialogForm.detail.loginArea}}</td>
                    <td>{{ $t("message.RegisterType") }}：</td>
                    <td><span v-if="dialogForm.detail.registerType==1">{{ $t("message.emailReg") }}</span>
                        <span v-if="dialogForm.detail.registerType==2">{{ $t("message.phoneReg") }}</span>
                    </td>
                </tr>
                <tr>
                    <td>{{ $t("message.UserStatus") }}：</td>
                    <td>
                        <template v-if="dialogForm.detail.status==0">
                            {{ $t("message.Unknown") }}
                        </template>
                        <template v-else-if="dialogForm.detail.status==1">
                            {{ $t("message.NoActive") }}
                        </template>
                        <template v-else-if="dialogForm.detail.status==2">
                            {{ $t("message.Active") }}
                        </template>
                        <template v-else-if="dialogForm.detail.status==4">
                            {{ $t("message.Locked") }}
                        </template>
                    </td>
                    <td>{{ $t("message.YNtoFree") }}：</td>
                    <td>{{dialogForm.detail.tradeFree==true?"是":"否"}}

                    </td>
                </tr>
                <tr>
                    <td>{{ $t("message.RealNameLeavel") }}：</td>
                    <td>
                        <span v-if="dialogForm.detail.certLevel==0"> {{ $t("message.NoAuthentication") }}</span>
                        <span v-if="dialogForm.detail.certLevel==1"> {{ $t("message.PrimaryCertification") }}</span>
                        <span v-if="dialogForm.detail.certLevel==2"> {{ $t("message.HeightCertification") }}</span>
                    </td>
                    <td>{{ $t("message.RealNameType") }}：</td>
                    <td>
                        <span v-if="dialogForm.detail.certType==0"> {{ $t("message.NoAuthentication") }}</span>
                        <span v-if="dialogForm.detail.certType==1"> {{ $t("message.CertificateCertification") }}</span>
                        <span v-if="dialogForm.detail.certType==3"> {{ $t("message.PrimaryCertificationBank") }}</span>
                    </td>
                </tr>
                <tr>
                    <td>{{ $t("message.CountryCode") }}：</td>
                    <td>{{dialogForm.detail.countryCode}}
                    </td>
                    <td>{{ $t("message.CreatTime") }}：</td>
                    <td>{{creatDay(dialogForm.detail.createTime)}}</td>
                </tr>

                <!-- <tr><td width="100">{{ $t("message.AuthenticationCategory") }}</td><td>
                    <template>
                        <span v-if="detail.AuthenticationCategory==0">{{ $t("message.NoAuthentication") }}</span>
                        <span v-else-if="detail.AuthenticationCategory==1">{{ $t("message.CertificateCertification") }}</span>
                        <span v-else-if="detail.AuthenticationCategory==3">{{ $t("message.PrimaryCertificationBank") }}</span>
                    </template>
                </td></tr>
                <tr><td>{{ $t("message.Imagers") }}</td><td>
                    <template>
                        <img src="item" :key=index v-for="(item,index) in detail.Imagers"  width="50" style="float:left;"/>
                    </template>
                </td></tr> -->
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialog.CheckTheDetail = false">{{ $t("message.Cancel") }}</el-button>
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
            dialogTitle: this.$t("message.LockItUp"),
            dialogTitleSet:this.$t("message.SettingUserVIP"),
            fullscreenLoading:false,
            btnArray:[],
            list:null,
            addSync:1,
            SetSync:true,
            multipleSelection:[],//选中的表格数组
            listLoading:true,
            languageSelect:[],
            search:{
              idNo: "",
                email:"",
              realName:'',
              phoneNumber:''
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
                SetSync:false,
                Cancel:false,
                CheckTheDetail:false,
            },
            dialogForm:{//控制每个弹出框字段的
                addFieldForm: {
                    User:0,
                    remark:"",
                },
                detail:{
                    certLevel:"",
                    certType :"",
                    countryCode:"",
                    createTime:"",
                    email :"",
                    id:"",
                    idNo:"",
                    lang :"",
                    lockType:"",
                    loginArea:"",
                    loginIP:"",
                    nickName:"",
                    phoneCode:"",
                    phoneNumber:"",
                    points:"",
                    promoteLevel:"",
                    promoter:"",
                    promoterEndTime:"",
                    realName:"",
                    registerType:"",
                    status:"",
                    tradeFree:""
                }
            },
            dialogFormRules:{
                remark: [
                    { required: true, message: this.$t("message.RemarksNotEmpty"), trigger: 'blur' },
                ]
            }
        }
    },
    created: function(){
        this.getLanguage();
        // this.getList();//获取多语言之后再获取，以便加载表格的时候
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
        getLanguage(){
            let that = this;
            this.postAjax("/Lang/GetOptions",{"includeDefault": false},function(res){
                that.languageSelect = res.body.value;
                that.getList();
            },function(res){})
        },
        filterLangular(value){
            let langnlarValue = this.languageSelect.filter((item) => {
                return item.value == value;
            })
            return langnlarValue[0].text;
        },
        getList(){
            var that = this;
            that.fullscreenLoading = true;
            let par = {
              "pageIndex":this.pagenation.currPage,//10
              "pageSize":this.pagenation.pageSize,//(1-1)*10
            };
             this.postAjax("/User/GetPageList",par,function(res){
                 that.fullscreenLoading = false;
                that.list = res.body.value.items;
                that.pagenation.total = res.body.value.totalItems;
                that.listLoading = false;
                that.openErr(that.$t("message.SuccessToGetList"),2);
            },function(res){
                console.log("路径错误");
                that.fullscreenLoading = false;
            })
        },
        getBtn(){
            let that = this;
             this.postAjax("/User/Limits",null,function(res){
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
        lockedFn(){
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].status==4 || this.multipleSelection[0].status==6){
                    this.openErr(this.$t("message.HasLocked"),1);
                }else{
                    this.addSync = 1;
                    this.dialogTitle = this.$t("message.LockItUp");
                    this.dialogForm.addFieldForm={
                        User:this.multipleSelection[0].firstName?this.multipleSelection[0].firstName:""+this.multipleSelection[0].lastName?this.multipleSelection[0].lastName:"",
                        remark:""
                    }
                    this.dialog.addDialogSync = true;
                }
            }
        },
        LockedSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                that.fullscreenLoading = true;
                    let par={
                        "id": this.multipleSelection[0].id,
                        "remark": this.dialogForm.addFieldForm.remark,
                    }

                    this.postAjax("/User/Lock",par,function(res){
                        that.fullscreenLoading = false;
                        that.dialog.addDialogSync = false;
                        that.openErr(that.$t("message.LockUpSuccess"),2);
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
        Deblocking(){
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].status!=4 && this.multipleSelection[0].status!=6){
                    this.openErr(this.$t("message.HasUnLocked"),1);
                }else{
                    this.addSync = 2;
                    this.dialogTitle = this.$t("message.Deblocking")+"?";
                    this.dialogForm.addFieldForm = {
                        User:this.multipleSelection[0].firstName?this.multipleSelection[0].firstName:""+this.multipleSelection[0].lastName?this.multipleSelection[0].lastName:"",
                        remark:""
                    }
                    this.dialog.addDialogSync = true;
                }
            }
        },
        ForcedUnlocking(){
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].status!=4 && this.multipleSelection[0].status!=6){
                    this.openErr(this.$t("message.HasUnLocked"),1);
                }else{
                    this.addSync = 3;
                    this.dialogTitle = this.$t("message.ForcedUnlocking")+"?";
                    this.dialogForm.addFieldForm = {
                        User:this.multipleSelection[0].firstName?this.multipleSelection[0].firstName:""+this.multipleSelection[0].lastName?this.multipleSelection[0].lastName:"",
                        remark:""
                    }
                    this.dialog.addDialogSync = true;
                }
            }
        },
        ReleaseGoogleFn(){
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.addSync = 4;
                this.dialogTitle = this.$t("message.ReleaseGoogleAuthentication")+"?";
                this.dialogForm.addFieldForm = {
                    User:this.multipleSelection[0].firstName?this.multipleSelection[0].firstName:""+this.multipleSelection[0].lastName?this.multipleSelection[0].lastName:"",
                    remark:""
                }
                this.dialog.addDialogSync = true;
            }
        },
        SettingExtensionLevel(){
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.addSync = 5;
                this.dialogTitle = this.$t("message.SettingExtensionLevel")+"?";
                this.dialogForm.addFieldForm = {
                    User:this.multipleSelection[0].firstName?this.multipleSelection[0].firstName:""+this.multipleSelection[0].lastName?this.multipleSelection[0].lastName:"",
                    remark:""
                }
                this.dialog.addDialogSync = true;
            }
        },
        DeblockingSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let par={
                        "id": this.multipleSelection[0].id,
                        "remark": this.dialogForm.addFieldForm.remark,
                    }

                    this.postAjax("/User/UnLock",par,function(res){
                        that.fullscreenLoading = false;
                        that.dialog.addDialogSync = false;
                        that.openErr(that.$t("message.UnlockSuccess"),2);
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
        ForcedUnlockingSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let par={
                        "id": this.multipleSelection[0].id,
                        "remark": this.dialogForm.addFieldForm.remark,
                    }

                    this.postAjax("/User/MandatoryUnLock",par,function(res){
                        that.fullscreenLoading = false;
                        that.dialog.addDialogSync = false;
                        that.openErr(that.$t("message.UnlockSuccess"),2);
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
        ReleaseGoogleubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let par={
                        "id": this.multipleSelection[0].id,
                        "remark": this.dialogForm.addFieldForm.remark,
                    }

                    this.postAjax("/User/UnBindOtp",par,function(res){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.RescissionSuccess"),2);
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
        SettingExtenubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let par={
                        "id": this.multipleSelection[0].id,
                        "remark": this.dialogForm.addFieldForm.remark,
                    }

                    this.postAjax("/User/SetPromoteLevel",par,function(res){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.SetSuccess"),2);
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
        CheckTheDetail(){
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.dialog.CheckTheDetail = true;
                this.dialogForm.detail={
                    certLevel:this.multipleSelection[0].certLevel,
                    certType :this.multipleSelection[0].certType,
                    countryCode:this.multipleSelection[0].countryCode,
                    createTime:this.multipleSelection[0].createTime,
                    email :this.multipleSelection[0].email,
                    id:this.multipleSelection[0].id,
                    idNo:this.multipleSelection[0].idNo,
                    lang :this.multipleSelection[0].lang,
                    lockType:this.multipleSelection[0].lockType,
                    loginArea:this.multipleSelection[0].loginArea,
                    loginIP:this.multipleSelection[0].loginIP,
                    nickName:this.multipleSelection[0].nickName,
                    phoneCode:this.multipleSelection[0].phoneCode,
                    phoneNumber:this.multipleSelection[0].phoneNumber,
                    points:this.multipleSelection[0].points,
                    promoteLevel:this.multipleSelection[0].promoteLevel,
                    promoter:this.multipleSelection[0].promoter,
                    promoterEndTime:this.multipleSelection[0].promoterEndTime,
                    realName:this.multipleSelection[0].firstName?this.multipleSelection[0].firstName:""+this.multipleSelection[0].lastName?this.multipleSelection[0].lastName:"",
                    registerType:this.multipleSelection[0].registerType,
                    status:this.multipleSelection[0].status,
                    tradeFree:this.multipleSelection[0].tradeFree
                }
            }
        },
        searchFn(){
             var that = this;
             that.fullscreenLoading = true;
            let par = {
                "pageIndex":this.pagenation.currPage,//10
                "pageSize":this.pagenation.pageSize,//(1-1)*10 search.phone
                "email": this.search.email,
                "idNo": this.search.idNo,
            //   "realName":  this.search.realName,
                "phoneNumber":  this.search.phoneNumber
            };
             this.postAjax("/User/GetPageList",par,function(res){
                 that.fullscreenLoading = false;
                that.list = res.body.value.items;
                that.pagenation.total = res.body.value.totalItems;
                that.listLoading = false;
            },function(res){
                that.fullscreenLoading = false;
                console.log("路径错误");
            })
        },

    }
}
</script>
<style scoped>
.el-input {
    width: 200px;
}
.tableDialog{
    width:100%;
    padding:5px;
}
.tableDialog tr{
    border-bottom:1px solid #ccc;
}
.tableDialog tr td{
    padding:5px;
    border-bottom:1px solid #eee;
}
.tableDialog tr td:nth-child(1){
    text-align: right;
    border-right:1px solid #eee;
}
.tableDialog tr td:nth-child(2){
    text-align: left;
    border-right:1px solid #eee;
    padding:0 10px 0 20px;
}
.tableDialog tr td:nth-child(3){
    text-align: right;
    border-right:1px solid #eee;
}
.tableDialog tr td:nth-child(4){
    text-align: left;
}
</style>
