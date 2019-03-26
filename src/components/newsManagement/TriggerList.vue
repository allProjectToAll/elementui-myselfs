<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.TriggerList") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        <div class="box">
            <div class="allTypeBox">
               <el-button type="primary"  v-if="IsInArray(btnArray,1)"  @click="addListFn">{{ $t("message.Added") }}</el-button>
                <!-- <el-button type="primary"  v-if="IsInArray(btnArray,3)"  @click="reviceListFn">{{ $t("message.Revise") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,2)"  @click="deletListFn">{{ $t("message.Delet") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,4)"  @click="TemplateManagementFn">{{ $t("message.TemplateManagement") }}</el-button> -->
                <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>
           
            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table ref="rowClick" stripe :data="list" 
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <!-- <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column> -->
                   
                    <el-table-column align="left" :label="$t('message.Code')">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.UniqueCode')" >
                        <template slot-scope="scope">
                            <span>{{scope.row.key}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Name')" >
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.TemplateLabel')" >
                        <template slot-scope="scope">
                            <span>{{scope.row.props}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column align="left"  :label="$t('message.IsItAvailable')">
                       <template slot-scope="scope">
                            {{scope.row.isUsable == true ? $t("message.Y"):$t("message.N")}}
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.handle')" width="150">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary"  v-if="IsInArray(btnArray,2)"  @click="reviceListFn(scope.row)">{{ $t("message.Revise") }}</el-button>
                            <el-button size="small" type="danger"  v-if="IsInArray(btnArray,3)"  @click="deletListFn(scope.row)">{{ $t("message.Delet") }}</el-button>
                            <el-button size="small"  v-if="IsInArray(btnArray,4)"  @click="TemplateManagementFn(scope.row)">{{ $t("message.TemplateManagement") }}</el-button>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialog.addDialogSync" width="500px" :close-on-click-modal="isfalse" @close="cancel('addRuleForm')">
            <el-form ref="addRuleForm" class="small-space" :rules="dialogFormRules" :model="dialogForm.addFieldForm" label-position="left" label-width="90px">
                <el-form-item :label="$t('message.UniqueCode')" prop="UniqueCode">
                    <el-input v-model="dialogForm.addFieldForm.UniqueCode"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.Name')" prop="Name">
                    <el-input v-model="dialogForm.addFieldForm.Name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.TemplateLabel')" prop="TemplateLabel">
                    <el-input v-model="dialogForm.addFieldForm.TemplateLabel"></el-input>
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
             
        return {
            selectId:"",
            isfalse:false,
            menuicon: 'getMenu',
            dialogTitle: this.$t("message.Added"),
            list:null,
            btnArray:[],
            addSync:false,
            multipleSelection:[],//选中的表格数组
            listLoading:true,
            fullscreenLoading:false,
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
                    UniqueCode:"",
                    isUsable: true,
                    Name:"",
                    TemplateLabel:""
                }
            },
            dialogFormRules:{
                UniqueCode: [
                    { required: true, message: this.$t("message.OnlyCodeNotEmpty"), trigger: 'blur' },
                ],
                Name:[
                    { required: true, message: this.$t("message.PleaseEnterName"), trigger: 'blur' },
                ],
                TemplateLabel:[
                    { required: true, message: this.$t("message.TemplatetagsNotEmpty"), trigger: 'blur' },
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
            // this.$refs[formName].resetFields();
            if (this.$refs[formName]!==undefined) {
                this.$refs[formName].resetFields();
            }
        },
        getList(){
            var that = this;
            let par = {
              "pageIndex":this.pagenation.currPage,//10
              "pageSize":this.pagenation.pageSize,//(1-1)*10
            };
             this.postAjax("/NoticeTrigger/GetPageList",par,function(res){
                that.list = res.body.value.items;
                that.pagenation.total = res.body.value.totalItems;
                that.listLoading = false;
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
                    UniqueCode:"",
                    isUsable: true,
                    Name:"",
                    TemplateLabel:""
                }
            this.dialog.addDialogSync = true;
        },
        addSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let par={
                        "id": 0,
                        "key": this.dialogForm.addFieldForm.UniqueCode,
                        "name": this.dialogForm.addFieldForm.Name,
                        "props": this.dialogForm.addFieldForm.TemplateLabel,
                        "isUsable": this.dialogForm.addFieldForm.isUsable
                    }
                    this.postAjax("/NoticeTrigger/Add",par,function(res){
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
        reviceListFn(item){
            this.addSync = false;
            this.selectId = item.id;
            this.dialogTitle = this.$t("message.Revise");
            this.dialogForm.addFieldForm={
                UniqueCode:item.key,
                isUsable:item.isUsable,
                Name:item.name,
                TemplateLabel:item.props,
            }
            this.dialog.addDialogSync = true;
        },
        reviseSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let par={
                        "id": this.selectId,
                        "key": this.dialogForm.addFieldForm.UniqueCode,
                        "name": this.dialogForm.addFieldForm.Name,
                        "props": this.dialogForm.addFieldForm.TemplateLabel,
                        "isUsable": this.dialogForm.addFieldForm.isUsable
                    }

                    this.postAjax("/NoticeTrigger/Update",par,function(res){
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
        deletListFn(item){
            this.$confirm(this.$t("message.SureToDelet"), this.$t("message.Title"), {
                confirmButtonText: this.$t("message.MakeSure"),
                cancelButtonText:  this.$t("message.Cancel"),
                type: 'warning'
            }).then(() => {
                this.fullscreenLoading = true;
                this.postAjax("/NoticeTrigger/Delete",{"id":item.id},(res)=>{
                    this.fullscreenLoading = false;
                    this.openErr(this.$t("message.DeleteSuccess"),2);
                    this.getList();
                },(res)=>{
                    that.fullscreenLoading = false;
                })
            }).catch(() => {});
        },
        TemplateManagementFn(item){
            this.$router.push({path:"/templateManagement",query:{triggerId:item.id}});
        }

    }
}
</script>
<style scoped>
.el-input {
    width: 200px;
}
</style>
