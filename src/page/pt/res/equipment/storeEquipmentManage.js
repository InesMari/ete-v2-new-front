import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'storeEquipmentManage',
    data()
    {
        return {
            head: [
                {"name": "仓库名称", "code": "workName", "width": "250", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "合同编号", "code": "contractNum", "width": "150", "type": "diy"},
                {"name": "使用起始日", "code": "beginUseDate", "width": "100", "type": "text"},
                {"name": "使用结束日", "code": "endUseDate", "width": "100", "type": "text"},
                {"name": "设备名称", "code": "equipmentName", "width": "150", "type": "text"},
                {"name": "设备类别", "code": "equipmentTypeName", "width": "150", "type": "text"},
                {"name": "设备类型", "code": "equipmentClassTypeName", "width": "150", "type": "text"},
                {"name": "设备序列号", "code": "equipmentNum", "width": "150", "type": "text"},
                {"name": "规格型号", "code": "model", "width": "150", "type": "text"},
                {"name": "存放地点", "code": "siteUse", "width": "150", "type": "text"},
                {"name": "数量", "code": "count", "width": "150", "type": "text"},
                {"name": "金额", "code": "totalFee", "width": "150", "type": "text"},
                {"name": "每月金额", "code": "monthFee", "width": "150", "type": "text"},
                {"name": "税点", "code": "tax", "width": "150", "type": "text"},
                {"name": "采购类型", "code": "equipmentPurchaseTypeName", "width": "150", "type": "text"},
                {"name": "租赁/折旧月份数", "code": "month", "width": "150", "type": "text"},
                {"name": "累计产生成本", "code": "sum", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(this.$route.query.feeCostIds, this.$route.query.ids),
            equipmentPurchaseTypeData: [],
            storeHouseData: [],
            supplierData: [],
            equipmentTypeData: [],
            equipmentClassTypeData: [],
            pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
        }
    },
    mounted()
    {
        this.doQuery();
        this.initStaticData();
    },
    components: {
        myImport,
        tableCommon,
    },
    methods: {
        initQuery(feeCostIds,ids)
        {
            return this.query = {
                feeCostIds:feeCostIds,
                ids:ids,
                workId: '',
                beginUseDate: '',
                equipmentName: '',
                equipmentPurchaseType: '',
                tenantId: '',
                equipmentNum: '',
                equipmentType: '',
            };
        },
        async initStaticData()
        {
            this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {regionFlag: 1});//仓库数据
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.equipmentPurchaseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "EQUIPMENT_PURCHASE_TYPE"});
            this.equipmentTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_EQUIPMENT_TYPE"});
            this.equipmentClassTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "EQUIPMENT_CLASS_TYPE"});
        },
        doQuery()
        {
            this.$refs.table.load("wmsEquipmentPurchaseService", "queryWmsEquipmentPurchasePage", this.query);
        },
        add()
        {
            this.gotoPage(1, null, "新增仓库设备资源");
        },
        update()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一条修改数据!");
                return;
            }
            this.gotoPage(2, selectData[0], "修改仓库设备资源");
        },
        gotoPage(type, data, urlName)
        {
            let id = this.common.isNotBlank(data) ? data.id : null;
            this.$emit("openTab",{
                urlId: 'storeEquipmentInfo' + (this.common.isNotBlank(id) ? id : new Date().getTime()),
                query: {type,id},
                urlName: urlName,
                urlPathName: "/res",
                urlPath: "/pt/res/equipment/storeEquipmentInfo.vue"});
        },
        open(item){
            let baseTitle = '';
            if(item.contractType==2){
                baseTitle = "供应商-运输";
            }else if(item.contractType==3){
                baseTitle = "供应商-仓储运作";
            }else if(item.contractType==4){
                baseTitle = "供应商-器具容器";
            }else if(item.contractType==5){
                baseTitle = "供应商-保险";
            }
            let title = "查看"+baseTitle+"合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:item.contractType,id:item.contractId},
            });
        },
        dblclickItem(data)
        {
            this.gotoPage(0, data, "仓库设备资源详情");
        },
        deleteEquipmentPurchase()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一条需要删除的数据!");
                return;
            }
            let data = selectData[0];
            let that = this;
            that.$confirm("确认需要删除？", "提示").then(() =>
            {
                that.common.postUrl("wmsEquipmentPurchaseService", "deleteEquipmentPurchase", data, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                }, null, '', true);
            }).catch(() =>
            {
            });
        },
    },
}
