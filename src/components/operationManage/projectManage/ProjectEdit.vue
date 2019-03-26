<template>
  <div class="project-edit">
    <h2>{{$route.params.id?$t('projectManage.editTitle'):$t('projectManage.newTitle')}}</h2>
    <!--custom-class="align-middle"-->
    <el-form :model="projectInfo" :rules="rules" ref="ruleForm" label-width="109px">
      <el-form-item :label="$t('projectManage.langColumn')" prop="lang">
        <!--<el-select v-model="projectInfo.lang" @change="changeLanguage">-->
          <!--<el-option v-for="(s,k) in languageCodeObj" :key="k" :label="s.text" :value="Number(s.value)"></el-option>-->
        <!--</el-select>-->
        <my-select :choices="languageCodeObj" :selectValue="lang" labelStr="text" valueStr="code"
                   :beforeChange="beforeLangChange" @selectChange="changeLanguage"></my-select>
      </el-form-item>
      <el-form-item :label="$t('projectManage.nameColumn')" prop="name">
        <el-input v-model="projectInfo.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('projectManage.logoEditColumn')" prop="imageId">
        <my-upload
          host="/Image/Upload"
          format="image"
          name="image"
          :maxSize="4*1024*1024"
          @success="handleImageSuccess"
        >
          <div slot="style" class="img-style" v-if="projectInfo.imageId">
            <img :src="`/Image/${projectInfo.imageId}`|hostImgPath" alt="">
          </div>
        </my-upload>
      </el-form-item>
      <el-form-item :label="$t('projectManage.introEditColumn')" prop="intro">
        <el-input type="textarea" v-model="projectInfo.intro" :maxlength="40"></el-input>
      </el-form-item>
      <el-form-item :label="$t('projectManage.websiteColumn')" prop="official">
        <el-input type="text" v-model="projectInfo.official"></el-input>
      </el-form-item>
      <el-form-item :label="$t('projectManage.whiteaperEditColumn')" prop="whiteaper">
        <el-input type="text" v-model="projectInfo.whiteaper"></el-input>
      </el-form-item>
      <el-form-item :label="$t('projectManage.detailEditColumn')" prop="detail">
        <quill-editor v-model="projectInfo.detail">
        </quill-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="busy" :disabled="!needSave" @click="onSubmit">{{$t('message.Save')}}
        </el-button>
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
        projectInfo: {
          name: '',
          imageId: '',
          intro: '',
          detail: '',
          official: '',
          whiteaper: '',
        },
        lang:'',
        project: {
          id: '',
          coinProjectInfos: {}
        },
        rules: {
          name: [
            {required: true, message: this.$t('projectManage.nameRequired'), trigger: 'blur'}
          ],
          imageId: [
            {required: true, message: this.$t('projectManage.imageIdRequired'), trigger: 'blur'},
          ],
          intro: [
            {required: true, message: this.$t('projectManage.introRequired'), trigger: 'blur'},
          ],
          detail: [
            {required: true, message: this.$t('projectManage.detailRequired'), trigger: 'blur'},
          ],
          official: [
            {required: true, message: this.$t('projectManage.officialRequired'), trigger: 'blur'},
          ],
          whiteaper: [
            {required: true, message: this.$t('projectManage.whiteaperRequired'), trigger: 'blur'},
          ],
        },
        needSave: false,
      }
    },
    components: {
      myUpload,
      mySelect,
      editConfirm
    },
    computed: {
      languageCodeObj() {
        return this.$store.state.languageCodeObj;
      }
    },
    methods: {
      async onSubmit() {
        let valid = false;
        await this.$refs.ruleForm.validate((isValid) => {
          valid = isValid;
        });
        if (valid) {
          Object.assign(this.project.coinProjectInfos, {
            [this.lang]: this.projectInfo
          })
          this.removeNullProjects();
          // api
          if (this.project.id) {
            this.postAjax('/coinProject/Update', {id: this.project.id, ...this.project}, () => {
              this.$message.success(this.$t('message.updateTip'));
              this.setProject(this.project.id,this.project);
              this.busy = false;
              this.needSave = false;
            }, () => {
              this.busy = false;
            })
          } else {
            this.postAjax('/coinProject/Add', this.project, (res) => {
              this.$message.success(this.$t('message.successTip'));
              this.project.id = res.body.value;
              this.setProject(this.project.id,this.project);
              this.busy = false;
              this.needSave = false;
              this.$router.replace({name: 'coinProjectEdit', params: {id: this.project.id}, query: {lang: this.lang}});
            }, () => {
              this.busy = false;
            })
          }
        };
      },
      removeNullProjects(){
        let removeLangs = [];
        for(let lang in this.project.coinProjectInfos){
          if(!this.project.coinProjectInfos[lang].name.trim()){
            removeLangs.push(lang);
          }
        }
        removeLangs.forEach((lang)=>{
          delete this.project.coinProjectInfos[lang];
        })
      },
      handleImageSuccess(file) {
        this.projectInfo.imageId = file.value;
      },
      changeLanguage(val) {
        console.log('changeLanguage');
        this.lang = val;
        // 切换一种新的语言
        if (!this.project.coinProjectInfos[val]) {
          this.project.coinProjectInfos[val] = {
            name: '',
            imageId: '',
            intro: '',
            detail: '',
            official: '',
            whiteaper: '',
          }
        }
        this.projectInfo = this.project.coinProjectInfos[val];
        console.log(this.project);
        this.$nextTick(()=>{
          this.$refs.ruleForm.clearValidate();
          this.needSave = false;
        })
      },
      beforeLangChange(callback){
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
          this.initProjectInfo(this.lang);
        })
      },
      getProject(id) {
        return JSON.parse(sessionStorage.getItem(`AZEX_CoinProject_${id}`));
      },
      setProject(id,data) {
        sessionStorage.setItem(`AZEX_CoinProject_${id}`,JSON.stringify(data));
      },
      initProjectInfo(lang) {
        let projectId = this.$route.params.id;
        if (projectId !== 'new') {
          Object.assign(this.project, this.getProject(projectId))
          Object.assign(this.projectInfo, this.project.coinProjectInfos[lang])
        } else{
          this.node = {
            id: '',
            coinProjectInfos: {}
          };
        }
        this.$nextTick(()=>{
          this.needSave = false;
        })
        this.lang = lang;
      },
    },
    watch:{
      projectInfo:{
        handler(val){
          this.needSave = true;
        },
        deep:true
      },
    },
    created() {
      this.initProjectInfo(this.$route.query.lang || 'cn');
    },
  }
</script>

<style scoped>
  h2 {
    margin-bottom: 20px;
  }

  .project-edit {
    max-width: 800px;
  }
</style>
<style>
  .project-edit .my-upload .el-upload-dragger{
    width:180px !important;
  }
  .project-edit .my-upload .el-upload-dragger .img-style {
    line-height: 180px;
  }
</style>
