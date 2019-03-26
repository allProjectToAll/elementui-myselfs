<template>
  <el-dialog
    :title="`${currentRedInfo.title?$t('banner.editText'):$t('banner.createText')}`"
    :visible.sync="dialogVisible"
    width="600px"
    center
    top="20px"
    @close="resetFilter"
    :closeOnClickModal="false"
  >
  <!--custom-class="align-middle"-->
  <el-form :model="currentRedInfo" :rules="rules" ref="ruleForms" label-width="100px" class="demo-ruleForm">
      <el-form-item :label="$t('redpacket.redName')" prop="title">
        <el-input v-model="currentRedInfo.title"></el-input>
      </el-form-item>
      <el-form-item :label="$t('redpacket.redPhoto')" prop="imageId">
        <my-upload
          host="/Image/Upload"
          format="image"
          name="image"
          :maxSize="4*1024*1024"
          @success="handleImageSuccess"
        >
          <div slot="style" class="img-style" style="height:180px" v-if="currentRedInfo.imageId">
            <img :src="`${postAjaxBaseUrl}/Image/${currentRedInfo.imageId}`" alt="">
          </div>
        </my-upload>
      </el-form-item>
      <el-form-item :label="$t('redpacket.redTxt')" prop="link">
        <el-input type="textarea" v-model="currentRedInfo.link" ></el-input>
      </el-form-item>
    <el-form-item :label="$t('redpacket.groupLink')" prop="groupLink">
      <el-input type="input" v-model="currentRedInfo.groupLink" ></el-input>
    </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="busy" @click="onSubmit">{{$t('banner.saveText')}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import $i18n from '../../i18n/i18n'
  import myUpload from '../common/MyUpload'

  export default {
    data() {
      return {
        dialogVisible: false,
        busy:false,
        currentRedInfo:{
          createTime:0,
          currency:"",
          distributedNum:0,
          endTime:0,
          groupLink:"",
          id:"",
          imageId:"",
          intro:"",
          link:"",
          maxVolume:0,
          minVolume:0,
          sortIndex:0,
          status:0,
          title:"",
          topPriceCurrency:"",
          userId:0,
          visible:false
        },
        currentIndex:0,
        rules: {
          title: [
            {required: false, message: $i18n.t('redpacket.redNameReq'), trigger: 'blur'}
          ],
          imageId: [
            {required: false, message: $i18n.t('redpacket.redPhotoReq'), trigger: 'blur'},
          ],
          link: [
            {required: true, message:$i18n.t('redpacket.redTxtReq'), trigger: 'blur'},
          ],
          groupLink: [
            {required: true, message:$i18n.t('redpacket.groupLinkReq'), trigger: 'blur'},
          ],
        },
      }
    },
    components: {
      myUpload
    },
    computed:{
      languageList(){
        return this.$store.state.languageList;
      }
    },
    methods: {
      open(items,index) {
        /*this.currentRedInfo=items;*/
        //console.log(items)
        Object.assign(this.currentRedInfo,items)
        this.currentIndex=index;
        this.dialogVisible = true;
      },
      onSubmit() {
        this.$refs.ruleForms.validate((valid) => {
          //判断验证是否通过
          if (valid) {
            this.busy = true;
            let currentRedInfo = Object.assign({},this.currentRedInfo);
            // api
            this.postAjax('/DividedEnvelope/Update',currentRedInfo,()=>{
              this.$message.success(this.$t('message.updateTip'));
              this.$emit('editSuc');
              this.dialogVisible = false;
              this.busy = false;
            },()=>{
              this.busy = false;
            })
          }
        });
      },
      handleImageSuccess(file){
        //console.log(file.value)
        this.currentRedInfo.imageId = file.value;
      },
      resetFilter(){
        this.currentRedInfo = {
          createTime:0,
          currency:"",
          distributedNum:0,
          endTime:0,
          groupLink:"",
          id:"",
          imageId:"",
          intro:"",
          link:"",
          maxVolume:0,
          minVolume:0,
          sortIndex:0,
          status:0,
          title:"",
          topPriceCurrency:"",
          userId:0,
          visible:false
        }
        this.$refs.ruleForms.resetFields();
        //this.$refs.ruleForms.resetFields();
      }
    },
    created() {
    },
  }
</script>

<style scoped>
  .img-style{
    line-height: 180px;
  }
</style>
