<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.RealNameManagement") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>

        <div class="box">
            <div class="allTypeBox" style="padding-top:30px!important;">
                <el-form :inline="true" class="demo-form-inline" label-width="80px">
                    <el-form-item :label="$t('message.AuthenticationCategory')" align="left">
                        <el-select v-model="search.authentication">
                            <el-option :label="$t('message.NoAuthentication')" value="0"></el-option>
                            <el-option :label="$t('message.CertificateCertification')" value="1"></el-option>
                            <el-option :label="$t('message.PassportCertification')" value="3"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('message.AuditStatus')" align="left">
                        <el-select v-model="search.status">
                            <!-- <el-option :label="$t('message.NoStatus')" value="0"></el-option> -->
                            <el-option :label="$t('message.ApplyForReview')" value="1"></el-option>
                            <el-option :label="$t('message.ReviewPass')" value="2"></el-option>
                            <el-option :label="$t('message.ReviewNoPass')" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                  <br>
                    <el-input :placeholder="$t('message.EnterAdminNameSearch')" clearable v-model="search.AdminName" style="margin-top:-5px;"></el-input>
                    <el-input :placeholder="$t('message.EnterEmailSearch')" clearable v-model="search.AdminEmail" style="margin-top:-5px;"></el-input>
                    <el-input :placeholder="$t('message.EnterPhoneSearch')" clearable v-model="search.AdminPhone" style="margin-top:-5px;"></el-input>
                    <el-input :placeholder="$t('message.cardNoPassed')" clearable v-model="search.idNo" style="margin-top:-5px;"></el-input>
                   <el-form-item style="margin-top:-10px;">
                        <el-button type="primary" icon="el-icon-search" @click="getList"></el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="allTypeBox">
                <!-- <el-button type="primary" :element-loading-text="$t('message.Inprocessing')"
              v-loading.fullscreen.lock="fullscreenLoading"
               v-if="IsInArray(btnArray,1)"  @click="deTailMessage">{{ $t("message.DeTailMessage") }}</el-button> -->
               <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>

            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table ref="rowClick"  stripe :data="list"
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.UserId2')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.userId}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="left" :label="$t('message.userName')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.firstName}}&nbsp;{{scope.row.lastName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.email')" width="">
                        <template slot-scope="scope">
                        <span>{{scope.row.email}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.phone')" width="">
                        <template slot-scope="scope">
                        <span>{{scope.row.phoneNumber}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="left" :label="$t('message.AuthenticationCategory')" width="">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type==0">{{ $t("message.NoAuthentication") }}</span>
                            <span v-else-if="scope.row.type==1">{{ $t("message.CertificateCertification") }}</span>
                            <span v-else-if="scope.row.type==3">{{ $t("message.PassportCertification") }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.level')" width="">
                        <template slot-scope="scope">
                        <span v-if="scope.row.level==0">{{ $t("message.NoAuthentication") }}</span>
                        <span v-else-if="scope.row.level==1">{{ $t("message.PrimaryCertification") }}</span>
                        <span v-else-if="scope.row.level==2">{{ $t("message.HeightCertification") }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.EnterCarNumberSearch')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.idNo}}</span>
                        </template>
                    </el-table-column>


                    <el-table-column align="left" :label="$t('message.AuditStatus')" width="">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status==0">{{ $t("message.NoStatus") }}</span>
                            <span v-else-if="scope.row.status==1">{{ $t("message.ApplyForReview") }}</span>
                            <span v-else-if="scope.row.status==2">{{ $t("message.ReviewPass") }}</span>
                            <span v-else-if="scope.row.status==3">{{ $t("message.ReviewNoPass") }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="left" :label="$t('message.Reviewer')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.managerName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.CreatTime')" width="">
                        <template slot-scope="scope">
                            <span>{{creatDay(scope.row.createTime)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.AuditTime')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.status==1?"":creatDay(scope.row.auditTime)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.handle')" width="150">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary"  v-if="IsInArray(btnArray,1)"  @click="deTailMessage(scope.row)">{{ $t("message.DeTailMessage") }}</el-button>
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

        <!-- 详情-->
        <el-dialog :title="$t('message.AuthenticationDetails')  " :visible.sync="dialog.addDialogSync" width="500px">
            <table class="tableDialog"  cellpadding="0" cellspacing="0" >
                <tr>
                    <td class="firstTd">{{ $t("message.AuthenticationCategory") }}</td>
                    <td>
                        <div class="secondTd">
                        <template>
                            <span v-if="detail.AuthenticationCategory==0">{{ $t("message.NoAuthentication") }}</span>
                            <span v-else-if="detail.AuthenticationCategory==1">{{ $t("message.CertificateCertification") }}</span>
                            <span v-else-if="detail.AuthenticationCategory==3">{{ $t("message.PassportCertification") }}</span>
                        </template>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>{{ $t("message.Imagers") }}</td>
                    <td><div class="secondTd">
                        <template>
                            <img :src="getImg(item)" @click="openImag($event)" :key=index v-for="(item,index) in detail.Imagers"  width="50" style="float:left;cursor:pointer;"/>
                        </template>
                        </div>
                    </td>
                </tr>
                <tr><td>{{ $t("message.AuthenticationData") }}</td>
                    <td><div class="secondTd">
                            <div>{{ $t("message.CountryCode") }} : {{detail.AuthenticationData.CountryCode?detail.AuthenticationData.CountryCode:""}}</div>
                            <div>{{ $t("message.CountryName") }} : {{detail.AuthenticationData.CountryName?detail.AuthenticationData.CountryName:""}}</div>
                            <div>{{ $t("message.CertType") }} : 
                                <span v-if="detail.AuthenticationData.CertType=='0'">{{ $t("message.NoAuthentication") }}</span>
                                <span v-if="detail.AuthenticationData.CertType=='1'">{{ $t("message.CertificateCertification") }}</span>
                                <span v-if="detail.AuthenticationData.CertType=='3'">{{ $t("message.PassportCertification") }}</span>
                            </div>
                            <div>{{ $t("message.CardNumber") }} : {{detail.AuthenticationData.CardNumber?detail.AuthenticationData.CardNumber:""}}</div>
                            <div>{{ $t("message.FirstName") }} : {{htmlDecodeByRegExp(detail.AuthenticationData.FirstName?detail.AuthenticationData.FirstName:"1")}}</div>
                            <div>{{ $t("message.LastName") }} : {{htmlDecodeByRegExp(detail.AuthenticationData.LastName?detail.AuthenticationData.LastName:"1")}}</div>
                        </div>
                    </td>
                </tr>
                <tr><td>{{ $t("message.Statu") }}</td>
                    <td>
                        <div class="secondTd">
                        <template>
                            <span v-if="detail.Statu==0">{{ $t("message.NoStatus") }}</span>
                            <span v-else-if="detail.Statu==1">{{ $t("message.ApplyForReview") }}</span>
                            <span v-else-if="detail.Statu==2">{{ $t("message.ReviewPass") }}</span>
                            <span v-else-if="detail.Status==3">{{ $t("message.ReviewNoPass") }}</span>
                        </template>
                        </div>
                    </td>
                </tr>

                <tr><td>{{ $t("message.ReviewerId") }}</td>
                    <td>   
                        <div class="secondTd">
                            {{detail.ReviewerId}}
                        </div>
                    </td>
                </tr>
                <tr><td>{{ $t("message.AuditTime") }}</td>
                    <td>
                        <div class="secondTd">
                        {{detail.Statu==1?"":creatDay(detail.AuditTime)}}
                        </div>
                    </td>
                </tr>
                <tr><td>{{ $t("message.AuthenticationRemark") }}</td>
                    <td>
                        <div class="secondTd">
                        {{detail.AuthenticationRemark}}
                        </div>
                    </td>
                </tr>
                <tr><td>{{ $t("message.ApplyTime") }}</td>
                    <td>
                        <div class="secondTd">
                        {{creatDay(detail.ApplyTime)}}
                        </div>
                    </td>
                </tr>
            </table>
            <div slot="footer" class="dialog-footer"><!-- dialog.addDialogSync = false -->
                <el-button type="primary"  v-if="IsInArray(btnArray,2)" @click="ToReviewer" :disabled="isExamAsyn">{{ $t("message.ToReviewer") }}</el-button>
            </div>
        </el-dialog>

        <!-- 审核 -->
        <el-dialog :title="$t('message.Review')" :visible.sync="dialog.reviewDialog" width="500px">
            <el-form ref="addRuleForm" class="small-space" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
                <el-form-item :label="$t('message.UserId2')">
                    <el-input v-model="Review.userId" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.AuthenticationCategory')" >
                    <span v-if="Review.type==0"><el-input :value="$t('message.NoAuthentication')" disabled></el-input></span>
                    <span v-else-if="Review.type==1"><el-input :value="$t('message.CertificateCertification')" disabled></el-input></span>
                    <span v-else-if="Review.type==3"><el-input :value="$t('message.PassportCertification')" disabled></el-input></span>

                </el-form-item>
                <el-form-item :label="$t('message.Remarks')">
                    <el-input v-model="Review.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="pass('0')"
                :element-loading-text="$t('message.Inprocessing')"
              v-loading.fullscreen.lock="fullscreenLoading"
              >{{ $t("message.NoPass") }}</el-button>
                <el-button type="primary" @click="pass('1')"
                :element-loading-text="$t('message.Inprocessing')"
              v-loading.fullscreen.lock="fullscreenLoading"
              >{{ $t("message.Pass") }}</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="dialog.imgAsync" width="700px">
            <img :src="bigImgSrc"  style="max-width:650px;margin:0 auto;display:block;" />
            <!-- <img src="http://img.zcool.cn/community/0181845834f4eda8012060c8c95113.JPG@1280w_1l_2o_100sh.png" /> -->
            
        </el-dialog>


    </div>
</template>
<script>
export default {
    data() {
        return {
            bigImgSrc:"",
            isExamAsyn:false,
            list:null,
            multipleSelection:[],//选中的表格数组
            listLoading:true,
            fullscreenLoading:false,
            btnArray:[],
            pagenation:{
                total:null,//总条目数
                currPage: 1,//当前页
                pageSize: 8,//一页显示个数
                title: '',
                type: null,//类型
            },
            search:{
                authentication:'0',
                AdminPhone:'',
                AdminEmail:'',
                AdminName:'',
                status:'1',
                idNo:"",
            },
            dialog:{
                addDialogSync:false,
                reviewDialog:false,
                imgAsync:false,
            },
            detail:{
                AuthenticationCategory:"",
                Imagers:"",
                AuthenticationData:"",
                Statu:"",
                ReviewerId:"",
                AuditTime:"",
                AuthenticationRemark:"",
                ApplyTime:"",

            },
            Review:{
                userId:"",
                result:"",//通过为true,驳回为false
                remark:"",
                type:"",
            },
            selectArray:{},


        }
    },
    created: function(){
        this.getList();
        this.getBtn();
    },
    computed:{

    },
    methods:{
        getList(){
            var that = this;
            let par = {
                "pageIndex":this.pagenation.currPage,//10
                "pageSize":this.pagenation.pageSize,//(1-1)*10
                "level": 0,
                "type": this.search.authentication,
                "status":this.search.status,
                "managerName": this.search.AdminName,
                'email':this.search.AdminEmail,
                'phoneNumber':this.search.AdminPhone,
                'idNo':this.search.idNo
            };
            this.postAjax("/Certification/GetPageList",par,function(res){
                that.list = res.body.value.items;
                that.pagenation.total = res.body.value.totalItems;
                that.listLoading = false;
                that.openErr(that.$t("message.SuccessToGetList"),2);
            },function(res){
                console.log("路径错误");
            })
        },
        openImag(src){
            if(src){
                this.dialog.imgAsync = true;
                this.bigImgSrc = src.target.currentSrc;
                console.log(src.target.currentSrc)
            }
        },
        getImg(id){
            return this.$store.state.url+"/Image/"+(this.selectArray?this.selectArray.userId:"no")+"/"+id;
        },
        getBtn(){
            let that = this;
             this.postAjax("/Certification/Limits",null,function(res){
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
        deTailMessage(item){//详细信息
                this.selectArray = item;
                if(item.status == "2"||item.status == "3"){
                    this.isExamAsyn = true;
                }else{
                    this.isExamAsyn = false;
                }
                let par = {
                    "userId": item.userId
                }
                 this.postAjax("/Certification/Detail",par,(res)=>{
                    this.fullscreenLoading = false;
                    this.dialog.addDialogSync = true;
                    let data = res.body.value;
                    this.detail = {
                            AuthenticationCategory:data.cerType,
                            Imagers:data.images,
                            AuthenticationData:JSON.parse(data.data),
                            Statu:data.status,
                            ReviewerId:data.auditManagerId,
                            AuditTime:data.auditTime,
                            AuthenticationRemark:data.auditRemark,
                            ApplyTime:data.createTime,
                    }
                },(res)=>{
                    console.log("路径错误");
                    this.fullscreenLoading = false;
                })

            // }
        },
        ToReviewer(){
            this.dialog.reviewDialog = true;
            this.Review={
                userId:this.selectArray.userId,
                result:"0",
                remark:"",
                type:this.selectArray.type,
            }
        },
        pass(index){
            let that = this;
            that.fullscreenLoading = true;
            this.Review.result = index;
            this.Review.result = index;
            if(index!=1){
                if(this.Review.remark.trim()==""){
                    that.openErr(that.$t("message.RemarksNotEmpty"),2);
                    that.fullscreenLoading = false;
                    return;
                }
            }else{
                this.Review.remark="审核通过";
            }
            let par = {
                "userId":this.Review.userId,
                "result": index==1?true:false,
                "remark": this.Review.remark
            }
            this.postAjax("/Certification/Audit",par,function(res){
                that.fullscreenLoading = false;
                that.dialog.addDialogSync = false;
                that.dialog.reviewDialog = false;
                if(index==0){
                    that.openErr(that.$t("message.DismissSuccess"),2);
                }else if(index==1){
                    that.openErr(that.$t("message.ReviewSuccess"),2);
                }
                setTimeout(() => {
                    that.getList();
                }, 500);

            },function(res){
                console.log("路径错误");
                that.fullscreenLoading = false;
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
    /* border:1px solid #ccc; */
    padding:5px;
}
.tableDialog tr{
    border-bottom:1px solid #ccc;
}
.tableDialog tr td{
    padding:5px;
    border-bottom:1px solid #eee;
}
.firstTd{
    width:100px!important;
    display:block;
}
.secondTd{
    /* display:block; */
    width:335px;
    word-break: break-all;
}
</style>
