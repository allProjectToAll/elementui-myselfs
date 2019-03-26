<template>
  <div class="start-node-edit">
    <h2>{{$route.params.id?$t('nodeManage.editTitle'):$t('nodeManage.newTitle')}}</h2>
    <!--custom-class="align-middle"-->
    <el-form :model="nodeInfo" :rules="rules" ref="ruleForm" label-width="109px">
      <el-form-item :label="$t('nodeManage.langColumn')" prop="lang">
        <!--<el-select v-model="lang">-->
          <!--<el-option v-for="(s,k) in languageObj" :key="k" :label="s.text" :value="s.code"></el-option>-->
        <!--</el-select>-->
        <my-select :choices="languageObj" :selectValue="lang" labelStr="text" valueStr="code"
                   :beforeChange="beforeLangChange" @selectChange="changeLanguage"></my-select>
      </el-form-item>
      <el-form-item :label="$t('nodeManage.nameColumn')" prop="name">
        <el-input v-model="nodeInfo.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('nodeManage.logoEditColumn')" prop="imageId">
        <my-upload
          host="/Image/Upload"
          format="image"
          name="image"
          :maxSize="4*1024*1024"
          @success="handleImageSuccess"
        >
          <div slot="style" class="img-style" v-if="nodeInfo.imageId">
            <img :src="`/Image/${nodeInfo.imageId}`|hostImgPath" alt="">
          </div>
        </my-upload>
      </el-form-item>
      <el-form-item :label="$t('nodeManage.introColumn')" prop="intro">
        <quill-editor v-model="nodeInfo.intro">
        </quill-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="busy" :disabled="!needSave" @click="onSubmit">{{$t('message.Save')}}</el-button>
      </el-form-item>
    </el-form>
    <edit-confirm  @save="save" @notSave="notSave" ref="editConfirm"></edit-confirm>
  </div>
</template>

<script>
  import myUpload from '../../common/MyUpload'
  import mySelect from '../../common/MySelect'
  import editConfirm from '../../common/EditorConfirm'

  export default {
    data() {
      return {
        dialogVisible: false,
        busy: false,
        nodeInfo: {
          name: '',
          imageId: '',
          intro: '',
        },
        lang: '',
        node: {
          id: '',
          starNodeInfos: {}
        },
        rules: {
          name: [
            {required: true, message: this.$t('nodeManage.nameRequired'), trigger: 'blur'}
          ],
          imageId: [
            {required: true, message: this.$t('nodeManage.imageIdRequired'), trigger: 'blur'},
          ],
          intro: [
            {required: true, message: this.$t('nodeManage.introRequired'), trigger: 'blur'},
          ],
        },
        needSave:false,
      }
    },
    components: {
      myUpload,
      mySelect,
      editConfirm
    },
    computed: {
      languageObj() {
        return this.$store.state.languageObj;
      }
    },
    methods: {
      async onSubmit() {
        let valid = false;
        await this.$refs.ruleForm.validate((isValid) => {
          valid = isValid;
        });
        if (valid) {
          this.busy = true;
          Object.assign(this.node.starNodeInfos, {
            [this.lang]: this.nodeInfo
          })
          this.removeNullNodes();
          // api
          if (this.node.id) {
            await this.postAjax('/starNode/Update', this.node, () => {
              this.$message.success(this.$t('message.updateTip'));
              this.setNode(this.node.id,this.node);
              this.busy = false;
              this.needSave = false;
            }, () => {
              this.busy = false;
            })
          } else {
            await this.postAjax('/starNode/Add', this.node, (res) => {
              this.$message.success(this.$t('message.successTip'));
              this.node.id = res.body.value;
              this.setNode(this.node.id,this.node);
              this.busy = false;
              this.needSave = false;
              this.$router.replace({name: 'starNodeEdit', params: {id: this.node.id}, query: {lang: this.lang}});
            }, () => {
              this.busy = false;
            })
          }
        }
        return !this.needSave;
      },
      removeNullNodes(){
        let removeLangs = [];
        for(let lang in this.node.starNodeInfos){
          if(!this.node.starNodeInfos[lang].name.trim()){
            removeLangs.push(lang);
          }
        }
        removeLangs.forEach((lang)=>{
          delete this.node.starNodeInfos[lang];
        })
      },
      handleImageSuccess(file) {
        this.nodeInfo.imageId = file.value;
      },
      changeLanguage(val) {
        this.lang = val;
        // 切换一种新的语言
        if (!this.node.starNodeInfos[val]) {
          this.node.starNodeInfos[val] = {
            name: '',
            imageId: '',
            intro: '',
          }
        }
        this.nodeInfo = this.node.starNodeInfos[val];
        console.log(this.node);
        this.$nextTick(()=>{
          this.$refs.ruleForm.clearValidate();
          this.needSave = false;
        })
      },
      beforeLangChange(callback){
        console.log(this.lang);
        if(this.needSave){
          this.$refs.editConfirm.open({cb:callback});
        }else{
          callback()
        }
      },
      save({cb}){
        this.onSubmit().then((res) => {
          if(res){
            this.changeLanguage();
            cb&&cb();
          }
        });
      },
      notSave({cb}){
        cb&&cb();
        this.$nextTick(()=>{
          this.initNodeInfo(this.lang);
        })
      },
      getNode(id) {
        return JSON.parse(sessionStorage.getItem(`AZEX_StarNode_${id}`));
      },
      setNode(id,data) {
        sessionStorage.setItem(`AZEX_StarNode_${id}`,JSON.stringify(data));
      },
      initNodeInfo(lang) {
        let nodeId = this.$route.params.id;
        if (nodeId !== 'new') {
          Object.assign(this.node, this.getNode(nodeId))
          Object.assign(this.nodeInfo, this.node.starNodeInfos[lang])
        }else{
          this.node = {
            id: '',
            starNodeInfos: {}
          };
        }
        this.$nextTick(()=>{
          this.needSave = false;
        })
        this.lang = lang;
      },
      handleImageSuccess(data) {
        this.nodeInfo.imageId = data.value;
      }
    },
    watch:{
      nodeInfo:{
        handler(val){
          this.needSave = true;
        },
        deep:true
      },
    },
    created() {
      this.initNodeInfo(this.$route.query.lang || 'cn');
    },
  }
</script>

<style scoped>
  h2 {
    margin-bottom: 20px;
  }

  .node-edit {
    max-width: 800px;
  }
</style>
<style>
  .start-node-edit .img-style{
    line-height: 180px;
  }
</style>
