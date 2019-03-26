<template>
  <div class="vote-edit">
    <h2>{{$route.params.id?$t('currencyVoteManage.editTitle'):$t('currencyVoteManage.newTitle')}}</h2>
    <!--custom-class="align-middle"-->
    <el-form :model="voteInfo" :rules="rules" ref="ruleForm" label-width="109px">
      <el-form-item :label="$t('currencyVoteManage.langColumn')" prop="lang">
        <!--<el-select v-model="voteInfo.lang" @change="changeLanguage">-->
        <!--<el-option v-for="(s,k) in languageCodeObj" :key="k" :label="s.text" :value="Number(s.value)"></el-option>-->
        <!--</el-select>-->
        <my-select :choices="languageCodeObj" :selectValue="lang" labelStr="text" valueStr="code"
                   :beforeChange="beforeLangChange" @selectChange="changeLanguage"></my-select>
      </el-form-item>
      <el-form-item :label="$t('currencyVoteManage.titleColumn')" prop="title">
        <el-input v-model="voteInfo.title"></el-input>
      </el-form-item>
      <!--<el-form-item :label="$t('currencyVoteManage.logoEditColumn')" prop="imageId">-->
        <!--<my-upload-->
          <!--host="/Image/Upload"-->
          <!--format="image"-->
          <!--name="image"-->
          <!--:maxSize="4*1024*1024"-->
          <!--@success="handleImageSuccess"-->
        <!--&gt;-->
          <!--<div slot="style" class="img-style" v-if="voteInfo.imageId">-->
            <!--<img :src="`/Image/${voteInfo.imageId}`|hostImgPath" alt="">-->
          <!--</div>-->
        <!--</my-upload>-->
      <!--</el-form-item>-->
      <el-form-item :label="$t('currencyVoteManage.timeColumn')" prop="time">
        <el-date-picker
          v-model="vote.startTime"
          type="datetime"
          value-format="timestamp"
          placeholder="Start">
        </el-date-picker>
        <el-date-picker
          arrow-control
          v-model="vote.endTime"
          type="datetime"
          value-format="timestamp"
          placeholder="End">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('currencyVoteManage.newProjectAndNodeTitle')" prop="node" v-if="vote.id">
        <el-button type="success" size="small" @click="addCoinProjectRecord">{{$t('message.add')}}</el-button>
        <div class="table">
          <div class="el-row thead" :gutter="0">
            <el-col :span="6">
              {{$t('currencyVoteManage.projectName')}}
            </el-col>
            <el-col :span="12">
              {{$t('currencyVoteManage.nodeName')}}
            </el-col>
            <el-col :span="6">
              {{$t('message.handle')}}
            </el-col>
          </div>
          <draggable v-model="coinProjectRecords" class="tbody" @end="dragEnd">
            <transition-group>
              <div class="el-row" :gutter="0" v-for="record in coinProjectRecords" :key="record.id">
                <el-col :span="6">
                  {{record.name}}
                </el-col>
                <el-col :span="12">
                  <span v-for="node in record.starNodes" style="display:inline-block;margin-right:10px;">{{node.name}}</span>
                </el-col>
                <el-col :span="6">
                  <el-button size="small" type="primary" @click="editCoinProjectRecord(record)">{{$t('message.update')}}</el-button>
                  <el-button size="small" type="danger"  @click="deleteCoinProjectRecord(record)">{{$t('message.delete')}}</el-button>
                </el-col>
              </div>
            </transition-group>
          </draggable>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="busy" :disabled="!needSave" @click="onSubmit">{{$t('message.Save')}}</el-button>
      </el-form-item>
    </el-form>
    <edit-confirm  @save="save" @notSave="notSave" ref="editConfirm"></edit-confirm>
    <edit-record-dialog ref="editRecordDialog" @editSuc="getCoinProjectRecords"></edit-record-dialog>
  </div>
</template>

