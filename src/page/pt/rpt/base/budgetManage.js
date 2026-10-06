import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'budgetManage',
    data()
    {
        return {
            head: [
                {"name": "客户", "code": "custName", "width": "120", "type": "text"},
                {"name": "年份", "code": "budgetYear", "width": "90", "type": "text"},
                {"name": "1月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month1IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month1CostFee", "width": "80", "type": "text"},
                    ]
                },
                {"name": "2月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month2IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month2CostFee", "width": "80", "type": "text"},
                    ]
                },
                {"name": "3月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month3IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month3CostFee", "width": "80", "type": "text"},
                    ]
                },
                {"name": "4月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month4IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month4CostFee", "width": "80", "type": "text"},
                    ]
                },
                {"name": "5月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month5IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month5CostFee", "width": "80", "type": "text"},
                    ]
                },
                {"name": "6月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month6IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month6CostFee", "width": "80", "type": "text"},
                    ]
                },
                {"name": "7月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month7IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month7CostFee", "width": "80", "type": "text"},
                    ]
                },
                {"name": "8月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month8IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month8CostFee", "width": "80", "type": "text"},
                    ]
                },
                {"name": "9月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month9IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month9CostFee", "width": "80", "type": "text"},
                    ]
                },
                {"name": "10月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month10IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month10CostFee", "width": "80", "type": "text"},
                    ]
                },
                {"name": "11月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month11IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month11CostFee", "width": "80", "type": "text"},
                    ]
                },
                {"name": "12月", "width": "160", "type": "text",
                    "children":[
                        {"name": "收入额", "code": "month12IncomeFee", "width": "80", "type": "text"},
                        {"name": "成本额", "code": "month12CostFee", "width": "80", "type": "text"},
                    ]
                },

            ],
            query:{
                custTenantId : this.common.isBlank(this.$route.query.tenantId) ? '' : Number(this.$route.query.tenantId),//客户详情收支预算配置跳转
            },
            customerData:[],
            dialogTitle:'新增预算',
            showBudgetDialog:false,
            budgetInfo:{},
            details:[],
            type:0,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
    },
    /**
     * 绑定函数
     */
    methods: {

        /**
         * 列表查询
         */
        doQuery(){
            this.$refs.table.load("rptBudgetInfoTF", "queryRptBudgetInfoPage", this.query);
        },
        /**
         * 初始化数据
         */
        initData(){
            this.loadCustomerData();
        },
        /**
         * 加载客户数据
         */
        loadCustomerData()
        {
            let that = this;
            //查询所有客户
            that.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data)
            {
                that.customerData = data;
            });
        },
        /**
         * 清空
         */
        clear(){
            this.query={};
        },
        displayBudgetDialog(type){
            this.budgetInfo={};
            this.type = type;
            if(type==1){
                this.dialogTitle = '新增预算';
                this.details = [];
                for (let i = 1; i <= 12; i++) {
                    this.details.push({
                        budgetMonth:i,
                        incomeFee:"",
                        costFee:""
                    })
                }
                this.showBudgetDialog = true;
            }else{

                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一个需要修改的预算！");
                    return false;
                }
                this.dialogTitle = '修改预算';

                let that = this;
                this.budgetInfo.custTenantId = selectData[0].custTenantId;
                this.budgetInfo.budgetYear = selectData[0].budgetYear+'';
                this.common.postUrl("rptBudgetInfoTF", "queryRptBudgetInfoDetail", this.budgetInfo,function (data){
                    if(data){
                        that.details = data;
                        that.showBudgetDialog = true;
                    }
                },null,'',true);
            }
        },
        doSaveBudget(){
            let that = this;
            this.budgetInfo.custTenantName = this.customerData.find(item => item.tenantId === that.budgetInfo.custTenantId).name;
            this.budgetInfo.details = this.details;
            let msg = "";
            if(this.type==1){
                msg="新增预算成功";
            }else{
                msg="修改预算成功";
            }
            this.common.postUrl("rptBudgetInfoTF", "addModifyRptBudgetInfoDetail", this.budgetInfo,function (data){
                if(data){
                    that.$message.success(msg);
                    that.showBudgetDialog = false;
                    that.doQuery();
                }
            },null,'',true);
        },
        //导出功能
        downloadExcelFile(){
            let queryUrl = 'rptBudgetInfoTF|queryRptBudgetInfoPage';
            let excelKeys='*custName,budgetYear';
            for(let i=1;i<=12;i++){
                excelKeys+=",@month"+i+"IncomeFee,@month"+i+"CostFee";
            }
            this.query.templateName = "budgetInfo.xls";
            this.query.templateStartRow = 2;
            this.common.downloadExcelFile(queryUrl,this.query,'',excelKeys,'收支预算配置列表','budgetInfoTable');
        },
    },
}
