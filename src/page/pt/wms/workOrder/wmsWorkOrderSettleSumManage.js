import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'wmsWorkOrderSettleSumManage',
    data()
    {
        return {
            head: [
                {"name": "仓库名称", "code": "workName", "width": "200", "type": "text"},
                {"name": "登记月份", "code": "month", "width": "150", "type": "text"},
                {"name": "供应商", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "费用类型", "code": "itemTypeName", "width": "150", "type": "text"},
                {"name": "作业名称", "code": "itemName", "width": "150", "type": "text"},
                {"name": "期初数量", "code": "endNoSettleNum", "width": "110", "type": "text"},
                {"name": "作业确认数量", "code": "confirmNumSum", "width": "110", "type": "text"},
                {"name": "结算确认数量", "code": "settleNumSum", "width": "110", "type": "text"},
                {"name": "含税结算金额", "code": "settleFeeWithTaxSum", "width": "110", "type": "text"},
                {"name": "结存未结算", "code": "noSettleNumSum", "width": "110", "type": "text"},
            ],
            allStoreHouseData: [],
            supplierData: [],



            confirmStateData: [],
            registerStateData: [],
            itemTypeData: [],
            query: {
                orderNum: null,
                workName: null,
                tenantName: null,
                confirmState: null,
                registerState: null,
                itemType: null,
                itemName: null,
                confirmDate: null,
                registerDate: null,
            },
            showViewer: false,
            srcList: [],
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        tableCommon,
        searchList,
    },
    computed: {
        formData()
        {
            return [
                // {"name":"仓库名称","model":"workId","type":"select","options":this.allStoreHouseData,"label":"workName","value":"workId","method":"doQuery","isshow":true},
                {"name":"供应商名称","model":"tenantId","type":"select","options":this.supplierData,"label":"supplierName","value":"tenantId","placeholder":"供应商名称","method":"doQuery","isshow":true},
                {"name":"费用类型","model":"itemType","type":"select","options":this.itemTypeData,"label":"codeName","value":"codeValue","placeholder":"费用类型","method":"doQuery","isshow":true},
                {"name":"作业名称","model":"itemName","type":"input","placeholder":"单号","isshow":true},
                {"name":"登记月份","model":"month","type":"month","isshow":true},
            ]
        }
    },
    methods: {
        async initData()
        {
            let data = await this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", {codeType: "CONFIRM_STATE,REGISTER_STATE,WMS_FEE_ITEM_TYPE"});
            this.itemTypeData = data.WMS_FEE_ITEM_TYPE;
            this.allStoreHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            await this.$refs.table.load("workOrderService", "queryWorkOrderGroupByPage", this.query);
        },
        exportExcel()
        {
            this.query.isExport = 1;
            this.$refs.table.downloadExcelFile();
        },
        async dblclickItem(item)
        {
            this.$emit('openTab', {
                urlName: '作业单详情',
                urlId: 'wmsWorkOrderDetail-detail' + item.workId + item.tenantId + item.itemId + item.month,
                urlPathName: "/wms",
                urlPath: "/pt/wms/workOrder/wmsWorkOrderDetail.vue",
                query: {
                    month: item.month,
                    workId: item.workId,
                    tenantId: item.tenantId,
                    itemId: item.itemId,
                    type: 0,
                }//0详情
            });

        },

    },
}
