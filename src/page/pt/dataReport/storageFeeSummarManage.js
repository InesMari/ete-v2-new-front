import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'storageFeeSummarManage',
    data()
    {
        return {
            head: [
                {"name": "核算月份", "code": "billMonth", "width": "100", "type": "text"},
                {"name": "仓库名称", "code": "workName", "width": "300", "type": "text"},
                {"name": "合计收入", "code": "totalIncome", "width": "100", "type": "diy"},
                {"name": "合计成本", "code": "totalCost", "width": "100", "type": "diy"},
                {"name": "仓库面积(㎡)", "code": "storehouseArea", "width": "100", "type": "text"},
                {"name": "仓储租赁成本", "code": "warehouseLeaseCost", "width": "100", "type": "diy"},
                {"name": "固定人员数", "code": "fixPersonCount", "width": "100", "type": "text"},
                {"name": "固定人员成本", "code": "fixPersonCost", "width": "100", "type": "diy"},
                {"name": "劳务固定人数", "code": "servicePersonCount", "width": "100", "type": "text"},
                {"name": "劳务固定成本", "code": "servicePersonCost", "width": "100", "type": "diy"},
                {"name": "劳务临时工时(小时)", "code": "temporaryServiceCount", "width": "150", "type": "text"},
                {"name": "劳务临时件数(件)", "code": "temporaryServiceTimes", "width": "150", "type": "text"},
                {"name": "劳务临时成本", "code": "temporaryServiceCost", "width": "100", "type": "diy"},
                {"name": "设备数量", "code": "equipmentCount", "width": "100", "type": "text"},
                {"name": "设备自购成本", "code": "equipmentBuyCost", "width": "100", "type": "diy"},
                {"name": "设备租赁成本", "code": "equipmentLeaseCost", "width": "100", "type": "diy"},
                {"name": "短驳配送车次", "code": "waybillTimes", "width": "100", "type": "text"},
                {"name": "短驳配送板数", "code": "waybillMaterialCount", "width": "100", "type": "text"},
                {"name": "短驳配送费", "code": "waybillCost", "width": "100", "type": "diy"},
                {"name": "器具数", "code": "deviceCount", "width": "100", "type": "text"},
                {"name": "器具成本", "code": "deviceCost", "width": "100", "type": "diy"},
                {"name": "打包数", "code": "packagingCount", "width": "100", "type": "text"},
                {"name": "打包成本", "code": "packagingCost", "width": "100", "type": "diy"},
                {"name": "上楼数", "code": "upstairsCount", "width": "100", "type": "text"},
                {"name": "上楼成本", "code": "upstairsCost", "width": "100", "type": "diy"},
                {"name": "回收数", "code": "recyclingCount", "width": "100", "type": "text"},
                {"name": "回收成本", "code": "recyclingCost", "width": "100", "type": "diy"},
                {"name": "耗材成本", "code": "consumableCost", "width": "100", "type": "diy"},
            ],
            query: this.initQuery(),
            storeHouseData: [],
        }
    },
    mounted()
    {
        this.initData();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        initQuery()
        {
            return this.query = {
                billMonth:'',
                workId:'',
            };
        },
        async initData()
        {
            this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            await this.$refs.table.load("wmsCostService", "queryWmsCostReportPage", this.query);
        },
        goto(data, code)
        {
            let item = {};
            let query = {workId: data.workId, billMonth: data.billMonth};
            let value = data[code];
            if (this.common.isBlank(value))
            {
                this.$message.error("没有金额不能跳转！");
                return false;
            }
            if (value == 0)
            {
                this.$message.error("金额为0不能跳转！");
                return false;
            }
            //sql.append("        i.BILL_MONTH        billMonth,");
            //         sql.append("        i.WORK_STORE_ID     workId,");
            if ('totalIncome' == code)
            {
                item.urlName = "仓储收入";
                item.urlId = 'wmsFeeIncomeManage';
                item.urlPathName = "/fc";
                item.urlPath = "/pt/fc/storehouse/wmsFeeIncomeManage.vue";
                query.startDate = data.billMonth;
                query.endDate = data.billMonth;
            }
            if ('totalCost' == code)
            {
                item.urlName = "仓储成本";
                item.urlId = 'storeHouseBillManage' + data.ids;
                item.urlPathName = "/fc";
                item.urlPath = "/pt/fc/storehouse/storeHouseBillManage.vue";
                query.ids = data.ids;
            }
            if ('warehouseLeaseCost' == code)
            {
                item.urlName = "仓储成本";
                item.urlId = 'storeHouseBillManage' + data.warehouseLeaseIds;
                item.urlPathName = "/res";
                item.urlPath = "/pt/fc/storehouse/storeHouseBillManage.vue";
                query.ids = data.warehouseLeaseIds;
            }
            if ('fixPersonCost' == code)
            {
                item.urlName = "固定人员成本";
                item.urlId = 'fixPersonCostManage' + data.fixPersonIds;
                item.urlPathName = "/wms";
                item.urlPath = "/pt/wms/fee/fixPersonCostManage.vue";
                query.ids = data.fixPersonIds;
            }
            if ('servicePersonCost' == code)
            {
                item.urlName = "劳务固定成本";
                item.urlId = 'personServiceCostManage' + data.servicePersonIds;
                item.urlPathName = "/wms";
                item.urlPath = "/pt/wms/fee/personServiceCostManage.vue";
                query.ids = data.servicePersonIds;
            }
            if ('temporaryServiceCost' == code)
            {
                item.urlName = "操作登记";
                item.urlId = 'feeOpManage' + data.temporaryServiceIds;
                item.urlPathName = "/fee";
                item.urlPath = "/pt/wms/fee/feeOpManage.vue";
                query.feeCostIds = data.temporaryServiceIds;
            }
            if ('equipmentBuyCost' == code)
            {
                item.urlName = "仓储设备资源";
                item.urlId = 'storeEquipmentManage' + data.equipmentBuyIds;
                item.urlPathName = "/res";
                item.urlPath = "/pt/res/equipment/storeEquipmentManage.vue";
                query.ids = data.equipmentBuyIds;
            }
            if ('equipmentLeaseCost' == code)
            {
                item.urlName = "仓储设备资源";
                item.urlId = 'storeEquipmentManage' + data.equipmentLeaseIds;
                item.urlPathName = "/res";
                item.urlPath = "/pt/res/equipment/storeEquipmentManage.vue";
                query.feeCostIds = data.equipmentLeaseIds;
            }
            if ('waybillCost' == code)
            {
                item.urlName = '短驳配送管理';
                item.urlId = 'wmsWaybillManage' + data.waybillIds;
                item.urlPathName = "/wms";
                item.urlPath = "/pt/wms/waybill/wmsWaybillManage.vue";
                query.ids = data.waybillIds;
            }
            if ('deviceCost' == code)
            {
                item.urlName = '费用明细';
                item.urlId = 'deviceFeeMain' + data.deviceCostIds;
                item.urlPathName = "/device";
                item.urlPath = "/pt/device/deviceFeeMain/deviceFeeMain.vue";
                query.ids = data.deviceCostIds;
                query.type = 1;
            }
            if ('packagingCost' == code)
            {
                item.urlName = "操作登记";
                item.urlId = 'feeOpManage' + data.packagingIds;
                item.urlPathName = "/fee";
                item.urlPath = "/pt/wms/fee/feeOpManage.vue";
                query.feeCostIds = data.packagingIds;
            }
            if ('upstairsCost' == code)
            {
                item.urlName = "操作登记";
                item.urlId = 'personServiceCostManage' + data.upstairsIds;
                item.urlPathName = "/fee";
                item.urlPath = "/pt/wms/fee/feeOpManage.vue";
                query.feeCostIds = data.upstairsIds;
            }
            if ('recyclingCost' == code)
            {
                item.urlName = "器具登记/操作明细";
                item.urlId = 'deviceRegisterRecordManage' + data.recyclingIds;
                item.urlPathName = "/fee";
                item.urlPath = "/pt/device/record/deviceRegisterRecordManage.vue";
                query.feeCostIds = data.recyclingIds;
            }
            if ('consumableCost' == code)
            {
                item.urlName = "仓储成本";
                item.urlId = 'storeHouseBillManage' + data.consumableIds;
                item.urlPathName = "/res";
                item.urlPath = "/pt/fc/storehouse/storeHouseBillManage.vue";
                query.ids = data.consumableIds;
            }
            item.query = query;
            this.$emit('openTab', item);
        },
    },
    computed:{
        formData(){
            return [
                {"name":"账单月份","model":"billMonth","type":"month","isshow":true},
                {"name":"仓库类型","model":"workId","type":"select","options":this.storeHouseData, "label":"workName","value":"workId","method":"doQuery","isshow":true},
            ]
        }
    },
}
