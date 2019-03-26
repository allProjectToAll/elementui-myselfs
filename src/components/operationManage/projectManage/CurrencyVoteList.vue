<template>
  <div class="currency-vote-list">
    <h2>{{$t('currencyVoteManage.listTitle')}}</h2>
    <div class="flex-div">
      <search-box :placeholder="$t('currencyVoteManage.searchPlc')" v-model="filter.name" @search="search"></search-box>
      <el-select v-model="lang" @change="getList">
        <el-option v-for="(s,k) in languageCodeObj" :key="k" :label="s.text" :value="s.code"></el-option>
      </el-select>
      <el-button type="primary" @click="goEditPage('new')" v-if="limits.includes(1)">{{$t('message.add')}}</el-button>
    </div>
    <el-table :data="votes" v-if="!loading">
      <el-table-column
        prop="id"
        :label="$t('currencyVoteManage.idColumn')"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('currencyVoteManage.titleColumn')"
      >
        <template slot-scope="scope">
          {{scope.row.voteInfos[lang].title}}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('currencyVoteManage.statusColumn')"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 2">{{$t('message.Disabled')}}</span>
          <span v-if="scope.row.status === 1">{{$t('message.Actived')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        :label="$t('currencyVoteManage.timeColumn')"
      >
        <template slot-scope="scope">
          {{scope.row.startTime|dateTime}}--{{scope.row.endTime|dateTime}}
        </template>
      </el-table-column>
      <el-table-column
        prop="langugage"
        :label="$t('currencyVoteManage.langColumn')"
      >
        <template slot-scope="scope">
          {{languageCodeObj[lang]?languageCodeObj[lang].text:''}}
        </template>
      </el-table-column>
      <el-table-column
        width="240"
        :label="$t('message.handle')"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="limits.includes(2)" @click="editVote(scope.row)">{{$t('message.update')}}</el-button>
          <el-button size="mini" type="danger" v-if="limits.includes(3)" @click="deleteVote(scope.row)">{{$t('message.delete')}}</el-button>
          <el-button size="mini" type="warning" v-if="limits.includes(4)" @click="changeStatus(scope.row)">
            <span v-if="scope.row.status === 2">{{$t('message.Actived')}}</span>
            <span v-if="scope.row.status === 1">{{$t('message.Disabled')}}</span>
          </el-button>
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
        votes:[],
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
        this.postAjax('/vote/GetPageList',this.filter,(res)=>{
          this.votes = res.body.value.items;
          this.total = res.body.value.totalItems;
          this.loading = false;
        })
      },
      currentChange(val){
        this.filter.pageIndex = val;
        this.getList();
      },
      editVote(vote){
        sessionStorage.setItem(`AZEX_CurrencyTpl_${vote.id}`,JSON.stringify(vote));
        this.goEditPage(vote.id);
      },
      deleteVote(vote){
        this.$confirm(this.$t('message.deleteConfirmText').replace('0',vote.voteInfos[this.lang].name),
          this.$t('currencyVoteManage.deleteTip'),{
            confirmButtonText: this.$t('message.MakeSure'),
            cancelButtonText: this.$t('message.Cancel'),
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
          this.postAjax('/vote/Delete', {
            id:vote.id,
          }, () => {
            this.$message.success(this.$t('message.deleteTip'));
            this.getList();
          })
        })
      },
      goEditPage(id){
        this.$router.push({
          name:'voteEdit',
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
        this.postAjax('/vote/Limits', {}, (res) => {
          this.limits = res.body.value;
        })
      },
      changeStatus(item){
        let status = item.status === 1 ? 2 : 1;
        // 更新状态
        this.postAjax('/vote/UpdateStatus',{
          id:item.id,
          voteStatus:status
        },()=>{
          item.status = status;
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
