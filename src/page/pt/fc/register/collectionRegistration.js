import tableCommon from "@/components/table/tableCommon.vue"
import scrollTable from "@/components/scrollTable/scrollTable.vue"
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'collectionRegistration',
    data()
    {
        return {
            //现有标题
            head: [
                {"name": "账单编号", "code": "billNum", "width": "110", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "110", "type": "text"},
                {"name": "发票申请编号", "code": "applyInvoiceNum", "width": "110", "type": "text"},
                {"name": "客户名称", "code": "tenantName", "width": "180", "type": "text"},
                {"name": "购买方名称", "code": "fcCustTenantName", "width": "250", "type": "text"},
                {"name": "客户代表", "code": "custManageUserName", "width": "150", "type": "text"},
                {"name": "所属区域", "code": "regionName", "width": "120", "type": "text"},
                {"name": "所属部门", "code": "orgName", "width": "160", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "结算主体", "code": "invoicingCompanyName", "width": "180", "type": "text"},
                {"name": "状态", "code": "receiveStateName", "width": "80", "type": "text"},
                {"name": "发票号码", "code": "invoiceNum", "width": "200", "type": "text"},
                {"name": "用途", "code": "invoiceTypeName", "width": "120", "type": "text"},
                {"name": "开票日期", "code": "invoiceDate", "width": "200", "type": "text"},
                {"name": "账期", "code": "accountPeriod", "width": "80", "type": "text"},
                {"name": "预计收款日期", "code": "lastReceiveDate", "width": "200", "type": "text"},
                {"name": "是否逾期", "code": "isOverdueName", "width": "200", "type": "diy"},
                {"name": "逾期天数", "code": "overdueDays", "width": "200", "type": "text"},
                {"name": "发票金额", "code": "applyInvoiceFee", "width": "110", "type": "text"},
                {"name": "已收金额", "code": "receivedFee", "width": "110", "type": "text"},
                {"name": "未收金额", "code": "noReceiveFee", "width": "110", "type": "diy"},
                {"name": "最后收款日期", "code": "lastActualReceiveDate", "width": "150", "type": "text"},
            ],
            //收款记录的标题
            receiveRecordHead: [
                {"name": "发票申请编号", "code": "applyInvoiceNum", "width": "110", "type": "text"},
                {"name": "发票类型", "code": "invoiceTypeName", "width": "80", "type": "text"},
                {"name": "开票金额(含税)", "code": "applyInvoiceFee", "width": "90", "type": "text"},
                {"name": "实际收款日期", "code": "actualReceiveDate", "width": "90", "type": "text"},
                {"name": "最后收款日期", "code": "lastReceiveDate", "width": "90", "type": "text"},
                {"name": "是否逾期", "code": "isOverdueName", "width": "80", "type": "text"},
                {"name": "逾期天数", "code": "isOverdueDay", "width": "80", "type": "text"},
                {"name": "收款金额", "code": "receivedFee", "width": "80", "type": "text"},
                {"name": "收款备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "80", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "130", "type": "text"},
                {"name": "操作", "code": "receivedAmount", "width": "80", "type": "diy"},
            ],
            query: this.initQuery(),
            receiveStateData: [],//收款状态
            invoicingCompanyData:[],
            whetherData:[],
            receiveShow: false,//是否展示收款登记弹窗
            receiveRecord: false,//是否展示收款记录
            bill: {},//账单数据
            symbolOptions: enumData.compareText,
            receiveShowBatch:false,
            info:{},
            updateDateShow:false,
        }
    },
    mounted()
    {
        this.doQuery();
        this.init();
    },
    components: {
        tableCommon,
        scrollTable,
        searchList,
    },
    methods:
    {
        /**
         * 初始化静态数据
         */ async init() {
            let that = this;
            //收款登记状态
            that.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECEIVE_STATE"}, function (data) {
                that.receiveStateData = data;
            });
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            that.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICING_COMPANY"}, function (data) {
                that.invoicingCompanyData = data;
            });
        },
        /**
         * 初始化查询条件
         */
        initQuery()
        {
            this.query = {};
            return this.query;
        },
        /**
         * 清空
         */
        clear()
        {
            this.query = {};
        },
        /**
         *
         */
        async doQuery(query=this.query) {
            this.query=query;
            await this.$refs.table.load("fcCollectionRegistrationTF", "loadBillReceiveData", this.query);
        },
        /**
         *
         */
        async doQueryReceiveRecord(invoiceId)
        {
            await this.$refs.receiveRecordTable.load("fcCollectionRegistrationTF", "queryReceiveRecord", {invoiceId: invoiceId});
        },
        /**
         * 打开收款记录
         * @param flag
         */
        showReceiveRecord(flag)
        {
            if (flag)
            {
                let selectData = this.$refs.table.getSelectItem();
                if(selectData.length !== 1)
                {
                    this.$message.error("请选择一个需要查看收款记录的数据！");
                    return false;
                }
                this.receiveRecord = flag;
                this.bill = this.common.copyObj(selectData[0]);
                this.$nextTick(() => {
                    this.doQueryReceiveRecord(this.bill.invoiceId);
                })
            }
            else
            {
                this.receiveRecord = flag;
                this.doQuery();
            }
        },
        /**
         * 新增收款登记
         */
        showReceive(flag)
        {
            if (flag)
            {
                let selectData = this.$refs.table.getSelectItem();
                if(selectData.length<=0){
                    this.$message.error("请至少选择一个需要收款登记的账单！");
                    return false;
                }
                let invoiceIds = [];
                if(selectData.length > 1){
                    let noReceiveFee = 0;
                    let applyInvoiceNums = '';
                    this.info = {};
                    for (let i = 0; i < selectData.length; i++) {
                        let data = selectData[i];
                        if (data.receiveState == enumData.RECEIVE_STATE.REGISTER)
                        {
                            this.$message.error("已登记账单无法收款确认！");
                            return false;
                        }
                        if (data.noReceiveFee <= 0)
                        {
                            this.$message.error("请选择未收金额不为0的账单收款登记！");
                            return false;
                        }
                        applyInvoiceNums += ','+data.applyInvoiceNum;
                        invoiceIds.push(data.invoiceId);
                        noReceiveFee = this.common.accAdd(noReceiveFee,data.noReceiveFee);
                    }
                    this.info.applyInvoiceNums = applyInvoiceNums.substring(1);
                    this.info.invoiceIds = invoiceIds;
                    this.info.noReceiveFee = noReceiveFee;
                    this.info.actualReceiveDate = this.common.formatDate.getDate();
                    this.showReceiveBatch(true);
                    return ;
                }
                let data = selectData[0];
                if (data.receiveState == enumData.RECEIVE_STATE.REGISTER)
                {
                    this.$message.error("已登记账单无法收款确认！");
                    return false;
                }
                if (data.noReceiveFee <= 0)
                {
                    this.$message.error("请选择未收金额不为0的账单收款登记！");
                    return false;
                }
                this.bill = this.common.copyObj(data);
                this.bill.receivedAmount = this.bill.noReceiveFee;
                this.bill.actualReceiveDate = this.common.formatDate.getDate();
            }
            this.receiveShow = flag;
        },
        showReceiveBatch(flag){
            this.receiveShowBatch = flag;
        },
        showUpdateDate(flag){
            if (flag)
            {
                let selectData = this.$refs.table.getSelectItem();
                if(selectData.length!=1){
                    this.$message.error("请选择一个需要修改预计收款日期的数据！");
                    return false;
                }
                let data = selectData[0];
                if (data.applyInvoiceFee == data.receivedFee)
                {
                    this.$message.error("已全部收款无法修改预计收款日期！");
                    return false;
                }
                this.bill = this.common.copyObj(data);
            }
            this.updateDateShow = flag;
        },
        /**
         * 批量收款登记
         */
        sureReceiveBatch(){
            let that = this;
            that.common.postUrl("fcCollectionRegistrationTF", "batchSureReceive", that.info, function (data){
                that.$message.success("收款登记成功！");
                that.doQuery();
                that.showReceiveBatch(false);
            },null,'',true);
        },

        /**
         * 确认收款登记
         */
        sureReceive()
        {
            if(this.common.isBlank(this.bill.receivedAmount)){
                this.$message.error("请填写收款金额！");
                return false;
            }
            if (this.common.isBlank(this.bill.actualReceiveDate)){
                this.$message.error("请填写实际收款日期！");
                return false;
            }
            if (this.bill.receivedAmount > this.bill.noReceiveFee)
            {
                this.$message.error("收款金额不能大于未收金额！");
                return false;
            }
            let that = this;
            that.common.postUrl("fcCollectionRegistrationTF", "sureReceiveNew", this.bill, function (data)
            {
                that.$message.success("收款登记成功！");
                that.showReceive(false);
                that.doQuery();
            },null,'',true);
        },
        updateLastReceiveDate()
        {
            if (this.common.isBlank(this.bill.lastReceiveDate)){
                this.$message.error("请填写预计收款日期！");
                return false;
            }
            let that = this;
            that.common.postUrl("fcCollectionRegistrationTF", "updateLastReceiveDate", this.bill, function (data)
            {
                that.$message.success("更新成功！");
                that.showUpdateDate(false);
                that.doQuery();
            },null,'',true);
        },
        /**
         * 撤销收款
         */
        cancelReceiveFee(item)
        {
            let that = this;
            that.$confirm("是否撤销该收款登记？", "提示").then(() =>{
                that.common.postUrl("fcCollectionRegistrationTF", "cancleReceiveFee", item, function (data)
                {
                    that.doQueryReceiveRecord(that.bill.invoiceId);
                    that.$message.success("收款登记撤销成功!");
                },null,'',true);
            }).catch(() =>{})
        },
        download(){
            this.$refs.table.downloadExcelFile('收款登记列表');
        },
    },
    computed:{
        formData(){
            return [
                {"name":"账单编号","model":"billNum","type":"input","placeholder":"账单编号","isshow":true},
                {"name":"账单月份","model":"billMonth","type":"months","isshow":true},
                {"name":"客户名称","model":"tenantName","type":"input","placeholder":"客户名称","isshow":true},
                {"name":"发票号码","model":"invoiceNum","type":"input","placeholder":"发票号码","isshow":true},
                {"name":"状态","model":"receiveState","type":"select","options":this.receiveStateData,"label":"codeName","value":"codeValue","clearable":true,"multiple":true,"method":"doQuery","isshow":true},
                {"name":"未收金额","model":"noReceiveFeeSymbolItem","isshow":true,
                    children:[
                        {"model":"noReceiveFeeSymbol","options":this.symbolOptions,"label":"label","value":"value","clearable":true,"method":"doQuery"},
                        {"model":"noReceiveFee"}]
                },
                {"name":"结算主体","model":"invoicingCompany","type":"select","options":this.invoicingCompanyData,"label":"codeName","value":"codeValue","placeholder":"结算主体","method":"doQuery","isshow":true},
                {"name":"提交人","model":"createUserName","type":"input","placeholder":"提交人","isshow":true},
                {"name":"所属区域","model":"regionName","type":"input","placeholder":"所属区域","isshow":true},
                {"name":"所属部门","model":"orgName","type":"input","placeholder":"所属部门","isshow":true},
                {"name":"购买方名称","model":"fcCustTenantName","type":"input","placeholder":"购买方名称","isshow":true},
                {"name":"是否逾期","model":"isOverdue","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
            ]
        }
    },
}
