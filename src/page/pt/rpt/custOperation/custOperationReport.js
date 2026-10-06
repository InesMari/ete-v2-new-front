// import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import enumData from "@/page/pt/enum";
// import date from "@/components/myElDatePicker/src/panel/date";

export default {
    name: 'custOperationReport',
    data() {
        return {
            head:[],
            headCache: [
                {"name": "客户", "code": "custName", "width": "180", "type": "text","isFix":true},
                {"name": "全年累计", "width": "400", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "totalIncomeFee", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "成本额", "code": "totalCostFee", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "毛利额", "code": "grossProfit", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "毛利率", "code": "grossProfitRate", "width": "100", "type": "text"},
                    ]
                },
            ],
            obj_month:{
                "name": "1月", "width": "1400", "type": "text",
                "children":[
                    {"name": "当月订单收入", "code": "currentWaybillIncomeFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "非当月订单收入", "code": "preWaybillIncomeFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "仓储收入", "code": "storehouseIncomeFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "包装收入", "code": "packIncomeFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "其他收入", "code": "otherIncomeFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "收入合计", "code": "totalIncomeFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "当月订单成本", "code": "currentWaybillCostFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "非当月订单成本", "code": "preWaybillCostFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "仓储成本", "code": "storehouseCostFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "包装成本", "code": "packCostFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "其他成本", "code": "otherCostFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "成本合计", "code": "totalCostFee", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "毛利额", "code": "grossProfit", "width": "100", "type": "text","currencyFlag":true},
                    {"name": "毛利率", "code": "grossProfitRate", "width": "100", "type": "text"},
                ]
            },
            monthArr:[
                {value:"-1",name:"全部"},
                {value:"1",name:"1月",disabled:false},
                {value:"2",name:"2月",disabled:false},
                {value:"3",name:"3月",disabled:false},
                {value:"4",name:"4月",disabled:false},
                {value:"5",name:"5月",disabled:false},
                {value:"6",name:"6月",disabled:false},
                {value:"7",name:"7月",disabled:false},
                {value:"8",name:"8月",disabled:false},
                {value:"9",name:"9月",disabled:false},
                {value:"10",name:"10月",disabled:false},
                {value:"11",name:"11月",disabled:false},
                {value:"12",name:"12月",disabled:false},
            ],
            months:'',
            year:'',
            initYear:'',
            custTenantIds:[],
            companyOptions:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        var now   = new Date();
        this.year = now;
        this.initYearMonth();
        this.initHead();    //初始化表头数据
        this.chooseMonth(this.monthArr[0]);     //默认选择全部月份
        this.initCustomers();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        scrollTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            let param = {
                year:this.year.getFullYear(),
                months:this.getSelectedMonth(),
                custTenantIds:this.custTenantIds
            };
            this.$refs.table.load("rptCustOperationTF", "queryRptCustOperationInfoPage", param);
        },
        async initCustomers(){
            this.companyOptions = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
        },

        initYearMonth(){
            // for (let i = 1; i < this.monthArr.length; i++) {
            //     this.monthArr[i].disabled=true;
            // }
            if(!this.year){
                return;
            }
            var now   = new Date();
            var nowMonth = now.getMonth();//前一个月
            var nowDay = now.getDate();//大于等于6 可以查前一个月
            var nowYear  = now.getFullYear();
            if(this.year.getFullYear()==nowYear){
                let endMonth = nowMonth;
                if(nowDay>=7){
                    endMonth = nowMonth + 1;
                }
                for (let i = 1; i < endMonth; i++) {
                    this.monthArr[i].disabled=false;
                }
                for (let i = endMonth; i <= 12; i++) {
                    this.monthArr[i].isSelect=false;
                }
            }else if(this.year.getFullYear()<nowYear){
                for (let i = 1; i < this.monthArr.length; i++) {
                    this.monthArr[i].disabled=false;
                }
            }
            this.initHead();
            this.$forceUpdate();
        },
        /**
         * 选择月份
         * @param {*} item
         */
        chooseMonth(item){
            if(item.disabled){
                return;
            }
            if(item.value == "-1"){     //点击全选
                if(this.isSelectAllMonth()){    //全选则反选
                    this.monthArr.forEach(el => {
                        if(!el.disabled) {
                            el.isSelect = false;
                        }
                    })
                    this.initHead(item.value,false);
                }else{  //非全选则全选
                    this.monthArr.forEach(el => {
                        if(!el.disabled) {
                            el.isSelect = true;
                        }
                    })
                    this.initHead(item.value,true);
                }
            }else{
                item.isSelect = item.isSelect?false:true;
                //全选是默认选中全部，非全选去掉全部
                if(this.isSelectAllMonth()){
                    this.monthArr[0].isSelect = true;
                }else{
                    this.monthArr[0].isSelect = false;
                }
                this.initHead(item.value)
            }
            this.doQuery();
            this.$forceUpdate();
        },
        /**
         * 月份是否全选
         */
        isSelectAllMonth(){
            let isSelectAll = true;
            this.monthArr.forEach((el,index) => {   //是否已经全选
                if(!el.disabled&&!el.isSelect&&index!=0){
                    isSelectAll = false;
                }
            })
            return isSelectAll;
        },
        getSelectedMonth(){
            let month = [];
            this.monthArr.forEach((el,index) => {   //是否已经全选
                if(el.isSelect&&index!=0){
                    month.push(index);
                }
            })
            return month;
        },
        //重设表头
        initHead(){
            this.head = this.common.copyObj(this.headCache);
            this.monthArr.forEach((el,index) => {   //是否已经全选
                if(el.isSelect&&index!=0){
                    let obj_month = this.common.copyObj(this.obj_month);
                    obj_month.name = index+"月";
                    obj_month.children.forEach(m => {
                        m.code = m.code+index;
                    })
                    this.head.push(obj_month);
                }
            })
            if(this.head.length==2||this.head.length==14){    //全选或者不选时表头展示显示全年统计，否则月统计
                this.head[1].name = "全年统计"
            }else{
                this.head[1].name = "月统计"
            }
            this.$nextTick(()=>{
                this.$refs.table.initHead();
            })
        },
        clear(){
            var now   = new Date();
            // var year  = now.getFullYear();
            this.year = now;
            this.custTenantIds=[];
            this.chooseMonth(this.monthArr[0]);     //默认选择全部月份
        },
        //导出功能
        downloadExcelFile(){
            let queryUrl = 'rptCustOperationTF|queryRptCustOperationInfoPage';
            let excelKeys='';

            for(let el of this.head){
                if(el.code){
                    excelKeys+=','+el.code;
                }else{
                    el.children.forEach(m=>{
                        excelKeys+=','+m.code;
                    })
                }
            }

            if(excelKeys.length>0){
                excelKeys=excelKeys.substr(1);
            }
            let param = {
                year:this.year.getFullYear(),
                months:this.getSelectedMonth(),
                custTenantIds:this.custTenantIds
            };
            param.templateName = "custOperationInfo.xls";
            param.templateUrl = 'rptCustOperationTF|initExcelHead';
            param.querySumUrl = 'rptCustOperationTF|queryRptCustOperationInfoPageSum';
            param.templateStartRow = 2;
            this.common.downloadExcelFile(queryUrl,param,'',excelKeys,'客户运作报表','custOperationReportTable');
        },
    },
}
