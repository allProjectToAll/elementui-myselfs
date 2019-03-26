<template>
  <div class="project-list">
    <h2>{{$t('projectManage.listTitle')}}</h2>
    <div class="flex-div">
      <search-box :placeholder="$t('projectManage.searchPlc')" v-model="filter.name" @search="search"></search-box>
      <el-select v-model="lang" @change="getList">
        <el-option v-for="(s,k) in languageCodeObj" :key="k" :label="s.text" :value="s.code"></el-option>
      </el-select>
      <el-button type="primary" @click="goEditPage('new')" v-if="limits.includes(1)">{{$t('message.add')}}</el-button>
    </div>
    <el-table :data="projects" v-if="!loading">
      <el-table-column
        prop="id"
        label="id"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('projectManage.nameColumn')"
      >
        <template slot-scope="scope">
          {{scope.row.coinProjectInfos[lang].name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="langugage"
        :label="$t('projectManage.langColumn')"
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
          {{scope.row.coinProjectInfos[lang].imageId}}
        </template>
      </el-table-column>
      <el-table-column
        prop="intro"
        :label="$t('projectManage.introColumn')"
      >
        <template slot-scope="scope">
          {{scope.row.coinProjectInfos[lang].intro}}
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        :label="$t('projectManage.websiteColumn')"
      >
        <template slot-scope="scope">
          <a href="" class="no-wrap">{{scope.row.coinProjectInfos[lang].official}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="intro"
        :label="$t('projectManage.statusColumn')"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status == 2">{{$t('projectManage.votedDisplay')}}</span>
          <span v-if="scope.row.status == 1">{{$t('projectManage.votingDisplay')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="240"
        :label="$t('message.handle')"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="limits.includes(2)" @click="editProject(scope.row)">
            {{$t('message.update')}}
          </el-button>
          <el-button size="mini" type="danger" v-if="limits.includes(3)" @click="deleteProject(scope.row)">
            {{$t('message.delete')}}
          </el-button>
          <el-button size="mini" type="warning" v-if="limits.includes(4)" @click="changeStatus(scope.row)">
            <span v-if="scope.row.status == 2">{{$t('projectManage.downLine')}}</span>
            <span v-if="scope.row.status == 1">{{$t('projectManage.online')}}</span>
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
        projects: [],
        total: 0,
        filter: {
          pageSize: 10,
          pageIndex: 1,
          name: ''
        },
        loading:false,
        lang: localStorage.getItem("langular") || 'cn',
        limits: []
      }
    },
    components: {
      searchBox
    },
    computed: {
      languageList() {
        return this.$store.state.languageList;
      },
      languageCodeObj(){
        return this.$store.state.languageCodeObj;
      }
    },
    methods: {
      getList() {
        this.loading = true;
        this.postAjax('/CoinProject/GetPageList', {lang:this.lang,...this.filter}, (res) => {
          this.projects = res.body.value.items;
          this.total = res.body.value.totalItems;
          this.loading = false;
        })
      },
      currentChange(val) {
        this.filter.pageIndex = val;
        this.getList();
      },
      editProject(project) {
        sessionStorage.setItem(`AZEX_CoinProject_${project.id}`, JSON.stringify(project));
        this.goEditPage(project.id);
      },
      deleteProject(project) {
        this.$confirm(this.$t('message.deleteConfirmText').replace('0', project.coinProjectInfos[this.lang].name),
          this.$t('projectManage.deleteTip'), {
            confirmButtonText: this.$t('message.MakeSure'),
            cancelButtonText: this.$t('message.Cancel'),
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
          this.postAjax('/CoinProject/Delete', {
            id: project.id,
          }, () => {
            this.$message.success(this.$t('message.deleteTip'));
            this.getList();
          })
        })
      },
      goEditPage(id) {
        this.$router.push({
          name: 'coinProjectEdit',
          params: {
            id,
          },
          query: {
            lang: this.lang,
          }
        })
      },
      search() {
        this.getList();
      },
      getLimits() {
        this.postAjax('/coinProject/Limits', {}, (res) => {
          this.limits = res.body.value;
        })
      },
      changeStatus(item){
        let status = item.status === 1 ? 2 : 1;
        // 更新状态
        this.postAjax('/CoinProject/UpdateStatus',{
          id:item.id,
          coinProjectStatus:status
        },()=>{
          item.status = status;
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
  .flex-div > * {
    margin-left: 20px;
  }

  .flex-div > *:first-child {
    margin-left: 0px;
  }
</style>
