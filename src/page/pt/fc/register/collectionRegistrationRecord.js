import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'collectionRegistrationRecord',
    data()
    {
        return {
            head: [
                {"name": "客户名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "购买方名称", "code": "fcCustTenantName", "width": "250", "type": "text"},
                {"name": "结算主体", "code": "invoicingCompanyName", "width": "180", "type": "text"},
                {"name": "账单编号", "code": "billNum", "width": "110", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "110", "type": "text"},
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
            invoicingCompanyData:[],
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
         * 初始化查询条件
         */
        initQuery()
        {
            this.query = {
                tenantName: '',
                billNum: '',
                billMonth: '',
                createUserName: '',
                createDate: '',
                actualReceiveDate: '',
            };
            return this.query;
        },
        /**
         * 初始化静态数据
         */
        async init() {
            let that = this;
            that.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICING_COMPANY"}, function (data) {
                that.invoicingCompanyData = data;
            });
        },
        /**
         * 列表查询
         */
        async doQuery(query=this.query)
        {
            this.query = query;
            await this.$refs.table.load("fcCollectionRegistrationTF", "queryReceiveRecord", this.query);
        },
        /**
         * 撤销收款
         */
        cancleReceiveFee()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个需要撤销收款登记的记录！");
                return false;
            }
            let that = this;
            that.$confirm("是否撤销该收款登记？", "提示").then(() =>{
                that.common.postUrl("fcCollectionRegistrationTF", "cancleReceiveFee", selectData[0], function (data)
                {
                    that.doQuery();
                    that.$message.success("收款登记撤销成功!");
                },null,'',true);
            }).catch(() =>{})
        },
        download(){
            this.$refs.table.downloadExcelFile('已收登记列表');
        },
    },
    computed: {
        formData(){
            return [
                {"name":"客户名称","placeholder":"客户名称","model":"tenantName","type":"input","isshow":true},
                {"name":"账单编号","placeholder":"账单编号","model":"billNum","type":"input","isshow":true},
                {"name":"账单月份","placeholder":"账单月份","model":"billMonth","type":"month","isshow":true},
                {"name":"操作人","placeholder":"操作人","model":"createUserName","type":"input","isshow":true},
                {"name":"操作时间","placeholder":"操作时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"实际收款日期","placeholder":"实际收款日期","model":"actualReceiveDate","type":"daterange","isshow":true},
                {"name":"结算主体","model":"invoicingCompany","type":"select","options":this.invoicingCompanyData,"label":"codeName","value":"codeValue","placeholder":"结算主体","method":"doQuery","isshow":true},
            ]
        }
    }
}
