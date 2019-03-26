<template>
    <div id="listContain"  class="app-container">
        <h2>{{ $t("message.MarketMaintenance") }}</h2><span class="commentary">&nbsp;&nbsp;{{ $t("message.Remarks") }}</span>
        <div class="clear"></div>
        <div class="box">
            <div class="allTypeBox">
                <el-button type="primary"  v-if="IsInArray(btnArray,1)" @click="addListFn">{{ $t("message.Added") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,2)" @click="reviseFn">{{ $t("message.Revise") }}</el-button>
                
                <el-button type="primary"  v-if="IsInArray(btnArray,7)" @click="reviseFn1">{{ $t("message.editmarckWay") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,8)" @click="reviseFn2">{{ $t("message.editTradingCent") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,9)" @click="reviseFn3">{{ $t("message.editMarkPercent") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,10)" @click="reviseFn4">{{ $t("message.editUpLower") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,11)" @click="reviseFn5">{{ $t("message.editMarkOther") }}</el-button>
                
                
                
                
                <el-button type="primary"  v-if="IsInArray(btnArray,3)" @click="lockingFn">{{ $t("message.Locking") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,4)" @click="UnlockFn">{{ $t("message.Unlock") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,5)" @click="OpenFn">{{ $t("message.Open") }}</el-button>
                <el-button type="primary"  v-if="IsInArray(btnArray,6)" @click="ClosetFn">{{ $t("message.Close") }}</el-button>
                <!-- <el-button type="primary"  v-if="IsInArray(btnArray,7)" @click="setOrderFn">{{ $t("message.setOrder") }}</el-button> -->
                <el-button icon="el-icon-refresh" type="primary" @click="getList"></el-button>
            </div>

            <div  class="allTypeBox">
                 <!-- 表格 v-loading.body="listLoading"-->
                <el-table ref="rowClick" @row-click="rowClick"  stripe @selection-change="handleSelectionChange" :data="list"
                  v-loading.body="listLoading" :element-loading-text="$t('message.HardLoading')" border highlight-current-row fit  style="width: 100%">
                    <el-table-column v-model="multipleSelection" type="selection" width="50">
                    </el-table-column>

                    <el-table-column align="left" :label="$t('message.MarketID')" width="">

                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Basiccurrency')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.basic}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Targetcurrency')" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.target}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.feeStrategy')" width="110">
                        <template slot-scope="scope">
                            <span>{{filterFeeStrategy(scope.row.feeStrategy)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Makerfee')" width="110">
                        <template slot-scope="scope">
                            <span>{{scientificToNumber(scope.row.makerFeeRate)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.Takerfee')" width="100">
                        <template slot-scope="scope">
                            <span>{{scientificToNumber(scope.row.takerFeeRate)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.MinimumAmount')" width="100">
                        <template slot-scope="scope">
                            <span>{{scientificToNumber(scope.row.minOrderAmount)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.MarketRiseFall')" width="120">
                        <template slot-scope="scope">
                            <span>{{scientificToNumber(scope.row.priceLimitPercent)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.PricePrecision')" width="">
                        <template slot-scope="scope">
                            <span>{{scientificToNumber(scope.row.pricePrecision)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.QuantitativeAccuracy')" width="">
                        <template slot-scope="scope">
                            <span>{{scientificToNumber(scope.row.volumePrecision)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.MarketDepthPrecision')" width="160">
                        <template slot-scope="scope">
                            <span>{{scientificToNumber(scope.row.depthVolumePrecision)}}</span>
                        </template>
                    </el-table-column>

                    <!-- <el-table-column align="left" :label="$t('message.TopIndex')" width="80">
                        <template slot-scope="scope">
                            <span>{{scope.row.topIndex}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" :label="$t('message.SortIndex')" width="60">
                        <template slot-scope="scope">
                            <span>{{scope.row.sortIndex}}</span>
                        </template>
                    </el-table-column> -->


                    <el-table-column align="left" :label="$t('message.lockedTime')" width="160">
                        <template slot-scope="scope">
                            <span>{{ scope.row.status==4?creatDay(scope.row.lockEndTime):""}}</span>
                        </template>
                    </el-table-column>


                    <el-table-column align="left" :label="$t('message.TradingArea')" width="80">
                        <template slot-scope="scope">
                            <template v-if="scope.row.area==1">
                                A
                            </template>
                            <template v-if="scope.row.area==2">
                                B
                            </template>
                            <template v-if="scope.row.area==3">
                                C
                            </template>
                        </template>
                    </el-table-column>
                     <el-table-column align="center"  :label="$t('message.Statu')" width="120">
                       <template slot-scope="scope">
                           <template v-if="scope.row.status==0">
                                {{ $t("message.Unknown") }}
                            </template>
                           <template v-else-if="scope.row.status==1">
                                {{ $t("message.IndeteTransaction") }}
                            </template>
                            <template v-else-if="scope.row.status==2">
                                {{ $t("message.Opened") }}
                            </template>
                            <template v-else-if="scope.row.status==4">
                                {{ $t("message.Locking") }}
                            </template>
                            <template v-else-if="scope.row.status==8">
                                {{ $t("message.Close") }}
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            <!-- 分页 -->
                <div v-show="!listLoading">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pagenation.currPage"  :page-sizes="[8,10,15, 20]" :page-size="pagenation.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"  :total="pagenation.total">
                    </el-pagination>
                </div>
            </div>
        </div>

    <!-- 添加角色 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialog.addDialogSync" width="600px" :close-on-click-modal="isfalse" @close="cancel('addRuleForm')">
            <el-form ref="addRuleForm" class="small-space" :rules="dialogFormRules" :model="dialogForm.addFieldForm" label-position="left" label-width="160px" >
                <el-form-item v-if="revise" :label="$t('message.MarketID')" prop="id">
                    <el-input v-model="dialogForm.addFieldForm.id" disabled>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="!revise" :label="$t('message.Basiccurrency')" prop="basicId">
                    <el-select v-model="dialogForm.addFieldForm.basicId" >
                        <el-option :key=index v-for="(item,index) in basicSelect" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.feeStrategy')" prop="feeStrategy">
                   <el-select v-model="dialogForm.addFieldForm.feeStrategy">
                        <el-option :label="$t('message.PleaseChoise')" value=""></el-option>
                        <el-option :key=index v-for="(item,index) in selectFeeStrategy" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="!revise" :label="$t('message.Targetcurrency')" prop="targetId">
                    <el-select v-model="dialogForm.addFieldForm.targetId">
                        <el-option :key=index v-for="(item,index) in targetSelect" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.Makerfee')" prop="makerFeeRate">
                    <el-input v-model="dialogForm.addFieldForm.makerFeeRate" >
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.Takerfee')" prop="takerFeeRate">
                    <el-input v-model="dialogForm.addFieldForm.takerFeeRate" >
                         <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.MinimumAmount')" prop="minOrderAmount">
                    <el-input v-model="dialogForm.addFieldForm.minOrderAmount" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.MarketRiseFall')" prop="priceLimitPercent">
                    <el-input v-model="dialogForm.addFieldForm.priceLimitPercent">
                         <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.PricePrecision')" prop="pricePrecision">
                    <el-input v-model="dialogForm.addFieldForm.pricePrecision"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.QuantitativeAccuracy')" prop="volumePrecision">
                    <el-input v-model="dialogForm.addFieldForm.volumePrecision"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.MarketDepthPrecision')" prop="depthVolumePrecision">
                    <el-input v-model="dialogForm.addFieldForm.depthVolumePrecision"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.TradingArea')" prop="area">
                    <el-select v-model="dialogForm.addFieldForm.area" >
                        <el-option label="A" value="1"></el-option>
                        <el-option label="B" value="2"></el-option>
                        <el-option label="C" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!revise" :label="$t('message.Statu')" prop="status">
                    <el-select v-model="dialogForm.addFieldForm.status" >
                        <el-option label="开放" value="2"></el-option>
                        <el-option label="锁定" value="4"></el-option>
                        <el-option label="关闭" value="8"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item v-if="!revise" :label="$t('message.SortIndex')" prop="sortIndex">
                    <el-input v-model="dialogForm.addFieldForm.sortIndex"></el-input>
                </el-form-item>
                <el-form-item v-if="!revise" :label="$t('message.TopIndex')" prop="topIndex">
                    <el-input v-model="dialogForm.addFieldForm.topIndex"></el-input>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('addRuleForm')">{{ $t("message.Cancel") }}</el-button>
                <el-button v-if="addSync" type="primary"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 @click="addSubmitForm('addRuleForm')">{{ $t("message.Add") }}</el-button>
                <el-button v-else type="primary"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                 @click="reviseSubmitForm('addRuleForm')">{{ $t("message.Revise") }}</el-button>
            </div>
        </el-dialog>

        <!-- 锁定打开等 -->
        <el-dialog :title="openTitle" :visible.sync="dialog.lockingSync" width="550px" :close-on-click-modal="isfalse" @close="cancle2('addRuleForm2')">
            <el-form ref="addRuleForm2" class="small-space" :rules="lockingFormRules" :model="dialogForm.lockingSync"  label-position="left" label-width="80px" >
                <el-form-item :label="$t('message.MarketID')" prop="id">
                    <el-input v-model="dialogForm.lockingSync.id" disabled>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.EndTime')" prop="endTime">
                    <el-date-picker v-model="dialogForm.lockingSync.endTime" type="datetime" :placeholder="$t('message.EndTime')"></el-date-picker>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle2('addRuleForm2')">{{ $t("message.Cancel") }}</el-button>
                <el-button type="primary"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                @click="lockingFnForm('addRuleForm2')">{{ $t("message.MakeSure") }}</el-button>
            </div>
        </el-dialog>
        <!-- 设置序号 -->
        <!-- <el-dialog :title="setOrder" :visible.sync="dialog.setSync" width="450px" :close-on-click-modal="isfalse" @close="cancle3('addRuleForm3')">
            <el-form ref="addRuleForm3" class="small-space" :rules="OrderFormRules" :model="setOrderJson"  label-position="left" label-width="80px" >
                <el-form-item :label="$t('message.SortIndex')" prop="sortIndex">
                    <el-input v-model="setOrderJson.sortIndex" >
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.TopIndex')" prop="topIndex">
                    <el-input v-model="setOrderJson.topIndex" >
                    </el-input>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle3('addRuleForm3')">{{ $t("message.Cancel") }}</el-button>
                <el-button type="primary"
                :element-loading-text="$t('message.Inprocessing')"
                v-loading.fullscreen.lock="fullscreenLoading"
                @click="setOrderSubmit('addRuleForm3')">{{ $t("message.MakeSure") }}</el-button>
            </div>
        </el-dialog> -->

        <!-- 修改市场手续费策略 -->
        <el-dialog :title="$t('message.editmarckWay')" :visible.sync="dialog1" width="600px" :close-on-click-modal="isfalse">
            <el-form ref="addRuleForm" class="small-space" label-position="left" label-width="160px" >
                <el-form-item :label="$t('message.feeStrategy')" prop="feeStrategy">
                    <el-select v-model="dialogForm.addFieldForm.feeStrategy">
                        <el-option :key=index v-for="(item,index) in selectFeeStrategy" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog1=false">{{ $t("message.Cancel") }}</el-button>
                <el-button type="primary" @click="revise1">{{ $t("message.Revise") }}</el-button>
            </div>
        </el-dialog>
        <!-- 修改交易费率 -->
        <el-dialog :title="$t('message.editTradingCent')" :visible.sync="dialog2" width="600px" :close-on-click-modal="isfalse">
            <el-form class="small-space" label-position="left" label-width="160px" >
                <el-form-item :label="$t('message.makerFeeRate')">
                    <el-input v-model="dialogForm.addFieldForm.makerFeeRate">
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.takerFeeRate')">
                    <el-input v-model="dialogForm.addFieldForm.takerFeeRate">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog2=false">{{ $t("message.Cancel") }}</el-button>
                <el-button type="primary" @click="revise2">{{ $t("message.Revise") }}</el-button>
            </div>
        </el-dialog>
        <!-- 修改市场精度信息 -->
        <el-dialog :title="$t('message.editMarkPercent')" :visible.sync="dialog3" width="600px" :close-on-click-modal="isfalse">
            <el-form class="small-space" label-position="left" label-width="160px" >
                <el-form-item :label="$t('message.PricePrecision')">
                    <el-input v-model="dialogForm.addFieldForm.pricePrecision">
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.QuantitativeAccuracy')">
                    <el-input v-model="dialogForm.addFieldForm.volumePrecision">
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.MarketDepthPrecision')">
                    <el-input v-model="dialogForm.addFieldForm.depthVolumePrecision">
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.MinimumAmount')">
                    <el-input v-model="dialogForm.addFieldForm.minOrderAmount">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog3=false">{{ $t("message.Cancel") }}</el-button>
                <el-button type="primary" @click="revise3">{{ $t("message.Revise") }}</el-button>
            </div>
        </el-dialog>
        <!-- 修改市场涨跌幅限制 -->
        <el-dialog :title="$t('message.editUpLower')" :visible.sync="dialog4" width="600px" :close-on-click-modal="isfalse">
            <el-form class="small-space" label-position="left" label-width="160px" >
                <el-form-item :label="$t('message.priceLimitPercent')">
                    <el-input v-model="dialogForm.addFieldForm.priceLimitPercent">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog4=false">{{ $t("message.Cancel") }}</el-button>
                <el-button type="primary" @click="revise4">{{ $t("message.Revise") }}</el-button>
            </div>
        </el-dialog>
        <!-- 市场其他信息 -->
        <el-dialog :title="$t('message.editMarkOther')" :visible.sync="dialog5" width="600px" :close-on-click-modal="isfalse">
            <el-form class="small-space" label-position="left" label-width="160px" >
                <el-form-item :label="$t('message.TradingArea')">
                    <el-input v-model="dialogForm.addFieldForm.area">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog5=false">{{ $t("message.Cancel") }}</el-button>
                <el-button type="primary" @click="revise5">{{ $t("message.Revise") }}</el-button>
            </div>
        </el-dialog>


    </div>
</template>
<script>
import Decimal from 'decimal.js'
export default {
    data() {
        var BasicCurrencyNoTargetCurrency = (rule, value, callback) => {
                if (value == this.dialogForm.addFieldForm.basicId) {
                    callback(new Error( this.$t("message.BasicCurrencyNoTargetCurrency")));
                } else {

                    callback();
                }
            };
        var justNumber = (rule, value, callback) => {
            if (/^[0-9]+$/.test(value.toString().replace(/^\s+|\s+$/gm,''))==false) {
                callback(new Error( this.$t("message.justNumber")));
            } else {
                callback();
            }
        };

        return {
            dialog1:false,
            dialog2:false,
            dialog3:false,
            dialog4:false,
            dialog5:false,
            selectFeeStrategy:[],
            
            isfalse:false,//禁止点击dialog之外的关闭dialog
            setOrder: this.$t("message.setOrder"),
            menuicon: 'getMenu',
            revise:false,
            btnArray:[],
            dialogTitle: this.$t("message.AddRole"),
            openTitle:this.$t("message.LockOrUnlock"),
            list:null,
            addSync:false,
            multipleSelection:[],//选中的表格数组
            listLoading:true,
            fullscreenLoading:false,
            // basicSelectOne:"",
            // targetSelectOne:"",
            basicSelect:[],
            targetSelect:[],
            setOrderJson:{
                sortIndex:"",
                topIndex:"",
            },
            OrderFormRules:{
                sortIndex:[
                    { required: true, message: this.$t("message.SortIndexNotEmpty"), trigger: 'change' },
                    { validator: justNumber, trigger: 'change' },
                ],
                topIndex:[
                    { required: true, message: this.$t("message.TopIndexNptEmpty"), trigger: 'change' },
                    { validator: justNumber, trigger: 'change' },
                ],
            },
            pagenation:{
                total:null,//总条目数
                currPage: 1,//当前页
                pageSize: 8,//一页显示个数
                title: '',
                type: null,//类型
            },
            dialog:{ //控制每个弹出框显示隐藏的
                addDialogSync:false,
                lockingSync:false,
                setSync:false,
            },
            dialogForm:{//控制每个弹出框字段的
                addFieldForm: {
                    "id":"",
                    "basicId":"",
                    "targetId": "",
                    "makerFeeRate":"",
                    "takerFeeRate": "",
                    "pricePrecision": "",
                    "volumePrecision": "",
                    "depthVolumePrecision": "",
                    "minOrderAmount": "",
                    "priceLimitPercent": "",
                    "feeStrategy":"",
                    "area":"",
                    "status": "",
                    "openTime": "",
                    "lockEndTime":"",
                    "show": true,
                    "sortIndex":"",
                    "topIndex":"",
                },
                lockingSync:{
                    id:"",
                    endTime:"",
                }
            },
            dialogFormRules:{
                // sortIndex:[
                //     { required: true, message: this.$t("message.SortIndexNotEmpty"), trigger: 'change' },
                //     { validator: justNumber, trigger: 'change' },
                // ],
                // topIndex:[
                //     { required: true, message: this.$t("message.TopIndexNptEmpty"), trigger: 'change' },
                //     { validator: justNumber, trigger: 'change' },
                // ],
                feeStrategy:[
                    { required: true, message: this.$t("message.changefeeStrategy"), trigger: 'change' },
                ],
                basicId: [
                    { required: true, message: this.$t("message.BasicIdNotEmpty"), trigger: 'change' },
                ],
                targetId: [
                    { required: true, message: this.$t("message.TargetIdNotEmpty"), trigger: 'change' },
                    { validator: BasicCurrencyNoTargetCurrency, trigger: 'change' },
                ],
                makerFeeRate: [
                    { required: true, message: this.$t("message.MakerFeeRateNotEmpty"), trigger: 'blur' },
                ],
                takerFeeRate: [
                    { required: true, message: this.$t("message.TakerFeeRateNotEmpty"), trigger: 'blur' },
                ],
                minOrderAmount: [
                    { required: true, message: this.$t("message.MinOrderAmount"), trigger: 'blur' },
                ],
                priceLimitPercent: [
                    { required: true, message: this.$t("message.PriceLimitPercentNotEmpty"), trigger: 'blur' },
                ],
                pricePrecision: [
                    { required: true, message: this.$t("message.PricePrecisionNotEmpty"), trigger: 'blur' },
                ],
                volumePrecision: [
                    { required: true, message: this.$t("message.VolumePrecisionNotEmpty"), trigger: 'blur' },
                ],
                depthVolumePrecision: [
                    { required: true, message: this.$t("message.DepthVolumePrecisionNotEmpty"), trigger: 'blur' },
                ],
                // area: [
                //     { required: true, message: this.$t("message.AreaNotEmpty"), trigger: 'blur' },
                // ],
            },
            lockingFormRules:{
                endTime: [
                    { required: true, message: this.$t("message.EndTimeNotEmpty"), trigger: 'blur' },
                ],
            }
        }
    },
    created(){
        this.getList();
        this.getBasicId();
        this.getBtn();
        this.GetFeeStrategy();
    },
    computed:{

    },
    methods:{
        cancle3(formName){
            this.dialog.setSync = false;
            if (this.$refs[formName]!==undefined) {
                this.$refs[formName].resetFields();
            }
        },
        cancle2(formName){
             this.dialog.lockingSync = false;
            if (this.$refs[formName]!==undefined) {
                this.$refs[formName].resetFields();
            }
        },
        getList(){
            var that = this;
            let par = {
              "pageIndex":this.pagenation.currPage,//10
              "pageSize":this.pagenation.pageSize,//(1-1)*10
            };
             this.postAjax("/Market/GetList",par,function(res){
               console.log(res);
                that.list = res.body.value.items;
                that.pagenation.total = res.body.value.totalItems;
                that.listLoading = false;
                that.openErr(that.$t("message.SuccessToGetList"),2);
            },function(res){
                console.log("路径错误");
            })
        },
        getBtn(){
            let that = this;
             this.postAjax("/Market/Limits",null,function(res){
                console.log(res.body.value);
                that.btnArray = res.body.value;
            },function(res){
                console.log("路径错误");
                that.openErr(that.$t("message.ErrorToGetBtnLimit"),1);
            })
        },
        getBasicId(){
            let that = this;
            this.postAjax("/Currency/GetIdList",null,function(res){
                that.basicSelect = res.body.value;
                that.targetSelect =  res.body.value;

            },function(res){
                console.log("路径错误");
            })
        },
        rowClick(row){
            let index = this.multipleSelection.indexOf(row);
            if (index<0) {
                this.multipleSelection = [];
                this.multipleSelection.push(row);
                this.$refs.rowClick.toggleRowSelection(row,true);
            }else{
                this.multipleSelection.splice(index,1);
                this.$refs.rowClick.toggleRowSelection(row,false);
            }
        },
        handleSelectionChange(val) { //当选择项发生变化时会触发该事件
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        handleSizeChange(val){ //操作分页
            this.pagenation.pageSize = val;//每页条数
            this.getList(); //重新请求一次
        },
        handleCurrentChange(val) {
            this.pagenation.currPage = val; //当前页码
            this.getList();
        },
        addListFn(){
            this.addSync = true;
            this.revise = false;
            this.dialogTitle = this.$t("message.Added");
            this.dialogForm.addFieldForm={
                    "basicId":"",
                    "targetId": "",
                    "makerFeeRate":"",
                    "takerFeeRate": "",
                    "feeStrategy":"",
                    "minOrderAmount": "",
                    "priceLimitPercent": "",
                    "pricePrecision": "",
                    "volumePrecision": "",
                    "depthVolumePrecision": "",
                    "area":"1",
                    "status": "2",
                    // "sortIndex":"",
                    // "topIndex":"",
                }

            this.dialog.addDialogSync = true;
        },
        addSubmitForm(formName){
            console.log(this.dialogForm.addFieldForm);
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    let par ={
                    "id":this.dialogForm.addFieldForm.id,
                    "basicId":this.dialogForm.addFieldForm.basicId,
                    "targetId": this.dialogForm.addFieldForm.targetId,
                    "makerFeeRate":this.dialogForm.addFieldForm.makerFeeRate/100,
                    "takerFeeRate": this.dialogForm.addFieldForm.takerFeeRate/100,
                    "pricePrecision":this.dialogForm.addFieldForm.pricePrecision,
                    "volumePrecision": this.dialogForm.addFieldForm.volumePrecision,
                    "depthVolumePrecision":this.dialogForm.addFieldForm.depthVolumePrecision,
                    "minOrderAmount": this.dialogForm.addFieldForm.minOrderAmount,
                    "priceLimitPercent":this.dialogForm.addFieldForm.priceLimitPercent/100,
                    "area":this.dialogForm.addFieldForm.area,
                    "status":this.dialogForm.addFieldForm.status,
                    "openTime":this.dialogForm.addFieldForm.openTime,
                    "lockEndTime":this.dialogForm.addFieldForm.lockEndTime,
                    "show": this.dialogForm.addFieldForm.show,
                    "feeStrategy": this.dialogForm.addFieldForm.feeStrategy,
                    // "sortIndex":this.dialogForm.addFieldForm.sortIndex,
                    // "topIndex":this.dialogForm.addFieldForm.topIndex,
                }
                    that.fullscreenLoading = true;
                    this.postAjax("/Market/Add",par,function(res){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.AddSuccess"),2);
                        that.getList();
                        that.dialog.addDialogSync = false;

                    },function(res){
                        console.log("路径错误");
                        that.fullscreenLoading = false;
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        reviseFn(formName){
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.addSync = false;
                this.revise = true;
                this.dialogTitle = this.$t("message.Revise");
                this.dialogForm.addFieldForm={
                        "id": this.multipleSelection[0].id,
                        "basicId":0,
                        "targetId": 0,
                        "makerFeeRate":this.scientificToNumber(this.multipleSelection[0].makerFeeRate*100),
                        "takerFeeRate": this.scientificToNumber(this.multipleSelection[0].takerFeeRate*100),
                        "minOrderAmount": this.scientificToNumber(this.multipleSelection[0].minOrderAmount),
                        "priceLimitPercent": this.scientificToNumber(this.multipleSelection[0].priceLimitPercent*100),
                        "pricePrecision": this.scientificToNumber(this.multipleSelection[0].pricePrecision),
                        "volumePrecision": this.scientificToNumber(this.multipleSelection[0].volumePrecision),
                        "depthVolumePrecision": this.scientificToNumber(this.multipleSelection[0].depthVolumePrecision),
                        "area":this.multipleSelection[0].area + '',
                        "status": this.multipleSelection[0].status,
                        // "sortIndex":"0",
                        // "topIndex":"0",
                    }
                this.dialog.addDialogSync = true;
            }
        },
        reviseSubmitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let par = {
                        "id": this.multipleSelection[0].id,
                        "makerFeeRate": this.dialogForm.addFieldForm.makerFeeRate/100,
                        "takerFeeRate": this.dialogForm.addFieldForm.takerFeeRate/100,
                        "pricePrecision":  this.dialogForm.addFieldForm.pricePrecision,
                        "volumePrecision": this.dialogForm.addFieldForm.volumePrecision,
                        "depthVolumePrecision": this.dialogForm.addFieldForm.depthVolumePrecision,
                        "minOrderAmount": this.dialogForm.addFieldForm.minOrderAmount,
                        "priceLimitPercent": this.dialogForm.addFieldForm.priceLimitPercent/100,
                        "area":  this.dialogForm.addFieldForm.area,
                    }

                    this.postAjax("/Market/Update",par,function(res){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.ServiceSuccess"),2);
                        that.getList();
                        that.dialog.addDialogSync = false;

                    },function(res){
                        console.log("路径错误");
                        that.fullscreenLoading = false;
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancel(formName){
            this.dialog.addDialogSync = false;
            if (this.$refs[formName]!==undefined) {
                this.$refs[formName].resetFields();
            }
        },
        lockingFn(){
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].status==4){
                    this.openErr(this.$t("message.HasLocked"),1);
                }else{
                    this.dialog.lockingSync=true;
                    this.openTitle = this.$t("message.LockOrUnlock");
                    this.dialogForm.lockingSync={
                        id:this.multipleSelection[0].id,
                        endTime:"",
                    }
                }


            }
        },
        UnlockFn(){
            let that = this;
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].status!=4){
                    this.openErr(this.$t("message.HasUnLocked"),1);
                }else{
                     this.$confirm(that.$t("message.SureToUnlocking"), that.$t("message.Title"), {
                        confirmButtonText: that.$t("message.MakeSure"),
                        cancelButtonText:  that.$t("message.Cancel"),
                        type: 'warning'
                    }).then(() => {
                        that.fullscreenLoading = true;
                        let par ={
                            "id": this.multipleSelection[0].id,
                        }
                        this.postAjax("/Market/Unlock",par,function(res){
                            that.fullscreenLoading = false;
                            that.openErr(that.$t("message.UnlockSuccess"),2);
                            that.getList();
                        },function(res){
                            console.log("路径错误");
                            that.fullscreenLoading = false;
                        })

                    }).catch(() => {});
                }




            }
        },
        OpenFn(){
            let that = this;
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].status==2){
                    this.openErr(this.$t("message.HasOpen"),1);
                }else{
                    this.$confirm(that.$t("message.SureToOpen"), that.$t("message.Title"), {
                        confirmButtonText: that.$t("message.MakeSure"),
                        cancelButtonText:  that.$t("message.Cancel"),
                        type: 'warning'
                    }).then(() => {
                        that.fullscreenLoading = true;
                        let par ={
                            "id": this.multipleSelection[0].id,
                        }
                        this.postAjax("/Market/Open",par,function(res){
                            that.fullscreenLoading = false;
                            that.openErr(that.$t("message.OpenSuccess"),2);
                            that.getList();
                        },function(res){
                            console.log("路径错误");
                            that.fullscreenLoading = false;
                        })

                    }).catch(() => {});
                }

            }
        },
        ClosetFn(){
            let that = this;
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                if(this.multipleSelection[0].status==8){
                    this.openErr(this.$t("message.HasClose"),1);
                }else{
                    this.$confirm(that.$t("message.SureToClose"), that.$t("message.Title"), {
                        confirmButtonText: that.$t("message.MakeSure"),
                        cancelButtonText:  that.$t("message.Cancel"),
                        type: 'warning'
                    }).then(() => {
                        that.fullscreenLoading = true;
                        let par ={
                            "id": this.multipleSelection[0].id,
                        }
                        this.postAjax("/Market/Close",par,function(res){
                            that.fullscreenLoading = false;
                            that.openErr(that.$t("message.CloseSuccess"),2);
                            that.getList();
                        },function(res){
                            console.log("路径错误");
                            that.fullscreenLoading = false;
                        })

                    }).catch(() => {});
                }
            }
        },
        lockingFnForm(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let endTime= new Date(that.dialogForm.lockingSync.endTime).getTime() /1000;
                    let par = {
                        "id": this.multipleSelection[0].id,
                        "endTime": endTime
                    }
                    this.postAjax("/Market/Lock",par,function(res){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.LockUpSuccess"),2);
                        that.getList();
                        that.dialog.lockingSync = false;

                    },function(res){
                        console.log("路径错误");
                        that.fullscreenLoading = false;
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        setOrderFn(){
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.dialog.setSync = true;
                this.setOrderJson.sortIndex = this.multipleSelection[0].sortIndex;
                this.setOrderJson.topIndex = this.multipleSelection[0].topIndex;
            }
            
        },
        setOrderSubmit(formName){
            let that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {//正则验证成功
                    that.fullscreenLoading = true;
                    let par = {
                        "id": that.multipleSelection[0].id,
                        "sortIndex": that.setOrderJson.sortIndex,
                        "topIndex": that.setOrderJson.topIndex
                    }

                    this.postAjax("/Market/UpdateSortIndex",par,function(res){
                        that.fullscreenLoading = false;
                        that.openErr(that.$t("message.SetSuccess"),2);
                        that.getList();
                        that.dialog.setSync = false;

                    },function(res){
                        console.log("路径错误");
                        that.fullscreenLoading = false;
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // scientificToNumber(num) {//解决科学记数法的问题
        //     var str = num.toString();
        //     var reg = /^(\d+)(e)([\-]?\d+)$/;
        //     var arr, len,
        //         zero = '';
        //     if (!reg.test(str)) {
        //         return num;
        //     } else {
        //         /*6e-7 需要手动转换*/
        //         arr = reg.exec(str);
        //         len = Math.abs(arr[3]) - 1;
        //         for (var i = 0; i < len; i++) {
        //             zero += '0';
        //         }

        //         return '0.' + zero + arr[1];
        //     }
        // },
        GetFeeStrategy(){
            this.postAjax("/Market/GetFeeStrategy",null,(res)=>{
               this.selectFeeStrategy = res.body.value;
               console.log(this.selectFeeStrategy,8888)
            },(res)=>{console.log("路径错误");})

        },
        filterFeeStrategy(value){
            for(let i=0;i<this.selectFeeStrategy.length;i++){
                if(value == this.selectFeeStrategy[i].value){
                    return this.selectFeeStrategy[i].text;
                }
            }
        },

        reviseFn1(){
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.dialogForm.addFieldForm={
                        "feeStrategy": this.multipleSelection[0].feeStrategy,
                    }
                this.dialog1 = true;
            }
        },
        reviseFn2(){
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.dialogForm.addFieldForm={
                        "makerFeeRate": this.scientificToNumber(this.multipleSelection[0].makerFeeRate),
                        "takerFeeRate": this.scientificToNumber(this.multipleSelection[0].takerFeeRate),
                    }
                this.dialog2 = true;
            }
        },
        reviseFn3(){
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.dialogForm.addFieldForm={
                        "pricePrecision": this.scientificToNumber(this.multipleSelection[0].pricePrecision),
                        "volumePrecision": this.scientificToNumber(this.multipleSelection[0].volumePrecision),
                        "depthVolumePrecision": this.scientificToNumber(this.multipleSelection[0].depthVolumePrecision),
                        "minOrderAmount": this.scientificToNumber(this.multipleSelection[0].minOrderAmount),
                    }
                this.dialog3 = true;
            }
        },
        reviseFn4(){
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.dialogForm.addFieldForm={
                        "priceLimitPercent": this.scientificToNumber(this.multipleSelection[0].priceLimitPercent),
                    }
                this.dialog4 = true;
            }
        },
        reviseFn5(){
            if(this.multipleSelection.length>1){
                 this.openErr( this.$t("message.OnlyChoiseOne"),1);
            }else if(this.multipleSelection.length==0){
                this.openErr(this.$t("message.ChoiseOneControl"),1);
            }else{
                this.dialogForm.addFieldForm={
                        "area": this.multipleSelection[0].area,
                    }
                this.dialog5 = true;
            }
        },
        revise1(){
            if(this.dialogForm.addFieldForm.feeStrategy.toString().trim()==""){
                this.openErr(this.$t("message.enterFreeWay"),1);
                return;
            }
            let par = {
                "id": this.multipleSelection[0].id,
                "feeStrategy": this.dialogForm.addFieldForm.feeStrategy,
            }
            this.postAjax("/Market/UpdateFeeStrategy",par,(res)=>{
                this.openErr(this.$t("message.ServiceSuccess"),2);
                this.getList();
                this.dialog1 = false;

            },(res)=>{console.log("路径错误");})
        },
        revise2(){
            if(this.dialogForm.addFieldForm.makerFeeRate.toString().trim()==""){
                this.openErr(this.$t("message.entermakerFeeRate"),1);
                return;
            }
            if(this.dialogForm.addFieldForm.takerFeeRate.toString().trim()==""){
                this.openErr(this.$t("message.entertakerFeeRate"),1);
                return;
            }
            let par = {
                "id": this.multipleSelection[0].id,
                "makerFeeRate":this.dialogForm.addFieldForm.makerFeeRate,
                "takerFeeRate": this.dialogForm.addFieldForm.takerFeeRate,
            }
            this.postAjax("/Market/UpdateFeeRate",par,(res)=>{
                this.openErr(this.$t("message.ServiceSuccess"),2);
                this.getList();
                this.dialog2 = false;

            },(res)=>{console.log("路径错误");})
        },
        revise3(){
            if(this.dialogForm.addFieldForm.pricePrecision.toString().trim()==""){
                this.openErr(this.$t("message.enterPricePercent"),1);
                return;
            }
            if(this.dialogForm.addFieldForm.volumePrecision.toString().trim()==""){
                this.openErr(this.$t("message.enterVolumPercent"),1);
                return;
            }
            if(this.dialogForm.addFieldForm.depthVolumePrecision.toString().trim()==""){
                this.openErr(this.$t("message.markDeepVolumCen"),1);
                return;
            }
            if(this.dialogForm.addFieldForm.minOrderAmount.toString().trim()==""){
                this.openErr(this.$t("message.enterminOrderAmount"),1);
                return;
            }
            let par = {
                "id": this.multipleSelection[0].id,
                "pricePrecision": this.dialogForm.addFieldForm.pricePrecision,
                "volumePrecision":this.dialogForm.addFieldForm.volumePrecision,
                "depthVolumePrecision": this.dialogForm.addFieldForm.depthVolumePrecision,
                "minOrderAmount": this.dialogForm.addFieldForm.minOrderAmount,
            }
            this.postAjax("/Market/UpdatePrecision",par,(res)=>{
                this.openErr(this.$t("message.ServiceSuccess"),2);
                this.getList();
                this.dialog3 = false;

            },(res)=>{console.log("路径错误");})
        },
        revise4(){
            if(this.dialogForm.addFieldForm.priceLimitPercent.toString().trim()==""){
                this.openErr(this.$t("message.PriceLimitPercentNotEmpty"),1);
                return;
            }
            let par = {
                "id": this.multipleSelection[0].id,
                "priceLimitPercent":this.dialogForm.addFieldForm.priceLimitPercent,
            }
            this.postAjax("/Market/UpdateLimit",par,(res)=>{
                this.openErr(this.$t("message.ServiceSuccess"),2);
                this.getList();
                this.dialog4 = false;

            },(res)=>{console.log("路径错误");})
        },
        revise5(){
            if(this.dialogForm.addFieldForm.area.toString().trim()==""){
                this.openErr(this.$t("message.TradingAreaNotEmpty"),1);
                return;
            }
            let par = {
                "id": this.multipleSelection[0].id,
                "area": this.dialogForm.addFieldForm.area,
            }
            this.postAjax("/Market/UpdateOther",par,(res)=>{
                this.openErr(this.$t("message.ServiceSuccess"),2);
                this.getList();
                this.dialog5 = false;

            },(res)=>{console.log("路径错误");})
        },
        scientificToNumber(value){
            if(!value && value !==0 ){
                return;
            }
            // e-7 e+21
            let str = value.toString();
            let eIndex = str.indexOf('e');
            if(eIndex<0){
                return value;
            }
            let sign = str.substr(eIndex+1,1);
            let powNum = str.slice(eIndex+2);
            let arr = [];
            if(sign === '-'){
                powNum = powNum - 6;
                arr = new Decimal(value).mul(Math.pow(10,powNum)).toString().split('');
                let dotIndex = arr.indexOf('.');
                arr.splice(dotIndex+1,0,'0'.repeat(powNum));
            }else{
                powNum = powNum - 20;
                arr = new Decimal(value).div(Math.pow(10,powNum)).toString().split('');
                let dotIndex = arr.indexOf('.');
                if(dotIndex === -1){
                arr.push('0'.repeat(powNum));
                }else{
                let dotNum = arr.length - dotIndex -1; // 小数位数
                arr.splice(dotIndex,1); //去掉小数点
                let diff = dotNum - powNum;
                if(diff <= 0){
                    arr.splice(arr.length-1,0,'0'.repeat(diff)) // 补齐 0
                }else{
                    arr.splice(arr.length-1-diff,0,'.') // 加上小数点
                }
                }
            }
            return arr.join('');
        }

    }
}
</script>
<style scoped>
.el-input {
    width: 200px;
}
</style>
