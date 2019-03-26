<template>
  <div class="currency-icon-manage">
    <div class="row">
      <my-search v-model="keyword" :placeholder="$t('currencyIconManage.searchPlc')" @search="search"></my-search>
      <my-upload
        v-if="limits.includes(1)"
        :multiple="true"
        accept=".png"
        host="/CurrencyImage/UploadCurrencyImage"
        @success="handleNewFileSuccess"
      >
        <div slot="style">
          <el-button type="success">{{$t('currencyIconManage.uploadIconText')}}</el-button>
        </div>
      </my-upload>
    </div>
    <div class="currency-list">
      <div class="currency-box" v-for="c in showList">
        <i class="el-icon-delete" @click="deleteIcon(c.id)" v-if="limits.includes(2)"></i>
        <img :src="`/CurrencyImage/${c.id}`|hostImgPath" alt="">
        <p>{{c.id}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import mySearch from '../common/MySearchBox'
  import myUpload from '../common/MyUpload'
  export default {
    data() {
      return {
        iconList:[],
        showList:[],
        limits:[],
        page:{
          id:'%',
          pageIndex:1,
          pageSize:200
        },
        keyword:'',
      }
    },
    components:{
      mySearch,
      myUpload
    },
    methods: {
      getList(){
        this.postAjax("/CurrencyImage/GetPageList",this.page,(res)=>{
          this.iconList = res.body.value.items;
          this.search();
        })
      },
      getLimits(){
        this.postAjax("/CurrencyImage/Limits",{},(res)=>{
          this.limits = res.body.value;
        })
      },
      search(){
        if(!this.keyword.trim()){
          this.showList = this.iconList;
          return;
        }
        console.log(this.keyword.trim());
        this.showList = this.iconList.filter((file)=>{
          return file.id.includes(this.keyword.trim())
        })
      },
      handleNewFileSuccess(file){
        this.getList();
      },
      deleteIcon(id){
        this.$confirm(this.$t('message.deleteConfirmText').replace('0',id),
          this.$t('currencyIconManage.deleteTip'),{
            confirmButtonText: this.$t('message.MakeSure'),
            cancelButtonText: this.$t('message.Cancel'),
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            this.postAjax('/CurrencyImage/Delete', {
              id,
            }, () => {
              this.$message.success(this.$t('message.deleteTip'));
              this.getList();
            })
        })
      }
    },
    created() {
      this.getList();
      this.getLimits();
    },
  }
</script>

<style scoped>
  .currency-list .currency-box{
    width:120px;
    height:120px;
    display: inline-block;
    text-align: center;
    position:relative;
  }
  .currency-list .currency-box img{
    width:80px;
    height:80px;
  }
  .el-icon-delete{
    color:red;
    position:absolute;
    right:0px;
    top:0px;
    cursor: pointer;
  }
  .my-upload{
    display: inline-block;
    height:44px;
    margin-left:20px;
  }
  .row{
    display: flex;
    margin:20px 0;
  }
</style>
<style>
  .currency-icon-manage .el-upload-dragger{
    width:100px !important;
    height:44px !important;
    margin:0;
    border:none;
  }
</style>
