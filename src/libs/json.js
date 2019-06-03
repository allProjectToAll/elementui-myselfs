//所有下拉框对应的value值
let jsonName={
    //结算对账
    setlReconcil:[
        {label:"月结+n天，定期对账，定期付款",value:"a"},
        {label:"按每份合同结算（批次结算），开票后+n天付款",value:"b"},
        {label:"其他",value:"c"}
    ],
    //付款方式
    payForm:[
        {label:"月结付款",value:"a"},
        {label:"项目批次付款",value:"b"},
        {label:"工程进度付款",value:"c"}
    ],
    //平均应收账期
    averDueDate:[
        {label:"30天以内",value:"a"},
        {label:"30-60天",value:"b"},
        {label:"60天-90天",value:"c"},
        {label:"90天-180天",value:"d"},
        {label:"180天以上",value:"e"},
    ],
    //增信方案
    credPromt:[
        {label:"不接受增信措施",value:"a"},
        {label:"法人无限责任连带担保",value:"b"},
        {label:"法人的配偶无限责任连带担保",value:"c"},
        {label:"特定企业提供担保",value:"d"},
        {label:"有无抵质押",value:"e"},
        {label:"其他",value:"f"},
    ],
    //是否担保
    guardFlag:[
        {label:"是",value:"1"},
        {label:"否",value:"0"},
    ],
    //纳税级别
    taxGrade:[
        // {label:"是",value:"1"},
        // {label:"否",value:"0"},
    ],
    //贸易合同  
    tradContrc:[
        {label:"有框架合同，有订单",value:"a"},
        {label:"有框架合同，无订单（口头订单）",value:"b"},
        {label:"工程进度无框架合同，有订单（传真/订单系统可下载）",value:"c"}
    ],
    //企业连续开票时间  
    billConDates:[
        {label:"不满12个月",value:"a"},
        {label:"12（含）-18个月",value:"b"},
        {label:"18（含）-24个月",value:"c"},
        {label:"24个月（含）以上",value:"d"},
    ],
    //开票间断不超过3个月
    billDisconMark:[
        {label:"是",value:"1"},
        {label:"否",value:"0"},
    ],
    //主营业务是否对公
    busiToPubMark:[
        {label:"是",value:"1"},
        {label:"否",value:"0"},
    ],
    //业务毛利范围  
    grosMargScop:[
        {label:"0-15%",value:"a"},
        {label:"15%-30%",value:"b"},
        {label:"30%-50%",value:"c"},
        {label:"50%以上",value:"d"},
    ],
    //核心买方属于  
    coreBuyType:[
        {label:"上市企业",value:"a"},
        {label:"好企业，但没上市",value:"b"},
        {label:"政府机关事业单位",value:"c"},
        {label:"其他",value:"d"},
    ],
    //资产类型  
    assetType:[
        {label:"应收账款",value:"a"},
        {label:"个人住房",value:"b"},
        {label:"银行承兑汇票",value:"c"},
        {label:"商业承兑汇票",value:"d"},
        {label:"机器/设备",value:"e"},
        {label:"股权",value:"f"},
        {label:"信用",value:"g"},
        {label:"其他",value:"h"},
    ],
    //核心企业类型  
    corecomType:[
        {label:"民营",value:"a"},
        {label:"国企",value:"b"},
        {label:"央企",value:"c"},
        {label:"其他",value:"d"},
    ],
    //申请融资期限(月)
    financMaturi:[
        {label:"三个月",value:"a"},
        {label:"六个月",value:"b"},
        {label:"一年",value:"c"},
        {label:"两年",value:"d"},
        {label:"两年以上",value:"f"},
    ],
    //最高可接受年利率
    financRateAccept:[
        {label:"年利率<=6%",value:"a"},
        {label:"年利率<=10%",value:"b"},
        {label:"年利率<=15%",value:"c"},
        {label:"年利率>15%",value:"d"},
    ],
    //还款来源
    repaySource:[
        {label:"应收账款",value:"a"},
        {label:"业务资金",value:"b"},
        {label:"企业资金",value:"c"},
        {label:"其他",value:"d"},
    ],
    //还款方式
    repayMode:[
        {label:"应收账款",value:"a"},
        {label:"业务资金",value:"b"},
        {label:"企业资金",value:"c"},
        {label:"其他",value:"d"},
    ],
    //融资状态
    loanStat:[
        {label:"审批中",value:"0"},
        {label:"成功",value:"1"},
        {label:"被拒",value:"2"},
    ],
    //所属行业
    compIndust:[
        {label:"建筑",value:"a"},
        {label:"工程",value:"b"},
        {label:"其他",value:"c"},
    ],
    //现有年销售额
    curAnuSales:[
        {label:"0-500万",value:"a"},
        {label:"500万-1000万",value:"b"},
        {label:"1000万-5000万",value:"c"},
        {label:"5000万以上",value:"d"},
        
    ],
}

