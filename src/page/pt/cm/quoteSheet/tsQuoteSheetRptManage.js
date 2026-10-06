import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'tsQuoteSheetRptManage',
    data()
    {
        return {
            head: [
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "客户名称", "code": "custName", "width": "250", "type": "text"},
                {"name": "账期", "code": "accountPeriod", "width": "120", "type": "text"},
                {"name": "运输类型", "code": "quoteTypeName", "width": "120", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
                {"name": "起始地", "code": "beginAddress", "width": "150", "type": "text"},
                {"name": "目的地", "code": "endAddress", "width": "150", "type": "text"},
                {"name": "计费方式", "code": "billingTypeName", "width": "120", "type": "text"},
                {"name": "报价车型", "code": "quoteVehicleTypeName", "width": "120", "type": "text"},
                {"name": "报价车长", "code": "vehicleLengthName", "width": "120", "type": "text"},
                {"name": "是否往返", "code": "isRoundName", "width": "120", "type": "text"},
                {"name": "费用类型", "code": "feeTypeName", "width": "120", "type": "text"},
                {"name": "区间", "code": "rangeStr", "width": "150", "type": "text"},
                {"name": "区间单位", "code": "rangeUnitName", "width": "120", "type": "text"},
                {"name": "未税单价(元)", "code": "fee", "width": "120", "type": "text"},
                {"name": "增值税率(%)", "code": "taxRate", "width": "120", "type": "text"},
                {"name": "含税单价(元)", "code": "feeWithTax", "width": "120", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
            ],
            query:{},
            customerData:[],
        }
    },
    async mounted()
    {
        this.initData();
        this.doQuery();
    },
    components: {
        tableCommon,
    },
    methods: {
        initQuery(){
           this.query={};
        },
        initData(){
            let that = this;
            // 客户
            this.common.postUrl("customerTF", "loadCustomerList", {}, function (data) {
                that.customerData = data;
            });
        },
        async doQuery()
        {
            await this.$refs.table.load("quoteSheetTF", "queryQuoteSheetRptPage", this.query);
        },
        // 查看详情
        dblclickItem(item){
            let quoteId = item.quoteId;
            this.$emit('openTab', {
                urlName: '报价单详情',
                urlId: 'detail'+quoteId,
                urlPathName: "/quoteSheetDetail",
                urlPath: "/pt/cm/quoteSheet/quoteSheetDetail.vue",
                query:{quoteId}
            });
        },
        /**
         * 导出
         */
        downExcel() {
            this.$refs.table.downloadExcelFile();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        },
    },
    computed:{

    },
}
