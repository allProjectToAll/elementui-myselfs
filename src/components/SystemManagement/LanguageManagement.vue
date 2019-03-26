<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.languageManagement") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        
        <div class="box">
            <div class="allTypeBox">
                <el-select v-model="searchMess" filterable :placeholder="$t('message.PleaseChoiseGroup')" @change="getList">
                    <el-option value="" :label ="$t('message.PleaseChoiseGroup')">
                    </el-option>
                    <el-option v-for="(item,index) in searGroup" :key="index" :label="item" :value="item">
                    </el-option>
                </el-select>

                <el-button type="primary" v-if="IsInArray(btnArray,1)" @click="addListFn">{{ $t("message.Added") }}</el-button>
                <!-- <el-button type="primary" v-if="IsInArray(btnArray,2)" @click="reviceListFn">{{ $t("message.Revise") }}</el-button>
                <el-button type="primary" v-if="IsInArray(btnArray,3)" @click="deletListFn">{{ $t("message.Delet") }}</el-button> -->
                
                
                <el-upload style="display:inline-block;"
                    class="upload-demo"
                    :show-file-list="false"
                    :action="action"
                    name="data"
                    :headers="headers"
                    :on-success="upDateSuccess"
                    :on-error="upDateError"
                    :file-list="fileList">
                    <el-button type="primary">{{ $t("message.importCsv") }}</el-button>
                </el-upload>
                <el-button type="primary" @click="exportCsvFn">{{ $t("message.exportCsv") }}</el-button>
                <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>
           
            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table ref="rowClick" stripe  :data="list" 
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <!-- <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column> -->
                   
                    <!-- <el-table-column align="left" :label="$t('message.Code')">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column align="left" :label="$t('message.Group')">
                        <template slot-scope="scope">
                            <span>{{scope.row.group}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column align="left" :label="$t('message.SentenceCode')">
                        <template slot-scope="scope">
                            <span>{{scope.row.key}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="left" :label="$t('message.cnTrans')">
                        <template slot-scope="scope">
                            <span :key=index v-for="(item,index) in scope.row.langTexts" v-if="item.lang==2">{{item.text}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="left" :label="$t('message.engTrans')">
                        <template slot-scope="scope">
                            <span :key=index v-for="(item,index) in scope.row.langTexts" v-if="item.lang==1">{{item.text}}</span>
                        </template>
                    </el-table-column>


                    <el-table-column align="left" :label="$t('message.handle')" width="150">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary"  v-if="IsInArray(btnArray,2)"  @click="reviceListFn(scope.row)">{{ $t("message.Revise") }}</el-button>
                            <el-button size="small" type="danger"  v-if="IsInArray(btnArray,3)"  @click="deletListFn(scope.row)">{{ $t("message.Delet") }}</el-button>
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
                <el-form-item :label="$t('message.Codes')" prop="key">
                    <el-input v-model="dialogForm.addFieldForm.key"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.Group')" prop="group">
                    <el-input v-model="dialogForm.addFieldForm.group"></el-input>
                </el-form-item>

                <el-form-item label-width="0">
                    <el-table stripe :data="languList" border highlight-current-row fit  style="width: 100%">
                        <el-table-column align="center" :label="$t('message.Languages')">
                            <template slot-scope="scope">
                                <span>{{scope.row.lang.text}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" :label="$t('message.Text')">
                            <template slot-scope="scope">
                                <span>{{scope.row.text}}</span>
                            </template>
                        </el-table-column>
                        
                        <el-table-column align="center" :label="$t('message.handle')">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="deleteRow(scope.$index,languList)"
                                type="text" size="small">
                                    {{ $t("message.Delet") }}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>

                <el-form-item :label="$t('message.Languages')" prop="lang">
                    <el-select v-model="dialogForm.addFieldForm.lang" :placeholder="$t('message.Languages')">
                        <el-option :key=index v-for="(item,index) in languageSelect" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  :label="$t('message.Text')" prop="text">
                    <el-input v-model="dialogForm.addFieldForm.text" class="text"></el-input>
                    <el-button type="primary" icon="el-icon-plus" circle @click="addLanguText"></el-button>
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
            fileList:[],
            action:`${this.$store.state.url}${"/Lang/ImportCsv"}`,
            headers: { Authorization:`Bearer ${this.$store.state.token||sessionStorage.getItem("token")}`,Lang:localStorage.getItem("langular") || "cn" },
            isfalse:false,
            menuicon: 'getMenu',
            dialogTitle: this.$t("message.Added"),
            list:null,
            btnArray:[],
            searGroup:[],
            searchMess:null,
            addSync:false,
            languageSelect:[],
            multipleSelection:[],//选中的表格数组
            listLoading:true,
            fullscreenLoading:false,
            languList:[],
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
                    id: 0,
                    key: "",
                    group: "",
                    langTexts:[],
                    lang:"2",
                    text:"",
                }
            },
            dialogFormRules:{
                group: [
                    { required: true, message: this.$t("message.GroupNotEmpty"), trigger: 'blur' },
                ],
                key:[
                    { required: true, message: this.$t("message.CodeNotEmpty"), trigger: 'blur' },
                ]
            },
            selectId:"",
        }
    },
    created: function(){ 
        this.getGroup();
        this.getList();
        this.getLanguage();
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
                "groups": that.searchMess?[that.searchMess]:[]
            }
            
             this.postAjax("/Lang/GetList",par,function(res){
                that.list = res.body.value ;
                that.listLoading = false;
                that.openErr(that.$t("message.SuccessToGetList"),2);
            },function(res){
                console.log("路径错误");
            })
        },
        getBtn(){
            let that = this;
             this.postAjax("/Lang/Limits",null,function(res){
                console.log(res.body.value);
                that.btnArray = res.body.value;
            },function(res){
                console.log("路径错误");
                that.openErr(that.$t("message.ErrorToGetBtnLimit"),1);
            })
        },
        getGroup(){
            let that = this;
            this.postAjax("/Lang/GetGroups",null,function(res){
                that.searGroup = res.body.value;
                console.log(res.body.value);
            },function(res){})
        },
        getLanguage(){
            let that = this;
            this.postAjax("/Lang/GetOptions",{"includeDefault": false},function(res){
                that.languageSelect = res.body.value;
            },function(res){})
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
                    id: 0,
                    key: "",
                    group: "",
                    langTexts:[],
                    lang:2,
                    text:"",
                }
                
            this.languList=[];
            this.dialog.addDialogSync = true;
        },
        addSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    
                    let array=[];
                    for(let i=0;i<that.languList.length;i++){
                        array.push({
                            lang:that.languList[i].lang.val,
                            text:that.languList[i].text,
                        });
                    }
                    let par={
                        id: 0,
                        key: this.dialogForm.addFieldForm.key,
                        group: this.dialogForm.addFieldForm.group,
                        langTexts:array
                    }
                    this.postAjax("/Lang/Add",par,function(res){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.AddSuccess"),2);
                        that.getList();
                        that.getGroup();
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
            this.dialogTitle = this.$t("message.Revise");

            this.dialogForm.addFieldForm={
                id: 0,
                key:item.key,
                group: item.group,
                langTexts:item.langTexts,
                lang:2,
                text:'',
            }
            this.selectId = item.id;
                let text = "";
                this.languList = [];
            for(let i=0;i<this.dialogForm.addFieldForm.langTexts.length;i++){
                for(let j=0;j<this.languageSelect.length;j++){
                    if(this.dialogForm.addFieldForm.langTexts[i].lang == this.languageSelect[j].value && this.dialogForm.addFieldForm.langTexts[i].text!=""){
                        this.languList.push({
                            lang:{
                            val:this.dialogForm.addFieldForm.langTexts[i].lang,
                            text:this.languageSelect[j].text,
                            },
                            text:this.dialogForm.addFieldForm.langTexts[i].text
                        });

                    }
                }
            }
            this.dialog.addDialogSync = true;
        },
        reviseSubmitForm(formName){
           let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let array=[];
                    for(let i=0;i<that.languList.length;i++){
                        array.push({
                            lang:that.languList[i].lang.val,
                            text:that.languList[i].text,
                        });
                    }
                    let par={
                        id: this.selectId,
                        key: this.dialogForm.addFieldForm.key,
                        group: this.dialogForm.addFieldForm.group,
                        langTexts:array
                    }
                    console.log(par);
                    this.postAjax("/Lang/Update",par,function(res){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.ServiceSuccess"),2);
                        that.getList();
                        that.getGroup();
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
                this.postAjax("/Lang/Delete",{"id":item.id},(res)=>{
                    this.fullscreenLoading = false;
                    this.openErr(this.$t("message.DeleteSuccess"),2);
                    this.getList();
                },(res)=>{
                    this.fullscreenLoading = false;
                })
            }).catch(() => {});
            
        },
        deleteRow(index, rows){
            rows.splice(index, 1);
        },
        addLanguText(){
            if(this.dialogForm.addFieldForm.text===""){
                this.openErr(this.$t("message.TextNotEmpty"),1);
            }else{
                let text = "";
                for(let i=0;i<this.languageSelect.length;i++){
                    if(this.dialogForm.addFieldForm.lang== this.languageSelect[i].value){
                        text = this.languageSelect[i].text;
                    }
                }
                if(this.languList.length>0){
                    let n=0;
                    for(let j=0;j<this.languList.length;j++){
                        if(this.languList[j].lang.val==this.dialogForm.addFieldForm.lang){
                            n=1;
                        }
                    }
                    if(n==1){
                        this.openErr(this.$t("message.SameLangNotSecond"),1);
                    }else{
                        this.languList.push({
                            lang:{
                                val:this.dialogForm.addFieldForm.lang,
                                text:text
                            },
                            text:this.dialogForm.addFieldForm.text,
                        })
                        this.dialogForm.addFieldForm.text = "";
                    }
                }else{
                    this.languList.push({
                        lang:{
                            val:this.dialogForm.addFieldForm.lang,
                            text:text
                        },
                        text:this.dialogForm.addFieldForm.text,
                    })
                    this.dialogForm.addFieldForm.text = "";
                }
            }
        },
        exportCsvFn(){
            window.open(this.$store.state.url+'/Lang/ExportCsv');
        },
        upDateSuccess(response, file, fileList){//文件上传成功时的钩子
            // console.log(response,file,fileList,222);
            this.fileList = [];
            this.openErr(this.$t("message.importCsvSuccess"),2);
            this.getList();
        },
        upDateError(err, file, fileList){//文件上传失败时的钩子
            // console.log(err, file, fileList,333);
            this.openErr(this.$t("message.importCsvError"),1);
        }
    }
}
</script>
<style scoped>
.el-input {
    width: 200px;
}

</style>
