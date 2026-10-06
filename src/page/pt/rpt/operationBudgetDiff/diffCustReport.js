import scrollTable from "@/components/scrollTable/scrollTable.vue";
import monthsPicker from "@/components/monthsPicker/monthsPicker.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'diffCustReport',
    data() {
        return {
            head:[],
            headCache: [
                {"name": "客户", "code": "custName", "width": "180", "type": "text","isFix":true},
                {"name": "实际", "width": "400", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "totalIncomeFee", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "成本额", "code": "totalCostFee", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "毛利额", "code": "grossProfit", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "毛利率", "code": "grossProfitRate", "width": "100", "type": "text"},
                    ]
                },
                {"name": "预算", "width": "400", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "budgetIncomeFee", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "成本额", "code": "budgetCostFee", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "毛利额", "code": "budgetGrossProfit", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "毛利率", "code": "budgetGrossProfitRate", "width": "100", "type": "text"},
                    ]
                },
                {"name": "差异", "width": "300", "type": "text",
                    "children":[
                        {"name": "收入差异", "code": "diffIncomeFee", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "成本差异", "code": "diffCostFee", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "毛利差异", "code": "diffGrossProfit", "width": "100", "type": "text","currencyFlag":true},
                    ]
                },
            ],
            monthHead: [
                {"name": "实际", "width": "1400", "type": "text",
                    "children":[
                        {"name": "当月订单收入", "code": "currentWaybillIncomeFee", "width": "100", "type": "text"},
                        {"name": "非当月订单收入", "code": "preWaybillIncomeFee", "width": "100", "type": "text"},
                        {"name": "仓储收入", "code": "storehouseIncomeFee", "width": "100", "type": "text"},
                        {"name": "包装收入", "code": "packIncomeFee", "width": "100", "type": "text"},
                        {"name": "其他收入", "code": "otherIncomeFee", "width": "100", "type": "text"},
                        {"name": "收入合计", "code": "totalIncomeFee", "width": "100", "type": "text"},
                        {"name": "当月订单成本", "code": "currentWaybillCostFee", "width": "100", "type": "text"},
                        {"name": "非当月订单成本", "code": "preWaybillCostFee", "width": "100", "type": "text"},
                        {"name": "仓储成本", "code": "storehouseCostFee", "width": "100", "type": "text"},
                        {"name": "包装成本", "code": "packCostFee", "width": "100", "type": "text"},
                        {"name": "其他成本", "code": "otherCostFee", "width": "100", "type": "text"},
                        {"name": "成本合计", "code": "totalCostFee", "width": "100", "type": "text"},
                        {"name": "毛利额", "code": "grossProfit", "width": "100", "type": "text"},
                        {"name": "毛利率", "code": "grossProfitRate", "width": "100", "type": "text"},
                    ]
                },
                {"name": "预算", "width": "400", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "budgetIncomeFee", "width": "100", "type": "text"},
                        {"name": "成本额", "code": "budgetCostFee", "width": "100", "type": "text"},
                        {"name": "毛利额", "code": "budgetGrossProfit", "width": "100", "type": "text"},
                        {"name": "毛利率", "code": "budgetGrossProfitRate", "width": "100", "type": "text"},
                    ]
                },
                {"name": "差异", "width": "300", "type": "text",
                    "children":[
                        {"name": "收入差异", "code": "diffIncomeFee", "width": "100", "type": "text"},
                        {"name": "成本差异", "code": "diffCostFee", "width": "100", "type": "text"},
                        {"name": "毛利差异", "code": "diffGrossProfit", "width": "100", "type": "text"},
                    ]
                },
            ],
            custTenantIds:[],
            companyOptions:[],
            monthArr:[],
            query:{}
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.initCustomers();
        this.initYearMonth();
        this.initHead();
    },
    /**
     * 组件
     */
    components: {
        scrollTable,
        monthsPicker,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery(query={custTenantIds:this.custTenantIds}) {
            this.query = query;
            this.$refs.table.load("rptCustOperationTF", "queryOperationBudgetDiffCustPage", query);
        },
        async initCustomers(){
            this.companyOptions = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
        },

        clear(){
            this.custTenantIds=[];
            this.$refs.picker.clear();
        },
        //导出功能
        downloadExcelFile(){
            let queryUrl = 'rptCustOperationTF|queryOperationBudgetDiffCustPage';
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
            let param = this.query;
            param.templateName = "diffCustReport.xls";
            param.templateUrl = 'rptCustOperationTF|initOperationBudgetDiffCustExcelHead';
            param.querySumUrl = 'rptCustOperationTF|queryOperationBudgetDiffCustPageSum';
            param.templateStartRow = 2;
            this.common.downloadExcelFile(queryUrl,param,'',excelKeys,'预实对比列表客户','diffCustReportTable');
        },
        //重设表头
        initHead(){
            this.head = this.common.copyObj(this.headCache);
            this.monthArr.forEach(item => {   //是否已经全选
                let obj_months = this.common.copyObj(this.monthHead);
                obj_months.forEach(e=>{
                    e.name = item+e.name;
                    e.children.forEach(m => {
                        m.code = m.code+item;
                    })
                    this.head.push(e);
                })

            })
            this.$nextTick(()=>{
                this.$refs.table.initHead();
            })
        },
        initYearMonth(){
            var now   = new Date();
            var nowMonth = now.getMonth();//前一个月
            var nowDay = now.getDate();//大于等于6 可以查前一个月
            var nowYear  = now.getFullYear();
            this.monthArr=[];
            if(nowDay>=7){
                for (let i = 1; i <= nowMonth; i++) {
                    this.monthArr.push(nowYear+"-"+(i>9?i:'0'+i))
                }
            }else{
                for (let i = 1; i < nowMonth; i++) {
                    this.monthArr.push(nowYear+"-"+(i>9?i:'0'+i))
                }
            }
        },
        chooseMonths(months){
            if(months){
                this.monthArr = months;
                this.initHead();
            }
        }
    },
    computed:{
      formData(){
            return [
            {"name":"选择月份","model":"yearMonth","type":"monthsPicker","method":"chooseMonths","isshow":true,"row":4},
            {"name":"请选择客户","model":"custTenantIds","type":"select","options":this.companyOptions,"label":"name","value":"tenantId","multiple":true,"isshow":true,"row":4},
          ]
        }
    },
}
