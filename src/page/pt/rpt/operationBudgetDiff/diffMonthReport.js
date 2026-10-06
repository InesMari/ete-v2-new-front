import scrollTable from "@/components/scrollTable/scrollTable.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";


export default {
    name: 'diffMonthReport',
    data() {
        return {
            head: [
                {"name": "客户", "code": "custName", "width": "180", "type": "text","isFix":true},
                {"name": "月份", "code": "operationYearMonth", "width": "110", "type": "text","isFix":true},
                {"name": "实际", "width": "1400", "type": "text",
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
            custTenantIds:[],
            companyOptions:[],
            query:{}
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.initCustomers();
    },
    /**
     * 组件
     */
    components: {
        scrollTable,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery(query={custTenantIds:this.custTenantIds}) {
            this.query = query;
            this.$refs.table.load("rptCustOperationTF", "queryOperationBudgetDiffMonthPage", query);
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
            let queryUrl = 'rptCustOperationTF|queryOperationBudgetDiffMonthPage';
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
            param.templateName = "diffMonthReport.xls";
            param.querySumUrl = 'rptCustOperationTF|queryOperationBudgetDiffMonthPageSum';
            param.templateStartRow = 2;
            this.common.downloadExcelFile(queryUrl,param,'',excelKeys,'预实对比列表月份','diffMonthReportTable');
        },
    },
    computed:{
      formData(){
            return [
            {"name":"选择月份","model":"yearMonth","type":"monthsPicker","isshow":true,"row":4},
            {"name":"请选择客户","model":"custTenantIds","type":"select","options":this.companyOptions,"label":"name","value":"tenantId","multiple":true,"isshow":true,"row":4},
          ]
        }
    },
}