//去除空格
function trim(val){
　　return val.replace(/(^\s*)|(\s*$)/g, "");
}

//获取字段中文名称filed是字段名，value是对应的value值
function getFileName(filed,value){
    if(!value){
        return "";
    }
    let name = "";
    if(!(value.indexOf(",") == -1)){//数组
        for(let i=0;i<value.split(",").length;i++){
            for(let item in jsonName){
                if(item == filed){
                    for(let j in jsonName[item]){
                        if(value.split(",")[i] == jsonName[item][j].value){
                            name+=jsonName[item][j].label+",";
                        }
                    }
                }
            }
        }
    }else{
        for(let item in jsonName){
            if(item == filed){
                for(let j in jsonName[item]){
                    if(value == jsonName[item][j].value){
                        name=jsonName[item][j].label+",";
                    }
                }
            }
        }
    }
    if(!name){
        return ""
    }else{
        return name.substr(0,name.length-1);
    }
}


//正则验证是否为数字，或小数
//val是判断的数字，num是判断最多有多少位小数
// util.toValidate(12.23,2) =》true  
// num为空表示为数字(小数或整数)
// num为0表示为整数
// num为1表示一位小数
// .......
function valiNum(value,num){
    let val = value+"";
    let valPoint = val.substr(val.length-1,1);
    if(valPoint == "."){
        return false;
    }
    // if(!num){
    //     return /^\d+$/.test(val)  || /^(\d+\.\d+)+$/.test(val);;
    // }else{
        if(num==0){
            return /^\d+$/.test(val);
        }else if(num==1){
            return /^\d+$/.test(val) || /^\d+\.\d{1}$/.test(val);
        }else if(num==2){
            return /^\d+$/.test(val) || /^\d+\.\d{1,2}$/.test(val);
        }else if(num==3){
            return /^\d+$/.test(val) || /^\d+\.\d{1,3}$/.test(val);
        }else if(num==4){
            return /^\d+$/.test(val) || /^\d+\.\d{1,4}$/.test(val);
        }else if(num==5){
            return /^\d+$/.test(val) || /^\d+\.\d{1,5}$/.test(val);
        }else if(num==6){
            return /^\d+$/.test(val) || /^\d+\.\d{1,6}$/.test(val);
        }else if(num==7){
            return /^\d+$/.test(val) || /^\d+\.\d{1,7}$/.test(val);
        }else if(num==8){
            return /^\d+$/.test(val) || /^\d+\.\d{1,8}$/.test(val);
        }else if(num==9){
            return /^\d+$/.test(val) || /^\d+\.\d{1,9}$/.test(val);
        }else if(num==10){
            return /^\d+$/.test(val) || /^\d+\.\d{1,10}$/.test(val);
        }else if(!num){
            return /^\d+$/.test(val)  || /^(\d+\.\d+)+$/.test(val);
        }
    // }
}

const Menu = [
    {
        title:"首页",
        icon:"el-icon-s-home",
        name:"demo",
        path:"/demo",
        childMenu:[]
    },
    {
        title:"表单",
        icon:"el-icon-s-release",
        name:"form",
        path:"/form",
        childMenu:[
            {
                title:"按钮",
                icon:"el-icon-s-release",
                name:"btns",
                path:"/btns",
                childMenu:[]
            },
            {
                title:"输入框input",
                icon:"el-icon-s-release",
                name:"inputs",
                path:"/inputs",
                childMenu:[]
            },
            {
                title:"Form",
                icon:"el-icon-s-release",
                name:"form",
                path:"/form",
                childMenu:[]
            },
        ]
    },
    {
        title:"三级菜单",
        icon:"el-icon-s-release",
        name:"threeForm",
        path:"/threeForm",
        childMenu:[
            {
                title:"二级菜单",
                icon:"el-icon-s-release",
                name:"btn2",
                path:"/btn2",
                childMenu:[
                    {
                        title:"404页面",
                        icon:"el-icon-s-release",
                        name:"err",
                        path:"/err",
                        childMenu:[]
                    }
                ]
            },
            {
                title:"二级菜单",
                icon:"el-icon-s-release",
                name:"btn3",
                path:"/btn3",
                childMenu:[]
            },
            {
                title:"二级菜单",
                icon:"el-icon-s-release",
                name:"btn4",
                path:"/btn4",
                childMenu:[]
            }
        ]
    },
    {
        title:"图表",
        icon:"el-icon-s-release",
        name:"echarts",
        path:"/echarts",
        childMenu:[]
    }
]

export default {
    jsonName,
    trim,
    valiNum,
    getFileName,
    Menu
}