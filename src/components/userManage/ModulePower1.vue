<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.ModulePermissions") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        <div class="box">
            <div class="allTypeBox">
                <el-button type="primary" v-if="IsInArray(btnArray,4)" @click="addListFn">{{ $t("message.AddPermission") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,4)" @click="deletListFn">{{ $t("message.DeletPermission") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,4)" @click="reviseListFn">{{ $t("message.RevisePermission") }}</el-button>
                <el-button type="primary" @click="TurnBack">{{ $t("message.TurnBack") }}</el-button>
                <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>
           
            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table ref="rowClick" @row-click="rowClick"  stripe @selection-change="handleSelectionChange" :data="list" 
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column>
                    <el-table-column align="left" label="id" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Name')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Code')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.code}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.IsItAvailable')">
                        <template slot-scope="scope">
                            {{scope.row.isUsable == true ? $t("message.Y"):$t("message.N")}}
                        </template>
                    </el-table-column>
                </el-table>
            <!-- 分页 -->
                <!-- <div v-show="!listLoading">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                        :current-page="pagenation.currPage"  :page-sizes="[8,10,15, 20]" :page-size="pagenation.pageSize" 
                        layout="total, sizes, prev, pager, next, jumper"  :total="pagenation.total">
                    </el-pagination>
                </div> -->
            </div>
        </div>

    <!-- 添加权限 -->
         <el-dialog :title="dialogTitle" :visible.sync="dialog.addDialogSync" width="500px" :close-on-click-modal="isfalse" @close="cancel('addRuleForm')">
            <el-form ref="addRuleForm" class="small-space" :rules="dialogFormRules" :model="dialogForm.addFieldForm" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
                <el-form-item label="ModuleId" prop="moduleId">
                    <el-input v-model="dialogForm.addFieldForm.moduleId" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.Code')" prop="code">
                    <el-input v-model="dialogForm.addFieldForm.code"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.Name')" prop="name">
                    <el-input v-model="dialogForm.addFieldForm.name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.IsItAvailable')" prop="isUsable">
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
             
            var justNumber = (rule, value, callback) => {
                if ( /^[0-9]{1,3}$/.test(value)==false ) {
                    callback(new Error(this.$t("message.CodeCanJustNumberThrees")));
                } else {
                    callback();
                }
            };


        return {
            isfalse:false,
            menuicon: 'getMenu',
            list:null,
            btnArray:[],
            multipleSelection:[],//选中的表格数组
            listLoading:true,
            fullscreenLoading:false,
            dialogTitle:this.$t("message.AddPermission"),
            addSync:true,//添加按钮
            dialog:{ //控制每个弹出框显示隐藏的
                addDialogSync:false,
            },
            // pagenation:{
            //     total:null,//总条目数
            //     currPage: 1,//当前页
            //     pageSize: 8,//一页显示个数 
            //     title: '',
            //     type: null,//类型
            // },
            dialogForm:{//控制每个弹出框字段的
                addFieldForm: {
                    id:0,
                    code: null,
                    isUsable: true,
                    moduleId: null,
                    name:"",
                }
            },
            dialogFormRules:{
                name: [
                    {  required: true,message:this.$t("message.NameCanNotEmpty"), trigger: 'blur'}
                ],
                code:[
                    { required: true,message:this.$t("message.CodeCanNotEmpty"), trigger: 'blur' },
                    { validator: justNumber, trigger: 'blur' },
                ],

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
            console.log(this.$route.query.id)
            let that = this;
            this.postAjax("/Limit/GetPageList",{ "moduleId": this.$route.query.id},function(res){
                that.list = res.body.value;
                that.openErr(that.$t("message.SuccessToGetList"),2);
                that.listLoading = false;
            },function(res){
                console.log("路径错误");
            })
        },
         getBtn(){
            let that = this;
             this.postAjax("/Module/Limits",null,function(res){
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
        // handleSizeChange(val){ //操作分页
        //     console.log(val)
        //     this.pagenation.pageSize = val;//每页条数
        //     this.getList(); //重新请求一次
        // },
        // handleCurrentChange(val) {
        //     this.pagenation.currPage = val; //当前页码
        //     this.getList();
        // },
        addListFn(){
            this.addSync = true;
            this.dialogTitle = this.$t("message.AddPermission");
            this.dialogForm.addFieldForm={
                    id:0,
                    code: null,
                    isUsable: true,
                    moduleId: parseInt(this.$route.query.id),
                    name:""
                }
            this.dialog.addDialogSync = true;
        },
        deletListFn(){
            let that = this;
            if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseTheDelet"),1);
            }else{
                 this.$confirm(that.$t("message.SureToDelet"), that.$t("message.Title"), {
                    confirmButtonText: that.$t("message.MakeSure"),
                    cancelButtonText: that.$t("message.Cancel"),
                    type: 'warning'
                }).then(() => {
                    // for(let i=0;i<this.multipleSelection.length;i++){
                    //     let id=this.multipleSelection[i].id;
                    //     this.postAjax("/Limit/Delete",{id:id},function(res){
                    //          that.openErr(this.$t("message.DeleteSuccess"));
                    //          that.getList();
                    //     },function(res){});
                    // }
                    that.fullscreenLoading = true;

                    var data =this.multipleSelection;
                    var reques = [];
                    for (var i = data.length - 1; i >= 0; i--) {
                        let id=this.multipleSelection[i].id;
                        reques.push(
                            that.postAjax("/Limit/Delete",{id:id},function(res){},function(res){})
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
        reviseListFn(){
            this.addSync = false;
            this.dialogTitle = this.$t("message.RevisePermission");
            if(this.multipleSelection.length>1){
                this.openErr( this.$t("message.onlyChoiseOneRevise"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseTheResive"),1);
            }else{
               this.dialog.addDialogSync = true;
                this.dialogForm.addFieldForm={
                    id:this.multipleSelection[0].id,
                    code: this.multipleSelection[0].code,
                    isUsable: this.multipleSelection[0].isUsable,
                    moduleId: parseInt(this.$route.query.id),
                    name:this.multipleSelection[0].name,
                }
                
            }
        },
        addSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    this.postAjax("/Limit/Add",this.dialogForm.addFieldForm,function(res){
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
        reviseSubmitForm(formName){
            let that = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                   this.postAjax("/Limit/Update",this.dialogForm.addFieldForm,function(res){
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
        TurnBack(){
            this.$router.push({
                path: "/moduleManage"
            });
        }

    }
}
</script>
<style scoped>
.el-input {
    width: 200px;
}
</style>
