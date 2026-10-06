import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'customerOperationSummary',
    data()
    {
        return {
            head: [
                {"name": "客户", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "总票数", "code": "sumCount", "width": "100", "type": "text","tip": "(不包含取消的订单)"},
                {"name": "总运作完票数", "code": "finishCount", "width": "100", "type": "text","tip": "(只包含已完成/终止的订单)"},
                {"name": "准时/票", "code": "onTimeCount", "width": "100", "type": "text"},
                {"name": "延误/票", "code": "delayCount", "width": "100", "type": "text"},
                {"name": "准时率", "code": "onTimeRate", "width": "80", "type": "text"},
                {"name": "延误率", "code": "delayRate", "width": "80", "type": "text"},

                {"name": "提货准时率", "code": "lastPickUpOrderOnTimeRate", "width": "80", "type": "text"},
                {"name": "提货延误率", "code": "lastPickUpOrderDelayRate", "width": "80", "type": "text"},
                {"name": "卸货准时率", "code": "lastDeliveryOrderOnTimeRate", "width": "80", "type": "text"},
                {"name": "卸货延误率", "code": "lastDeliveryOrderDelayRate", "width": "80", "type": "text"},

                {"name": "调度件数/件", "code": "sumGoodsCount", "width": "120", "type": "text"},
                {"name": "调度重量/kg", "code": "sumGoodsWeight", "width": "120", "type": "text"},
                {"name": "调度体积/m³", "code": "sumGoodsVolume", "width": "120", "type": "text"},
                {"name": "总应收", "code": "sumIncome", "width": "100", "type": "text","currencyFlag":true},
                {"name": "总成本", "code": "sumCost", "width": "100", "type": "text","currencyFlag":true},
                {"name": "毛利", "code": "sumGrossProfit", "width": "100", "type": "text","currencyFlag":true},
                {"name": "毛利率", "code": "sumGrossProfitRate", "width": "80", "type": "text"},
            ],
            query: this.initQuery(),
            pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
            symbolOptions: enumData.compareText,
            downloadShowFlag:false,
            billMonth:'',
            preMonth:'',
            type:1,
            title:'导出客户月运作汇总状况',
        }
    },
    mounted()
    {
        this.doQuery();
        this.init();
    },
    components: {
        tableCommon,
        searchList
    },
    methods:
    {
        /**
         * 初始化静态数据
         */
        init()
        {

        },
        /**
         * 初始化查询条件
         * @returns {{orderType: string, tenantName: string, orderNum: string, orderState: string}}
         */
        initQuery()
        {
            this.query = {
                tenantName: '',
                createDate: '',
                workDate: '',
                finishDate: '',
                customerOrderDate: '',
            };
            return this.query;
        },
        /**
         * 列表查询
         */
        async doQuery(query=this.query)
        {
            this.query=query;
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length === 2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            if(this.common.isNotBlank(this.query.finishDate) && this.query.finishDate.length === 2){
                this.query.startFinishDate = this.query.finishDate[0];
                this.query.endFinishDate = this.query.finishDate[1];
            }else{
                this.query.startFinishDate = '';
                this.query.endFinishDate = '';
            }
            if(this.common.isNotBlank(this.query.workDate) && this.query.workDate.length === 2){
                this.query.startWorkDate = this.query.workDate[0];
                this.query.endWorkDate = this.query.workDate[1];
            }else{
                this.query.startWorkDate = '';
                this.query.endWorkDate = '';
            }
            if(this.common.isNotBlank(this.query.customerOrderDate) && this.query.customerOrderDate.length === 2){
                this.query.startCustomerOrderDate = this.query.customerOrderDate[0];
                this.query.endCustomerOrderDate = this.query.customerOrderDate[1];
            }else{
                this.query.startCustomerOrderDate = '';
                this.query.endCustomerOrderDate = '';
            }
            await this.$refs.table.load("transportReportTF", "loadCustomerOperationSummaryPage", this.query);
        },
        showDownload(type){
            this.downloadShowFlag = true;
            var now =  new Date();
            var year = now.getFullYear();
            var month = now.getMonth()+1;
            if(month==1){
                month = 12;
                year = year-1;
            }else{
                month -= 1;
            }
            this.billMonth= year+'-'+(month>9?month:('0'+month));
            this.type=type
            if(type==1){
                this.title="导出客户月运作汇总状况"
            }else if(type==2){
                this.title="导出月度成本差异调整"
            }else if(type==3){
                this.title="导出月度收入差异调整"
            }else if(type==4){
                this.title="导出供应商月度成本报表"
            }
        },
        closeDownload(){
            this.downloadShowFlag = false;
        },
        downloadExcel(){
            if(this.type==1){
                this.downloadCustOperationExcel();
            }else if(this.type==2){
                this.downloadCostMonthDiff();
            }else if(this.type==3){
                this.downloadIncomeMonthDiff();
            }else if(this.type==4){
                this.downloadMonthCostExcel();
            }
            this.closeDownload();
        },
        downloadCustOperationExcel(){
            let fileName = '客户月运作汇总状况';
            let param = {};
            if(!this.billMonth){
                this.$message.error("请选择月份！");
                return;
            }
            param.billMonth = this.billMonth;
            param.selfCreateUrl = 'transportReportTF|downloadExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'custMonthDiff');
        },
        downloadMonthCostExcel(){
            let fileName = '供应商月度成本报表';
            let param = {};
            if(!this.billMonth){
                this.$message.error("请选择月份！");
                return;
            }
            param.billMonth = this.billMonth;
            param.selfCreateUrl = 'transportReportTF|downloadMonthCostExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'monthCost');
        },
        //导出功能
        downloadCostMonthDiff(){
            let queryUrl = 'transportReportTF|queryCostMonthDiffData';
            let excelKeys='*index,supplierTenantName,custTenantName,billMonth,regionName,orgName,billNum,amount,feeTypeName,@makeupFee,afterAmount,taxRate,remark,createUserName,createDate';
            let param = {};
            if(!this.billMonth){
                this.$message.error("请选择月份！");
                return;
            }
            param.billMonth = this.billMonth;
            param.templateName = "costMonthDiff.xls";
            param.templateStartRow = 2;
            this.common.downloadExcelFile(queryUrl,param,'',excelKeys,'月度成本差异调整','costMonthDiffTable');
        },
        //导出功能
        downloadIncomeMonthDiff(){
            let queryUrl = 'transportReportTF|queryIncomeMonthDiffData';
            let excelKeys='*index,tenantName,billMonth,regionName,orgName,billNum,amount,feeTypeName,@makeupFee,afterAmount,taxRate,remark,createUserName,createDate';
            let param = {};
            if(!this.billMonth){
                this.$message.error("请选择月份！");
                return;
            }
            param.billMonth = this.billMonth;
            param.templateName = "incomeMonthDiff.xls";
            param.templateStartRow = 2;
            this.common.downloadExcelFile(queryUrl,param,'',excelKeys,'月度收入差异调整','incomeMonthDiffTable');
        },
        /**
         * 导出
         */
        exportDownload()
        {
            /*if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length === 2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            if(this.common.isNotBlank(this.query.finishDate) && this.query.finishDate.length === 2){
                this.query.startFinishDate = this.query.finishDate[0];
                this.query.endFinishDate = this.query.finishDate[1];
            }else{
                this.query.startFinishDate = '';
                this.query.endFinishDate = '';
            }
            if (this.common.isBlank(this.query.startCreateDate) && this.common.isBlank(this.query.startFinishDate))
            {
                this.$message.error("请输入一个不超过90天的创建时间或者完成时间再导出！");
                return false;
            }
            if (this.common.isNotBlank(this.query.startCreateDate))
            {
                let start = new Date(this.query.startCreateDate);
                let end = new Date(this.query.endCreateDate);
                start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 90);
                if (start.getTime() < end.getTime())
                {
                    this.$message.error("导出的创建开始时间:" + this.query.startCreateDate + " 和创建结束时间：" + this.query.endCreateDate + "相差不能超过90天！");
                    return false;
                }
            }
            if (this.common.isNotBlank(this.query.startFinishDate))
            {
                let start = new Date(this.query.startFinishDate);
                let end = new Date(this.query.endFinishDate);
                start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 90);
                if (start.getTime() < end.getTime())
                {
                    this.$message.error("导出的完成开始时间:" + this.query.startFinishDate + " 和完成结束时间：" + this.query.endFinishDate + "相差不能超过90天！");
                    return false;
                }
            }*/
            this.$refs.table.downloadExcelFile('客户运作汇总列表');
        },
    },
    computed:{
        formData(){
            return [
                {"name":"客户","placeholder":"客户","model":"tenantName","type":"input","isshow":true},
                {"name":"下单时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"完成时间","model":"finishDate","type":"daterange","isshow":true},
                {"name":"要求运作时间","model":"workDate","type":"daterange","isshow":true},
                {"name":"客户下单时间","model":"customerOrderDate","type":"daterange","isshow":true},
            ]
        }
    },
}
