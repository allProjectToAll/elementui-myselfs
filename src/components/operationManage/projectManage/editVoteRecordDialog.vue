<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="500px"
    center
    :closeOnClickModal="false"
  >
    <div class="dialog-body">
      <div class="input-div">
        <span class="label">
          <span style="color:red">*</span>
          {{$t('currencyVoteManage.projectName')}}
        </span>
        <el-select v-model="record.coinProjectId" :disabled="!!record.id">
          <el-option v-for="p in coinProjectList" :key="p.id" :label="p.text" :value="p.id"></el-option>
        </el-select>
      </div>
      <div class="input-div">
        <span class="label">{{$t('currencyVoteManage.nodeName')}}</span>
        <el-select v-model="newStarNodeId">
          <el-option v-for="n in nodeObj" :key="n.id" :label="n.text" :value="n.id"></el-option>
        </el-select>
        <el-button type="primary" @click="addNode">{{$t('message.add')}}</el-button>
      </div>
      <div class="table">
        <div class="el-row thead" :gutter="0">
          <el-col :span="14">
            {{$t('currencyVoteManage.nodeName')}}
          </el-col>
          <el-col :span="10">
            {{$t('message.handle')}}
          </el-col>
        </div>
        <draggable v-model="record.starNodeIds" class="tbody" @end="dragEnd">
          <transition-group>
            <div class="el-row" :gutter="0" v-for="id in record.starNodeIds" :key="id">
              <el-col :span="14">
                {{nodeObj[id].text}}
              </el-col>
              <el-col :span="10">
                <el-button type="danger" size="small" @click="deleteNode">{{$t('message.delete')}}</el-button>
              </el-col>
            </div>
          </transition-group>
        </draggable>
      </div>
      <div class="oper-div">
        <el-button type="primary" @click="onSubmit">{{$t('message.Save')}}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    data() {
      return {
        dialogVisible: false,
        record: {},
        newStarNodeId: '',
        nodeObj: {},
        coinProjectList: [],
        lang: '',
        busy: false
      }
    },
    computed:{
      title(){
        return this.record.id?this.$t('currencyVoteManage.editProjectAndNodeTitle'):this.$t('currencyVoteManage.newProjectAndNodeTitle')
      }
    },
    methods: {
      open(record, lang) {
        this.record = Object.assign({
          voteId: "",
          id:'',
          coinProjectId: "",
          starNodeIds: []
        }, record);
        console.log(this.record);
        this.lang = lang;
        this.getNodeList();
        this.getCoinProjectList();
        this.dialogVisible = true;
      },
      onSubmit() {
        this.busy = true;
        if (!this.record.id) {
          this.postAjax('/Vote/AddCoinProjectRecord', this.record, () => {
            this.$emit('editSuc');
            this.dialogVisible = false;
            this.busy = false;
          }, () => {
            this.busy = false;
          })
        } else {
          this.postAjax('/Vote/UpdateCoinProjectRecord', {id: this.record.id, ...this.record}, () => {
            this.$emit('editSuc');
            this.dialogVisible = false;
            this.busy = false;
          }, () => {
            this.busy = false;
          })
        }
      },
      getNodeList() {
        this.postAjax('/Vote/GetStatNodes', {lang: this.lang}, (res) => {
          res.body.value.forEach((node) => {
            this.nodeObj[node.id] = node;
          });
          this.newStarNodeId = res.body.value[0].id;
        })
      },
      getCoinProjectList() {
        this.postAjax('/Vote/GetCoinProjects', {lang: this.lang}, (res) => {
          this.coinProjectList = res.body.value;
          if(!this.record.coinProjectId){
            this.record.coinProjectId = this.coinProjectList[0].id;
          }
        })
      },
      dragEnd() {
        console.log(this.record.starNodeIds);
      },
      addNode() {
        if (!this.newStarNodeId) {
          this.$message.error('请先选择一个节点');
          return;
        }
        if (this.record.starNodeIds.includes(this.newStarNodeId)) {
          this.$message.error('该节点已经在列表中');
          return;
        }
        this.record.starNodeIds.push(this.newStarNodeId);
      },
      deleteNode(index) {
        this.record.starNodeIds.splice(index, 1);
      },
    },
    components: {
      draggable
    },
    created() {
    },
  }
</script>

<style scoped>
  .input-div {
    width: 400px;
    margin:10px auto;
  }

  .input-div .label {
    width: 100px;
    display: inline-block;
  }

  .table .thead {
    background-color: #ebeef5;
  }

  .table {
    width: 400px;
    margin:0 auto;
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

  .oper-div {
    margin-top: 20px;
    text-align: center;
  }
</style>
