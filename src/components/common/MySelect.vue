<template>
  <el-select v-model="select" :clearable="clearable" :placeholder="placeholder">
    <el-option
      v-for="choice in choices"
      :key="choice[valueStr]"
      :label="choice[labelStr]"
      :value="choice[valueStr]"
    >
    </el-option>
  </el-select>
</template>
<style>

</style>
<script>
  export default {
    props: {
      choices: {
        type: Array|Object,
        required: true
      },
      selectValue: {
        required: true
      },
      labelStr:{
        //标签字段
      },
      valueStr:{
        //值字段
      },
      beforeChange:{
        // 在改动之前执行一些判断
      },
      placeholder:{
        default:''
      },
      clearable:{
        default:false
      }
    },
    data(){
      return {
        select:this.selectValue,
        setbyHand:false,
        lastVal:undefined
      }
    },
    methods:{
      changeSelectValue(val,oldVal){
        if(this.setbyHand){
          this.setbyHand = false;
          return;
        }
        this.setbyHand = true;
        this.select = oldVal;
        this.lastVal = val;
        this.$nextTick(()=>{
          this.beforeChange(this.changeVal);
        })
      },
      changeVal(){
        if(this.select !== this.lastVal){
          this.setbyHand = true;
          this.select = this.lastVal;
          this.$nextTick(()=>{
            this.$emit('selectChange',this.lastVal);
          })
        }
      }
    },
    watch: {
      select(val,oldVal){
        if(this.beforeChange){
          this.changeSelectValue(val,oldVal);
        }else{
          this.$emit('selectChange',val);
        }
      },
    },
  }
</script>
