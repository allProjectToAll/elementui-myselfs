<template>
  <div id="basicDetail editDialog">
    
  </div>
</template>

<script>
  export default {
    name: 'basicDetail',
    data(){
      return {

      }
    },
    watch:{
      "detailInFo.dialogAsync":{//弹框弹出
            handler(to) {
                if (to){
                    console.log(111)
                }else{
                    console.log(22222)
                }
            }
        },
    },
    props: {
        detailInFo:Object,
    },
    computed: {
        dialogWidth(){
            let w = "";
            if(this.detailInFo.cols == 24){
                w="500px"
            }else if(this.detailInFo.cols == 12){
                w="800px"
            }else if(this.detailInFo.cols == 8){
                w="1200px"
            }
            return w;
        }
    },
  }
</script>
<style lang="less">
.editDialog{
    .clear{
        clear:both;
    }
    .title{
        width:100%;
        height:30px;
        font-weight:bolder;
        font-size:16px;
    }
    .el-dialog{
        border-radius: 10px!important;
    }
    .el-dialog__body{
        display: table!important;
    }
    .el-form-item--medium .el-form-item__content, .el-form-item--medium .el-form-item__label{
        font-weight:normal!important
    }
    .el-input--medium .el-input__inner{
        width:220px;
    }
    .el-form-item{
        height: 40px;
    }
    .el-dialog__header{
        font-weight:bolder;
    }
}
</style>