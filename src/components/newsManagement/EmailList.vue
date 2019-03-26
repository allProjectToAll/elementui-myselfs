<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.EmailList") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        <div class="box" style="padding-top:20px;">
            <div class="allTypeBox">
                <el-form :inline="true" class="demo-form-inline" label-width="80px">
                    <el-form-item :label="$t('message.Languages')">
                        <el-select v-model="Lang">
                            <el-option :label="$t('message.PleaseChoise')" value=""></el-option>
                            <el-option :key=index v-for="(item,index) in langSelect" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('message.Type')">
                            <el-select v-model="Type">
                                <el-option :label="$t('message.PleaseChoise')" value=""></el-option>
                                <el-option :key=index v-for="(item,index) in typeSelect" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    <el-form-item style="margin-top:-10px;">
                        <el-button type="primary" icon="el-icon-search" @click="getList"></el-button>
                    </el-form-item>

                </el-form>
            </div>

            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table ref="multipleTable"  stripe @selection-change="handleSelectionChange" :data="list"
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <!-- <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column> -->
                    <el-table-column align="left" :label="$t('message.Type')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.key}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="left" :label="$t('message.Languages')" width="">

                        <template slot-scope="scope">
                            <span>{{getLangText(scope.row.lang)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.UserId')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.userId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.EmailAdress')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.address}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="left" :label="$t('message.EmailContent')" width="">
                        <template slot-scope="scope">
                            <span v-html="scope.row.body"></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.CreatTime')" width="">
                        <template slot-scope="scope">
                            <span>{{ creatDay(scope.row.createTime)}}</span>
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



    </div>
</template>
<script>
export default {
    data() {

        return {
            Lang:"",
            Type:"",
            langSelect:[],
            typeSelect:[],
            list:null,
            multipleSelection:[],//选中的表格数组
            listLoading:true,
            pagenation:{
                total:null,//总条目数
                currPage: 1,//当前页
                pageSize: 8,//一页显示个数
                title: '',
                type: null,//类型
            },

        }
    },
    created: function(){
        this.getList();
        this.getLanguage();
        this.getType();
    },
    computed:{

    },
    methods:{
        getList(){
            var that = this;
            let par = {
              "pageIndex":this.pagenation.currPage,//10
              "pageSize":this.pagenation.pageSize,//(1-1)*10
              "lang":this.Lang,
              "key": this.Type,
            };
             this.postAjax("/NoticeEmail/GetPageList",par,function(res){
                that.list = res.body.value.items;
                that.pagenation.total = res.body.value.totalItems;
                that.listLoading = false;
                that.openErr(that.$t("message.SuccessToGetList"),2);
            },function(res){
                console.log("路径错误");
            })
        },
        getLanguage(){
            var that = this;
            let par = {
               "includeDefault": false
            };
             this.postAjax("/Lang/GetOptions",par,function(res){
                that.langSelect = res.body.value;
                console.log(that.langSelect);
            },function(res){
                console.log("路径错误");
            })
        },
        getLangText(lang){
            for(let i=0;i<this.langSelect.length;i++){
                if(this.langSelect[i].value==lang){
                    return this.langSelect[i].text
                }
            }
        },
        getType(){
            var that = this;
            this.postAjax("/NoticeTrigger/GetKeys",null,function(res){
                that.typeSelect = res.body.value;
            },function(res){
                console.log("路径错误");
            })
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
        // search(){
        //     var that = this;
        //     let par = {
        //       "pageIndex":this.pagenation.currPage,//10
        //       "pageSize":this.pagenation.pageSize,//(1-1)*10
        //       "lang":this.Lang,
        //       "key": this.Type,
        //     };
        //      this.postAjax("/Notice/GetEmailPageList",par,function(res){
        //         that.list = res.body.value.items;
        //         that.pagenation.total = res.body.value.totalItems;
        //         that.listLoading = false;
        //     },function(res){
        //         console.log("路径错误");
        //     })
        // }

    }
}
</script>
<style scoped>
.el-input {
    width: 200px;
}
</style>
