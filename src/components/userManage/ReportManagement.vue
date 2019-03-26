<template>
  <div class="content">
    <h2>资产总览</h2>
    <div class="box">
      <div class="sele-div" style="margin: 10px">
        <el-select v-model="Cath" @change="getInfos">
          <el-option :label="$t('message.PleaseChoise')" value=""></el-option>
          <el-option :key=index v-for="(item,index) in CathSelect" :label="item.toUpperCase()" :value="item">
          </el-option>
        </el-select>
        <div class="reload-btn">
          <span style="color: #A9A9A9;">更新时间：{{NowTime}}</span>
          <el-button @click="Reload">{{ $t("message.refresh") }}</el-button>
        </div>
      </div>
      <div class="fir-box">
        <div class="fir-left">
          <div class="inline-left">
            <h3>总收入： {{KGeneralIncome}} {{Cath.toUpperCase()}}</h3>
            <p>交易手续费收入: {{KTradefeeBalance}} {{Cath.toUpperCase()}}</p>
            <p>提现手续费收入: {{KWithdrawFee}} {{Cath.toUpperCase()}}</p>
            <p>商户手续费收入: {{KMerchantFeeIncome}} {{Cath.toUpperCase()}}</p>
          </div>
          <div class="inline-right">
            <h3>总支出： {{KTotalExpenditure}} {{Cath.toUpperCase()}}</h3>
            <p>转币手续费支出: {{KWithdrawTxFee}} {{Cath.toUpperCase()}}</p>
            <p>商户手续费支出: {{KMerchantFeeExpend}} {{Cath.toUpperCase()}}</p>
          </div>
        </div>
        <div class="fir-right">
          <h3>盈利： {{KProfit}} {{Cath.toUpperCase()}}</h3>
          <h3>已提取盈利: {{KTakeoffProfit}} {{Cath.toUpperCase()}}</h3>
          <h3>盈利结余: {{KEndProfit}} {{Cath.toUpperCase()}}</h3>
        </div>
      </div>
      <div class="sec-box">
        <div class="sec-left">
          <div class="inline-left">
            <h3>钱包资产： {{MerchantProperty}} {{Cath.toUpperCase()}}</h3>
            <p>热钱包余额: {{KHotBalance}} {{Cath.toUpperCase()}}</p>
            <p>冷钱包余额: {{KColdBalance}} {{Cath.toUpperCase()}}</p>

          </div>
          <div class="inline-right">
            <h3>用户资产： {{UserProperty}} {{Cath.toUpperCase()}}</h3>
            <p>用户可用余额: {{KUserBalance}} {{Cath.toUpperCase()}}</p>
            <p>未领取红包余额: {{KHongbaoBalance}} {{Cath.toUpperCase()}}</p>
            <p>用户冻结余额: {{KUserLockedBalance}} {{Cath.toUpperCase()}}</p>
            <p>提现未处理总额: {{KUnprocessWithdraw}} {{Cath.toUpperCase()}}</p>
          </div>
        </div>
        <div class="sec-right">
          <h2>风险值：{{Risk}}</h2>
        </div>
      </div>
      <div class="time-selct" style="text-align: right">
        <!--<el-date-picker-->
        <!--v-model="OneTime"-->
        <!--type="datetimerange"-->
        <!--:clearable="false"-->
        <!--:editable="false"-->
        <!--@change="DateChange"-->
        <!--:default-value="new Date()"-->
        <!--start-placeholder="开始日期"-->
        <!--value-format="timestamp"-->
        <!--end-placeholder="结束日期">-->
        <!--</el-date-picker>-->
        <el-date-picker
          v-model="OneTime"
          type="daterange"
          align="left"
          :clearable="false"
          :editable="false"
          value-format="timestamp"
          @change="DateChange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <div class="BtnGroup">
          <el-button size="small" :disabled="!MinuteShow" @click="MinuteTransform">分钟</el-button>
          <el-button size="small" :disabled="!HourShow" @click="HourTransform">小时</el-button>
          <el-button size="small" :disabled="!DayShow" @click="DayTransform">天</el-button>
          <el-button size="small" :disabled="!WeekShow" @click="WeekTransform">周</el-button>
          <el-button size="small" :disabled="!MonthShow" @click="MonthTransform">月</el-button>
        </div>
      </div>
      <div id="MyCanvas" style="height: 500px">

      </div>
      <el-table
        :data="ShowArray"
        style="margin-top: 50px"
        height="400">
        <el-table-column
          prop="period"
          label="日期"
          width="150">
        </el-table-column>
        <el-table-column
          prop="generalIncome"
          label="总收入"
          width="120">
        </el-table-column>
        <el-table-column
          prop="totalExpenditure"
          label="总支出"
          width="120">
        </el-table-column>
        <el-table-column
          prop="takeoffProfit"
          label="已提取盈利"
          width="120">
        </el-table-column>
        <el-table-column
          prop="endProfit"
          label="盈利结余"
          width="120">
        </el-table-column>
        <el-table-column
          prop="merchantProperty"
          label="钱包资产"
          width="120">
        </el-table-column>
        <el-table-column
          prop="userProperty"
          label="用户资产"
          width="120">
        </el-table-column>
        <el-table-column
          prop="risk"
          label="风险值"
          width="120">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        Cath: '',
        CathSelect: [],
        NowTime: '', //刷新时间
        KTradefeeBalance: '',//交易手续费收入
        KWithdrawFee: '', //提现手续费收入
        KUserBalance: '', //用户可用余额
        KUserLockedBalance: '', //用户冻结余额
        KHongbaoBalance: '', //未领取红包余额
        KUnprocessWithdraw: '', //提现未处理总额
        KWithdrawTxFee: '', //转币手续费支出
        KProfit: '', //盈利
        KEndProfit: '', //盈利结余
        KTakeoffProfit: '', //已提取盈利
        KHotBalance: '', //热钱包余额
        KColdBalance: '', //冷钱包余额
        KGeneralIncome: '', //总收入
        KTotalExpenditure: '',//总支出
        KMerchantFeeIncome: '',// 商户手续费收入
        KMerchantFeeExpend: '',//商户手续费支出
        MerchantProperty: '',//钱包资产
        UserProperty: '',//用户资产
        Risk: '', // 风险值
        loading:false,
        pickerOptions: {
          shortcuts: [{
            text: '今日',
            onClick(picker) {
              const end = new Date().setHours(0, 0, 0, 0) + 86399000;
              const start = new Date().setHours(0, 0, 0, 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '昨日',
            onClick(picker) {
              const end = new Date().setHours(0, 0, 0, 0) - 1000;
              const start = new Date().setHours(0, 0, 0, 0) - 86400000;
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              let nowweekDay = new Date().getDay()
              let myDate = new Date()
              myDate.setDate(myDate.getDate() + 1 - nowweekDay);
              const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000) - 1000;
              const start = myDate.setHours(0, 0, 0, 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              let nowMonth = new Date().getMonth()
              let setMounth = new Date()
              let NowDate = new Date().getDate()
              setMounth.setMonth(nowMonth);
              setMounth.setDate(1);
              setMounth.setHours(0, 0, 0, 0);
              const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000) - 1000;
              const start = setMounth.getTime();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              let nowMonths = new Date().getMonth();
              let setTree = new Date();
              setTree.setMonth(nowMonths - 3);
              setTree.setDate(1);
              setTree.setHours(0, 0, 0, 0);
              // this.beginTime = setTree.getTime() / 1000;
              // this.endTime = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1) / 1000;
              const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 )- 1000;
              const start = setTree.getTime();
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        OneTime: [new Date().setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0) + 86399000],
        RawArray: [], // 原数组
        bfArr:[],
        ShowArray: [], // 显示的数组
        TimeArray: [], // x轴显示数组
        MerchantPropertyArray: [], // 钱包资产K线
        UserPropertyArray: [], // 用户资产K线
        HourShow: true,
        MinuteShow: true,
        DayShow: false,
        WeekShow: false,
        MonthShow: false,
      }
    },
    created() {
      this.getCath();
      this.Cath = 'btc';
      this.getInfos();

    },
    mounted() {
      let now = new Date();
      let month = now.getMonth() + 1;     //月
      let day = now.getDate();            //日
      let hh = now.getHours();            //时
      let mm = now.getMinutes();          //分
      let ss = now.getSeconds();           //秒

      // this.NowTime = year + "-";

      if (month < 10)
        this.NowTime += "0";

      this.NowTime += month + "/";

      if (day < 10)
        this.NowTime += "0";

      this.NowTime += day + " ";

      if (hh < 10)
        this.NowTime += "0";

      this.NowTime += hh + ":";
      if (mm < 10) this.NowTime += '0';
      this.NowTime += mm + ":";

      if (ss < 10) this.NowTime += '0';
      this.NowTime += ss;
      this.getInfoLine();
      // this.CreateCanvas();
    },
    methods: {
      Reload() {
        window.location.reload();
      },
      getInfos() {
        this.postAjax('/Report/GetCurrentCoinBalance', {Currency: this.Cath}, (res) => {
          console.log(res);
          this.KTradefeeBalance = res.data.value.tradefeeBalance;
          this.KWithdrawFee = res.data.value.withdrawFee;
          this.KUserBalance = res.data.value.userBalance;
          this.KUserLockedBalance = res.data.value.userLockedBalance;
          this.KHongbaoBalance = res.data.value.hongbaoBalance;
          this.KUnprocessWithdraw = res.data.value.unprocessWithdraw;
          this.KWithdrawTxFee = res.data.value.withdrawTxFee;
          this.KTakeoffProfit = res.data.value.takeoffProfit;
          this.KHotBalance = res.data.value.hotBalance;
          this.KColdBalance = res.data.value.coldBalance;
          this.KMerchantFeeIncome = res.data.value.merchantProfit;
          this.KMerchantFeeExpend = res.data.value.merchantAddressActualFee;
          // 总收入
          this.KGeneralIncome = this.KTradefeeBalance + this.KWithdrawFee + this.KMerchantFeeIncome;
          // 总支出
          this.KTotalExpenditure = this.KWithdrawTxFee + this.KMerchantFeeExpend;
          // 总盈利
          this.KProfit = this.KGeneralIncome - this.KTotalExpenditure;
          // 盈利结余
          this.KEndProfit = this.KProfit - this.KTakeoffProfit;
          // 钱包资产
          this.MerchantProperty = this.KHotBalance + this.KColdBalance;
          // 用户资产
          this.UserProperty = this.KUnprocessWithdraw + this.KHongbaoBalance + this.KUserLockedBalance + this.KUserBalance;
          //风险
          this.Risk = (this.MerchantProperty - this.UserProperty) / this.MerchantProperty;
        }, function (err) {
          console.log(err);
        })
      },
      getCath() {
        let that = this;
        this.postAjax(
          "/Currency/GetIdList",
          null,
          function (res) {
            that.CathSelect = res.body.value;
          },
          function (res) {
            console.log("路径错误");
          }
        );
      },
      getInfoLine() {
        this.postAjax('/Report/GetSystemCoinBalancePeriod', {
          currency: this.Cath,
          startTime: this.OneTime[0] / 1000,
          endTime: this.OneTime[1] / 1000
        }, (res) => {
          console.log(res);
          for (let i = 0; i < res.data.value.length; i++) {
            //总收入
            res.data.value[i].generalIncome = res.data.value[i].tradefeeBalance + res.data.value[i].withdrawFee + res.data.value[i].merchantProfit;
            // 总支出
            res.data.value[i].totalExpenditure = res.data.value[i].withdrawTxFee + res.data.value[i].merchantAddressActualFee;
            // 总盈利
            res.data.value[i].Profit = res.data.value[i].generalIncome - res.data.value[i].totalExpenditure;
            // 盈利结余
            res.data.value[i].endProfit = res.data.value[i].Profit - res.data.value[i].takeoffProfit;
            // 钱包资产
            res.data.value[i].merchantProperty = res.data.value[i].hotBalance + res.data.value[i].coldBalance;
            // 用户资产
            res.data.value[i].userProperty = res.data.value[i].userBalance + res.data.value[i].userLockedBalance + res.data.value[i].hongbaoBalance + res.data.value[i].unprocessWithdraw;
            //风险
            res.data.value[i].risk = (res.data.value[i].merchantProperty - res.data.value[i].userProperty) / res.data.value[i].merchantProperty;
          }
          this.RawArray = res.data.value;
          if (this.MinuteShow) {
            this.MinuteTransform();
          } else if (this.DayShow) {
            this.DayTransform();
          } else if (this.WeekShow) {
            this.WeekTransform();
          }

        }, (err) => {
          console.log(err);
        })
      },
      CreateCanvas() {
        var myChart = this.$echarts.init(document.getElementById('MyCanvas'));
        let option = {
          title: {
            text: '资产统计'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['钱包资产', '用户资产']
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.TimeArray,
          },
          yAxis: {
            type: 'value'
          },
          grid:{
            left: 100
          },
          dataZoom: [{
            startValue: this.TimeArray[0]
          }, {
            type: 'inside'
          }],
          series: [
            {
              name: '钱包资产',
              type: 'line',
              stack: '总量',
              lineStyle: {
                color: '#FD7F57'
              },
              itemStyle: {
                color: '#FD7F57'
              },
              data: this.MerchantPropertyArray
            },
            {
              name: '用户资产',
              type: 'line',
              stack: '总量',
              symbol: 'roundRect',
              lineStyle: {
                color: '#8ACFF8'
              },
              itemStyle: {
                color: '#8ACFF8'
              },
              data: this.UserPropertyArray
            }
          ]
        };
        if (option && typeof option === "object") {
          myChart.setOption(option, true);
        }
      },
      DateChange() {
        console.log(this.OneTime);
        let a = (this.OneTime[1] - this.OneTime[0]) / 86400000;
        if (a < 1) {
          this.MinuteShow = true;
          this.HourShow = true;
          this.DayShow = false;
          this.WeekShow = false;
          this.MonthShow = false;
        } else if (a > 1 && a < 7) {
          this.MinuteShow = false;
          this.HourShow = false;
          this.DayShow = true;
          this.WeekShow = false;
          this.MonthShow = false;
        } else if (a > 7 && a < 30) {
          this.MinuteShow = false;
          this.HourShow = false;
          this.DayShow = true;
          this.WeekShow = true;
          this.MonthShow = false;
        } else {
          this.MinuteShow = false;
          this.HourShow = false;
          this.DayShow = false;
          this.WeekShow = true;
          this.MonthShow = true;
        }
        this.getInfoLine();
      },
      MinuteTransform() {
        this.bfArr = JSON.parse(JSON.stringify(this.RawArray));
        this.TimeArray = []; // x轴显示数组
        this.MerchantPropertyArray = []; // 钱包资产K线
        this.UserPropertyArray = []; // 用户资产K线
        this.ShowArray = [];
        for (let i = this.bfArr.length - 1; i >= 0; i--) {
          let a = this.bfArr[i];
          a.period = this.creatHour(a.period);
          this.TimeArray.push(a.period);
          this.MerchantPropertyArray.push(a.merchantProperty);
          this.UserPropertyArray.push(a.userProperty);
          a.risk = (a.merchantProperty - a.userProperty) / a.merchantProperty;
          this.ShowArray.push(a);
          console.log(a, this.ShowArray);
        }
        this.CreateCanvas();
      },
      HourTransform() {
        this.bfArr = JSON.parse(JSON.stringify(this.RawArray));
        this.TimeArray = []; // x轴显示数组
        this.MerchantPropertyArray = []; // 钱包资产K线
        this.UserPropertyArray = []; // 用户资产K线
        // this.ShowArray = [];
        // var indexTime;
        // var indexVal;
        // var RawArr = JSON.parse(JSON.stringify(this.bfArr));
        //
        // for (let i = RawArr.length - 1; i >= 0; i--) {
        //   indexVal = RawArr[i];
        //   indexTime = this.creatHour(indexVal.period, true);
        //   if(this.bfArr.indexOf(indexVal) > -1){
        //     this.bfArr.splice(this.bfArr.indexOf(indexVal),1);
        //     console.log(1111);
        //   }
        //   for (let j = 0; j < this.bfArr.length; j++) {
        //     let a = this.bfArr[j];
        //     if (indexTime == this.creatHour(a.period,true)) {
        //       indexVal.generalIncome += a.generalIncome;
        //       indexVal.totalExpenditure += a.totalExpenditure;
        //       indexVal.takeoffProfit += a.takeoffProfit;
        //       indexVal.endProfit += a.endProfit;
        //       indexVal.merchantProperty += a.merchantProperty;
        //       indexVal.userProperty += a.userProperty;
        //       this.bfArr.splice(this.bfArr.indexOf(a),1);
        //       j--;
        //     }
        //   }
        //   // console.log(this.TimeArray,this.MerchantPropertyArray,this.UserPropertyArray);
        //   this.TimeArray.push(indexTime);
        //   this.MerchantPropertyArray.push(indexVal.merchantProperty);
        //   this.UserPropertyArray.push(indexVal.userProperty);
        //   this.ShowArray.push(indexVal);
        // }
        // this.CreateCanvas();
        // console.log(this.ShowArray, this.TimeArray);

        this.TimeArray = Array.from(new Set(this.RawArray.map((item)=>{
          return this.creatHour(item.period,true)
        })));
        let timeIndex = 0;
        let timeLength = this.TimeArray.length;
        this.ShowArray = [];
        let date = this.getDate(this.OneTime[1]);
        this.RawArray.forEach((item) => {
          if(timeIndex <= timeLength-1){
            let curDateTime = new Date(`${date} ${this.TimeArray[timeIndex]}`).getTime();
            let nextDateTime = timeIndex >= 1 ? new Date(`${date} ${this.TimeArray[timeIndex-1]}`).getTime() : (curDateTime+60*60*1000);
            let itemDateTime = item.period * 1000;
            if(curDateTime <= itemDateTime && nextDateTime > itemDateTime) {
              console.log(this.ShowArray[timeIndex]);
              if(this.ShowArray[timeIndex]){
                // console.log(this.ShowArray[timeIndex],item,curDateTime,nextDateTime);
                this.ShowArray[timeIndex].generalIncome += item.generalIncome;
                this.ShowArray[timeIndex].totalExpenditure += item.totalExpenditure;
                this.ShowArray[timeIndex].takeoffProfit += item.takeoffProfit;
                this.ShowArray[timeIndex].endProfit += item.endProfit;
                this.ShowArray[timeIndex].merchantProperty += item.merchantProperty;
                this.ShowArray[timeIndex].userProperty += item.userProperty;
                this.ShowArray[timeIndex].risk = (item.merchantProperty - item.userProperty) / item.merchantProperty;
              }else{
                this.ShowArray[timeIndex] = {
                  period:this.TimeArray[timeIndex],
                  generalIncome:item.generalIncome,
                  totalExpenditure:item.totalExpenditure,
                  takeoffProfit:item.takeoffProfit,
                  endProfit:item.endProfit,
                  merchantProperty:item.merchantProperty,
                  userProperty:item.userProperty,
                  risk:(item.merchantProperty - item.userProperty) / item.merchantProperty,
                };
              }
            }else if(curDateTime > itemDateTime){
              timeIndex++;
              if(this.ShowArray[timeIndex]){
                // console.log(this.ShowArray[timeIndex],item,curDateTime,nextDateTime);
                this.ShowArray[timeIndex].generalIncome += item.generalIncome;
                this.ShowArray[timeIndex].totalExpenditure += item.totalExpenditure;
                this.ShowArray[timeIndex].takeoffProfit += item.takeoffProfit;
                this.ShowArray[timeIndex].endProfit += item.endProfit;
                this.ShowArray[timeIndex].merchantProperty += item.merchantProperty;
                this.ShowArray[timeIndex].userProperty += item.userProperty;
                this.ShowArray[timeIndex].risk = (item.merchantProperty - item.userProperty) / item.merchantProperty;
              }else{
                this.ShowArray[timeIndex] = {
                  period:this.TimeArray[timeIndex],
                  generalIncome:item.generalIncome,
                  totalExpenditure:item.totalExpenditure,
                  takeoffProfit:item.takeoffProfit,
                  endProfit:item.endProfit,
                  merchantProperty:item.merchantProperty,
                  userProperty:item.userProperty,
                  risk:(item.merchantProperty - item.userProperty) / item.merchantProperty,
                };
              }
            }
          }
        });
        this.TimeArray.reverse();
        for (let i = this.TimeArray.length-1; i >= 0;i--) {
          this.MerchantPropertyArray.push(this.ShowArray[i].merchantProperty);
          this.UserPropertyArray.push(this.ShowArray[i].userProperty);
        }
        this.ShowArray.reverse();
        this.CreateCanvas();
      },
      getDate(time){
        let date = new Date(time);
        return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
      },
      // transformRawData(timeIndex,timeLength){
      //   this.RawArray.forEach((item) => {
      //     if(timeIndex <= timeLength-1){
      //       let curDateTime = new Date(`${date} ${this.TimeArray[timeIndex]}`).getTime();
      //       let nextDateTime = timeIndex >= 1 ? new Date(`${date} ${this.TimeArray[timeIndex-1]}`).getTime() : (curDateTime+60*60*1000);
      //       let itemDateTime = item.period * 1000;
      //       if(curDateTime <= itemDateTime && nextDateTime > itemDateTime) {
      //         console.log(this.ShowArray[timeIndex]);
      //         if(this.ShowArray[timeIndex]){
      //           // console.log(this.ShowArray[timeIndex],item,curDateTime,nextDateTime);
      //           this.ShowArray[timeIndex].generalIncome += item.generalIncome;
      //           this.ShowArray[timeIndex].totalExpenditure += item.totalExpenditure;
      //           this.ShowArray[timeIndex].takeoffProfit += item.takeoffProfit;
      //           this.ShowArray[timeIndex].endProfit += item.endProfit;
      //           this.ShowArray[timeIndex].merchantProperty += item.merchantProperty;
      //           this.ShowArray[timeIndex].userProperty += item.userProperty;
      //           this.ShowArray[timeIndex].risk = (item.merchantProperty - item.userProperty) / item.merchantProperty;
      //         }else{
      //           this.ShowArray[timeIndex] = {
      //             period:this.TimeArray[timeIndex],
      //             generalIncome:item.generalIncome,
      //             totalExpenditure:item.totalExpenditure,
      //             takeoffProfit:item.takeoffProfit,
      //             endProfit:item.endProfit,
      //             merchantProperty:item.merchantProperty,
      //             userProperty:item.userProperty,
      //             risk:(item.merchantProperty - item.userProperty) / item.merchantProperty,
      //           };
      //         }
      //       }else if(curDateTime > itemDateTime){
      //         timeIndex++;
      //         if(this.ShowArray[timeIndex]){
      //           // console.log(this.ShowArray[timeIndex],item,curDateTime,nextDateTime);
      //           this.ShowArray[timeIndex].generalIncome += item.generalIncome;
      //           this.ShowArray[timeIndex].totalExpenditure += item.totalExpenditure;
      //           this.ShowArray[timeIndex].takeoffProfit += item.takeoffProfit;
      //           this.ShowArray[timeIndex].endProfit += item.endProfit;
      //           this.ShowArray[timeIndex].merchantProperty += item.merchantProperty;
      //           this.ShowArray[timeIndex].userProperty += item.userProperty;
      //           this.ShowArray[timeIndex].risk = (item.merchantProperty - item.userProperty) / item.merchantProperty;
      //         }else{
      //           this.ShowArray[timeIndex] = {
      //             period:this.TimeArray[timeIndex],
      //             generalIncome:item.generalIncome,
      //             totalExpenditure:item.totalExpenditure,
      //             takeoffProfit:item.takeoffProfit,
      //             endProfit:item.endProfit,
      //             merchantProperty:item.merchantProperty,
      //             userProperty:item.userProperty,
      //             risk:(item.merchantProperty - item.userProperty) / item.merchantProperty,
      //           };
      //         }
      //       }
      //     }
      //   });
      // },
      DayTransform() {
        this.TimeArray = []; // x轴显示数组
        this.MerchantPropertyArray = []; // 钱包资产K线
        this.UserPropertyArray = []; // 用户资产K线
        this.ShowArray = [];
        this.TimeArray = Array.from(new Set(this.RawArray.map((item)=>{
          return this.creatDay(item.period);
        })));
        let timeIndex = 0;
        let timeLength = this.TimeArray.length;
        // let date = this.getDate(item.period);
        this.RawArray.forEach((item) => {
          if(timeIndex <= timeLength-1){
            let curDateTime = new Date(`${this.TimeArray[timeIndex]} 00:00`).getTime();
            let nextDateTime = timeIndex >= 1 ? new Date(`${this.TimeArray[timeIndex]} 23:59`).getTime() : (curDateTime+86399000);
            let itemDateTime = item.period * 1000;
            if(curDateTime <= itemDateTime && nextDateTime > itemDateTime) {
              console.log(this.ShowArray[timeIndex]);
              if(this.ShowArray[timeIndex]){
                // console.log(this.ShowArray[timeIndex],item,curDateTime,nextDateTime);
                this.ShowArray[timeIndex].generalIncome += item.generalIncome;
                this.ShowArray[timeIndex].totalExpenditure += item.totalExpenditure;
                this.ShowArray[timeIndex].takeoffProfit += item.takeoffProfit;
                this.ShowArray[timeIndex].endProfit += item.endProfit;
                this.ShowArray[timeIndex].merchantProperty += item.merchantProperty;
                this.ShowArray[timeIndex].userProperty += item.userProperty;
                this.ShowArray[timeIndex].risk = (item.merchantProperty - item.userProperty) / item.merchantProperty;
              }else{
                this.ShowArray[timeIndex] = {
                  period:this.TimeArray[timeIndex],
                  generalIncome:item.generalIncome,
                  totalExpenditure:item.totalExpenditure,
                  takeoffProfit:item.takeoffProfit,
                  endProfit:item.endProfit,
                  merchantProperty:item.merchantProperty,
                  userProperty:item.userProperty,
                  risk:(item.merchantProperty - item.userProperty) / item.merchantProperty,
                };
              }
            }else if(curDateTime > itemDateTime){
              timeIndex++;
              if(this.ShowArray[timeIndex]){
                // console.log(this.ShowArray[timeIndex],item,curDateTime,nextDateTime);
                this.ShowArray[timeIndex].generalIncome += item.generalIncome;
                this.ShowArray[timeIndex].totalExpenditure += item.totalExpenditure;
                this.ShowArray[timeIndex].takeoffProfit += item.takeoffProfit;
                this.ShowArray[timeIndex].endProfit += item.endProfit;
                this.ShowArray[timeIndex].merchantProperty += item.merchantProperty;
                this.ShowArray[timeIndex].userProperty += item.userProperty;
                this.ShowArray[timeIndex].risk = (item.merchantProperty - item.userProperty) / item.merchantProperty;
              }else{
                this.ShowArray[timeIndex] = {
                  period:this.TimeArray[timeIndex],
                  generalIncome:item.generalIncome,
                  totalExpenditure:item.totalExpenditure,
                  takeoffProfit:item.takeoffProfit,
                  endProfit:item.endProfit,
                  merchantProperty:item.merchantProperty,
                  userProperty:item.userProperty,
                  risk:(item.merchantProperty - item.userProperty) / item.merchantProperty,
                };
              }
            }
          }
        });
        this.TimeArray.reverse();
        console.log(this.ShowArray);
        for (let i = this.TimeArray.length-1; i >= 0;i--) {
          this.MerchantPropertyArray.push(this.ShowArray[i].merchantProperty);
          this.UserPropertyArray.push(this.ShowArray[i].userProperty);
        }
        this.ShowArray.reverse();
        this.CreateCanvas();
      },
      WeekTransform() {
        this.bfArr = JSON.parse(JSON.stringify(this.RawArray));
        this.TimeArray = []; // x轴显示数组
        this.MerchantPropertyArray = []; // 钱包资产K线
        this.UserPropertyArray = []; // 用户资产K线
        this.ShowArray = [];
        // for (let i = 0; i < this.bfArr.length; i++) {
        //   let now = new Date(this.bfArr[i].period*1000);
        //   let nowTime = now.getTime();
        //   let day = now.getDay();
        //   let Time = this.creatDay(nowTime + (7-day)*86400000);
        //   if(this.TimeArray.indexOf(Time) < 0){
        //     this.TimeArray.push(Time);
        //   }
        // }
        this.TimeArray = Array.from(new Set(this.RawArray.map((item)=>{
          return this.creatDay1(item.period);
        })));
        console.log(this.TimeArray);
        let timeIndex = 0;
        let timeLength = this.TimeArray.length;
        this.RawArray.forEach((item) => {
          if(timeIndex <= timeLength-1){
            let nextDateTime = new Date(`${this.TimeArray[timeIndex]} 23:59`).getTime();
            let curDateTime = nextDateTime - 86400000*6-86340000;
            let itemDateTime = item.period * 1000;
            if(curDateTime <= itemDateTime && nextDateTime > itemDateTime) {
              console.log(this.ShowArray[timeIndex]);
              if(this.ShowArray[timeIndex]){
                this.ShowArray[timeIndex].generalIncome += item.generalIncome;
                this.ShowArray[timeIndex].totalExpenditure += item.totalExpenditure;
                this.ShowArray[timeIndex].takeoffProfit += item.takeoffProfit;
                this.ShowArray[timeIndex].endProfit += item.endProfit;
                this.ShowArray[timeIndex].merchantProperty += item.merchantProperty;
                this.ShowArray[timeIndex].userProperty += item.userProperty;
                this.ShowArray[timeIndex].risk = (item.merchantProperty - item.userProperty) / item.merchantProperty;
              }else{
                this.ShowArray[timeIndex] = {
                  period:this.TimeArray[timeIndex],
                  generalIncome:item.generalIncome,
                  totalExpenditure:item.totalExpenditure,
                  takeoffProfit:item.takeoffProfit,
                  endProfit:item.endProfit,
                  merchantProperty:item.merchantProperty,
                  userProperty:item.userProperty,
                  risk:(item.merchantProperty - item.userProperty) / item.merchantProperty,
                };
              }
            }else if(curDateTime > itemDateTime){
              timeIndex++;
              if(this.ShowArray[timeIndex]){
                this.ShowArray[timeIndex].generalIncome += item.generalIncome;
                this.ShowArray[timeIndex].totalExpenditure += item.totalExpenditure;
                this.ShowArray[timeIndex].takeoffProfit += item.takeoffProfit;
                this.ShowArray[timeIndex].endProfit += item.endProfit;
                this.ShowArray[timeIndex].merchantProperty += item.merchantProperty;
                this.ShowArray[timeIndex].userProperty += item.userProperty;
                this.ShowArray[timeIndex].risk = (item.merchantProperty - item.userProperty) / item.merchantProperty;
              }else{
                this.ShowArray[timeIndex] = {
                  period:this.TimeArray[timeIndex],
                  generalIncome:item.generalIncome,
                  totalExpenditure:item.totalExpenditure,
                  takeoffProfit:item.takeoffProfit,
                  endProfit:item.endProfit,
                  merchantProperty:item.merchantProperty,
                  userProperty:item.userProperty,
                  risk:(item.merchantProperty - item.userProperty) / item.merchantProperty,
                };
              }
            }
          }
        });
        this.TimeArray.reverse();
        console.log(this.ShowArray);
        for (let i = this.TimeArray.length-1; i >= 0;i--) {
          this.MerchantPropertyArray.push(this.ShowArray[i].merchantProperty);
          this.UserPropertyArray.push(this.ShowArray[i].userProperty);
        }
        this.ShowArray.reverse();
        this.CreateCanvas();
      },
      MonthTransform() {
        this.bfArr = JSON.parse(JSON.stringify(this.RawArray));
        this.TimeArray = []; // x轴显示数组
        this.MerchantPropertyArray = []; // 钱包资产K线
        this.UserPropertyArray = []; // 用户资产K线
        this.ShowArray = [];
        this.TimeArray = Array.from(new Set(this.RawArray.map((item)=>{
          return this.creatDay(item.period,true);
        })));
        let timeIndex = 0;
        let timeLength = this.TimeArray.length;
        this.RawArray.forEach((item) => {
          if(timeIndex <= timeLength-1){
            let curDateTime = new Date(`${this.TimeArray[timeIndex]}`).getTime();
            let nextDateTime = new Date(`${this.createMonth(this.TimeArray[timeIndex])}`).getTime()-1000;
            console.log(this.createMonth(this.TimeArray[timeIndex]));
            // console.log(nextDateTime,curDateTime,'ddd');
            let itemDateTime = item.period * 1000;
            if(curDateTime <= itemDateTime && nextDateTime > itemDateTime) {
              console.log(this.ShowArray[timeIndex]);
              if(this.ShowArray[timeIndex]){
                // console.log(this.ShowArray[timeIndex],item,curDateTime,nextDateTime);
                this.ShowArray[timeIndex].generalIncome += item.generalIncome;
                this.ShowArray[timeIndex].totalExpenditure += item.totalExpenditure;
                this.ShowArray[timeIndex].takeoffProfit += item.takeoffProfit;
                this.ShowArray[timeIndex].endProfit += item.endProfit;
                this.ShowArray[timeIndex].merchantProperty += item.merchantProperty;
                this.ShowArray[timeIndex].userProperty += item.userProperty;
                this.ShowArray[timeIndex].risk = (item.merchantProperty - item.userProperty) / item.merchantProperty;
              }else{
                this.ShowArray[timeIndex] = {
                  period:this.TimeArray[timeIndex],
                  generalIncome:item.generalIncome,
                  totalExpenditure:item.totalExpenditure,
                  takeoffProfit:item.takeoffProfit,
                  endProfit:item.endProfit,
                  merchantProperty:item.merchantProperty,
                  userProperty:item.userProperty,
                  risk:(item.merchantProperty - item.userProperty) / item.merchantProperty,
                };
              }
            }else if(curDateTime > itemDateTime){
              timeIndex++;
              if(this.ShowArray[timeIndex]){
                this.ShowArray[timeIndex].generalIncome += item.generalIncome;
                this.ShowArray[timeIndex].totalExpenditure += item.totalExpenditure;
                this.ShowArray[timeIndex].takeoffProfit += item.takeoffProfit;
                this.ShowArray[timeIndex].endProfit += item.endProfit;
                this.ShowArray[timeIndex].merchantProperty += item.merchantProperty;
                this.ShowArray[timeIndex].userProperty += item.userProperty;
                this.ShowArray[timeIndex].risk = (item.merchantProperty - item.userProperty) / item.merchantProperty;
              }else{
                this.ShowArray[timeIndex] = {
                  period:this.TimeArray[timeIndex],
                  generalIncome:item.generalIncome,
                  totalExpenditure:item.totalExpenditure,
                  takeoffProfit:item.takeoffProfit,
                  endProfit:item.endProfit,
                  merchantProperty:item.merchantProperty,
                  userProperty:item.userProperty,
                  risk:(item.merchantProperty - item.userProperty) / item.merchantProperty,
                };
              }
            }
          }
        });
        this.TimeArray.reverse();
        for (let i = this.TimeArray.length-1; i >= 0;i--) {
          this.MerchantPropertyArray.push(this.ShowArray[i].merchantProperty);
          this.UserPropertyArray.push(this.ShowArray[i].userProperty);
        }
        this.ShowArray.reverse();
        this.CreateCanvas();
      },
      //转化时分
      creatHour(day, isOk) {
        let date = new Date(day * 1000);
        if (isOk) {
          let p = (date.getHours() > 9 ? date.getHours() : ("0" + date.getHours())) + ":" + '00';
          return p;
        }
        let d = (date.getHours() > 9 ? date.getHours() : ("0" + date.getHours())) + ":" +
          (date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes()));
        return d;
      },
      // 转化日期
      creatDay(day,isOk) {
        let date = new Date(day * 1000);
        if(isOk){
          let p = date.getFullYear()+ '/' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "/" +
            '01';
          return p;
        }
        let d = date.getFullYear()+ '/' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "/" +
          (date.getDate() > 9 ? date.getDate() : ("0" + date.getDate()));
        return d;
      },
      // 求一周的时间范围
      creatDay1(time) {
        // let date = new Date(day + (7-day.getDay())*86400000);
        // if(day.getDay() === 0){
        //   date = new Date(day);
        // }
        let now = new Date(time * 1000);
        let nowTime = now.getTime();
        let day = now.getDay();
        let date = new Date(nowTime + (7-day)*86400000);
        let d = date.getFullYear()+ '/' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "/" +
          (date.getDate() > 9 ? date.getDate() : ("0" + date.getDate()));
        return d;
      },
      //对月时间戳对处理
      createMonth(date){
        let time = new Date(date);
        let year;
        let month;
        if(time.getMonth() > 10){
          year = time.getFullYear()+1;
          month = '01';
        }else {
          year = time.getFullYear();
          month = time.getMonth()+2 > 9 ? time.getMonth()+2 : '0' + (time.getMonth()+2);
        }
        let d = year + '/' + month + '/' + '01';
        return d;
      }
    }
  }
