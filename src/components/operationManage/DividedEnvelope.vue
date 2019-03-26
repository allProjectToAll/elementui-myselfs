<template>
  <div id="listContain"  class="app-container">
    <h2>{{ $t("redpacket.title") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
    <div class="clear"></div>
    <div class="box">
      <div class="allTypeBox">
        <el-form :inline="true" class="demo-form-inline" label-width="80px">
          <el-form-item :label="$t('redpacket.name')">
            <el-input v-model="redName"  clearable></el-input>
          </el-form-item>

          <el-form-item style="margin-top:-5px;">
            <el-button type="primary" icon="el-icon-search" @click.prevent.stop="searchList" >{{$t('redpacket.search')}}</el-button>
          </el-form-item>

          <el-form-item style="margin-top:-5px;float: right">
            <el-button type="primary" @click.prevent.stop="!topOnly?checkisTopList():checkCurrentList()" >{{!topOnly?$t('redpacket.topOnly'):$t('redpacket.checkall')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div  class="allTypeBox table">
        <!-- 表格 v-loading.body="listLoading"-->
        <el-row :gutter="0" class="thead">
          <el-col :span="3">
            {{$t('redpacket.redId')}}
          </el-col>
          <el-col :span="3">
            {{$t('redpacket.redType')}}
          </el-col>
          <el-col :span="3">
            {{$t('redpacket.redName')}}
          </el-col>
          <el-col :span="3">
            {{$t('redpacket.redStatus')}}
          </el-col>
          <el-col :span="3" >
            {{$t('redpacket.redPhoto')}}
          </el-col>
          <el-col :span="5" >
            {{$t('redpacket.redTxt')}}
          </el-col>
          <el-col :span="4" >
            {{$t('redpacket.operColumn')}}
          </el-col>
        </el-row>
        <div  v-if="!topOnly"  class="tbody">
          <el-row :gutter="0" v-for="(item,index) in redNameList" :key="index">
            <el-col :span="3">
              {{item.id}}
            </el-col>
            <el-col :span="3">
              {{$t('redpacket.fission')}}-{{item.maxVolume==item.minVolume?$t('redpacket.fixedMoney'):$t('redpacket.randomMoney')}}
            </el-col>
            <el-col :span="3">
              {{item.intro}}
            </el-col>
            <el-col :span="3">
              <span v-if="item.sortIndex<0">{{$t('redpacket.top')}}</span>
              <span>{{item.visible?$t('redpacket.visiable'):$t('redpacket.hidden')}}</span>
            </el-col>
            <el-col :span="3" >
              <div class="img-container" v-if="item.imageId">
                <img :src="`${postAjaxBaseUrl}/Image/${item.imageId}`"/>
              </div>
            </el-col>
            <el-col :span="5" >
              {{item.link}}
              <!--<div class="img-container" v-if="item.imageId">
                <img :src="`${postAjaxBaseUrl}/Image/${item.imageId}`"/>
              </div>-->
            </el-col>
            <el-col :span="4">
              <el-button size="small" type="primary" :loading="fullscreenLoading" v-if="IsInArray(btnArray,2)" @click.prevent.stop="editRedPacket(item,index)" >{{ $t('redpacket.editText') }}</el-button>
              <el-button size="small" type="primary" :loading="fullscreenLoading1" v-if="IsInArray(btnArray,2)" @click.prevent.stop="TopRedPacket(caculateSingeItems(item,index))">{{item.sortIndex>=0?$t('redpacket.top'):$t('redpacket.cancelTop') }}</el-button>
              <el-button size="small" type="danger" :loading="fullscreenLoading2" v-if="IsInArray(btnArray,2)" @click.prevent.stop="ChangeRedPacket(item,index)" >{{!item.visible?$t('redpacket.visiable'):$t('redpacket.hidden') }}</el-button>
            </el-col>
          </el-row>
        </div>

        <draggable v-model="redNameList" class="tbody" v-if="topOnly" @end="dragEnd">
          <transition-group>
            <el-row :gutter="0" v-for="(item,index) in redNameList" :key="index">
              <el-col :span="3">
                {{item.id}}
              </el-col>
              <el-col :span="3">
                {{$t('redpacket.fission')}}-{{item.maxVolume==item.minVolume?$t('redpacket.fixedMoney'):$t('redpacket.randomMoney')}}
              </el-col>
              <el-col :span="3">
                {{item.intro}}
              </el-col>
              <el-col :span="3">
                <span v-if="item.sortIndex<0">{{$t('redpacket.top')}}</span>
                <span>{{item.visible?$t('redpacket.visiable'):$t('redpacket.hidden')}}</span>
              </el-col>
              <el-col :span="3" >
                <div class="img-container" v-if="item.imageId">
                  <img :src="`${postAjaxBaseUrl}/Image/${item.imageId}`"/>
                </div>
              </el-col>
              <el-col :span="5" >
                {{item.link}}
                <!--<div class="img-container" v-if="item.imageId">
                  <img :src="`${postAjaxBaseUrl}/Image/${item.imageId}`"/>
                </div>-->
              </el-col>
              <el-col :span="4">
                <el-button size="small" type="primary" :loading="fullscreenLoading" v-if="IsInArray(btnArray,2)" @click.prevent.stop="editRedPacket(item,index)" >{{ $t('redpacket.editText') }}</el-button>
                <el-button size="small" type="primary" :loading="fullscreenLoading1" v-if="IsInArray(btnArray,2)" @click.prevent.stop="TopRedPacket(caculateSingeItems(item,index))">{{item.sortIndex>=0?$t('redpacket.top'):$t('redpacket.cancelTop') }}</el-button>
                <el-button size="small" type="danger" :loading="fullscreenLoading2" v-if="IsInArray(btnArray,2)" @click.prevent.stop="ChangeRedPacket(item,index)" >{{!item.visible?$t('redpacket.visiable'):$t('redpacket.hidden') }}</el-button>
              </el-col>
            </el-row>
          </transition-group>
        </draggable>

        <!-- 分页 -->
        <div v-show="pageLoding">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="pagenation.currPage"  :page-sizes="[8,10,15,20]" :page-size="pagenation.pageSize"
                         layout="total, sizes, prev, pager, next, jumper"  :total="pagenation.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <edit-dialog ref="redPacketDialog" @editSuc="saveSuccess"></edit-dialog>
  </div>
</template>
<script>
  import EditDialog from './RedPacketEditDialog'
  import draggable from 'vuedraggable'
  export default {
    data() {
      return {
        Cath: "",
        redName: "",
        btnArray: [],
        redNameList: null,
        listLoading: false,
        updating:false,
        checked:false,
        topOnly:false,
        visible:'',
        status:[0],
        fullscreenLoading: false,
        fullscreenLoading1: false,
        fullscreenLoading2: false,
        pageLoding: false,
        pagenation: {
          total: null, //总条目数
          currPage: 1, //当前页
          pageSize: 8, //一页显示个数
          title: "",
          type: null //类型
        }
      };
    },
    created: function() {
      this.getAllDataList()
      this.getBtn()
    },
    computed: {},
    methods: {
      dragEnd(){
        //拖拽结束
       //console.log(this.redTopNameList)
        this.handleSortIndex(this.redNameList,this.pagenation.currPage,this.pagenation.pageSize,this.pagenation.total)

      },
      async handleSortIndex(data,page,size,total){
        let temp=[]
        for(let i in data){
          let sortIndex=(page-1)*size+Number(i)-Number(total)
           temp.push({sortIndex:sortIndex,id:data[i].id})
        }
        this.updateSortIndex(temp)
      },
      updateSortIndex(items){
        var that=this;
        this.postAjax(
          "/DividedEnvelope/UpdateSortIndexs",
          {
            "items":items
          },
          function(res) {
            //console.log(123)
          },
          function(err) {
            console.log("路径错误");
          }
        );

      },
      getBtn() {
        //获取按钮权限
        let that = this;
        this.postAjax(
          "/DividedEnvelope/Limits",
          null,
          function(res) {

            that.btnArray = res.body.value;
          },
          function(res) {

            that.openErr(that.$t("message.ErrorToGetBtnLimit"), 2);
          }
        );
      },
      publicGetDataList(name=this.redName,visible=this.visible,status=this.status,isTop=!this.topOnly?"":this.topOnly,pageIndex=this.pagenation.currPage,pageSize=this.pagenation.pageSize){
        var that=this;
        this.postAjax(
          "/DividedEnvelope/GetPageList",
          {
            "name":name.trim(),
            "isTop":isTop,
            "visible":visible,
            "status": status,
            "pageIndex": pageIndex,
            "pageSize": pageSize
          },
          function(res) {
            that.redNameList = res.body.value.items;
            that.pagenation.total = res.body.value.totalItems;
            that.pageLoding = true;
            that.listLoading = false;
            that.openErr(that.$t("message.SuccessToGetList"), 2);
          },
          function(err) {
            console.log("路径错误");
          }
        );
      },
      getAllDataList(){
        //获取所有红包数据
        this.publicGetDataList()
      },
      searchList(){
        //搜索对应的数据
        this.pagenation.currPage=1
        this.publicGetDataList()
      },
      checkisTopList(){
        //查看当前条件下所有置顶数据
        this.topOnly=true
        this.pagenation.currPage=1
        //console.log('查看当前条件下所有置顶数据')
        this.publicGetDataList()
      },
      checkCurrentList(){
        //查看当前条件下所有数据
        this.topOnly=false
        this.pagenation.currPage=1
        //console.log('查看当前条件下所有数据')
        this.publicGetDataList()
      },
      handleSizeChange(val){
        //处理当前页面显示条数val
        this.pagenation.pageSize = val; //每页条数
        this.publicGetDataList()
      },
      handleCurrentChange(val){
        //更改当前页码
        this.pagenation.currPage = val; //当前页码
        this.publicGetDataList()
      },
      editRedPacket(currentItem,index){
        //console.log(currentItem,index)
        //this.fullscreenLoading=true
        this.$refs.redPacketDialog.open(currentItem,index);
      },
      saveSuccess(){
        this.redNameList=[]
        this.publicGetDataList()
      },
      TopRedPacket(items){
        //置顶按钮
        var that = this;
        this.postAjax(
          "/DividedEnvelope/UpdateSortIndexs",
          {
            "items":items
          },
          function(res) {
            that.getAllDataList()
          },
          function(err) {
            console.log("路径错误");
          }
        );
      },
      caculateSingeItems(item,index){
        //计算当前item是置顶还是非置顶
        if(item.sortIndex<0){
          return  [{"sortIndex": 0,"id":item.id}]
        }else {
          return  [{"sortIndex": -1,"id":item.id}]
        }
      },
      ChangeRedPacket(item,index){
        //显示和隐藏操作
        var that = this;
        this.postAjax(
          "/DividedEnvelope/UpdateVisible",
          {
            "id": item.id,
            "visible": !item.visible
          },
          function(res) {
            that.publicGetDataList()
          },
          function(err) {
            console.log("路径错误");
          }
        );

      }
    },
    components:{
      EditDialog,
      draggable
    }
  };
</script>
<style scoped>

  .allTypeBox {
    word-wrap: break-word;
  }

  .table .thead {
    background-color: #ebeef5;
  }

  .table {
    border-top: 1px solid #ebeef5;

  }

  .table .el-row {
    border-bottom: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    align-items: center;
    display: flex;
  }

  .table .tbody .el-row {
    cursor: pointer;
  }

  .img-container {
    max-width: 100px;
    max-height: 100px;
    line-height: 100px;
    text-align: center;
    overflow: hidden;
  }

  .table .tbody .el-row:hover {
    background-color: #f5f7fa;
  }

  .table .el-col {
    padding: 6px 10px;
    font-size: 14px;
  }

  .el-input {
    width: 200px;
  }
</style>

