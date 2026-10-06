import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'meetTotalReport',
    data() {
        return {
            head: [
                {"name": "供应商", "code": "supplierName", "width": "110", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "200", "type": "text"},
                {"name": "应付金额", "code": "invoiceFee", "width": "90", "type": "text","currencyFlag":true},
                {"name": "已付金额", "code": "invoicePayFee", "width": "90", "type": "text","currencyFlag":true},
                {"name": "未付金额", "code": "noInvoicePayFee", "width": "90", "type": "text","currencyFlag":true},
                {"name": "未逾期", "width": "90", "type": "text",
                    "children":[
                        {"name": "账期内", "code": "noOverdueFee", "width": "90", "type": "text","currencyFlag":true},
                    ]
                },
                {"name": "逾期金额", "width": "700", "type": "text",
                    "children":[
                        {"name": "逾期合计", "code": "overdueFee", "width": "100", "type": "text","currencyFlag":true},
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
            this.$refs.table.load("rptFeeReportTF", "queryMeetTotalReportData", this.loadParam);
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
            this.$refs.table.downloadExcelFile('应付汇总表');
        },

    },
    computed:{
        formData(){
            return [
                {"name":"供应商","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
            ]
        }
    },
}
