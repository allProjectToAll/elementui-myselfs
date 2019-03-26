<template>
    <div class="MiningBox">
      <h2>{{$t('message.MiningManagement')}}</h2>
      <div class="box1">
        <div class="mining-configuration">
          <el-table
            :data="MiningConfiguration"
            style="background:#fff;width: 100%;margin-top: 55px">
            <el-table-column
              prop="planPerHourOutput"
              label="块大小"
            align="center">
            </el-table-column>
            <el-table-column
              label="taker 返还比例"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.takerRate *100}}%</span>
              </template>
            </el-table-column>
            <el-table-column
              label="maker 返还比例"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.makerRate *100}}%</span>
              </template>
            </el-table-column>
            <el-table-column
            label="手续费折扣"
            align="center">
              <template slot-scope="scope">
                <span>{{scope.row.notOutputDiscount *100}}%</span>
              </template>
          </el-table-column>
            <el-table-column
              label="分红比例"
              align="center">
              <template slot-scope="scope">
                <span> {{ scope.row.holdBonusRate *100}}%</span>
              </template>
            </el-table-column>
            <el-table-column
              label="挖矿开关"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isOpen">开启</span>
                <span v-if="!scope.row.isOpen">未开启</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button v-if="limits.includes(1)" size="mini" type="primary" @click="editConfiguration(scope.row)">{{$t('message.update')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <h2 style="line-height: 48px">AZT 数据总览</h2>
        <div class="azt-data">
          <ul>
            <li>今日挖矿释放AZT</li>
            <li>{{totalInfo.todayOutput}}</li>
          </ul>
          <ul>
            <li>昨日挖矿释放AZT</li>
            <li>{{totalInfo.yesterdayOutput}}</li>
          </ul>
        </div>
        <div class="azt-three">
          <ul>
            <li>挖矿累计释放AZT</li>
            <li>{{totalInfo.historyOutput}}</li>
          </ul>
          <ul>
            <li>等比解锁累计AZT</li>
            <li>{{totalInfo.releaseOutput}}</li>
          </ul>
          <ul>
            <li>AZT 解锁总量</li>
            <li>{{totalInfo.circulationVolume}}</li>
          </ul>
        </div>
        <h2 style="margin-top: 20px">分红数据总览</h2>
        <div class="azt-three">
          <ul>
            <li>今日手续费收入折合USDT</li>
            <li>{{totalInfo.todayFeeToUsdt}}</li>
          </ul>
          <ul>
            <li>昨日手续费收入折合USDT</li>
            <li>{{totalInfo.yesterdayFeeToUsdt}}</li>
          </ul>
          <ul>
            <li>累计手续费收入折合USDT</li>
            <li>{{totalInfo.historyFeeToUsdt}}</li>
          </ul>
        </div>
        <div class="azt-three">
          <ul>
            <li>今日分配收入折合USDT</li>
            <li>{{totalInfo.todayBonusToUsdt}}</li>
          </ul>
          <ul>
            <li>昨日日分配收入折合USDT</li>
            <li>{{totalInfo.yesterdayBonusToUsdt}}</li>
          </ul>
          <ul>
            <li>累计收入折合USDT</li>
            <li>{{totalInfo.historyBonusToUsdt}}</li>
          </ul>
        </div>
        <div class="azt-three">
          <ul>
            <li>今日实际分配收入折合USDT</li>
            <li>{{totalInfo.todayActualBonusToUsdt}}</li>
          </ul>
          <ul>
            <li>昨日实际分配收入折合USDT</li>
            <li>{{totalInfo.yesterdayActualBonusToUsdt}}</li>
          </ul>
          <ul>
            <li>实际累计分配收入折合USDT</li>
            <li>{{totalInfo.historyActualBonusToUsdt}}</li>
          </ul>
        </div>
        <div class="tab-table">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="挖矿明细" name="1">
              <el-table
                :data="MiningMingXi"
                style="width: 100%">
                <el-table-column
                  prop="miningTime"
                  label="时间"
                align="center">
                  <template slot-scope="scope">
                    <span>{{creatDay(scope.row.miningTime)}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="output"
                  label="挖矿产出AZT"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="release"
                  label="解锁产出AZT"
                  align="center">
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="分红明细" name="2">
              <el-table
                :data="FenRedMing"
                style="width: 100%">
                <el-table-column
                  prop="bonusTime"
                  label="时间"
                  align="center">
                  <template slot-scope="scope">
                    <span>{{creatDay(scope.row.bonusTime)}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="currency"
                  label="币种"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="fee"
                  label="手续费收入"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="bnous"
                  label="分红金额"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="actualBnous"
                  label="实际分红金额"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="bonusStatus"
                  label="状态"
                  align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.bonusStatus == 0">无</span>
                    <span v-if="scope.row.bonusStatus == 1">未分配</span>
                    <span v-if="scope.row.bonusStatus == 2">已分配</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <div class="tab-right">
           <el-button size="small" :disabled="Isdistribute" @click="centerDialogVisible = true" v-show="limits.includes(2)&&activeName == '2'">执行分配</el-button>
            <el-date-picker
              v-model="OneTime"
              type="date"
              @change="picker"
              placeholder="选择日期"
              value-format="timestamp">
            </el-date-picker>
          </div>
        </div>
      </div>
      <el-dialog title="挖矿配置" :visible.sync="dialogFormVisible" width="500px">
        <el-form :model="ReviseForm" width="400px" style="margin: 0">
          <el-form-item label="块大小" label-width="130px">
            <el-input v-model="ReviseForm.planPerHourOutput" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="taker 返还比例"  label-width="130px">
            <el-input v-model="ReviseForm.takerRate"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="maker 返还比例" label-width="130px">
            <el-input v-model="ReviseForm.makerRate"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="手续费折扣" label-width="130px">
            <el-input v-model="ReviseForm.notOutputDiscount"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="分红比例" label-width="130px">
            <el-input v-model="ReviseForm.holdBonusRate"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="开关" label-width="130px">
            <el-switch
              v-model="ReviseForm.isOpen">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateBasicSetting">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="执行分配"
        :visible.sync="centerDialogVisible"
        width="400px"
        center>
        <p style="text-align: center">您确定执行分配吗？</p>
        <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="distribute">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>
<script>
    export default {
      data(){
        return{
          MiningConfiguration:[],
          MiningMingXi:[],
          FenRedMing:[],
          activeName:'1',
          OneTime:new Date().setHours(0, 0, 0, 0),
          Isdistribute:false,
          dialogFormVisible:false,
          ReviseForm:{
            planPerHourOutput:'',
            makerRate:'',
            takerRate:'',
            notOutputDiscount:'',
            holdBonusRate:'',
            isOpen:true,
          },
          totalInfo:{},
          centerDialogVisible:false,
          limits:[]
        }
      },
      created(){
        this.getBasicSetting();
        this.getMiningInfo();
        this.getMiningList();
        this.getLimits();
      },
      methods:{
        getLimits(){
          this.postAjax('/Mining/Limits',{},(res)=>{
            this.limits = res.body.value;
          })
        },
        getBasicSetting(){
          this.postAjax('/Mining/GetBasicSetting',null,(res)=>{
            this.MiningConfiguration.push(res.data.value);
            console.log(res,res.data.value,this.MiningConfiguration);
          },(err)=>{
            console.log(err);
          })
        },
        getMiningInfo(){
          this.postAjax('/Mining/GetMiningManageInfo',null,(res)=>{
              this.totalInfo = res.data.value;
          },(err)=>{
            console.log(err);
          })
        },
        getMiningList(){
          console.log(new Date(this.OneTime));
          this.postAjax('/Mining/GetMiningList',{
            beginTime:this.OneTime/1000,
            endTime:this.OneTime/1000+86399
          },(res)=>{
            this.MiningMingXi = res.data.value;
            this.openErr(this.$t("message.SuccessToGetList"), 2);
          },(err)=>{
            console.log(err);
          })
        },
        getBonusList(){
          this.postAjax('/Mining/GetBonusList',{
            beginTime:this.OneTime/1000,
            endTime:this.OneTime/1000+86399
          },(res)=>{
            this.FenRedMing = res.data.value;
            this.openErr(this.$t("message.SuccessToGetList"), 2);
          },(err)=>{
            console.log(err);
          })
        },
        editConfiguration(row){
          console.log(row);
          this.ReviseForm = {
            planPerHourOutput:row.planPerHourOutput,
            makerRate:row.makerRate * 100,
            takerRate:row.takerRate *100,
            notOutputDiscount:row.notOutputDiscount *100,
            holdBonusRate:row.holdBonusRate *100,
            isOpen:row.isOpen
          }
          this.dialogFormVisible = true;
        },
        updateBasicSetting(){
          this.postAjax('/Mining/UpdateBasicSetting',{
            planPerHourOutput:this.ReviseForm.planPerHourOutput,
            makerRate:this.ReviseForm.makerRate / 100,
            takerRate:this.ReviseForm.takerRate / 100,
            notOutputDiscount:this.ReviseForm.notOutputDiscount / 100,
            holdBonusRate:this.ReviseForm.holdBonusRate / 100,
            isOpen:true,
          },(res)=>{
            this.MiningConfiguration = [];
            setTimeout(()=>{
              this.openErr(this.$t("message.OperationSuccessful"), 2);
              this.getBasicSetting();
            },100);
            this.dialogFormVisible = false;
          },(err)=>{
            console.log(err);
            // this.ReviseForm = {
            //   planPerHourOutput:this.ReviseForm.planPerHourOutput,
            //   makerRate:this.ReviseForm.makerRate * 100,
            //   takerRate:this.ReviseForm.takerRate * 100,
            //   notOutputDiscount:this.ReviseForm.notOutputDiscount * 100,
            //   holdBonusRate:this.ReviseForm.holdBonusRate * 100,
            //   isOpen:true,
            // }
          })
        },
        handleClick() {
          if(this.activeName == '1'){
            this.getMiningList();
          }else {
            this.getBonusList();
          }
        },
        distribute(){
          this.postAjax('/Mining/AllocBonus',{
            beginTime:this.OneTime/1000,
            endTime:this.OneTime/1000+86399
          },(res)=>{
            setTimeout(()=>{
              this.openErr(this.$t("message.OperationSuccessful"), 2);
              this.picker();
            },100)
            this.centerDialogVisible = false;
          },(err)=>{
            console.log(err);
          })
        },
        picker(){
          console.log(this.OneTime,new Date(this.OneTime));
          if(this.activeName == '1'){
            this.getMiningList();
          }else {
            this.getBonusList();
          }
        }
      },
    }
</script>
<style>
  .MiningBox .el-table .el-table__header thead tr th{
    background: #fff !important;
    border: 0;
  }

</style>
<style scoped>
li{
  list-style: none;
}
  .MiningBox{
    height: 100%;
    /*background: #F2F2F2;*/
    min-width: 850px;
  }
  .mining-configuration{
    /*width: 1089px;*/
    height: 200px;
    background: #fff;
    text-align: center;
    border: 1px solid rgba(187, 187, 187, 1);
  }
  .azt-data,.azt-three{
    display:flex;
    /* display */
    height: 150px;
    border: 1px solid gray;
  }
  .azt-three{
    margin-top: 20px;
  }
  .azt-data ul,
  .azt-three ul{
    display: inline-block;
    flex: 1;
    text-align: center;
  }
  .azt-data ul li:first-of-type,
  .azt-three ul li:first-of-type{
    color: #A3A3A3;
    line-height: 70px;
    font-size: 14px;
  }
  .azt-data ul li:last-of-type,
  .azt-three ul li:last-of-type{
    font-size: 30px;
    font-weight: bolder;
  }
  .tab-table{
    margin-top: 20px;
    position: relative;
  }
  .tab-right{
    position: absolute;
    right: 10px;
    top: -10px;
  }
</style>
