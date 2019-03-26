<template>
  <el-dialog
    :title="`Banner ${banner.id?$t('banner.editText'):$t('banner.createText')}`"
    :visible.sync="dialogVisible"
    width="600px"
    center
    top="20px"
    @close="resetFilter"
    :closeOnClickModal="false"
  >
  <!--custom-class="align-middle"-->
  <el-form :model="banner" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item :label="$t('banner.titleColumn')" prop="name">
        <el-input v-model="banner.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('banner.startTimeColumn')" prop="startTime">
        <el-date-picker
          value-fotmat="timestamp"
          v-model="banner.startTime"
          type="datetime"
          :placeholder="$t('banner.selDateTimePlc')">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('banner.endTimeColumn')" prop="expireTime">
        <el-date-picker
          value-fotmat="timestamp"
          v-model="banner.expireTime"
          type="datetime"
          :placeholder="$t('banner.selDateTimePlc')">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('banner.platformColumn')" prop="platform">
        <el-select v-model="banner.platform">
          <el-option v-for="s in bannerPlatformList" :key="s.value" :label="s.label" :value="s.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('banner.langColumn')" prop="lang">
        <el-select v-model="banner.lang">
          <el-option v-for="(s,k) in languageList" :key="k" :label="s.text" :value="Number(s.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('banner.linkColumn')" prop="href">
        <el-input v-model="banner.href"></el-input>
      </el-form-item>
      <el-form-item :label="$t('banner.imageColumn')" prop="imageId">
        <my-upload
          host="/Image/Upload"
          format="image"
          name="image"
          :maxSize="4*1024*1024"
          @success="handleImageSuccess"
        >
          <div slot="style" class="img-style" v-if="banner.imageId">
          <img :src="`${postAjaxBaseUrl}/Image/${banner.imageId}`" alt="">
        </div>
        </my-upload>
      </el-form-item>
      <el-form-item :label="$t('banner.statusColumn')" prop="status" v-if="!banner.id">
        <el-switch
          v-model="banner.status"
          :active-value="1"
          :inactive-value="2"
          :active-text="$t('banner.enableText')"
          :inactive-text="$t('banner.disableText')">
        </el-switch>
      </el-form-item>
    <el-form-item :label="$t('banner.sortColumn')" prop="sortIndex" v-if="banner.id">
      <el-input type="number" v-model="banner.sortIndex"></el-input>
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
        banner: {
          name: '',
          startTime: '',
          expireTime: '',
          imageId: '',
          platform: 3,
          lang: 1,
          href: 'http://',
          status: 1
        },
        bannerPlatformList: [
          {
            value: 1,
            label: this.$t('banner.platform1Text')
          },
          {
            value: 2,
            label: this.$t('banner.platform2Text')
          },
          {
            value: 3,
            label: this.$t('banner.platform3Text')
          },
        ],
        rules: {
          name: [
            {required: true, message: $i18n.t('banner.nameRequired'), trigger: 'blur'}
          ],
          startTime: [
            {required: true, message: $i18n.t('banner.startTimeRequired'), trigger: 'blur'},
          ],
          expireTime: [
            {required: true, message: $i18n.t('banner.endTimeRequired'), trigger: 'blur'},
          ],
          imageId: [
            {required: true, message: $i18n.t('banner.imageIdRequired'), trigger: 'blur'},
          ],
          platform: [
            {required: true, message: $i18n.t('banner.platformRequired'), trigger: 'blur'},
          ],
          lang: [
            {required: true, message: $i18n.t('banner.langRequired'), trigger: 'blur'},
          ],
          href: [
            {required: true, type: 'url', message: $i18n.t('banner.linkRequired'), trigger: 'blur'},
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
      open(banner) {
        if(banner){
          banner.startTime && (banner.startTime *= 1000);
          banner.expireTime && (banner.expireTime *= 1000);
          Object.assign(this.banner, banner)
        }
        this.dialogVisible = true;
      },
      onSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.busy = true;
            let banner = Object.assign({},this.banner);
            banner.startTime = parseInt(new Date(banner.startTime).getTime()/1000);
            banner.expireTime = parseInt(new Date(banner.expireTime).getTime()/1000);
            // api
            if(this.banner.id){
              this.postAjax('/Banner/Update',banner,()=>{
                this.$message.success(this.$t('message.updateTip'));
                this.$emit('editSuc');
                this.dialogVisible = false;
                this.busy = false;
              },()=>{
                this.busy = false;
              })
            }else{
              this.postAjax('/Banner/Add',banner,()=>{
                this.$message.success(this.$t('message.successTip'));
                this.$emit('editSuc');
                this.dialogVisible = false;
                this.busy = false;
              },()=>{
                this.busy = false;
              })
            }
          }
        });
      },
      handleImageSuccess(file){
        this.banner.imageId = file.value;
      },
      resetFilter(){
        this.banner = {
          name: '',
          startTime: '',
          expireTime: '',
          imageId: '',
          platform: 3,
          lang: 1,
          href: 'http://',
          status: 1
        };
        this.$refs.ruleForm.resetFields();
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
