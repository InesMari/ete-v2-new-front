import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'meetDetailReport',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "billNum", "width": "120", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "120", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "200", "type": "text"},
                {"name": "付款单号", "code": "payNum", "width": "120", "type": "diy"},
                {"name": "收票日期", "code": "verifyDate_", "width": "110", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "110", "type": "text"},
                {"name": "应付金额", "code": "invoiceFee", "width": "90", "type": "text","currencyFlag":true},
                {"name": "已付金额", "code": "invoicePayFee", "width": "90", "type": "text","currencyFlag":true},
                {"name": "未付金额", "code": "noInvoicePayFee", "width": "90", "type": "text","currencyFlag":true},
                {"name": "账期", "code": "accountPeriod", "width": "90", "type": "text"},
                {"name": "最后付款日期", "code": "lastPayDate_", "width": "110", "type": "text"},
                {"name": "逾期金额", "code": "overdueFee", "width": "90", "type": "text","currencyFlag":true},
                {"name": "超期应付账龄", "width": "600", "type": "text",
                    "children":[
                        {"name": "0-30天", "code": "payFee_one", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "31-60天", "code": "payFee_two", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "61-90天", "code": "payFee_three", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "91-180天", "code": "payFee_four", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "181-360天", "code": "payFee_five", "width": "100", "type": "text","currencyFlag":true},
                        {"name": "360天以上", "code": "payFee_six", "width": "100", "type": "text","currencyFlag":true},
                    ]
                },
            ],
            loadParam: {},
            settleBodyData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(loadParam=this.loadParam) {
            this.loadParam=loadParam;
            //收票日期
            if(this.common.isNotBlank(this.loadParam.payDaterange) && this.loadParam.payDaterange.length==2){
                this.loadParam.startVerifyDate = this.loadParam.payDaterange[0];
                this.loadParam.endVerifyDate = this.loadParam.payDaterange[1];
            }else{
                this.loadParam.startVerifyDate = '';
                this.loadParam.endVerifyDate = '';
            }

            if(this.common.isNotBlank(this.loadParam.lastPayDaterange) && this.loadParam.lastPayDaterange.length==2){
                this.loadParam.startLastPayDate = this.loadParam.lastPayDaterange[0];
                this.loadParam.endLastPayDate = this.loadParam.lastPayDaterange[1];
            }else{
                this.loadParam.startLastPayDate = '';
                this.loadParam.endLastPayDate = '';
            }
            if (this.common.isNotBlank(this.$route.query.isFromSystemData))
            {
                this.loadParam.isFromSystemData = this.$route.query.isFromSystemData;
                this.loadParam.systemDataParam = this.$route.query.systemDataParam;
            }
            this.$refs.table.load("rptFeeReportTF", "queryMeetDetailReportData", this.loadParam);
        },
        init() {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"}, function (data) {
                that.settleBodyData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        /** 导出Excel */
        download(){
            this.$refs.table.downloadExcelFile('应付明细列表');
        },
        /**
         * 账单明细
         */
        toFcSupplierBillDetail(data)
        {
            this.$emit('openTab', {
                urlName: '账单明细',
                urlId: 'confirmSupplierBillDetail_' + data.fcBillId,
                urlPathName: "/fc",
                urlPath: "/pt/fc/supplierBill/detail/confirmBillDetail.vue",
                query: {fcSupplierBillId: data.fcBillId},
            });
        },
        /**
         * 跳转付款单详情
         * @param param
         * @returns {Promise<void>}
         */
        toDetail(payId) {
            this.$emit("openTab",{
                query: {id:payId,type:0},
                urlId: "payOrderDetail" + payId,
                urlName: '查看付款单',
                urlPathName: "/payOrderDetail",
                urlPath: "/pt/fc/receipts/detail/payOrderDetailMain.vue"});
        },
    },
    computed:{
        formData(){
            return [
                {"name":"账单编号","placeholder":"账单编号","model":"billNum","type":"input","isshow":true},
                {"name":"账单月份","placeholder":"账单月份","model":"billMonth","type":"month","isshow":true},
                {"name":"收票日期","model":"payDaterange","type":"daterange","isshow":true},
                {"name":"供应商","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"最后付款日期","model":"lastPayDaterange","type":"daterange","isshow":true},
            ]
        }
    },
}
