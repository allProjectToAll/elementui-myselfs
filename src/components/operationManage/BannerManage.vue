<template>
  <div class="banner-manage">
    <div class="title">
      {{$t('banner.title')}}
    </div>
    <div class="handle-box">
      <div class="search-box">
        <el-input type="text" v-model="filter.queryText" :placeholder="$t('banner.searchPlc')"
                  @keyup.native.enter="search"
                  style="width:320px;" clearable></el-input>
        <el-button type="primary" @click="search">
          {{$t('banner.searchText')}}
        </el-button>
      </div>
      <el-button type="success" @click="createBanner" v-if="bannerLimits.includes(1)">
        {{$t('message.Added')}}
      </el-button>
    </div>
    <div class="handle-box">
      <el-select v-model="filter.bannerTimeStatus" @change="getBannerList">
        <el-option v-for="(s,k) in bannerTimeSelList" :key="k" :label="s" :value="Number(k)"></el-option>

      </el-select>
      <el-select v-model="filter.bannerStatus" @change="getBannerList">
        <el-option v-for="(s,k) in bannerStatusSelList" :key="k" :label="s" :value="Number(k)"></el-option>

      </el-select>
      <el-select v-model="filter.bannerPlatform" @change="getBannerList">
        <el-option v-for="(s,k) in bannerPlatformSelList" :key="k" :label="s" :value="Number(k)"></el-option>

      </el-select>
      <el-select v-model="filter.lang" @change="getBannerList">
        <el-option v-for="(s,k) in langSelList" :key="k" :label="s.text" :value="Number(k)"></el-option>
      </el-select>
    </div>
    <div class="table">
      <el-row :gutter="0" class="thead">
        <el-col :span="1">
          {{$t('banner.sortColumn')}}
        </el-col>
        <el-col :span="3">
          {{$t('banner.titleColumn')}}
        </el-col>
        <el-col :span="3">
          {{$t('banner.startTimeColumn')}}
        </el-col>
        <el-col :span="3">
          {{$t('banner.endTimeColumn')}}
        </el-col>
        <el-col :span="3" style="min-width: 110px">
          {{$t('banner.imageColumn')}}
        </el-col>
        <el-col :span="3">
          {{$t('banner.linkColumn')}}
        </el-col>
        <el-col :span="2">
          {{$t('banner.langColumn')}}
        </el-col>
        <el-col :span="2">
          {{$t('banner.platformColumn')}}
        </el-col>
        <el-col :span="4">
          {{$t('banner.operColumn')}}
        </el-col>
      </el-row>
      <!--:move="dragMove"-->
      <draggable v-model="bannerList" class="tbody" @end="dragEnd">
        <transition-group>
          <el-row :gutter="0" v-for="item in bannerList" :key="item.id">
            <el-col :span="1">
              {{item.sortIndex}}
            </el-col>
            <el-col :span="3">
              {{item.name}}
            </el-col>
            <el-col :span="3">
              {{item.startTime|dateTime}}
            </el-col>
            <el-col :span="3">
              {{item.expireTime|dateTime}}
            </el-col>
            <el-col :span="3" style="min-width: 110px">
              <div class="img-container">
                <img :src="`${postAjaxBaseUrl}/Image/${item.imageId}`"/>
              </div>
            </el-col>
            <el-col :span="3">
              <a :href="item.href" target="_blank" class="no-wrap">{{item.href}}</a>
            </el-col>
            <el-col :span="2">
              {{langSelList[item.lang].text}}
            </el-col>
            <el-col :span="2">
              {{bannerPlatformSelList[item.platform]}}
            </el-col>
            <el-col :span="4">
              <el-button size="small" type="primary" v-if="bannerLimits.includes(2)" @click="editBanner(item)">
                {{$t('banner.editText')}}
              </el-button>
              <el-button size="small" type="danger" v-if="bannerLimits.includes(3)" @click="deleteBanner(item)">
                {{$t('banner.deleteText')}}
              </el-button>
              <el-button size="small" type="default" v-if="bannerLimits.includes(4)" @click="toggleBannerStatus(item)">
                {{item.status===2?$t('banner.enableText'):$t('banner.disableText')}}
              </el-button>
            </el-col>
          </el-row>
          >
        </transition-group>
      </draggable>
      <div class="page-container" v-if="total">
        <el-pagination @current-change="currentChange"
                       :current-page="Number(filter.pageIndex)" :page-size="Number(filter.pageSize)"
                       layout="prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
    <edit-dialog ref="editDialog" @editSuc="getBannerList"></edit-dialog>
  </div>
