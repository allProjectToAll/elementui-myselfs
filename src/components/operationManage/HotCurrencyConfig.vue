<template>
  <div>
    <div class="title">
      {{$t('hotCur.title')}}
    </div>
    <el-table
      :data="list"
    >
      <el-table-column
        prop="title"
        :label="$t('hotCur.titleColumn')">
      </el-table-column>
      <el-table-column
        prop="value"
        :label="$t('hotCur.valueColumn')">
        <template slot-scope="scope">
          <div v-if="scope.row.editing" class="cascader-div">
            <span class="target-show" :style="{'left':scope.row.basic.length*10+14+'px'}">/ {{scope.row.target.toUpperCase()}}</span>
            <el-cascader
              v-if="options.length"
              expand-trigger="hover"
              :options="options"
              v-model="scope.row.valueArr"
              :show-all-levels="false"
              @change="handleChange(scope.row)">
            </el-cascader>
          </div>
          <span v-else>{{scope.row.value.toUpperCase().replace('_','/')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="oper"
        :label="$t('hotCur.operColumn')">
        <template slot-scope="scope">
          <div v-if="limits.includes(1)">
            <el-button type="primary" v-if="scope.row.editing" size="small" :loading="busy" @click="save(scope.row,scope.$index)">保存</el-button>
            <el-button type="primary" v-else @click="edit(scope.row)" size="small">编辑</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        list:[],
        pureList:[],
        num:5,
        busy:false,
        options:[],
        limits:[],
      }
    },
    methods: {
      edit(item){
        item.editing = true;
      },
      findIndex(id){
        return this.pureList.findIndex((market)=>{
          return market === id;
        });
      },
      save(item,index){
        this.busy = true;
        let id = item.valueArr.reverse().join('_');
        let targetIndex = this.findIndex(id);
        let paramArr = [{
          id:id,
          topIndex:this.num-index,
        },{
          id:item.value,
          topIndex:targetIndex===-1?0:this.num-targetIndex,
        }];
        this.postAjax('/HotMarket/UpdateHotMarket',{
          items:paramArr,
        },()=>{
          // 刷新页面
          this.getList();
          this.busy = false;
          item.editing = false;
        },()=>{
          this.busy = false;
        })
      },
      handleChange(row){
        row.target = row.valueArr[0];
        row.basic = row.valueArr[1];
      },
      transListToTree(){
        let obj = {};
        this.postAjax('/HotMarket/GetMarketList',{},(res)=>{
          res.body.value.forEach((item)=>{
            let basic = item.split('_')[1];
            let target = item.split('_')[0];
            if(!obj[basic]){
              obj[basic] = {
                value:basic,
                label:basic.toUpperCase(),
                children:[]
              }
            }
            obj[basic].children.push({
              value:target,
              label:target.toUpperCase(),
            })
          })
          this.options = Object.values(obj);
        })
      },
      getList(){
        this.postAjax('/HotMarket/GetHotMarketList',{
          count:this.num
        },(res)=>{
          this.pureList = res.data.value;
          this.list = res.data.value.map((item,index)=>{
            return {
              title:this.$t('hotCur.curPairTitleText').replace('0',index+1),
              value:item,
              valueArr:item.split('_').reverse(),
              target:item.split('_')[1],
              basic:item.split('_')[0],
              editing:false
            }
          })
        })
      },
      getLimits(){
        this.postAjax('/HotMarket/Limits',{},(res)=>{
          this.limits = res.body.value;
        })
      }
    },
    created() {
      this.getLimits();
      this.getList();
      this.transListToTree();
    },
  }
</script>

<style scoped>
  .title{
    font-size:20px;
    margin-bottom:20px;
  }
  .cascader-div{
    position:relative;
  }
  .cascader-div .target-show{
    position:absolute;
    z-index: 600;
    top: 8px;
    left: 43px;
  }
</style>
