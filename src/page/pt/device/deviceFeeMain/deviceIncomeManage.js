import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'deviceIncomeManage',
    data() {
        return {
            head: [
                {"name": "客户名称", "code": "custTenantName", "width": "250", "type": "text"},
                {"name": "结算日期", "code": "billMonth", "width": "90", "type": "text"},
                {"name": "业务模式", "code": "businessModeName", "width": "90", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "200", "type": "text"},
                {"name": "仓库", "code": "workName", "width": "80", "type": "text"},
                {"name": "器具名称", "code": "deviceName", "width": "80", "type": "text"},
                {"name": "器具规格", "code": "spec", "width": "120", "type": "text"},
                {"name": "器具费用项目", "code": "feeItemName", "width": "80", "type": "text"},
                {"name": "单价单位", "code": "unitName", "width": "120", "type": "text"},
                {"name": "单价（未税）", "code": "price", "width": "80", "type": "text"},
                {"name": "数量", "code": "nums", "width": "80", "type": "text"},
                {"name": "税点", "code": "taxRate", "width": "80", "type": "text"},
                {"name": "补充仓储费用", "code": "exceedFee", "width": "100", "type": "text"},
                {"name": "未税合计", "code": "totalFee", "width": "100", "type": "text"},
                {"name": "含税合计", "code": "totalFeeWithTax", "width": "100", "type": "text"},
                {"name": "是否入账", "code": "entryBillFlagName", "width": "100", "type": "text"},
                {"name": "账单编号", "code": "billNum", "width": "150", "type": "diy"},
            ],
            loadParam: {},
            settleBodyData:[],
            storeHouseData:[],
            whetherData:[],
            businessModeData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initStaticData();
        this.doQuery();
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
        async initStaticData()
        {
            this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"})
            this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"})
            this.businessModeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BUSINESS_MODE"})
        },
        doQuery(loadParam = this.loadParam) {
            this.loadParam = loadParam;
            this.$refs.table.load("devIncomeService", "queryDeviceIncomePage", this.loadParam);
        },
        /**
         * 确认账单的明细
         */
        toCustomerConfirmedBillDetail(data)
        {
            this.$emit('openTab', {
                urlName: '确认账单明细',
                urlId: 'confirmBillDetail',
                urlPathName: "/fc",
                urlPath: "/pt/fc/custBill/detail/confirmBillDetail.vue",
                query: {billId: data.fcCustBillId,tabId: enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE, flag: 1},
            });
        },
    },
    computed: {
        formData() {
            return [
                {"name":"客户名称","model":"custTenantName","type":"input","placeholder":"搜索客户名称","isshow":true},
                {"name":"器具名称","model":"deviceName","type":"input","placeholder":"搜索器具名称","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","placeholder":"请选择","method":"doQuery","isshow":true},
                {"name":"仓库","model":"workId","type":"select","options":this.storeHouseData,"label":"workName","value":"workId","placeholder":"请选择","method":"doQuery","isshow":true},
                {"name":"核算月份","model":"billMonth","type":"month","isshow":true},
                {"name":"是否入账","model":"entryBillFlag","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"请选择","method":"doQuery","isshow":true},
                {"name":"业务模式","model":"businessMode","type":"select","options":this.businessModeData,"label":"codeName","value":"codeValue","placeholder":"请选择","method":"doQuery","isshow":true},
            ]
        }
    },
}