</template>

<script>
  import editDialog from './BannerEditDialog'
  import draggable from 'vuedraggable'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        filter: {
          queryText: '',
          pageSize: 10,
          pageIndex: 1,
          bannerTimeStatus: 0,
          bannerPlatform: 0,
          bannerStatus: 0,
          lang: 0
        },
        total: 0,
        statusBusy: false,
        bannerTimeSelList: {
          '0': this.$t('banner.timeSel0Text'),
          '1': this.$t('banner.timeSel1Text'),
          '2': this.$t('banner.timeSel2Text'),
          '3': this.$t('banner.timeSel3Text'),
        },
        bannerPlatformSelList: {
          '0': this.$t('banner.platform0Text'),
          '1': this.$t('banner.platform1Text'),
          '2': this.$t('banner.platform2Text'),
          '3': this.$t('banner.platform3Text'),
        },
        bannerStatusSelList: {
          '0': this.$t('banner.bannerStatus0Text'),
          '1': this.$t('banner.bannerStatus1Text'),
          '2': this.$t('banner.bannerStatus2Text'),
        },
        bannerLimits: [],
        bannerList: [],
        sortIndex: []
      }
    },
    computed:{
      langSelList(){
        return {
          '0': {text:this.$t('banner.langAllText')},
          ...this.$store.state.languageObj
        }
      }
    },
    components: {
      editDialog,
      draggable
    },
    methods: {
      search() {
        this.filter.queryText = this.filter.queryText.trim();
        this.getBannerList();
      },
      getBannerList() {
        this.postAjax('/Banner/GetList', this.filter, (res) => {
          this.bannerList = res.body.value.items;
          this.total = res.body.value.totalItems;
          this.sortIndexList = this.bannerList.map((item) => {
            return {
              sortIndex: item.sortIndex,
            }
          })
        })
      },
      getLimits() {
        this.postAjax('/Banner/Limits', {}, (res) => {
          this.bannerLimits = res.body.value;
        })
      },
      createBanner() {
        this.$refs.editDialog.open();
      },
      editBanner(banner) {
        let param = Object.assign({}, banner)
        this.$refs.editDialog.open(param);
      },
      deleteBanner(banner) {
        this.$confirm(`${this.$t('banner.deleteConfirmText')}${banner.name}, ${this.$t('banner.deleteContinueText')}`,
          this.$t('banner.deleteTitle'), {
            confirmButtonText: this.$t('banner.confirmText'),
            cancelButtonText: this.$t('banner.cancelText'),
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
          // delete api
          this.postAjax('/Banner/Delete', {
            id: banner.id
          }, () => {
            this.$message.success(this.$t('message.deleteTip'));
            this.getBannerList();
          })
        })
      },
      toggleBannerStatus(banner) {
        let updateStatus = banner.status === 2 ? 1 : 2;
        this.statusBusy = true;
        this.postAjax('/Banner/UpdateStatus', {
          id: banner.id,
          bannerStatus: updateStatus
        }, () => {
          banner.status = updateStatus;
          this.statusBusy = false;
        }, () => {
          this.statusBusy = false;
        })
      },
      currentChange(val) {
        this.filter.pageIndex = val;
        this.getBannerList();
      },
      async dragEnd() {
        this.bannerList.forEach((item, index) => {
          this.sortIndexList[index].id = item.id;
        })
        this.postAjax('/Banner/UpdateSortIndexs', {
          items:this.sortIndexList
        }, (res) => {
          this.getBannerList();
        })
      },
    },
    created() {
      this.getLimits();
      this.getBannerList();
    },
  }
</script>

<style scoped>
  .banner-manage .handle-box {
    margin: 20px 0;
    display: flex;
  }

  .banner-manage .handle-box > div {
    margin-right: 20px;
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

  .table .tbody .el-row:hover {
    background-color: #f5f7fa;
  }

  .table .el-col {
    padding: 6px 10px;
    font-size: 14px;
  }

  .img-container {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>