</script>

<style scoped>
  .content {
    min-width: 800px;
  }


  li {
    list-style: none;
  }

  .reload-btn {
    float: right;
  }

  .fir-box, .sec-box {
    border: 1px solid #BBB;
    margin: 10px;
    /*border-radius: 5px;*/

  }
  .fir-box .fir-left,
  .sec-box .sec-left{
    padding-left: 10px;
    display: flex;
    width: 100%;
  }
  .fir-box .fir-left .inline-left,
  .fir-box .fir-left .inline-right,
  .sec-box .sec-left .inline-left,
  .sec-box .sec-left .inline-right{
    flex: 1;
  }
  .fir-right{
    display: flex !important;
    border-top: 1px solid #BBB;
    padding-left: 10px;
  }
  .sec-right{
    width: 100%;
    border-top: 1px solid #BBB;
    padding-left: 10px;
  }
  .fir-right h3{
    flex: 1;
  }
  .fir-right,.sec-right,.fir-box h3,.sec-box h3{
    line-height: 50px;
  }
  .fir-box p,.sec-box p{
    line-height: 30px;
  }
  .fir-box,.sec-left{
    padding-bottom: 10px;
  }
  .fir-box div,
  .fir-box h3,
  .sec-box div,
  .sec-box h3,
  .sec-right {
    display: inline-block;
  }

  #MyCanvas {
    width: 800px;
    margin: auto;
  }

</style>
