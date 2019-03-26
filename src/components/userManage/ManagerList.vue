<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.ManagersList") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.ManagersListRightTitle") }}</span>
        <div class="clear"></div>
        <div class="box">
            <div class="allTypeBox">
                <el-button type="primary"  v-if="IsInArray(btnArray,1)"  @click="addListFn">{{ $t("message.AddAdmin") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,5)"  @click="locking">{{ $t("message.Locking") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,5)"  @click="unLocking">{{ $t("message.Unlock") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,8)"  @click="AssigninRolesFn">{{ $t("message.DistributionManagementRole") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,3)"  @click="LookGooglekey">{{ $t("message.LookGooglekey") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,2)"  @click="ResetPassword">{{ $t("message.ResetLoginPassword") }}</el-button>
                <el-button type="primary" style="display:none;" v-if="IsInArray(btnArray,4)"  @click="RechargeQuota">{{ $t("message.ChargeableCodeAuthorization") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,7)"  @click="UnGoogleOTPbinding">{{ $t("message.RelievingGoogleOTPbinding") }}</el-button>
                <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>

            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table  ref="rowClick" @row-click="rowClick"  stripe @selection-change="handleSelectionChange" :data="list"
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column>
                    <el-table-column align="left" label="id" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.LoginAccount')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.account}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.NickName')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.nickName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.LockOrUnlock')">
                        <template slot-scope="scope">
                            {{scope.row.isLocked == true ? $t("message.Y"):$t("message.N")}}
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Role')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.roleNames}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.chormeBing')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.isOtpBinded==true?"是":"否"}}</span>
                        </template>
                    </el-table-column>
                    <!-- 充值码授权 -->
                    <!-- <el-table-column align="left" :label="$t('message.RechargeCodeLine')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.depositAmount}}</span>
                        </template>
                    </el-table-column> -->


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

    <!-- 添加权限 -->
         <el-dialog :title="dialogTitle" :visible.sync="dialog.addDialogSync" width="500px" :close-on-click-modal="isfalse" @close="cancel1('addRuleForm')">
            <el-form ref="addRuleForm" class="small-space" :rules="dialogFormRules" :model="dialogForm.addFieldForm"
            label-position="left" label-width="80px">

                <el-form-item :label="$t('message.LoginAccount')" prop="User">
                    <el-input v-model="dialogForm.addFieldForm.User"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.NickName')" prop="Role">
                    <el-input v-model="dialogForm.addFieldForm.Role"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.Password')" prop="Password">
                    <el-input v-model="dialogForm.addFieldForm.Password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel1('addRuleForm')">{{ $t("message.Cancel") }}</el-button>
                <el-button type="primary" @click="addSubmitForm('addRuleForm')"
                :element-loading-text="$t('message.Inprocessing')"
                 v-loading.fullscreen.lock="fullscreenLoading"
                >{{ $t("message.Add") }}</el-button>
            </div>
        </el-dialog>
        <!-- 锁定 -->
        <el-dialog :title="LockItUpDialogTitle" :visible.sync="dialog.LockItUp" width="500px" :close-on-click-modal="isfalse" >
            <el-form ref="LockItUp" class="small-space" :model="dialogForm.LockItUp"
            label-position="left" label-width="70px" >
                <el-form-item :label="$t('message.User')" prop="account">
                    <el-input v-model="dialogForm.LockItUp.account" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.LockItUp = false">{{ $t("message.Cancel") }}</el-button>
                <el-button v-if="lockingSure" type="primary"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                @click="LockItUpSubmitForm('LockItUp')">{{ $t("message.MakeSure") }}</el-button>
                <el-button v-else type="primary"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 @click="UnLockItUpSubmitForm('LockItUp')">{{ $t("message.MakeSure") }}</el-button>
            </div>
        </el-dialog>

        <!-- 分配管理员角色 -->
        <el-dialog :title="$t('message.AssigninAdministratorRoles')"
            :visible.sync="dialog.AssigninRoles" width="500px" :close-on-click-modal="isfalse" @close="cancel3('AssigninRoles')">
            <el-form ref="AssigninRoles" class="small-space" :model="dialogForm.AssigninRoles"
            label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
                <el-form-item :label="$t('message.User')" prop="account">
                    <el-input v-model="dialogForm.AssigninRoles.account" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.Role')" prop="Role">
                    <el-checkbox-group v-model="dialogForm.AssigninRoles.checkList">
                        <el-checkbox :key=index v-for="(item,index) in roleList" :label="item.id">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel3('AssigninRoles')">{{ $t("message.Cancel") }}</el-button>
                <el-button type="primary"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 @click="AssigninRolesSubmitForm('AssigninRoles')">{{ $t("message.MakeSure") }}</el-button>
            </div>
        </el-dialog>

        <!-- 查看谷歌密钥 -->
        <el-dialog :title="$t('message.LookGooglekey')"
            :visible.sync="dialog.LookGooglekey" width="500px" :close-on-click-modal="isfalse">
            <el-form ref="LookGooglekey" class="small-space"  label-position="left" label-width="70px">
                <el-form-item :label="$t('message.User')">
                    <el-input v-model="dialogForm.LookGooglekey.account" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.TFKEY')">
                    <el-input v-model="dialogForm.LookGooglekey.TFKEY" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.QRcode')">
                    <canvas id="canvas" style="width:100px;"></canvas>
                </el-form-item>
                <el-form-item :label="$t('message.Codes')" v-if="bingCodeSync">
                    <el-input v-model="bingCode"></el-input>
                    <el-button @click="GoogleOTPbinding"> {{ $t("message.Bindings") }} </el-button>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.LookGooglekey = false">{{ $t("message.Cancel") }}</el-button>
            </div>
        </el-dialog>
        <!-- 重置登录密码 -->
         <el-dialog :title="$t('message.ResetLoginPassword')" :visible.sync="dialog.ResetPassword" width="500px"
         :close-on-click-modal="isfalse" @close="cancel4('dialogResetPassword')">
            <el-form ref="dialogResetPassword" class="small-space" :rules="dialogResetPassword" :model="dialogForm.ResetPassword"
            label-position="left" label-width="90px">
                <el-form-item :label="$t('message.User')" prop="User">
                    <el-input v-model="dialogForm.ResetPassword.account" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.NewPassword')" prop="password">
                    <el-input type="password" v-model="dialogForm.ResetPassword.password" :placeholder="$t('message.PleaseEnterPassword')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.SurePassword')" prop="ResetPassword">
                    <el-input type="password" v-model="dialogForm.ResetPassword.ResetPassword" :placeholder="$t('message.PleaseEnterPasswordAgain')"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel4('dialogResetPassword')">{{ $t("message.Cancel") }}</el-button>
                <el-button type="primary"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 @click="ResetPasswordForm('dialogResetPassword')">{{ $t("message.MakeSure") }}</el-button>
            </div>
        </el-dialog>
        <!-- 充值额度授权 -->
        <el-dialog :title="$t('message.RechargeQuotaAuthorization')" :visible.sync="dialog.RechargeQuota" width="500px">
            <el-form ref="dialogRechargeQuota" class="small-space" :rules="dialogRechargeQuota" :model="dialogForm.RechargeQuota"
            label-position="left" label-width="90px">
                <el-form-item :label="$t('message.User')" prop="User">
                    <el-input v-model="dialogForm.RechargeQuota.account" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.Quota')" prop="Quota">
                    <el-input v-model="dialogForm.RechargeQuota.Quota" :placeholder="$t('message.PleaseEnteAmount')"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.RechargeQuota = false">{{ $t("message.Cancel") }}</el-button>
                <el-button type="primary"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 @click="RechargeQuotaForm('dialogRechargeQuota')">{{ $t("message.MakeSure") }}</el-button>
            </div>
        </el-dialog>
        <!-- 解除谷歌绑定 -->
        <el-dialog :title="$t('message.RelievingGoogleOTPbinding')" :visible.sync="dialog.UnGoogleOTPbinding" width="500px">
            <el-form ref="UnGoogleOTPbinding" class="small-space" :model="dialogForm.UnGoogleOTPbinding"
            label-position="left" label-width="70px" >
                <el-form-item :label="$t('message.User')" prop="account">
                    <el-input v-model="dialogForm.UnGoogleOTPbinding.account" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.UnGoogleOTPbinding = false">{{ $t("message.Cancel") }}</el-button>
                <el-button v-if="lockingSure"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 type="primary" @click="UnGoogleOTPbindingSubmitForm('UnGoogleOTPbinding')">
                 {{ $t("message.MakeSure") }}</el-button>
            </div>
        </el-dialog>


    </div>
