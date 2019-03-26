<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.TemplateManagement") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        <div class="box">
            <div class="allTypeBox">
               <el-button type="primary" v-if="IsInArray(btnArray,4)"   @click="addListFn">{{ $t("message.Added") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,4)"   @click="reviceListFn">{{ $t("message.Revise") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,4)"   @click="deletListFn">{{ $t("message.Delet") }}</el-button>
                <el-button type="primary" @click="TurnBack">{{ $t("message.TurnBack") }}</el-button>
                <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>
           
            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table ref="rowClick" @row-click="rowClick"  stripe @selection-change="handleSelectionChange" :data="list" 
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column>
                   
                    <el-table-column align="left" :label="$t('message.Code')">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.TriggerId')" >
                        <template slot-scope="scope">
                            <span>{{scope.row.triggerId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.TitleHead')" >
                        <template slot-scope="scope">
                            <span>{{scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.MailContent')" >
                        <template slot-scope="scope">
                            <span>{{htmlDecodeByRegExp(scope.row.email)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.AppContent')" >
                        <template slot-scope="scope">
                            <span>{{scope.row.app}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Languages')" >
                        <template slot-scope="scope">
                            <span>{{getLangText(scope.row.lang)}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column align="left"  :label="$t('message.IsItAvailable')">
                       <template slot-scope="scope">
                            {{scope.row.isUsable == true ? $t("message.Y"):$t("message.N")}}
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
        <el-dialog :title="dialogTitle" :visible.sync="dialog.addDialogSync" width="850px" :close-on-click-modal="isfalse" @close="cancel('addRuleForm')">
            <el-form ref="addRuleForm" class="small-space" :rules="dialogFormRules" :model="dialogForm.addFieldForm" label-position="left" label-width="90px">
                <el-form-item :label="$t('message.TriggerId')" prop="triggerId">
                    <el-input v-model="dialogForm.addFieldForm.triggerId" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.TitleHead')" prop="title">
                    <el-input v-model="dialogForm.addFieldForm.title"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.SMSContent')" prop="sms">
                    <el-input type="textarea"  v-model="dialogForm.addFieldForm.sms"></el-input>
                </el-form-item>

                <el-form-item :label="$t('message.MailContent')" prop="email" style="height:250px;">
                    <!-- <el-input type="textarea"  v-model="dialogForm.addFieldForm.email"></el-input> -->
                    <quill-editor ref="myTextEditor" v-model="dialogForm.addFieldForm.email" :config="editorOption" style="height:150px;"></quill-editor>
                </el-form-item>
                <el-form-item :label="$t('message.AppContent')" prop="app" style="margin-top:50px;">
                    <el-input type="textarea"  v-model="dialogForm.addFieldForm.app"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.Languages')" prop="lang">
                    <el-select v-model="dialogForm.addFieldForm.lang" :placeholder="$t('message.Languages')">
                        <el-option :key=index v-for="(item,index) in languageSelect" :label="item.text" :value="item.value"></el-option>
                    </el-select>
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
        var validateEmailAndApp = (rule, value, callback) => {
            if (value === ''&&this.dialogForm.addFieldForm.app==="") {
                callback(new Error(this.$t("message.EmailAndApp")));
            } else {
                callback(); 
            }
        };
        var validateEmail = (rule, value, callback) => {
            if (value.toString().trim()=="") {
                callback(new Error(this.$t("message.emailContNotEmpt")));
            } else {
                callback(); 
            }
        };
        return {
            // content:"<p></p>",
            editorOption: {
                
            },
            isfalse:false,
            menuicon: 'getMenu',
            dialogTitle: this.$t("message.Added"),
            list:null,
            btnArray:[],
            addSync:false,
            multipleSelection:[],//选中的表格数组
            listLoading:true,
            fullscreenLoading:false,
            languageSelect:[],
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
                    id:0,
                    triggerId: this.$route.query.triggerId,
                    title: "",
                    email: "",
                    app: "",
                    lang: "2",
                    isUsable: true,
                    sms:"",
                }
            },
            dialogFormRules:{
                title: [
                    { required: true, message: this.$t("message.TitleNotEmpty"), trigger: 'blur' },
                ],
                // email:[
                //     { validator: validateEmailAndApp, trigger: 'blur' },
                // ],
                email:[
                    // { required: true, message: this.$t("message.emailContNotEmpt"), trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' },
                ],
                TemplateLabel:[
                    { required: true, message: this.$t("message.TemplatetagsNotEmpty"), trigger: 'blur' },
                ],
                // sms:[
                //     { required: true, message: this.$t("message.smsNotEmpt"), trigger: 'blur' },
                // ]
            }
        }
    },
    created: function(){ 
        this.getList();
        this.getLanguage();
        this.getBtn();
    },
    computed:{
        // languageSelect:function(){
        //     let selectLangArray = [];
        //     for(let i=0;i<this.getList.length;i++){
        //         if(this.getList[i].parentId == 0){
        //             selectParentIdArray.push(this.getList[i])
        //         }
        //     }
        //     return selectParentIdArray;
        // }
        editor() {
            return this.$refs.myTextEditor.quillEditor;
        }
    },
    methods:{
        cancel(formName){
            this.dialog.addDialogSync = false;
            if (this.$refs[formName]!==undefined) {
                this.$refs[formName].resetFields();
            }
        },
        getList(){//this.$route.query.id
            var that = this;
            let par = {
                'triggerId':this.$route.query.triggerId,
                "pageIndex":this.pagenation.currPage,//10
                "pageSize":this.pagenation.pageSize,//(1-1)*10
            };
             this.postAjax("/NoticeTpl/GetPageList",par,function(res){
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
             this.postAjax("/NoticeTrigger/Limits",null,function(res){
                console.log(res.body.value);
                that.btnArray = res.body.value;
            },function(res){
                console.log("路径错误");
                that.openErr(that.$t("message.ErrorToGetBtnLimit"),1);
            })
        },
        getLanguage(){
            let that = this;
            this.postAjax("/Lang/GetOptions",{"includeDefault": false},function(res){
                console.log(res.body.value);
                that.languageSelect = res.body.value;
            },function(res){})
        },
        getLangText(lang){
            for(let i=0;i<this.languageSelect.length;i++){
                if(this.languageSelect[i].value==lang){
                    return this.languageSelect[i].text
                }
            }
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
            this.dialogTitle = this.$t("message.Added");
            this.dialogForm.addFieldForm={
                    id:0,
                    triggerId: this.$route.query.triggerId,
                    title: "",
                    email: "",
                    app: "",
                    lang: 2,
                    isUsable: true,
                    sms:"",
                }
            this.dialog.addDialogSync = true;
        },
        addSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let par={
                        id:0,
                        triggerId: this.$route.query.triggerId,
                        title: this.dialogForm.addFieldForm.title,
                        email:that.htmlEncodeByRegExp(this.dialogForm.addFieldForm.email),
                        app: this.dialogForm.addFieldForm.app,
                        lang: this.dialogForm.addFieldForm.lang,
                        isUsable: this.dialogForm.addFieldForm.isUsable,
                        sms: this.dialogForm.addFieldForm.sms,
                    }
                    this.postAjax("/NoticeTpl/Add",par,function(res){
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
            this.addSync = false;
            this.dialogTitle = this.$t("message.Revise");
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.onlyChoiseOneRevise"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseTheResive"),1);
            }else{
                 this.dialogForm.addFieldForm={
                    id:this.multipleSelection[0].id,
                    triggerId: this.$route.query.triggerId,
                    title: this.multipleSelection[0].title,
                    email: this.multipleSelection[0].email,
                    app: this.multipleSelection[0].app,
                    lang: this.multipleSelection[0].lang+'',
                    isUsable: this.multipleSelection[0].isUsable,
                    sms: this.multipleSelection[0].sms,
                }
                this.dialog.addDialogSync = true;
                
            }
        },
        reviseSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let par={
                        id:this.multipleSelection[0].id,
                        triggerId: this.$route.query.triggerId,
                        title: this.dialogForm.addFieldForm.title,
                        email: this.dialogForm.addFieldForm.email,
                        app: this.dialogForm.addFieldForm.app,
                        lang: this.dialogForm.addFieldForm.lang,
                        isUsable: this.dialogForm.addFieldForm.isUsable,
                        sms: this.dialogForm.addFieldForm.sms,
                    }

                    this.postAjax("/NoticeTpl/Update",par,function(res){
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
                 this.openErr(this.$t("message.ChoiseTheDelet"),1);
            }else{
                 this.$confirm(that.$t("message.SureToDelet"), that.$t("message.Title"), {
                    confirmButtonText: that.$t("message.MakeSure"),
                    cancelButtonText:  that.$t("message.Cancel"),
                    type: 'warning'
                }).then(() => {
                    var data =this.multipleSelection;
                    var reques = [];
                    for (var i = data.length - 1; i >= 0; i--) {
                        reques.push(
                            that.postAjax("/NoticeTpl/Delete",{"id":that.multipleSelection[i].id},function(res){},function(res){})
                        );
                    }
                    $.when.apply(this,reques).done(function(){
                        that.openErr(that.$t("message.DeleteSuccess"),2);
                        that.getList();
                    })
                }).catch(() => {});
            }

        },
        TemplateManagementFn(){
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.multipleSelection[0].key
                this.$router.push({path:"/templateManagement",query:{triggerId:this.multipleSelection[0].id}});
            }
        },
        TurnBack(){
            this.$router.push({
                path: "/triggerList"
            });
        }

    }
}
</script>
<style scoped>
.el-input {
    width: 200px;
}
.el-dialog .el-form{
    width:750px;
}

.el-form-item__content .el-form-item__error{
    margin-top:100px;
}
</style>
