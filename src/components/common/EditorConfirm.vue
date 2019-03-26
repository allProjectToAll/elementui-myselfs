<template>
  <el-dialog
    title="请确认是否保存当前信息"
    :visible.sync="dialogVisible"
    width="400px"
    center
    @close="cancel"
    :closeOnClickModal="false">
    <div>
      <!--<p class="tip-info">点击不保存即不保存你当前的更改</p>-->
      <div class="btns">
        <el-button type="default" @click="cancel">取消</el-button>
        <el-button type="danger" @click="notSave">不保存</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>

  export default {
    data() {
      return {
        dialogVisible:false,
        params:undefined
      }
    },
    methods: {
      cancel(){
        this.dialogVisible = false;
        this.$emit('cancel',this.params);
      },
      save(){
        this.dialogVisible = false;
        this.$emit('save',this.params);
      },
      notSave(){
        this.dialogVisible = false;
        this.$emit('notSave',this.params);
      },
      open(params){
        this.dialogVisible = true;
        this.params = params;
      }
    },
    created() {
    },
  }
</script>

<style scoped>
  .tip-info{
    text-align: center;
    margin-bottom:20px;
  }
  .btns{
    display: flex;
    justify-content: center;
  }
  .btns > button{
    margin-left:10px;
  }
</style>
