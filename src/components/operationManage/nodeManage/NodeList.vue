<template>
  <div class="node-list">
    <h2>{{$t('nodeManage.listTitle')}}</h2>
    <div class="flex-div">
      <search-box :placeholder="$t('nodeManage.searchPlc')" v-model="filter.name" @search="search"></search-box>
      <el-select v-model="lang" @change="getList">
        <el-option v-for="(s,k) in languageCodeObj" :key="k" :label="s.text" :value="k"></el-option>
      </el-select>
      <el-button type="primary" @click="goEditPage('new')" v-if="limits.includes(1)">{{$t('message.add')}}</el-button>
    </div>
    <el-table :data="nodes" v-if="!loading">
      <el-table-column
        prop="id"
        label="id"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('nodeManage.nameColumn')"
      >
        <template slot-scope="scope">
          {{scope.row.starNodeInfos[lang].name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="langugage"
        :label="$t('nodeManage.langColumn')"
      >
        <template slot-scope="scope">
          {{languageCodeObj[lang]?languageCodeObj[lang].text:''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="imageId"
        label="logo"
      >
        <template slot-scope="scope">
          {{scope.row.starNodeInfos[lang].imageId}}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('message.handle')"
      >
        <template slot-scope="scope">
          <el-button size="small" type="primary" v-if="limits.includes(2)" @click="editNode(scope.row)">{{$t('message.update')}}</el-button>
          <el-button size="small" type="danger" v-if="limits.includes(3)" @click="deleteNode(scope.row)">{{$t('message.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-container" v-if="total">
      <el-pagination @current-change="currentChange"
                     :current-page="Number(filter.pageIndex)" :page-size="Number(filter.pageSize)"
                     layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import searchBox from '../../common/MySearchBox'
  export default {
    data() {
      return {
        nodes:[],
        total:0,
        filter:{
          pageSize:10,
          pageIndex:1,
          name:''
        },
        lang: localStorage.getItem("langular") || 'cn',
        limits:[],
        loading:false
      }
    },
    components:{
      searchBox
    },
    computed:{
      languageList(){
        return this.$store.state.languageList;
      },
      languageCodeObj(){
        return this.$store.state.languageCodeObj;
      }
    },
    methods: {
      getList(){
        this.loading = true;
        this.postAjax('/starNode/GetPageList',{lang:this.lang,...this.filter},(res)=>{
          this.nodes = res.body.value.items;
          this.total = res.body.value.totalItems;
          this.loading = false;
        })
      },
      currentChange(val){
        this.filter.pageIndex = val;
        this.getList();
      },
      editNode(node){
        sessionStorage.setItem(`AZEX_StarNode_${node.id}`,JSON.stringify(node));
        this.goEditPage(node.id);
      },
      deleteNode(node){
        this.$confirm(this.$t('message.deleteConfirmText').replace('0',node.starNodeInfos[this.lang].name),
          this.$t('nodeManage.deleteTip'),{
            confirmButtonText: this.$t('message.MakeSure'),
            cancelButtonText: this.$t('message.Cancel'),
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
          this.postAjax('/StarNode/Delete', {
            id:node.id,
          }, () => {
            this.$message.success(this.$t('message.deleteTip'));
            this.getList();
          })
        })
      },
      goEditPage(id){
        this.$router.push({
          name:'starNodeEdit',
          params:{
            id,
          },
          query:{
            lang:this.lang,
          }
        })
      },
      search(){
        this.getList();
      },
      getLimits(){
        this.postAjax('/starNode/Limits', {}, (res) => {
          this.limits = res.body.value;
        })
      }
    },
    created() {
      this.getList();
      this. getLimits();
    },
  }
</script>

<style scoped>
  .flex-div > *{
    margin-left:20px;
  }
  .flex-div > *:first-child{
    margin-left:0px;
  }
</style>
