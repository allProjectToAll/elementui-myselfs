<template>
    <div>
        <!-- <i class="el-icon-menu"></i> -->
        <input type="button" :class="menuicon" @click="menuChange" />
        
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <span class="user-name">{{nickname}}</span>
                <img class="user-avatar" src="../../assets/headers.png">
                <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <el-dropdown-item >
                        <span @click="ResetPassword">{{ $t("message.ResetPassword") }}</span>
                </el-dropdown-item>
                <el-dropdown-item divided class="langularControl">
                    <span>{{ $t("message.SwitchLanguage") }}></span>
                    <div class="langularBox">
                        <div @click="toChinese">{{ $t("message.Chinese") }}</div>
                        <div  @click="toEnglish">{{ $t("message.Englishs") }}</div>
                    </div>
                </el-dropdown-item>
                <el-dropdown-item divided >
                    <span @click="ExitLogon">{{ $t("message.ExitLogon") }}</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>


        <el-dialog :title="$t('message.ResetPassword')" :visible.sync="dialog" width="500px">
            <el-form ref="addModelRuleForm" class="small-space" :rules="rules" :model="dialogForm" label-position="left"
             label-width="100px">
                <el-form-item :label="$t('message.GoogleCode')" prop="GoogleCode">
                    <el-input v-model="dialogForm.GoogleCode" :placeholder="$t('message.PleaseEnterGGCode')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.NewPassword')" prop="NewPassword">
                    <el-input type="password" v-model="dialogForm.NewPassword" :placeholder="$t('message.PleaseEnterGGCode')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.ReNewPassword')" prop="ReNewPassword">
                    <el-input type="password" v-model="dialogForm.ReNewPassword" :placeholder="$t('message.PleaseEnterNewPassword')"></el-input>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog = false">{{ $t("message.Cancel") }} </el-button>
                <el-button type="primary" 
                :element-loading-text="$t('message.Inprocessing')" 
                v-loading.fullscreen.lock="fullscreenLoading"
                 @click="passwordChange('addModelRuleForm')">{{ $t("message.Revise") }} </el-button>
            </div>
        </el-dialog>

        


    </div>
</template>
<script>
export default {
    data() {
            var passWord = (rule, value, callback) => {
                if (value != this.dialogForm.NewPassword) {
                    callback(new Error(this.$t("message.PasswordDiffer")));
                } else {
                    callback(); 
                }
            };
        return {
            menuicon:'getMenu',
            fullscreenLoading:false,
            dialog:false,
            dialogForm:{
                GoogleCode:"",
                NewPassword:"",
                ReNewPassword:""
            },
            // language:this.loadTxt(headerListLng),
            nickname: localStorage.getItem("userName")||"username",
            rules:{
                GoogleCode: [
                    {  required: true,message:this.$t("message.PleaseEnterGGCode"), trigger: 'blur'}
                ],
                NewPassword: [
                    {  required: true,message:this.$t("message.PleaseEnterNewPassword"), trigger: 'blur'}
                ],
                ReNewPassword: [
                    {  required: true,message:this.$t("message.PleaseEnterNewPassword"), trigger: 'blur'},
                    { validator: passWord, trigger: 'blur' },
                ],
            }
        }
    },
    created:function(){
        
       
    },
    mounted:function(){
        //  this.i18n.locale = "zh-CN";
        //   locale.use(zhLocale)
    },
    computed:{
        
    },
    methods:{
        menuChange:function(el){
            if(el.target.className=="getMenu"){
                this.menuicon="postMenu";
            }else{
                this.menuicon="getMenu";
            }
            this.$store.commit("leftMenuChange");
        },
        toChinese(){
            this.$i18n.locale = 'cn'; 
            localStorage.setItem("langular","cn");
        },
        toEnglish(){
            this.$i18n.locale = 'en'; 
            localStorage.setItem("langular","en");
        },
        ExitLogon(){
            let that = this;
            this.$confirm(that.$t("message.DeterminExitLogon")+'?', that.$t("message.Title"), {
                confirmButtonText: that.$t("message.MakeSure"),
                cancelButtonText: that.$t("message.Cancel"),
                type: 'warning'
            }).then(() => {
                // localStorage.setItem("isLogin",false);
                sessionStorage.setItem("isLogin",false);
                localStorage.setItem("userName","");
                this.$router.push({path:"/login"});
            }).catch(() => {
                         
            });
        },
        ResetPassword(){
            this.dialog = true;
             this.dialogForm={
                GoogleCode:"",
                NewPassword:"",
                ReNewPassword:""
            }
        },
        passwordChange(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let par = {
                        "code": this.dialogForm.GoogleCode,
                        "password": this.dialogForm.NewPassword
                    }
                    this.postAjax("/Main/ChangePassword",par,function(res){
                         that.fullscreenLoading = false;
                        that.openErr(that.$t("message.ServiceSuccess"),2);
                        that.dialog = false;

                    },function(res){
                        console.log("路径错误");
                        that.fullscreenLoading = false;
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
<style scoped>
.menu{
    margin-top:15px;
}
.avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
}
.avatar-wrapper {
    cursor: pointer;
    padding: 5px;
    padding-top:10px;
    position: relative;
    height: 40px;
    line-height: 40px;
    outline:none;
}
.user-name{
    float: left;
    margin-right: 5px;
}
.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-icon-caret-bottom {
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
    outline:none;
}
.langularBox{
    background:white;
    box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
    -webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
    position: absolute;
    right:100px;
    top:0;
    width:100px;
    border-radius:5px;
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    -o-border-radius:5px;
    text-align: center;
    line-height:40px;
    display:none;
    z-index:100000;
}
.langularBox div:first-child{
    border-bottom: 1px solid #ebeef5;
}
.langularControl:hover .langularBox{
    color:black;
    display:block;
}
.langularBox div:hover{
    color:#409EFF;
}
.el-dropdown-menu__item--divided:before{
  height:0;
  margin:0;
}
.el-dropdown-menu li{
  padding: 0;
}
.el-dropdown-menu li span{
  display: block;
  height:100%;
  padding: 0 20px;
}
</style>
