<template>
  <div id="app">
    <router-view/>
    <!-- 错误提示框 -->
    <div class="TitleMessageBox">
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods:{
  },
  created(){
    // this.$store.dispatch('getLangList',this)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height:100%;
  height:100%;
}

/* ////////////////////////// */
.TitleMessageBox{
  position:absolute;
  right:0;
  bottom: 0;
}
.errBox{
  position: relative;
  background:black;
  border:1px solid #ccc;
  color:white;
  width:180px;
  padding:10px 20px;
  z-index: 100000;
}
.errBox p{
  font-size:14px;
}
.errTitle{
  padding-top:5px;
  font-size:12px;
}
.closeError{
  position: absolute;
  right:3px;
  top:3px;
  line-height:15px;
  width:15px;
  height:15px;
  text-align: center;
  cursor:pointer;
}

/* .errBox{
  width:220px;
  padding:10px 20px;
  position: absolute;
  right:0;
  bottom: 20px;
  background:black;
  border:1px solid #ccc;
  color:white;
  display:none;
  z-index: 100000;
}
.errBox p{
  color:rgb(255, 174, 0);
  font-size:14px;
}
.errTitle{
  padding-top:5px;
  font-size:12px;
}
.closeError{
  position: absolute;
  right:3px;
  top:3px;
  line-height:15px;
  width:15px;
  height:15px;
  text-align: center;
  cursor:pointer;
} */
img{
  max-width:100%;
  max-height:100%;
  vertical-align: middle;
}
.el-dialog.align-middle{
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  position:absolute;
}
  .no-wrap{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    display: inline-block;
  }
  .flex-div{
    display: flex;
    align-items: center;
    margin:20px 0;
  }
</style>
