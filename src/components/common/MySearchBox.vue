<template>
  <div class="search-box">
    <el-input v-model="keyword" :placeholder="placeholder||$t('message.searchPlc')" class="handle-input" clearable
              @keyup.enter.native="search" @clear="clearKeyword">
    </el-input>
    <el-button type="primary" @click="search" icon="el-icon-search">{{$t('message.Search')}}</el-button>
  </div>
</template>

<script>
  // 公用搜索框
  export default{
    data(){
      return {
        keyword: ''
      }
    },
    methods: {
      search(){
        this.$emit('search');
      },
      clearKeyword(){
        this.keyword ='';
        this.$nextTick(()=>{
          this.search();
        });
      }
    },
    watch: {
      keyword: function (val){
        this.$emit('input',val);
      },
      value: function (val) {
        this.keyword = val || '';
      }
    },
    props: {
      placeholder: {
        type: String,
      },
      value: {
        type: String
      },
    },
    created(){
      this.keyword = this.value;
    }
  }
</script>
<style scoped>
  .search-box {
    display: inline-block;
    position:relative;
  }
  .handle-input {
    width: 300px;
    display: inline-block;
  }
</style>