</template>
<script>
import QRCode from 'qrcode'

export default {
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t("message.EnterPasswordAgain")));
            } else if (value !== this.dialogForm.ResetPassword.password) {
                callback(new Error(this.$t("message.PasswordDiffer")));
            } else {
                callback();
            }
        };

        return {
            isfalse:false,
            menuicon: 'getMenu',
            bingCode:'',
            bingCodeSync:false,
            list:null,
            btnArray:[],
            fullscreenLoading:false,
            multipleSelection:[],//选中的表格数组
            listLoading:true,
            lockingSure:true,
            LockItUpDialogTitle:this.$t("message.LockItUp"),
            dialogTitle:this.$t("message.AddPermission"),
            roleList:[],
            dialog:{ //控制每个弹出框显示隐藏的
                addDialogSync:false,
                LockItUp:false,
                AssigninRoles:false,
                LookGooglekey:false,
                ResetPassword:false,
                UnGoogleOTPbinding:false,
                RechargeQuota:false,
            },
            pagenation:{
                total:null,//总条目数
                currPage: 1,//当前页
                pageSize: 8,//一页显示个数
                title: '',
                type: null,//类型
            },
            dialogForm:{//控制每个弹出框字段的
                addFieldForm: {
                    User: "",
                    Role: "",
                    Password:"",
                },
                LockItUp:{
                    account:""
                },
                AssigninRoles:{
                    account:"",
                    checkList:[],
                },
                LookGooglekey:{
                    account:'',
                    TFKEY:'',
                    QRcode:''
                },
                ResetPassword:{
                    account:"",
                    password:"",
                    ResetPassword:""
                },
                RechargeQuota:{
                    account:"",
                    Quota:""
                },
                UnGoogleOTPbinding:{
                    account:"",
                }
            },
            dialogFormRules:{
                User: [
                    { required: true, message: this.$t("message.NotEmpty"), trigger: 'blur' },
                ],
                Role: [
                    { required: true, message: this.$t("message.NotEmpty"), trigger: 'blur' },
                ],
                Password: [
                    { required: true, message: this.$t("message.PasswordOnlyNumber"), trigger: 'blur' },
                ]
            },
            dialogResetPassword:{
                password: [
                    { required: true, message: this.$t("message.PasswordOnlyNumber"), trigger: 'blur' },
                ],
                ResetPassword: [
                    { required: true, message: this.$t("message.EnterPasswordAgain"), trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur'}
                ]
            },
            dialogRechargeQuota:{
                Quota:[
                    { required: true, message: this.$t("message.PleaseEnteAmount"), trigger: 'blur' },
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
        cancel1(formName){
             this.dialog.addDialogSync = false;
            if (this.$refs[formName]!==undefined) {
                this.$refs[formName].resetFields();
            }
        },
        cancel3(formName){
             this.dialog.AssigninRoles = false;
            if (this.$refs[formName]!==undefined) {
                this.$refs[formName].resetFields();
            }
        },
        cancel4(formName){
            this.dialog.ResetPassword = false;
            if (this.$refs[formName]!==undefined) {
                this.$refs[formName].resetFields();
            }
        },
        getList(){
            let that = this;
            let par = {
                    "pageIndex": that.pagenation.currPage,
                    "pageSize": that.pagenation.pageSize
                    }
            this.postAjax("/Manager/GetPageList", par ,function(res){
                that.list = res.body.value.items;
                that.pagenation.total = res.body.value.totalItems;
                that.listLoading = false;
                that.openErr(that.$t("message.SuccessToGetList"),2);
            },function(res){
                console.log("路径错误");
            })
        },
        getBtn(){
            let that = this;
             this.postAjax("/Manager/Limits",null,function(res){
                console.log(res.body.value);
                that.btnArray = res.body.value;
            },function(res){
                console.log("路径错误");
                that.openErr(that.$t("message.ErrorToGetBtnLimit"),1);
            })
        },
        getRole(){
            let that = this;
            let par = {
                    "pageIndex": 1,
                    "pageSize": 100
                    }
            this.postAjax("/Role/GetPageList", par ,function(res){
                that.roleList = res.body.value.items;
            },function(res){
                console.log("路径错误");
            })
        },
        getQRcode(id,account){
            let that = this;
            let par = {"id": id }
            this.postAjax("/Manager/GetOtpSecretKey", par ,function(res){
                that.dialogForm.LookGooglekey.TFKEY = res.body.value.secretKey;
                console.log(that.dialogForm.LookGooglekey.TFKEY);
                that.useqrcode(that,account);
            },function(res){
                console.log("路径错误");
            })
        },
        //生成的二维码内容，可以添加变量
        useqrcode(that,account){//
            // that.QueryDetail='www.baidu.com';
            that.QueryDetail= 'otpauth://totp/'+account+"?secret="+that.dialogForm.LookGooglekey.TFKEY;
            var canvas = document.getElementById('canvas');
            QRCode.toCanvas(canvas, that.QueryDetail, function (error) {
                if (error) console.error(error)
                console.log('success!');
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
        },
        handleSizeChange(val){ //操作分页
            console.log(val)
            this.pagenation.pageSize = val;//每页条数
            this.getList(); //重新请求一次
        },
        handleCurrentChange(val) {
            this.pagenation.currPage = val; //当前页码
            this.getList();
        },
        addListFn(){
            this.dialogTitle = this.$t("message.AddPermission");
            this.dialogForm.addFieldForm={
                    User: "",
                    Role: "",
                    Password:"",
                }
            this.dialog.addDialogSync = true;
        },
		addSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                 that.fullscreenLoading = true;
                    let par={
                        "account": this.dialogForm.addFieldForm.User,
                        "nickName": this.dialogForm.addFieldForm.Role,
                        "password": this.dialogForm.addFieldForm.Password,
                    }

                    this.postAjax("/Manager/Add",par,function(res){
                        that.openErr(that.$t("message.AddSuccess"),2);
                        that.getList();
                        that.dialog.addDialogSync = false;
                        that.fullscreenLoading = false;

                    },function(res){
                        that.fullscreenLoading = false;
                        console.log("路径错误");
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        locking(){//锁定
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].isLocked==true){
                    this.openErr(this.$t("message.HasLocked"),1);
                }else{
                    this.dialog.LockItUp = true;
                    this.lockingSure = true;
                    this.LockItUpDialogTitle = this.$t("message.LockItUp");
                    this.dialogForm.LockItUp={
                        account:this.multipleSelection[0].account
                    }
                }
            }
        },
        unLocking(){
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].isLocked==false){
                    this.openErr(this.$t("message.HasUnLocked"),1);
                }else{
                    this.dialog.LockItUp = true;
                    this.lockingSure = false;
                    this.LockItUpDialogTitle = this.$t("message.LockItUpCancel");
                    this.dialogForm.LockItUp={
                        account:this.multipleSelection[0].account
                    }
                }
            }
        },
        LockItUpSubmitForm(){
            let that = this;
            that.fullscreenLoading = true;
            let par = {
                    "id": this.multipleSelection[0].id,
                    "isLock": true
                }
            this.postAjax("/Manager/UpdateLockStatus", par ,function(res){
                that.openErr(that.$t("message.LockUpSuccess"),2);;
                that.dialog.LockItUp = false;
                that.fullscreenLoading = false;
                that.getList();
            },function(res){
                console.log("路径错误");
                that.fullscreenLoading = false;

            })
        },
        UnLockItUpSubmitForm(){
            let that = this;
            that.fullscreenLoading = true;
            let par = {
                    "id": this.multipleSelection[0].id,
                    "isLock": false
                }
            this.postAjax("/Manager/UpdateLockStatus", par ,function(res){
               that.openErr(that.$t("message.UnLockUpSuccess"),2);;
                that.dialog.LockItUp = false;
                that.fullscreenLoading = false;
                 that.getList();
            },function(res){
                console.log("路径错误");
                that.fullscreenLoading = false;

            })
        },
        AssigninRolesFn(){//分配角色
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.getRole();
                //获取到checkbox，并给其赋值选中
                this.dialogForm.AssigninRoles.checkList=[];
                this.dialog.AssigninRoles=true;
                console.log(this.multipleSelection)
                let array = this.multipleSelection[0].roles?this.multipleSelection[0].roles.split(","):[];

                for(let i=0;i<array.length;i++){
                    this.dialogForm.AssigninRoles.checkList.push(parseInt(array[i]));
                }
                this.dialogForm.AssigninRoles.account = this.multipleSelection[0].account;
            }
        },
        AssigninRolesSubmitForm(){
            let that = this;
             that.fullscreenLoading = true;
            let par = {
                    "id": this.multipleSelection[0].id,
                    "roles": this.dialogForm.AssigninRoles.checkList.join(",")
                }
                console.log(par);
            this.postAjax("/Manager/SetRoles", par ,function(res){
               that.openErr(that.$t("message.RoleAssignmentSuccess"),2);
                that.dialog.AssigninRoles = false;
                that.fullscreenLoading = false;
                that.getList();
            },function(res){
                console.log("路径错误");
                that.fullscreenLoading = false;

            })
        },
        LookGooglekey(){
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.dialogForm.LookGooglekey={
                    account:'',
                    TFKEY:'',
                    QRcode:''
                }
                this.dialog.LookGooglekey = true;//account
                this.getQRcode(this.multipleSelection[0].id,this.multipleSelection[0].account);

                this.dialogForm.LookGooglekey.account=this.multipleSelection[0].account;
                if(this.multipleSelection[0].isOtpBinded){
                    this.bingCodeSync = false;
                }else{
                    this.bingCodeSync = true;
                    this.bingCode = "";
                }

            }
        },
        LookGooglekeySubmitForm(){
            this.dialog.LookGooglekey = false;
        },
        ResetPassword(){
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.dialog.ResetPassword = true;
                this.dialogForm.ResetPassword={
                    account:this.multipleSelection[0].account,
                    password:"",
                    ResetPassword:""
                }
            }
        },
        ResetPasswordForm(formName){
            let that=this;
            var par={
                    "id": this.multipleSelection[0].id,
                    "password": this.dialogForm.ResetPassword.password
                }

            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    this.postAjax("/Manager/UpdatePassword",par,function(res){
                        that.openErr(that.$t("message.ServiceSuccess"),2);
                        that.getList();
                        that.dialog.ResetPassword = false;
                        that.fullscreenLoading = false;
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
        RechargeQuota(){
             if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.dialog.RechargeQuota = true;
                this.dialogForm.RechargeQuota={
                    account:this.multipleSelection[0].account,
                    Quota:""
                }
            }
        },
        RechargeQuotaForm(formName){
            let that=this;
            var par={
                "id": this.multipleSelection[0].id,
                "amount": this.dialogForm.RechargeQuota.Quota
            }

            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    this.postAjax("/Manager/AddDepositAmount",par,function(res){
                        that.openErr(that.$t("message.ServiceSuccess"),2);
                        that.dialog.RechargeQuota = false;
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
        UnGoogleOTPbinding(){
             if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].isOtpBinded==false){
                    this.openErr(this.$t("message.ThisHasUnGoglBing"),1);
                }else{
                    this.dialog.UnGoogleOTPbinding = true;
                    this.dialogForm.UnGoogleOTPbinding={
                        account:this.multipleSelection[0].account
                    }
                }
            }
        },
        UnGoogleOTPbindingSubmitForm(){
            let that = this;
            that.fullscreenLoading = true;
            let par = {
                    "id": this.multipleSelection[0].id,
                }
            this.postAjax("/Manager/UnBindOtp", par ,function(res){
                that.fullscreenLoading = false;
                that.openErr(that.$t("message.ServiceSuccess"),2);;
                that.dialog.UnGoogleOTPbinding = false;
                that.getList();
            },function(res){
                console.log("路径错误");
                that.fullscreenLoading = false;

            })
        },
        GoogleOTPbinding(){
            if(!this.bingCode.replace(/(^\s*)|(\s*$)/g, "")){
                this.openErr(this.$t("message.EnterCodePlease"),1);
            }else{
                let that = this;
                let par={
                    "id": this.multipleSelection[0].id,
                    "code": this.bingCode,
                }
                this.postAjax("/Manager/BindOtp", par ,function(res){ //谷歌绑定
                    that.openErr(that.$t("message.BingSuccess"),2);
                    that.bingCodeSync = false;
                },function(res){
                    console.log("路径错误");
                })
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