<script>
  // import myUpload from '../../common/MyUpload'
  import mySelect from '../../common/MySelect'
  import editConfirm from '../../common/EditorConfirm'
  import draggable from 'vuedraggable'
  import editRecordDialog from './editVoteRecordDialog'

  export default {
    data() {
      let inputTimeValidator = (rule, value, callback) => {
        console.log(this.vote);
        if(!this.vote.startTime || !this.vote.endTime){
          callback(new Error(this.$t('currencyVoteManage.timeRequired')))
        }else if(this.vote.startTime >= this.vote.endTime){
          callback(new Error(this.$t('currencyVoteManage.timeNotValid')))
        }else{
          callback();
        }
      }
      return {
        dialogVisible: false,
        busy: false,
        voteInfo: {
          title: '',
        },
        lang: '',
        vote: {
          id: '',
          startTime:'',
          endTime:'',
          voteInfos: {}
        },
        rules: {
          title: [
            {required: true, message: this.$t('currencyVoteManage.titleRequired'), trigger: 'blur'}
          ],
          // imageId: [
          //   {required: true, message: this.$t('currencyVoteManage.imageIdRequired'), trigger: 'blur'},
          // ],
          time: [
            {validator:inputTimeValidator},
          ]
        },
        limits:[],
        coinProjectRecords: [],
        needSave: false,
      }
    },
    components: {
      // myUpload,
      mySelect,
      editConfirm,
      draggable,
      editRecordDialog
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
          this.busy = true;
          Object.assign(this.vote.voteInfos, {
            [this.lang]: this.voteInfo
          })
          this.removeNullVotes();
          let vote = Object.assign({},this.vote);
          vote.startTime /= 1000;
          vote.endTime /= 1000;
          // api
          if (this.vote.id) {
            this.postAjax('/vote/Update', {id: this.vote.id, ...vote}, () => {
              this.$message.success(this.$t('message.updateTip'));
              this.setVote(this.vote);
              this.busy = false;
              this.needSave = false;
            }, () => {
              this.busy = false;
            })
          } else {
            this.postAjax('/vote/Add', vote, (res) => {
              this.$message.success(this.$t('message.successTip'));
              this.vote.id = res.body.value;
              this.setVote(this.vote.id,this.vote);
              this.busy = false;
              this.needSave = false;
              this.$router.replace({name: 'voteEdit', params: {id: this.vote.id}, query: {lang: this.lang}});
            }, () => {
              this.busy = false;
            })
          }
        }
      },
      removeNullVotes() {
        let removeLangs = [];
        for (let lang in this.vote.voteInfos) {
          if (!this.vote.voteInfos[lang].title.trim()) {
            removeLangs.push(lang);
          }
        }
        removeLangs.forEach((lang) => {
          delete this.vote.voteInfos[lang];
        })
      },
      handleImageSuccess(file) {
        this.voteInfo.imageId = file.value;
      },
      changeLanguage(val) {
        console.log('changeLanguage');
        this.lang = val;
        // 切换一种新的语言
        if (!this.vote.voteInfos[val]) {
          this.vote.voteInfos[val] = {
            title: '',
          }
        }
        this.voteInfo = this.vote.voteInfos[val];
        console.log(this.vote);
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
          this.needSave = false;
        })
      },
      beforeLangChange(callback) {
        if (this.needSave) {
          this.$refs.editConfirm.open({cb: callback});
        } else {
          callback()
        }
      },
      save({cb}) {
        this.onSubmit().then((res) => {
          if (res) {
            this.changeLanguage();
            cb && cb();
          }
        });
      },
      notSave({cb}) {
        cb && cb();
        this.$nextTick(() => {
          this.initVoteInfo(this.lang);
        })
      },
      getVote(id) {
        return JSON.parse(sessionStorage.getItem(`AZEX_CurrencyTpl_${id}`));
      },
      setVote(id,data) {
        sessionStorage.setItem(`AZEX_CurrencyTpl_${id}`,JSON.stringify(data))
      },
      initVoteInfo(lang) {
        let voteId = this.$route.params.id;
        if (voteId !== 'new') {
          Object.assign(this.vote, this.getVote(voteId))
          Object.assign(this.voteInfo, this.vote.voteInfos[lang])
          this.vote.startTime&&(this.vote.startTime *= 1000);
          this.vote.endTime&&(this.vote.endTime *= 1000);
        } else {
          this.vote = {
            id:'',
            voteInfos:{}
          }
        }
        this.$nextTick(()=>{
          this.needSave = false;
        })
        this.lang = lang;
      },
      handleImageSuccess(data) {
        this.voteInfo.imageId = data.value;
      },
      getCoinProjectRecords() {
        this.postAjax('/vote/getVoteDetail', {
          id: this.$route.params.id,
          lang: this.$route.query.lang
        }, (res) => {
          this.coinProjectRecords = res.body.value.coinProjectRecords;
        })
      },
      addCoinProjectRecord() {
        console.log('add');
        this.$refs.editRecordDialog.open({
          voteId:this.vote.id
        },this.lang)
      },
      editCoinProjectRecord(record){
        record.starNodeIds = record.starNodes.map((item)=>{
          return item.id;
        })
        this.$refs.editRecordDialog.open({
          voteId:this.vote.id,...record},this.lang)
      },
      deleteCoinProjectRecord(record){
        this.$confirm(this.$t('message.deleteConfirmText').replace('0',record.name),
          this.$t('currencyVoteManage.deleteRecordTip'),{
            confirmButtonText: this.$t('message.MakeSure'),
            cancelButtonText: this.$t('message.Cancel'),
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
          this.postAjax('/Vote/DeleteCoinProjectRecord', {
            id:record.id,
          }, () => {
            this.$message.success(this.$t('message.deleteTip'));
            this.getCoinProjectRecords();
          })
        })
      },
      dragEnd(){
        let sortIds = {};
        this.coinProjectRecords.forEach((record,index)=>{
            sortIds[record.id] = index
        });
        this.postAjax('/Vote/UpdateCoinProjectRecordIndex',{
          items:sortIds
        },null,()=>{
          this.getCoinProjectRecords();
        })
      }
    },
    watch:{
      voteInfo:{
        handler(val){
          this.needSave = true;
        },
        deep:true
      },
    },
    created() {
      this.initVoteInfo(this.$route.query.lang || 'cn');
      if(this.$route.params.id!=='new'){
        this.getCoinProjectRecords();
      }
    },
  }
</script>

<style scoped>
  h2 {
    margin-bottom: 20px;
  }

  .vote-edit {
    max-width: 800px;
  }

  .table .thead {
    background-color: #ebeef5;
  }

  .table {
    border-top: 1px solid #ebeef5;

  }

  .table .el-row {
    border-bottom: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    align-items: center;
    display: flex;
  }

  .table .tbody .el-row {
    cursor: pointer;
  }

  .table .tbody .el-row:hover {
    background-color: #f5f7fa;
  }

  .table .el-col {
    padding: 6px 10px;
    font-size: 14px;
  }
</style>
