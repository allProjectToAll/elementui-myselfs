<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.ModuleManagement") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        <div class="box">
            <div class="allTypeBox">
                <el-button type="primary" v-if="IsInArray(btnArray,1)"  @click="addModel">{{ $t("message.NewModule") }}</el-button>
                <!-- <el-button type="primary" v-if="IsInArray(btnArray,3)"  @click="deletModel">{{ $t("message.DeletModule") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,2)"  @click="reviseModel">{{ $t("message.ResiseModule") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,4)" @click="modelPower">{{$t("message.ModulePermissions")}}</el-button> -->
                <el-button icon="el-icon-refresh" type="primary" @click="getArrayList"></el-button>
            </div>

            <el-table class="moduleControlBox" ref="rowClick" :data="getList" v-loading.body="listLoading"
            :element-loading-text="$t('message.HardLoading')" >
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table ref="rowClick1" :data="scope.row.children" :show-header=false  fit>
                            <!-- <el-table-column align="left" v-model="multipleSelectioneach"  type="selection"  width="55">
                            </el-table-column> -->
                            <el-table-column align="left" :label="$t('message.Name')" prop="name">
                            </el-table-column>
                            <el-table-column align="left" :label="$t('message.ModuleIdentification')" prop="moduleKey">
                            </el-table-column>
                            <el-table-column align="left" :label="$t('message.UrlAddress')" prop="moduleUrl">
                            </el-table-column>
                            <el-table-column align="left" label="$t('message.Icon')" width="">
                                <template slot-scope="scope">
                                    <i class="{scope.row.icon}"></i>
                                </template>
                            </el-table-column>
                            <el-table-column align="left" :label="$t('message.Order')" prop="sortIndex">
                            </el-table-column>
                            <el-table-column align="left" :label="$t('message.IsItAvailable')">
                                <template slot-scope="scope">
                                    {{scope.row.isUsable == true ? $t('message.Y'):$t('message.N')}}
                                </template>
                            </el-table-column>
                            <el-table-column align="left" :label="$t('message.handle')" width="150">
                                <template slot-scope="scope">
                                    <el-button size="small" type="primary"  v-if="IsInArray(btnArray,2)"  @click="reviseModel(scope.row)">{{ $t("message.Revise") }}</el-button>
                                    <el-button size="small" type="danger"  v-if="IsInArray(btnArray,3)"  @click="deletModel(scope.row)">{{ $t("message.Delet") }}</el-button>
                                    <el-button size="small"  v-if="IsInArray(btnArray,4)"  @click="modelPower(scope.row)">{{ $t("message.limitModel") }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <!-- <el-table-column align="left" disabled   type="selection"  width="55">
                </el-table-column> -->
                <el-table-column align="left" :label="$t('message.Name')" prop="name">
                </el-table-column>
                <el-table-column align="left" :label="$t('message.ModuleIdentification')" prop="moduleKey">
                </el-table-column>
                <el-table-column align="left" :label="$t('message.UrlAddress')" prop="moduleUrl">
                </el-table-column>
                <el-table-column align="left" :label="$t('message.Icon')" width="">
                    <template slot-scope="scope">
                        <i :class="scope.row.icon"></i>
                    </template>
                </el-table-column>
                <el-table-column align="left" :label="$t('message.Order')" prop="sortIndex">
                </el-table-column>
                <el-table-column align="left" :label="$t('message.IsItAvailable')">
                     <template slot-scope="scope">
                        {{scope.row.isUsable == true ? $t("message.Y"):$t("message.N")}}
                    </template>
                </el-table-column>
                <el-table-column align="left" :label="$t('message.handle')" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary"  v-if="IsInArray(btnArray,2)"  @click="reviseModel(scope.row)">{{ $t("message.Revise") }}</el-button>
                        <el-button size="small" type="danger"  v-if="IsInArray(btnArray,3)"  @click="deletModel(scope.row)">{{ $t("message.Delet") }}</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>

        <!-- 添加模块 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialog.addModelSync" width="500px" :close-on-click-modal="isfalse" @close="cancle('addModelRuleForm')">
            <el-form ref="addModelRuleForm" class="small-space" :rules="rules"
             :model="dialogForm.addModelForm" label-position="left" label-width="80px"
              style='width: 300px; margin-left:50px;'>
                <el-form-item :label="$t('message.Name')" prop="name">
                    <el-input v-model="dialogForm.addModelForm.name" :placeholder="$t('message.PleaseEnterName')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.ModuleIdentification')" prop="moduleKey">
                    <el-input v-model="dialogForm.addModelForm.moduleKey" :placeholder="$t('message.PleaseEnterModuleID')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.SuperiorName')" prop="parentId">
                    <el-select v-model="dialogForm.addModelForm.parentId" :placeholder="$t('message.PleaseEnterSuperiorModule')">
                        <el-option :label="$t('message.RootModule')" value="0"></el-option>
                        <el-option :key=index v-for="(item,index) in getselectParentId" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('message.UrlAddress')" prop="moduleUrl">
                    <el-input v-model="dialogForm.addModelForm.moduleUrl" :placeholder="$t('message.PleaseEnterURLAddress')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.ModuleIcon')" prop="icon">
                    <el-input v-model="dialogForm.addModelForm.icon" :placeholder="$t('message.PleaseEnterModuleIcon')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.Order')" prop="sortIndex">
                    <el-input v-model="dialogForm.addModelForm.sortIndex" :placeholder="$t('message.PleaseEnterOrder')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.IsItAvailable')" prop="isUsable">
                     <el-checkbox v-model="dialogForm.addModelForm.isUsable"></el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle('addModelRuleForm')">{{ $t("message.Cancel") }} </el-button>
                <el-button v-if="addSync" type="primary"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                @click="addModelSubmitForm('addModelRuleForm')">{{ $t("message.Add") }} </el-button>
                <el-button v-else type="primary"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 @click="reviseModelSubmitForm('addModelRuleForm')">{{ $t("message.Revise") }} </el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
export default {
    data() {
        var justNumber = (rule, value, callback) => {
                if ( /^[0-9]*$/.test(value)==false ) {
                    callback(new Error(this.$t("message.OrderOnlyNumber")));
                } else {
                    callback();
                }
            };
        return {
            isfalse:false,
            listLoading:true,
            btnArray:[],
            fullscreenLoading:false,
            multipleSelectioneach:[],//单个选中的选项
            multipleSelectionBox:[],//整体选中的选项
            list:[],
            selectParentId:[],
            addSync:true,
            dialogTitle:this.$t("message.NewModule"),
            dialog:{
                addModelSync:false,
            },
            dialogForm:{//控制每个弹出框字段的
                addModelForm: {
                    id:"",
                    name: "",
                    moduleKey: "",
                    parentId: "0",
                    moduleUrl: "",
                    icon: "",
                    sortIndex: "",
                    isUsable: true
                }
            },
            rules:{
                name:[
                    { required: true, message: this.$t("message.NameCanNotEmpty"),trigger: 'blur'},
                ],
                moduleKey: [
                    { required: true, message: this.$t("message.ModuleIdentificationCannoEmpty"),trigger: 'blur'},
                ],
                parentId: [
                    { required: true, message: this.$t("message.SuperiorModuleNotEmpty"),trigger: 'blur'},
                ],
                sortIndex: [
                    { required: true, message: this.$t("message.OrderOnlyNumber"),trigger: 'blur'},
                    { validator: justNumber, trigger: 'blur' },
                ]
            }
        }
    },
    created: function(){
        this.getArrayList();
        this.getBtn();
    },
    computed:{
        getList:function(){
            console.log(this.list);
            var tree = [];
            for (var i = this.list.length - 1; i >= 0; i--) {
                var item = this.list[i];
                tree.push({
                    id:item.id,
                    icon:item.icon,
                    isUsable:item.isUsable,
                    moduleKey:item.moduleKey,
                    moduleUrl:item.moduleUrl,
                    name:item.name,
                    sortIndex:item.sortIndex,
                    parentId:item.parentId,
                    children:[]
                });
            }

            var treeDic = {};
            for (var i = tree.length - 1; i >= 0; i--) {
                var treeNode = tree[i];
                treeDic[treeNode.id] = treeNode;
            }

           for (var i = tree.length - 1; i >= 0; i--) {
                var treeNode = tree[i];
                if (treeNode.parentId !=0 && treeDic[treeNode.parentId]) {
                    treeDic[treeNode.parentId].children.push(treeNode);
                }
            }

            let ListArrays=[];
            for(let i=0;i<tree.length;i++){
                if(tree[i].parentId==0){
                    ListArrays.push(tree[i])
                }
            }
            console.log(ListArrays);
            console.log(999);
            ListArrays = ListArrays.sort(this.compare('sortIndex'));
            for(var i=0;i<ListArrays.length;i++){
                if(ListArrays[i].children){
                    ListArrays[i].children = ListArrays[i].children.sort(this.compare('sortIndex'));
                }else{
                    console.log("没有子集")
                }
            }
            this.listLoading = false;
            return ListArrays;
        },
        getselectParentId:function(){
            let selectParentIdArray = [];
            for(let i=0;i<this.getList.length;i++){
                if(this.getList[i].parentId == 0){
                    selectParentIdArray.push(this.getList[i])
                }
            }
            return selectParentIdArray;
        }
    },
    methods:{
        cancle(formName){
             this.dialog.addModelSync = false;
            if (this.$refs[formName]!==undefined) {
                this.$refs[formName].resetFields();
            }
        },
        getArrayList(){
            let that = this;
            this.postAjax("/Module/GetAllList",null,function(res){
                that.list = res.body.value;
                that.openErr(that.$t("message.SuccessToGetList"),2);
                // console.log(that.list);
            },function(res){
                console.log("路径错误");
            })
        },
        compare(property){ //arr.sort(compare('age'))
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
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
        
        addModel(){
            this.addSync = true;
            this.dialogTitle = this.$t("message.NewModule");
            this.dialogForm.addModelForm={
                    name: "",
                    moduleKey: "",
                    parentId: "0",
                    moduleUrl: "",
                    icon: "",
                    sortIndex: "",
                    isUsable: true
                }
            this.dialog.addModelSync = true;
        },
        deletModel(item){
            this.$confirm(this.$t("message.SureToDelet"), this.$t("message.Title"), {
                confirmButtonText: this.$t("message.MakeSure"),
                cancelButtonText: this.$t("message.Cancel"),
                type: 'warning'
            }).then(() => {
                this.postAjax("/Module/Delete",{"id":item.id},(res)=>{
                    this.fullscreenLoading = false;
                    this.openErr(this.$t("message.DeleteSuccess"),2);
                    this.getArrayList();
                },(res)=>{})
             }).catch(() => {});
        },
        reviseModel(item){
            console.log(item)
            this.addSync = false;
            this.dialogTitle = this.$t("message.ResiseModule");
            this.dialogForm.addModelForm={
                    id:item.id,
                    name: item.name,
                    moduleKey: item.moduleKey,
                    parentId: item.parentId+"",
                    moduleUrl: item.moduleUrl,
                    icon: item.icon,
                    sortIndex: item.sortIndex,
                    isUsable: item.isUsable
                }
            this.dialog.addModelSync = true;

        },
        modelPower(item){
            this.$router.push({path:"/modulePower",query:{id:item.id}});
        },
        addModelSubmitForm(formName){
             let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    this.postAjax("/Module/Add",this.dialogForm.addModelForm,function(res){
                         that.fullscreenLoading = false;
                       that.openErr(that.$t("message.AddSuccess"),2);
                       that.getArrayList();
                        that.dialog.addModelSync = false;

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
        reviseModelSubmitForm(formName){
            let that = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                   this.postAjax("/Module/Update",this.dialogForm.addModelForm,function(res){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.ServiceSuccess"),2);
                        that.getArrayList();
                        that.dialog.addModelSync = false;
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
.moduleControlBox{
    width: 100%;
    margin-top:10px;
}
.el-table{
    margin-bottom:30px;
}
.el-table__expanded-cell[class*=cell]{
    padding:0!important;
}
.el-dialog{
    width:300px!important;
}
</style>
