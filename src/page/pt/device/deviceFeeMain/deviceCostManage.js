import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'deviceCostManage',
    data() {
        return {
            head: [
                {"name": "采购单号", "code": "purchaseOrderNum", "width": "120", "type": "text"},
                {"name": "供应商", "code": "supplierTenantName", "width": "150", "type": "text"},
                {"name": "采购方", "code": "settleBodyName", "width": "200", "type": "text"},
                {"name": "仓库", "code": "workName", "width": "180", "type": "text"},
                {"name": "核算月份", "code": "billMonth", "width": "120", "type": "text"},
                {"name": "器具名称", "code": "deviceName", "width": "120", "type": "text"},
                {"name": "器具规格", "code": "spec", "width": "100", "type": "text"},
                {"name": "使用客户", "code": "custTenantName", "width": "150", "type": "text"},
                {"name": "业务模式", "code": "businessModeName", "width": "100", "type": "text"},
                {"name": "采购数量", "code": "nums", "width": "80", "type": "text"},
                {"name": "计费单位", "code": "unitName", "width": "100", "type": "text"},
                {"name": "采购单价（含税）", "code": "priceWithTax", "width": "120", "type": "text"},
                {"name": "增值税", "code": "taxRate", "width": "80", "type": "text"},
                {"name": "含税合计", "code": "totalFeeWithTax", "width": "120", "type": "text"},
                {"name": "不含税合计", "code": "totalFee", "width": "120", "type": "text"},
                {"name": "是否入账", "code": "entryBillFlagName", "width": "100", "type": "text"},
                {"name": "账单编号", "code": "billNum", "width": "150", "type": "text"},
                {"name": "采购人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "采购时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            loadParam: {ids: this.$route.query.ids},
            settleBodyData:[],
            storeHouseData:[],
            whetherData:[],
            customerData:[],
            typeData:[{codeValue:'1',codeName:'买断'},{codeValue:'2',codeName:'分期'},{codeValue:'3',codeName:'租赁'}]//1 买断 2 分期 3 租赁
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
        searchList,
        scrollTable
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(loadParam = this.loadParam) {
            this.loadParam = loadParam;
            this.$refs.table.load("devCostService", "queryDeviceCostPage", this.loadParam);
        },
        //初始化页面的静态数据
        async initStaticData() {
            this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
            this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.customerData = await this.common.postUrl("deviceContractService", "queryContractTenant", {});
        },
        clear() {
            this.loadParam = {};
        },
    },
    computed: {
        formData() {
            return [
                {"name":"采购单号","model":"purchaseOrderNum","type":"input","placeholder":"搜索采购单号","isshow":true},
                {"name":"供应商名称","model":"supplierName","type":"input","placeholder":"搜索供应商名称","isshow":true},
                {"name":"采购方","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","placeholder":"请选择","method":"doQuery","isshow":true},
                {"name":"仓库","model":"workId","type":"select","options":this.storeHouseData,"label":"workName","value":"workId","placeholder":"请选择","method":"doQuery","isshow":true},
                {"name":"核算月份","model":"billMonth","type":"month","isshow":true},
                {"name":"器具名称","model":"deviceName","type":"input","placeholder":"搜索器具名称","isshow":true},
                {"name":"使用客户","model":"custTenantId","type":"select","options":this.customerData,"label":"tenantName","value":"tenantId","placeholder":"请选择","method":"doQuery","isshow":true},
                {"name":"是否入账","model":"entryBillFlag","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"请选择","method":"doQuery","isshow":true},
                {"name":"业务模式","model":"type","type":"select","options":this.typeData,"label":"codeName","value":"codeValue","placeholder":"请选择","method":"doQuery","isshow":true},
            ]
        }
    },
}
